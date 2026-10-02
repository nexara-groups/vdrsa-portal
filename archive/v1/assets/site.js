/* =====================================================================
   VDRSA — shared site script (header, footer, data, behaviours)
   Exposes window.VDRSA. Fictional sample data only. No dependencies
   beyond Lucide (loaded by each page) and the tokens in site.css.
   ===================================================================== */
(function(){
"use strict";

const $=(s,sc)=>(sc||document).querySelector(s);
const $$=(s,sc)=>[...(sc||document).querySelectorAll(s)];
const esc=s=>String(s==null?"":s).replace(/[&<>"]/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[m]));
const icons=()=>window.lucide&&lucide.createIcons();
const param=k=>new URLSearchParams(location.search).get(k);

/* ---------------------------------------------------------------------
   PHOTOGRAPHY — Pexels (free licence), true colour, no overlays.
   VDRSA.photo(key,w) is the preferred helper (spec MOTION_SPEC.md §2).
   VDRSA.img(id,w) is kept for back-compat: it still builds an Unsplash
   URL for legacy ids, but resolves through photo() when `id` is one of
   the new photo keys, so existing pages that already call V.img(x.img,w)
   keep working even after data-set img fields are switched to keys.
   --------------------------------------------------------------------- */
const PHOTOS={
  race:4584509, athlete:12912641, coach:30933662, slalom:35772593,
  pack:5051381, competitor:13673048, trio:4584506, girl:36513904,
  kid:17995165, boy:16767210, skatepark:5765018, stunt:10871492,
  skateboard:32769451, quad:34402745, group:36678658, lowangle:14746592,
  boardwalk:8733150, gear:19775530,
  // Revision v4 — one strong photo per discipline
  artistic:38562759, artisticshow:19571567, artisticrink:35130313,
  hockey:30756235, hockeynight:30756244, rinkhockey:9708234,
  skatetrick:2006010, skateair:9703712, skateramp:2118483,
  derby:1280575, derbyteam:15376038, downhill:10884818, downhillsolo:19493777,
  ramp:17121572
};
/* mobile-first image sizing: phones never download the 1400-1920px desktop rendition */
function mq(q){ try{ return window.matchMedia(q) }catch(e){ return null } }
function mqOn(q){ const m=mq(q); return !!(m&&m.matches) }
/* matchMedia change subscription with the old-Safari addListener fallback */
function mqListen(m,fn){ if(!m)return; if(m.addEventListener)m.addEventListener("change",fn); else if(m.addListener)m.addListener(fn); }
function fitW(w){
  w=w||800;
  const vw=Math.min(window.innerWidth||1024, (window.screen&&window.screen.width)||9999);
  if(vw<=640)return Math.min(w,800);
  if(vw<=1024)return Math.min(w,1200);
  return w;
}
function photo(key,w){
  w=fitW(w);
  const id=PHOTOS[key];
  if(!id)return img(key,w); // not a known key — treat as a legacy Unsplash id
  return `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${w||800}`;
}
function img(id,w){
  if(PHOTOS[id])return photo(id,w);
  w=fitW(w||600);
  return `https://images.unsplash.com/photo-${id}?w=${w||600}&q=70`;
}

/* ---------------------------------------------------------------------
   DATA — all fictional
   --------------------------------------------------------------------- */
const events=[
  {id:"dist-champ-2026",title:"VDRSA District Championship 2026",discipline:["Speed","Artistic","Inline Hockey","Freestyle"],start:"2026-10-26",end:"2026-10-27",venue:"Port Stadium Rink",area:"Port Area",status:"open",fee:"₹300 – ₹600",closes:"2026-10-18",img:"race",categories:["U-10","U-12","U-14","U-17","Senior"]},
  {id:"artistic-cup",title:"Inter-Club Artistic Cup",discipline:["Artistic"],start:"2026-11-09",end:"2026-11-09",venue:"GVMC Indoor Stadium",area:"MVP Colony",status:"open",fee:"₹250",closes:"2026-11-02",img:"artistic",categories:["Solo Free","Pairs"]},
  {id:"hockey-league-r1",title:"Inline Hockey League — Round 1",discipline:["Inline Hockey"],start:"2026-11-16",end:"2026-11-16",venue:"Andhra University Rink",area:"Andhra University",status:"soon",fee:"₹500 per team",closes:"2026-11-09",img:"hockey",categories:["U-14","U-17"]},
  {id:"rink-hockey-cup",title:"Rink Hockey Cup",discipline:["Rink Hockey"],start:"2026-11-21",end:"2026-11-22",venue:"GVMC Indoor Stadium",area:"MVP Colony",status:"soon",fee:"₹500 per team",closes:"2026-11-14",img:"rinkhockey",categories:["U-17","Senior"]},
  {id:"beach-road-sprint",title:"Beach Road Speed Sprint",discipline:["Speed"],start:"2026-11-23",end:"2026-11-23",venue:"RK Beach Road",area:"RK Beach",status:"soon",fee:"₹200",closes:"2026-11-16",img:"pack",categories:["200 m","500 m"]},
  {id:"freestyle-open",title:"Freestyle Slalom Open",discipline:["Freestyle"],start:"2026-12-07",end:"2026-12-07",venue:"Port Stadium Rink",area:"Port Area",status:"soon",fee:"₹250",closes:"2026-11-30",img:"slalom",categories:["Classic Slalom","Speed Slalom"]},
  {id:"derby-exhibition",title:"Roller Derby Exhibition",discipline:["Roller Derby"],start:"2026-12-06",end:"2026-12-06",venue:"Andhra University Rink",area:"Andhra University",status:"soon",fee:"₹150",closes:"2026-11-29",img:"derby",categories:["Open"]},
  {id:"skate-street-jam",title:"Skateboarding Street Jam",discipline:["Skateboarding"],start:"2026-12-14",end:"2026-12-14",venue:"Kailasagiri Skate Park",area:"Kailasagiri",status:"closed",fee:"₹200",closes:"2026-12-01",img:"skatetrick",categories:["Open"]},
  {id:"downhill-challenge",title:"Downhill Challenge at Kailasagiri Road",discipline:["Downhill"],start:"2026-12-20",end:"2026-12-20",venue:"Kailasagiri Road",area:"Kailasagiri",status:"soon",fee:"₹250",closes:"2026-12-13",img:"downhill",categories:["Open","Junior"]},
  {id:"hockey-shield-2026",title:"Inter-Club Inline Hockey Shield",discipline:["Inline Hockey"],start:"2026-08-15",end:"2026-08-16",venue:"Andhra University Rink",area:"Andhra University",status:"completed",fee:"—",closes:"2026-08-08",img:"hockey",categories:["U-17","Senior"]},
  {id:"selection-trials",title:"State Selection Trials",discipline:["Speed","Artistic"],start:"2026-09-05",end:"2026-09-06",venue:"Port Stadium Rink",area:"Port Area",status:"completed",fee:"—",closes:"2026-08-28",img:"athlete",categories:["U-14","U-17","Senior"]},
  {id:"speed-meet-2026",title:"Inter-Club Speed Meet 2026",discipline:["Speed"],start:"2026-09-21",end:"2026-09-21",venue:"RK Beach Road Circuit",area:"RK Beach",status:"completed",fee:"—",closes:"2026-09-14",img:"competitor",categories:["U-12","U-14"]}
];

const results=[
  {eventId:"speed-meet-2026",discipline:"Speed",category:"U-12 Girls · 500 m",pos:1,athlete:"M. Priya",club:"Beach Road SC",mark:"51.90"},
  {eventId:"speed-meet-2026",discipline:"Speed",category:"U-12 Girls · 500 m",pos:2,athlete:"S. Reddy",club:"MVP Skaters Academy",mark:"52.84"},
  {eventId:"speed-meet-2026",discipline:"Speed",category:"U-12 Girls · 500 m",pos:3,athlete:"L. Naidu",club:"Gajuwaka Rollers",mark:"53.27"},
  {eventId:"speed-meet-2026",discipline:"Speed",category:"U-14 Boys · 1000 m",pos:1,athlete:"A. Kiran",club:"Beach Road SC",mark:"1:41.06"},
  {eventId:"speed-meet-2026",discipline:"Speed",category:"U-14 Boys · 1000 m",pos:2,athlete:"T. Rao",club:"Seethammadhara SC",mark:"1:42.30"},
  {eventId:"speed-meet-2026",discipline:"Speed",category:"U-14 Boys · 1000 m",pos:3,athlete:"V. Sai",club:"MVP Skaters Academy",mark:"1:43.12"},
  {eventId:"selection-trials",discipline:"Speed",category:"Senior Women · 1000 m",pos:1,athlete:"N. Sowmya",club:"Beach Road SC",mark:"1:58.40"},
  {eventId:"selection-trials",discipline:"Speed",category:"Senior Women · 1000 m",pos:2,athlete:"K. Deepika",club:"Gajuwaka Rollers",mark:"2:00.11"},
  {eventId:"selection-trials",discipline:"Speed",category:"Senior Women · 1000 m",pos:3,athlete:"R. Swathi",club:"MVP Skaters Academy",mark:"2:02.87"},
  {eventId:"selection-trials",discipline:"Artistic",category:"Solo Free · U-14",pos:1,athlete:"K. Sahithi",club:"MVP Skaters Academy",mark:"52.10"},
  {eventId:"selection-trials",discipline:"Artistic",category:"Solo Free · U-14",pos:2,athlete:"D. Anvika",club:"Beach Road SC",mark:"50.65"},
  {eventId:"selection-trials",discipline:"Artistic",category:"Solo Free · U-14",pos:3,athlete:"P. Hasini",club:"Madhurawada Wheels",mark:"48.90"},
  {eventId:"artistic-cup",discipline:"Artistic",category:"Solo Free · U-10",pos:1,athlete:"K. Sahithi",club:"MVP Skaters Academy",mark:"48.20"},
  {eventId:"artistic-cup",discipline:"Artistic",category:"Solo Free · U-10",pos:2,athlete:"D. Anvika",club:"Beach Road SC",mark:"46.75"},
  {eventId:"artistic-cup",discipline:"Artistic",category:"Solo Free · U-10",pos:3,athlete:"P. Hasini",club:"Madhurawada Wheels",mark:"45.10"},
  {eventId:"artistic-cup",discipline:"Artistic",category:"Pairs · Open",pos:1,athlete:"A. Teja & B. Manasa",club:"Beach Road SC",mark:"44.80"},
  {eventId:"artistic-cup",discipline:"Artistic",category:"Pairs · Open",pos:2,athlete:"C. Ravi & D. Sindhu",club:"Gajuwaka Rollers",mark:"43.20"},
  {eventId:"hockey-shield-2026",discipline:"Inline Hockey",category:"U-17 Boys · Final",pos:1,athlete:"Gajuwaka Rollers",club:"Gajuwaka Rollers",mark:"4 – 2"},
  {eventId:"hockey-shield-2026",discipline:"Inline Hockey",category:"U-17 Boys · Final",pos:2,athlete:"Port City Inliners",club:"Port City Inliners",mark:"2 – 4"},
  {eventId:"hockey-shield-2026",discipline:"Inline Hockey",category:"Senior · 3rd place",pos:3,athlete:"Beach Road SC",club:"Beach Road SC",mark:"3 – 1"}
];

const medalTable=[
  {club:"Beach Road SC",gold:14,silver:9,bronze:7},
  {club:"MVP Skaters Academy",gold:11,silver:12,bronze:8},
  {club:"Gajuwaka Rollers",gold:8,silver:7,bronze:10},
  {club:"Seethammadhara SC",gold:5,silver:6,bronze:6},
  {club:"Madhurawada Wheels",gold:3,silver:4,bronze:5}
];

const circulars=[
  {ref:"VDRSA/2026/014",title:"Revised age categories for the 2026–27 season",date:"2026-09-20",category:"Circular",year:2026,size:"220 KB"},
  {ref:"VDRSA/2026/013",title:"District Championship 2026 — entry guidelines",date:"2026-09-12",category:"Circular",year:2026,size:"310 KB"},
  {ref:"VDRSA/2026/012",title:"School programme expansion notice",date:"2026-09-02",category:"Notice",year:2026,size:"150 KB"},
  {ref:"VDRSA/2026/011",title:"Coach workshop schedule — artistic judging",date:"2026-08-25",category:"Notice",year:2026,size:"180 KB"},
  {ref:"VDRSA/RULE/07",title:"Speed skating technical rules (district edition)",date:"2026-08-01",category:"Rules",year:2026,size:"540 KB"},
  {ref:"VDRSA/RULE/06",title:"Artistic skating judging rules (district edition)",date:"2026-07-20",category:"Rules",year:2026,size:"480 KB"},
  {ref:"VDRSA/FORM/02",title:"Parent / guardian consent form",date:"2026-07-15",category:"Form",year:2026,size:"95 KB"},
  {ref:"VDRSA/FORM/01",title:"Club recognition renewal form",date:"2026-07-10",category:"Form",year:2026,size:"110 KB"},
  {ref:"VDRSA/2025/031",title:"Season closing circular 2025–26",date:"2025-03-28",category:"Circular",year:2025,size:"200 KB"},
  {ref:"VDRSA/RULE/05",title:"Inline hockey rules (district edition)",date:"2025-02-10",category:"Rules",year:2025,size:"460 KB"},
  {ref:"VDRSA/FORM/03",title:"Club coach registration form",date:"2025-01-18",category:"Form",year:2025,size:"100 KB"},
  {ref:"VDRSA/2024/019",title:"Child safety policy notice",date:"2024-11-05",category:"Notice",year:2024,size:"170 KB"}
];

const clubs=[
  {id:"beach-road-sc",name:"Beach Road Skating Club",area:"RK Beach",disciplines:["Speed","Artistic"],coaches:14,skaters:260,since:2011,recognizedTill:"2027-03-31",contactRole:"Club Secretary"},
  {id:"mvp-skaters-academy",name:"MVP Skaters Academy",area:"MVP Colony",disciplines:["Speed","Artistic","Freestyle"],coaches:11,skaters:180,since:2013,recognizedTill:"2027-03-31",contactRole:"Academy Director"},
  {id:"gajuwaka-rollers",name:"Gajuwaka Rollers",area:"Gajuwaka",disciplines:["Speed","Inline Hockey","Rink Hockey"],coaches:9,skaters:160,since:2014,recognizedTill:"2027-03-31",contactRole:"Club President"},
  {id:"port-city-inliners",name:"Port City Inliners",area:"Port Area",disciplines:["Speed","Inline Hockey","Rink Hockey"],coaches:8,skaters:140,since:2015,recognizedTill:"2027-03-31",contactRole:"Club Secretary"},
  {id:"seethammadhara-sc",name:"Seethammadhara Skating Club",area:"Seethammadhara",disciplines:["Speed"],coaches:7,skaters:120,since:2016,recognizedTill:"2027-03-31",contactRole:"Club Secretary"},
  {id:"madhurawada-wheels",name:"Madhurawada Wheels",area:"Madhurawada",disciplines:["Artistic","Freestyle","Roller Derby"],coaches:7,skaters:110,since:2017,recognizedTill:"2026-09-30",contactRole:"Club Coordinator"},
  {id:"kailasagiri-park-skaters",name:"Kailasagiri Park Skaters",area:"Kailasagiri",disciplines:["Skateboarding","Freestyle","Downhill"],coaches:6,skaters:100,since:2020,recognizedTill:"2026-12-31",contactRole:"Club Coordinator"},
  {id:"vizag-inline-club",name:"Vizag Inline Club",area:"Pendurthi",disciplines:["Speed","Freestyle","Downhill"],coaches:5,skaters:90,since:2021,recognizedTill:"2027-03-31",contactRole:"Club Secretary"},
  {id:"steel-city-skate-crew",name:"Steel City Skate Crew",area:"Ukkunagaram",disciplines:["Skateboarding"],coaches:5,skaters:80,since:2019,recognizedTill:"2027-03-31",contactRole:"Club Coordinator"},
  {id:"vizag-roller-derby-league",name:"Vizag Roller Derby League",area:"Seethammadhara",disciplines:["Roller Derby"],coaches:4,skaters:60,since:2022,recognizedTill:"2027-03-31",contactRole:"Club Coordinator"}
];

const news=[
  {id:1,title:"Inter-Club Speed Meet: Beach Road SC tops the medal table",date:"2026-09-21",tag:"Results",excerpt:"More than 180 skaters from 14 clubs raced across 22 categories at RK Beach Road. Full validated results are now published.",img:"competitor"},
  {id:2,title:"Coach workshop on artistic judging — 2 November",date:"2026-09-14",tag:"Coaching",excerpt:"A full-day workshop for certified coaches covering the revised artistic judging criteria for the 2026–27 season.",img:"coach"},
  {id:3,title:"School skating programme opens in 6 GVMC schools",date:"2026-09-05",tag:"Schools",excerpt:"VDRSA partners with GVMC to introduce roller sports as an after-school activity in six government schools.",img:"boy"},
  {id:4,title:"District Championship 2026 registrations now open",date:"2026-08-30",tag:"Announcements",excerpt:"Clubs can now submit entries for the VDRSA District Championship 2026, to be held at Port Stadium Rink on 26–27 October.",img:"race"},
  {id:5,title:"Revised age categories announced for 2026–27 season",date:"2026-08-20",tag:"Announcements",excerpt:"The technical committee has revised age category bands across speed, artistic and freestyle disciplines effective this season.",img:"slalom"},
  {id:6,title:"Selection trials identify 12 skaters for state camp",date:"2026-09-08",tag:"Results",excerpt:"Skaters selected at the state selection trials will attend the APRSA training camp in Vijayawada next month.",img:"trio"}
];

const achievers=[
  {type:"Rising Star",name:"M. Priya",club:"Beach Road SC",season:"2026–27",citation:"Three district golds in U-12 speed this season.",img:"girl"},
  {type:"Coach of the Season",name:"R. Kumar",club:"MVP Skaters Academy",season:"2026–27",citation:"12 athletes selected to state level in two years.",img:"coach"},
  {type:"Club of the Season",name:"Beach Road SC",club:"Beach Road SC",season:"2026–27",citation:"Highest growth in active skaters across the district.",img:"group"},
  {type:"Volunteer",name:"S. Varma",club:"VDRSA",season:"2026–27",citation:"40+ hours of timing and officiating support.",img:"gear"},
  {type:"Rising Star",name:"A. Kiran",club:"Beach Road SC",season:"2025–26",citation:"District record in U-14 1000 m speed.",img:"boy"},
  {type:"Official of the Season",name:"K. Naidu",club:"VDRSA",season:"2025–26",citation:"Chief timekeeper across 9 district events.",img:"lowangle"},
  {type:"Coach of the Season",name:"P. Sujatha",club:"Gajuwaka Rollers",season:"2025–26",citation:"Built the district's first inline hockey junior squad.",img:"hockey"},
  {type:"Club of the Season",name:"MVP Skaters Academy",club:"MVP Skaters Academy",season:"2025–26",citation:"Most club recognitions renewed on time.",img:"quad"}
];

const committee=[
  {role:"Chairman",name:"To be confirmed"},
  {role:"President",name:"To be confirmed"},
  {role:"Secretary",name:"To be confirmed"},
  {role:"Treasurer",name:"To be confirmed"},
  {role:"Joint Secretary",name:"To be confirmed"},
  {role:"Technical Director",name:"To be confirmed"},
  {role:"Development Officer",name:"To be confirmed"},
  {role:"Child Safety Officer",name:"To be confirmed"}
];

const data={events,results,medalTable,circulars,clubs,news,achievers,committee};

/* ---------------------------------------------------------------------
   DISCIPLINES — Revision v4 §1. All 8 RSFI disciplines the district
   competes in, with their main photo key (VDRSA.photo), the slug used
   to filter events/clubs/results (matches the discipline strings used
   in the data above) and a Lucide icon name. Pages read this instead
   of hardcoding the discipline list.
   --------------------------------------------------------------------- */
const disciplines=[
  {
    name:"Speed Skating",
    key:"race",
    slug:"Speed",
    icon:"zap",
    subtitle:"Pure Velocity on Track & Road",
    desc:"Track and road racing across 200m time trials, 500m sprints, 1,000m eliminations, and marathons. Athletes race with precision aerodynamic technique, reaching speeds over 50 km/h with electronic transponder timing.",
    highlights:"District Championship · RK Beach Circuit · Port Stadium Banked Track",
    categories:"Quad & Inline · Ages U-8 to Senior"
  },
  {
    name:"Artistic Skating",
    key:"artistic",
    slug:"Artistic",
    icon:"sparkles",
    subtitle:"Grace, Technical Agility & Flow",
    desc:"Figure, solo free dance, pairs, and group show routines judged to official RSFI and World Skate criteria. Features intricate spins, double axels, artistic footwork, and choreographed musical interpretation.",
    highlights:"Annual District Cup · GVMC Indoor Stadium · Technical Judging Workshops",
    categories:"Figures, Solo Dance & Pairs · Ages U-10 to Senior"
  },
  {
    name:"Inline Hockey",
    key:"hockey",
    slug:"Inline Hockey",
    icon:"swords",
    subtitle:"High-Speed Team Combat on Wheels",
    desc:"Non-checking team puck sport on inline skates. Fast transitions, swift stickhandling, and strategic offensive passing on specialized indoor sports floors or smooth outdoor rinks.",
    highlights:"District League · Andhra University Rink · U-14 & U-17 Squads",
    categories:"Junior & Senior Men / Women Teams"
  },
  {
    name:"Rink Hockey",
    key:"rinkhockey",
    slug:"Rink Hockey",
    icon:"shield",
    subtitle:"Traditional Quad Stick & Ball Battles",
    desc:"The classic roller sport played on quad roller skates with curved wooden sticks and a hard vulcanized rubber ball inside walled rink boundaries, emphasizing tactical play and ball control.",
    highlights:"Inter-Club Shield · GVMC Indoor Stadium · State Qualifiers",
    categories:"Sub-Junior, Junior & Senior Club Teams"
  },
  {
    name:"Inline Freestyle",
    key:"slalom",
    slug:"Freestyle",
    icon:"wind",
    subtitle:"Cone Slalom Mastery & Speed Sprints",
    desc:"Agility-intensive disciplines including Classic Slalom to musical rhythms, 20-cone Speed Slalom sprints, Battle Slalom, and Free Jump over high bars testing supreme balance and reflexes.",
    highlights:"Freestyle Slalom Open · Port Stadium Rink · Skill Clinics",
    categories:"Speed Slalom, Classic & Battle · Open Age Categories"
  },
  {
    name:"Skateboarding",
    key:"skatetrick",
    slug:"Skateboarding",
    icon:"flame",
    subtitle:"Street Courses, Bowls & Aerial Amplitude",
    desc:"Olympic discipline showcasing technical street tricks (kickflips, grinds, slides) and high-amplitude transition park bowl skating, evaluated by official judges on difficulty, style, and flow.",
    highlights:"Kailasagiri Skate Park Jam · Street Competitions",
    categories:"Street & Park Disciplines · Junior & Open"
  },
  {
    name:"Roller Derby",
    key:"derby",
    slug:"Roller Derby",
    icon:"users",
    subtitle:"Full-Contact Oval Circuit Strategy",
    desc:"Fast-paced quad roller sport on a flat oval track where offensive jammers battle through opposing packs of blockers, combining tactical pack control with high-impact athleticism.",
    highlights:"Exhibition Bouts · Andhra University Rink · Regional League",
    categories:"Flat Track Quad Racing · Open Division"
  },
  {
    name:"Inline Alpine & Downhill",
    key:"downhill",
    slug:"Downhill",
    icon:"mountain",
    subtitle:"High-Octane Gravity Mountain Racing",
    desc:"Daring asphalt speed trials and giant slalom carving down steep mountain roadways. Skaters wear protective aerodynamic leathers while hitting speeds beyond 70 km/h through sharp hairpins.",
    highlights:"Kailasagiri Road Challenge · State Selection Trials",
    categories:"Slalom, Giant Slalom & Downhill Speed Trials"
  }
];

/* ---------------------------------------------------------------------
   HEADER / FOOTER
   --------------------------------------------------------------------- */
const MENU=[
  {key:"home",href:"index.html",title:"Home"},
  {key:"about",href:"about.html",title:"About"},
  {key:"events",href:"events.html",title:"Events"},
  {key:"results",href:"results.html",title:"Results"},
  {key:"circulars",href:"circulars.html",title:"Circulars"},
  {key:"clubs",href:"clubs.html",title:"Clubs"},
  {key:"news",href:"news.html",title:"News"},
  {key:"contact",href:"contact.html",title:"Contact"}
];
const ACTIVE_MAP={"event-detail":"events","club-detail":"clubs"};

function activeKey(){const p=document.body&&document.body.dataset.page;return ACTIVE_MAP[p]||p;}

function renderHeader(){
  const host=$("#site-header");
  if(!host)return;
  const ak=activeKey();
  const menuHtml=MENU.map(m=>`<li><a${m.key===ak?' class="active" aria-current="page"':""} href="${m.href}">${m.title}</a></li>`).join("");
  const drawerHtml=MENU.map(m=>`<a href="${m.href}" data-close>${m.title}</a>`).join("")+`<a href="verify.html" data-close>Verify Skater ID</a>`;
  host.innerHTML=`
<div class="topbar">
  <div class="wrap">
    <div class="l">
      <span class="it"><i data-lucide="badge-check"></i>Affiliated to APRSA · RSFI</span>
      <a class="it hide-md" href="contact.html"><i data-lucide="mail"></i>office@vdrsa.in</a>
    </div>
    <div class="r">
      <a class="it hide-md" href="contact.html?type=grievance"><i data-lucide="message-square-warning"></i>Grievance desk</a>
      <button class="tb-btn" id="themeBtn" aria-label="Toggle dark mode"><i data-lucide="moon"></i></button>
    </div>
  </div>
</div>
<header class="site" id="hdr">
  <div class="wrap hdr">
    <a class="brand" href="index.html" aria-label="VDRSA home">
      <img src="assets/vdrsa-logo.png" alt="VDRSA logo" width="54" height="54" decoding="async">
      <span><b>VDRSA</b><small>Visakhapatnam District Roller Sports Association</small></span>
    </a>
    <ul class="menu">${menuHtml}</ul>
    <div class="hdr-cta">
      <a class="btn btn-outline btn-sm" data-magnetic href="verify.html"><i data-lucide="shield-check"></i>Verify ID</a>
      <div class="login" id="login">
        <button class="btn btn-primary btn-sm" data-magnetic id="loginBtn" aria-haspopup="true" aria-expanded="false"><i data-lucide="log-in"></i>Login<i data-lucide="chevron-down"></i></button>
        <div class="login-menu" role="menu">
          <a href="login.html?role=control" role="menuitem"><span class="ic"><i data-lucide="layout-dashboard"></i></span><span><b>Control Room</b><small>Committee and administrators</small></span></a>
          <a href="login.html?role=club" role="menuitem"><span class="ic"><i data-lucide="building-2"></i></span><span><b>Club Portal</b><small>Athletes, entries and documents</small></span></a>
          <a href="login.html?role=parent" role="menuitem"><span class="ic"><i data-lucide="users"></i></span><span><b>Parent Hub</b><small>Your child's events and results</small></span></a>
          <a href="login.html?role=coach" role="menuitem"><span class="ic"><i data-lucide="clipboard-check"></i></span><span><b>Coach Desk</b><small>Attendance, notes and selection</small></span></a>
        </div>
      </div>
      <button class="burger" id="burger" aria-label="Open menu"><i data-lucide="menu"></i></button>
    </div>
  </div>
</header>
<div class="drawer" id="drawer">
  <div class="scrim" data-close></div>
  <nav aria-label="Mobile menu">
    <button class="burger" style="display:grid;align-self:flex-end" data-close aria-label="Close menu"><i data-lucide="x"></i></button>
    ${drawerHtml}
    <a href="login.html" data-close>Login</a>
  </nav>
</div>`;
}

function renderFooter(){
  const host=$("#site-footer");
  if(!host)return;
  host.innerHTML=`
<footer>
  <div class="wrap">
    <div class="fgrid4">
      <div>
        <a class="brand" href="index.html"><img src="assets/vdrsa-logo.png" alt="" width="54" height="54" loading="lazy" decoding="async"><span><b>VDRSA</b><small>Visakhapatnam District Roller Sports Association</small></span></a>
        <div class="affil">
          <span><i data-lucide="badge-check"></i>Affiliated to APRSA</span>
          <span><i data-lucide="badge-check"></i>APRSA affiliated to RSFI</span>
          <span><i data-lucide="badge-check"></i>RSFI recognized by Govt. of India &amp; IOA</span>
        </div>
      </div>
      <div><h4>Association</h4><ul>
        <li><a href="about.html">About VDRSA</a></li>
        <li><a href="about.html#committee">Executive committee</a></li>
        <li><a href="clubs.html">Recognized clubs</a></li>
        <li><a href="hall-of-fame.html">Hall of Fame</a></li>
      </ul></div>
      <div><h4>Skaters</h4><ul>
        <li><a href="events.html">Events calendar</a></li>
        <li><a href="results.html">Results archive</a></li>
        <li><a href="verify.html">Verify Skater ID</a></li>
        <li><a href="circulars.html">Circulars &amp; documents</a></li>
      </ul></div>
      <div><h4>Policies</h4><ul>
        <li><a href="about.html#governance">Privacy policy</a></li>
        <li><a href="about.html#governance">Child safety policy</a></li>
        <li><a href="about.html#governance">Photo &amp; media consent</a></li>
        <li><a href="contact.html?type=grievance">Grievance desk</a></li>
      </ul></div>
    </div>
    <div class="fbottom"><span>© 2026 Visakhapatnam District Roller Sports Association</span><span>Design &amp; development by Nexara</span></div>
  </div>
</footer>`;
}

/* ---------------------------------------------------------------------
   LOADER
   --------------------------------------------------------------------- */
function initLoader(){
  // Full loader only on the first page of a visit; later pages hide it straight away.
  const l=$("#page-loader"); if(!l) return;
  let seen=false;
  try{ seen=sessionStorage.getItem("vdrsa-loaded")==="1"; sessionStorage.setItem("vdrsa-loaded","1"); }catch(e){}
  if(seen){ l.classList.add("done"); return; }
  // Do not wait for every photo: hide shortly after the page is ready, and never later than 2.5 s.
  const hide=()=>l.classList.add("done");
  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded",()=>setTimeout(hide,700));
  else setTimeout(hide,700);
  setTimeout(hide,mqOn("(max-width:900px)")?1200:2500);
}

/* ---------------------------------------------------------------------
   THEME
   --------------------------------------------------------------------- */
function initThemeLang(){
  try{const t=localStorage.getItem("vdrsa-theme");if(t)document.documentElement.dataset.theme=t}catch(e){}
  document.addEventListener("click",e=>{
    if(e.target.closest("#themeBtn")){
      const r=document.documentElement;
      const dark=r.dataset.theme?r.dataset.theme==="dark":matchMedia("(prefers-color-scheme:dark)").matches;
      r.dataset.theme=dark?"light":"dark";
      try{localStorage.setItem("vdrsa-theme",r.dataset.theme)}catch(err){}
    }
  });
}

/* ---------------------------------------------------------------------
   HEADER BEHAVIOUR: scroll shadow, login dropdown, mobile drawer, esc
   --------------------------------------------------------------------- */
function initHeaderBehaviour(){
  addEventListener("scroll",()=>{const h=$("#hdr");h&&h.classList.toggle("scrolled",scrollY>10)},{passive:true});
  document.addEventListener("click",e=>{
    const login=$("#login");
    if(!login)return;
    if(e.target.closest("#loginBtn")){
      e.stopPropagation();
      const o=login.classList.toggle("open");
      $("#loginBtn").setAttribute("aria-expanded",o);
      return;
    }
    if(!e.target.closest(".login-menu")){
      login.classList.remove("open");
      const btn=$("#loginBtn");btn&&btn.setAttribute("aria-expanded","false");
    }
  });
  document.addEventListener("click",e=>{
    if(e.target.closest("#burger"))$("#drawer").classList.add("open");
    if(e.target.closest("[data-close]"))$("#drawer").classList.remove("open");
  });
  document.addEventListener("keydown",e=>{
    if(e.key==="Escape"){
      const login=$("#login");login&&login.classList.remove("open");
      const btn=$("#loginBtn");btn&&btn.setAttribute("aria-expanded","false");
      const drawer=$("#drawer");drawer&&drawer.classList.remove("open");
    }
  });
}

/* ---------------------------------------------------------------------
   COUNTERS (shared by both the legacy reveal path and the motion engine)
   --------------------------------------------------------------------- */
function countUp(el){
  if(el.dataset.counted)return; el.dataset.counted="1";
  const end=+el.dataset.count;
  if(isNaN(end)) return;
  const t0=performance.now();
  const dur=1300;
  const f=n=>{
    const p=Math.min(1,(n-t0)/dur);
    const ease=p===1?1:1-Math.pow(2,-10*p);
    const cur=Math.round(end*ease);
    el.textContent=cur.toLocaleString("en-IN")+(p===1&&end>999?"+":"");
    if(p<1)requestAnimationFrame(f);
  };
  requestAnimationFrame(f);
}
let countIO=null;
function countObserve(root){
  // Always use a plain IntersectionObserver: the hero is pinned, which throws off
  // ScrollTrigger's computed positions and made counters finish before being seen.
  // This fires the count-up only when the number actually scrolls into view.
  if(!("IntersectionObserver" in window)){
    $$("[data-count]",root||document).forEach(el=>{ const n=+el.dataset.count; if(!isNaN(n))el.textContent=n.toLocaleString("en-IN")+(n>999?"+":""); });
    return;
  }
  if(!countIO){
    countIO=new IntersectionObserver(es=>es.forEach(en=>{
      if(!en.isIntersecting)return;
      countIO.unobserve(en.target);
      countUp(en.target);
    }),{threshold:0,rootMargin:"0px 0px -12% 0px"});
  }
  $$("[data-count]",root||document).forEach(el=>{
    if(el.dataset.countWatched)return; el.dataset.countWatched="1";
    if(reducedMotion()){ el.textContent=(+el.dataset.count).toLocaleString("en-IN")+((+el.dataset.count)>999?"+":""); return; }
    countIO.observe(el);
  });
}

/* ---------------------------------------------------------------------
   LEGACY REVEAL (CSS-only fallback for .reveal, used when GSAP/Lenis
   are unavailable or prefers-reduced-motion is set — content already
   defaults to visible via CSS, this only handles the .reveal opacity
   transition defined in site.css)
   --------------------------------------------------------------------- */
let io=null;
function legacyObserve(root){
  if(!("IntersectionObserver" in window)){ $$(".reveal:not(.in)",root||document).forEach(el=>el.classList.add("in")); countObserve(root); return; }
  if(!io){
    io=new IntersectionObserver(es=>es.forEach(en=>{
      if(!en.isIntersecting)return;
      en.target.classList.add("in");
      io.unobserve(en.target);
    }),{threshold:.12});
  }
  $$(".reveal:not(.in)",root||document).forEach(el=>io.observe(el));
  countObserve(root);
}

/* ---------------------------------------------------------------------
   MOTION ENGINE — Lenis + GSAP + ScrollTrigger, per MOTION_SPEC.md §3.
   Works only when both libraries loaded successfully and the visitor
   has not asked for reduced motion; otherwise everything stays visible
   and legacyObserve() handles the plain .reveal fallback. No content is
   ever hidden by CSS before this runs.
   --------------------------------------------------------------------- */
let lenis=null, motionReady=false;
function reducedMotion(){
  try{return matchMedia("(prefers-reduced-motion: reduce)").matches}catch(e){return false}
}
function hasMotionLibs(){
  return !!(window.gsap && window.gsap.registerPlugin && window.ScrollTrigger);
}
function initMotion(){
  if(reducedMotion()||!hasMotionLibs())return;
  try{
    gsap.registerPlugin(ScrollTrigger);
    if(ScrollTrigger.config)ScrollTrigger.config({ignoreMobileResize:true});
    if(window.Lenis){
      lenis=new Lenis({lerp:.1,syncTouch:false,smoothTouch:false,touchMultiplier:1});
      lenis.on("scroll",ScrollTrigger.update);
      gsap.ticker.add(t=>lenis.raf(t*1000));
      gsap.ticker.lagSmoothing(0);
    }
    motionReady=true;
    addEventListener("load",()=>setTimeout(()=>ScrollTrigger.refresh(),300),{once:true});
  }catch(e){ motionReady=false; }
}

function splitWords(el){
  if(el.dataset.split)return $$(".word-inner",el);
  const inners=[];
  const wrap=(node)=>{ // node = text word or an element child (e.g. .accent-word/.uword) to animate as one unit
    const mask=document.createElement("span"); mask.className="word";
    const inner=document.createElement("span"); inner.className="word-inner";
    inner.appendChild(node); mask.appendChild(inner); inners.push(inner); return mask;
  };
  // Rebuild from the original child nodes so nested spans (accent-word, uword) survive.
  const src=[...el.childNodes];
  el.textContent="";
  src.forEach(node=>{
    if(node.nodeType===3){ // text node → split into words, keep whitespace
      node.nodeValue.split(/(\s+)/).forEach(w=>{
        if(w==="")return;
        if(/^\s+$/.test(w)){ el.appendChild(document.createTextNode(w)); return; }
        el.appendChild(wrap(document.createTextNode(w)));
      });
    } else { // element (accent-word / uword / anything) → animate whole, styling preserved
      el.appendChild(wrap(node));
    }
  });
  el.dataset.split="1";
  return inners;
}

/* ---------------------------------------------------------------------
   RESPONSIVE TABLES — REVISION_V3 §4. Adds data-label to every <td> from
   its column's <th> text so CSS can turn each row into a stacked card
   below 640px. Called by VDRSA.animate() so it runs on every render,
   including re-renders inside filtered lists.
   --------------------------------------------------------------------- */
function tables(root){
  $$(".scroll table",root||document).forEach(t=>{
    const heads=$$("thead th",t).map(th=>th.textContent.trim());
    if(!heads.length)return;
    $$("tbody tr",t).forEach(tr=>{
      $$("td",tr).forEach((td,i)=>{ if(heads[i])td.setAttribute("data-label",heads[i]); });
    });
  });
}

function animate(root){
  root=root||document;
  tables(root);
  $$(".reveal:not([data-anim])",root).forEach(el=>el.setAttribute("data-anim","up"));

  if(!motionReady){
    legacyObserve(root);
    return;
  }

  /* section kicker snap — applies to every .sec-head .kicker (existing
     shared markup on every page), independent of data-anim attributes */
  $$(".sec-head .kicker",root).forEach(k=>{
    if(k.dataset.kickerDone)return; k.dataset.kickerDone="1";
    if(!k.querySelector(".kicker-line")){
      const line=document.createElement("i");
      line.className="kicker-line";
      line.setAttribute("aria-hidden","true");
      k.appendChild(line);
    }
    const line=k.querySelector(".kicker-line");
    gsap.set(k,{opacity:0,x:-24});
    gsap.set(line,{scaleX:0});
    ScrollTrigger.create({
      trigger:k,start:"top 85%",toggleActions:"play none none reverse",
      onEnter:()=>{ gsap.to(k,{opacity:1,x:0,duration:.6,ease:"back.out(1.7)"}); gsap.to(line,{scaleX:1,duration:.5,ease:"power2.out",delay:.15}); },
      onLeaveBack:()=>{ gsap.set(k,{opacity:0,x:-24}); gsap.set(line,{scaleX:0}); }
    });
  });

  const base={start:"top 85%",toggleActions:"play none none reverse"};
  $$("[data-anim]",root).forEach(el=>{
    if(el.dataset.animDone)return; el.dataset.animDone="1";
    const type=el.getAttribute("data-anim");
    const delay=parseFloat(el.getAttribute("data-delay")||"0")||0;
    switch(type){
      case "up":
        gsap.fromTo(el,{y:60,opacity:0},{y:0,opacity:1,duration:.9,delay,ease:"back.out(1.7)",scrollTrigger:{trigger:el,...base}});
        break;
      case "left":
        gsap.fromTo(el,{x:-90,opacity:0},{x:0,opacity:1,duration:.9,delay,ease:"back.out(1.7)",scrollTrigger:{trigger:el,...base}});
        break;
      case "right":
        gsap.fromTo(el,{x:90,opacity:0},{x:0,opacity:1,duration:.9,delay,ease:"back.out(1.7)",scrollTrigger:{trigger:el,...base}});
        break;
      case "zoom":
        gsap.fromTo(el,{scale:.86,opacity:0},{scale:1,opacity:1,duration:.9,delay,ease:"back.out(1.4)",scrollTrigger:{trigger:el,...base}});
        break;
      case "stagger":{
        const kids=[...el.children];
        if(kids.length)gsap.fromTo(kids,{y:60,opacity:0},{y:0,opacity:1,duration:.9,delay,ease:"back.out(1.7)",stagger:.08,scrollTrigger:{trigger:el,...base}});
        break;}
      case "words":{
        const inners=splitWords(el);
        if(inners.length)gsap.fromTo(inners,{y:"110%",rotate:4,opacity:0},{y:"0%",rotate:0,opacity:1,duration:.9,delay,ease:"back.out(1.7)",stagger:.05,scrollTrigger:{trigger:el,...base}});
        break;}
      case "img":{
        const inner=el.querySelector("img,.ph")||el;
        gsap.set(el,{clipPath:"inset(0 100% 0 0)"});
        gsap.set(inner,{scale:1.25});
        gsap.timeline({scrollTrigger:{trigger:el,...base}})
          .to(el,{clipPath:"inset(0% 0% 0% 0%)",duration:1.2,delay,ease:"expo.out"})
          .to(inner,{scale:1,duration:1.2,ease:"expo.out"},"<");
        break;}
      case "scrub-zoom":
        gsap.fromTo(el,{scale:.84,borderRadius:36},{scale:1,borderRadius:16,ease:"none",scrollTrigger:{trigger:el,start:"top bottom",end:"bottom top",scrub:true}});
        break;
    }
  });

  const lite=mqOn("(max-width:900px)")||mqOn("(hover:none)");
  $$("[data-parallax]",root).forEach(el=>{
    if(lite)return; /* no scrubbed parallax on phones/touch: cheaper and no jank */
    if(el.dataset.parallaxDone)return; el.dataset.parallaxDone="1";
    const amt=parseFloat(el.getAttribute("data-parallax"))||.15;
    gsap.to(el,{yPercent:amt*100,ease:"none",scrollTrigger:{trigger:el.parentElement||el,start:"top bottom",end:"bottom top",scrub:true}});
  });

  countObserve(root);
  ScrollTrigger.refresh();
}
const observe=animate; // MOTION_SPEC §7 — VDRSA.observe() kept as an alias of VDRSA.animate()

/* ---------------------------------------------------------------------
   CARD SHUFFLE DECK — .deck-wrap / .deck / .deck-card (REVISION_V3 §5)
   Desktop (>=900px): pinned scroll timeline — the front card lifts,
   slides down and goes to the back of the deck as the section scrolls.
   Phones/tablets (<900px): auto-shuffles every 4s, and on tap/swipe.
   Reduced motion (or missing GSAP): plain static grid via CSS
   (.deck-wrap.deck-static / prefers-reduced-motion), no JS behaviour.
   --------------------------------------------------------------------- */
function slotStyle(p,N){
  const rot=p<.05?0:((Math.round(p)%2)?-2:2);
  return {y:p*14,scale:1-p*.04,rotate:rot,zIndex:Math.round((N-p)*10)};
}
function initDeck(root){
  const reduced=reducedMotion();
  $$(".deck-wrap",root||document).forEach(wrap=>{
    if(wrap.dataset.deckInit)return; wrap.dataset.deckInit="1";
    const deck=$(".deck",wrap);
    const cards=$$(".deck-card",deck||wrap);
    const N=cards.length;
    if(!deck||!N)return;
    if(reduced||!hasMotionLibs()){ wrap.classList.add("deck-static"); return; }

    const roleBtns=$$(".role-list button",wrap);
    const dotBtns=$$(".deck-dots button",wrap);
    let order=cards.map((_,i)=>i); // order[0] = index of the front-most card
    let autoTimer=null, pinST=null;

    function paint(animated){
      order.forEach((cardIdx,pos)=>{
        const s=slotStyle(pos,N);
        if(animated)gsap.to(cards[cardIdx],{y:s.y,scale:s.scale,rotate:s.rotate,zIndex:s.zIndex,duration:.6,ease:"power3.inOut"});
        else gsap.set(cards[cardIdx],{y:s.y,scale:s.scale,rotate:s.rotate,zIndex:s.zIndex});
      });
      const frontIdx=order[0];
      roleBtns.forEach(b=>b.setAttribute("aria-current",String(+b.dataset.role===frontIdx)));
      dotBtns.forEach(b=>b.setAttribute("aria-current",String(+b.dataset.role===frontIdx)));
    }
    function advance(){
      // Top card drops out in front, then tucks in at the back while the others move up.
      const leaving=cards[order[0]]; order.push(order.shift());
      const back=slotStyle(N-1,N);
      gsap.timeline()
        .to(leaving,{y:220,x:30,rotate:6,zIndex:(N+1)*10,duration:.35,ease:"power2.in"})
        .set(leaving,{zIndex:0})
        .to(leaving,{y:back.y,x:0,scale:back.scale,rotate:back.rotate,duration:.45,ease:"back.out(1.4)"});
      order.slice(0,N-1).forEach((cardIdx,pos)=>{ const s=slotStyle(pos,N); gsap.to(cards[cardIdx],{y:s.y,scale:s.scale,rotate:s.rotate,zIndex:s.zIndex,duration:.6,delay:.15,ease:"power3.inOut"}); });
      const frontIdx=order[0];
      roleBtns.forEach(b=>b.setAttribute("aria-current",String(+b.dataset.role===frontIdx)));
      dotBtns.forEach(b=>b.setAttribute("aria-current",String(+b.dataset.role===frontIdx)));
    }
    function goTo(idx){ let g=0; while(order[0]!==idx&&g++<N)order.push(order.shift()); paint(true); }
    paint(false);

    function pauseAuto(){ clearTimeout(autoTimer); }
    function scheduleAuto(){ clearTimeout(autoTimer); if(innerWidth>=900)return; autoTimer=setTimeout(()=>{advance();scheduleAuto();},4000); }

    roleBtns.forEach(b=>b.addEventListener("click",()=>{ pauseAuto(); goTo(+b.dataset.role); scheduleAuto(); }));
    dotBtns.forEach(b=>b.addEventListener("click",()=>{ pauseAuto(); goTo(+b.dataset.role); scheduleAuto(); }));
    deck.addEventListener("mouseenter",pauseAuto);
    deck.addEventListener("mouseleave",scheduleAuto);

    let touchX=null;
    deck.addEventListener("touchstart",e=>{touchX=e.touches[0].clientX;pauseAuto();},{passive:true});
    deck.addEventListener("touchend",e=>{
      if(touchX==null)return;
      const dx=e.changedTouches[0].clientX-touchX;
      if(Math.abs(dx)>40)advance();
      touchX=null; scheduleAuto();
    },{passive:true});

    const io=new IntersectionObserver(es=>es.forEach(en=>{ en.isIntersecting?scheduleAuto():pauseAuto(); }),{threshold:.3});
    io.observe(deck);

    function setupDesktop(){
      if(pinST)return;
      pinST=ScrollTrigger.create({
        trigger:wrap,start:"top top",end:"+="+Math.round(innerHeight*(N-1)*.55),
        pin:true,scrub:.6,snap:1/(N-1),
        onUpdate(self){
          const raw=self.progress*(N-1);
          // d = distance from the front: 0 = top card, 1..N-1 = cards behind, (-1,0) = top card leaving.
          const dist=idx=>{ let d=((idx-raw+1)%N+N)%N-1; return d; };
          cards.forEach((card,idx)=>{
            const d=dist(idx);
            if(d>=0){ const s=slotStyle(d,N); gsap.set(card,{y:s.y,x:0,scale:s.scale,rotate:s.rotate,zIndex:s.zIndex}); return; }
            // Leaving card: first half lifts down and out in front of the deck, second half tucks in at the back.
            const t=-d, back=slotStyle(N-1,N);
            if(t<.5){ const k=t/.5; gsap.set(card,{y:k*260,x:k*40,scale:1-k*.04,rotate:k*6,zIndex:(N+1)*10}); }
            else{ const k=(t-.5)/.5; gsap.set(card,{y:260+(back.y-260)*k,x:40*(1-k),scale:.96+(back.scale-.96)*k,rotate:6+(back.rotate-6)*k,zIndex:0}); }
          });
          const frontIdx=cards.findIndex((_,idx)=>{ const d=dist(idx); return d>-.5&&d<=.5; });
          if(frontIdx>=0){
            roleBtns.forEach(b=>b.setAttribute("aria-current",String(+b.dataset.role===frontIdx)));
            dotBtns.forEach(b=>b.setAttribute("aria-current",String(+b.dataset.role===frontIdx)));
          }
        }
      });
    }
    function teardownDesktop(){ if(pinST){ pinST.kill(); pinST=null; } paint(false); }

    let wasDesktop=innerWidth>=900;
    if(wasDesktop){ setupDesktop(); } else { scheduleAuto(); }
    addEventListener("resize",()=>{
      const isDesktop=innerWidth>=900;
      if(isDesktop===wasDesktop)return;
      wasDesktop=isDesktop;
      if(isDesktop){ pauseAuto(); setupDesktop(); } else { teardownDesktop(); scheduleAuto(); }
    });
  });
}

/* ---------------------------------------------------------------------
   HERO CINE — Immersive Cinematic hero, ported from mockups/hero-proto/b.html.
   Full-bleed graded photo, slow Ken-Burns/parallax on scroll (GSAP +
   ScrollTrigger, already registered by initMotion()), drifting glass stat
   chips, entrance timeline, and a floating countdown pill that reads the
   same district-championship target as the countdown() helper below.
   No-ops cleanly when #heroCine / .hero-cine is absent. Reduced-motion:
   no parallax/drift — static graded photo, text visible via base CSS. ------ */
function initHeroCine(root){
  const hero=$(".hero-cine",root||document);
  if(!hero||hero.dataset.hcInit)return; hero.dataset.hcInit="1";
  const photo=$(".hc-photo",hero);

  /* floating "N days to go" pill — same target date as the main countdown() call */
  const daysEl=$("#hcCdDays",hero);
  if(daysEl){
    const target=new Date("2026-10-26T08:00:00+05:30").getTime();
    const tick=()=>{ daysEl.textContent=String(Math.max(0,Math.ceil((target-Date.now())/86400000))); };
    tick();setInterval(tick,60000);
  }

  if(reducedMotion()||!motionReady||!window.gsap)return;

  gsap.timeline({delay:.1})
    .fromTo(".hc-kicker",{opacity:0,y:12},{opacity:1,y:0,duration:.5})
    .fromTo(".hc-title",{opacity:0,y:22},{opacity:1,y:0,duration:.7},.1)
    .fromTo(".hc-sub",{opacity:0,y:18},{opacity:1,y:0,duration:.6},.28)
    .fromTo(".hc-cta",{opacity:0,y:14},{opacity:1,y:0,duration:.5},.4)
    .fromTo(".hc-chip",{opacity:0,x:20},{opacity:1,x:0,duration:.5,stagger:.12},.4);

  if(photo&&window.ScrollTrigger&&!mqOn("(max-width:900px)")&&!mqOn("(hover:none)")){
    gsap.fromTo(photo,{scale:1.08,yPercent:0},{scale:1.18,yPercent:6,ease:"none",
      scrollTrigger:{trigger:hero,start:"top top",end:"bottom top",scrub:.6}});
  }

  /* phones / touch: skip the parallax scrub and the endless chip drift (chips are hidden <=900px anyway) */
  if(mqOn("(max-width:900px)")||mqOn("(hover:none)"))return;
  const chip1=$("#hcChip1",hero), chip2=$("#hcChip2",hero);
  if(chip1)gsap.to(chip1,{y:-10,duration:2.6,ease:"sine.inOut",yoyo:true,repeat:-1});
  if(chip2)gsap.to(chip2,{y:10,duration:3.1,ease:"sine.inOut",yoyo:true,repeat:-1,delay:.4});
}

/* ---------------------------------------------------------------------
   DISCIPLINES SINGLE-CARD SHOWCASE (Req 9)
   Displays one discipline card at a time with rich info, photo,
   categories, key venues, event counts, deep shadow, and navigation.
   --------------------------------------------------------------------- */
function initDiscShowcase(root){
  const el = $("#discShowcase", root || document);
  if(!el) return;
  const list = disciplines;
  let curIdx = 0;
  const N = list.length;

  function render(idx, animDir){
    const d = list[idx];
    const cnt = events.filter(e => e.discipline.includes(d.slug)).length;
    
    const cardHtml = `
      <article class="disc-single-card" id="discCardActive">
        <div class="disc-single-media">
          <div class="disc-single-photo" style="background-image:url('${photo(d.key, 900)}')" role="img" aria-label="${esc(d.name)}"></div>
          <span class="disc-single-chip"><i data-lucide="${d.icon}"></i> ${esc(d.name)}</span>
        </div>
        <div class="disc-single-body">
          <div class="disc-single-top">
            <span class="kicker"><i data-lucide="${d.icon}"></i> RSFI Discipline 0${idx+1}</span>
            <div class="disc-nav-counter"><span class="cur">0${idx+1}</span> / <span class="total">0${N}</span></div>
          </div>
          <h3 class="disc-single-title">${esc(d.name)}</h3>
          <p class="disc-single-sub">${esc(d.subtitle)}</p>
          <p class="disc-single-desc">${esc(d.desc)}</p>
          
          <div class="disc-single-details">
            <div class="detail-row">
              <span class="detail-label"><i data-lucide="map-pin"></i> Key Venues:</span>
              <span class="detail-val">${esc(d.highlights)}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label"><i data-lucide="users"></i> Categories:</span>
              <span class="detail-val">${esc(d.categories)}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label"><i data-lucide="calendar"></i> District Events:</span>
              <span class="detail-val"><b>${cnt} upcoming event${cnt===1?'':'s'}</b> this season</span>
            </div>
          </div>

          <div class="disc-single-actions">
            <a class="btn btn-primary" href="events.html?d=${encodeURIComponent(d.slug)}" data-magnetic>
              Explore ${esc(d.name)} Events <i data-lucide="arrow-right"></i>
            </a>
            <div class="disc-single-arrows">
              <button class="disc-single-arrow" id="discPrev" type="button" aria-label="Previous discipline"><i data-lucide="chevron-left"></i></button>
              <button class="disc-single-arrow" id="discNext" type="button" aria-label="Next discipline"><i data-lucide="chevron-right"></i></button>
            </div>
          </div>
        </div>
      </article>
    `;

    el.innerHTML = cardHtml;
    icons();

    // Update tab pills
    $$(".disc-pill-tab").forEach((tab, i)=>{
      tab.classList.toggle("active", i === idx);
      tab.setAttribute("aria-selected", String(i === idx));
    });

    if(animDir && motionReady && !reducedMotion()){
      gsap.fromTo("#discCardActive", 
        { opacity: 0, x: animDir > 0 ? 40 : -40 },
        { opacity: 1, x: 0, duration: 0.45, ease: "power3.out" }
      );
    }

    $("#discPrev").addEventListener("click", ()=>goStep(-1));
    $("#discNext").addEventListener("click", ()=>goStep(1));
  }

  function goStep(dir){
    curIdx = (curIdx + dir + N) % N;
    render(curIdx, dir);
  }

  // Generate tab pills
  const tabsContainer = $("#discPillTabs");
  if(tabsContainer){
    tabsContainer.innerHTML = list.map((d, i)=>`
      <button class="disc-pill-tab${i===0?' active':''}" type="button" data-idx="${i}" aria-selected="${i===0}">
        <i data-lucide="${d.icon}"></i> ${esc(d.name)}
      </button>
    `).join("");
    icons();
    $$(".disc-pill-tab", tabsContainer).forEach(btn=>{
      btn.addEventListener("click", ()=>{
        const target = +btn.dataset.idx;
        if(target === curIdx) return;
        const dir = target > curIdx ? 1 : -1;
        curIdx = target;
        render(curIdx, dir);
      });
    });
  }

  render(0, 0);
}

function initDiscCarousel(root){
  if($("#discShowcase", root || document)){
    initDiscShowcase(root);
  }
}

/* ---------------------------------------------------------------------
   CLUB MEDAL STANDINGS WITH SLOT MACHINE REELS (Req 11)
   Replaces athlete results table with recognized clubs and spinning
   slot machine tumbler reels for Gold, Silver, and Bronze medals.
   --------------------------------------------------------------------- */
function initMedalSlotMachine(root){
  const board = $("#clubMedalBoard", root || document);
  if(!board) return;
  const clubsList = medalTable;

  function buildReelHtml(targetNum, type){
    const reelItems = [];
    const count = 16;
    for(let i = 0; i < count - 1; i++){
      reelItems.push((i * 3 + targetNum + 2) % 20);
    }
    reelItems.push(targetNum);

    const itemsHtml = reelItems.map(n => `<span class="slot-num">${n}</span>`).join("");
    return `
      <div class="slot-tumbler slot-${type}" data-target="${targetNum}">
        <div class="slot-reel" data-len="${count}">
          ${itemsHtml}
        </div>
      </div>
    `;
  }

  board.innerHTML = `
    <div class="slot-table">
      <div class="slot-thead">
        <span class="col-rank">Rank</span>
        <span class="col-club">Recognized Club</span>
        <span class="col-medal gold"><span class="m-badge gold">🥇</span> Gold</span>
        <span class="col-medal silver"><span class="m-badge silver">🥈</span> Silver</span>
        <span class="col-medal bronze"><span class="m-badge bronze">🥉</span> Bronze</span>
        <span class="col-total">Total Medals</span>
      </div>
      <div class="slot-tbody">
        ${clubsList.map((c, i)=>{
          const total = c.gold + c.silver + c.bronze;
          const initials = c.club.split(" ").map(w=>w[0]).slice(0,2).join("");
          return `
            <div class="slot-row" data-rank="${i+1}">
              <div class="col-rank">
                <span class="rank-badge rank-${i+1}">#0${i+1}</span>
              </div>
              <div class="col-club">
                <span class="club-badge">${initials}</span>
                <div>
                  <b class="club-name">${esc(c.club)}</b>
                  <small class="club-meta">Affiliated Club · Visakhapatnam District</small>
                </div>
              </div>
              <div class="col-medal gold">
                ${buildReelHtml(c.gold, "gold")}
              </div>
              <div class="col-medal silver">
                ${buildReelHtml(c.silver, "silver")}
              </div>
              <div class="col-medal bronze">
                ${buildReelHtml(c.bronze, "bronze")}
              </div>
              <div class="col-total">
                <span class="total-pill">${total}</span>
              </div>
            </div>
          `;
        }).join("")}
      </div>
    </div>
  `;

  function spinAllReels(){
    const reels = $$(".slot-reel", board);
    const itemHeight = 36;
    reels.forEach((reel, idx)=>{
      const len = +reel.dataset.len || 16;
      const targetY = -(len - 1) * itemHeight;
      const tumbler = reel.closest(".slot-tumbler");
      tumbler && tumbler.classList.add("spinning");

      if(motionReady && !reducedMotion()){
        gsap.set(reel, { y: 0 });
        gsap.to(reel, {
          y: targetY,
          duration: 1.4 + (idx % 3) * 0.3 + Math.floor(idx / 3) * 0.1,
          ease: "back.out(1.2)",
          onComplete: ()=>{
            tumbler && tumbler.classList.remove("spinning");
          }
        });
      } else {
        reel.style.transform = `translateY(${targetY}px)`;
        tumbler && tumbler.classList.remove("spinning");
      }
    });
  }

  if(motionReady && !reducedMotion()){
    ScrollTrigger.create({
      trigger: board,
      start: "top 80%",
      once: true,
      onEnter: ()=> spinAllReels()
    });
  } else {
    spinAllReels();
  }

  const spinBtn = $("#spinMedalsBtn");
  if(spinBtn){
    spinBtn.addEventListener("click", ()=> spinAllReels());
  }
}

/* ---------------------------------------------------------------------
   FLOATING ACTION MENU & MODAL (Req 5 & 6)
   Fixed bottom-right speed dial: Verify Skater ID, WhatsApp, Instagram
   with spring physics animation, and quick ID verification modal.
   --------------------------------------------------------------------- */
function renderFloatingMenu(){
  if($("#vdrsaFloatWidget")) return;
  const floatHtml = `
<div class="vdrsa-float-widget" id="vdrsaFloatWidget">
  <div class="vdrsa-float-menu" id="vdrsaFloatMenu" aria-hidden="true">
    <button class="vdrsa-float-item" id="floatVerifyBtn" type="button" aria-label="Verify Skater ID">
      <span class="vdrsa-float-tooltip">Verify Skater ID</span>
      <span class="vdrsa-float-ic ic-verify"><i data-lucide="shield-check"></i></span>
    </button>
    <a class="vdrsa-float-item" href="https://wa.me/919848012345?text=Hello%20VDRSA%2C%20I%20have%20an%20inquiry%20regarding%20skater%20registration%20and%20events." target="_blank" rel="noopener" aria-label="WhatsApp Support">
      <span class="vdrsa-float-tooltip">WhatsApp Help</span>
      <span class="vdrsa-float-ic ic-wa"><i data-lucide="message-circle"></i></span>
    </a>
    <a class="vdrsa-float-item" href="https://instagram.com/vdrsa_official" target="_blank" rel="noopener" aria-label="Instagram">
      <span class="vdrsa-float-tooltip">Instagram @vdrsa</span>
      <span class="vdrsa-float-ic ic-insta"><i data-lucide="instagram"></i></span>
    </a>
  </div>
  <button class="vdrsa-float-trigger" id="vdrsaFloatTrigger" type="button" aria-label="Quick actions menu" aria-expanded="false">
    <span class="vdrsa-pulse-ring"></span>
    <span class="vdrsa-trigger-ic"><i data-lucide="layers"></i></span>
  </button>
</div>

<!-- Floating Skater ID Verify Modal -->
<div class="vdrsa-modal-scrim" id="verifyModal" aria-hidden="true">
  <div class="vdrsa-modal-card" role="dialog" aria-modal="true" aria-labelledby="modalVerifyTitle">
    <div class="vdrsa-modal-hd">
      <div class="vdrsa-modal-title-wrap">
        <span class="vdrsa-modal-ic"><i data-lucide="shield-check"></i></span>
        <div>
          <h3 id="modalVerifyTitle">Verify Skater ID</h3>
          <p>Instant official district registry verification</p>
        </div>
      </div>
      <button class="vdrsa-modal-close" id="closeVerifyModal" type="button" aria-label="Close modal"><i data-lucide="x"></i></button>
    </div>
    <form id="modalVerifyForm" novalidate>
      <div class="vdrsa-modal-input-row">
        <input class="input" id="modalSid" type="text" placeholder="VDRSA-26-00123" autocomplete="off" autocapitalize="characters" autocorrect="off" spellcheck="false" enterkeyhint="go" aria-label="Skater ID" aria-describedby="modalSidHint">
        <button class="btn btn-primary" id="modalVerifyBtn" type="submit">Verify</button>
      </div>
      <p class="hint" id="modalSidHint">Demo: VDRSA-26-00123 (active) · VDRSA-24-00456 (expired)</p>
      <div class="vresult" id="modalVresult" aria-live="polite"></div>
    </form>
    <div class="vdrsa-modal-ft">
      <a href="verify.html" class="link">Go to full verification page <i data-lucide="arrow-right"></i></a>
    </div>
  </div>
</div>`;

  const div = document.createElement("div");
  div.id = "vdrsaFloatRoot";
  div.innerHTML = floatHtml;
  document.body.appendChild(div);
  icons();

  const widget = $("#vdrsaFloatWidget");
  const trigger = $("#vdrsaFloatTrigger");
  const menu = $("#vdrsaFloatMenu");
  const items = $$(".vdrsa-float-item", menu);
  const verifyModal = $("#verifyModal");
  const openModalBtn = $("#floatVerifyBtn");
  const closeModalBtn = $("#closeVerifyModal");
  let isOpen = false;

  function toggleMenu(open){
    isOpen = (typeof open === "boolean") ? open : !isOpen;
    trigger.setAttribute("aria-expanded", String(isOpen));
    menu.setAttribute("aria-hidden", String(!isOpen));
    trigger.classList.toggle("open", isOpen);
    menu.classList.toggle("open", isOpen);

    if(motionReady && !reducedMotion()){
      if(isOpen){
        gsap.killTweensOf(items);
        gsap.fromTo(items, 
          { scale: 0.3, y: 24, opacity: 0 },
          { scale: 1, y: 0, opacity: 1, duration: 0.35, ease: "back.out(2)", stagger: 0.06 }
        );
        gsap.to(trigger.querySelector(".vdrsa-trigger-ic"), { rotate: 135, duration: 0.3, ease: "power2.out" });
      } else {
        gsap.to(trigger.querySelector(".vdrsa-trigger-ic"), { rotate: 0, duration: 0.25, ease: "power2.in" });
      }
    }
  }

  trigger.addEventListener("click", (e)=>{
    e.stopPropagation();
    toggleMenu();
  });

  document.addEventListener("click", (e)=>{
    if(isOpen && !e.target.closest("#vdrsaFloatWidget")){
      toggleMenu(false);
    }
  });

  function openModal(){
    toggleMenu(false);
    verifyModal.classList.add("open");
    verifyModal.setAttribute("aria-hidden", "false");
    const input = $("#modalSid");
    if(input){ setTimeout(()=>input.focus(), 100); }
    if(motionReady && !reducedMotion()){
      gsap.fromTo(".vdrsa-modal-card", { scale: 0.88, opacity: 0, y: 20 }, { scale: 1, opacity: 1, y: 0, duration: 0.35, ease: "back.out(1.6)" });
    }
  }

  function closeModal(){
    verifyModal.classList.remove("open");
    verifyModal.setAttribute("aria-hidden", "true");
  }

  openModalBtn && openModalBtn.addEventListener("click", openModal);
  closeModalBtn && closeModalBtn.addEventListener("click", closeModal);
  verifyModal.addEventListener("click", (e)=>{
    if(e.target === verifyModal) closeModal();
  });

  document.addEventListener("keydown", (e)=>{
    if(e.key === "Escape"){
      if(verifyModal.classList.contains("open")) closeModal();
      else if(isOpen) toggleMenu(false);
    }
  });

  const modalForm = $("#modalVerifyForm");
  if(modalForm){
    modalForm.onsubmit = function(e){
      e.preventDefault();
      const id = ($("#modalSid").value || "").trim().toUpperCase();
      const btn = $("#modalVerifyBtn"), out = $("#modalVresult");
      if(!id){ $("#modalSid").focus(); toast("Enter a Skater ID."); return; }
      busy(btn, "Checking"); out.className = "vresult";
      setTimeout(()=>{
        idle(btn); out.classList.add("show");
        if(id === "VDRSA-26-00123"){
          out.classList.add("ok");
          out.innerHTML = `<b style="color:var(--success)">Verified — Active Registration</b><div class="vgrid"><div><small>Name</small><b>A. K****</b></div><div><small>Club</small><b>Beach Road SC</b></div><div><small>Category</small><b>Speed · U-14</b></div><div><small>Valid till</small><b>31 Mar 2027</b></div></div>`;
        } else if(id === "VDRSA-24-00456"){
          out.classList.add("warn");
          out.innerHTML = `<b>Registered — Expired on 31 Mar 2025</b><div style="color:var(--muted);margin-top:4px">The club must renew this registration.</div>`;
        } else {
          out.classList.add("bad");
          out.innerHTML = `<b style="color:var(--danger)">No skater found with this ID</b><div style="color:var(--muted);margin-top:4px">Check format: VDRSA-YY-NNNNN.</div>`;
        }
        icons();
      }, 900);
    };
  }
}

/* ---------------------------------------------------------------------
   CUSTOM CURSOR + MAGNETIC BUTTONS — REVISION_V5 §2.
   Only activates for a fine-pointer visitor with no reduced-motion
   preference; touch and reduced-motion visitors never get the extra DOM
   nodes and keep the native cursor. Hover/media states are delegated via
   document-level mouseover/mouseout (never per-element listeners), so
   nodes added later by any page's own render code are covered for free —
   pages do not need to call anything to "register" new media or buttons.
   --------------------------------------------------------------------- */
const CURSOR_HOVER_SEL="a,button,.card,[data-cursor]";
function initCursor(){
  if(document.documentElement.dataset.cursorInit)return;
  if(reducedMotion())return;
  try{ if(!matchMedia("(pointer:fine)").matches)return; }catch(e){return;}
  document.documentElement.dataset.cursorInit="1";

  const ring=document.createElement("div"); ring.className="vdrsa-cursor cursor-ring"; ring.setAttribute("aria-hidden","true");
  const label=document.createElement("span"); label.className="cursor-label";
  ring.appendChild(label);
  const dot=document.createElement("div"); dot.className="vdrsa-cursor cursor-dot"; dot.setAttribute("aria-hidden","true");
  ring.style.opacity="0"; dot.style.opacity="0";
  document.body.appendChild(ring); document.body.appendChild(dot);
  document.documentElement.classList.add("has-cursor");

  let mx=innerWidth/2, my=innerHeight/2, rx=mx, ry=my, raf=null, moved=false;
  function tick(){
    rx+=(mx-rx)*.15; ry+=(my-ry)*.15;
    ring.style.transform=`translate3d(${rx}px,${ry}px,0)`;
    raf=requestAnimationFrame(tick);
  }
  raf=requestAnimationFrame(tick);
  addEventListener("mousemove",e=>{
    mx=e.clientX; my=e.clientY; dot.style.transform=`translate3d(${mx}px,${my}px,0)`;
    if(!moved){ moved=true; ring.style.opacity=""; dot.style.opacity=""; rx=mx; ry=my; }
  },{passive:true});

  document.addEventListener("mouseover",e=>{
    const media=e.target.closest('[data-cursor="view"]');
    if(media){ ring.classList.add("cursor-media"); dot.classList.add("cursor-hide"); label.textContent=media.getAttribute("data-cursor-label")||"View"; return; }
    if(e.target.closest(CURSOR_HOVER_SEL))ring.classList.add("cursor-hover");
  });
  document.addEventListener("mouseout",e=>{
    const to=e.relatedTarget;
    const media=e.target.closest('[data-cursor="view"]');
    if(media&&!(to&&media.contains(to))){ ring.classList.remove("cursor-media"); dot.classList.remove("cursor-hide"); label.textContent=""; }
    const hov=e.target.closest(CURSOR_HOVER_SEL);
    if(hov&&!(to&&hov.contains(to))&&!e.target.closest('[data-cursor="view"]'))ring.classList.remove("cursor-hover");
  });
  addEventListener("mousedown",()=>ring.classList.add("cursor-down"));
  addEventListener("mouseup",()=>ring.classList.remove("cursor-down"));
  document.addEventListener("mouseleave",()=>{ ring.style.opacity="0"; dot.style.opacity="0"; });
  document.addEventListener("mouseenter",()=>{ ring.style.opacity=""; dot.style.opacity=""; });

  /* magnetic — attach a transient mousemove/mouseleave pair only while a
     [data-magnetic] element is actually hovered (still delegated via the
     document mouseover, never a permanent per-element listener) */
  function magMove(e){
    const r=this.getBoundingClientRect();
    const relX=e.clientX-(r.left+r.width/2), relY=e.clientY-(r.top+r.height/2);
    const px=Math.max(-1,Math.min(1,relX/(r.width/2)))*8;
    const py=Math.max(-1,Math.min(1,relY/(r.height/2)))*8;
    this.style.transform=`translate3d(${px}px,${py}px,0)`;
  }
  function magLeave(){
    this.style.transform="";
    this.removeEventListener("mousemove",magMove);
    this.removeEventListener("mouseleave",magLeave);
    this._magActive=false;
  }
  document.addEventListener("mouseover",e=>{
    const m=e.target.closest("[data-magnetic]");
    if(m&&!m._magActive){ m._magActive=true; m.addEventListener("mousemove",magMove); m.addEventListener("mouseleave",magLeave); }
  });
}

/* ---------------------------------------------------------------------
   TOAST / BUSY / IDLE
   --------------------------------------------------------------------- */
function toast(m){
  let t=$("#toast");
  if(!t){t=document.createElement("div");t.className="toast";t.id="toast";t.setAttribute("role","status");document.body.appendChild(t);}
  t.textContent=m;t.classList.add("show");
  clearTimeout(t._h);t._h=setTimeout(()=>t.classList.remove("show"),2600);
}
function busy(btn,label){if(!btn)return;btn.dataset.label=btn.innerHTML;btn.disabled=true;btn.innerHTML=`<span class="btn-spin" aria-hidden="true"></span>${label}`;}
function idle(btn){if(!btn)return;btn.disabled=false;btn.innerHTML=btn.dataset.label;}

/* ---------------------------------------------------------------------
   OPTIONAL COUNTDOWN HELPER (used by hero / registration cards)
   ids: `${prefix}-d`, `${prefix}-h`, `${prefix}-m`, `${prefix}-s`
   --------------------------------------------------------------------- */
function countdown(prefix,targetIso){
  const target=new Date(targetIso).getTime();
  function tick(){
    let d=Math.max(0,target-Date.now())/1000;
    [86400,3600,60,1].forEach((s,i)=>{
      const v=Math.floor(d/s);d-=v*s;
      const el=$("#"+prefix+"-"+"dhms"[i]);
      if(el)el.textContent=String(v).padStart(2,"0");
    });
  }
  tick();setInterval(tick,1000);
}

/* ---------------------------------------------------------------------
   BOOT
   --------------------------------------------------------------------- */
function boot(){
  renderHeader();
  renderFooter();
  renderFloatingMenu();
  initLoader();
  initThemeLang();
  initHeaderBehaviour();
  initMotion();
  initCursor();
  icons();
  animate(document);
  initDeck(document);
  initHeroCine(document);
  initDiscShowcase(document);
  initMedalSlotMachine(document);
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",boot);
else boot();

/* ---------------------------------------------------------------------
   JOURNEY TIMELINE (horizontal) — a sideways track of stops on a dashed
   route. The track scrolls inside its own overflow-x container (snap,
   drag/swipe, arrows, trackpad) — the page never scrolls sideways and is
   never pinned. The lime segment of the route (an SVG mask whose
   dashoffset follows the scroll position) reaches the stop nearest the
   track centre; the rest stays faint. Reduced motion: static, fully lime.
   --------------------------------------------------------------------- */
function journey(root){
  if(!root||root.dataset.jtInit)return; root.dataset.jtInit="1";
  const track=$(".jt-track",root), rail=$(".jt-rail",root), svg=$(".jt-svg",root);
  const base=$("#jtTrack",root), line=$("#jtLine",root), mask=$("#jtMaskPath",root);
  const prev=$('[data-jt="prev"]',root), next=$('[data-jt="next"]',root);
  if(!track||!rail||!svg||!base||!line||!mask)return;
  const still=reducedMotion();
  let xs=[], nodes=[], len=0, prog=still?1:0;

  function apply(){ mask.style.strokeDashoffset=String(len*(1-prog)); }
  function update(){
    const max=track.scrollWidth-track.clientWidth, sl=track.scrollLeft;
    if(prev)prev.disabled=sl<=2; if(next)next.disabled=sl>=max-2;
    if(!xs.length)return;
    const x0=xs[0], xN=xs[xs.length-1];
    let anchor=sl+track.clientWidth/2;
    if(sl>=max-2)anchor=xN;
    anchor=Math.max(x0,Math.min(xN,anchor));
    let act=0;
    xs.forEach((x,i)=>{ if(Math.abs(x-anchor)<Math.abs(xs[act]-anchor))act=i; });
    nodes.forEach((n,i)=>{
      n.classList.toggle("is-on",still||xs[i]<=anchor+6);
      n.classList.toggle("is-active",!still&&i===act);
    });
    if(!still){ prog=(anchor-x0)/Math.max(1,xN-x0); apply(); }
  }
  function build(){
    const stops=$$("[data-stop]",root);
    /* equalise the above/below rows so every node sits on one horizontal line */
    rail.style.removeProperty("--ah"); rail.style.removeProperty("--bh");
    let ah=0,bh=0;
    stops.forEach(s=>{
      const c=$(".jt-card",s); if(!c)return;
      const g=parseFloat(getComputedStyle(c).marginTop)+parseFloat(getComputedStyle(c).marginBottom);
      if(s.classList.contains("jt-up"))ah=Math.max(ah,c.offsetHeight+g); else bh=Math.max(bh,c.offsetHeight+g);
    });
    rail.style.setProperty("--ah",ah+"px"); rail.style.setProperty("--bh",bh+"px");
    const R=rail.getBoundingClientRect(), W=rail.offsetWidth, H=rail.offsetHeight;
    nodes=stops.map(s=>$(".jt-node",s));
    const pts=nodes.map(n=>{const b=n.getBoundingClientRect();return{x:b.left-R.left+b.width/2,y:b.top-R.top+b.height/2}});
    xs=pts.map(p=>p.x);
    if(pts.length<2)return;
    /* gentle wave between nodes; nodes themselves stay on the line */
    const amp=9, all=[pts[0]];
    for(let i=0;i<pts.length-1;i++){
      all.push({x:(pts[i].x+pts[i+1].x)/2,y:(pts[i].y+pts[i+1].y)/2+(i%2?-amp:amp)});
      all.push(pts[i+1]);
    }
    const f=v=>v.toFixed(1), k=.2;
    let d="M"+f(all[0].x)+" "+f(all[0].y);
    for(let i=0;i<all.length-1;i++){
      const p0=all[i-1]||all[i], p1=all[i], p2=all[i+1], p3=all[i+2]||p2;
      d+=" C"+f(p1.x+(p2.x-p0.x)*k)+" "+f(p1.y+(p2.y-p0.y)*k)+","+
        f(p2.x-(p3.x-p1.x)*k)+" "+f(p2.y-(p3.y-p1.y)*k)+","+f(p2.x)+" "+f(p2.y);
    }
    svg.setAttribute("viewBox","0 0 "+W+" "+H); svg.setAttribute("width",W); svg.setAttribute("height",H);
    [base,line,mask].forEach(p=>p.setAttribute("d",d));
    len=mask.getTotalLength(); mask.style.strokeDasharray=len+" "+len;
    apply(); update();
  }

  /* arrows: move to the previous / next stop */
  function go(dir){
    const c=track.scrollLeft+track.clientWidth/2;
    let t=null;
    if(dir>0)t=xs.find(x=>x>c+8); else for(let i=xs.length-1;i>=0;i--){ if(xs[i]<c-8){t=xs[i];break} }
    if(t==null)return;
    track.scrollTo({left:t-track.clientWidth/2,behavior:still?"auto":"smooth"});
  }
  if(prev)prev.addEventListener("click",()=>go(-1));
  if(next)next.addEventListener("click",()=>go(1));

  /* mouse drag (touch and trackpads scroll natively) */
  let dragging=false,sx=0,sl0=0,moved=0;
  track.addEventListener("pointerdown",e=>{
    if(e.pointerType!=="mouse"||e.button!==0)return;
    dragging=true;moved=0;sx=e.clientX;sl0=track.scrollLeft;
  });
  addEventListener("pointermove",e=>{
    if(!dragging)return;
    const dx=e.clientX-sx; moved=Math.max(moved,Math.abs(dx));
    if(moved>5)track.classList.add("is-drag");
    track.scrollLeft=sl0-dx;
  });
  function endDrag(){
    if(!dragging)return; dragging=false;
    if(!track.classList.contains("is-drag"))return;
    /* re-enable snap and glide to the nearest stop */
    const c=track.scrollLeft+track.clientWidth/2;
    let t=xs[0]; xs.forEach(x=>{ if(Math.abs(x-c)<Math.abs(t-c))t=x; });
    track.classList.remove("is-drag");
    track.scrollTo({left:t-track.clientWidth/2,behavior:still?"auto":"smooth"});
  }
  addEventListener("pointerup",endDrag); addEventListener("pointercancel",endDrag);
  track.addEventListener("click",e=>{ if(moved>5){e.preventDefault();e.stopPropagation();moved=0} },true);

  track.addEventListener("scroll",()=>requestAnimationFrame(update),{passive:true});
  let raf=0;
  const rebuild=()=>{cancelAnimationFrame(raf);raf=requestAnimationFrame(build)};
  addEventListener("resize",rebuild);
  if(window.ResizeObserver)new ResizeObserver(rebuild).observe(rail);
  addEventListener("load",()=>setTimeout(rebuild,350),{once:true});
  build();
}

/* ---------------------------------------------------------------------
   PUBLIC API
   --------------------------------------------------------------------- */
window.VDRSA={
  data,
  disciplines,
  icons,
  toast,
  busy,
  idle,
  observe,
  animate,
  initDiscShowcase,
  initDiscCarousel,
  initMedalSlotMachine,
  renderFloatingMenu,
  tables,
  esc,
  img,
  photo,
  photos:PHOTOS,
  param,
  countdown,
  journey,
  /* REVISION_V5 §2 — no-op hook kept for pages that re-render big media/
     buttons: hover/media/magnetic states are all delegated on `document`
     inside initCursor(), so newly-added [data-cursor]/[data-magnetic]
     nodes are picked up automatically and no re-scan is ever required.
     Call it anyway after a re-render if that ever changes; it is safe
     to call at any time. */
  cursor:function(){}
};

})();
