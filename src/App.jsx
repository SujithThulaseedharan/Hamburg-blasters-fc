import React, { useState, useEffect, useRef, useCallback } from "react";

/* ── Particle canvas ── */
function Particles({ count = 60 }) {
  const canvasRef = useRef(null);
  useEffect(() => {
    const c = canvasRef.current; if (!c) return;
    const ctx = c.getContext("2d");
    let raf;
    const resize = () => { c.width = c.offsetWidth; c.height = c.offsetHeight; };
    resize();
    window.addEventListener("resize", resize);
    const pts = Array.from({ length: count }, () => ({
      x: Math.random() * c.width, y: Math.random() * c.height,
      vx: (Math.random() - 0.5) * 0.35, vy: (Math.random() - 0.5) * 0.35,
      r: Math.random() * 1.8 + 0.4,
      a: Math.random(),
    }));
    const draw = () => {
      ctx.clearRect(0, 0, c.width, c.height);
      pts.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = c.width; if (p.x > c.width) p.x = 0;
        if (p.y < 0) p.y = c.height; if (p.y > c.height) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(245,196,0,${p.a * 0.5})`;
        ctx.fill();
      });
      pts.forEach((p, i) => {
        for (let j = i + 1; j < pts.length; j++) {
          const d = Math.hypot(p.x - pts[j].x, p.y - pts[j].y);
          if (d < 110) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y); ctx.lineTo(pts[j].x, pts[j].y);
            ctx.strokeStyle = `rgba(245,196,0,${(1 - d / 110) * 0.12})`;
            ctx.lineWidth = 0.5; ctx.stroke();
          }
        }
      });
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, [count]);
  return <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }} />;
}

/* ── Animated counter ── */
function Counter({ target, suffix = "" }) {
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        let start = 0;
        const step = () => { start += Math.ceil(target / 40); if (start >= target) { setVal(target); return; } setVal(start); requestAnimationFrame(step); };
        requestAnimationFrame(step);
        obs.disconnect();
      }
    }, { threshold: 0.5 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [target]);
  return <span ref={ref}>{val}{suffix}</span>;
}

const NAV = ["Home","About","Team","Fixtures","Gallery","News","Sponsors","Join Us","Contact"];

const PLAYERS = [
  { name:"Arjun Nair", pos:"GK", no:1, g:0, a:0 },
  { name:"Rahul Menon", pos:"CB", no:4, g:2, a:1 },
  { name:"Vishnu Krishnan", pos:"LB", no:3, g:1, a:3 },
  { name:"Amal George", pos:"RB", no:2, g:0, a:4 },
  { name:"Sijo Mathew", pos:"CM", no:8, g:5, a:6 },
  { name:"Dibin Philip", pos:"CM", no:6, g:3, a:5 },
  { name:"Tom Varghese", pos:"AM", no:10, g:11, a:8, cap:true },
  { name:"Jithin Jose", pos:"LW", no:11, g:7, a:4 },
  { name:"Akhil Suresh", pos:"RW", no:7, g:9, a:3 },
  { name:"Bibin Thomas", pos:"ST", no:9, g:14, a:2 },
  { name:"Anoop Kurian", pos:"ST", no:19, g:6, a:5 },
];

const FIXTURES = [
  { date:"Jun 22", opp:"Kerala Stars HH", venue:"Sportpark Eilbek", type:"KEFF" },
  { date:"Jul 05", opp:"Desi FC Hamburg", venue:"Hoheluftpark", type:"Friendly" },
  { date:"Jul 19", opp:"Malabar United", venue:"Sportpark Eilbek", type:"KEFF Cup" },
];

const RESULTS = [
  { date:"May 11", opp:"Kerala Stars HH", score:"3–1", res:"W" },
  { date:"Apr 27", opp:"Gulf Ballers HH", score:"2–2", res:"D" },
  { date:"Apr 13", opp:"Malabar United", score:"4–0", res:"W" },
  { date:"Mar 30", opp:"NRK FC", score:"1–3", res:"L" },
];

const NEWS = [
  { tag:"Tournament", date:"Jun 01, 2025", title:"KEFF Summer 2025 – Blasters Registered!", body:"Hamburg Blasters FC has officially entered the KEFF Summer Tournament 2025, ready to face top Malayali clubs across Germany." },
  { tag:"Sponsor", date:"May 15, 2025", title:"NILA Restaurant Extends Sponsorship", body:"NILA South Indian – Kerala Restaurant has renewed their main sponsorship, continuing a proud and growing partnership with the club." },
  { tag:"Match Report", date:"May 11, 2025", title:"Blasters Win 3–1 vs Kerala Stars HH", body:"Dominant display at Sportpark Eilbek. Captain Tom Varghese led the team with outstanding performance from first whistle to last." },
];

export default function App() {
  const [active, setActive] = useState("Home");
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [lang, setLang] = useState("EN");
  const [joinType, setJoinType] = useState("player");
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name:"", email:"", msg:"" });
  const [fixtureTab, setFixtureTab] = useState("upcoming");

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const go = (id) => {
    setActive(id); setMenuOpen(false);
    document.getElementById(id.toLowerCase().replace(/ /g,"-"))?.scrollIntoView({ behavior:"smooth" });
  };
  const t = (en, de) => lang === "DE" ? de : en;

  return (
    <div style={{ fontFamily:"'Barlow Condensed',sans-serif", background:"#050810", color:"#fff", minHeight:"100vh" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@300;400;500;600;700;800;900&family=Barlow:wght@300;400;500;600&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        ::-webkit-scrollbar{width:3px}
        ::-webkit-scrollbar-thumb{background:#f5c400}
        ::selection{background:#f5c400;color:#050810}

        /* NEON GLOW GOLD */
        .glow{text-shadow:0 0 20px rgba(245,196,0,0.8),0 0 40px rgba(245,196,0,0.4),0 0 80px rgba(245,196,0,0.2)}
        .glow-box{box-shadow:0 0 0 1px rgba(245,196,0,0.5),0 0 30px rgba(245,196,0,0.2),0 0 60px rgba(245,196,0,0.08)}
        .glow-blue{box-shadow:0 0 0 1px rgba(30,120,255,0.5),0 0 30px rgba(30,120,255,0.2)}

        /* BUTTONS */
        .btn-g{
          display:inline-flex;align-items:center;gap:8px;
          background:linear-gradient(135deg,#f5c400,#d4a000);
          color:#050810;border:none;padding:14px 32px;
          font-family:'Barlow Condensed',sans-serif;font-weight:800;font-size:13px;
          letter-spacing:.14em;text-transform:uppercase;cursor:pointer;
          clip-path:polygon(10px 0%,100% 0%,calc(100% - 10px) 100%,0% 100%);
          transition:all .25s;position:relative;overflow:hidden;
        }
        .btn-g::before{content:'';position:absolute;inset:0;background:linear-gradient(135deg,rgba(255,255,255,.25),transparent);opacity:0;transition:opacity .2s}
        .btn-g:hover{transform:translateY(-3px);box-shadow:0 12px 30px rgba(245,196,0,.4)}
        .btn-g:hover::before{opacity:1}
        .btn-o{
          display:inline-flex;align-items:center;gap:8px;
          background:transparent;color:#f5c400;
          border:1.5px solid rgba(245,196,0,.6);
          padding:12px 30px;font-family:'Barlow Condensed',sans-serif;
          font-weight:800;font-size:13px;letter-spacing:.14em;text-transform:uppercase;
          cursor:pointer;clip-path:polygon(10px 0%,100% 0%,calc(100% - 10px) 100%,0% 100%);
          transition:all .25s;
        }
        .btn-o:hover{background:rgba(245,196,0,.12);border-color:#f5c400;transform:translateY(-3px)}
        .btn-b{
          display:inline-flex;align-items:center;gap:8px;
          background:linear-gradient(135deg,#1a6fff,#0a40cc);
          color:#fff;border:none;padding:14px 32px;
          font-family:'Barlow Condensed',sans-serif;font-weight:800;font-size:13px;
          letter-spacing:.14em;text-transform:uppercase;cursor:pointer;
          clip-path:polygon(10px 0%,100% 0%,calc(100% - 10px) 100%,0% 100%);
          transition:all .25s;
        }
        .btn-b:hover{transform:translateY(-3px);box-shadow:0 12px 30px rgba(30,100,255,.4)}

        /* NAV */
        .nl{font-size:11px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;
          color:rgba(255,255,255,.6);cursor:pointer;padding:4px 2px;transition:color .2s;
          position:relative}
        .nl::after{content:'';position:absolute;bottom:-4px;left:0;width:0;height:2px;
          background:#f5c400;transition:width .3s;box-shadow:0 0 8px #f5c400}
        .nl:hover,.nl.on{color:#f5c400}
        .nl:hover::after,.nl.on::after{width:100%}

        /* CARDS */
        .card{
          background:rgba(255,255,255,.04);
          border:1px solid rgba(255,255,255,.07);
          border-radius:4px;
          transition:all .3s;
        }
        .card:hover{
          background:rgba(245,196,0,.05);
          border-color:rgba(245,196,0,.35);
          transform:translateY(-5px);
          box-shadow:0 20px 50px rgba(0,0,0,.4),0 0 0 1px rgba(245,196,0,.2);
        }

        /* PLAYER CARD */
        .pcard{
          background:linear-gradient(145deg,rgba(12,18,40,.9),rgba(5,8,16,.95));
          border:1px solid rgba(245,196,0,.12);border-radius:4px;
          transition:all .35s;position:relative;overflow:hidden;
        }
        .pcard::before{content:'';position:absolute;inset:0;
          background:linear-gradient(135deg,rgba(245,196,0,.06) 0%,transparent 50%);
          opacity:0;transition:opacity .35s}
        .pcard:hover{border-color:rgba(245,196,0,.7);transform:translateY(-8px);
          box-shadow:0 25px 60px rgba(0,0,0,.5),0 0 30px rgba(245,196,0,.15)}
        .pcard:hover::before{opacity:1}

        /* INPUTS */
        .inp{width:100%;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.1);
          color:#fff;padding:13px 16px;font-family:'Barlow',sans-serif;font-size:14px;
          border-radius:3px;transition:all .2s;outline:none}
        .inp:focus{border-color:#f5c400;background:rgba(245,196,0,.06);
          box-shadow:0 0 0 2px rgba(245,196,0,.15)}
        .inp::placeholder{color:rgba(255,255,255,.3)}

        /* SECTION LABEL */
        .slabel{font-size:11px;font-weight:700;letter-spacing:.3em;text-transform:uppercase;
          color:#f5c400;display:flex;align-items:center;gap:10px}
        .slabel::before{content:'';display:block;width:30px;height:2px;
          background:linear-gradient(90deg,#f5c400,transparent);
          box-shadow:0 0 8px rgba(245,196,0,.5)}

        /* RESULT BADGES */
        .rW{background:rgba(34,197,94,.15);color:#4ade80;border:1px solid rgba(34,197,94,.3)}
        .rD{background:rgba(245,196,0,.15);color:#f5c400;border:1px solid rgba(245,196,0,.3)}
        .rL{background:rgba(239,68,68,.15);color:#f87171;border:1px solid rgba(239,68,68,.3)}

        /* DIAGONAL STRIPE */
        .stripe{background:repeating-linear-gradient(-45deg,transparent,transparent 5px,rgba(245,196,0,.04) 5px,rgba(245,196,0,.04) 10px)}

        /* SCAN LINE EFFECT */
        .scanlines::after{content:'';position:absolute;inset:0;pointer-events:none;
          background:repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,.07) 2px,rgba(0,0,0,.07) 4px);
          z-index:1}

        /* ANIMATIONS */
        @keyframes fadeUp{from{opacity:0;transform:translateY(40px)}to{opacity:1;transform:translateY(0)}}
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}
        @keyframes rotSlow{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
        @keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}
        .afu{animation:fadeUp .7s ease forwards}
        .afu1{animation:fadeUp .7s .1s ease both}
        .afu2{animation:fadeUp .7s .25s ease both}
        .afu3{animation:fadeUp .7s .4s ease both}
        .afu4{animation:fadeUp .7s .55s ease both}
        .afu5{animation:fadeUp .7s .7s ease both}
        .pulse{animation:pulse 2s infinite}

        /* GRADIENT TEXT */
        .grad-text{background:linear-gradient(135deg,#f5c400 0%,#fff 50%,#f5c400 100%);
          background-size:200% auto;-webkit-background-clip:text;-webkit-text-fill-color:transparent;
          background-clip:text;animation:shimmer 4s linear infinite}

        /* TABS */
        .tab{font-family:'Barlow Condensed',sans-serif;font-weight:700;font-size:11px;
          letter-spacing:.15em;text-transform:uppercase;padding:9px 20px;
          border:1px solid rgba(255,255,255,.12);background:transparent;
          color:rgba(255,255,255,.5);cursor:pointer;transition:all .2s;border-radius:2px}
        .tab.on,.tab:hover{background:#f5c400;color:#050810;border-color:#f5c400;
          box-shadow:0 0 15px rgba(245,196,0,.3)}

        section{padding:90px 0}
        .wrap{max-width:1300px;margin:0 auto;padding:0 28px}

        /* HEXAGON */
        .hex{clip-path:polygon(50% 0%,95% 25%,95% 75%,50% 100%,5% 75%,5% 25%)}

        /* DIVIDER */
        .divg{height:2px;background:linear-gradient(90deg,transparent,#f5c400,#1a6fff,transparent)}

        /* LIVE BADGE */
        .live{display:inline-flex;align-items:center;gap:5px;background:rgba(239,68,68,.15);
          border:1px solid rgba(239,68,68,.4);color:#f87171;font-size:9px;font-weight:800;
          letter-spacing:.15em;padding:3px 8px;border-radius:2px}
        .live-dot{width:6px;height:6px;border-radius:50%;background:#ef4444;animation:pulse 1s infinite}

        @media(max-width:900px){
          .desk{display:none!important}
          .mob{display:flex!important}
          section{padding:64px 0}
        }
        @media(min-width:901px){.mob{display:none!important}}
      `}</style>

      {/* ═══ NAV ═══ */}
      <nav style={{
        position:"fixed",top:0,left:0,right:0,zIndex:100,
        background: scrolled ? "rgba(5,8,16,.96)" : "transparent",
        backdropFilter: scrolled ? "blur(24px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(245,196,0,.18)" : "none",
        boxShadow: scrolled ? "0 4px 40px rgba(0,0,0,.5)" : "none",
        transition:"all .4s ease",padding:"0 28px",
      }}>
        <div style={{ maxWidth:1300, margin:"0 auto", display:"flex", alignItems:"center", justifyContent:"space-between", height:70 }}>
          {/* Logo */}
          <div style={{ display:"flex", alignItems:"center", gap:14, cursor:"pointer" }} onClick={()=>go("Home")}>
            <div style={{
              width:46,height:46,background:"linear-gradient(135deg,#f5c400,#d4a000)",
              clipPath:"polygon(50% 0%,95% 25%,95% 75%,50% 100%,5% 75%,5% 25%)",
              display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,
              flexShrink:0,boxShadow:"0 0 20px rgba(245,196,0,.35)",
            }}>⚽</div>
            <div>
              <div style={{ fontWeight:900, fontSize:15, letterSpacing:".06em", color:"#f5c400", lineHeight:1, textShadow:"0 0 15px rgba(245,196,0,.4)" }}>HAMBURG BLASTERS</div>
              <div style={{ fontSize:9, letterSpacing:".2em", color:"rgba(255,255,255,.4)", fontWeight:600 }}>FOOTBALL CLUB · KEFF</div>
            </div>
          </div>
          {/* Links */}
          <div className="desk" style={{ display:"flex", gap:22, alignItems:"center" }}>
            {NAV.map(n => <span key={n} className={`nl ${active===n?"on":""}`} onClick={()=>go(n)}>{n}</span>)}
          </div>
          <div style={{ display:"flex", gap:10, alignItems:"center" }}>
            <button onClick={()=>setLang(l=>l==="EN"?"DE":"EN")} style={{
              background:"rgba(245,196,0,.1)",border:"1px solid rgba(245,196,0,.3)",
              color:"#f5c400",padding:"5px 11px",fontSize:10,fontWeight:700,
              letterSpacing:".12em",cursor:"pointer",borderRadius:2,
              fontFamily:"'Barlow Condensed',sans-serif",transition:"all .2s",
            }} onMouseEnter={e=>e.currentTarget.style.background="rgba(245,196,0,.2)"} onMouseLeave={e=>e.currentTarget.style.background="rgba(245,196,0,.1)"}>
              {lang==="EN"?"🇩🇪 DE":"🇬🇧 EN"}
            </button>
            <button className="mob" onClick={()=>setMenuOpen(o=>!o)} style={{ background:"none",border:"1px solid rgba(245,196,0,.3)",color:"#f5c400",width:38,height:38,cursor:"pointer",fontSize:18,display:"flex",alignItems:"center",justifyContent:"center",borderRadius:3 }}>
              {menuOpen?"✕":"☰"}
            </button>
          </div>
        </div>
        {menuOpen && (
          <div style={{ background:"rgba(5,8,16,.98)",borderTop:"1px solid rgba(245,196,0,.15)",padding:"20px 28px",display:"flex",flexDirection:"column",gap:14 }}>
            {NAV.map(n => <span key={n} onClick={()=>go(n)} style={{ fontSize:16,fontWeight:700,letterSpacing:".08em",textTransform:"uppercase",color: active===n?"#f5c400":"rgba(255,255,255,.7)",cursor:"pointer",padding:"6px 0",borderBottom:"1px solid rgba(255,255,255,.05)" }}>{n}</span>)}
          </div>
        )}
      </nav>

      {/* ═══ HERO ═══ */}
      <section id="home" style={{ minHeight:"100vh",position:"relative",display:"flex",flexDirection:"column",justifyContent:"center",overflow:"hidden",padding:0,background:"#050810" }}>
        <Particles count={70} />
        {/* BG layers */}
        <div style={{ position:"absolute",inset:0,background:"radial-gradient(ellipse 80% 60% at 50% 40%,rgba(245,196,0,.07) 0%,transparent 70%)",zIndex:1 }}/>
        <div style={{ position:"absolute",top:"-20%",right:"-15%",width:"70vw",height:"70vw",maxWidth:900,background:"radial-gradient(circle,rgba(30,100,255,.1) 0%,transparent 65%)",borderRadius:"50%",filter:"blur(60px)",zIndex:1 }}/>
        <div style={{ position:"absolute",bottom:"-10%",left:"-10%",width:"50vw",height:"50vw",maxWidth:700,background:"radial-gradient(circle,rgba(245,196,0,.07) 0%,transparent 65%)",borderRadius:"50%",filter:"blur(60px)",zIndex:1 }}/>
        {/* Pitch circle decoration */}
        <div style={{ position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",width:"min(70vw,800px)",height:"min(70vw,800px)",borderRadius:"50%",border:"1px solid rgba(255,255,255,.03)",zIndex:1 }}/>
        <div style={{ position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",width:"min(50vw,550px)",height:"min(50vw,550px)",borderRadius:"50%",border:"1px solid rgba(245,196,0,.04)",zIndex:1 }}/>

        <div className="wrap" style={{ position:"relative",zIndex:2,textAlign:"center",paddingTop:100,paddingBottom:80 }}>
          {/* Shield */}
          <div className="afu1" style={{ marginBottom:28 }}>
            <div style={{
              width:140,height:140,margin:"0 auto",
              background:"linear-gradient(135deg,#f5c400 0%,#d4a000 50%,#f5c400 100%)",
              backgroundSize:"200% 200%",animation:"shimmer 3s linear infinite",
              clipPath:"polygon(50% 0%,95% 15%,100% 50%,95% 85%,50% 100%,5% 85%,0% 50%,5% 15%)",
              display:"flex",alignItems:"center",justifyContent:"center",fontSize:56,
              filter:"drop-shadow(0 0 30px rgba(245,196,0,.6)) drop-shadow(0 0 60px rgba(245,196,0,.3))",
            }}>⚽</div>
          </div>

          <div className="slabel afu2" style={{ justifyContent:"center",marginBottom:16 }}>
            Hamburg · Germany · KEFF Affiliated
          </div>

          <h1 className="afu3" style={{ fontSize:"clamp(56px,12vw,140px)",fontWeight:900,lineHeight:.88,textTransform:"uppercase",letterSpacing:"-.01em" }}>
            <span className="grad-text">HAMBURG</span><br/>
            <span style={{ color:"rgba(255,255,255,.08)",WebkitTextStroke:"1px rgba(255,255,255,.15)",fontSize:"clamp(40px,8vw,100px)" }}>BLASTERS</span><br/>
            <span style={{ fontSize:"clamp(32px,6vw,72px)",fontWeight:900,letterSpacing:".1em",color:"#1a6fff",textShadow:"0 0 30px rgba(30,100,255,.6)" }}>FC</span>
          </h1>

          <p className="afu4" style={{ fontFamily:"'Barlow',sans-serif",fontWeight:300,fontSize:"clamp(13px,2vw,18px)",color:"rgba(255,255,255,.55)",marginTop:24,letterSpacing:".2em",textTransform:"uppercase" }}>
            {t("United by Passion · Driven by Football","Vereint durch Leidenschaft · Angetrieben durch Fußball")}
          </p>

          <div className="afu5" style={{ display:"flex",gap:14,justifyContent:"center",flexWrap:"wrap",marginTop:40 }}>
            <button className="btn-g" onClick={()=>go("Join Us")}>⚡ {t("Join the Club","Zum Club")}</button>
            <button className="btn-b" onClick={()=>go("Sponsors")}>🤝 {t("Become a Sponsor","Sponsor werden")}</button>
            <button className="btn-o" onClick={()=>go("Fixtures")}>📋 {t("View Fixtures","Spielplan")}</button>
          </div>

          {/* Stats strip */}
          <div style={{ display:"flex",justifyContent:"center",gap:"clamp(24px,5vw,64px)",marginTop:68,flexWrap:"wrap" }}>
            {[[24,"Players","Spieler"],[3,"Tournaments","Turniere"],["HH","Hamburg","Hamburg"],[2025,"Season","Saison"]].map(([n,en,de])=>(
              <div key={en} style={{ textAlign:"center" }}>
                <div className="glow" style={{ fontSize:"clamp(32px,5vw,54px)",fontWeight:900,color:"#f5c400",lineHeight:1 }}>
                  {typeof n === "number" ? <Counter target={n} /> : n}
                </div>
                <div style={{ fontSize:10,letterSpacing:".2em",color:"rgba(255,255,255,.35)",marginTop:5,textTransform:"uppercase" }}>{t(en,de)}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div style={{ position:"absolute",bottom:32,left:"50%",transform:"translateX(-50%)",display:"flex",flexDirection:"column",alignItems:"center",gap:6,zIndex:2 }}>
          <div style={{ fontSize:9,letterSpacing:".25em",color:"rgba(255,255,255,.25)",textTransform:"uppercase" }}>Scroll</div>
          <div style={{ width:1,height:40,background:"linear-gradient(180deg,rgba(245,196,0,.5),transparent)",animation:"fadeIn 1s ease infinite alternate" }}/>
        </div>
      </section>

      <div className="divg"/>

      {/* ═══ ABOUT ═══ */}
      <section id="about" style={{ background:"linear-gradient(180deg,#08102a 0%,#050810 100%)" }}>
        <div className="wrap">
          <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:60,alignItems:"center" }}>
            <div>
              <div className="slabel" style={{ marginBottom:16 }}>{t("About the Club","Über den Klub")}</div>
              <h2 style={{ fontSize:"clamp(44px,7vw,80px)",fontWeight:900,textTransform:"uppercase",lineHeight:.9 }}>
                {t("OUR","UNSERE")}<br/><span className="grad-text">{t("STORY","GESCHICHTE")}</span>
              </h2>
              <div style={{ width:70,height:3,background:"linear-gradient(90deg,#f5c400,#1a6fff)",marginTop:20,marginBottom:24,boxShadow:"0 0 10px rgba(245,196,0,.4)" }}/>
              <p style={{ fontFamily:"'Barlow',sans-serif",color:"rgba(255,255,255,.6)",lineHeight:1.85,fontSize:15 }}>
                {t("Hamburg Blasters FC was established to unite football enthusiasts and the Malayali community in Hamburg through sportsmanship, teamwork, and cultural values. The club actively participates in tournaments and community events while promoting football among all age groups.",
                  "Hamburg Blasters FC wurde gegründet, um Fußballfans und die Malayali-Gemeinschaft in Hamburg durch Sportgeist, Teamwork und kulturelle Werte zu vereinen.")}
              </p>
              <p style={{ fontFamily:"'Barlow',sans-serif",color:"rgba(255,255,255,.4)",lineHeight:1.85,fontSize:14,marginTop:16 }}>
                {t("Proudly affiliated with KEFF (Kerala Emirates Football Federation), we are committed to promoting football excellence and fostering community spirit across Germany.",
                  "Stolz mit KEFF verbunden, fördern wir fußballerische Exzellenz in ganz Deutschland.")}
              </p>
              <div style={{ display:"flex",gap:12,flexWrap:"wrap",marginTop:32 }}>
                <button className="btn-g" onClick={()=>go("Join Us")}>🏃 {t("Join Now","Mitmachen")}</button>
                <button className="btn-o" onClick={()=>go("Team")}>👥 {t("Meet the Team","Das Team")}</button>
              </div>
            </div>
            <div style={{ display:"flex",flexDirection:"column",gap:12 }}>
              {[
                ["👤",t("Founder & President","Gründer & Präsident"),"Hans Perumana Thomas","#f5c400"],
                ["🏅",t("Affiliation","Zugehörigkeit"),"KEFF – Kerala Emirates Football Federation","#1a8fff"],
                ["📍",t("Location","Standort"),"Hamburg, Germany","#f5c400"],
                ["🌍",t("Community","Gemeinschaft"),t("Malayali Community, Hamburg & Germany","Malayali-Gemeinschaft in Hamburg & Deutschland"),"#1a8fff"],
                ["🤝",t("Main Sponsor","Hauptsponsor"),"NILA South Indian – Kerala Restaurant","#f5c400"],
              ].map(([ic,lbl,val,clr])=>(
                <div key={lbl} className="card" style={{ padding:"16px 20px",display:"flex",gap:14,alignItems:"center" }}>
                  <span style={{ fontSize:22,flexShrink:0 }}>{ic}</span>
                  <div>
                    <div style={{ fontSize:9,letterSpacing:".2em",color:clr,fontWeight:800,textTransform:"uppercase",marginBottom:3 }}>{lbl}</div>
                    <div style={{ fontFamily:"'Barlow',sans-serif",fontSize:14,color:"rgba(255,255,255,.8)" }}>{val}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="divg"/>

      {/* ═══ TEAM ═══ */}
      <section id="team" style={{ background:"#050810" }}>
        <div className="wrap">
          <div style={{ textAlign:"center",marginBottom:56 }}>
            <div className="slabel" style={{ justifyContent:"center",marginBottom:14 }}>2024/25 {t("Season","Saison")}</div>
            <h2 style={{ fontSize:"clamp(44px,7vw,80px)",fontWeight:900,textTransform:"uppercase",lineHeight:.9 }}>
              {t("THE","DAS")} <span className="grad-text">{t("SQUAD","KADER")}</span>
            </h2>
          </div>
          <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(170px,1fr))",gap:14 }}>
            {PLAYERS.map(p=>(
              <div key={p.name} className="pcard" style={{ padding:"24px 16px",textAlign:"center" }}>
                {p.cap && (
                  <div style={{ position:"absolute",top:10,right:10,background:"linear-gradient(135deg,#f5c400,#d4a000)",color:"#050810",fontSize:8,fontWeight:800,padding:"3px 6px",letterSpacing:".1em",boxShadow:"0 0 10px rgba(245,196,0,.4)" }}>©</div>
                )}
                {/* Avatar hex */}
                <div style={{ width:64,height:64,margin:"0 auto 14px",position:"relative" }}>
                  <div style={{
                    width:"100%",height:"100%",
                    background:"linear-gradient(135deg,#1a4fa0,#0a1d4a)",
                    clipPath:"polygon(50% 0%,95% 25%,95% 75%,50% 100%,5% 75%,5% 25%)",
                    display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,
                    border:"none",boxShadow:"0 0 15px rgba(30,80,200,.3)",
                  }}>🇮🇳</div>
                  <div style={{ position:"absolute",top:-6,left:-6,right:-6,bottom:-6,
                    clipPath:"polygon(50% 0%,95% 25%,95% 75%,50% 100%,5% 75%,5% 25%)",
                    background:"linear-gradient(135deg,rgba(245,196,0,.2),transparent)",zIndex:-1 }}/>
                </div>
                <div style={{ fontSize:42,fontWeight:900,color:"rgba(245,196,0,.06)",position:"absolute",top:10,left:10,lineHeight:1 }}>#{p.no}</div>
                <div style={{ fontWeight:800,fontSize:12,letterSpacing:".05em",textTransform:"uppercase",lineHeight:1.2 }}>{p.name}</div>
                <div style={{ color:"#f5c400",fontSize:10,fontWeight:700,letterSpacing:".15em",marginTop:5,textShadow:"0 0 8px rgba(245,196,0,.4)" }}>{p.pos}</div>
                {p.cap && <div style={{ fontSize:8,color:"#f5c400",fontWeight:800,letterSpacing:".15em",marginTop:4 }}>CAPTAIN ©</div>}
                <div style={{ display:"flex",justifyContent:"center",gap:18,marginTop:12,borderTop:"1px solid rgba(255,255,255,.06)",paddingTop:10 }}>
                  {[["⚽",p.g,"G"],["🅰",p.a,"A"]].map(([ic,v,lb])=>(
                    <div key={lb} style={{ textAlign:"center" }}>
                      <div style={{ fontSize:16,fontWeight:900,color:"white" }}>{v}</div>
                      <div style={{ fontSize:8,color:"rgba(255,255,255,.3)",letterSpacing:".1em" }}>{lb}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          {/* Staff */}
          <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:14,marginTop:40 }}>
            {[["📋",t("Head Coach","Cheftrainer"),"TBA"],["🎯",t("Asst. Coach","Co-Trainer"),"TBA"],["🤝",t("Team Manager","Teammanager"),"Hans Perumana Thomas"]].map(([ic,rl,nm])=>(
              <div key={rl} className="card" style={{ padding:"20px 22px",display:"flex",gap:14,alignItems:"center" }}>
                <span style={{ fontSize:26 }}>{ic}</span>
                <div>
                  <div style={{ fontSize:9,color:"#f5c400",letterSpacing:".15em",fontWeight:700,textTransform:"uppercase" }}>{rl}</div>
                  <div style={{ fontFamily:"'Barlow',sans-serif",fontSize:15,fontWeight:600,marginTop:3 }}>{nm}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="divg"/>

      {/* ═══ FIXTURES ═══ */}
      <section id="fixtures" style={{ background:"linear-gradient(180deg,#08102a 0%,#050810 100%)" }}>
        <div className="wrap">
          <div style={{ textAlign:"center",marginBottom:48 }}>
            <div className="slabel" style={{ justifyContent:"center",marginBottom:14 }}>KEFF & Friendlies</div>
            <h2 style={{ fontSize:"clamp(44px,7vw,80px)",fontWeight:900,textTransform:"uppercase",lineHeight:.9 }}>
              {t("FIXTURES &","SPIELE &")} <span className="grad-text">{t("RESULTS","ERGEBNISSE")}</span>
            </h2>
          </div>
          <div style={{ display:"flex",gap:8,marginBottom:28,justifyContent:"center" }}>
            {["upcoming","results","table"].map(tab=>(
              <button key={tab} className={`tab ${fixtureTab===tab?"on":""}`} onClick={()=>setFixtureTab(tab)}>
                {tab==="upcoming"?t("Upcoming","Kommend"):tab==="results"?t("Results","Ergebnisse"):t("Table","Tabelle")}
              </button>
            ))}
          </div>

          {fixtureTab==="upcoming" && (
            <div style={{ display:"flex",flexDirection:"column",gap:12,maxWidth:680,margin:"0 auto" }}>
              {FIXTURES.map((f,i)=>(
                <div key={i} className="card" style={{ padding:"20px 24px",borderLeft:"3px solid #1a6fff",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:12 }}>
                  <div>
                    <div style={{ fontSize:10,color:"#f5c400",fontWeight:800,letterSpacing:".15em",marginBottom:6 }}>{f.date} 2025</div>
                    <div style={{ fontWeight:800,fontSize:18 }}>vs {f.opp}</div>
                    <div style={{ fontFamily:"'Barlow',sans-serif",fontSize:12,color:"rgba(255,255,255,.4)",marginTop:4 }}>📍 {f.venue}</div>
                  </div>
                  <div style={{ display:"flex",flexDirection:"column",alignItems:"flex-end",gap:8 }}>
                    <span style={{ background:"rgba(30,100,255,.15)",color:"#6ba3ff",border:"1px solid rgba(30,100,255,.3)",fontSize:9,fontWeight:800,padding:"3px 8px",letterSpacing:".12em" }}>{f.type}</span>
                    <button className="btn-o" style={{ fontSize:10,padding:"6px 14px",clipPath:"none",borderRadius:2 }}>+ Calendar</button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {fixtureTab==="results" && (
            <div style={{ display:"flex",flexDirection:"column",gap:12,maxWidth:680,margin:"0 auto" }}>
              {RESULTS.map((r,i)=>(
                <div key={i} className="card" style={{ padding:"18px 24px",borderLeft:`3px solid ${r.res==="W"?"#22c55e":r.res==="D"?"#f5c400":"#ef4444"}`,display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:12 }}>
                  <div>
                    <div style={{ fontSize:10,color:"rgba(255,255,255,.35)",fontWeight:700,letterSpacing:".12em",marginBottom:5 }}>{r.date} 2025</div>
                    <div style={{ fontWeight:800,fontSize:17 }}>vs {r.opp}</div>
                  </div>
                  <div style={{ display:"flex",alignItems:"center",gap:14 }}>
                    <div style={{ fontSize:26,fontWeight:900,color:r.res==="W"?"#4ade80":r.res==="D"?"#f5c400":"#f87171",textShadow:`0 0 15px ${r.res==="W"?"rgba(74,222,128,.4)":r.res==="D"?"rgba(245,196,0,.4)":"rgba(248,113,113,.4)"}` }}>{r.score}</div>
                    <div className={`r${r.res}`} style={{ fontSize:9,fontWeight:800,padding:"4px 10px",letterSpacing:".12em" }}>{r.res==="W"?"WIN":r.res==="D"?"DRAW":"LOSS"}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {fixtureTab==="table" && (
            <div style={{ background:"rgba(255,255,255,.025)",border:"1px solid rgba(255,255,255,.07)",borderRadius:4,overflow:"hidden",maxWidth:780,margin:"0 auto" }}>
              <div style={{ overflowX:"auto" }}>
                <table style={{ width:"100%",borderCollapse:"collapse",fontFamily:"'Barlow',sans-serif",fontSize:13 }}>
                  <thead>
                    <tr style={{ borderBottom:"2px solid rgba(245,196,0,.2)",background:"rgba(245,196,0,.04)" }}>
                      {["#","Club","P","W","D","L","GF","GA","GD","Pts"].map(h=>(
                        <th key={h} style={{ padding:"12px 14px",textAlign:h==="Club"?"left":"center",fontSize:9,letterSpacing:".18em",color:"#f5c400",fontWeight:800 }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      {p:1,c:"Hamburg Blasters FC",pl:4,w:2,d:1,l:1,gf:10,ga:6,hi:true},
                      {p:2,c:"Kerala Stars HH",pl:4,w:2,d:0,l:2,gf:8,ga:7},
                      {p:3,c:"Gulf Ballers HH",pl:3,w:1,d:1,l:1,gf:5,ga:5},
                      {p:4,c:"Malabar United",pl:3,w:0,d:0,l:3,gf:1,ga:7},
                    ].map(r=>(
                      <tr key={r.c} style={{ borderBottom:"1px solid rgba(255,255,255,.04)",background:r.hi?"rgba(245,196,0,.04)":"transparent" }}>
                        <td style={{ padding:"12px 14px",textAlign:"center",fontWeight:800,color:r.hi?"#f5c400":"rgba(255,255,255,.5)" }}>{r.p}</td>
                        <td style={{ padding:"12px 14px",fontWeight:r.hi?700:400,color:r.hi?"#f5c400":"rgba(255,255,255,.75)" }}>{r.c}</td>
                        {[r.pl,r.w,r.d,r.l,r.gf,r.ga,r.gf-r.ga,r.w*3+r.d].map((v,i)=>(
                          <td key={i} style={{ padding:"12px 14px",textAlign:"center",color:"rgba(255,255,255,.55)",fontWeight:i===7?700:400 }}>{v}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </section>

      <div className="divg"/>

      {/* ═══ GALLERY ═══ */}
      <section id="gallery" style={{ background:"#050810" }}>
        <div className="wrap">
          <div style={{ textAlign:"center",marginBottom:52 }}>
            <div className="slabel" style={{ justifyContent:"center",marginBottom:14 }}>{t("Photo Gallery","Fotogalerie")}</div>
            <h2 style={{ fontSize:"clamp(44px,7vw,80px)",fontWeight:900,textTransform:"uppercase",lineHeight:.9 }}>
              <span className="grad-text">{t("GALLERY","GALERIE")}</span>
            </h2>
          </div>
          <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))",gap:12 }}>
            {[
              ["⚽","Match Day","rgba(245,196,0,.15)","#f5c400",280],
              ["🏃","Training","rgba(30,100,255,.15)","#1a8fff",200],
              ["🤝","Community","rgba(245,196,0,.12)","#f5c400",200],
              ["🏆","Tournament","rgba(30,100,255,.12)","#1a8fff",280],
              ["🎉","Celebrations","rgba(245,196,0,.1)","#f5c400",200],
              ["🚌","Away Days","rgba(30,100,255,.1)","#1a8fff",200],
            ].map(([em,lbl,bg,clr,h])=>(
              <div key={lbl} className="stripe" style={{
                height:h,borderRadius:4,border:`1px solid ${clr}22`,
                background:bg,position:"relative",overflow:"hidden",
                display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",
                cursor:"pointer",transition:"all .35s",
              }}
                onMouseEnter={e=>{e.currentTarget.style.transform="scale(1.03)";e.currentTarget.style.boxShadow=`0 20px 50px rgba(0,0,0,.5),0 0 0 1px ${clr}44`}}
                onMouseLeave={e=>{e.currentTarget.style.transform="scale(1)";e.currentTarget.style.boxShadow="none"}}
              >
                <div style={{ position:"absolute",inset:0,background:`radial-gradient(circle at 50% 50%,${clr}15 0%,transparent 70%)` }}/>
                <span style={{ fontSize:44,position:"relative",filter:"drop-shadow(0 0 12px rgba(255,255,255,.3))" }}>{em}</span>
                <div style={{ fontWeight:800,fontSize:14,letterSpacing:".12em",textTransform:"uppercase",marginTop:10,position:"relative",color:clr,textShadow:`0 0 15px ${clr}` }}>{lbl}</div>
                <div style={{ fontSize:10,color:"rgba(255,255,255,.4)",marginTop:4,letterSpacing:".1em",position:"relative" }}>{t("View Photos","Fotos ansehen")} →</div>
              </div>
            ))}
          </div>
          <div style={{ textAlign:"center",marginTop:36 }}>
            <a href="https://www.instagram.com/" target="_blank" rel="noreferrer" style={{ textDecoration:"none" }}>
              <button className="btn-g">📸 {t("Follow on Instagram","Instagram folgen")}</button>
            </a>
          </div>
        </div>
      </section>

      <div className="divg"/>

      {/* ═══ NEWS ═══ */}
      <section id="news" style={{ background:"linear-gradient(180deg,#08102a 0%,#050810 100%)" }}>
        <div className="wrap">
          <div style={{ textAlign:"center",marginBottom:52 }}>
            <div className="slabel" style={{ justifyContent:"center",marginBottom:14 }}>{t("Latest from the Club","Neuigkeiten")}</div>
            <h2 style={{ fontSize:"clamp(44px,7vw,80px)",fontWeight:900,textTransform:"uppercase",lineHeight:.9 }}>
              {t("NEWS &","NEWS &")} <span className="grad-text">{t("UPDATES","UPDATES")}</span>
            </h2>
          </div>
          <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(290px,1fr))",gap:20 }}>
            {NEWS.map((n,i)=>(
              <div key={i} className="card" style={{ borderRadius:4,overflow:"hidden" }}>
                {/* Color bar */}
                <div style={{ height:4,background:i===0?"linear-gradient(90deg,#f5c400,#d4a000)":i===1?"linear-gradient(90deg,#1a6fff,#4a90e2)":"linear-gradient(90deg,#22c55e,#16a34a)",boxShadow:`0 0 10px ${i===0?"rgba(245,196,0,.4)":i===1?"rgba(30,100,255,.4)":"rgba(34,197,94,.4)"}` }}/>
                {/* Hero area */}
                <div style={{ padding:"28px 24px 24px" }}>
                  <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14 }}>
                    <span style={{ fontSize:8,fontWeight:800,letterSpacing:".18em",padding:"4px 9px",background:"rgba(245,196,0,.1)",color:"#f5c400",borderRadius:2,border:"1px solid rgba(245,196,0,.2)" }}>{n.tag}</span>
                    <span style={{ fontSize:10,color:"rgba(255,255,255,.3)",fontFamily:"'Barlow',sans-serif" }}>{n.date}</span>
                  </div>
                  <h3 style={{ fontWeight:800,fontSize:16,lineHeight:1.3,marginBottom:12 }}>{n.title}</h3>
                  <p style={{ fontFamily:"'Barlow',sans-serif",fontSize:13,color:"rgba(255,255,255,.5)",lineHeight:1.75 }}>{n.body}</p>
                  <button style={{ background:"none",border:"none",color:"#f5c400",fontSize:11,fontWeight:700,letterSpacing:".12em",cursor:"pointer",marginTop:18,padding:0,textTransform:"uppercase",fontFamily:"'Barlow Condensed',sans-serif",textShadow:"0 0 10px rgba(245,196,0,.4)" }}>
                    {t("Read More","Mehr lesen")} →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="divg"/>

      {/* ═══ SPONSORS ═══ */}
      <section id="sponsors" style={{ background:"#050810" }}>
        <div className="wrap">
          <div style={{ textAlign:"center",marginBottom:56 }}>
            <div className="slabel" style={{ justifyContent:"center",marginBottom:14 }}>{t("Our Partners","Unsere Partner")}</div>
            <h2 style={{ fontSize:"clamp(44px,7vw,80px)",fontWeight:900,textTransform:"uppercase",lineHeight:.9 }}>
              {t("OUR","UNSERE")} <span className="grad-text">{t("SPONSORS","SPONSOREN")}</span>
            </h2>
          </div>

          {/* Main sponsor */}
          <div className="glow-box" style={{ borderRadius:8,padding:"clamp(28px,5vw,56px)",textAlign:"center",marginBottom:32,background:"linear-gradient(135deg,rgba(245,196,0,.06),rgba(245,196,0,.02))",border:"1px solid rgba(245,196,0,.25)",position:"relative",overflow:"hidden" }}>
            <div style={{ position:"absolute",top:0,left:0,right:0,height:3,background:"linear-gradient(90deg,transparent,#f5c400,transparent)",boxShadow:"0 0 15px rgba(245,196,0,.5)" }}/>
            <div style={{ position:"absolute",bottom:0,left:0,right:0,height:3,background:"linear-gradient(90deg,transparent,#f5c400,transparent)" }}/>
            <div className="stripe" style={{ position:"absolute",inset:0,opacity:.5 }}/>
            <div style={{ position:"relative" }}>
              <div style={{ fontSize:10,fontWeight:800,letterSpacing:".3em",color:"#f5c400",marginBottom:24,textShadow:"0 0 15px rgba(245,196,0,.5)" }}>⭐ {t("MAIN SPONSOR","HAUPTSPONSOR")} ⭐</div>
              <div style={{
                width:100,height:100,background:"linear-gradient(135deg,#f5c400,#d4a000)",borderRadius:"50%",
                display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 24px",fontSize:44,
                boxShadow:"0 0 40px rgba(245,196,0,.5),0 0 80px rgba(245,196,0,.2)",
                animation:"pulse 3s ease-in-out infinite",
              }}>🍛</div>
              <h3 style={{ fontSize:"clamp(36px,6vw,72px)",fontWeight:900,color:"#f5c400",letterSpacing:".04em",textShadow:"0 0 30px rgba(245,196,0,.5)" }}>NILA</h3>
              <p style={{ fontFamily:"'Barlow',sans-serif",color:"rgba(255,255,255,.6)",fontSize:16,marginTop:8 }}>South Indian – Kerala Restaurant · Berlin</p>
              <p style={{ fontFamily:"'Barlow',sans-serif",color:"rgba(255,255,255,.4)",fontSize:13,marginTop:16,maxWidth:500,margin:"16px auto 0",lineHeight:1.75 }}>
                {t("NILA Restaurant proudly supports Hamburg Blasters FC, uniting the Malayali community through authentic South Indian cuisine and the beautiful game.",
                  "NILA Restaurant unterstützt stolz den Hamburg Blasters FC und verbindet die Malayali-Gemeinschaft durch authentische Küche.")}
              </p>
            </div>
          </div>

          <div style={{ background:"rgba(255,255,255,.025)",border:"1px solid rgba(255,255,255,.07)",borderRadius:6,padding:"32px",textAlign:"center" }}>
            <h3 style={{ fontSize:24,fontWeight:800,letterSpacing:".06em",marginBottom:8,textTransform:"uppercase" }}>{t("Become a Sponsor","Sponsor werden")}</h3>
            <p style={{ fontFamily:"'Barlow',sans-serif",color:"rgba(255,255,255,.45)",fontSize:14,marginBottom:24,maxWidth:500,margin:"0 auto 24px" }}>
              {t("Join our growing family and reach the Malayali community across Hamburg and Germany.","Werden Sie Teil unserer wachsenden Sponsorenfamilie.")}
            </p>
            <button className="btn-g" onClick={()=>go("Contact")}>{t("Get in Touch","Kontakt aufnehmen")}</button>
          </div>
        </div>
      </section>

      <div className="divg"/>

      {/* ═══ JOIN US ═══ */}
      <section id="join-us" style={{ background:"linear-gradient(180deg,#08102a 0%,#050810 100%)" }}>
        <div className="wrap">
          <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))",gap:52 }}>
            <div>
              <div className="slabel" style={{ marginBottom:16 }}>{t("Be Part of the Club","Mach mit")}</div>
              <h2 style={{ fontSize:"clamp(44px,7vw,80px)",fontWeight:900,textTransform:"uppercase",lineHeight:.9 }}>
                {t("JOIN","WERDE")} <br/><span className="grad-text">{t("THE BLASTERS","BLASTER")}</span>
              </h2>
              <div style={{ width:70,height:3,background:"linear-gradient(90deg,#f5c400,#1a6fff)",marginTop:20,marginBottom:24,boxShadow:"0 0 10px rgba(245,196,0,.4)" }}/>
              <p style={{ fontFamily:"'Barlow',sans-serif",color:"rgba(255,255,255,.5)",lineHeight:1.85,fontSize:15 }}>
                {t("Whether you're a player, volunteer, or supporter — there's a place for you at Hamburg Blasters FC. Join our growing Malayali football family in Hamburg.",
                  "Ob Spieler, Volunteer oder Fan — bei Hamburg Blasters FC ist für jeden ein Platz.")}
              </p>
              <div style={{ display:"flex",flexDirection:"column",gap:14,marginTop:28 }}>
                {[["⚽",t("Player Registration","Spielerregistrierung"),t("Join the squad and train with us","Werde Teil des Kaders")],
                  ["🙋",t("Volunteer","Volunteer"),t("Support the club off the pitch","Unterstütze den Klub")],
                  ["💼",t("Sponsorship","Sponsoring"),t("Partner with Hamburg Blasters FC","Werde Partnerunternehmen")],
                ].map(([ic,ti,de])=>(
                  <div key={ti} style={{ display:"flex",gap:14,alignItems:"flex-start" }}>
                    <span style={{ fontSize:22,flexShrink:0,marginTop:2 }}>{ic}</span>
                    <div>
                      <div style={{ fontWeight:700,fontSize:14,color:"rgba(255,255,255,.9)" }}>{ti}</div>
                      <div style={{ fontFamily:"'Barlow',sans-serif",fontSize:12,color:"rgba(255,255,255,.4)",marginTop:2 }}>{de}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div style={{ display:"flex",gap:8,marginBottom:20,flexWrap:"wrap" }}>
                {["player","volunteer","sponsor"].map(tp=>(
                  <button key={tp} className={`tab ${joinType===tp?"on":""}`} onClick={()=>setJoinType(tp)}>
                    {tp==="player"?t("Player","Spieler"):tp==="volunteer"?"Volunteer":t("Sponsor","Sponsor")}
                  </button>
                ))}
              </div>
              {submitted ? (
                <div style={{ background:"rgba(34,197,94,.07)",border:"1px solid rgba(34,197,94,.25)",padding:"36px",borderRadius:4,textAlign:"center" }}>
                  <div style={{ fontSize:48,marginBottom:14 }}>✅</div>
                  <div style={{ fontWeight:800,fontSize:22 }}>{t("Thank You!","Vielen Dank!")}</div>
                  <p style={{ fontFamily:"'Barlow',sans-serif",color:"rgba(255,255,255,.5)",marginTop:10,fontSize:14,lineHeight:1.7 }}>
                    {t("We'll be in touch soon. Welcome to the Blasters family!","Wir melden uns bald. Willkommen in der Blasters-Familie!")}
                  </p>
                  <button className="btn-g" style={{ marginTop:24 }} onClick={()=>setSubmitted(false)}>{t("Submit Another","Weiteres Formular")}</button>
                </div>
              ) : (
                <div style={{ display:"flex",flexDirection:"column",gap:12 }}>
                  <input className="inp" placeholder={t("Full Name *","Vollständiger Name *")} value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/>
                  <input className="inp" placeholder={t("Email Address *","E-Mail-Adresse *")} value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/>
                  {joinType==="player" && <input className="inp" placeholder={t("Preferred Position","Bevorzugte Position")}/>}
                  {joinType==="sponsor" && <input className="inp" placeholder={t("Company / Business Name","Unternehmen")}/>}
                  <input className="inp" placeholder={t("Phone (WhatsApp preferred)","Telefon (WhatsApp)")}/>
                  <textarea className="inp" rows={4} placeholder={t("Tell us about yourself…","Erzähl uns von dir…")} value={form.msg} onChange={e=>setForm({...form,msg:e.target.value})} style={{ resize:"vertical" }}/>
                  <button className="btn-g" style={{ width:"100%",justifyContent:"center",clipPath:"none",borderRadius:3 }} onClick={()=>{if(form.name&&form.email)setSubmitted(true)}}>
                    ✅ {t("Submit Registration","Registrierung absenden")}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="divg"/>

      {/* ═══ CONTACT ═══ */}
      <section id="contact" style={{ background:"#050810" }}>
        <div className="wrap">
          <div style={{ textAlign:"center",marginBottom:56 }}>
            <div className="slabel" style={{ justifyContent:"center",marginBottom:14 }}>{t("Get in Touch","Kontakt")}</div>
            <h2 style={{ fontSize:"clamp(44px,7vw,80px)",fontWeight:900,textTransform:"uppercase",lineHeight:.9 }}>
              {t("CONTACT","KONTAKT")} <span className="grad-text">{t("US","")}</span>
            </h2>
          </div>
          <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(270px,1fr))",gap:40 }}>
            <div style={{ display:"flex",flexDirection:"column",gap:12 }}>
              {[["📍",t("Location","Standort"),"Hamburg, Germany"],["📧","Email","info@hamburgblastersfc.de"],["💬","WhatsApp","+49 XXX XXXXXXX"],["🏅",t("Affiliation","Zugehörigkeit"),"KEFF – Kerala Emirates Football Federation"]].map(([ic,lb,vl])=>(
                <div key={lb} className="card" style={{ padding:"16px 20px",display:"flex",gap:14,alignItems:"center" }}>
                  <span style={{ fontSize:20 }}>{ic}</span>
                  <div>
                    <div style={{ fontSize:9,letterSpacing:".18em",color:"#f5c400",fontWeight:800,textTransform:"uppercase",marginBottom:3 }}>{lb}</div>
                    <div style={{ fontFamily:"'Barlow',sans-serif",fontSize:13,color:"rgba(255,255,255,.7)" }}>{vl}</div>
                  </div>
                </div>
              ))}
              <div style={{ marginTop:8 }}>
                <div style={{ fontSize:10,fontWeight:800,letterSpacing:".2em",color:"#f5c400",marginBottom:12,textTransform:"uppercase" }}>{t("Follow Us","Folge uns")}</div>
                <div style={{ display:"flex",gap:10,flexWrap:"wrap" }}>
                  {[["📸","Instagram"],["📘","Facebook"],["🐦","Twitter/X"]].map(([ic,nm])=>(
                    <a key={nm} href="https://instagram.com" target="_blank" rel="noreferrer" style={{
                      textDecoration:"none",background:"rgba(255,255,255,.05)",
                      border:"1px solid rgba(255,255,255,.1)",padding:"9px 14px",borderRadius:2,
                      display:"flex",alignItems:"center",gap:6,color:"white",fontSize:11,
                      fontWeight:700,letterSpacing:".08em",fontFamily:"'Barlow Condensed',sans-serif",
                      transition:"all .2s",
                    }}
                      onMouseEnter={e=>{e.currentTarget.style.background="rgba(245,196,0,.1)";e.currentTarget.style.borderColor="rgba(245,196,0,.4)";e.currentTarget.style.color="#f5c400"}}
                      onMouseLeave={e=>{e.currentTarget.style.background="rgba(255,255,255,.05)";e.currentTarget.style.borderColor="rgba(255,255,255,.1)";e.currentTarget.style.color="white"}}
                    >{ic} {nm}</a>
                  ))}
                </div>
              </div>
            </div>
            <div style={{ background:"rgba(30,100,255,.05)",border:"1px solid rgba(30,100,255,.18)",borderRadius:4,padding:"28px",display:"flex",flexDirection:"column",gap:12 }}>
              <h3 style={{ fontSize:20,fontWeight:800,letterSpacing:".06em",textTransform:"uppercase",marginBottom:6 }}>{t("Send a Message","Nachricht senden")}</h3>
              <input className="inp" placeholder={t("Your Name","Ihr Name")}/>
              <input className="inp" placeholder={t("Email","E-Mail")}/>
              <input className="inp" placeholder={t("Subject","Betreff")}/>
              <textarea className="inp" rows={4} placeholder={t("Your Message…","Ihre Nachricht…")} style={{ resize:"vertical" }}/>
              <button className="btn-g" style={{ width:"100%",justifyContent:"center",clipPath:"none",borderRadius:3 }}>{t("Send Message","Senden")} →</button>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer style={{ background:"#02040c",borderTop:"1px solid rgba(245,196,0,.12)",padding:"52px 28px 28px" }}>
        <div style={{ maxWidth:1300,margin:"0 auto" }}>
          <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(190px,1fr))",gap:44,marginBottom:52 }}>
            <div>
              <div style={{ display:"flex",alignItems:"center",gap:12,marginBottom:16 }}>
                <div style={{ width:42,height:42,background:"linear-gradient(135deg,#f5c400,#d4a000)",clipPath:"polygon(50% 0%,95% 25%,95% 75%,50% 100%,5% 85%,0% 50%,5% 15%)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,boxShadow:"0 0 15px rgba(245,196,0,.3)",flexShrink:0 }}>⚽</div>
                <div>
                  <div style={{ fontWeight:900,fontSize:13,color:"#f5c400",textShadow:"0 0 10px rgba(245,196,0,.3)" }}>HAMBURG BLASTERS FC</div>
                  <div style={{ fontSize:8,letterSpacing:".18em",color:"rgba(255,255,255,.3)" }}>KEFF AFFILIATED</div>
                </div>
              </div>
              <p style={{ fontFamily:"'Barlow',sans-serif",fontSize:12,color:"rgba(255,255,255,.35)",lineHeight:1.85 }}>
                {t("United by Passion, Driven by Football. Representing the Malayali community in Hamburg, Germany.","Vereint durch Leidenschaft. Die Malayali-Gemeinschaft in Hamburg, Deutschland.")}
              </p>
            </div>
            <div>
              <div style={{ fontSize:10,fontWeight:800,letterSpacing:".22em",color:"#f5c400",marginBottom:16,textTransform:"uppercase" }}>{t("Quick Links","Links")}</div>
              <div style={{ display:"flex",flexDirection:"column",gap:8 }}>
                {NAV.map(n=>(
                  <span key={n} onClick={()=>go(n)} style={{ fontFamily:"'Barlow',sans-serif",fontSize:13,color:"rgba(255,255,255,.38)",cursor:"pointer",transition:"color .2s" }}
                    onMouseEnter={e=>e.currentTarget.style.color="#f5c400"}
                    onMouseLeave={e=>e.currentTarget.style.color="rgba(255,255,255,.38)"}>{n}</span>
                ))}
              </div>
            </div>
            <div>
              <div style={{ fontSize:10,fontWeight:800,letterSpacing:".22em",color:"#f5c400",marginBottom:16,textTransform:"uppercase" }}>{t("Sponsors","Sponsoren")}</div>
              <div style={{ background:"rgba(245,196,0,.06)",border:"1px solid rgba(245,196,0,.18)",padding:"16px",borderRadius:4 }}>
                <div style={{ fontSize:24,marginBottom:6 }}>🍛</div>
                <div style={{ fontWeight:800,fontSize:13,color:"#f5c400" }}>NILA Restaurant</div>
                <div style={{ fontFamily:"'Barlow',sans-serif",fontSize:11,color:"rgba(255,255,255,.35)",marginTop:4 }}>South Indian – Kerala · Hamburg</div>
              </div>
            </div>
            <div>
              <div style={{ fontSize:10,fontWeight:800,letterSpacing:".22em",color:"#f5c400",marginBottom:16,textTransform:"uppercase" }}>Newsletter</div>
              <p style={{ fontFamily:"'Barlow',sans-serif",fontSize:12,color:"rgba(255,255,255,.35)",marginBottom:14,lineHeight:1.75 }}>
                {t("Subscribe for match updates & club news.","Abonnieren Sie für Neuigkeiten.")}
              </p>
              <div style={{ display:"flex" }}>
                <input className="inp" placeholder="Email" style={{ borderRadius:"2px 0 0 2px",flex:1 }}/>
                <button style={{ background:"linear-gradient(135deg,#f5c400,#d4a000)",border:"none",color:"#050810",padding:"0 16px",fontSize:16,cursor:"pointer",fontWeight:900,borderRadius:"0 2px 2px 0",flexShrink:0 }}>→</button>
              </div>
            </div>
          </div>
          <div style={{ borderTop:"1px solid rgba(255,255,255,.05)",paddingTop:24,display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:12 }}>
            <div style={{ fontFamily:"'Barlow',sans-serif",fontSize:11,color:"rgba(255,255,255,.25)" }}>
              © 2025 Hamburg Blasters FC – {t("All Rights Reserved","Alle Rechte vorbehalten")}
            </div>
            <div style={{ display:"flex",gap:20 }}>
              {["Privacy","Terms","Contact"].map(l=>(
                <span key={l} style={{ fontFamily:"'Barlow',sans-serif",fontSize:10,color:"rgba(255,255,255,.25)",cursor:"pointer",letterSpacing:".12em" }}>{l.toUpperCase()}</span>
              ))}
            </div>
          </div>
        </div>
      </footer>

      {/* WhatsApp FAB */}
      <a href="https://wa.me/49XXXXXXXXX" target="_blank" rel="noreferrer" style={{
        position:"fixed",bottom:28,right:28,zIndex:200,width:56,height:56,
        background:"linear-gradient(135deg,#25D366,#1da851)",borderRadius:"50%",
        display:"flex",alignItems:"center",justifyContent:"center",fontSize:26,
        cursor:"pointer",boxShadow:"0 4px 20px rgba(37,211,102,.45),0 0 40px rgba(37,211,102,.2)",
        transition:"transform .2s",textDecoration:"none",
      }}
        onMouseEnter={e=>e.currentTarget.style.transform="scale(1.15)"}
        onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"}
        title="Chat on WhatsApp"
      >💬</a>
    </div>
  );
}
