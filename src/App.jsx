import { useState, useRef, useEffect } from "react";

// ─── Constants ────────────────────────────────────────────
const NAV_LINKS = ["About", "Experience", "Ask AI", "Contact"];

const HIGHLIGHTS = [
  { val: "$500M+", label: "Budget Oversight" }, { val: "$1B+", label: "Audit Readiness" }
];

const EXPERIENCE = [
  {
    period: "August 2025–March 2026",
    role: "Business Solutions Analyst",
    org: "Salesforce Military Fellowship",
    narrative:
      "Spent six months embedded in Salesforce's enterprise sales operation, working live deal cycles with C-suite clients, building pricing analyses, and translating business requirements into actionable configurations across a $5.5M+ portfolio.",
  },
  {
    period: "December 2023–August 2025",
    role: "Comptroller",
    org: "13th Marine Expeditionary Unit",
    narrative:
      "Full budget authority over $15M, leading an 8-person cross-functional fiscal team. Built a zero-based budget and reporting infrastructure from scratch in a constrained fiscal environment for a deployed unit in Southeast Asia",
  },
  {
    period: "November 2022–December 2023",
    role: "Senior Financial Analyst - Audit & Controls",
    org: "I Marine Expeditionary Force",
    narrative:
      "Coordinated 30+ stakeholders across 12 operational entities representing $1B+ in assets to program-manage the Marine Corps' first successful financial audit from planning through execution. Designed the internal control frameworks and standardized workflows that made it happen.",
  },
  {
    period: "June 2021–November 2022",
    role: "Budget and Program Analyst",
    org: "3d Marine Air Wing",
    narrative:
      "Managed a $500M+ annual budget, cutting unnecessary expenditures by 15% ($75M) through tighter cost controls. Built the Excel, Power BI, and MS Project dashboards that tracked $150M+ in exercise allocations and fed monthly reports directly to senior leadership.",
  },
];

const CREDENTIALS = [
  { icon: "🏅", title: "CDFM", sub: "Top 5 graduate" },
  { icon: "🔐", title: "Secret Clearance", sub: "Active" },
  { icon: "📋", title: "PMP", sub: "Expected June 2026" },
  { icon: "🌐", title: "Russian", sub: "Fluent · DLPT-qualified" },
];

const INITIAL_MESSAGE = {
  role: "assistant",
  content:
    "Hi — I'm Elliot's AI rep. Ask me anything about his background, experience, clearance, or fit for a role.",
};

const SUGGESTED = [
  "What's his budget experience?",
  "Does he have a security clearance?",
  "What roles is he targeting?",
  "Tell me about his Salesforce experience",
];

// ─── Palette ─────────────────────────────────────────────
const GOLD = "#c9a84c";
const NAVY = "#080d1a";
const NAVY2 = "#0d1426";
const NAVY3 = "#111c35";
const OFF_WHITE = "#e8e2d4";
const MUTED = "#7a8099";

// ─── App ─────────────────────────────────────────────────
export default function App() {
  const [active, setActive] = useState("About");
  const [messages, setMessages] = useState([INITIAL_MESSAGE]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function send(text) {
    const msg = text || input.trim();
    if (!msg || loading) return;

    const userMsg = { role: "user", content: msg };
    const updated = [...messages, userMsg];
    setMessages(updated);
    setInput("");
    setLoading(true);

    // Strip any leading assistant messages before sending to API
    const apiMessages = updated.filter((m) => m.role !== "system");
    const firstUser = apiMessages.findIndex((m) => m.role === "user");
    const trimmed = firstUser > 0 ? apiMessages.slice(firstUser) : apiMessages;

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: trimmed }),
      });
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply || "Something went wrong." },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Connection error. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleKey(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  }

  return (
    <div style={s.root}>
      <div style={s.noise} />
      <div style={s.gridBg} />

      {/* Nav */}
      <nav style={s.nav} className="nav-inner">
        <span style={s.brand} className="brand">E · N</span>
        <div style={s.navLinks} className="nav-links">
          {NAV_LINKS.map((l) => (
            <button
              key={l}
              style={{ ...s.navBtn, ...(active === l ? s.navBtnActive : {}) }}
              className="nav-btn"
              onClick={() => setActive(l)}
            >
              {l}
            </button>
          ))}
        </div>
      </nav>

      {/* ── HERO ── */}
      <header style={s.hero} className="hero">
        <div style={s.heroLeft}>
          <div style={s.pill}>USMC · Secret Clearance · LA/OC</div>
          <h1 style={s.name} className="hero-name">
            Elliot <span style={s.nameGold}>Nabatov</span>
          </h1>
          <p style={s.tagline} className="hero-tagline">
            Marine officer turned finance & ops leader. Four years managing budgets where
            the stakes were real. Now bringing that to the private sector.
          </p>
          <div style={s.highlights} className="highlights">
            {HIGHLIGHTS.map(({ val, label }) => (
              <div key={label} style={s.highlight}>
                <span style={s.highlightVal} className="highlight-val">{val}</span>
                <span style={s.highlightLabel}>{label}</span>
              </div>
            ))}
          </div>
          <div style={s.heroActions}>
            <button style={s.btnGold} onClick={() => setActive("Ask AI")}>
              Ask My AI Rep →
            </button>
            <button style={s.btnGhost} onClick={() => setActive("Contact")}>
              Get in Touch
            </button>
          </div>
        </div>

        {/* Hero AI preview */}
        <div style={s.heroRight} className="hero-right">
          <div style={s.heroChat}>
            <div style={s.heroChatHeader}>
              <span style={s.heroChatDot} />
              <span style={s.heroChatTitle}>AI REP — LIVE</span>
            </div>
            <div style={s.heroChatBody}>
              <div style={s.heroBubbleAI}>
                Have a question about Elliot? Ask me anything — background,
                clearance, availability, fit for a specific role.
              </div>
              <button
                style={s.heroChatCTA}
                onClick={() => setActive("Ask AI")}
              >
                Open Full Chat →
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ── MAIN ── */}
      <main style={s.main} className="main">

        {/* ABOUT */}
        {active === "About" && (
          <section style={s.section}>
            <Label>About</Label>
            <div style={s.aboutGrid} className="about-grid">
              <div>
                <p style={s.p}>
                  I spent four years as a Marine finance officer managing budgets that funded real operations,
                  leading teams under pressure, and building systems from the ground up. My most memorable 
                  role as a Financial Management Officer was serving as the in-unit CFO for a deployed unit in 
                  Southeast Asia, directing a fiscal team of Marines across a $15M budget and advising
                  the Commanding Officer directly on every financial decision.
                </p>
                <p style={s.p}>
                  After the Marine Corps, I had the opportunity to step into the tech world at Salesforce, 
                  learning how AI and CRM software drive business outcomes. I was facilitated discovery
                  and implementation calls with C-Suite stakeholders and conduct account analysis on business metrics, 
                  which gave me a clear view of how commercial finance and business ops work outside the military.
                </p>
                <p style={s.p}>
                  Outside of work I'm a very outdoors person. I'm an avid surfer and skier, sometimes 
                  doing both in the same day thanks to the California climate, and I also enjoy teaching 
                  others the sport on weekends. I recently picked up sailing as well. In college I was a 
                  D2 cross country and track athlete at University of Illinois Springfield. 
                  Lately I've been utilizing AI to learn new skills, including how to build and  
                  maintain a website with AI integration, an interest that started during 
                  my time at Salesforce through daily coursework on AI use and functionality.
                </p>
                <div style={s.credRow} className="cred-row">
                  {CREDENTIALS.map(({ icon, title, sub }) => (
                    <div key={title} style={s.credChip}>
                      <span>{icon}</span>
                      <div>
                        <div style={s.credTitle}>{title}</div>
                        <div style={s.credSub}>{sub}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div style={s.aboutSide} className="about-side">
                <div style={s.sideCard}>
                  <div style={s.sideCardLabel}>Currently</div>
                  <p style={s.sideCardText}>
                    Actively interviewing for FP&A, project and program management, and business
                    operations roles in the LA/OC market. Available immediately.
                  </p>
                </div>
                <div style={s.sideCard}>
                  <div style={s.sideCardLabel}>Based in</div>
                  <p style={s.sideCardText}>Redondo Beach, CA</p>
                </div>
                <div style={s.sideCard}>
                  <div style={s.sideCardLabel}>Clearance</div>
                  <p style={s.sideCardText}>Active Secret · DoD</p>
                </div>
                <div style={s.sideCard}>
                  <div style={s.sideCardLabel}>Outside work</div>
                  <p style={s.sideCardText}>
                    Surfing, skiing, sailing and anything that gets me outside.
                    D2 cross country captain. Fluent Russian speaker.
                  </p>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* EXPERIENCE */}
        {active === "Experience" && (
          <section style={s.section}>
            <Label>Experience</Label>
            <div style={s.expList}>
              {EXPERIENCE.map((e, i) => (
                <div key={i} style={s.expCard} className="exp-card">
                  <div style={s.expMeta} className="exp-meta">
                    <span style={s.expPeriod}>{e.period}</span>
                    {i < EXPERIENCE.length - 1 && <div style={s.expLine} />}
                  </div>
                  <div style={s.expContent}>
                    <h3 style={s.expRole}>{e.role}</h3>
                    <span style={s.expOrg}>{e.org}</span>
                    <p style={s.expNarrative}>{e.narrative}</p>
                  </div>
                </div>
              ))}
            </div>
            <div style={s.expFootnote}>
              Want specifics? Ask the AI rep below — it has full context on every role.
              <button style={s.expFootnoteBtn} onClick={() => setActive("Ask AI")}>
                Ask AI Rep →
              </button>
            </div>
          </section>
        )}

        {/* ASK AI */}
        {active === "Ask AI" && (
          <section style={s.section}>
            <Label>Ask My AI Rep</Label>
            <p style={s.agentIntro}>
              This AI has full context on my career, credentials, and background.
              If you're a recruiter or hiring manager, ask it anything — it'll give you a straight answer.
            </p>

            {/* Suggested questions */}
            <div style={s.suggestedRow} className="suggested-row">
              {SUGGESTED.map((q) => (
                <button key={q} style={s.suggestedBtn} className="suggested-btn" onClick={() => send(q)}>
                  {q}
                </button>
              ))}
            </div>

            <div style={s.chatBox}>
              <div style={s.chatMessages}>
                {messages.map((m, i) => (
                  <div
                    key={i}
                    style={{
                      ...s.bubble,
                      ...(m.role === "user" ? s.bubbleUser : s.bubbleAI),
                    }}
                  >
                    {m.role === "assistant" && (
                      <span style={s.bubbleLabel}>AI REP</span>
                    )}
                    <p style={s.bubbleText}>{m.content}</p>
                  </div>
                ))}
                {loading && (
                  <div style={{ ...s.bubble, ...s.bubbleAI }}>
                    <span style={s.bubbleLabel}>AI REP</span>
                    <p style={{ ...s.bubbleText, opacity: 0.4 }}>Thinking...</p>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>
              <div style={s.chatInputRow}>
                <textarea
                  style={s.textarea}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKey}
                  placeholder="Ask about experience, clearance, availability, target roles..."
                  rows={2}
                />
                <button
                  style={{
                    ...s.btnGold,
                    ...s.sendBtn,
                    opacity: loading || !input.trim() ? 0.4 : 1,
                  }}
                  onClick={() => send()}
                  disabled={loading || !input.trim()}
                >
                  Send
                </button>
              </div>
            </div>
            <div style={s.disclaimer}>
              <span style={s.disclaimerDot} />
              Questions are not stored, logged, or tracked. This session is private and ends when you close the tab.
            </div>
          </section>
        )}

        {/* CONTACT */}
        {active === "Contact" && (
          <section style={s.section}>
            <Label>Contact</Label>
            <div style={s.contactGrid} className="contact-grid">
              <div>
                <p style={s.p}>
                  Open to conversations about FP&A, program control, and business operations
                  roles in LA/OC. Active Secret clearance. Available immediately.
                </p>
                <p style={s.p}>
                  Reach out directly — I respond fast.
                </p>
              </div>
              <div style={s.contactCards}>
                <a href="mailto:elliotnabatov@gmail.com" style={s.contactCard}>
                  <span style={s.contactIcon}>✉</span>
                  <div>
                    <div style={s.contactCardTitle}>Email</div>
                    <div style={s.contactCardSub}>elliotnabatov@gmail.com</div>
                  </div>
                </a>
                <a
                  href="https://www.linkedin.com/in/elliotnabatov"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={s.contactCard}
                >
                  <span style={s.contactIcon}>in</span>
                  <div>
                    <div style={s.contactCardTitle}>LinkedIn</div>
                    <div style={s.contactCardSub}>linkedin.com/in/elliotnabatov</div>
                  </div>
                </a>
                <div style={s.contactMeta}>
                  {["Redondo Beach, CA", "Open to hybrid or in-person (LA/OC)", "Active Secret Clearance"].map((item) => (
                    <div key={item} style={s.contactMetaRow}>
                      <span style={s.dot} />
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

      </main>

      <footer style={s.footer}>
        <span style={{ fontFamily: "'Playfair Display', Georgia, serif", color: OFF_WHITE }}>
          Elliot Nabatov
        </span>
        <span style={{ color: GOLD, opacity: 0.4 }}>·</span>
        <span>Redondo Beach, CA</span>
        <span style={{ color: GOLD, opacity: 0.4 }}>·</span>
        <span style={{ color: GOLD, opacity: 0.7 }}>Secret Clearance Active</span>
      </footer>
    </div>
  );
}

function Label({ children }) {
  return (
    <div style={{
      fontSize: "11px",
      letterSpacing: "0.25em",
      textTransform: "uppercase",
      color: GOLD,
      marginBottom: "36px",
      paddingBottom: "12px",
      borderBottom: "1px solid rgba(201,168,76,0.18)",
      fontFamily: "'EB Garamond', Georgia, serif",
    }}>
      {children}
    </div>
  );
}

// ─── Styles ──────────────────────────────────────────────
const s = {
  root: {
    minHeight: "100vh",
    background: NAVY,
    color: OFF_WHITE,
    fontFamily: "'EB Garamond', Georgia, serif",
    position: "relative",
    overflowX: "hidden",
  },
  noise: {
    position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, opacity: 0.5,
    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.05'/%3E%3C/svg%3E")`,
  },
  gridBg: {
    position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0,
    backgroundImage: `linear-gradient(rgba(201,168,76,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,76,0.03) 1px, transparent 1px)`,
    backgroundSize: "64px 64px",
  },
  nav: {
    position: "sticky", top: 0, zIndex: 100,
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "14px 48px",
    borderBottom: "1px solid rgba(201,168,76,0.1)",
    background: "rgba(8,13,26,0.94)",
    backdropFilter: "blur(14px)",
  },
  brand: {
    fontFamily: "'Playfair Display', Georgia, serif",
    fontSize: "20px", fontWeight: "700", color: GOLD, letterSpacing: "0.15em",
  },
  navLinks: { display: "flex", gap: "4px" },
  navBtn: {
    background: "none", border: "none", color: MUTED,
    fontSize: "12px", letterSpacing: "0.14em", textTransform: "uppercase",
    cursor: "pointer", padding: "6px 14px", borderRadius: "2px",
    fontFamily: "'EB Garamond', Georgia, serif", transition: "color 0.15s",
  },
  navBtnActive: { color: GOLD, background: "rgba(201,168,76,0.07)" },

  hero: {
    position: "relative", zIndex: 1,
    display: "grid", gridTemplateColumns: "1fr 400px", gap: "60px",
    padding: "72px 48px 64px",
    borderBottom: "1px solid rgba(201,168,76,0.1)",
    alignItems: "center",
  },
  heroLeft: {},
  pill: {
    display: "inline-block", fontSize: "11px", letterSpacing: "0.2em",
    textTransform: "uppercase", color: GOLD,
    border: "1px solid rgba(201,168,76,0.35)", padding: "4px 12px", marginBottom: "22px",
  },
  name: {
    fontFamily: "'Playfair Display', Georgia, serif",
    fontSize: "clamp(44px, 6vw, 76px)", fontWeight: "700",
    lineHeight: "1.05", margin: "0 0 20px",
  },
  nameGold: { color: GOLD },
  tagline: {
    fontSize: "17px", lineHeight: "1.75", color: "#aab0c5",
    maxWidth: "520px", marginBottom: "32px",
  },
  highlights: {
    display: "flex", gap: "32px", marginBottom: "36px", flexWrap: "wrap",
  },
  highlight: { display: "flex", flexDirection: "column", gap: "2px" },
  highlightVal: {
    fontFamily: "'Playfair Display', Georgia, serif",
    fontSize: "26px", color: GOLD, fontWeight: "700",
  },
  highlightLabel: { fontSize: "11px", letterSpacing: "0.1em", color: MUTED, textTransform: "uppercase" },
  heroActions: { display: "flex", gap: "12px", flexWrap: "wrap" },
  btnGold: {
    background: GOLD, color: NAVY, border: "none",
    padding: "11px 22px", fontSize: "12px", letterSpacing: "0.1em",
    textTransform: "uppercase", fontWeight: "700", cursor: "pointer",
    fontFamily: "'EB Garamond', Georgia, serif",
  },
  btnGhost: {
    background: "none", color: MUTED,
    border: "1px solid rgba(201,168,76,0.25)",
    padding: "11px 22px", fontSize: "12px", letterSpacing: "0.1em",
    textTransform: "uppercase", cursor: "pointer",
    fontFamily: "'EB Garamond', Georgia, serif",
  },
  heroRight: {},
  heroChat: {
    background: NAVY3, border: "1px solid rgba(201,168,76,0.2)",
    overflow: "hidden",
  },
  heroChatHeader: {
    display: "flex", alignItems: "center", gap: "8px",
    padding: "12px 18px", borderBottom: "1px solid rgba(201,168,76,0.1)",
    background: "rgba(201,168,76,0.04)",
  },
  heroChatDot: {
    width: "8px", height: "8px", borderRadius: "50%",
    background: GOLD, display: "inline-block",
    boxShadow: `0 0 8px ${GOLD}`,
  },
  heroChatTitle: {
    fontSize: "10px", letterSpacing: "0.2em", color: GOLD, textTransform: "uppercase",
  },
  heroChatBody: { padding: "20px" },
  heroBubbleAI: {
    background: NAVY2, border: "1px solid rgba(201,168,76,0.1)",
    padding: "14px 16px", fontSize: "14px", lineHeight: "1.7",
    color: "#b0b8cc", marginBottom: "16px",
  },
  heroChatCTA: {
    background: "none", border: "1px solid rgba(201,168,76,0.3)",
    color: GOLD, padding: "10px 18px", fontSize: "12px",
    letterSpacing: "0.1em", cursor: "pointer",
    fontFamily: "'EB Garamond', Georgia, serif", width: "100%",
  },

  main: {
    position: "relative", zIndex: 1,
    maxWidth: "960px", margin: "0 auto", padding: "0 48px",
  },
  section: { padding: "64px 0" },
  p: { fontSize: "17px", lineHeight: "1.85", color: "#b8c0d4", marginBottom: "20px" },

  aboutGrid: {
    display: "grid", gridTemplateColumns: "1fr 260px", gap: "52px", alignItems: "start",
  },
  credRow: { display: "flex", flexWrap: "wrap", gap: "10px", marginTop: "8px" },
  credChip: {
    display: "flex", gap: "10px", alignItems: "center",
    background: NAVY3, border: "1px solid rgba(201,168,76,0.1)",
    padding: "10px 14px", fontSize: "13px",
  },
  credTitle: { color: OFF_WHITE, fontSize: "13px", marginBottom: "1px" },
  credSub: { color: MUTED, fontSize: "11px" },
  aboutSide: { display: "flex", flexDirection: "column", gap: "10px" },
  sideCard: {
    background: NAVY3, border: "1px solid rgba(201,168,76,0.08)",
    padding: "16px 18px",
  },
  sideCardLabel: {
    fontSize: "10px", letterSpacing: "0.2em", textTransform: "uppercase",
    color: GOLD, marginBottom: "6px",
  },
  sideCardText: { fontSize: "14px", lineHeight: "1.6", color: "#9aa0b4" },

  expList: { display: "flex", flexDirection: "column", gap: "0" },
  expCard: { display: "flex", gap: "36px", paddingBottom: "44px" },
  expMeta: {
    display: "flex", flexDirection: "column", alignItems: "center",
    width: "90px", flexShrink: 0,
  },
  expPeriod: { fontSize: "11px", letterSpacing: "0.06em", color: MUTED, marginBottom: "14px", whiteSpace: "nowrap" },
  expLine: { width: "1px", flex: 1, background: "rgba(201,168,76,0.15)" },
  expContent: { flex: 1, paddingTop: "2px" },
  expRole: {
    fontFamily: "'Playfair Display', Georgia, serif",
    fontSize: "21px", color: OFF_WHITE, marginBottom: "4px", fontWeight: "600",
  },
  expOrg: {
    fontSize: "12px", letterSpacing: "0.12em", color: GOLD,
    textTransform: "uppercase", display: "block", marginBottom: "14px",
  },
  expNarrative: { fontSize: "16px", lineHeight: "1.8", color: "#9aa0b4" },
  expFootnote: {
    display: "flex", alignItems: "center", gap: "16px",
    fontSize: "14px", color: MUTED, paddingTop: "8px",
    borderTop: "1px solid rgba(201,168,76,0.08)",
  },
  expFootnoteBtn: {
    background: "none", border: "none", color: GOLD,
    fontSize: "14px", cursor: "pointer",
    fontFamily: "'EB Garamond', Georgia, serif", padding: 0,
  },

  agentIntro: { fontSize: "16px", lineHeight: "1.7", color: MUTED, marginBottom: "24px" },
  suggestedRow: { display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "24px" },
  suggestedBtn: {
    background: "none", border: "1px solid rgba(201,168,76,0.2)",
    color: "#9aa0b4", padding: "8px 14px", fontSize: "13px",
    cursor: "pointer", fontFamily: "'EB Garamond', Georgia, serif",
    transition: "border-color 0.15s, color 0.15s",
  },
  chatBox: {
    background: NAVY2, border: "1px solid rgba(201,168,76,0.15)",
    display: "flex", flexDirection: "column", height: "520px",
  },
  chatMessages: {
    flex: 1, overflowY: "auto", padding: "24px",
    display: "flex", flexDirection: "column", gap: "16px",
  },
  bubble: { maxWidth: "78%", padding: "14px 18px" },
  bubbleAI: {
    background: NAVY3, border: "1px solid rgba(201,168,76,0.1)",
    alignSelf: "flex-start",
  },
  bubbleUser: {
    background: "rgba(201,168,76,0.1)", border: "1px solid rgba(201,168,76,0.22)",
    alignSelf: "flex-end",
  },
  bubbleLabel: {
    fontSize: "10px", letterSpacing: "0.2em", color: GOLD,
    display: "block", marginBottom: "6px",
  },
  bubbleText: { fontSize: "15px", lineHeight: "1.75", color: "#b8c0d4", margin: 0 },
  chatInputRow: {
    display: "flex", borderTop: "1px solid rgba(201,168,76,0.1)",
    padding: "12px", gap: "10px",
  },
  textarea: {
    flex: 1, background: NAVY, border: "1px solid rgba(201,168,76,0.18)",
    color: OFF_WHITE, padding: "10px 14px", fontSize: "14px",
    fontFamily: "'EB Garamond', Georgia, serif", resize: "none", outline: "none",
    lineHeight: "1.5",
  },
  sendBtn: { padding: "10px 20px", alignSelf: "stretch", fontSize: "12px", flexShrink: 0 },
  disclaimer: {
    display: "flex", alignItems: "center", gap: "10px",
    marginTop: "10px", fontSize: "12px", color: MUTED,
    letterSpacing: "0.04em", opacity: 0.8,
    borderLeft: "2px solid rgba(201,168,76,0.25)",
    paddingLeft: "12px",
  },
  disclaimerDot: {
    width: "5px", height: "5px", borderRadius: "50%",
    background: GOLD, opacity: 0.6, flexShrink: 0,
  },

  contactGrid: {
    display: "grid", gridTemplateColumns: "1fr 1fr", gap: "52px", alignItems: "start",
  },
  contactCards: { display: "flex", flexDirection: "column", gap: "12px" },
  contactCard: {
    display: "flex", alignItems: "center", gap: "20px",
    background: NAVY3, border: "1px solid rgba(201,168,76,0.13)",
    padding: "20px 24px", textDecoration: "none", color: OFF_WHITE, cursor: "pointer",
  },
  contactIcon: {
    fontSize: "18px", color: GOLD, width: "26px",
    textAlign: "center", flexShrink: 0, fontFamily: "sans-serif",
  },
  contactCardTitle: {
    fontFamily: "'Playfair Display', Georgia, serif",
    fontSize: "16px", color: OFF_WHITE, marginBottom: "2px",
  },
  contactCardSub: { fontSize: "13px", color: MUTED },
  contactMeta: {
    border: "1px solid rgba(201,168,76,0.07)",
    padding: "16px 20px", display: "flex", flexDirection: "column", gap: "10px",
  },
  contactMetaRow: {
    display: "flex", alignItems: "center", gap: "10px",
    fontSize: "13px", color: MUTED, letterSpacing: "0.03em",
  },
  dot: {
    width: "5px", height: "5px", borderRadius: "50%",
    background: GOLD, flexShrink: 0,
  },

  footer: {
    position: "relative", zIndex: 1,
    borderTop: "1px solid rgba(201,168,76,0.1)",
    padding: "22px 48px",
    display: "flex", gap: "14px", alignItems: "center",
    fontSize: "13px", color: MUTED,
  },
};
