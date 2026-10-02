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
/* Phones never need 1600px photos: cap requested width by viewport (REVISION_V10_RESPONSIVE §2.6). */
function capW(w){
  w=w||800;
  try{
    const vw=Math.min(window.innerWidth||9999,(window.screen&&screen.width)||9999);
    if(vw<=760)return Math.min(w,800);
    if(vw<=1100)return Math.min(w,1200);
  }catch(e){}
  return w;
}
function photo(key,w){
  const id=PHOTOS[key];
  if(!id)return img(key,w); // not a known key — treat as a legacy Unsplash id
  return `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${capW(w)}`;
}
function img(id,w){
  if(PHOTOS[id])return photo(id,w);
  return `https://images.unsplash.com/photo-${id}?w=${capW(w||600)}&q=70`;
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

/* Telugu menu labels for the language toggle (elements with .en / .te are switched too) */
const MENU_TE={home:"హోమ్",about:"గురించి",events:"ఈవెంట్లు",results:"ఫలితాలు",circulars:"సర్క్యులర్లు",clubs:"క్లబ్బులు",news:"వార్తలు",contact:"సంప్రదించండి"};
function getLang(){let l="en";try{l=localStorage.getItem("vdrsa-lang")||"en"}catch(e){}return l==="te"?"te":"en";}
function menuLabel(m){return getLang()==="te"&&MENU_TE[m.key]?MENU_TE[m.key]:m.title;}

function renderHeader(){
  const host=$("#site-header");
  if(!host)return;
  const ak=activeKey();
  const menuHtml=MENU.map(m=>`<li><a${m.key===ak?' class="active" aria-current="page"':""} href="${m.href}" data-mkey="${m.key}">${menuLabel(m)}</a></li>`).join("");
  const drawerHtml=MENU.map(m=>`<a class="dr-item" href="${m.href}" data-close data-mkey="${m.key}"${m.key===ak?' aria-current="page"':""}>${menuLabel(m)}</a>`).join("")+`<a class="dr-item" href="verify.html" data-close>Verify ID</a>`;
  host.innerHTML=`
<aside class="rail" aria-label="Site tools">
  <button class="rail-btn" id="railBurger" type="button" aria-label="Open menu" aria-haspopup="dialog" aria-controls="drawer" aria-expanded="false"><i data-lucide="menu"></i></button>
  <button class="rail-btn" id="railSearch" type="button" aria-label="Search events"><i data-lucide="search"></i></button>
  <span class="rail-text" aria-hidden="true">VDRSA · EST. DISTRICT BODY</span>
  <span class="rail-sp" aria-hidden="true"></span>
  <span class="rail-hair" aria-hidden="true"></span>
  <button class="rail-btn" data-theme-toggle type="button" aria-label="Toggle dark mode"><i data-lucide="moon"></i></button>
  <button class="rail-btn" data-lang-toggle type="button" aria-label="Switch language to Telugu">తె</button>
</aside>
<header class="site" id="hdr">
  <div class="wrap hdr">
    <a class="brand" href="index.html" aria-label="VDRSA home">
      <img src="assets/vdrsa-logo.png" alt="VDRSA logo" width="54" height="54" decoding="async">
      <span><b>VDRSA</b><small>Visakhapatnam District Roller Sports Association</small></span>
    </a>
    <ul class="menu">${menuHtml}</ul>
    <div class="hdr-cta">
      <a class="vlink" href="verify.html">Verify ID<i data-lucide="arrow-up-right"></i></a>
      <div class="login" id="login">
        <button class="btn btn-primary btn-sm" id="loginBtn" aria-haspopup="true" aria-expanded="false"><i data-lucide="log-in"></i>Login<i data-lucide="chevron-down"></i></button>
        <div class="login-menu" role="menu">
          <a href="login.html?role=control" role="menuitem"><span class="ic"><i data-lucide="layout-dashboard"></i></span><span><b>Control Room</b><small>Committee and administrators</small></span></a>
          <a href="login.html?role=club" role="menuitem"><span class="ic"><i data-lucide="building-2"></i></span><span><b>Club Portal</b><small>Athletes, entries and documents</small></span></a>
          <a href="login.html?role=parent" role="menuitem"><span class="ic"><i data-lucide="users"></i></span><span><b>Parent Hub</b><small>Your child's events and results</small></span></a>
          <a href="login.html?role=coach" role="menuitem"><span class="ic"><i data-lucide="clipboard-check"></i></span><span><b>Coach Desk</b><small>Attendance, notes and selection</small></span></a>
        </div>
      </div>
      <button class="burger" id="burger" aria-label="Open menu" aria-haspopup="dialog" aria-controls="drawer" aria-expanded="false"><i data-lucide="menu"></i></button>
    </div>
  </div>
</header>
<div class="drawer" id="drawer">
  <div class="scrim" data-close></div>
  <nav role="dialog" aria-modal="true" aria-label="Menu">
    <div class="dr-top"><span>VDRSA · Menu</span><button class="burger" style="display:grid" data-close id="drawerClose" aria-label="Close menu"><i data-lucide="x"></i></button></div>
    ${drawerHtml}
    <a class="dr-item" href="login.html" data-close>Login</a>
    <div class="dr-foot">
      <div class="dr-tools">
        <button class="rail-btn" data-theme-toggle type="button" aria-label="Toggle dark mode"><i data-lucide="moon"></i></button>
        <button class="rail-btn" data-lang-toggle type="button" aria-label="Switch language to Telugu">తె</button>
      </div>
      <span>Affiliated to APRSA · RSFI</span>
      <a href="mailto:office@vdrsa.in">office@vdrsa.in</a>
    </div>
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
        <a class="brand" href="index.html"><img src="assets/vdrsa-logo.png" alt="" width="54" height="54" decoding="async"><span><b>VDRSA</b><small>Visakhapatnam District Roller Sports Association</small></span></a>
        <div class="affil">
          <span><i data-lucide="badge-check"></i>Affiliated to APRSA · RSFI</span>
          <span><i data-lucide="badge-check"></i>APRSA affiliated to RSFI</span>
          <span><i data-lucide="badge-check"></i>RSFI recognized by Govt. of India &amp; IOA</span>
        </div>
        <div class="f-contact">
          <a href="mailto:office@vdrsa.in">office@vdrsa.in</a>
          <a href="contact.html?type=grievance">Grievance desk</a>
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
  <div class="f-mark" aria-hidden="true">VDRSA</div>
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
  setTimeout(hide,1400);
}

/* ---------------------------------------------------------------------
   THEME
   --------------------------------------------------------------------- */
function applyLang(l){
  const r=document.documentElement; r.lang=l==="te"?"te":"en";
  $$("[data-mkey]").forEach(a=>{const m=MENU.find(x=>x.key===a.dataset.mkey);if(m)a.textContent=menuLabel(m);});
  $$("[data-lang-toggle]").forEach(b=>{b.textContent=l==="te"?"EN":"తె";b.setAttribute("aria-label",l==="te"?"Switch language to English":"Switch language to Telugu");});
}
function initThemeLang(){
  try{const t=localStorage.getItem("vdrsa-theme");if(t)document.documentElement.dataset.theme=t}catch(e){}
  document.addEventListener("click",e=>{
    if(e.target.closest("[data-theme-toggle]")){
      const r=document.documentElement;
      const dark=r.dataset.theme?r.dataset.theme==="dark":matchMedia("(prefers-color-scheme:dark)").matches;
      r.dataset.theme=dark?"light":"dark";
      try{localStorage.setItem("vdrsa-theme",r.dataset.theme)}catch(err){}
    }
    if(e.target.closest("[data-lang-toggle]")){
      const l=getLang()==="te"?"en":"te";
      try{localStorage.setItem("vdrsa-lang",l)}catch(err){}
      applyLang(l);
    }
  });
  applyLang(getLang());
}

/* ---------------------------------------------------------------------
   HEADER BEHAVIOUR: login dropdown, full-height menu panel, rail search, esc
   --------------------------------------------------------------------- */
function initHeaderBehaviour(){
  let opener=null;
  const drawer=()=>$("#drawer");
  function openDrawer(from){
    const d=drawer(); if(!d)return;
    opener=from||null; d.classList.add("open");
    $$("[aria-controls='drawer']").forEach(b=>b.setAttribute("aria-expanded","true"));
    const c=$("#drawerClose"); c&&setTimeout(()=>c.focus(),50);
  }
  function closeDrawer(){
    const d=drawer(); if(!d||!d.classList.contains("open"))return;
    d.classList.remove("open");
    $$("[aria-controls='drawer']").forEach(b=>b.setAttribute("aria-expanded","false"));
    if(opener&&opener.offsetParent!==null)opener.focus(); opener=null;
  }
  document.addEventListener("click",e=>{
    const login=$("#login");
    if(login){
      if(e.target.closest("#loginBtn")){
        e.stopPropagation();
        const o=login.classList.toggle("open");
        $("#loginBtn").setAttribute("aria-expanded",o);
      }else if(!e.target.closest(".login-menu")){
        login.classList.remove("open");
        const btn=$("#loginBtn");btn&&btn.setAttribute("aria-expanded","false");
      }
    }
    const bg=e.target.closest("#burger,#railBurger");
    if(bg){ openDrawer(bg); return; }
    if(e.target.closest("[data-close]"))closeDrawer();
    if(e.target.closest("#railSearch")){
      const inp=$(".search input")||$("input[type=search]");
      if(inp){ inp.scrollIntoView({behavior:"smooth",block:"center"}); inp.focus(); }
      else location.href="events.html?focus=search";
    }
  });
  document.addEventListener("keydown",e=>{
    if(e.key==="Escape"){
      const login=$("#login");login&&login.classList.remove("open");
      const btn=$("#loginBtn");btn&&btn.setAttribute("aria-expanded","false");
      closeDrawer();
    }
    if(e.key==="Tab"){
      const d=drawer(); if(!d||!d.classList.contains("open"))return;
      const f=$$("a[href],button",d).filter(x=>x.offsetParent!==null);
      if(!f.length)return;
      const first=f[0], last=f[f.length-1];
      if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}
      else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}
    }
  });
  if(param("focus")==="search"){
    const go=()=>{const inp=$(".search input");inp&&inp.focus();};
    if(document.readyState==="complete")setTimeout(go,300); else addEventListener("load",()=>setTimeout(go,300),{once:true});
  }
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
    if(window.Lenis){
      // Native touch scrolling on phones/tablets (iOS momentum); Lenis only smooths wheel/trackpad.
      lenis=new Lenis({lerp:.1,smoothWheel:true,syncTouch:false,touchMultiplier:1});
      try{ if(matchMedia("(hover:none)").matches) document.documentElement.classList.add("touch-native"); }catch(e){}
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

/* LITE = phones / touch-only devices: skip scrubbed parallax + zoom (REVISION_V10_RESPONSIVE §2.6) */
const LITE=(function(){try{return matchMedia("(max-width:900px)").matches||matchMedia("(hover:none)").matches}catch(e){return false}})();
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
        gsap.fromTo(el,LITE?{y:40,opacity:0}:{x:-90,opacity:0},{x:0,y:0,opacity:1,duration:.9,delay,ease:"back.out(1.7)",scrollTrigger:{trigger:el,...base}});
        break;
      case "right":
        gsap.fromTo(el,LITE?{y:40,opacity:0}:{x:90,opacity:0},{x:0,y:0,opacity:1,duration:.9,delay,ease:"back.out(1.7)",scrollTrigger:{trigger:el,...base}});
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
        if(LITE)break; // no scrubbed transforms on phones (perf) — CSS shows the plain image
        gsap.fromTo(el,{scale:.84,borderRadius:36},{scale:1,borderRadius:16,ease:"none",scrollTrigger:{trigger:el,start:"top bottom",end:"bottom top",scrub:true}});
        break;
    }
  });

  $$("[data-parallax]",root).forEach(el=>{
    if(LITE||el.dataset.parallaxDone)return; el.dataset.parallaxDone="1";
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
   HERO POSTER — REVISION_V10 §4. Headline lines rise from a mask, the
   tilted print drops in (back.out), lower blocks fade up, stamp spins in.
   Idle float is CSS; mouse parallax (max 10px) is added after the entrance.
   No-ops when #heroPoster is absent. Reduced motion: fully static.
   --------------------------------------------------------------------- */
function initHeroPoster(root){
  const hero=$("#heroPoster",root||document);
  if(!hero||hero.dataset.hpInit)return; hero.dataset.hpInit="1";
  /* keep the floating action button off the poster corner while the hero is on screen */
  if("IntersectionObserver" in window){
    new IntersectionObserver(es=>es.forEach(en=>document.body.classList.toggle("hero-in",en.isIntersecting)),{threshold:0}).observe(hero);
  }
  if(reducedMotion()||!motionReady||!window.gsap)return;
  const lines=$$(".hp-line>span",hero), obj=null, stamp=$(".hp-stamp",hero);
  const blocks=$$(".hp-left>*,.hp-spec,.hp-meta",hero);
  gsap.set(lines,{yPercent:115});
  gsap.set(blocks,{opacity:0,y:18});
  if(stamp)gsap.set(stamp,{scale:.4,rotation:-140,opacity:0});
  const tl=gsap.timeline({delay:.15,defaults:{ease:"power3.out"}});
  tl.to(lines,{yPercent:0,duration:.6,stagger:.08},0)
    .to(blocks,{opacity:1,y:0,duration:.5,stagger:.06},.55)
    .to(stamp||{},{scale:1,rotation:0,opacity:1,duration:.7,ease:"back.out(1.6)"},.5);
  tl.eventCallback("onComplete",()=>{
    if(!obj||!matchMedia("(pointer:fine)").matches)return;
    const qx=gsap.quickTo(obj,"x",{duration:.6,ease:"power2.out"}), qy=gsap.quickTo(obj,"y",{duration:.6,ease:"power2.out"});
    hero.addEventListener("mousemove",e=>{
      const r=hero.getBoundingClientRect();
      qx(((e.clientX-r.left)/r.width-.5)*20); qy(((e.clientY-r.top)/r.height-.5)*20);
    },{passive:true});
  });
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
        <input class="input" id="modalSid" placeholder="VDRSA-26-00123" autocomplete="off" autocapitalize="characters" autocorrect="off" spellcheck="false" enterkeyhint="search" aria-describedby="modalSidHint">
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
    if(document.hidden)return; // pause work while the tab is in the background
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
  initHeroPoster(document);
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",boot);
else boot();


/* ---------------------------------------------------------------------
   SKATE ART — REVISION_V11 §2. Flat sticker-style inline SVG, drawn in code.
   skateSVG(): inline speed skate, 380x250 viewBox, facing right, 4 spinning
   wheels (<g class="sk-wheel" data-cx data-cy>). kitSVG(name): companion
   line-up art (quad | stick | board | helmet), 220x200 viewBox.
   Colours: logo blue #0069BE + lotus pink #F55B99; outlines/ink via CSS vars.
   --------------------------------------------------------------------- */
let _skN=0;
function _wheel(cx,cy,r,cls){
  const spokes=[0,1,2,3,4].map(i=>{const a=i*72*Math.PI/180-Math.PI/2,x=cx+Math.cos(a)*r*.56,y=cy+Math.sin(a)*r*.56;return `<line x1="${cx}" y1="${cy}" x2="${x.toFixed(1)}" y2="${y.toFixed(1)}" class="sk-spoke"/>`;}).join("");
  const sa=-70*Math.PI/180,sb=-20*Math.PI/180,R=r*.8;
  const shine=`M${(cx+Math.cos(sa)*R).toFixed(1)},${(cy+Math.sin(sa)*R).toFixed(1)} A${R.toFixed(1)},${R.toFixed(1)} 0 0 1 ${(cx+Math.cos(sb)*R).toFixed(1)},${(cy+Math.sin(sb)*R).toFixed(1)}`;
  return `<g class="sk-wheel ${cls||""}" data-cx="${cx}" data-cy="${cy}"><circle cx="${cx}" cy="${cy}" r="${r}" class="sk-tire sk-o"/><path d="${shine}" class="sk-shine"/><circle cx="${cx}" cy="${cy}" r="${(r*.6).toFixed(1)}" class="sk-hub sk-o"/>${spokes}<circle cx="${cx}" cy="${cy}" r="${(r*.13).toFixed(1)}" class="sk-bolt"/></g>`;
}
function skateSVG(){
  const id="skc"+(++_skN);
  const boot="M104,192 L104,146 C104,120 106,100 114,80 L120,68 C132,60 170,58 204,60 L216,62 C222,82 228,98 246,110 C292,122 352,134 392,152 C412,161 420,176 416,186 C414,190 410,192 404,192 Z";
  let straps="";
  for(let i=0;i<4;i++){const x=252+i*36,y=113+i*9.6;straps+=`<line x1="${x}" y1="${y}" x2="${x-15}" y2="${y+34}" class="sk-lace"/>`;}
  return `<svg class="skate" viewBox="66 44 380 250" role="img" aria-label="Inline speed skate" xmlns="http://www.w3.org/2000/svg">
<defs><clipPath id="${id}"><path d="${boot}"/></clipPath></defs>
<ellipse cx="262" cy="289" rx="170" ry="5" class="sk-shadow"/>
<rect x="84" y="202" width="338" height="22" rx="10" class="sk-frame sk-o"/>
<rect x="126" y="190" width="30" height="14" class="sk-frame sk-o"/><rect x="336" y="190" width="30" height="14" class="sk-frame sk-o"/>
<circle cx="141" cy="213" r="3.2" class="sk-bolt"/><circle cx="351" cy="213" r="3.2" class="sk-bolt"/>
${_wheel(112,246,34)}${_wheel(206,246,34)}${_wheel(300,246,34)}${_wheel(394,246,34)}
<path d="${boot}" class="sk-boot sk-o"/>
<g clip-path="url(#${id})">
<path d="M96,94 C150,86 200,90 226,102 L410,152 L412,182 L96,182 Z" class="sk-blue"/>
<rect x="100" y="60" width="17" height="132" class="sk-pink"/>
<rect x="96" y="183" width="330" height="10" class="sk-sole"/>
<path d="M112,80 L216,72 L218,90 L110,98 Z" class="sk-strap"/>
${straps}
<text x="138" y="158" class="sk-word" transform="rotate(4 138 158)">VDRSA</text>
</g>
<path d="M120,68 C132,60 170,58 204,60" class="sk-pipe"/>
<rect x="196" y="74" width="14" height="12" rx="1" class="sk-buckle sk-o" transform="rotate(-4 203 80)"/>
<path d="${boot}" class="sk-line"/>
</svg>`;
}
function kitSVG(name){
  const W=(cx,cy,r)=>_wheel(cx,cy,r,"sk-kitwheel");
  const head=`<svg class="kit kit-${name}" viewBox="0 0 220 196" xmlns="http://www.w3.org/2000/svg" role="img" aria-label=`;
  if(name==="quad"){
    return head+`"Quad roller skate"><ellipse cx="110" cy="190" rx="86" ry="5" class="sk-shadow"/>
<rect x="44" y="140" width="132" height="14" rx="6" class="sk-frame sk-o"/>
<path d="M50,140 L50,96 C50,78 54,64 60,52 L66,44 C82,38 108,40 124,44 L130,46 C134,64 140,76 152,82 C172,90 186,100 188,116 C190,128 186,140 180,140 Z" class="sk-boot sk-o"/>
<path d="M50,104 C82,96 118,100 134,110 L186,120 L184,138 L50,138 Z" class="sk-blue"/>
<rect x="52" y="132" width="132" height="8" class="sk-sole"/>
<rect x="46" y="60" width="10" height="72" class="sk-pink"/>
<path d="M66,44 C82,38 108,40 124,44" class="sk-pipe"/>
<text x="76" y="124" class="sk-word sk-word-s">VDRSA</text>
${W(70,166,20)}${W(150,166,20)}
<circle cx="70" cy="166" r="0"/></svg>`;
  }
  if(name==="stick"){
    return head+`"Hockey stick and puck"><ellipse cx="110" cy="190" rx="84" ry="5" class="sk-shadow"/>
<path d="M150,16 L166,20 L96,150 L60,170 C52,174 46,166 54,160 L82,142 Z" class="sk-stick sk-o"/>
<path d="M150,16 L166,20 L160,34 L146,30 Z" class="sk-pink sk-o"/>
<path d="M52,166 C56,176 80,180 96,172 L104,166 L86,150 L60,162 Z" class="sk-blue sk-o"/>
<path d="M130,60 L142,64 M116,88 L128,92" class="sk-tape"/>
<ellipse cx="160" cy="176" rx="26" ry="9" class="sk-puck-bot sk-o"/><path d="M134,176 L134,168 A26,9 0 0 1 186,168 L186,176 A26,9 0 0 1 134,176 Z" class="sk-puck sk-o"/><ellipse cx="160" cy="168" rx="26" ry="9" class="sk-puck-top sk-o"/></svg>`;
  }
  if(name==="board"){
    return head+`"Skateboard"><ellipse cx="110" cy="188" rx="88" ry="5" class="sk-shadow"/>
<path d="M22,108 C22,100 30,98 38,106 C50,118 66,124 86,124 L134,124 C154,124 170,118 182,106 C190,98 198,100 198,108 C198,124 176,136 146,138 L74,138 C44,136 22,124 22,108 Z" class="sk-boot sk-o"/>
<path d="M62,127 L158,127 L158,134 L62,134 Z" class="sk-blue"/>
<circle cx="110" cy="130.5" r="0"/><text x="110" y="133.4" text-anchor="middle" class="sk-word sk-word-xs">VDRSA</text>
<rect x="56" y="138" width="22" height="10" class="sk-frame sk-o"/><rect x="142" y="138" width="22" height="10" class="sk-frame sk-o"/>
${W(67,162,20)}${W(153,162,20)}</svg>`;
  }
  /* helmet */
  return head+`"Safety helmet"><ellipse cx="110" cy="188" rx="72" ry="5" class="sk-shadow"/>
<path d="M36,138 C30,84 62,44 112,42 C160,42 190,82 184,138 Z" class="sk-blue sk-o"/>
<path d="M36,138 L184,138 L182,150 C160,158 60,158 38,150 Z" class="sk-pink sk-o"/>
<path d="M112,42 C104,74 104,110 110,138 M112,42 C126,70 132,106 128,138 M112,42 C86,66 74,100 70,138" class="sk-vent"/>
<path d="M112,42 C160,42 190,82 184,138 L150,138 C154,96 140,60 112,42 Z" class="sk-shine2"/>
<path d="M62,150 C66,176 84,184 96,178 M158,150 C154,176 136,184 124,178" class="sk-vent"/>
<rect x="100" y="172" width="20" height="14" rx="2" class="sk-buckle sk-o"/></svg>`;
}

/* ---------------------------------------------------------------------
   PUBLIC API
   --------------------------------------------------------------------- */
window.VDRSA={
  skateSVG,
  kitSVG,
  reducedMotion,
  data,
  disciplines,
  icons,
  toast,
  busy,
  idle,
  observe,
  animate,
  renderFloatingMenu,
  tables,
  esc,
  img,
  photo,
  photos:PHOTOS,
  param,
  countdown,
  /* REVISION_V5 §2 — no-op hook kept for pages that re-render big media/
     buttons: hover/media/magnetic states are all delegated on `document`
     inside initCursor(), so newly-added [data-cursor]/[data-magnetic]
     nodes are picked up automatically and no re-scan is ever required.
     Call it anyway after a re-render if that ever changes; it is safe
     to call at any time. */
  cursor:function(){}
};

})();
