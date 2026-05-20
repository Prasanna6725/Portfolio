import emailjs from "@emailjs/browser";
import confetti from "canvas-confetti";
import toast, { Toaster } from "react-hot-toast";
import React from "react";
import { useState, useEffect, useRef } from "react";
import {
  motion, useScroll, useTransform, useInView,
  useSpring, useMotionValue, AnimatePresence,
} from "framer-motion";
 
const THEMES = {
  light: {
    id:"light",
    bg:"#eef4ff", bgAlt:"#e8e4fb", bgCard:"#ffffff",
    text:"#0f172a", textSub:"#475569", textMuted:"#94a3b8",
    blue:"#1a4ed8", blueLight:"#dbeafe",
    purple:"#7c3aed", purpleSoft:"#ede9fe", purpleBord:"#c4b5fd",
    pink:"#db2777", pinkSoft:"#fce7f3",
    accent:"#7c3aed",          // main accent — always readable
    accentAlt:"#db2777",       // secondary accent
    navBg:"rgba(238,244,255,0.92)",
    glow:"rgba(124,58,237,0.22)",
    shadow:"0 2px 24px rgba(124,58,237,0.15)",
    border:"rgba(196,181,253,0.5)",
    heroGrad:"linear-gradient(135deg,#eef4ff 55%,#fce7f3 100%)",
    heroBlob1:"linear-gradient(135deg,#dbeafe,#ede9fe)",
    heroBlob2:"linear-gradient(135deg,#fce7f3,#ede9fe)",
    avatarBg:"linear-gradient(135deg,#ede9fe,#fce7f3)",
    contactGrad:"linear-gradient(135deg,#1a4ed8,#312e81)",
  },
  dark: {
    id:"dark",
    bg:"#0d0b1e", bgAlt:"#130f2a", bgCard:"#1a1535",
    text:"#f0eeff", textSub:"#b0a8d8", textMuted:"#7060a0",
    blue:"#60a5fa", blueLight:"#1e2a5e",
    purple:"#c4b5fd", purpleSoft:"#1e1545", purpleBord:"#5b4fa0",
    pink:"#f9a8d4", pinkSoft:"#2d1533",
    accent:"#c4b5fd",
    accentAlt:"#f9a8d4",
    navBg:"rgba(13,11,30,0.95)",
    glow:"rgba(196,181,253,0.28)",
    shadow:"0 4px 32px rgba(196,181,253,0.18)",
    border:"rgba(91,79,160,0.6)",
    heroGrad:"linear-gradient(135deg,#0d0b1e 55%,#1a0d2e 100%)",
    heroBlob1:"radial-gradient(circle,#2a1d4e,#0d0b1e)",
    heroBlob2:"radial-gradient(circle,#1e1050,#0d0b1e)",
    avatarBg:"linear-gradient(135deg,#2a1d4e,#1a0d2e)",
    contactGrad:"linear-gradient(135deg,#0d0b1e,#1a0d2e)",
  },
};
 
// ─────────────────────────────────────────────────────────────
//  DOODLES  — 12 shapes
// ─────────────────────────────────────────────────────────────
const Doodle = ({ shape, style, c, op=0.17 }) => {
  const shapes = {
    circle:(
      <svg viewBox="0 0 80 80"><circle cx="40" cy="40" r="32" fill="none" stroke={c} strokeWidth="2.5" strokeDasharray="10 5"/><circle cx="40" cy="40" r="18" fill="none" stroke={c} strokeWidth="1.5" strokeDasharray="5 4"/></svg>
    ),
    star:(
      <svg viewBox="0 0 60 60"><path d="M30 5L33 23L51 23L37 34L42 52L30 42L18 52L23 34L9 23L27 23Z" fill="none" stroke={c} strokeWidth="2.2"/></svg>
    ),
    plus:(
      <svg viewBox="0 0 40 40"><line x1="20" y1="4" x2="20" y2="36" stroke={c} strokeWidth="3" strokeLinecap="round"/><line x1="4" y1="20" x2="36" y2="20" stroke={c} strokeWidth="3" strokeLinecap="round"/></svg>
    ),
    wave:(
      <svg viewBox="0 0 160 40"><path d="M0 20 Q20 5 40 20 Q60 35 80 20 Q100 5 120 20 Q140 35 160 20" fill="none" stroke={c} strokeWidth="2.5" strokeLinecap="round"/></svg>
    ),
    diamond:(
      <svg viewBox="0 0 50 50"><path d="M25 4L46 25L25 46L4 25Z" fill="none" stroke={c} strokeWidth="2.5"/><path d="M25 12L38 25L25 38L12 25Z" fill="none" stroke={c} strokeWidth="1.5"/></svg>
    ),
    spiral:(
      <svg viewBox="0 0 100 100"><path d="M50 50 Q60 30 50 20 Q30 10 20 30 Q10 55 30 65 Q55 75 70 55 Q80 35 65 20 Q45 5 25 15" fill="none" stroke={c} strokeWidth="2.5" strokeLinecap="round"/></svg>
    ),
    dots:(
      <svg viewBox="0 0 80 80">{[0,1,2,3].flatMap(r=>[0,1,2,3].map(col=><circle key={`${r}${col}`} cx={10+col*20} cy={10+r*20} r="2.5" fill={c}/>))}</svg>
    ),
    triangle:(
      <svg viewBox="0 0 60 60"><path d="M30 5L55 50L5 50Z" fill="none" stroke={c} strokeWidth="2.5"/></svg>
    ),
    cross:(
      <svg viewBox="0 0 60 60"><circle cx="30" cy="30" r="14" fill="none" stroke={c} strokeWidth="2"/><line x1="30" y1="2" x2="30" y2="58" stroke={c} strokeWidth="1.5" strokeDasharray="4 3"/><line x1="2" y1="30" x2="58" y2="30" stroke={c} strokeWidth="1.5" strokeDasharray="4 3"/></svg>
    ),
    infinity:(
      <svg viewBox="0 0 120 60"><path d="M60 30 Q75 10 90 30 Q105 50 90 30 M60 30 Q45 10 30 30 Q15 50 30 30" fill="none" stroke={c} strokeWidth="2.5" strokeLinecap="round"/></svg>
    ),
    hexagon:(
      <svg viewBox="0 0 70 70"><polygon points="35,5 60,20 60,50 35,65 10,50 10,20" fill="none" stroke={c} strokeWidth="2.5"/></svg>
    ),
    zigzag:(
      <svg viewBox="0 0 160 50"><path d="M0 40 L20 10 L40 40 L60 10 L80 40 L100 10 L120 40 L140 10 L160 40" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
    ),
  };
  return (
    <div style={{ position:"absolute", pointerEvents:"none", opacity:op, ...style }}>
      {shapes[shape]}
    </div>
  );
};
 
// Animated floating doodle
const FloatDoodle = ({ shape, style, c, floatY=12, duration=4, delay=0, op=0.17 }) => (
  <motion.div style={{ position:"absolute", pointerEvents:"none" }}
    animate={{ y:[0,-floatY,0] }}
    transition={{ repeat:Infinity, duration, ease:"easeInOut", delay }}>
    <Doodle shape={shape} style={style} c={c} op={op}/>
  </motion.div>
);
 
// Spinning doodle
const SpinDoodle = ({ shape, style, c, duration=20, op=0.12 }) => (
  <motion.div style={{ position:"absolute", pointerEvents:"none", opacity:op, ...style }}
    animate={{ rotate:360 }}
    transition={{ repeat:Infinity, duration, ease:"linear" }}>
    <Doodle shape={shape} style={{ position:"relative" }} c={c} op={1}/>
  </motion.div>
);
 
// ─────────────────────────────────────────────────────────────
//  SCROLL PROGRESS BAR
// ─────────────────────────────────────────────────────────────
function ScrollProgressBar({ t }) {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness:100, damping:30 });
  return (
    <motion.div style={{
      position:"fixed", top:0, left:0, right:0, height:3, zIndex:9999,
      background:`linear-gradient(90deg,${t.blue},${t.accent},${t.accentAlt})`,
      transformOrigin:"left", scaleX,
    }}/>
  );
}
 
// ─────────────────────────────────────────────────────────────
//  CURSOR GLOW
// ─────────────────────────────────────────────────────────────
function CursorGlow({ t }) {
  const x = useMotionValue(-300);
  const y = useMotionValue(-300);
  const sx = useSpring(x, { stiffness:70, damping:18 });
  const sy = useSpring(y, { stiffness:70, damping:18 });
 
  useEffect(() => {
    const m = e => { x.set(e.clientX); y.set(e.clientY); };
    window.addEventListener("mousemove", m);
    return () => window.removeEventListener("mousemove", m);
  }, [x, y]);
 
  return (
    <motion.div style={{
      position:"fixed", top:0, left:0, zIndex:9998, pointerEvents:"none",
      width:200, height:200, borderRadius:"50%",
      background:`radial-gradient(circle, ${t.glow} 0%, transparent 30%)`,
      x:sx, y:sy, translateX:"-50%", translateY:"-50%",
    }}/>
  );
}
 
// ─────────────────────────────────────────────────────────────
//  TYPING EFFECT
// ─────────────────────────────────────────────────────────────
function useTyping(words, speed=80, pause=2000) {
  const [display, setDisplay] = useState("");
  const [wi, setWi] = useState(0);
  const [del, setDel] = useState(false);
 
  useEffect(()=>{
    const word = words[wi % words.length];
    const t = setTimeout(()=>{
      if (!del) {
        setDisplay(word.slice(0, display.length+1));
        if (display.length+1===word.length) setTimeout(()=>setDel(true), pause);
      } else {
        setDisplay(word.slice(0, display.length-1));
        if (display.length-1===0) { setDel(false); setWi(w=>w+1); }
      }
    }, del ? 40 : speed);
    return ()=>clearTimeout(t);
  },[display, del, wi, words, speed, pause]);
 
  return display;
}
 
// ─────────────────────────────────────────────────────────────
//  SCROLL REVEAL
// ─────────────────────────────────────────────────────────────
function Reveal({ children, delay=0, dir="up" }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once:true, margin:"-70px" });
  return (
    <motion.div ref={ref}
      initial={{ opacity:0,
        y: dir==="up"?50:dir==="down"?-50:0,
        x: dir==="left"?50:dir==="right"?-50:0,
      }}
      animate={inView ? { opacity:1, y:0, x:0 } : {}}
      transition={{ duration:0.7, delay, ease:[0.22,1,0.36,1] }}>
      {children}
    </motion.div>
  );
}
 
// ─────────────────────────────────────────────────────────────
//  TILT CARD
// ─────────────────────────────────────────────────────────────
function TiltCard({ children, style }) {
  const ref = useRef(null);
  const rotX = useMotionValue(0);
  const rotY = useMotionValue(0);
  const sRotX = useSpring(rotX, { stiffness:200, damping:20 });
  const sRotY = useSpring(rotY, { stiffness:200, damping:20 });
 
  const onMove = e => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const cx = r.left + r.width/2, cy = r.top + r.height/2;
    rotX.set(-(e.clientY - cy) / 18);
    rotY.set( (e.clientX - cx) / 18);
  };
  const onLeave = () => { rotX.set(0); rotY.set(0); };
 
  return (
    <motion.div ref={ref} onMouseMove={onMove} onMouseLeave={onLeave}
      style={{ rotateX:sRotX, rotateY:sRotY, transformPerspective:800, ...style }}>
      {children}
    </motion.div>
  );
}
 
// ─────────────────────────────────────────────────────────────
//  SECTION LABEL
// ─────────────────────────────────────────────────────────────
function SectionLabel({ text, t }) {
  return (
    <p style={{ textAlign:"center", fontSize:12, fontWeight:700, color:t.accent,
      letterSpacing:4, textTransform:"uppercase", marginBottom:14,
      display:"flex", alignItems:"center", justifyContent:"center", gap:12 }}>
      <span style={{ flex:1, height:1, background:`linear-gradient(to right,transparent,${t.purpleBord})`, maxWidth:70, display:"inline-block" }}/>
      ✦ {text}
      <span style={{ flex:1, height:1, background:`linear-gradient(to left,transparent,${t.purpleBord})`, maxWidth:70, display:"inline-block" }}/>
    </p>
  );
}
 
// ─────────────────────────────────────────────────────────────
//  SIDE GLOWS
// ─────────────────────────────────────────────────────────────
function SideGlows({ t }) {
  return (
    <>
      <div style={{ position:"fixed", top:0, left:0, bottom:0, width:150, zIndex:30, pointerEvents:"none",
        background:`linear-gradient(to right,${t.accent}22 0%,transparent 100%)` }}/>
      <div style={{ position:"fixed", top:0, right:0, bottom:0, width:150, zIndex:30, pointerEvents:"none",
        background:`linear-gradient(to left,${t.accent}22 0%,transparent 100%)` }}/>
      <div style={{ position:"fixed", top:0, left:0, width:260, height:260, zIndex:29, pointerEvents:"none",
        background:`radial-gradient(ellipse at top left,${t.accent}20,transparent 70%)` }}/>
      <div style={{ position:"fixed", bottom:0, right:0, width:260, height:260, zIndex:29, pointerEvents:"none",
        background:`radial-gradient(ellipse at bottom right,${t.accentAlt}18,transparent 70%)` }}/>
    </>
  );
}
 
// ─────────────────────────────────────────────────────────────
//  NIGHT TOGGLE
// ─────────────────────────────────────────────────────────────
function NightToggle({ dark, toggle, t }) {
  return (
    <motion.button onClick={toggle} whileHover={{ scale:1.12 }} whileTap={{ scale:0.9 }}
      aria-label="Toggle dark mode"
      style={{ position:"fixed", bottom:28, right:28, zIndex:300,
        width:52, height:52, borderRadius:"50%",
        background: dark ? `linear-gradient(135deg,#1a1535,#2d1a4a)` : `linear-gradient(135deg,${t.purpleSoft},${t.pinkSoft})`,
        border:`2px solid ${t.purpleBord}`, cursor:"pointer",
        display:"flex", alignItems:"center", justifyContent:"center", fontSize:22,
        boxShadow:`0 4px 24px ${t.accent}44` }}>
      <AnimatePresence mode="wait">
        <motion.span key={dark?"d":"l"}
          initial={{rotate:-90,opacity:0,scale:0.4}}
          animate={{rotate:0,opacity:1,scale:1}}
          exit={{rotate:90,opacity:0,scale:0.4}}
          transition={{duration:0.28}}>
          {dark?"🌙":"☀️"}
        </motion.span>
      </AnimatePresence>
    </motion.button>
  );
}
 
// ─────────────────────────────────────────────────────────────
//  NAVBAR
// ─────────────────────────────────────────────────────────────
function Navbar({ dark, toggle, t }) {
  const [scrolled, setScrolled] = useState(false);
  const [active,   setActive]   = useState("hero");
  const [menu,     setMenu]     = useState(false);
 
  useEffect(()=>{
    const fn = ()=>{
      setScrolled(window.scrollY>30);
      ["hero","about","skills","projects","contact"].reverse().some(id=>{
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top < 200) { setActive(id); return true; }
        return false;
      });
    };
    window.addEventListener("scroll", fn);
    return ()=>window.removeEventListener("scroll", fn);
  },[]);
 
  const go = id => { document.getElementById(id)?.scrollIntoView({behavior:"smooth"}); setMenu(false); };
 
  return (
    <motion.nav initial={{y:-80,opacity:0}} animate={{y:0,opacity:1}} transition={{duration:0.7,ease:[0.22,1,0.36,1]}}
      style={{ position:"fixed", top:0, left:0, right:0, zIndex:100,
        background: scrolled ? t.navBg : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled ? `1px solid ${t.border}` : "none",
        transition:"all 0.35s ease", padding:"0 2.5rem" }}>
 
      <div style={{ maxWidth:1200, margin:"0 auto", display:"flex", alignItems:"center", justifyContent:"space-between", height:68 }}>
 
        {/* Logo */}
        <motion.div whileHover={{scale:1.06}} onClick={()=>go("hero")}
          style={{ fontFamily:"'Playfair Display',serif", fontSize:24, fontWeight:700,
            color:t.blue, cursor:"pointer", letterSpacing:"-0.5px",
            display:"flex", alignItems:"center", gap:1 }}>
          SP
          <motion.span animate={{color:[t.pink,t.accent,t.pink]}} transition={{repeat:Infinity,duration:3}}
            style={{fontSize:28}}>.</motion.span>
        </motion.div>
 
        {/* Links */}
        <div style={{ display:"flex", gap:4, alignItems:"center",
          background: scrolled ? `${t.purpleSoft}88` : "transparent",
          border: scrolled ? `1px solid ${t.border}` : "none",
          borderRadius:32, padding: scrolled ? "4px 8px" : "0",
          transition:"all 0.35s" }} className="desk-nav">
          {["Hero","About","Skills","Projects","Contact"].map(l=>(
            <motion.button key={l} onClick={()=>go(l.toLowerCase())}
              whileHover={{scale:1.05}} whileTap={{scale:0.96}}
              style={{ background: active===l.toLowerCase() ? `${t.accent}22` : "transparent",
                border:"none", cursor:"pointer", fontSize:14, fontWeight:600, fontFamily:"inherit",
                color: active===l.toLowerCase() ? t.accent : t.textSub,
                borderRadius:24, padding:"7px 16px", transition:"all 0.2s" }}>
              {l}
            </motion.button>
          ))}
        </div>
 
        <div style={{ display:"flex", gap:10, alignItems:"center" }} className="desk-nav">
          {/* inline toggle */}
          <motion.button whileHover={{scale:1.1}} whileTap={{scale:0.9}} onClick={toggle}
            style={{ width:38, height:38, borderRadius:"50%",
              background:t.purpleSoft, border:`1.5px solid ${t.purpleBord}`,
              cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", fontSize:16 }}>
            <AnimatePresence mode="wait">
              <motion.span key={dark?"d2":"l2"} initial={{rotate:-90,opacity:0}} animate={{rotate:0,opacity:1}} exit={{rotate:90,opacity:0}} transition={{duration:0.25}}>
                {dark?"🌙":"☀️"}
              </motion.span>
            </AnimatePresence>
          </motion.button>
 
          <motion.a href="https://github.com/Prasanna6725" target="_blank" rel="noreferrer"
            whileHover={{scale:1.05,y:-1,boxShadow:`0 8px 24px ${t.accent}50`}} whileTap={{scale:0.97}}
            style={{ background:`linear-gradient(135deg,${t.blue},${t.accent})`,
              color:"#fff", padding:"9px 22px", borderRadius:24, fontSize:14,
              fontWeight:600, textDecoration:"none" }}>
            GitHub ✦
          </motion.a>
        </div>
 
        {/* Hamburger */}
        <button onClick={()=>setMenu(m=>!m)} className="ham" aria-label="Menu"
          style={{ background:"none", border:"none", cursor:"pointer", display:"none",
            flexDirection:"column", gap:5, padding:4 }}>
          {[0,1,2].map(i=>(
            <motion.span key={i} style={{ display:"block", width:24, height:2, background:t.text, borderRadius:2, transformOrigin:"center" }}
              animate={menu?(i===1?{opacity:0}:i===0?{rotate:45,y:7}:{rotate:-45,y:-7}):{rotate:0,y:0,opacity:1}}
              transition={{duration:0.25}}/>
          ))}
        </button>
      </div>
 
      <AnimatePresence>
        {menu&&(
          <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              style={{
                background: t.navBg,
                backdropFilter: "blur(20px)",
                borderBottom: `1px solid ${t.border}`,
                overflow: "hidden",
                marginBottom: "40px",
              }}>
            <div style={{ padding:"1rem 2.5rem 1.5rem", display:"flex", flexDirection:"column", gap:14 }}>
              {["Hero","About","Skills","Projects","Contact"].map(l=>(
                <button key={l} onClick={()=>go(l.toLowerCase())}
                  style={{ background:"none", border:"none", cursor:"pointer", fontSize:16, fontWeight:600, color:t.text, textAlign:"left", fontFamily:"inherit" }}>
                  {l}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
 
      <style>{`
        @media(max-width:768px){.desk-nav{display:none!important}.ham{display:flex!important}}
        @media(prefers-reduced-motion:reduce){*,*::before,*::after{animation-duration:.01ms!important;transition-duration:.01ms!important}}
        html{scroll-behavior:smooth}
        *{box-sizing:border-box;margin:0;padding:0}
        body{overflow-x:hidden}
        ::-webkit-scrollbar{width:4px}
        ::-webkit-scrollbar-thumb{background:${t.purpleBord};border-radius:10px}
        @keyframes blink{50%{opacity:0}}
        @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-12px)}}
      `}</style>
    </motion.nav>
  );
}
 
// ─────────────────────────────────────────────────────────────
//  HERO
// ─────────────────────────────────────────────────────────────
function Hero({ t }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target:ref, offset:["start start","end start"] });
  const blob1Y  = useTransform(scrollYProgress,[0,1],["0%","55%"]);
  const blob2Y  = useTransform(scrollYProgress,[0,1],["0%","30%"]);
  const doodleY = useTransform(scrollYProgress,[0,1],["0%","22%"]);
  const textY   = useTransform(scrollYProgress,[0,1],["0%","14%"]);
 
  const typed = useTyping(["Full Stack Developer","Problem Solver","Creative Coder","Java Developer","Tech Enthusiast"]);
 
  const sendHello = () => {
  emailjs.send(
    "service_vlrg53h",
    "template_1ws2l0s",
    {
      name: "Portfolio Visitor",
      email: "visitor@portfolio.com",
      message: "Heyyy Prasanna! Someone clicked Say Hello👋",
    },
    "y1-HvLXSjePPPfREp"
  )
  .then(() => {
    confetti({
  particleCount: 80,
  spread: 70,
  origin: { y: 0.6 },
});
    toast.success("Hello sent ✨");
  })
  .catch((error) => {
    console.log(error);
    toast.error("Something went wrong 😭");
  });
};
  return (
    <section id="hero" ref={ref} style={{ minHeight:"100vh", display:"flex", alignItems:"center",
      position:"relative", overflow:"hidden", background:t.heroGrad, padding: window.innerWidth <= 768 ? "180px 1.5rem 60px": "120px 2.5rem 60px" }}>
 
      {/* Parallax blob 1 — slowest */}
      <motion.div style={{ position:"absolute", top:"-15%", right:"-8%", width:620, height:620,
        borderRadius:"60% 40% 70% 30%/50% 60% 40% 50%",
        background:t.heroBlob1, y:blob1Y, zIndex:0, opacity:0.5 }}/>
 
      {/* Parallax blob 2 — medium */}
      <motion.div style={{ position:"absolute", bottom:"0%", left:"-10%", width:460, height:460,
        borderRadius:"40% 60% 30% 70%/60% 40% 70% 30%",
        background:t.heroBlob2, y:blob2Y, zIndex:0, opacity:0.55 }}/>
 
 
 
      {/* Parallax doodle layer */}
      <motion.div style={{ position:"absolute", inset:0, y:doodleY, zIndex:1, pointerEvents:"none" }}>
        <FloatDoodle shape="star"     style={{width:72,top:"12%",left:"6%"}}     c={t.accentAlt} duration={5} delay={0}/>
        <FloatDoodle shape="plus"     style={{width:50,top:"18%",right:"22%"}}   c={t.accent}    duration={4} delay={0.5}/>
        <SpinDoodle  shape="circle"   style={{width:120,top:"8%",right:"4%"}}    c={t.accent}    duration={25}/>
        <FloatDoodle shape="wave"     style={{width:200,bottom:"22%",left:"2%"}} c={t.accentAlt} duration={6} delay={1}/>
        <FloatDoodle shape="diamond"  style={{width:60,bottom:"18%",right:"8%"}} c={t.accentAlt} duration={5} delay={0.8}/>
        <Doodle      shape="dots"     style={{width:88,bottom:"10%",left:"28%"}} c={t.purpleBord}/>
        <SpinDoodle  shape="hexagon"  style={{width:95,top:"54%",right:"2%"}}    c={t.blue}      duration={18}/>
        <FloatDoodle shape="triangle" style={{width:54,top:"34%",left:"2%"}}     c={t.accent}    duration={4.5} delay={1.2}/>
        <FloatDoodle shape="cross"    style={{width:56,bottom:"36%",right:"26%"}}c={t.accent}    duration={5.5} delay={0.3}/>
        <SpinDoodle  shape="infinity" style={{width:108,top:"68%",left:"10%"}}   c={t.accentAlt} duration={14}/>
        <FloatDoodle shape="zigzag"   style={{width:130,top:"25%",left:"25%"}}   c={t.accent}    duration={7} delay={2}/>
        <SpinDoodle  shape="spiral"   style={{width:80,bottom:"42%",left:"42%"}} c={t.blue}      duration={22}/>
      </motion.div>
 
      {/* Content */}
      <motion.div style={{ maxWidth:1200, margin:"0 auto", width:"100%", display:"flex",
        alignItems:"center", gap:60, flexWrap:"wrap", position:"relative", zIndex:2, y:textY }}>
 
        <div style={{ flex:"1 1 380px" }}>
 
          <motion.p initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.2,duration:0.6}}
            style={{ fontSize:12, fontWeight:700, color:t.accent, letterSpacing:4,
              textTransform:"uppercase", marginBottom:18 }}>
            ✦ Welcome to my portfolio
          </motion.p>
 
          {/* NAME — solid colours, no gradient-text trick */}
          <motion.h1 initial={{opacity:0,y:30}} animate={{opacity:1,y:0}} transition={{delay:0.35,duration:0.7}}
            style={{ fontFamily:"'Playfair Display',serif",
              fontSize:"clamp(2.8rem,6vw,4.4rem)",
              fontWeight:700, lineHeight:1.1, marginBottom:20, letterSpacing:"-1px" }}>
            <span style={{ color:t.text }}>Seshagiri</span>
            <br/>
            <span style={{ color:t.blue }}>Gnana Jayalakshmi Prasanna</span>
          </motion.h1>
 
          {/* Typing badge */}
          <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.5,duration:0.6}}
            style={{ display:"inline-flex", alignItems:"center", gap:10,
              background:t.purpleSoft, border:`1.5px solid ${t.purpleBord}`,
              borderRadius:24, padding:"8px 20px", marginBottom:24 }}>
            <motion.span animate={{scale:[1,1.4,1]}} transition={{repeat:Infinity,duration:1.2}}
              style={{ width:8, height:8, borderRadius:"50%", background:t.accent, display:"inline-block" }}/>
            <span style={{ fontSize:15, fontWeight:600, color:t.blue, minWidth:240 }}>
              {typed}
              <span style={{ color:t.accentAlt, animation:"blink 1s step-end infinite" }}>|</span>
            </span>
          </motion.div>
 
          <motion.p initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.62,duration:0.6}}
            style={{ fontSize:18, color:t.textSub, lineHeight:1.75, marginBottom:38, maxWidth:480 }}>
            Blending creativity with code to build{" "}
            <strong style={{ color:t.accent }}>meaningful</strong> digital experiences.
          </motion.p>
 
          {/* CTA buttons */}
          <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.78,duration:0.6}}
            style={{ display:"flex", gap:14, flexWrap:"wrap" }}>
            <motion.button
              whileHover={{ scale:1.05, y:-3, boxShadow:`0 18px 44px ${t.accent}50` }}
              whileTap={{ scale:0.97 }}
              onClick={()=>document.getElementById("projects")?.scrollIntoView({behavior:"smooth"})}
              style={{ background:`linear-gradient(135deg,${t.blue},${t.accent})`,
                color:"#fff", border:"none", padding:"14px 34px",
                borderRadius:32, fontSize:16, fontWeight:600,
                cursor:"pointer", fontFamily:"inherit" }}>
              View My Work ↓
            </motion.button>
            <motion.button
              onClick={sendHello}
              whileHover={{ scale:1.05, y:-3 }} whileTap={{ scale:0.97 }}
              style={{ color:t.accent, border:`2px solid ${t.purpleBord}`,
                padding:"13px 28px", borderRadius:32, fontSize:16, fontWeight:600,
                textDecoration:"none", display:"inline-flex", alignItems:"center", gap:8,
                background:`${t.purpleSoft}88` }}>
              Say Hello 👋
            </motion.button>
          </motion.div>
 
          {/* Stats — solid colour numbers */}
          <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.95,duration:0.6}}
            style={{ display:"flex", gap:36, marginTop:44, paddingTop:36,
              borderTop:`1px solid ${t.border}` }}>
            {[["3+","Years Learning"],["15+","Projects Built"],["5+","Tech Stacks"]].map(([n,l])=>(
              <div key={l}>
                <div style={{ fontFamily:"'Playfair Display',serif", fontSize:28,
                  fontWeight:700, color:t.accent }}>{n}</div>
                <div style={{ fontSize:12, color:t.textMuted, fontWeight:500, marginTop:3 }}>{l}</div>
              </div>
            ))}
          </motion.div>
        </div>
 
        {/* Avatar */}
        <motion.div initial={{opacity:0,scale:0.82}} animate={{opacity:1,scale:1}}
          transition={{delay:0.5,duration:0.9,ease:[0.22,1,0.36,1]}}>
          <div style={{ position:"relative", width:300, height:300 }}>
            {/* Rings */}
            <motion.div animate={{rotate:360}} transition={{repeat:Infinity,duration:22,ease:"linear"}}
              style={{ position:"absolute", inset:-14, borderRadius:"50%",
                border:`2px dashed ${t.purpleBord}`, opacity:0.5 }}/>
            <motion.div animate={{rotate:-360}} transition={{repeat:Infinity,duration:16,ease:"linear"}}
              style={{ position:"absolute", inset:-32, borderRadius:"50%",
                border:`1.5px dashed ${t.accentAlt}`, opacity:0.28 }}/>
            <motion.div animate={{rotate:360}} transition={{repeat:Infinity,duration:35,ease:"linear"}}
              style={{ position:"absolute", inset:-52, borderRadius:"50%",
                border:`1px dashed ${t.blue}`, opacity:0.15 }}/>
 
            <div style={{ position:"absolute", inset:0,
              borderRadius:"60% 40% 55% 45%/50% 55% 45% 50%",
              background:t.avatarBg, border:`3px solid ${t.purpleBord}` }}/>
            <div style={{ position:"absolute", inset:14,
              borderRadius:"55% 45% 60% 40%/55% 45% 60% 40%",
              display:"flex", alignItems:"center", justifyContent:"center", fontSize:90 }}>
              👩‍💻
            </div>
 
            {/* Floating "Available" badge */}
            <motion.div animate={{y:[0,-10,0]}} transition={{repeat:Infinity,duration:3.4,ease:"easeInOut"}}
              style={{ position:"absolute", bottom:-16, right:-20,
                background:t.bgCard, borderRadius:16, padding:"9px 16px",
                boxShadow:t.shadow, border:`1.5px solid ${t.purpleBord}`,
                fontSize:13, fontWeight:600, color:t.blue,
                display:"flex", alignItems:"center", gap:7 }}>
              <motion.span animate={{scale:[1,1.5,1]}} transition={{repeat:Infinity,duration:1.6}}
                style={{color:"#22c55e"}}>●</motion.span>
              Available for work
            </motion.div>
 
            {/* React Dev bubble */}
            <motion.div animate={{y:[0,9,0]}} transition={{repeat:Infinity,duration:4.2,ease:"easeInOut",delay:1.2}}
              style={{ position:"absolute", top:-16, left:-28,
                background:`linear-gradient(135deg,${t.purpleSoft},${t.pinkSoft})`,
                border:`1.5px solid ${t.purpleBord}`, borderRadius:14, padding:"8px 14px",
                fontSize:13, fontWeight:600, color:t.accent, boxShadow:t.shadow }}>
              ⚛️ React Dev
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
 
      {/* Scroll hint */}
      <motion.div animate={{y:[0,10,0]}} transition={{repeat:Infinity,duration:2.5,ease:"easeInOut"}}
        onClick={()=>document.getElementById("about")?.scrollIntoView({behavior:"smooth"})}
        style={{ position:"absolute", bottom:34, left:"50%", transform:"translateX(-50%)",
          display:"flex", flexDirection:"column", alignItems:"center", gap:6,
          color:t.textMuted, fontSize:12, fontWeight:500, cursor:"pointer", zIndex:3 }}>
        <span>scroll down</span>
        <div style={{ width:1, height:42, background:`linear-gradient(to bottom,${t.accent},transparent)` }}/>
      </motion.div>
    </section>
  );
}
 
// ─────────────────────────────────────────────────────────────
//  ABOUT
// ─────────────────────────────────────────────────────────────
function About({ t }) {
  const tags=[["🎓","B.Tech CSE(AIML)"],["📍","India"],["💼","Open to Work"],["🌱","Learning Cloud"],["⚡","DSA Nerd"],["☕","Java Lover"]];
 
  return (
    <section id="about" style={{ padding:"110px 2.5rem", background:t.bg, position:"relative", overflow:"hidden" }}>
      <FloatDoodle shape="plus"     style={{width:56,top:"7%",right:"4%"}}       c={t.accent}    duration={4.5}/>
      <FloatDoodle shape="star"     style={{width:64,bottom:"7%",left:"2%"}}     c={t.accent}    duration={5} delay={1}/>
      <SpinDoodle  shape="circle"   style={{width:100,top:"13%",left:"4%"}}      c={t.accentAlt} duration={30}/>
      <FloatDoodle shape="wave"     style={{width:175,bottom:"18%",right:"2%"}}  c={t.accent}    duration={6} delay={0.5}/>
      <Doodle      shape="dots"     style={{width:78,top:"46%",right:"5%"}}      c={t.purpleBord}/>
      <FloatDoodle shape="diamond"  style={{width:52,bottom:"26%",left:"6%"}}    c={t.accent}    duration={5} delay={0.8}/>
      <SpinDoodle  shape="hexagon"  style={{width:88,top:"28%",right:"13%"}}     c={t.accentAlt} duration={20}/>
      <FloatDoodle shape="triangle" style={{width:48,bottom:"4%",right:"18%"}}   c={t.blue}      duration={4} delay={1.5}/>
      <SpinDoodle  shape="spiral"   style={{width:85,top:"58%",left:"2%"}}       c={t.accentAlt} duration={18}/>
      <FloatDoodle shape="infinity" style={{width:100,bottom:"42%",right:"16%"}} c={t.accent}    duration={7} delay={2}/>
      <Doodle      shape="zigzag"   style={{width:140,top:"80%",left:"15%"}}     c={t.purpleBord}/>
      <FloatDoodle shape="cross"    style={{width:58,top:"42%",left:"14%"}}      c={t.accentAlt} duration={5.5} delay={0.4}/>
 
      <div style={{ maxWidth:1100, margin:"0 auto" }}>
        <Reveal>
          <SectionLabel text="About Me" t={t}/>
          <h2 style={{ textAlign:"center", fontFamily:"'Playfair Display',serif",
            fontSize:"clamp(2rem,4vw,2.8rem)", fontWeight:700, color:t.text, marginBottom:64 }}>
            The person behind the{" "}
            <span style={{ color:t.accent }}>code</span>
          </h2>
        </Reveal>
 
        <div style={{ display:"flex", gap:64, alignItems:"center", flexWrap:"wrap" }}>
          <Reveal dir="right" delay={0.15}>
            <div style={{ flex:"0 0 auto", textAlign:"center" }}>
              <TiltCard style={{ display:"inline-block" }}>
                <motion.div whileHover={{scale:1.03}}
                  style={{ width:230, height:230, borderRadius:"50%", margin:"0 auto 18px",
                    background:t.avatarBg, display:"flex", alignItems:"center",
                    justifyContent:"center", fontSize:96,
                    border:`4px solid ${t.purpleBord}`, boxShadow:t.shadow }}>
                  🤵‍♀️
                </motion.div>
              </TiltCard>
              {/* Name — solid colour, always visible */}
              <div style={{ fontFamily:"'Playfair Display',serif", fontSize:21, fontWeight:700, color:t.text }}>
                Seshagiri Prasanna
              </div>
              <div style={{ fontSize:14, color:t.accent, fontWeight:600, marginTop:5 }}>
                Full Stack Developer
              </div>
              <div style={{ display:"flex", gap:10, justifyContent:"center", marginTop:16 }}>
                {[{icon:"🐙",href:"https://github.com/Prasanna6725"},{icon:"💼",href:"https://www.linkedin.com/in/seshagiri-prasanna-aa598a2a4/"},{icon:"📧",href:"mailto:seshagiriprasanna005@gmail.com"}].map(({icon,href})=>(
                  <motion.a key={icon} href={href} target="_blank" rel="noreferrer"
                    whileHover={{scale:1.2,y:-4,boxShadow:t.shadow}}
                    style={{ width:40, height:40, borderRadius:"50%", background:t.purpleSoft,
                      border:`1.5px solid ${t.purpleBord}`, display:"flex",
                      alignItems:"center", justifyContent:"center", fontSize:18, textDecoration:"none" }}>
                    {icon}
                  </motion.a>
                ))}
              </div>
            </div>
          </Reveal>
 
          <Reveal dir="left" delay={0.25}>
            <div style={{ flex:"1 1 340px" }}>
              {[
                <>Hi! I'm Prasanna — a <strong style={{color:t.accent}}>Full Stack Developer</strong>who enjoys turning ideas into interactive and meaningful digital experiences.</>,
                <>I love mixing creativity with code, whether it’s building smooth user interfaces or solving challenging backend problems.</>,
                <>Currently exploring modern web technologies, design aesthetics, and everything that helps me grow into a better developer every day.</>,
              ].map((para,i)=>(
                <motion.p key={i} initial={{opacity:0,x:-20}} whileInView={{opacity:1,x:0}}
                  viewport={{once:true}} transition={{delay:i*0.15, duration:0.6}}
                  style={{ fontSize:17, color:t.textSub, lineHeight:1.88, marginBottom:20 }}>
                  {para}
                </motion.p>
              ))}
              <div style={{ display:"flex", gap:10, flexWrap:"wrap", marginTop:8 }}>
                {tags.map(([icon,label])=>(
                  <motion.div key={label} whileHover={{y:-4,boxShadow:t.shadow,scale:1.04}}
                    style={{ background:t.purpleSoft, border:`1.5px solid ${t.purpleBord}`,
                      borderRadius:24, padding:"7px 16px", fontSize:13, color:t.text,
                      fontWeight:500, cursor:"default", transition:"box-shadow 0.2s" }}>
                    {icon} {label}
                  </motion.div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
 
// ─────────────────────────────────────────────────────────────
//  SKILLS
// ─────────────────────────────────────────────────────────────
const SKILLS=[
  {name:"Java",                         icon:"☕",level:88,color:"#ef4444"},
  {name:"Data Structures & Algorithms", icon:"🔗",level:85,color:"#1a4ed8"},
  {name:"React / Frontend",             icon:"⚛️",level:82,color:"#06b6d4"},
  {name:"Backend / APIs",               icon:"🖥️",level:80,color:"#7c3aed"},
  {name:"Problem Solving",              icon:"🧩",level:92,color:"#db2777"},
  {name:"SQL / Databases",              icon:"🗄️",level:76,color:"#059669"},
  {name:"Git & Version Control",        icon:"🌿",level:84,color:"#d97706"},
  {name:"HTML & CSS",                   icon:"🎨",level:90,color:"#ea580c"},
];
const MARQUEE=["⚛️ React","☕ Java","🐍 Python","🎨 CSS","🗄️ SQL","🌿 Git","⚡ Node","🐳 Docker","☁️ AWS","🔧 Spring","📱 Responsive","🌐 REST API"];
 
function SkillCard({ s, delay, t }) {
  const ref = useRef(null);
  const inView = useInView(ref, {once:true});
  const [hov, setHov] = useState(false);
  return (
    <TiltCard>
      <motion.div ref={ref}
        initial={{opacity:0,y:32,scale:0.93}} animate={inView?{opacity:1,y:0,scale:1}:{} }
        transition={{delay,duration:0.58,ease:[0.22,1,0.36,1]}}
        onHoverStart={()=>setHov(true)} onHoverEnd={()=>setHov(false)}
        style={{ background:t.bgCard, borderRadius:18, padding:"20px 22px",
          boxShadow: hov ? `0 14px 36px ${s.color}30` : t.shadow,
          border:`1.5px solid ${hov ? s.color+"70" : t.border}`,
          transition:"all 0.3s ease" }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:12 }}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <motion.span animate={hov?{rotate:[-12,12,-12,0]}:{}} transition={{duration:0.4}} style={{fontSize:22}}>
              {s.icon}
            </motion.span>
            {/* Skill name — solid colour */}
            <span style={{ fontSize:14, fontWeight:600, color:t.text }}>{s.name}</span>
          </div>
          <span style={{ fontSize:14, fontWeight:700, color:s.color }}>{s.level}%</span>
        </div>
        <div style={{ height:8, background:t.bgAlt, borderRadius:4, overflow:"hidden" }}>
          <motion.div
            initial={{width:0}} animate={inView?{width:`${s.level}%`}:{width:0}}
            transition={{duration:1.4, delay:delay+0.2, ease:[0.22,1,0.36,1]}}
            style={{ height:"100%", borderRadius:4, background:`linear-gradient(90deg,${s.color}70,${s.color})` }}/>
        </div>
      </motion.div>
    </TiltCard>
  );
}
 
function Skills({ t }) {
  return (
    <section id="skills" style={{ padding:"110px 2.5rem", background:t.bgAlt, position:"relative", overflow:"hidden" }}>
      <SpinDoodle  shape="spiral"   style={{width:108,top:"4%",right:"2%"}}       c={t.accent}    duration={22}/>
      <FloatDoodle shape="star"     style={{width:65,top:"7%",left:"3%"}}         c={t.blue}      duration={5}/>
      <FloatDoodle shape="wave"     style={{width:215,top:"21%",right:"6%"}}      c={t.accentAlt} duration={6.5}/>
      <Doodle      shape="dots"     style={{width:90,bottom:"12%",left:"2%"}}     c={t.purpleBord}/>
      <SpinDoodle  shape="hexagon"  style={{width:88,bottom:"6%",right:"3%"}}     c={t.accentAlt} duration={24}/>
      <FloatDoodle shape="plus"     style={{width:48,top:"43%",left:"5%"}}        c={t.accent}    duration={4}/>
      <FloatDoodle shape="diamond"  style={{width:56,bottom:"26%",right:"10%"}}   c={t.blue}      duration={5.5}/>
      <SpinDoodle  shape="circle"   style={{width:100,top:"58%",right:"1%"}}      c={t.accent}    duration={28}/>
      <FloatDoodle shape="triangle" style={{width:52,top:"73%",left:"8%"}}        c={t.accentAlt} duration={4.5} delay={1}/>
      <FloatDoodle shape="cross"    style={{width:62,top:"28%",left:"12%"}}       c={t.accentAlt} duration={5}/>
      <Doodle      shape="zigzag"   style={{width:150,bottom:"42%",right:"14%"}}  c={t.purpleBord}/>
      <FloatDoodle shape="infinity" style={{width:112,top:"14%",left:"20%"}}      c={t.accent}    duration={7} delay={1.5}/>
 
      <div style={{ maxWidth:1100, margin:"0 auto" }}>
        <Reveal>
          <SectionLabel text="What I Know" t={t}/>
          <h2 style={{ textAlign:"center", fontFamily:"'Playfair Display',serif",
            fontSize:"clamp(2rem,4vw,2.8rem)", fontWeight:700, color:t.text, marginBottom:24 }}>
            Skills &{" "}
            <span style={{ color:t.accent }}>Expertise</span>
          </h2>
        </Reveal>
 
        {/* Marquee */}
        <Reveal delay={0.1}>
          <div style={{ overflow:"hidden", marginBottom:56, padding:"16px 0",
            background:`linear-gradient(135deg,${t.purpleSoft},${t.bgCard})`,
            borderRadius:16, border:`1px solid ${t.border}` }}>
            <motion.div animate={{x:["0%","-50%"]}} transition={{repeat:Infinity,duration:20,ease:"linear"}}
              style={{ display:"flex", gap:40, width:"200%", alignItems:"center", padding:"0 40px" }}>
              {[...MARQUEE,...MARQUEE].map((item,i)=>(
                <span key={i} style={{ fontSize:14, fontWeight:600, color:t.textSub,
                  whiteSpace:"nowrap", flexShrink:0 }}>{item}</span>
              ))}
            </motion.div>
          </div>
        </Reveal>
 
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))", gap:18 }}>
          {SKILLS.map((s,i)=><SkillCard key={s.name} s={s} delay={i*0.07} t={t}/>) }
        </div>
      </div>
    </section>
  );
}
 
// ─────────────────────────────────────────────────────────────
//  PROJECTS
// ─────────────────────────────────────────────────────────────
const PROJECTS=[
  {title:"Multi-Provider OAuth 2.0 Authentication Service (JWT + RBAC)",   desc:"Built a secure Node.js-based authentication system with OAuth 2.0 (GitHub), JWT, and RBAC Developed REST APIs with PostgreSQL & Redis, containerized using Docker Implemented token-based authentication, rate limiting, and CI for reliability.",       tech:["JavaScript","RESTful API Design","OAuth 2.0"],       gh:"https://github.com/Prasanna6725/Multi-Provider-OAuth-2.0-Authentication-Service.git", emoji:"📋", color:"#1a4ed8"},
  {title:"Multi-Tenant-SaaS-Platform",  desc:"Built a production-ready, multi-tenant SaaS application where multiple organizations (tenants) can independently register, manage their teams, create projects, and track tasks. This is a full-stack application requiring backend API development, frontend user interface, database design, and Docker containerization.",tech:["Java","Spring Boot","JPA","Multi Tenancy","Docker Compose"],  gh:"https://github.com/Prasanna6725/Multi-Tenant-SaaS-Platform.git", emoji:"🛒", color:"#7c3aed"},
  {title:"Algorithm Visualizer", desc:" A secure authentication microservice using RSA-4096, TOTP 2FA, Docker, and cron. Implements encrypted seed decryption, TOTP code generation, code verication, and persistent storage inside a containerized environment.",tech:["Java","Spring Boot","PKI","REST APIs","Cryptography"],   gh:"https://github.com/Prasanna6725/PKI-Based-2FA-Microservice-with-Docker.git", emoji:"📊", color:"#db2777"},
  {title:"LLM Powered Prompt Router for Intent Classification",     desc:"Built an AI-powered prompt routing system using Python and Groq API that classifies user intent and dynamically routes requests to specialized AI personas such as coding assistant, writing coach, data analyst, and career advisor. Implemented structured JSON parsing, confidence-based routing, fallback handling, and request logging to simulate real-world modular AI system design.",         tech:["Python","Groq API","JSON","LLMs (Llama 3.1)"],       gh:"https://github.com/Prasanna6725/LLM-Powered-Prompt-Router-for-Intent-Classification.git", emoji:"💬", color:"#059669"},
];
 
function ProjectCard({ p, delay, t }) {
  const ref = useRef(null);
  const inView = useInView(ref, {once:true, margin:"-60px"});
  const [hov, setHov] = useState(false);
  return (
    <TiltCard>
      <motion.div ref={ref}
        initial={{opacity:0,y:50,scale:0.93}} animate={inView?{opacity:1,y:0,scale:1}:{} }
        transition={{delay,duration:0.68,ease:[0.22,1,0.36,1]}}
        onHoverStart={()=>setHov(true)} onHoverEnd={()=>setHov(false)}
        style={{ background:t.bgCard, borderRadius:22, padding:"28px 26px",
          boxShadow: hov ? `0 22px 60px ${p.color}2a` : t.shadow,
          border:`1.5px solid ${hov ? p.color+"60" : t.border}`,
          transition:"all 0.35s ease", display:"flex", flexDirection:"column",
          gap:14, position:"relative", overflow:"hidden" }}>
 
        {/* Corner glow on hover */}
        <motion.div animate={{opacity:hov?1:0}}
          style={{ position:"absolute", top:0, right:0, width:220, height:220,
            borderRadius:"50%", background:`radial-gradient(circle,${p.color}18,transparent 70%)`,
            pointerEvents:"none", zIndex:0 }}/>
 
        <div style={{ position:"relative", zIndex:1 }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:12 }}>
            <div style={{ display:"flex", alignItems:"center", gap:12 }}>
              <motion.div animate={hov?{scale:1.18,rotate:8}:{scale:1,rotate:0}}
                style={{ fontSize:38, background:`${p.color}14`,
                  border:`1.5px solid ${t.border}`, borderRadius:14, padding:"10px 12px" }}>
                {p.emoji}
              </motion.div>
              {/* Title — solid colour, always visible */}
              <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:20,
                fontWeight:700, color:t.text }}>{p.title}</h3>
            </div>
            <div style={{ background:`${p.color}18`, border:`1px solid ${p.color}40`,
              borderRadius:20, padding:"4px 12px", fontSize:11, fontWeight:700, color:p.color }}>
              ● Live
            </div>
          </div>
 
          <p style={{ fontSize:15, color:t.textSub, lineHeight:1.72 }}>{p.desc}</p>
 
          <div style={{ display:"flex", gap:8, flexWrap:"wrap", margin:"14px 0" }}>
            {p.tech.map(tech=>(
              <span key={tech} style={{ background:t.purpleSoft, color:t.accent,
                border:`1px solid ${t.purpleBord}`, fontSize:12, fontWeight:600,
                padding:"4px 12px", borderRadius:20 }}>{tech}</span>
            ))}
          </div>
 
          <motion.a href={p.gh} target="_blank" rel="noreferrer" whileHover={{x:4}}
            style={{ display:"inline-flex", alignItems:"center", gap:6,
              color:p.color, fontSize:14, fontWeight:700, textDecoration:"none" }}>
            🐙 View on GitHub →
          </motion.a>
        </div>
      </motion.div>
    </TiltCard>
  );
}
 
function Projects({ t }) {
  return (
    <section id="projects" style={{ padding:"110px 2.5rem", background:t.bg, position:"relative", overflow:"hidden" }}>
      <FloatDoodle shape="star"     style={{width:74,top:"4%",left:"3%"}}          c={t.accentAlt} duration={5}/>
      <FloatDoodle shape="plus"     style={{width:54,bottom:"6%",right:"3%"}}      c={t.accent}    duration={4} delay={0.5}/>
      <SpinDoodle  shape="circle"   style={{width:104,top:"8%",right:"4%"}}        c={t.accent}    duration={26}/>
      <FloatDoodle shape="wave"     style={{width:190,top:"32%",left:"1%"}}        c={t.accentAlt} duration={6}/>
      <Doodle      shape="dots"     style={{width:78,bottom:"17%",left:"4%"}}      c={t.purpleBord}/>
      <FloatDoodle shape="diamond"  style={{width:54,top:"52%",right:"2%"}}        c={t.accentAlt} duration={5.5}/>
      <SpinDoodle  shape="spiral"   style={{width:90,bottom:"3%",left:"17%"}}      c={t.accent}    duration={20}/>
      <FloatDoodle shape="cross"    style={{width:60,top:"18%",left:"16%"}}        c={t.accent}    duration={5} delay={0.8}/>
      <SpinDoodle  shape="hexagon"  style={{width:96,bottom:"32%",right:"6%"}}     c={t.blue}      duration={24}/>
      <FloatDoodle shape="triangle" style={{width:52,top:"66%",right:"18%"}}       c={t.accent}    duration={4.5} delay={1.2}/>
      <Doodle      shape="zigzag"   style={{width:145,top:"84%",left:"30%"}}       c={t.purpleBord}/>
      <FloatDoodle shape="infinity" style={{width:108,top:"22%",right:"16%"}}      c={t.accentAlt} duration={7} delay={2}/>
 
      <div style={{ maxWidth:1100, margin:"0 auto" }}>
        <Reveal>
          <SectionLabel text="What I've Built" t={t}/>
          <h2 style={{ textAlign:"center", fontFamily:"'Playfair Display',serif",
            fontSize:"clamp(2rem,4vw,2.8rem)", fontWeight:700, color:t.text, marginBottom:64 }}>
            Featured{" "}
            <span style={{ color:t.accent }}>Projects</span>
          </h2>
        </Reveal>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))", gap:26 }}>
          {PROJECTS.map((p,i)=><ProjectCard key={p.title} p={p} delay={i*0.1} t={t}/>) }
        </div>
      </div>
    </section>
  );
}
 
// ─────────────────────────────────────────────────────────────
//  CONTACT
// ─────────────────────────────────────────────────────────────
function Contact({ t }) {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({name:"",email:"",message:""});
 
  const submit = (e) => {
  e.preventDefault();

  emailjs
    .send(
      "service_vlrg53h",
      "template_1ws2l0s",
      {
        name: form.name,
        email: form.email,
        message: form.message,
      },
      "y1-HvLXSjePPPfREp"
    )
    .then(() => {
      setSent(true);

      setTimeout(() => {
        setSent(false);
      }, 4000);

      setForm({
        name: "",
        email: "",
        message: "",
      });
    })
    .catch((error) => {
      console.log(error);
      alert("Failed to send message ❌");
    });
}; 
 
  const inp = {
    width:"100%", padding:"13px 18px", borderRadius:14, fontSize:15,
    background:t.bgCard, color:t.text, fontFamily:"inherit",
    border:`1.5px solid ${t.border}`, outline:"none", transition:"border 0.2s",
  };
  const foc = e => e.target.style.borderColor = t.accent;
  const blr = e => e.target.style.borderColor = t.border;
 
  return (
    <section id="contact" style={{ padding:"110px 2.5rem",
      background:t.contactGrad, position:"relative", overflow:"hidden" }}>
 
      <div style={{ position:"absolute", top:"-25%", right:"-12%", width:500, height:500,
        borderRadius:"50%", background:"rgba(167,139,250,0.12)", pointerEvents:"none" }}/>
      <div style={{ position:"absolute", bottom:"-25%", left:"-8%", width:420, height:420,
        borderRadius:"50%", background:"rgba(244,114,182,0.1)", pointerEvents:"none" }}/>
 
      <FloatDoodle shape="star"     style={{width:68,top:"8%",left:"4%"}}          c="rgba(255,255,255,0.35)" duration={5}/>
      <FloatDoodle shape="plus"     style={{width:50,bottom:"13%",right:"4%"}}     c="rgba(249,168,212,0.45)" duration={4.5}/>
      <SpinDoodle  shape="circle"   style={{width:108,bottom:"8%",left:"6%"}}      c="rgba(196,181,253,0.35)" duration={28}/>
      <FloatDoodle shape="wave"     style={{width:168,top:"18%",right:"3%"}}       c="rgba(255,255,255,0.18)" duration={6}/>
      <FloatDoodle shape="diamond"  style={{width:54,top:"56%",right:"13%"}}       c="rgba(249,168,212,0.38)" duration={5.5}/>
      <Doodle      shape="dots"     style={{width:74,top:"12%",right:"18%"}}       c="rgba(196,181,253,0.28)"/>
      <FloatDoodle shape="triangle" style={{width:54,bottom:"22%",left:"18%"}}     c="rgba(255,255,255,0.28)" duration={4}/>
      <SpinDoodle  shape="spiral"   style={{width:90,top:"42%",left:"1%"}}         c="rgba(196,181,253,0.3)"  duration={20}/>
      <FloatDoodle shape="cross"    style={{width:60,bottom:"36%",right:"23%"}}    c="rgba(249,168,212,0.32)" duration={5}/>
      <SpinDoodle  shape="hexagon"  style={{width:80,top:"70%",right:"5%"}}        c="rgba(255,255,255,0.2)"  duration={22}/>
      <Doodle      shape="zigzag"   style={{width:150,bottom:"55%",left:"28%"}}    c="rgba(196,181,253,0.18)"/>
 
      <div style={{ maxWidth:920, margin:"0 auto", position:"relative", zIndex:1 }}>
        <Reveal>
          <SectionLabel text="Let's Connect" t={{...t, accent:"rgba(196,181,253,0.9)"}}/>
          <h2 style={{ textAlign:"center", fontFamily:"'Playfair Display',serif",
            fontSize:"clamp(2rem,5vw,3.2rem)", fontWeight:700, color:"#fff",
            marginBottom:16, lineHeight:1.2 }}>
            Have an idea? Let's build it{" "}
            {/* Solid colour — no gradient text */}
            <span style={{ color:t.id==="dark"?"#f9a8d4":"#fbcfe8" }}>together</span>
          </h2>
          <p style={{ textAlign:"center", fontSize:17, color:"rgba(255,255,255,0.65)",
            lineHeight:1.7, marginBottom:56 }}>
            Whether you want to collaborate, hire me, or just say hello — my inbox is always open!
          </p>
        </Reveal>
 
        <div style={{ display:"flex", gap:48, flexWrap:"wrap" }}>
          {/* Form */}
          <Reveal dir="right" delay={0.15}>
            <div style={{ flex:"1 1 320px" }}>
              <motion.form onSubmit={submit}
                style={{ background:t.bgCard, borderRadius:22, padding:"32px 28px",
                  boxShadow:"0 24px 64px rgba(0,0,0,0.35)",
                  border:`1.5px solid ${t.purpleBord}` }}>
                <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:20,
                  fontWeight:700, color:t.text, marginBottom:24 }}>
                  Send a message ✉️
                </h3>
                <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
                  <input placeholder="Your Name" required value={form.name}
                    onChange={e=>setForm(f=>({...f,name:e.target.value}))}
                    style={inp} onFocus={foc} onBlur={blr}/>
                  <input placeholder="Your Email" type="email" required value={form.email}
                    onChange={e=>setForm(f=>({...f,email:e.target.value}))}
                    style={inp} onFocus={foc} onBlur={blr}/>
                  <textarea placeholder="Your message..." required rows={4} value={form.message}
                    onChange={e=>setForm(f=>({...f,message:e.target.value}))}
                    style={{...inp, resize:"vertical"}} onFocus={foc} onBlur={blr}/>
                </div>
                <AnimatePresence mode="wait">
                  {sent ? (
                    <motion.div key="ok" initial={{opacity:0,scale:0.9}} animate={{opacity:1,scale:1}} exit={{opacity:0}}
                      style={{ marginTop:18, padding:"13px 20px",
                        background:t.purpleSoft, border:`1.5px solid ${t.purpleBord}`,
                        borderRadius:12, color:t.accent, fontWeight:600,
                        fontSize:14, textAlign:"center" }}>
                      ✅ Message sent! I'll get back to you soon.
                    </motion.div>
                  ) : (
                    <motion.button key="btn" type="submit"
                      whileHover={{scale:1.03,boxShadow:`0 14px 36px ${t.accent}60`}}
                      whileTap={{scale:0.97}}
                      style={{ width:"100%", marginTop:18, padding:"14px",
                        borderRadius:14, background:`linear-gradient(135deg,${t.blue},${t.accent})`,
                        color:"#fff", border:"none", fontSize:15, fontWeight:700,
                        cursor:"pointer", fontFamily:"inherit" }}>
                      Send Message ✦
                    </motion.button>
                  )}
                </AnimatePresence>
              </motion.form>
            </div>
          </Reveal>
 
          {/* Links */}
          <Reveal dir="left" delay={0.25}>
            <div style={{ flex:"0 1 290px", display:"flex", flexDirection:"column",
              gap:16, justifyContent:"center" }}>
              {[
                {label:"Email Me",  href:"mailto:seshagiriprasanna005@gmail.com",                               icon:"📧", note:"seshagiriprasanna005@gmail.com"},
                {label:"LinkedIn",  href:"https://www.linkedin.com/in/seshagiri-prasanna-aa598a2a4/", icon:"💼", note:"seshagiri-prasanna-aa598a2a4"},
                {label:"GitHub",    href:"https://github.com/Prasanna6725",                           icon:"🐙", note:"Prasanna6725"},
              ].map(({label,href,icon,note})=>(
                <motion.a key={label} href={href}
                  target={href.startsWith("mailto")?undefined:"_blank"} rel="noreferrer"
                  whileHover={{x:8,boxShadow:"0 10px 32px rgba(0,0,0,0.3)"}} whileTap={{scale:0.97}}
                  style={{ display:"flex", alignItems:"center", gap:14,
                    background:"rgba(255,255,255,0.09)", borderRadius:16, padding:"16px 20px",
                    border:"1.5px solid rgba(196,181,253,0.3)", textDecoration:"none",
                    backdropFilter:"blur(12px)" }}>
                  <span style={{fontSize:26,width:38,textAlign:"center",flexShrink:0}}>{icon}</span>
                  <div>
                    <div style={{fontSize:14,fontWeight:700,color:"#fff"}}>{label}</div>
                    <div style={{fontSize:12,color:"rgba(255,255,255,0.5)",marginTop:2}}>{note}</div>
                  </div>
                  <motion.span whileHover={{x:4}}
                    style={{marginLeft:"auto",color:"rgba(255,255,255,0.45)",fontSize:18}}>→</motion.span>
                </motion.a>
              ))}
 
              {/* Availability */}
              <div style={{ background:"rgba(255,255,255,0.07)", borderRadius:16, padding:"20px",
                border:"1.5px solid rgba(34,197,94,0.4)" }}>
                <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8 }}>
                  <motion.span animate={{scale:[1,1.5,1]}} transition={{repeat:Infinity,duration:1.8}}
                    style={{color:"#22c55e",fontSize:18}}>●</motion.span>
                  <span style={{fontSize:14,fontWeight:700,color:"#22c55e"}}>Open to Opportunities</span>
                </div>
                <p style={{fontSize:13,color:"rgba(255,255,255,0.52)",lineHeight:1.65}}>
                  Available for full-time roles, freelance projects, and open source collaborations.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
 
        {/* Footer */}
        <Reveal delay={0.4}>
          <div style={{ borderTop:"1px solid rgba(196,181,253,0.2)", paddingTop:44,
            marginTop:60, textAlign:"center", fontSize:14, color:"rgba(255,255,255,0.38)" }}>
            <p>Designed & Built by{" "}
              <span style={{color:"#f9a8d4",fontWeight:600}}>Seshagiri Prasanna</span>
            </p>
            <p style={{marginTop:6}}>Made with ❤️ using React & Framer Motion · © 2025</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
 
// ─────────────────────────────────────────────────────────────
//  ROOT APP
// ─────────────────────────────────────────────────────────────
export default function App() {
  const [dark, setDark] = useState(false);
  const t = dark ? THEMES.dark : THEMES.light;
  const toggle = () => setDark(d=>!d);
 
  return (
    <div style={{ 
      fontFamily:"'DM Sans','Inter',sans-serif",
      background:t.bg, color:t.text,
      overflowX:"hidden", transition:"background 0.4s,color 0.4s" }}>
      <Toaster position="top-center" />
 
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet"/>
 
      <ScrollProgressBar t={t}/>
      <CursorGlow t={t}/>
      <SideGlows t={t}/>
 
      {/* key=dark forces full re-render so colours flush correctly */}
      <Navbar key={`nav-${dark}`} dark={dark} toggle={toggle} t={t}/>
      <NightToggle dark={dark} toggle={toggle} t={t}/>
 
      <Hero  key={`hero-${dark}`}     t={t}/>
      <About key={`about-${dark}`}    t={t}/>
      <Skills key={`skills-${dark}`}  t={t}/>
      <Projects key={`proj-${dark}`}  t={t}/>
      <Contact key={`contact-${dark}`} t={t}/>
    </div>
  );
}
