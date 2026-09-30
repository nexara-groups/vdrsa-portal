/* =====================================================================
   VDRSA — Home "travelling skate" scroll story (REVISION_V11 §3).
   One fixed .skate-rig (inline speed skate) travels through the first five
   sections and lands in the empty slot of the line-up:
     A hero  → B level, centre-right → C nose-up, giant word behind →
     D splats pop around it → E shrinks + docks into the slot, then scrolls
     away with the page (the rig is re-parented into the slot).
   Poses come from measured marker rects (never hard-coded pixels), the
   landing target is the slot's LIVE rect, wheels turn 1 revolution / 300px.
   Phones/tablets (<900px, REVISION_V13) reuse the same rig: it follows marker
   boxes reserved in the normal flow (hero, B, SPEED word, splat gap, slot),
   moves between their cached document offsets and docks into the slot.
   Reduced motion and missing GSAP get the static per-section skates
   instead (html.story-static).
   ===================================================================== */
(function(){
"use strict";
const V=window.VDRSA; if(!V||!document.getElementById("heroPoster"))return;
const $=(s,r)=>(r||document).querySelector(s), $$=(s,r)=>[...(r||document).querySelectorAll(s)];
const root=document.documentElement;
const clamp=(v,a,b)=>Math.min(b,Math.max(a,v));
const lerp=(a,b,t)=>a+(b-a)*t;
const smooth=t=>{t=clamp(t,0,1);return t*t*t*(t*(t*6-15)+10);};
const mqDesk=matchMedia("(min-width:900px)");
const reduced=V.reducedMotion();
const RIG_W=560, RIG_H=RIG_W*250/380;

/* ---------- art ---------- */
$$(".sk-static").forEach(el=>{el.innerHTML=V.skateSVG();el.style.setProperty("--r",(el.dataset.rot||0)+"deg");});
$$("[data-kit]").forEach(el=>{el.innerHTML=V.kitSVG(el.dataset.kit);});

/* ---------- ink-splat blobs (deterministic, irregular, with droplets) ---------- */
function rng(seed){let s=seed%2147483647;if(s<=0)s+=2147483646;return()=>((s=s*16807%2147483647)-1)/2147483646;}
function blob(seed){
  const r=rng(seed),n=15,pts=[];
  for(let i=0;i<n;i++){
    const a=i/n*Math.PI*2+ (r()-.5)*.12;
    const spike=r()<.34;
    const rad=spike?(.93+r()*.15):(.66+r()*.24);
    pts.push([50+Math.cos(a)*rad*46,50+Math.sin(a)*rad*46]);
  }
  let d="M"+pts[0].map(v=>v.toFixed(1)).join(",");
  for(let i=0;i<n;i++){
    const p0=pts[(i-1+n)%n],p1=pts[i],p2=pts[(i+1)%n],p3=pts[(i+2)%n];
    const c1=[p1[0]+(p2[0]-p0[0])/6,p1[1]+(p2[1]-p0[1])/6],c2=[p2[0]-(p3[0]-p1[0])/6,p2[1]-(p3[1]-p1[1])/6];
    d+=`C${c1[0].toFixed(1)},${c1[1].toFixed(1)} ${c2[0].toFixed(1)},${c2[1].toFixed(1)} ${p2[0].toFixed(1)},${p2[1].toFixed(1)}`;
  }
  let drops="";
  for(let k=0;k<4;k++){const a=r()*Math.PI*2,rad=50+r()*8,s=1.6+r()*3.2;drops+=`<circle class="dr" cx="${(50+Math.cos(a)*rad).toFixed(1)}" cy="${(50+Math.sin(a)*rad).toFixed(1)}" r="${s.toFixed(1)}"/>`;}
  return `<svg class="blob" viewBox="-8 -8 116 116" aria-hidden="true" focusable="false"><path class="b" d="${d}Z"/>${drops}</svg>`;
}
$$(".splat").forEach((li,i)=>li.insertAdjacentHTML("afterbegin",blob(17+i*41)));

/* ---------- mode ---------- */
let live=false, mob=false;
function decide(){
  live=!reduced&&!!window.gsap;
  mob=live&&!mqDesk.matches;
  root.classList.toggle("story-live",live);
  root.classList.toggle("story-mob",mob);
  root.classList.toggle("story-static",!live);
}
decide();

/* ---------- the rig ---------- */
const rig=document.createElement("div");
rig.className="skate-rig";
rig.innerHTML='<i class="sk-speed"></i><i class="sk-speed"></i><i class="sk-speed"></i>'+V.skateSVG();
document.body.appendChild(rig);
const wheels=$$(".sk-wheel",rig).map(g=>({g,cx:+g.dataset.cx,cy:+g.dataset.cy}));
const speeds=$$(".sk-speed",rig);
function setWheels(a){wheels.forEach(w=>w.g.setAttribute("transform",`rotate(${a.toFixed(1)} ${w.cx} ${w.cy})`));}
const slot=$("#slotSkate");
let docked=false;
function dock(){ if(docked)return; docked=true; slot.appendChild(rig); rig.classList.add("docked"); rig.style.transform=""; }
function undock(){ if(!docked)return; docked=false; document.body.appendChild(rig); rig.classList.remove("docked"); }

/* ---------- measurement → keyframes ---------- */
let K=null, M=null, vh=0, vw=0, cur=scrollY, T=0, lastW=innerWidth;
const intro={y:0,spin:0};
function rectOf(el){const r=el.getBoundingClientRect();return{x:r.left+r.width/2,y:r.top+scrollY+r.height/2,w:r.width,h:r.height,top:r.top+scrollY};}
/* phones/tablets: poses are document-space marker rects, measured once per width change */
function buildMob(){
  K=null;
  vh=innerHeight;vw=innerWidth;lastW=vw;
  const mk=(el,rot,sp,wob)=>{const r=rectOf(el);return{x:r.x,y:r.y,w:r.w,rot,sp,wob};};
  const M0=[mk($("#mkA"),-14,0,0),mk($("#mkB"),0,0,0),mk($("#mkCm"),6,1,0),mk($("#mkDg"),0,0,1),mk(slot,0,0,0)];
  M0.forEach((m,i)=>{m.L=m.y-vh*(i===4?.6:.5);if(i)m.L=Math.max(m.L,M0[i-1].L+40);});
  M=M0;
}
function build(){
  if(!live){K=null;M=null;return;}
  if(mob){buildMob();return;}
  M=null;
  vh=innerHeight;vw=innerWidth;
  const B=rectOf($("#stB")),C=rectOf($("#stC")),D=rectOf($("#mkD")),
        mA=rectOf($("#mkA")),mB=rectOf($("#mkB")),mC=rectOf($("#mkC")),sl=rectOf(slot);
  const cap=w=>Math.min(w,vh*.44*380/250);
  const cy=vh*.5;
  const pA={cx:mA.x,cy:mA.y,w:cap(Math.min(vw*.31,480)),rot:-16,sp:0,wob:0};
  const pB={cx:mB.x,cy,w:cap(Math.min(mB.w,vw*.32,470)),rot:0,sp:0,wob:0};
  const pC={cx:mC.x,cy,w:cap(Math.min(mC.w*1.02,vw*.34,470)),rot:6,sp:1,wob:0};
  const pD={cx:D.x,cy,w:cap(Math.min(vw*.3,440)),rot:0,sp:0,wob:1};
  const sB1=Math.max(B.top-.12*vh,vh*.35), sB2=sB1+.22*vh;
  const cEnd=C.top+C.h;
  const sC1=Math.max(C.top-.12*vh,sB2+.2*vh), sC2=Math.max(cEnd-.9*vh,sC1+.25*vh);
  const fillD=D.y-vh/2;
  const sD1=Math.max(fillD-.32*vh,sC2+.15*vh), sD2=Math.max(fillD+.22*vh,sD1+.25*vh);
  const sL1=Math.max(sl.y-.64*vh,sD2+.45*vh);
  K={frames:[[0,pA],[sB1,pB],[sB2,pB],[sC1,pC],[sC2,pC],[sD1,pD],[sD2,pD]],sL0:sD2,sL1,pD};
}
function poseAt(s){
  const f=K.frames;
  if(s<=f[0][0])return f[0][1];
  for(let i=0;i<f.length-1;i++){
    const a=f[i],b=f[i+1];
    if(s<=b[0]){
      const t=smooth((s-a[0])/(b[0]-a[0]||1));
      const p={};for(const k in a[1])p[k]=lerp(a[1][k],b[1][k],t);
      return p;
    }
  }
  return f[f.length-1][1];
}

function poseMob(s){
  const n=M.length;
  if(s<=M[0].L)return Object.assign({},M[0]);
  for(let i=0;i<n-1;i++){
    const a=M[i],b=M[i+1];
    if(s<=b.L){
      const span=b.L-a.L,h=span*.18;
      const t=smooth((s-a.L-h)/(span-2*h||1));
      return{x:lerp(a.x,b.x,t),y:lerp(a.y,b.y,t),w:lerp(a.w,b.w,t),rot:lerp(a.rot,b.rot,t),sp:lerp(a.sp,b.sp,t),wob:lerp(a.wob,b.wob,t)};
    }
  }
  return Object.assign({},M[n-1]);
}

/* ---------- per-frame render ---------- */
function renderMob(dt,tt){
  const sc=scrollY;
  cur+=(sc-cur)*(1-Math.exp(-dt*13)); if(Math.abs(sc-cur)<.05)cur=sc;
  const s=cur;
  if(s>=M[M.length-1].L){dock();return;}
  undock();
  const p=poseMob(s);
  const heroW=1-smooth(s/(vh*.28));
  const cy=p.y-sc+Math.sin(tt*1.05)*6*heroW+intro.y+Math.sin(tt*1.6)*4*p.wob;
  const rot=p.rot+Math.sin(s*.018+tt*1.3)*2.6*p.wob;
  setWheels(s*1.2+intro.spin);
  rig.style.transform=`translate3d(${(p.x-RIG_W/2).toFixed(1)}px,${(cy-RIG_H/2).toFixed(1)}px,0) rotate(${rot.toFixed(2)}deg) scale(${(p.w/RIG_W).toFixed(4)})`;
  const sp=clamp(p.sp,0,1);
  speeds.forEach((el,i)=>{el.style.opacity=(sp*.9).toFixed(2);el.style.transform=`translateX(${(-(1-sp)*30-Math.sin(tt*9+i*2)*4*sp).toFixed(1)}px) scaleX(${(.35+.65*sp).toFixed(2)})`;});
}
function render(dt,tt){
  if(!live)return;
  if(mob){if(M)renderMob(dt,tt);return;}
  if(!K)return;
  const sc=scrollY;
  cur+=(sc-cur)*(1-Math.exp(-dt*13)); if(Math.abs(sc-cur)<.05)cur=sc;
  const s=cur;
  const p=Object.assign({},poseAt(s));
  const {sL0,sL1}=K;
  let q=clamp((s-sL0)/(sL1-sL0),0,1);
  let wheel;
  if(s<=sL0)wheel=s*1.2;
  else wheel=sL0*1.2+(sL1-sL0)*1.2*(q-q*q/2);
  if(q>0){
    const e=smooth(q);
    const r=slot.getBoundingClientRect();
    p.cx=lerp(p.cx,r.left+r.width/2,e);
    p.cy=lerp(p.cy,r.top+r.height/2,e);
    p.w=lerp(p.w,r.width,e);
    p.rot=lerp(p.rot,0,e);
    p.sp=p.sp*(1-e);
    p.wob=p.wob*(1-e);
    if(q>=1){dock();return;}
  }
  undock();
  /* idle float on the hero, drop-in intro, D wobble */
  const heroW=1-smooth(s/(vh*.28));
  p.cy+=Math.sin(tt*1.05)*6*heroW+intro.y;
  p.rot+=Math.sin(s*.018+tt*1.3)*2.6*p.wob;
  p.cy+=Math.sin(tt*1.6)*4*p.wob;
  setWheels(wheel+intro.spin);
  const sc2=p.w/RIG_W;
  rig.style.transform=`translate3d(${(p.cx-RIG_W/2).toFixed(1)}px,${(p.cy-RIG_H/2).toFixed(1)}px,0) rotate(${p.rot.toFixed(2)}deg) scale(${sc2.toFixed(4)})`;
  const sp=clamp(p.sp,0,1);
  speeds.forEach((el,i)=>{el.style.opacity=(sp*.9).toFixed(2);el.style.transform=`translateX(${(-(1-sp)*30-Math.sin(tt*9+i*2)*4*sp).toFixed(1)}px) scaleX(${(.35+.65*sp).toFixed(2)})`;});
}
let last=performance.now();
function tick(){
  const now=performance.now(),dt=Math.min(.1,(now-last)/1000);last=now;T+=dt;
  render(dt,T);
}

/* ---------- reveals: splats pop, line-up rises, cards ---------- */
let sts=[];
function setupReveals(){
  sts.forEach(t=>t.kill());sts=[];
  if(!live||!window.ScrollTrigger)return;
  const splats=$$(".splat");
  gsap.set(splats,{scale:0,rotation:-10,transformOrigin:"50% 50%"});
  const pop=()=>gsap.to(splats,{scale:1,rotation:0,duration:.95,ease:"back.out(2.4)",stagger:.13,overwrite:"auto"});
  const hide=()=>gsap.to(splats,{scale:0,rotation:-10,duration:.3,ease:"power2.in",stagger:.03,overwrite:"auto"});
  sts.push(ScrollTrigger.create({trigger:"#mkD",start:"top 58%",end:"bottom 28%",onEnter:pop,onEnterBack:pop,onLeave:hide,onLeaveBack:hide}));
  const items=$$("#lineup .lu:not(.lu-skate)");
  gsap.set(items,{y:70,opacity:0});
  const up=()=>gsap.to(items,{y:0,opacity:1,duration:.8,ease:"power3.out",stagger:.1,overwrite:"auto"});
  const dn=()=>gsap.to(items,{y:70,opacity:0,duration:.3,overwrite:"auto"});
  sts.push(ScrollTrigger.create({trigger:"#lineup",start:"top 82%",onEnter:up,onEnterBack:up,onLeaveBack:dn}));
  const card=$(".c-card");
  if(card){gsap.set(card,{y:60,opacity:0,rotation:-2});sts.push(ScrollTrigger.create({trigger:card,start:"top 88%",onEnter:()=>gsap.to(card,{y:0,opacity:1,duration:.9,ease:"back.out(1.5)"})}));}
  const fp=$(".f-photo");
  if(fp){gsap.set(fp,{y:60,opacity:0,rotation:-1.5});sts.push(ScrollTrigger.create({trigger:fp,start:"top 88%",onEnter:()=>gsap.to(fp,{y:0,opacity:1,duration:.9,ease:"back.out(1.5)"})}));}
}
function resetReveals(){
  if(!window.gsap)return;
  gsap.set([".splat","#lineup .lu",".c-card",".f-photo"],{clearProps:"all"});
}

/* ---------- static mode: wheels spin once when a skate scrolls into view ---------- */
function staticSpin(){
  if(live||reduced||!window.gsap||!("IntersectionObserver" in window))return;
  const io=new IntersectionObserver(es=>es.forEach(en=>{
    if(!en.isIntersecting)return; io.unobserve(en.target);
    const ws=$$(".sk-wheel",en.target).map(g=>({g,cx:+g.dataset.cx,cy:+g.dataset.cy}));
    const o={a:0};
    gsap.to(o,{a:360,duration:1.1,ease:"power2.out",onUpdate:()=>ws.forEach(w=>w.g.setAttribute("transform",`rotate(${o.a} ${w.cx} ${w.cy})`))});
  }),{threshold:.4});
  $$(".sk-static").forEach(el=>io.observe(el));
}

/* ---------- boot / refresh / resize ---------- */
function refresh(){
  build();
  if(window.ScrollTrigger)ScrollTrigger.refresh();
}
let wasLive=live;
function full(){
  decide();
  if(live!==wasLive){
    if(!live){undock();resetReveals();sts.forEach(t=>t.kill());sts=[];}
    else setupReveals();
    wasLive=live;
  }
  build();
}
if(window.gsap)gsap.ticker.add(tick);
if(live){
  setupReveals();
  build();
  if(scrollY<40){
    intro.y=-innerHeight*.95;intro.spin=2400;
    gsap.to(intro,{y:0,duration:1.5,delay:.55,ease:"bounce.out"});
    gsap.to(intro,{spin:0,duration:2.4,delay:.55,ease:"power3.out"});
  }
}else staticSpin();
addEventListener("load",()=>setTimeout(refresh,150));
if(document.fonts&&document.fonts.ready)document.fonts.ready.then(()=>setTimeout(refresh,60));
$$("img").forEach(im=>{if(!im.complete)im.addEventListener("load",()=>{build();},{once:true});});
let rt=null;
/* phones: height-only resizes (URL bar show/hide) are ignored; width change / rotation re-measures */
addEventListener("resize",()=>{clearTimeout(rt);rt=setTimeout(()=>{if(mob&&live&&innerWidth===lastW)return;full();if(window.ScrollTrigger)ScrollTrigger.refresh();},160);});
addEventListener("orientationchange",()=>{clearTimeout(rt);rt=setTimeout(()=>{full();if(window.ScrollTrigger)ScrollTrigger.refresh();},300);});
{const _f=()=>{full();};if(mqDesk.addEventListener)mqDesk.addEventListener("change",_f);else if(mqDesk.addListener)mqDesk.addListener(_f);}
V.story={refresh,rebuild:build,get keys(){return K;},get mob(){return mob;},get marks(){return M;},get live(){return live;}};
})();
