import { useState, useEffect, useCallback } from "react";

// ════════════════════════════════════════════════════════════════════
// CHRONOLOGICAL BIBLE SEQUENCE
// ════════════════════════════════════════════════════════════════════
const CHRONOLOGICAL_SEQUENCE = [
  { book:"Genesis",         ch:50, type:"OT", era:"Patriarchs" },
  { book:"Job",             ch:42, type:"OT", era:"Patriarchs" },
  { book:"Exodus",          ch:40, type:"OT", era:"Exodus & Law" },
  { book:"Leviticus",       ch:27, type:"OT", era:"Exodus & Law" },
  { book:"Numbers",         ch:36, type:"OT", era:"Exodus & Law" },
  { book:"Deuteronomy",     ch:34, type:"OT", era:"Exodus & Law" },
  { book:"Joshua",          ch:24, type:"OT", era:"Conquest" },
  { book:"Judges",          ch:21, type:"OT", era:"Conquest" },
  { book:"Ruth",            ch:4,  type:"OT", era:"Conquest" },
  { book:"1 Samuel",        ch:31, type:"OT", era:"Monarchy" },
  { book:"2 Samuel",        ch:24, type:"OT", era:"Monarchy" },
  { book:"Psalms",          ch:72, type:"PS", era:"Monarchy",         startCh:1  },
  { book:"1 Kings",         ch:11, type:"OT", era:"Monarchy" },
  { book:"Proverbs",        ch:31, type:"PR", era:"Monarchy" },
  { book:"Ecclesiastes",    ch:12, type:"OT", era:"Monarchy" },
  { book:"Song of Solomon", ch:8,  type:"OT", era:"Monarchy" },
  { book:"1 Kings",         ch:11, type:"OT", era:"Divided Kingdom",  startCh:12 },
  { book:"2 Kings",         ch:25, type:"OT", era:"Divided Kingdom" },
  { book:"1 Chronicles",    ch:29, type:"OT", era:"Divided Kingdom" },
  { book:"2 Chronicles",    ch:36, type:"OT", era:"Divided Kingdom" },
  { book:"Psalms",          ch:78, type:"PS", era:"Divided Kingdom",  startCh:73 },
  { book:"Joel",            ch:3,  type:"OT", era:"Pre-Exile Prophets" },
  { book:"Jonah",           ch:4,  type:"OT", era:"Pre-Exile Prophets" },
  { book:"Amos",            ch:9,  type:"OT", era:"Pre-Exile Prophets" },
  { book:"Hosea",           ch:14, type:"OT", era:"Pre-Exile Prophets" },
  { book:"Micah",           ch:7,  type:"OT", era:"Pre-Exile Prophets" },
  { book:"Isaiah",          ch:66, type:"OT", era:"Pre-Exile Prophets" },
  { book:"Nahum",           ch:3,  type:"OT", era:"Pre-Exile Prophets" },
  { book:"Zephaniah",       ch:3,  type:"OT", era:"Pre-Exile Prophets" },
  { book:"Habakkuk",        ch:3,  type:"OT", era:"Pre-Exile Prophets" },
  { book:"Jeremiah",        ch:52, type:"OT", era:"Exile" },
  { book:"Lamentations",    ch:5,  type:"OT", era:"Exile" },
  { book:"Ezekiel",         ch:48, type:"OT", era:"Exile" },
  { book:"Daniel",          ch:12, type:"OT", era:"Exile" },
  { book:"Obadiah",         ch:1,  type:"OT", era:"Exile" },
  { book:"Ezra",            ch:10, type:"OT", era:"Post-Exile" },
  { book:"Haggai",          ch:2,  type:"OT", era:"Post-Exile" },
  { book:"Zechariah",       ch:14, type:"OT", era:"Post-Exile" },
  { book:"Nehemiah",        ch:13, type:"OT", era:"Post-Exile" },
  { book:"Esther",          ch:10, type:"OT", era:"Post-Exile" },
  { book:"Malachi",         ch:4,  type:"OT", era:"Post-Exile" },
  { book:"Luke",            ch:24, type:"NT", era:"Gospels" },
  { book:"Matthew",         ch:28, type:"NT", era:"Gospels" },
  { book:"Mark",            ch:16, type:"NT", era:"Gospels" },
  { book:"John",            ch:21, type:"NT", era:"Gospels" },
  { book:"Acts",            ch:28, type:"NT", era:"Early Church" },
  { book:"James",           ch:5,  type:"NT", era:"Early Church" },
  { book:"Galatians",       ch:6,  type:"NT", era:"Early Church" },
  { book:"1 Thessalonians", ch:5,  type:"NT", era:"Early Church" },
  { book:"2 Thessalonians", ch:3,  type:"NT", era:"Early Church" },
  { book:"1 Corinthians",   ch:16, type:"NT", era:"Early Church" },
  { book:"2 Corinthians",   ch:13, type:"NT", era:"Early Church" },
  { book:"Romans",          ch:16, type:"NT", era:"Early Church" },
  { book:"Ephesians",       ch:6,  type:"NT", era:"Epistles" },
  { book:"Philippians",     ch:4,  type:"NT", era:"Epistles" },
  { book:"Colossians",      ch:4,  type:"NT", era:"Epistles" },
  { book:"Philemon",        ch:1,  type:"NT", era:"Epistles" },
  { book:"1 Timothy",       ch:6,  type:"NT", era:"Epistles" },
  { book:"Titus",           ch:3,  type:"NT", era:"Epistles" },
  { book:"1 Peter",         ch:5,  type:"NT", era:"Epistles" },
  { book:"Hebrews",         ch:13, type:"NT", era:"Epistles" },
  { book:"2 Timothy",       ch:4,  type:"NT", era:"Epistles" },
  { book:"2 Peter",         ch:3,  type:"NT", era:"Epistles" },
  { book:"Jude",            ch:1,  type:"NT", era:"Epistles" },
  { book:"1 John",          ch:5,  type:"NT", era:"Epistles" },
  { book:"2 John",          ch:1,  type:"NT", era:"Epistles" },
  { book:"3 John",          ch:1,  type:"NT", era:"Epistles" },
  { book:"Revelation",      ch:22, type:"NT", era:"Revelation" },
];

const DAILY_CAPS = { 6:7, 9:5, 12:4 };
const PLAN_DAYS  = { 6:183, 9:274, 12:365 };

// ════════════════════════════════════════════════════════════════════
// PLAN GENERATOR
// ════════════════════════════════════════════════════════════════════
function generatePlan(months) {
  const days = PLAN_DAYS[months];
  const cap  = DAILY_CAPS[months];
  const all  = [];

  for (const entry of CHRONOLOGICAL_SEQUENCE) {
    const start = entry.startCh || 1;
    for (let ch = start; ch < start + entry.ch; ch++) {
      all.push({ book: entry.book, ch, type: entry.type, era: entry.era });
    }
  }

  const total = all.length;
  const base  = total / days;
  const plan  = [];
  let idx     = 0;

  for (let d = 0; d < days; d++) {
    const day    = { ot:[], nt:[], ps:[], pr:[], era:"" };
    const target = Math.max(1, Math.round((d + 1) * base) - idx);
    let toRead   = Math.min(target, cap);

    if (idx + toRead < total && toRead < cap + 1) {
      const cur  = all[idx + toRead - 1]?.book;
      const next = all[idx + toRead]?.book;
      if (next === cur) toRead = Math.min(toRead + 1, cap + 1);
    }

    for (let i = 0; i < toRead && idx < total; i++, idx++) {
      const c = all[idx];
      if      (c.type === "OT") day.ot.push(c);
      else if (c.type === "NT") day.nt.push(c);
      else if (c.type === "PS") day.ps.push(c);
      else if (c.type === "PR") day.pr.push(c);
      if (!day.era) day.era = c.era;
    }
    plan.push(day);
  }

  while (idx < total) {
    const c    = all[idx++];
    const last = plan[plan.length - 1];
    if      (c.type === "OT") last.ot.push(c);
    else if (c.type === "NT") last.nt.push(c);
    else if (c.type === "PS") last.ps.push(c);
    else if (c.type === "PR") last.pr.push(c);
  }

  return plan;
}

// ════════════════════════════════════════════════════════════════════
// HELPERS
// ════════════════════════════════════════════════════════════════════
function chapsGrouped(arr) {
  if (!arr || arr.length === 0) return null;
  const groups = {};
  arr.forEach(c => { (groups[c.book] = groups[c.book] || []).push(c.ch); });
  return Object.entries(groups).map(([book, chs]) => {
    const s = [...chs].sort((a,b) => a-b);
    const ranges = []; let lo = s[0], hi = s[0];
    for (let i = 1; i < s.length; i++) {
      if (s[i] === hi + 1) hi = s[i];
      else { ranges.push(lo === hi ? `${lo}` : `${lo}–${hi}`); lo = hi = s[i]; }
    }
    ranges.push(lo === hi ? `${lo}` : `${lo}–${hi}`);
    return `${book} ${ranges.join(", ")}`;
  }).join(" · ");
}

function dayTotal(day) {
  return (day?.ot?.length||0)+(day?.nt?.length||0)+(day?.ps?.length||0)+(day?.pr?.length||0);
}

const MOTTOS = [
  "Consistency > intensity.", "One step closer.", "Keep the momentum going.",
  "Small daily actions. Big results.", "Show up again today.", "Progress, not perfection.",
  "The discipline is the reward.", "One chapter at a time.",
  "You're building something real.", "Stay the course.",
];

const ACCENT_OPTIONS = [
  { name:"Violet",   value:"#7c6fff" },
  { name:"Indigo",   value:"#6366f1" },
  { name:"Sky",      value:"#0ea5e9" },
  { name:"Emerald",  value:"#10b981" },
  { name:"Rose",     value:"#f43f5e" },
  { name:"Amber",    value:"#f59e0b" },
];

// ════════════════════════════════════════════════════════════════════
// STORAGE
// ════════════════════════════════════════════════════════════════════
const STORE_KEY = "verset_v1";

function loadState() {
  try {
    const raw = (typeof localStorage !== "undefined" && localStorage.getItem(STORE_KEY)) || window._vl;
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

function saveState(s) {
  try {
    const str = JSON.stringify(s);
    if (typeof localStorage !== "undefined") localStorage.setItem(STORE_KEY, str);
    window._vl = str;
  } catch { try { window._vl = JSON.stringify(s); } catch {} }
}

// ════════════════════════════════════════════════════════════════════
// PWA + NOTIFICATIONS
// ════════════════════════════════════════════════════════════════════
const SW_SRC = `
self.addEventListener('install',()=>self.skipWaiting());
self.addEventListener('activate',e=>e.waitUntil(clients.claim()));
self.addEventListener('fetch',e=>{
  e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request).catch(()=>new Response('Offline',{status:503}))));
});
self.addEventListener('message',e=>{
  if(e.data?.type==='NOTIFY'){
    const {title,body,delay=0}=e.data;
    setTimeout(()=>self.registration.showNotification(title,{body,tag:'verset'}),delay);
  }
});
`;

function bootPWA() {
  if (typeof navigator === "undefined") return;
  if (!document.querySelector('link[rel="manifest"]')) {
    const m = {
      name:"VERSÉT", short_name:"VERSÉT", start_url:"/",
      display:"standalone", theme_color:"#7c6fff", background_color:"#0a0a0f",
      icons:[{ src:"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 192 192'%3E%3Crect width='192' height='192' rx='40' fill='%237c6fff'/%3E%3Ctext x='50%25' y='68%25' font-size='110' text-anchor='middle' fill='white'%3E📖%3C/text%3E%3C/svg%3E", sizes:"192x192", type:"image/svg+xml" }]
    };
    const link = document.createElement("link");
    link.rel   = "manifest";
    link.href  = URL.createObjectURL(new Blob([JSON.stringify(m)], { type:"application/manifest+json" }));
    document.head.appendChild(link);
  }
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register(
      URL.createObjectURL(new Blob([SW_SRC], { type:"application/javascript" }))
    ).catch(()=>{});
  }
}

async function askNotifPermission() {
  if (!("Notification" in window)) return "denied";
  if (Notification.permission !== "default") return Notification.permission;
  return Notification.requestPermission();
}

function sendNotif(title, body, delayMs=0) {
  if (typeof Notification === "undefined" || Notification.permission !== "granted") return;
  if (delayMs === 0) { try { new Notification(title, { body, tag:"verset" }); } catch {} return; }
  navigator.serviceWorker?.ready
    .then(r => r.active?.postMessage({ type:"NOTIFY", title, body, delay:delayMs }))
    .catch(()=>{});
}

// ════════════════════════════════════════════════════════════════════
// TOGGLE COMPONENT (bug-fixed: fully controlled, no DOM quirks)
// ════════════════════════════════════════════════════════════════════
function Toggle({ on, onChange, accent }) {
  return (
    <div
      onClick={() => onChange(!on)}
      style={{
        width:44, height:24, borderRadius:99, cursor:"pointer",
        background: on ? accent : "#3a3a4a",
        position:"relative", flexShrink:0, transition:"background .25s",
        border:"none", display:"inline-block",
      }}
    >
      <div style={{
        position:"absolute", top:2, left: on ? 22 : 2,
        width:20, height:20, borderRadius:"50%", background:"#fff",
        transition:"left .2s", boxShadow:"0 1px 3px #0004",
      }}/>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════
// SECTION ROW (settings rows)
// ════════════════════════════════════════════════════════════════════
function SetRow({ label, sub, children, border=true, t }) {
  return (
    <div style={{
      display:"flex", justifyContent:"space-between", alignItems:"center",
      padding:"14px 0",
      borderBottom: border ? `1px solid ${t.border}` : "none",
    }}>
      <div>
        <div style={{ fontSize:14, fontWeight:500, color:t.text }}>{label}</div>
        {sub && <div style={{ fontSize:11, color:t.sub, marginTop:2 }}>{sub}</div>}
      </div>
      {children}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════
// MAIN APP
// ════════════════════════════════════════════════════════════════════
export default function BibleTracker() {
  // ── Core state ──────────────────────────────────────────────────
  const [appState,     setAppState]     = useState(() => loadState());
  const [view,         setView]         = useState("today");
  const [dark,         setDark]         = useState(true);
  const [celebrating,  setCelebrating]  = useState(false);
  const [chosenMonths, setChosenMonths] = useState(null);
  const [catchUp,      setCatchUp]      = useState(false);
  const [accentColor,  setAccentColor]  = useState("#7c6fff");

  // ── Notification state ──────────────────────────────────────────
  const [notifPerm,    setNotifPerm]    = useState(() =>
    typeof Notification !== "undefined" ? Notification.permission : "default"
  );
  const [reminderTime, setReminderTime] = useState("07:00");

  // ── PWA install ─────────────────────────────────────────────────
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstall,    setShowInstall]    = useState(false);

  // ── Settings flags ──────────────────────────────────────────────
  const [showStreak,     setShowStreak]     = useState(true);
  const [showEra,        setShowEra]        = useState(true);
  const [showMotto,      setShowMotto]      = useState(true);
  const [compactMode,    setCompactMode]    = useState(false);
  const [showProgress,   setShowProgress]   = useState(true);

  // ── Boot ────────────────────────────────────────────────────────
  useEffect(() => { bootPWA(); }, []);

  useEffect(() => {
    const h = (e) => { e.preventDefault(); setDeferredPrompt(e); setShowInstall(true); };
    window.addEventListener("beforeinstallprompt", h);
    return () => window.removeEventListener("beforeinstallprompt", h);
  }, []);

  useEffect(() => { if (appState) saveState(appState); }, [appState]);

  // ── Date / plan maths ───────────────────────────────────────────
  const today      = new Date(); today.setHours(0,0,0,0);
  const startDate  = appState ? new Date(appState.startDate) : null;
  const plan       = appState?.plan ?? null;
  const totalDays  = plan?.length ?? 0;

  const completedDays = appState?.completedDays ?? {};
  const missedDays    = appState?.missedDays    ?? {};

  // Calendar index = how many days have passed since start
  const calIdx = startDate
    ? Math.max(0, Math.floor((today - startDate) / 86400000))
    : 0;

  // Days that are in the past but not completed = genuinely behind
  const missedCount = plan
    ? Array.from({ length: Math.min(calIdx, totalDays) }, (_,i) => i)
        .filter(i => !completedDays[i]).length
    : 0;

  // In catch-up mode: find the earliest day not completed within range
  const catchUpDay = plan
    ? (() => {
        for (let i = 0; i <= Math.min(calIdx, totalDays - 1); i++) {
          if (!completedDays[i]) return i;
        }
        return Math.min(calIdx, totalDays - 1);
      })()
    : 0;

  // The day we are actually displaying
  const currentDay = plan
    ? Math.min(catchUp ? catchUpDay : calIdx, totalDays - 1)
    : 0;

  const doneCount  = Object.keys(completedDays).length;
  const overallPct = totalDays ? Math.min(100, Math.round((doneCount / totalDays) * 100)) : 0;
  const streak     = appState?.streak ?? 0;
  const motto      = MOTTOS[doneCount % MOTTOS.length];

  function calcSecPct(section) {
    if (!plan) return 0;
    let done = 0, total = 0;
    plan.forEach((d, i) => {
      const chs = d[section] || [];
      total += chs.length;
      if (completedDays[i]) done += chs.length;
    });
    return total ? Math.min(100, Math.round((done / total) * 100)) : 0;
  }

  const otPct = calcSecPct("ot");
  const ntPct = calcSecPct("nt");
  const psPct = calcSecPct("ps");
  const prPct = calcSecPct("pr");

  function getFinishDate() {
    if (!plan || !startDate) return "—";
    const remaining  = totalDays - doneCount;
    const fin = new Date(today);
    fin.setDate(fin.getDate() + remaining);
    return fin.toLocaleDateString("en-US", { month:"long", day:"numeric", year:"numeric" });
  }

  // ── Actions ─────────────────────────────────────────────────────
  const handleComplete = useCallback(() => {
    if (!plan || !plan[currentDay]) return;
    // Don't double-count if already completed
    if (completedDays[currentDay]) return;

    setCelebrating(true);
    setTimeout(() => setCelebrating(false), 1000);

    setAppState(prev => {
      const nc      = { ...prev.completedDays, [currentDay]: true };
      const yest    = currentDay - 1;
      let   ns      = prev.streak ?? 0;

      // Streak: +1 if yesterday also done, else reset to 1
      if (yest >= 0 && nc[yest]) ns = ns + 1;
      else                        ns = 1;

      const added = dayTotal(plan[currentDay]);
      return {
        ...prev,
        completedDays: nc,
        streak:        ns,
        chaptersRead:  (prev.chaptersRead || 0) + added,
      };
    });
  }, [currentDay, completedDays, plan]);

  const handleMissed = useCallback(() => {
    if (!plan || completedDays[currentDay]) return;
    setAppState(prev => ({
      ...prev,
      missedDays: { ...prev.missedDays, [currentDay]: true },
    }));
  }, [currentDay, completedDays, plan]);

  function startPlan(months) {
    const pl = generatePlan(months);
    setAppState({
      months, startDate: today.toISOString(),
      plan: pl, completedDays: {}, missedDays: {},
      streak: 0, chaptersRead: 0,
    });
    setView("today");
    askNotifPermission().then(p => {
      setNotifPerm(p);
      if (p === "granted") sendNotif("VERSÉT 📖", "Your chronological Bible journey starts today!");
    });
  }

  async function enableNotifs() {
    const p = await askNotifPermission();
    setNotifPerm(p);
    if (p === "granted") sendNotif("VERSÉT 🔥", "Daily reminders on. Keep your streak!");
  }

  function installApp() {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then(() => { setDeferredPrompt(null); setShowInstall(false); });
  }

  function resetPlan() {
    if (!window.confirm("Reset your plan? All progress will be permanently lost.")) return;
    setAppState(null);
    try { localStorage.removeItem(STORE_KEY); } catch {}
    window._vl = null;
    setView("today");
  }

  // ── Theme ────────────────────────────────────────────────────────
  const t = dark ? {
    bg:"#0a0a0f", card:"#13131a", border:"#1e1e2e", text:"#e8e8f0",
    sub:"#6b6b8a", accent: accentColor, accent2:"#ff6f6f", gold:"#f5c842",
    green:"#4ade80", muted:"#2a2a3a",
  } : {
    bg:"#f4f4f8", card:"#ffffff", border:"#e0e0ee", text:"#111118",
    sub:"#7070a0", accent: accentColor, accent2:"#e04040", gold:"#d4a017",
    green:"#22c55e", muted:"#e8e8f4",
  };

  // ── CSS ─────────────────────────────────────────────────────────
  const css = `
    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=Outfit:wght@300;400;500;600&display=swap');
    *{box-sizing:border-box;margin:0;padding:0;-webkit-tap-highlight-color:transparent;}
    body{font-family:'Outfit',sans-serif;background:${t.bg};color:${t.text};min-height:100vh;}
    .app{max-width:430px;margin:0 auto;min-height:100vh;display:flex;flex-direction:column;}
    .topbar{display:flex;align-items:center;justify-content:space-between;padding:${compactMode?"12px":"18px"} 20px 10px;}
    .logo{font-family:'Syne',sans-serif;font-weight:800;font-size:18px;letter-spacing:-0.5px;color:${t.text};}
    .logo span{color:${t.accent};}
    .tr{display:flex;gap:8px;align-items:center;}
    .ib{background:${t.muted};border:none;color:${t.sub};width:36px;height:36px;border-radius:10px;display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:15px;transition:all .2s;flex-shrink:0;}
    .ib:hover{color:${t.text};}
    .sa{flex:1;overflow-y:auto;padding:0 16px 110px;scrollbar-width:none;}
    .sa::-webkit-scrollbar{display:none;}
    .bnav{position:fixed;bottom:0;left:50%;transform:translateX(-50%);width:100%;max-width:430px;background:${t.card};border-top:1px solid ${t.border};display:flex;padding:10px 0 20px;z-index:100;}
    .nb{flex:1;display:flex;flex-direction:column;align-items:center;gap:3px;border:none;background:none;color:${t.sub};font-size:10px;font-family:'Outfit',sans-serif;cursor:pointer;padding:4px;transition:color .2s;}
    .nb.act{color:${t.accent};}
    .nb svg{width:20px;height:20px;}
    .card{background:${t.card};border:1px solid ${t.border};border-radius:20px;padding:${compactMode?"14px":"20px"};margin-bottom:14px;}
    .sl{font-size:10px;font-weight:600;letter-spacing:2px;text-transform:uppercase;color:${t.sub};margin-bottom:12px;}
    .rr{display:flex;align-items:flex-start;gap:12px;padding:${compactMode?"7px":"10px"} 0;border-bottom:1px solid ${t.border};}
    .rr:last-child{border-bottom:none;padding-bottom:0;}
    .ri{width:32px;height:32px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:14px;flex-shrink:0;}
    .rt{flex:1;}
    .rtype{font-size:10px;font-weight:600;color:${t.sub};letter-spacing:1px;text-transform:uppercase;margin-bottom:2px;}
    .rref{font-family:'Syne',sans-serif;font-size:${compactMode?"13px":"15px"};font-weight:600;color:${t.text};line-height:1.3;}
    .bb{width:100%;padding:16px;border-radius:16px;border:none;font-family:'Syne',sans-serif;font-size:15px;font-weight:700;cursor:pointer;transition:all .2s;letter-spacing:.3px;}
    .pb{background:${t.accent};color:#fff;}
    .pb:hover{opacity:.9;transform:translateY(-1px);}
    .gb{background:${t.muted};color:${t.sub};margin-top:10px;}
    .gb:hover{color:${t.text};}
    .db{background:#e53e3e;color:#fff;margin-top:10px;}
    .db:hover{opacity:.9;}
    .pbg{background:${t.muted};border-radius:99px;height:6px;width:100%;overflow:hidden;}
    .pf{height:100%;border-radius:99px;transition:width .6s ease;}
    .sr{display:flex;gap:10px;margin-bottom:14px;}
    .sb{flex:1;background:${t.muted};border-radius:16px;padding:14px;text-align:center;}
    .sn{font-family:'Syne',sans-serif;font-size:22px;font-weight:800;}
    .sl2{font-size:10px;color:${t.sub};letter-spacing:1px;text-transform:uppercase;margin-top:2px;}
    .ms{display:flex;align-items:center;gap:12px;padding:12px 0;border-bottom:1px solid ${t.border};}
    .ms:last-child{border-bottom:none;}
    .md{width:28px;height:28px;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:13px;}
    .cal{display:grid;grid-template-columns:repeat(7,1fr);gap:4px;}
    .cd{aspect-ratio:1;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:500;cursor:default;}
    .cel{animation:pop .5s cubic-bezier(.36,.07,.19,.97);}
    @keyframes pop{0%{transform:scale(1)}30%{transform:scale(1.05)}60%{transform:scale(.97)}100%{transform:scale(1)}}
    .tg{display:inline-block;padding:3px 10px;border-radius:99px;font-size:11px;font-weight:600;}
    .mo{font-style:italic;font-size:13px;color:${t.sub};margin-top:4px;}
    .ss{min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:30px 24px;text-align:center;}
    .pc{border:2px solid ${t.border};border-radius:20px;padding:22px;margin-bottom:12px;cursor:pointer;transition:all .2s;text-align:left;}
    .pc:hover,.pc.sel{border-color:${t.accent};background:${dark?"#16162a":"#f0eeff"};}
    .hm{display:grid;grid-template-columns:repeat(26,1fr);gap:2px;margin-top:8px;}
    .hc{aspect-ratio:1;border-radius:2px;}
    .spr{display:flex;align-items:center;gap:10px;margin-bottom:12px;}
    .spl{font-size:12px;color:${t.sub};width:28px;}
    .spp{font-size:12px;font-weight:600;width:34px;text-align:right;color:${t.text};}
    .bn{background:${dark?"#1a1528":"#ece9ff"};border:1px solid ${t.accent}40;border-radius:16px;padding:14px 16px;margin-bottom:14px;display:flex;align-items:center;gap:12px;}
    .era{font-size:10px;font-weight:600;padding:2px 8px;border-radius:99px;background:${t.accent}20;color:${t.accent};display:inline-block;margin-bottom:6px;}
    .cup{background:${dark?"#1a1a10":"#fffbe6"};border:1px solid ${t.gold}40;border-radius:16px;padding:12px 16px;margin-bottom:14px;display:flex;align-items:center;gap:10px;font-size:13px;}
    .ti{background:${t.muted};border:1px solid ${t.border};color:${t.text};border-radius:10px;padding:6px 10px;font-size:14px;font-family:'Outfit',sans-serif;outline:none;}
    .donate{opacity:.45;text-align:center;padding:16px 20px 0;font-size:12px;color:${t.sub};}
    .donate a{color:${t.sub};text-decoration:underline;cursor:pointer;}
    .divider{height:1px;background:${t.border};margin:4px 0 16px;}
    .accent-dot{width:28px;height:28px;border-radius:50%;cursor:pointer;transition:transform .15s;flex-shrink:0;}
    .accent-dot:hover{transform:scale(1.15);}
    .accent-dot.chosen{box-shadow:0 0 0 3px ${dark?"#fff":"#000"},0 0 0 5px ${t.accent};}
    .setgrp{margin-bottom:6px;}
    .setgrp-label{font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:${t.sub};margin:16px 0 0;}
  `;

  // ════════════════════════════════════════════════════════════════
  // SETUP SCREEN
  // ════════════════════════════════════════════════════════════════
  if (!appState) {
    return (
      <div style={{ background:t.bg, minHeight:"100vh", color:t.text }}>
        <style>{css}</style>
        <div className="ss">
          <div style={{ marginBottom:32 }}>
            <div style={{ fontFamily:"'Syne',sans-serif", fontSize:40, fontWeight:800, letterSpacing:-1, marginBottom:10 }}>
              VERS<span style={{ color:t.accent }}>É</span>T
            </div>
            <div style={{ color:t.sub, fontSize:15, maxWidth:300, margin:"0 auto", lineHeight:1.6 }}>
              Chronological Bible tracker.<br/>Your Bible. Your pace. No guilt.
            </div>
          </div>

          <div style={{ width:"100%", maxWidth:360, marginBottom:24 }}>
            <div style={{ fontSize:11, fontWeight:700, letterSpacing:2, color:t.sub, textTransform:"uppercase", marginBottom:16 }}>
              Choose your pace
            </div>
            {[
              { m:6,  label:"6 Months",  sub:"Intense · up to 7 chapters/day",   badge:"Fast" },
              { m:9,  label:"9 Months",  sub:"Balanced · up to 5 chapters/day",  badge:"Recommended" },
              { m:12, label:"12 Months", sub:"Sustainable · up to 4 chapters/day",badge:"Easy" },
            ].map(({ m, label, sub, badge }) => (
              <div
                key={m}
                className={`pc${chosenMonths === m ? " sel" : ""}`}
                onClick={() => setChosenMonths(m)}
              >
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                  <div style={{ fontFamily:"'Syne',sans-serif", fontSize:18, fontWeight:700 }}>{label}</div>
                  <span className="tg" style={{
                    background: chosenMonths === m ? t.accent : t.muted,
                    color:      chosenMonths === m ? "#fff"   : t.sub,
                  }}>{badge}</span>
                </div>
                <div style={{ fontSize:13, color:t.sub, marginTop:4 }}>{sub}</div>
                <div style={{ fontSize:11, color:t.accent, marginTop:6 }}>📖 Chronological story order</div>
              </div>
            ))}
          </div>

          <div style={{ width:"100%", maxWidth:360, marginBottom:28 }}>
            <div style={{ fontSize:11, fontWeight:700, letterSpacing:2, color:t.sub, textTransform:"uppercase", marginBottom:10 }}>
              Daily reminder time
            </div>
            <div style={{ display:"flex", gap:10, alignItems:"center" }}>
              <input
                type="time" className="ti"
                value={reminderTime}
                onChange={e => setReminderTime(e.target.value)}
                style={{ flex:1 }}
              />
              <span style={{ fontSize:12, color:t.sub }}>Browser notifications</span>
            </div>
          </div>

          <button
            className="bb pb"
            style={{ width:"100%", maxWidth:360, opacity: chosenMonths ? 1 : 0.4, pointerEvents: chosenMonths ? "auto" : "none" }}
            onClick={() => chosenMonths && startPlan(chosenMonths)}
          >
            Begin My Journey →
          </button>

          <div style={{ color:t.sub, fontSize:12, marginTop:14 }}>
            Uses your own physical Bible · No account needed
          </div>

          {showInstall && (
            <div className="bn" style={{ marginTop:20, width:"100%", maxWidth:360 }}>
              <span style={{ fontSize:22 }}>📲</span>
              <div style={{ flex:1 }}>
                <div style={{ fontWeight:700, fontSize:14 }}>Install VERSÉT</div>
                <div style={{ color:t.sub, fontSize:12 }}>Add to home screen for offline access</div>
              </div>
              <button className="bb pb" style={{ width:"auto", padding:"8px 14px", fontSize:12 }} onClick={installApp}>
                Install
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ════════════════════════════════════════════════════════════════
  // PLAN IS ACTIVE — derive today's data
  // ════════════════════════════════════════════════════════════════
  const todayPlan   = plan[currentDay] ?? { ot:[], nt:[], ps:[], pr:[], era:"" };
  const todayDone   = !!completedDays[currentDay];
  const todayMissed = !!missedDays[currentDay] && !completedDays[currentDay];
  const totalChDay  = dayTotal(todayPlan);

  // ── TODAY VIEW ────────────────────────────────────────────────
  const TodayView = () => (
    <div className={celebrating ? "cel" : ""}>

      {/* Install banner */}
      {showInstall && (
        <div className="bn">
          <span style={{ fontSize:20 }}>📲</span>
          <div style={{ flex:1 }}>
            <div style={{ fontWeight:700, fontSize:14, marginBottom:2 }}>Install VERSÉT</div>
            <div style={{ color:t.sub, fontSize:11 }}>Works offline on your home screen</div>
          </div>
          <button className="ib" onClick={installApp}>↓</button>
          <button className="ib" onClick={() => setShowInstall(false)}>✕</button>
        </div>
      )}

      {/* Catch-up banner */}
      {missedCount > 0 && !catchUp && (
        <div className="cup">
          <span>↩️</span>
          <div style={{ flex:1 }}>
            <div style={{ fontWeight:600 }}>{missedCount} day{missedCount > 1 ? "s" : ""} behind</div>
            <div style={{ color:t.sub, fontSize:11 }}>No pressure — catch up at your pace.</div>
          </div>
          <button
            className="tg"
            style={{ background:t.gold+"25", color:t.gold, cursor:"pointer", border:"none", fontSize:12 }}
            onClick={() => setCatchUp(true)}
          >
            Catch up
          </button>
        </div>
      )}
      {catchUp && (
        <div className="cup">
          <span>🎯</span>
          <div style={{ flex:1 }}>
            <div style={{ fontWeight:600 }}>Catch-up mode on</div>
            <div style={{ color:t.sub, fontSize:11 }}>Working through missed days.</div>
          </div>
          <button
            className="tg"
            style={{ background:t.muted, color:t.sub, cursor:"pointer", border:"none", fontSize:12 }}
            onClick={() => setCatchUp(false)}
          >
            Exit
          </button>
        </div>
      )}

      {/* Hero card */}
      <div className="card" style={{
        background: `linear-gradient(135deg,${dark?"#1a1530":"#ece9ff"},${dark?"#0d1a30":"#e9f0ff"})`,
        borderColor: t.accent+"40",
      }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:10 }}>
          <div style={{ flex:1, minWidth:0 }}>
            {showEra && todayPlan.era && <div className="era">{todayPlan.era}</div>}
            <div style={{ fontSize:11, fontWeight:700, letterSpacing:2, color:t.accent, textTransform:"uppercase", marginTop:4 }}>
              Day {currentDay + 1} of {totalDays}
            </div>
            <div style={{ fontFamily:"'Syne',sans-serif", fontSize:compactMode?20:24, fontWeight:800, marginTop:2, letterSpacing:-.5 }}>
              {todayDone ? "Mission Complete ✓" : "Today's Mission"}
            </div>
            {showMotto && <div className="mo">{motto}</div>}
          </div>
          {showStreak && (
            <div style={{ textAlign:"center", background:t.muted+"80", borderRadius:12, padding:"8px 12px", flexShrink:0, marginLeft:12 }}>
              <div style={{ fontSize:22, fontWeight:800, fontFamily:"'Syne',sans-serif", color:t.gold }}>🔥{streak}</div>
              <div style={{ fontSize:9, color:t.sub, letterSpacing:1, textTransform:"uppercase" }}>streak</div>
            </div>
          )}
        </div>

        <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
          <span className="tg" style={{ background:t.accent+"25", color:t.accent }}>{totalChDay} chapter{totalChDay!==1?"s":""}</span>
          <span className="tg" style={{ background:t.muted, color:t.sub }}>{appState.months}-month plan</span>
          {todayDone && <span className="tg" style={{ background:t.green+"25", color:t.green }}>✓ Done</span>}
          {notifPerm !== "granted" && (
            <button
              className="tg"
              style={{ background:t.gold+"20", color:t.gold, cursor:"pointer", border:"none", fontSize:11, fontWeight:600 }}
              onClick={enableNotifs}
            >
              🔔 Enable reminders
            </button>
          )}
        </div>
      </div>

      {/* Readings card */}
      <div className="card">
        <div className="sl">Today's Reading</div>

        {todayPlan.ot?.length > 0 && (
          <div className="rr">
            <div className="ri" style={{ background:"#7c6fff20" }}>📖</div>
            <div className="rt">
              <div className="rtype">Old Testament</div>
              <div className="rref">{chapsGrouped(todayPlan.ot)}</div>
            </div>
          </div>
        )}
        {todayPlan.nt?.length > 0 && (
          <div className="rr">
            <div className="ri" style={{ background:"#4ade8020" }}>📗</div>
            <div className="rt">
              <div className="rtype">New Testament</div>
              <div className="rref">{chapsGrouped(todayPlan.nt)}</div>
            </div>
          </div>
        )}
        {todayPlan.ps?.length > 0 && (
          <div className="rr">
            <div className="ri" style={{ background:"#f5c84220" }}>🎵</div>
            <div className="rt">
              <div className="rtype">Psalms</div>
              <div className="rref">{chapsGrouped(todayPlan.ps)}</div>
            </div>
          </div>
        )}
        {todayPlan.pr?.length > 0 && (
          <div className="rr">
            <div className="ri" style={{ background:"#ff6f6f20" }}>💡</div>
            <div className="rt">
              <div className="rtype">Proverbs</div>
              <div className="rref">{chapsGrouped(todayPlan.pr)}</div>
            </div>
          </div>
        )}

        {totalChDay === 0 && (
          <div style={{ color:t.sub, fontSize:13, textAlign:"center", padding:"10px 0" }}>
            No reading assigned for this day.
          </div>
        )}
      </div>

      {/* Progress card */}
      {showProgress && (
        <div className="card">
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
            <div className="sl" style={{ marginBottom:0 }}>Bible Progress</div>
            <div style={{ fontFamily:"'Syne',sans-serif", fontSize:22, fontWeight:800, color:t.accent }}>{overallPct}%</div>
          </div>
          <div className="pbg" style={{ marginBottom:16, height:8 }}>
            <div className="pf" style={{ width:`${overallPct}%`, background:`linear-gradient(90deg,${t.accent},${t.accent2})` }}/>
          </div>
          {[["OT",otPct,t.accent],["NT",ntPct,t.green],["PS",psPct,t.gold],["PR",prPct,t.accent2]].map(([l,p,c]) => (
            <div key={l} className="spr">
              <div className="spl">{l}</div>
              <div className="pbg" style={{ flex:1 }}><div className="pf" style={{ width:`${p}%`, background:c }}/></div>
              <div className="spp">{p}%</div>
            </div>
          ))}
          <div style={{ fontSize:12, color:t.sub, marginTop:4 }}>
            Est. finish · <span style={{ color:t.text, fontWeight:600 }}>{getFinishDate()}</span>
          </div>
        </div>
      )}

      {/* Action buttons */}
      {!todayDone && !todayMissed && (
        <div>
          <button className="bb pb" onClick={handleComplete}>✓ Mark Today Complete</button>
          <button className="bb gb" onClick={handleMissed}>Missed today — track it</button>
        </div>
      )}

      {todayDone && (
        <div className="card" style={{ textAlign:"center", borderColor:t.green+"60", background:t.green+"10" }}>
          <div style={{ fontSize:28, marginBottom:4 }}>🎉</div>
          <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:16, color:t.green }}>
            Day {currentDay + 1} done.
          </div>
          <div style={{ fontSize:13, color:t.sub, marginTop:4 }}>See you tomorrow.</div>
        </div>
      )}

      {todayMissed && (
        <div className="card" style={{ textAlign:"center", borderColor:t.gold+"60", background:t.gold+"10" }}>
          <div style={{ fontSize:22, marginBottom:4 }}>↩️</div>
          <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:15, color:t.gold }}>
            Tracked as missed
          </div>
          <div style={{ fontSize:13, color:t.sub, marginTop:4 }}>No punishment. Just keep moving.</div>
          <button className="bb pb" style={{ marginTop:12, fontSize:13 }} onClick={handleComplete}>
            Actually, I did read it →
          </button>
        </div>
      )}
    </div>
  );

  // ── STATS VIEW ────────────────────────────────────────────────
  const StatsView = () => {
    const milestones = [
      { pct:10,  label:"10% Through",    icon:"🌱" },
      { pct:25,  label:"Quarter Done",   icon:"⚡" },
      { pct:50,  label:"Halfway Point",  icon:"🔥" },
      { pct:75,  label:"Three Quarters", icon:"🚀" },
      { pct:100, label:"Complete!",      icon:"🏆" },
    ];

    const eras = [
      "Patriarchs","Exodus & Law","Conquest","Monarchy",
      "Divided Kingdom","Pre-Exile Prophets","Exile","Post-Exile",
      "Gospels","Early Church","Epistles","Revelation",
    ];

    const eraPct = {};
    eras.forEach(era => {
      let done=0, total=0;
      plan.forEach((d, i) => {
        if (d.era === era) {
          const n = dayTotal(d); total += n;
          if (completedDays[i]) done += n;
        }
      });
      if (total > 0) eraPct[era] = Math.round((done / total) * 100);
    });

    return (
      <div>
        <div style={{ fontFamily:"'Syne',sans-serif", fontSize:22, fontWeight:800, marginBottom:18, letterSpacing:-.5 }}>Progress</div>

        <div className="sr">
          <div className="sb"><div className="sn" style={{ color:t.accent }}>{doneCount}</div><div className="sl2">Days Done</div></div>
          <div className="sb"><div className="sn" style={{ color:t.gold }}>🔥{streak}</div><div className="sl2">Streak</div></div>
          <div className="sb"><div className="sn" style={{ color:t.green }}>{overallPct}%</div><div className="sl2">Complete</div></div>
        </div>
        <div className="sr">
          <div className="sb"><div className="sn">{missedCount}</div><div className="sl2">Behind</div></div>
          <div className="sb"><div className="sn">{appState.chaptersRead || 0}</div><div className="sl2">Chapters</div></div>
          <div className="sb"><div className="sn">{appState.months}mo</div><div className="sl2">Plan</div></div>
        </div>

        {/* Heatmap */}
        <div className="card">
          <div className="sl">Consistency Heatmap</div>
          <div className="hm">
            {Array.from({ length:Math.min(totalDays, 182) }, (_, i) => {
              const done   = !!completedDays[i];
              const behind = !completedDays[i] && i < calIdx;
              const future = i > calIdx;
              return (
                <div key={i} className="hc" style={{
                  background: future ? t.muted : done ? t.green : behind ? t.accent2+"70" : t.muted,
                  opacity:    future ? 0.2 : 1,
                }} title={`Day ${i+1}`}/>
              );
            })}
          </div>
          <div style={{ display:"flex", gap:12, marginTop:10 }}>
            {[["Done",t.green],["Behind",t.accent2+"80"],["Future",t.muted]].map(([l,c]) => (
              <div key={l} style={{ display:"flex", alignItems:"center", gap:5 }}>
                <div style={{ width:10, height:10, borderRadius:2, background:c }}/>
                <span style={{ fontSize:11, color:t.sub }}>{l}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Milestones */}
        <div className="card">
          <div className="sl">Milestones</div>
          {milestones.map(m => {
            const r = overallPct >= m.pct;
            return (
              <div key={m.pct} className="ms">
                <div className="md" style={{ background: r ? t.accent+"25" : t.muted }}>
                  <span style={{ filter: r ? "none" : "grayscale(1) opacity(.4)" }}>{m.icon}</span>
                </div>
                <div>
                  <div style={{ fontSize:14, color: r ? t.text : t.sub }}>{m.label}</div>
                  <div style={{ fontSize:11, color:t.sub }}>{m.pct}% through the Bible</div>
                </div>
                {r && <span className="tg" style={{ marginLeft:"auto", background:t.green+"25", color:t.green, fontSize:10 }}>✓</span>}
              </div>
            );
          })}
        </div>

        {/* Section progress */}
        <div className="card">
          <div className="sl">By Section</div>
          {[
            ["Old Testament", otPct, t.accent],
            ["New Testament", ntPct, t.green],
            ["Psalms",        psPct, t.gold],
            ["Proverbs",      prPct, t.accent2],
          ].map(([n, p, c]) => (
            <div key={n} style={{ marginBottom:14 }}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
                <span style={{ fontSize:14, fontWeight:600 }}>{n}</span>
                <span style={{ fontSize:14, fontWeight:700, color:c }}>{p}%</span>
              </div>
              <div className="pbg"><div className="pf" style={{ width:`${p}%`, background:c }}/></div>
            </div>
          ))}
        </div>

        {/* Era progress */}
        <div className="card">
          <div className="sl">Story Eras</div>
          {Object.entries(eraPct).map(([era, p]) => (
            <div key={era} style={{ marginBottom:12 }}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}>
                <span style={{ fontSize:13, color: p===100 ? t.green : t.text }}>{era}</span>
                <span style={{ fontSize:13, fontWeight:700, color: p===100 ? t.green : t.accent }}>
                  {p}%{p===100?" ✓":""}
                </span>
              </div>
              <div className="pbg"><div className="pf" style={{ width:`${p}%`, background: p===100 ? t.green : t.accent }}/></div>
            </div>
          ))}
        </div>

        <div style={{ fontSize:12, color:t.sub, textAlign:"center", paddingBottom:8 }}>
          Estimated finish · <strong style={{ color:t.text }}>{getFinishDate()}</strong>
        </div>
      </div>
    );
  };

  // ── CALENDAR VIEW ─────────────────────────────────────────────
  const CalendarView = () => {
    const [off, setOff] = useState(0);
    const weeks = 6;
    const startIdx = Math.max(0, currentDay - 14 + off * 7);
    const d7 = ["S","M","T","W","T","F","S"];

    return (
      <div>
        <div style={{ fontFamily:"'Syne',sans-serif", fontSize:22, fontWeight:800, marginBottom:18, letterSpacing:-.5 }}>Plan</div>

        <div className="card">
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
            <button onClick={() => setOff(o => o-1)} style={{ background:"none", border:"none", color:t.sub, cursor:"pointer", fontSize:22 }}>‹</button>
            <div style={{ fontSize:13, fontWeight:600 }}>Days {startIdx+1}–{Math.min(startIdx+7*weeks, totalDays)}</div>
            <button onClick={() => setOff(o => o+1)} style={{ background:"none", border:"none", color:t.sub, cursor:"pointer", fontSize:22 }}>›</button>
          </div>
          <div className="cal" style={{ marginBottom:8 }}>
            {d7.map((d,i) => <div key={i} style={{ textAlign:"center", fontSize:10, color:t.sub, fontWeight:600 }}>{d}</div>)}
          </div>
          <div className="cal">
            {Array.from({ length:7*weeks }, (_, i) => {
              const dayI   = startIdx + i;
              if (dayI >= totalDays) return <div key={i}/>;
              const done   = !!completedDays[dayI];
              const behind = !completedDays[dayI] && dayI < calIdx;
              const isToday= dayI === currentDay;
              const future = dayI > calIdx;
              return (
                <div key={i} className="cd" style={{
                  background: isToday ? t.accent : done ? t.green+"30" : behind ? t.accent2+"30" : future ? "transparent" : t.muted,
                  color:      isToday ? "#fff"   : done ? t.green      : behind ? t.accent2      : t.sub,
                  border:     isToday ? "none"   : `1px solid ${t.border}`,
                  fontWeight: isToday ? 800 : 400,
                  fontSize:   10,
                }}>
                  {dayI + 1}
                </div>
              );
            })}
          </div>
        </div>

        {/* Upcoming */}
        <div className="card">
          <div className="sl">Upcoming Readings</div>
          {Array.from({ length:6 }, (_, i) => {
            const dayI = currentDay + i;
            if (dayI >= totalDays) return null;
            const dp   = plan[dayI];
            const done = !!completedDays[dayI];
            return (
              <div key={dayI} style={{ paddingBottom:12, marginBottom:12, borderBottom:`1px solid ${t.border}` }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:4 }}>
                  <div style={{ fontSize:12, fontWeight:700, color: i===0 ? t.accent : t.sub }}>
                    {i===0 ? "Today" : i===1 ? "Tomorrow" : `Day ${dayI+1}`}
                    {dp.era && <span style={{ marginLeft:6, fontSize:10, color:t.accent, fontWeight:500 }}>· {dp.era}</span>}
                  </div>
                  {done && <span style={{ fontSize:10, color:t.green, fontWeight:700 }}>✓</span>}
                </div>
                {dp.ot?.length>0 && <div style={{ fontSize:12, color:t.sub, marginBottom:1 }}>📖 {chapsGrouped(dp.ot)}</div>}
                {dp.nt?.length>0 && <div style={{ fontSize:12, color:t.sub, marginBottom:1 }}>📗 {chapsGrouped(dp.nt)}</div>}
                {dp.ps?.length>0 && <div style={{ fontSize:12, color:t.sub, marginBottom:1 }}>🎵 {chapsGrouped(dp.ps)}</div>}
                {dp.pr?.length>0 && <div style={{ fontSize:12, color:t.sub }}>💡 {chapsGrouped(dp.pr)}</div>}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // ── SETTINGS VIEW ─────────────────────────────────────────────
  const SettingsView = () => (
    <div>
      <div style={{ fontFamily:"'Syne',sans-serif", fontSize:22, fontWeight:800, marginBottom:4, letterSpacing:-.5 }}>Settings</div>
      <div style={{ fontSize:13, color:t.sub, marginBottom:20 }}>Customize your VERSÉT experience.</div>

      {/* ── PLAN ── */}
      <div className="card">
        <div className="sl">Plan Info</div>
        <SetRow label="Plan speed" sub={`${appState.months}-month chronological`} t={t} />
        <SetRow label="Started" sub={new Date(appState.startDate).toLocaleDateString("en-US",{month:"long",day:"numeric",year:"numeric"})} t={t} />
        <SetRow label="Est. finish" sub={getFinishDate()} t={t} />
        <SetRow label="Overall progress" sub={`${doneCount} of ${totalDays} days · ${overallPct}%`} t={t} />
        <SetRow label="Chapters read" sub={`${appState.chaptersRead || 0} chapters completed`} t={t} border={false} />
      </div>

      {/* ── READING ── */}
      <div className="card">
        <div className="sl">Reading</div>
        <SetRow label="Catch-up mode" sub="Jump to earliest unread day" t={t}>
          <Toggle on={catchUp} onChange={setCatchUp} accent={t.accent} />
        </SetRow>
        <SetRow label="Show era badges" sub="Display narrative era labels" t={t}>
          <Toggle on={showEra} onChange={setShowEra} accent={t.accent} />
        </SetRow>
        <SetRow label="Show progress on Today" sub="Progress bars on main screen" t={t}>
          <Toggle on={showProgress} onChange={setShowProgress} accent={t.accent} />
        </SetRow>
        <SetRow label="Show daily motto" sub="Motivational quote each day" t={t} border={false}>
          <Toggle on={showMotto} onChange={setShowMotto} accent={t.accent} />
        </SetRow>
      </div>

      {/* ── APPEARANCE ── */}
      <div className="card">
        <div className="sl">Appearance</div>
        <SetRow label="Dark mode" sub={dark ? "Currently dark" : "Currently light"} t={t}>
          <Toggle on={dark} onChange={setDark} accent={t.accent} />
        </SetRow>
        <SetRow label="Compact layout" sub="Reduce padding and font sizes" t={t}>
          <Toggle on={compactMode} onChange={setCompactMode} accent={t.accent} />
        </SetRow>
        <SetRow label="Show streak counter" sub="🔥 flame display on Today" t={t}>
          <Toggle on={showStreak} onChange={setShowStreak} accent={t.accent} />
        </SetRow>
        <SetRow label="Accent colour" sub="Pick your theme colour" t={t} border={false} />
        <div style={{ display:"flex", gap:10, paddingTop:12, flexWrap:"wrap" }}>
          {ACCENT_OPTIONS.map(opt => (
            <div
              key={opt.value}
              className={`accent-dot${accentColor===opt.value?" chosen":""}`}
              style={{ background:opt.value, width:28, height:28, borderRadius:"50%", cursor:"pointer",
                outline: accentColor===opt.value ? `3px solid ${dark?"#fff":"#111"}` : "none",
                outlineOffset:2
              }}
              onClick={() => setAccentColor(opt.value)}
              title={opt.name}
            />
          ))}
        </div>
      </div>

      {/* ── NOTIFICATIONS ── */}
      <div className="card">
        <div className="sl">Notifications</div>
        <SetRow
          label="Daily reminders"
          sub={
            notifPerm === "granted" ? "Enabled ✓" :
            notifPerm === "denied"  ? "Blocked — change in browser settings" :
            "Tap to enable"
          }
          t={t}
        >
          {notifPerm === "granted" ? (
            <span className="tg" style={{ background:t.green+"25", color:t.green }}>On</span>
          ) : notifPerm !== "denied" ? (
            <button className="bb pb" style={{ width:"auto", padding:"7px 14px", fontSize:12 }} onClick={enableNotifs}>
              Enable
            </button>
          ) : null}
        </SetRow>
        <SetRow label="Reminder time" sub="When your daily notification fires" t={t} border={false}>
          <input
            type="time" className="ti"
            value={reminderTime}
            onChange={e => setReminderTime(e.target.value)}
            style={{ width:110 }}
          />
        </SetRow>
      </div>

      {/* ── PWA INSTALL ── */}
      <div className="card">
        <div className="sl">App</div>
        <SetRow label="Install VERSÉT" sub="Add to home screen for offline use" t={t}>
          {deferredPrompt ? (
            <button className="bb pb" style={{ width:"auto", padding:"7px 14px", fontSize:12 }} onClick={installApp}>
              Install
            </button>
          ) : (
            <span style={{ fontSize:12, color:t.sub }}>
              {showInstall ? "Tap Install" : "Already installed or use browser menu"}
            </span>
          )}
        </SetRow>
        <SetRow label="iOS install" sub='Tap Share → "Add to Home Screen"' t={t} border={false} />
      </div>

      {/* ── ABOUT ── */}
      <div className="card">
        <div className="sl">About</div>
        <SetRow label="Version" sub="VERSÉT 2.0 · Chronological Edition" t={t} />
        <SetRow label="Reading plan" sub="Chronological story order · 1,189 chapters" t={t} />
        <SetRow label="Data storage" sub="All data stays on your device" t={t} border={false} />
      </div>

      {/* ── DANGER ZONE ── */}
      <div className="card" style={{ borderColor:"#e53e3e40" }}>
        <div className="sl" style={{ color:"#e53e3e" }}>Danger Zone</div>
        <SetRow label="Reset all progress" sub="Cannot be undone — all data deleted" t={t} border={false} />
        <button className="bb db" style={{ marginTop:12 }} onClick={resetPlan}>
          Reset Plan & Progress
        </button>
      </div>

      {/* ── DONATE ── */}
      <div className="divider" />
      <div className="donate">
        <div style={{ marginBottom:4 }}>VERSÉT is free and always will be.</div>
        <div>
          If it's helped your reading journey,{" "}
          <a onClick={() => alert("Donate link coming soon — thank you! 🙏")}>
            consider supporting the app
          </a>
          {" "}☕
        </div>
        <div style={{ marginTop:6, fontSize:11, opacity:.6 }}>
          No ads. No account. No tracking.
        </div>
      </div>

      <div style={{ height:20 }} />
    </div>
  );

  // ── ICONS ─────────────────────────────────────────────────────
  const BookI  = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>;
  const ChartI = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>;
  const CalI   = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>;
  const GearI  = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>;

  // ── RENDER ────────────────────────────────────────────────────
  return (
    <div style={{ background:t.bg, minHeight:"100vh" }}>
      <style>{css}</style>
      <div className="app">
        {/* Top bar */}
        <div className="topbar">
          <div className="logo">VERS<span>É</span>T</div>
          <div className="tr">
            {notifPerm !== "granted" && (
              <button className="ib" onClick={enableNotifs} title="Enable notifications">🔔</button>
            )}
            <button className="ib" onClick={() => setDark(d => !d)} title="Toggle theme">
              {dark ? "☀" : "🌙"}
            </button>
          </div>
        </div>

        {/* Scrollable content */}
        <div className="sa">
          {view === "today"    && <TodayView/>}
          {view === "stats"    && <StatsView/>}
          {view === "calendar" && <CalendarView/>}
          {view === "settings" && <SettingsView/>}
        </div>

        {/* Bottom nav — 4 tabs */}
        <nav className="bnav">
          {[
            { id:"today",    label:"Today",    I:BookI  },
            { id:"stats",    label:"Progress", I:ChartI },
            { id:"calendar", label:"Plan",     I:CalI   },
            { id:"settings", label:"Settings", I:GearI  },
          ].map(({ id, label, I }) => (
            <button
              key={id}
              className={`nb${view === id ? " act" : ""}`}
              onClick={() => setView(id)}
            >
              <I/>{label}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}
