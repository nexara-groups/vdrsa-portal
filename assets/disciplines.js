/* =====================================================================
   VDRSA — Disciplines page (REVISION_V14 §5, v10 animations).
   One section per discipline from V.disciplines. Each section's hero is
   its OWN looping SVG/CSS scene (speed oval, pirouette, goal, slalom,
   ollie, derby bump, alpine carve). Loops only play while the section is
   in view (.dx.is-on); reduced motion shows the static final pose.
   ===================================================================== */
(function(){
"use strict";
const V=window.VDRSA; const list=document.getElementById("dxList"); if(!V||!list)return;
const $=(s,r)=>(r||document).querySelector(s), $$=(s,r)=>[...(r||document).querySelectorAll(s)];
const root=document.documentElement;
const live=!V.reducedMotion();
root.classList.toggle("dx-static",!live);

const KITS=["speed","artistic","inline","rink","freestyle","board","derby","alpine"];
const id=d=>d.slug.toLowerCase().replace(/\s+/g,"-");
function lastWordSplit(name){
  const w=name.split(" "); if(w.length<2)return `<span class="accent-word">${V.esc(name)}</span>`;
  const last=w.pop(); return V.esc(w.join(" "))+` <span class="accent-word">${V.esc(last)}</span>`;
}
function count(slug){
  return V.data.events.filter(e=>e.discipline&&e.discipline.includes(slug)&&(e.status==="open"||e.status==="soon")).length;
}

/* ---------- scene helpers (all coordinates absolute in a 400x400 box) ---------- */
const f1=n=>(+n).toFixed(1);
const pts=a=>a.map(p=>f1(p[0])+","+f1(p[1])).join(" ");
const O=(x,y,extra)=>`style="transform-origin:${f1(x)}px ${f1(y)}px${extra?";"+extra:""}"`;
const star=(cx,cy,r,cls)=>{let p=[];for(let i=0;i<10;i++){const a=-Math.PI/2+i*Math.PI/5,rr=i%2?r*.45:r;p.push([cx+Math.cos(a)*rr,cy+Math.sin(a)*rr]);}return `<polygon class="${cls||""}" points="${pts(p)}" ${O(cx,cy)}/>`;};
const spark=(cx,cy,r,cls,dl)=>`<path class="sp ${cls||""}" d="M${cx} ${cy-r}Q${cx} ${cy} ${cx+r} ${cy}Q${cx} ${cy} ${cx} ${cy+r}Q${cx} ${cy} ${cx-r} ${cy}Q${cx} ${cy} ${cx} ${cy-r}Z" ${O(cx,cy,"animation-delay:"+(dl||0)+"s")}/>`;
const ground=(y)=>`<line class="gr" x1="16" y1="${y}" x2="384" y2="${y}"/>`;
const svg=(cls,inner)=>`<svg class="dx-scene ${cls}" viewBox="0 0 400 400" aria-hidden="true" focusable="false">${inner}</svg>`;
const net=(x0,x1,top,gy)=>{
  let m="";for(let x=x0+12;x<x1;x+=12)m+=`<line x1="${x}" y1="${top+4}" x2="${x}" y2="${gy}"/>`;
  for(let y=top+14;y<gy;y+=14)m+=`<line x1="${x0}" y1="${y}" x2="${x1}" y2="${y}"/>`;
  return `<g class="net"><g class="mesh">${m}</g><polyline class="post" points="${x0},${gy} ${x0},${top} ${x1},${top+8} ${x1},${gy}"/></g>`;
};
const speedLines=(x,y,n)=>Array.from({length:n},(_,i)=>`<line class="spl" x1="${x-i*6}" y1="${y+i*22}" x2="${x-i*6-46-(i%2)*24}" y2="${y+i*22}" style="animation-delay:${(i*.17).toFixed(2)}s"/>`).join("");

/* ---------- V15 avatar rig: filled FK figure drawn from kit data ---------- */
const OUT="#14150F";
const C={lime:["#D4DC4C","#A9B034"],pink:["#FF7AAE","#D6307A"],white:["#F1F2E8","#C9CABC"],ink:["#14150F","#2A2C20"],skin:["#C68B59","#9A643B"],hair:["#3B2A1E","#2A1D14"]};
const KIT={
speed:{j:"pink",a:"pink",t:"pink",s:"pink",b:"ink",h:"aero",hc:"white",f:"inline",x:"suit"},
artistic:{j:"pink",a:"skin",t:"skin",s:"skin",b:"white",h:"pony",hc:"hair",f:"quad",x:"skirt"},
inline:{j:"ink",a:"ink",t:"ink",s:"pink",b:"white",h:"cage",hc:"white",f:"inline",x:"num stick"},
rink:{j:"lime",a:"lime",t:"ink",s:"white",b:"ink",h:"cage",hc:"white",f:"quad",x:"knee curve stick"},
freestyle:{j:"white",a:"skin",t:"pink",s:"skin",b:"ink",h:"cap",hc:"pink",f:"inline",x:""},
board:{j:"pink",a:"pink",t:"white",s:"white",b:"lime",h:"beanie",hc:"lime",f:"shoe",x:""},
jl:{j:"pink",a:"skin",t:"ink",s:"pink",b:"ink",h:"star",hc:"ink",sc:"white",f:"quad",x:"knee"},
jr:{j:"white",a:"skin",t:"ink",s:"white",b:"ink",h:"star",hc:"pink",sc:"ink",f:"quad",x:""},
bk:{j:"ink",a:"skin",t:"ink",s:"white",b:"ink",h:"stripe",hc:"white",f:"quad",x:""},
alpine:{j:"lime",a:"lime",t:"ink",s:"ink",b:"white",h:"full",hc:"white",f:"inline",x:"leathers"}
};
function rig(kn,tone){
  const K=KIT[kn];
  const cl=(n,far)=>n==="ink"&&tone==="ink"?(far?"#26281D":"#3A3C2E"):C[n][far?1:0];
  const sh=n=>n==="ink"&&tone==="ink"?"#26281D":C[n][1];
  const seg=(len,w,n,far)=>`<line x1="0" y1="0" x2="0" y2="${len}" stroke="${OUT}" stroke-width="${w+5}" stroke-linecap="round"/><line x1="0" y1="0" x2="0" y2="${len}" stroke="${cl(n,far)}" stroke-width="${w}" stroke-linecap="round"/>`+(far?"":`<line x1="${f1(-w*.22)}" y1="1" x2="${f1(-w*.22)}" y2="${len-1}" stroke="${sh(n)}" stroke-width="${f1(w*.35)}" stroke-linecap="round"/>`);
  const so=` stroke="${OUT}" stroke-width="3" stroke-linejoin="round"`;
  const foot=far=>{
    const bc=cl(K.b,far), dk=far?C.ink[1]:OUT;
    if(K.f==="shoe")return `<path d="M-8-8Q-10 6-6 8H18Q20 2 12-2Z" fill="${bc}"${so}/><line x1="-7" y1="8" x2="18" y2="8" stroke="${far?C.white[1]:C.white[0]}" stroke-width="3" stroke-linecap="round"/>`;
    const boot=`<path d="M-9-12H6L14 4H-10Z" fill="${bc}"${so}/>`;
    const wh=(x,y,r)=>`<circle cx="${x}" cy="${y}" r="${r}" style="fill:var(--dxa)" stroke="${OUT}" stroke-width="2.5"/><circle cx="${x}" cy="${y}" r="2" fill="${OUT}"/>`;
    if(K.f==="inline")return boot+`<rect x="-14" y="4" width="34" height="5" rx="2" fill="${dk}"/>`+wh(-10,15,6.5)+wh(3,15,6.5)+wh(16,15,6.5);
    return boot+`<rect x="-13" y="4" width="32" height="5" rx="2" fill="${dk}"/>`+wh(-8,14,7.5)+wh(12,14,7.5)+`<circle cx="19" cy="8" r="3" fill="${cl("pink",far)}" stroke="${OUT}" stroke-width="2"/>`;
  };
  const leg=(sfx,far)=>`<g data-j="l${sfx}">${seg(46,20,K.t,far)}<g data-j="k${sfx}" transform="translate(0,46)">${seg(40,16,K.s,far)}${!far&&K.x.includes("knee")?`<circle r="9" fill="${C.pink[0]}"${so}/>`:""}<g data-j="f${sfx}" transform="translate(0,40)">${foot(far)}</g></g></g>`;
  const stick=curve=>{const bl=curve?"M0 92Q10 101 30 95":"M0 92H28";return `<g data-j="stk" transform="translate(0,30)"><line x1="0" y1="-10" x2="0" y2="92" stroke="${OUT}" stroke-width="10" stroke-linecap="round"/><line x1="0" y1="-10" x2="0" y2="92" stroke="${C.white[0]}" stroke-width="5" stroke-linecap="round"/><path d="${bl}" fill="none" stroke="${OUT}" stroke-width="11" stroke-linecap="round"/><path d="${bl}" fill="none" style="stroke:var(--dxa)" stroke-width="6" stroke-linecap="round"/></g>`;};
  const arm=(sfx,far)=>`<g data-j="tf"><g data-j="u${sfx}">${seg(32,13,K.j,far)}<g data-j="a${sfx}" transform="translate(0,32)">${seg(30,11,K.a,far)}<circle cx="0" cy="30" r="7" fill="${cl("skin",far)}"${so}/>${sfx==="A"&&K.x.includes("stick")?stick(K.x.includes("curve")):""}</g></g></g>`;
  const hc=cl(K.hc), dome=`<path d="M-18 0A18 18 0 0 1 18 0Z" fill="${hc}"${so}/>`;
  const sp=[];for(let i=0;i<10;i++){const a=-Math.PI/2+i*Math.PI/5,r=i%2?2.7:6;sp.push(f1(Math.cos(a)*r)+","+f1(-9+Math.sin(a)*r));}
  const gear={
    aero:dome+`<path d="M-14-8L-32-2L-12 2Z" fill="${hc}"${so}/>`,
    cage:dome+[8,13,18].map(x=>`<line x1="${x}" y1="-4" x2="${x}" y2="14" stroke="${OUT}" stroke-width="2" stroke-linecap="round"/>`).join(""),
    stripe:dome+`<path d="M-15-7Q0-17 15-7" fill="none" stroke="${C.lime[0]}" stroke-width="4"/>`,
    full:`<circle r="20" fill="${hc}"${so}/><rect x="4" y="-8" width="16" height="10" rx="4" fill="${C.lime[0]}"${so}/><path d="M8 17H18" stroke="${OUT}" stroke-width="3" stroke-linecap="round"/>`,
    star:dome+`<polygon points="${sp.join(" ")}" fill="${cl(K.sc||"white")}" stroke="${OUT}" stroke-width="1.5"/>`,
    pony:dome+`<g data-j="pt" transform="translate(-15,-12)"><path d="M0 0Q-16 8-24 26Q-8 18 2 6Z" fill="${hc}"${so}/></g>`,
    cap:dome+`<path d="M6-4H26" stroke="${OUT}" stroke-width="7" stroke-linecap="round"/><path d="M6-4H26" stroke="${hc}" stroke-width="4" stroke-linecap="round"/>`,
    beanie:dome+`<rect x="-18" y="-5" width="36" height="7" rx="3" fill="${C.white[0]}"${so}/><circle cy="-20" r="4" fill="${C.white[0]}"${so}/>`
  }[K.h];
  const head=`<g data-j="H" transform="translate(0,-60)"><line x1="0" y1="2" x2="0" y2="-10" stroke="${OUT}" stroke-width="15" stroke-linecap="round"/><line x1="0" y1="2" x2="0" y2="-10" stroke="${cl("skin")}" stroke-width="10" stroke-linecap="round"/><circle cx="2" cy="-20" r="17" fill="${cl("skin")}"${so}/><circle cx="8" cy="-17" r="3" fill="${C.pink[0]}" opacity=".45"/><circle cx="11" cy="-22" r="2.4" fill="${OUT}"/><g transform="translate(2,-20)">${gear}</g></g>`;
  const jers=`<path d="M-15 4L-17-40Q-17-60 0-60Q17-60 17-40L15 4Z" fill="${cl(K.j)}"${so}/><path d="M-15 4L-17-40Q-17-60 0-60V4Z" fill="${sh(K.j)}" opacity=".55"/>`;
  const lower=K.x==="skirt"?`<rect x="-17" y="-8" width="34" height="16" rx="6" fill="${cl(K.j)}"${so}/>`:`<rect x="-18" y="-10" width="36" height="20" rx="7" fill="${cl(K.t)}"${so}/>`;
  const deco=(K.x.includes("num")?`<text x="0" y="-22" text-anchor="middle" font-family="Archivo Black,Impact,sans-serif" font-weight="900" font-size="22" fill="${C.pink[0]}">9</text>`:"")+(K.x==="suit"?`<path d="M-16-26H16" stroke="${C.white[0]}" stroke-width="4"/>`:"")+(K.x==="leathers"?`<path d="M-16-26H16M-15-12H15" stroke="${C.white[0]}" stroke-width="4"/>`:"");
  const skirt=K.x==="skirt"?`<g data-j="tf"><g data-j="sk"><path d="M-16-8L-34 14Q0 24 34 14L16-8Z" fill="${C.pink[0]}"${so}/><path d="M-34 14Q0 24 34 14" fill="none" stroke="${C.lime[0]}" stroke-width="3"/></g></g>`:"";
  return `${arm("B",1)}${leg("B",1)}<g data-j="tf">${lower}${jers}${deco}${head}</g>${leg("A",0)}${skirt}${arm("A",0)}`;
}
const av=(kit,tone,i)=>`<g class="av" data-f="${i}"><g data-j="root">${rig(kit,tone)}</g></g>`;
const fig=(kit,tone,i,o)=>{o=o||{};return (o.sh?`<ellipse class="shd" data-sh="${i}" rx="44" ry="8"/>`:"")+(o.ghost?`<g class="av ghost" data-f="g${i}"><g data-j="root">${rig(kit,tone)}</g></g>`:"")+av(kit,tone,i);};

/* ---------- pose data + keyframe player ---------- */
const J="T H uA fA uB fB lA kA lB kB", HJ=J+" s";
const STRIDE=[[0,50,-40,-45,15,55,60,75,100,-15,15],[50,50,-40,55,60,-45,15,-15,15,75,100],[100,"="]];
const JSTR=[[0,40,-32,-40,20,50,60,65,90,-15,15],[50,40,-32,50,60,-40,20,-15,15,65,90],[100,"="]];
const PUCK=[[0,0,0],[3,0,1],[40,0,1],[52,120,1],[64,80,1],[90,80,1],[100,80,0]];
const HOCKEY=dT=>[[0,35,-28,35,35,50,45,35,55,-12,25,30],[28,40,-30,118,30,100,40,40,60,-10,25,-100],[40,45,-35,25,15,30,20,45,70,-15,25,25],[55,30,-25,120,0,100,10,30,45,-10,20,135],[72,"="],[100,"="]].map(k=>typeof k[1]==="string"||!dT?k:[k[0],k[1]+dT,...k.slice(2)]);
const TR=-5*Math.PI/180;
const SPD=(()=>{const k=[];for(let i=0;i<=32;i++){const a=2*Math.PI*i/32,ex=150*Math.sin(a),ey=52*Math.cos(a),c=Math.cos(a);k.push([i/32*100,200+ex*Math.cos(TR)-ey*Math.sin(TR),ex*Math.sin(TR)+ey*Math.cos(TR),.7+.1*(1+c),(c>=0?1:-1)*Math.max(.62,Math.abs(c)),-24*Math.sin(a)]);}return k;})();
const FX=[72,136,200,264,328], fp=x=>4+(x-20)/360*92;
const FTRAV=(()=>{const k=[];for(let x=20;x<=380;x+=8){const w=Math.cos(Math.PI*(x-72)/64);k.push([fp(x),x,-12*w,1-.05*w,7*Math.sin(Math.PI*(x-72)/64)]);}return k;})();
const FO=[32,-14,70,20,-20,30,22,62,18,58],FCA=[36,-16,40,30,75,15,34,70,-28,70],FCB=[36,-16,75,15,40,30,-28,70,34,70];
const FPOSE=(()=>{const k=[[0,...FO]];FX.forEach((x,i)=>{k.push([fp(x),...(i%2?FCB:FCA)]);k.push([fp(x+32),...FO]);});k.push([100,...FO]);return k;})();
const jc=n=>[[0,1,1],[28,1,1],[32,0,0],[88,0,0],[90+2*n,1.15,1],[93+2*n,1,1],[100,1,1]];
const SC={
speed:{G:236,still:0,figs:[{kit:"speed",x:0,dir:1,sh:1}],tracks:[{f:0,ch:J,dur:.9,k:STRIDE},{f:0,ch:"x g z sx r",dur:2.4,ease:"lin",k:SPD}]},
artistic:{G:338,still:22,figs:[{kit:"artistic",x:200,dir:1,sh:1}],tracks:[
  {f:0,ch:J,dur:8,k:[[0,10,-8,70,15,-40,10,12,15,-8,10],[14,72,-48,150,-10,-60,0,0,4,-110,-6],[30,"=14"],[34,80,-30,170,0,-10,0,0,5,-95,0],[54,"=34"],[58,-25,-40,175,25,160,30,0,0,35,85],[74,"=58"],[76,25,-10,60,40,-40,20,30,60,-10,50],[82,0,0,20,130,20,130,10,20,25,60],[87,25,-20,95,10,-70,0,10,30,-70,0],[92,"=0"],[100,"=0"]]},
  {f:0,ch:"sx",dur:8,k:[[0, 1], [34, 1], [35.5, 0.5], [37.0, 1], [38.5, 0.5], [40.0, 1], [41.5, 0.5], [43.0, 1], [44.5, 0.5], [46.0, 1], [47.5, 0.5], [49.0, 1], [50.5, 0.5], [52, 1], [58, 1], [59.0, 0.5], [60.0, 1], [61.0, 0.5], [62.0, 1], [63.0, 0.5], [64.0, 1], [65.0, 0.5], [66.0, 1], [67.0, 0.5], [68.0, 1], [69.0, 0.5], [70.0, 1], [71.0, 0.5], [72.0, 1], [73.0, 0.5], [74, 1], [81, 1], [81.75, 0.5], [82.5, 1], [83.25, 0.5], [84.0, 1], [84.75, 0.5], [85.5, 1], [86.25, 0.5], [87, 1], [100, 1]]},{f:0,ch:"kf",dur:8,k:[[0, 0], [34, 0], [35.5, 0.3], [37.0, 0], [38.5, 0.3], [40.0, 0], [41.5, 0.3], [43.0, 0], [44.5, 0.3], [46.0, 0], [47.5, 0.3], [49.0, 0], [50.5, 0.3], [52, 0], [58, 0], [59.0, 0.3], [60.0, 0], [61.0, 0.3], [62.0, 0], [63.0, 0.3], [64.0, 0], [65.0, 0.3], [66.0, 0], [67.0, 0.3], [68.0, 0], [69.0, 0.3], [70.0, 0], [71.0, 0.3], [72.0, 0], [73.0, 0.3], [74, 0], [81, 0], [81.75, 0.3], [82.5, 0], [83.25, 0.3], [84.0, 0], [84.75, 0.3], [85.5, 0], [86.25, 0.3], [87, 0], [100, 0]]},
  {f:0,ch:"dy sy",dur:8,k:[[0,0,1],[76,0,1],[78,0,.9],[79.5,8,1.08],[82,60,1.04],[84.5,8,1],[86,0,.88],[89,0,1],[100,0,1]]},
  {f:0,ch:"kf",dur:8,k:[[0,0],[30,0],[34,.45],[54,.45],[58,.7],[74,.7],[78,.1],[82,.5],[87,.1],[100,0]]},
  {f:0,ch:"p",dur:8,k:[[0,5],[14,15],[34,40],[56,40],[58,55],[74,55],[78,0],[82,-30],[87,20],[92,0],[100,5]]},
  {f:0,ch:"x",dur:8,k:[[0,-30],[14,0],[30,20],[34,20],[90,0],[100,-30]]},
  {ch:"arc.op",dur:8,k:[[0,0],[32,0],[36,.55],[54,.55],[57,0],[58,0],[60,.55],[74,.55],[76,0],[80,0],[82,.5],[88,0],[100,0]]},
  {ch:"j1.sy j1.op",dur:8,k:jc(0)},{ch:"j2.sy j2.op",dur:8,k:jc(1)},{ch:"j3.sy j3.op",dur:8,k:jc(2)}]},
inline:{G:334,still:55,figs:[{kit:"inline",x:0,dir:1}],tracks:[
  {f:0,ch:HJ,dur:3.2,k:HOCKEY(0)},{f:0,ch:"x",dur:3.2,k:[[0,96],[40,112],[100,96]]},{ch:"pk.x pk.op",dur:3.2,k:PUCK}]},
rink:{G:334,still:55,figs:[{kit:"rink",x:0,dir:1}],tracks:[
  {f:0,ch:HJ,dur:3.2,k:HOCKEY(8)},{f:0,ch:"x",dur:3.2,k:[[0,96],[40,112],[100,96]]},{ch:"bl.x bl.op",dur:3.2,k:PUCK},
  {ch:"bl.dy",dur:3.2,k:[[0,0],[40,0],[44,34],[48,0],[51,14],[54,0],[100,0]]}]},
freestyle:{G:336,still:50,figs:[{kit:"freestyle",x:0,dir:1,sh:1,lag:.12}],tracks:[
  {f:0,ch:J,dur:6,k:FPOSE},
  {f:0,ch:"x g z r",dur:6,ease:"lin",k:FTRAV},
  {f:0,ch:"op",dur:6,ease:"lin",k:[[0,0],[4,1],[96,1],[100,0]]}]},
board:{G:300,still:52,figs:[{kit:"board",x:60,dir:1}],tracks:[
  {ch:"sb.x sb.op",dur:3.4,ease:"lin",k:[[0,0,0],[5,15,1],[36,105,1],[53,150,1],[70,195,1],[92,270,1],[100,290,0]]},
  {ch:"sb.dy",dur:3.4,k:[[0,0],[36,0],[53,84],[70,0],[100,0]]},
  {ch:"bd.sy",dur:3.4,k:[[0,1],[38,1],[44,.06],[50,-1],[56,.06],[62,1],[100,1]]},
  {f:0,ch:J,dur:3.4,k:[[0,8,-6,70,25,-60,20,25,45,-25,40],[30,"="],[38,30,-25,40,60,-30,50,70,115,30,100],[52,15,-10,120,40,-110,30,95,135,60,125],[70,"=38"],[84,"="],[100,"="]]}]},
derby:{G:334,still:46,figs:[{kit:"jl",x:82,dir:1},{kit:"jr",x:318,dir:-1},{kit:"bk",x:200,dir:1}],tracks:[
  {f:0,ch:J,dur:.8,k:JSTR},{f:1,ch:J,dur:.8,k:JSTR},
  {f:0,ch:"x",dur:3,k:[[0,-14],[30,-14],[44,52],[60,-4],[100,-14]]},{f:1,ch:"x",dur:3,k:[[0,14],[30,14],[44,-30],[60,4],[100,14]]},
  {f:2,ch:J,dur:3,k:[[0,12,-10,75,70,70,75,30,55,-30,55],[100,"="]]},
  {f:2,ch:"r",dur:3,k:[[0,0],[40,0],[46,-4],[52,4],[60,-1],[70,0],[100,0]]},
  {ch:"burst.s burst.op",dur:3,k:[[0,0,0],[42,0,0],[46,1.15,1],[58,1,1],[68,1.3,0],[100,1.3,0]]}]},
alpine:{G:298,still:0,figs:[{kit:"alpine",x:190,dir:1,sh:1,lag:.1}],tracks:[
  {f:0,ch:J+" r g z",dur:3.2,k:[[0,42,-38,95,40,80,50,34,72,18,48,10,-6,1.22],[25,46,-40,90,45,85,45,28,62,26,60,18,0,1.25],[50,42,-38,95,40,80,50,18,48,34,72,24,6,1.28],[75,"=25"],[100,"=0"]]},
  {ch:"g1.x g1.dy",dur:3.2,ease:"lin",k:[[0,0,0],[100,-480,120]]},
  {ch:"g2.x g2.dy",dur:3.2,ease:"lin",k:[[0,-240,60],[50,-480,120],[50.01,0,0],[100,-240,60]]},
  {ch:"spr.s spr.op",dur:3.2,k:[[0,1,.9],[25,.2,0],[50,1,.9],[75,.2,0],[100,1,.9]]}]}
};
/* normalise keys: "=" / "=n" copy an earlier key's values */
Object.values(SC).forEach(S=>S.tracks.forEach(t=>{t.k=t.k.map(k=>typeof k[1]==="string"?[k[0],...t.k.find(q=>k[1]==="="?q===t.k[0]:q[0]==+k[1].slice(1)).slice(1)]:k);t.n=t.ch.split(" ");}));
const DEF={sx:1,op:1,s:1,sy:1,z:1};
const D2R=Math.PI/180;
function sample(t,pct){
  const k=t.k;if(k.length<2||pct<=k[0][0])return k[0].slice(1);
  let i=0;while(i<k.length-2&&pct>=k[i+1][0])i++;
  const a=k[i],b=k[i+1];let u=Math.min(1,Math.max(0,(pct-a[0])/(b[0]-a[0])));
  if(t.ease!=="lin")u=.5-.5*Math.cos(Math.PI*u);
  return a.slice(1).map((v,j)=>v+(b[j+1]-v)*u);
}
const n1=v=>(+v).toFixed(1), n3=v=>(+v).toFixed(3);
function vals(S,t,stat){
  const V={};
  S.tracks.forEach(q=>{
    const pct=stat?S.still:((((t/q.dur)%1)+1)%1)*100, a=sample(q,pct), pre=q.f!=null?q.f+":":"";
    q.n.forEach((c,j)=>{V[pre+c]=(V[pre+c]||0)+a[j];});
  });
  return V;
}
function put(M,F,i,V,mul,G){
  const g=(k,d)=>k in V?V[k]:d, v=c=>g(i+":"+c,DEF[c]||0), J=M.j, r=(c,a)=>{(J[c]||[]).forEach(e=>e.setAttribute("transform",a));};
  const T=v("T"), l={A:-v("lA"),B:-v("lB")}, k={A:v("kA"),B:v("kB")}, z=v("z");
  let h=0;
  ["A","B"].forEach(s=>{const a1=l[s]*D2R,a2=a1+k[s]*D2R;h=Math.max(h,46*Math.cos(a1)+40*Math.cos(a2));});
  h+=F.F;
  M.root.setAttribute("transform",`translate(${n1(F.x+v("x"))},${n1(G+v("g")-v("dy"))}) rotate(${n1(v("r"))}) scale(${n3(F.dir*z*(v("sx")<0?-1:1)*Math.max(.12,Math.abs(v("sx"))))},${n3(v("sy")*z)}) translate(0,${n1(-h)})`);
  M.el.style.opacity=v("op")*mul;
  r("tf",`rotate(${n1(T)})`);r("H",`translate(0,-60) rotate(${n1(v("H"))})`);
  r("sk",`scale(${n3(1+v("kf"))},${n3(1-v("kf")*.25)})`);r("pt",`translate(-15,-12) rotate(${n1(v("p"))})`);
  ["A","B"].forEach(s=>{
    r("u"+s,`translate(0,-54) rotate(${n1(-v("u"+s))})`);r("a"+s,`translate(0,32) rotate(${n1(-v("f"+s))})`);
    r("l"+s,`rotate(${n1(l[s])})`);r("k"+s,`translate(0,46) rotate(${n1(k[s])})`);r("f"+s,`translate(0,40) rotate(${n1(-l[s]-k[s])})`);
  });
  r("stk",`translate(0,30) rotate(${n1(-v("s")-(v("r")+T-v("uA")-v("fA")))})`);
  if(F.sh&&mul===1){const kk=1-Math.min(.6,v("dy")/160);F.sh.setAttribute("transform",`translate(${n1(F.x+v("x"))},${n1(G+v("g"))}) scale(${n3(z*kk)})`);F.sh.style.opacity=(.22*kk*v("op")).toFixed(3);}
}
function frame(S,stat){
  const V=vals(S,S.t,stat), g=(k,d)=>k in V?V[k]:d;
  S.V=V;
  S.figs.forEach((F,i)=>{
    if(F.gm)put(F.gm,F,i,stat?V:vals(S,S.t-F.lag),stat?0:.22,S.G);
    put(F.m,F,i,V,1,S.G);
  });
  for(const nm in S.props){
    const P=S.props[nm],q=c=>g(nm+"."+c,DEF[c]||0),o=P.o;
    P.el.setAttribute("transform",`translate(${n1(q("x"))},${n1(-q("dy"))}) translate(${o[0]},${o[1]}) rotate(${n1(q("r"))}) scale(${n3(q("s")*q("sx"))},${n3(q("s")*q("sy"))}) translate(${-o[0]},${-o[1]})`);
    if((nm+".op") in V)P.el.setAttribute("opacity",q("op").toFixed(2));
  }
  S.hook&&S.hook(S,stat);
}
const PLAY={on:[],start(){
  let last=0;
  const loop=ts=>{
    const dt=Math.min(.05,(ts-last)/1000||0);last=ts;
    PLAY.on.forEach(S=>{if(S.sec.classList.contains("is-on")){S.t+=dt;frame(S);}});
    requestAnimationFrame(loop);
  };requestAnimationFrame(loop);
}};
function bind(S,sec){
  const svgEl=$(".dx-scene",sec);S.sec=sec;S.t=0;
  const mk=el=>{const o={el,root:$('[data-j="root"]',el),j:{}};$$("[data-j]",el).forEach(e=>{if(e!==o.root)(o.j[e.dataset.j]=o.j[e.dataset.j]||[]).push(e);});return o;};
  S.figs.forEach((F,i)=>{F.F=KIT[F.kit].f==="shoe"?8:22;F.m=mk($(`.av[data-f="${i}"]`,svgEl));const ge=$(`.av[data-f="g${i}"]`,svgEl);F.gm=ge?mk(ge):null;F.sh=$(`[data-sh="${i}"]`,svgEl);});
  S.props={};$$("[data-p]",svgEl).forEach(e=>{S.props[e.dataset.p]={el:e,o:e.dataset.o.split(",").map(Number)};});
  S.svg=svgEl;
  frame(S,true);PLAY.on.push(S);
}

const SCENES={
speed(t){
  let chk="";for(let c=0;c<2;c++)for(let r=0;r<6;r++)chk+=`<rect x="${194+c*6}" y="${268+r*7}" width="6" height="7" fill="${(c+r)%2?"#F1F2E8":"#14150F"}"/>`;
  return svg("s-speed",`
  <g transform="rotate(-5 200 236)">
    <ellipse class="wall" cx="200" cy="222" rx="182" ry="74"/>
    <ellipse class="band" cx="200" cy="236" rx="182" ry="74"/>
    <ellipse class="lip" cx="200" cy="236" rx="170" ry="64" pathLength="100"/>
    <ellipse class="infield" cx="200" cy="236" rx="118" ry="32"/>
    <ellipse class="lane" cx="200" cy="236" rx="150" ry="52"/>
    ${chk}<rect class="fl" x="194" y="268" width="12" height="42"/>
  </g>
  <rect class="hud" x="146" y="0" width="108" height="76" rx="16"/><text class="lapl" x="200" y="15" text-anchor="middle">LAP</text><text class="lapn" x="200" y="49" text-anchor="middle">1/3</text>
  <circle class="pip" cx="180" cy="64" r="5"/><circle class="pip" cx="200" cy="64" r="5"/><circle class="pip" cx="220" cy="64" r="5"/>
  ${fig("speed",t,0,{sh:1})}`);
},
artistic(t){
  const card=(n,x,sc)=>`<g data-p="j${n}" data-o="${x+22},86"><rect class="jc" x="${x}" y="30" width="44" height="56" rx="8"/><text class="jt" x="${x+22}" y="62" text-anchor="middle">${sc}</text><text class="jl" x="${x+22}" y="78" text-anchor="middle">J${n}</text></g>`;
  return svg("s-artistic",`
  <polygon class="spot" points="176,0 224,0 330,346 70,346"/>
  <ellipse class="floor" cx="200" cy="346" rx="140" ry="22"/>
  ${spark(70,110,16,"s1",0)}${spark(340,230,13,"s3",.9)}${spark(58,250,9,"s4",1.3)}
  <g data-p="arc" data-o="200,260" opacity="0"><ellipse class="arc" cx="200" cy="285" rx="66" ry="15"/><ellipse class="arc a2" cx="200" cy="235" rx="52" ry="12"/></g>
  ${card(1,248,"9.6")}${card(2,298,"9.9")}${card(3,348,"9.8")}
  ${fig("artistic",t,0,{sh:1})}`);
},
inline(t){
  return svg("s-inline",`
  ${ground(334)}
  ${net(300,384,236,334)}
  <text class="goal" x="340" y="214" text-anchor="middle" ${O(340,214)}>GOAL!</text>
  ${av("inline",t,0)}
  <g data-p="pk" data-o="226,329" opacity="0"><ellipse cx="226" cy="329" rx="12" ry="6" style="fill:var(--sk-line)"/></g>`);
},
rink(t){
  return svg("s-rink",`
  <rect class="board" x="0" y="238" width="400" height="22" rx="4"/><line class="boardl" x1="0" y1="249" x2="400" y2="249"/>
  ${ground(334)}
  ${net(296,384,250,334)}
  <text class="goal" x="340" y="228" text-anchor="middle" ${O(340,228)}>GOAL!</text>
  ${av("rink",t,0)}
  <g data-p="bl" data-o="226,322" opacity="0"><circle class="ball" cx="226" cy="322" r="11"/><path class="ballc" d="M219 318q7 4 14 0M219 326q7-4 14 0"/></g>`);
},
freestyle(t){
  const cone=(x,c)=>`<g><polygon class="${c}" points="${x-14},336 ${x+14},336 ${x+5},290 ${x-5},290"/><rect class="cnb" x="${x-18}" y="333" width="36" height="5" rx="2"/><line class="cns" x1="${x-9}" y1="316" x2="${x+9}" y2="316"/></g>`;
  return svg("s-freestyle",`
  ${ground(336)}
  ${fig("freestyle",t,0,{sh:1,ghost:1})}
  <g class="cones">${FX.map((x,i)=>cone(x,i==2?"c2":"c1")).join("")}</g>`);
},
board(t){
  const wh=(cx)=>`<g class="wsp" ${O(cx,322)}><circle class="tire" cx="${cx}" cy="322" r="10"/><line class="spk" x1="${cx-8}" y1="322" x2="${cx+8}" y2="322"/><line class="spk" x1="${cx}" y1="314" x2="${cx}" y2="330"/></g>`;
  return svg("s-board",`
  ${ground(333)}
  <line class="rail" x1="186" y1="300" x2="256" y2="300"/><line class="railp" x1="196" y1="300" x2="196" y2="333"/><line class="railp" x1="246" y1="300" x2="246" y2="333"/>
  ${speedLines(30,260,3)}
  <g data-p="sb" data-o="0,0" opacity="0">
    <g data-p="bd" data-o="60,308"><path class="deck" d="M22 300Q26 308 36 308L84 308Q94 308 98 300"/><line class="dstripe" x1="34" y1="313" x2="86" y2="313"/>
      <rect class="trk2" x="34" y="312" width="12" height="6"/><rect class="trk2" x="74" y="312" width="12" height="6"/>
      ${wh(40)}${wh(80)}
    </g>
    ${av("board",t,0)}
  </g>`);
},
derby(t){
  const p=[];for(let i=0;i<16;i++){const a=i*Math.PI/8,r=i%2?18:40;p.push([200+Math.cos(a)*r,176+Math.sin(a)*r]);}
  return svg("s-derby",`
  <ellipse class="ovl" cx="200" cy="352" rx="190" ry="26"/>
  ${av("bk",t,2)}${av("jl",t,0)}${av("jr",t,1)}
  <g class="burst" data-p="burst" data-o="200,176" opacity="0"><polygon points="${pts(p)}"/></g>`);
},
alpine(t){
  const peaks=(a,c)=>a.map(p=>`<polygon class="cap" points="${p[0]},${p[1]} ${p[0]-c},${p[1]+c*1.3} ${p[0]-c*.35},${p[1]+c*.95} ${p[0]+c*.1},${p[1]+c*1.4} ${p[0]+c*.6},${p[1]+c*.9} ${p[0]+c},${p[1]+c*1.25}"/>`).join("");
  const far="0,210 60,130 110,175 170,95 240,185 300,115 360,170 400,150 400,260 0,260", near="0,250 80,190 150,230 220,170 300,235 360,200 400,225 400,300 0,300";
  const tile=(cls,pl,caps,c)=>`<g class="mtn ${cls}"><g><polygon points="${pl}"/>${peaks(caps,c)}</g><g transform="translate(400 0)"><polygon points="${pl}"/>${peaks(caps,c)}</g></g>`;
  const gate=(n,col)=>`<g data-p="g${n}" data-o="0,0"><line class="pole" x1="430" y1="357" x2="430" y2="287"/><path class="flag ${col}" d="M430 287L460 296L430 307Z"/></g>`;
  return svg("s-alpine",`
  <defs><clipPath id="alpClip"><rect x="0" y="0" width="400" height="400"/></clipPath></defs>
  <g clip-path="url(#alpClip)">
    ${tile("far",far,[[60,130],[170,95],[300,115]],20)}${tile("near",near,[[220,170],[80,190],[360,200]],16)}
    <polygon class="snowc" points="0,250 400,350 400,400 0,400"/><polygon class="snow" points="0,250 400,350 400,400 0,400"/><line class="edge" x1="0" y1="250" x2="400" y2="350"/>
    <g transform="rotate(14 200 200)">${speedLines(380,120,5)}</g>
    ${gate(1,"a")}${gate(2,"b")}
  </g>
  ${fig("alpine",t,0,{sh:1,ghost:1})}
  <g data-p="spr" data-o="196,298"><polygon class="spf" points="196,298 150,268 138,284 144,300"/><circle class="spd" cx="132" cy="276" r="5"/><circle class="spd" cx="122" cy="292" r="4"/><circle class="spd" cx="140" cy="262" r="3.5"/></g>`);
}
};

SC.speed.hook=(S,stat)=>{
  const q=S.q=S.q||{n:$(".lapn",S.svg),fl:$(".fl",S.svg),pips:$$(".pip",S.svg)};
  const lap=stat?2:Math.floor(S.t/2.4)%3, k=stat?0:Math.max(0,1-(S.t%2.4)/.35);
  if(S.lap!==lap){S.lap=lap;q.n.textContent=(lap+1)+"/3";q.pips.forEach((e,i)=>e.classList.toggle("on",i<=lap));}
  q.fl.setAttribute("opacity",k.toFixed(2));
  q.n.setAttribute("transform",`translate(200,40) scale(${(1+.3*k).toFixed(3)}) translate(-200,-40)`);
};
SC.freestyle.hook=(S,stat)=>{
  const q=S.q=S.q||{c:$(".cones",S.svg),f:$('.av[data-f="0"]',S.svg),sh:S.figs[0].sh};
  const front=(S.V["0:g"]||0)<0;
  if(S.front!==front){S.front=front;if(front)q.f.after(q.c);else q.sh.before(q.c);}
};

list.innerHTML=V.disciplines.map((d,i)=>{
  const n=String(i+1).padStart(2,"0"), sid=id(d), tone=i%2===0?"lime":"ink", kit=KITS[i];
  const n_ev=count(d.slug), q=encodeURIComponent(d.slug);
  return `<section class="dx" id="${sid}" aria-labelledby="${sid}-h" data-tone="${tone}" data-kit="${kit}">
  <div class="wrap dx-grid">
    <div class="dx-text">
      <span class="kicker" data-index="${n}">RSFI discipline</span>
      <h2 class="dx-name" id="${sid}-h">${lastWordSplit(d.name)}</h2>
      <p class="dx-sub">${V.esc(d.subtitle)}</p>
      <p class="dx-desc">${V.esc(d.desc)}</p>
      <dl class="dx-facts">
        <div><dt>Highlights</dt><dd>${V.esc(d.highlights)}</dd></div>
        <div><dt>Categories</dt><dd>${V.esc(d.categories)}</dd></div>
        <div><dt>Upcoming events</dt><dd>${n_ev}</dd></div>
      </dl>
      <div class="st-cta"><a class="btn btn-primary" href="events.html?d=${q}">Events</a><a class="link" href="clubs.html">Clubs &rarr;</a></div>
    </div>
    <div class="dx-art" aria-hidden="true">${V.blob(17+i*41)}<span class="dx-kit">${SCENES[kit](tone)}</span></div>
    <figure class="dx-photo c-card"><img src="${V.photo(d.key,900)}" srcset="${V.photo(d.key,600)} 600w, ${V.photo(d.key,900)} 900w" sizes="(max-width:899px) 90vw, 30vw" alt="${V.esc(d.name)}" loading="lazy" decoding="async"><figcaption class="cap">Fig. ${n} &mdash; ${V.esc(d.name)}</figcaption></figure>
  </div>
</section>`;
}).join("");

$("#dxIndex").innerHTML=V.disciplines.map((d,i)=>`<a href="#${id(d)}">${String(i+1).padStart(2,"0")} ${V.esc(d.slug)}</a>`).join("");

/* play loops only while a section is on screen */
$$(".dx",list).forEach((s,i)=>bind(SC[KITS[i]],s));
if(live){
  PLAY.start();
  const io=new IntersectionObserver(es=>es.forEach(e=>e.target.classList.toggle("is-on",e.isIntersecting)),{threshold:.15});
  $$(".dx",list).forEach(s=>io.observe(s));
}
})();
