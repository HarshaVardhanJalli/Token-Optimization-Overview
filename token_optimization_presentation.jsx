import { useState, useEffect, useCallback, useRef } from "react";

const B = {
  copilot: { c: "#a78bfa", g: "linear-gradient(135deg,#7c3aed,#a78bfa)", name: "GitHub Copilot" },
  cursor:  { c: "#22d3ee", g: "linear-gradient(135deg,#06b6d4,#22d3ee)", name: "Cursor" },
  claude:  { c: "#fb923c", g: "linear-gradient(135deg,#ea580c,#fb923c)", name: "Claude Code" },
};

function AnimBg({ accent = "#a78bfa" }) {
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", zIndex: 0, pointerEvents: "none" }}>
      <div className="orb orb1" style={{ "--clr": accent }} />
      <div className="orb orb2" style={{ "--clr": accent }} />
      <div className="orb orb3" style={{ "--clr": `${accent}66` }} />
      <svg width="100%" height="100%" style={{ position: "absolute", inset: 0, opacity: 0.04 }}>
        <defs><pattern id="g" width="60" height="60" patternUnits="userSpaceOnUse"><path d="M 60 0 L 0 0 0 60" fill="none" stroke="#fff" strokeWidth="0.5" /></pattern></defs>
        <rect width="100%" height="100%" fill="url(#g)" />
      </svg>
      {Array.from({ length: 18 }).map((_, i) => (
        <div key={i} className="particle" style={{ "--x": `${10 + Math.random() * 80}%`, "--y": `${10 + Math.random() * 80}%`, "--dur": `${6 + Math.random() * 10}s`, "--del": `${-Math.random() * 8}s`, "--sz": `${2 + Math.random() * 3}px`, "--clr": accent }} />
      ))}
    </div>
  );
}

function GlassCard({ children, delay = 0, hover = true, glow, style: s, className = "" }) {
  return <div className={`glass-card stagger ${hover ? "hoverable" : ""} ${className}`} style={{ "--d": `${delay}ms`, "--glow": glow || "transparent", ...s }}>{children}</div>;
}
function Tag({ color, children }) { return <span className="tag" style={{ "--tc": color }}>{children}</span>; }
function Bld({ children }) { return <strong style={{ color: "#f1f5f9", fontWeight: 700 }}>{children}</strong>; }
function Num({ children, sub, color = "#22d3ee" }) {
  return <div className="num-stat stagger" style={{ "--d": "200ms" }}><span style={{ fontSize: 28, fontWeight: 800, fontFamily: "'Space Mono',monospace", color, lineHeight: 1 }}>{children}</span>{sub && <span style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>{sub}</span>}</div>;
}
function Code({ title, children, accent }) {
  return <div className="code-block stagger" style={{ "--d": "150ms" }}>{title && <div className="code-title" style={{ borderBottom: `1px solid ${accent || "#334155"}33` }}>{title}</div>}<pre className="code-pre">{children}</pre><div className="code-shine" /></div>;
}
function Callout({ icon = "💡", color = "#3b82f6", children, delay = 300 }) {
  return <div className="callout stagger" style={{ "--d": `${delay}ms`, "--cc": color }}><span className="callout-icon">{icon}</span><div>{children}</div></div>;
}
function SlideLayout({ tag, tagColor, title, sub, children }) {
  return <div style={{ display: "flex", flexDirection: "column", height: "100%", position: "relative", zIndex: 1 }}><div className="stagger" style={{ "--d": "0ms", marginBottom: 14 }}>{tag && <div className="slide-tag" style={{ "--stc": tagColor || "#a78bfa" }}>{tag}</div>}<h2 className="slide-title">{title}</h2>{sub && <p className="slide-sub">{sub}</p>}</div><div style={{ flex: 1, overflow: "auto", paddingBottom: 8 }}>{children}</div></div>;
}
function TokenBar({ label, tokens, max, color, delay = 0 }) {
  return <div className="token-bar stagger" style={{ "--d": `${delay}ms` }}><span className="token-label">{label}</span><div className="token-track"><div className="token-fill" style={{ "--tw": `${(tokens / max) * 100}%`, background: color }} /></div><span className="token-val" style={{ color }}>~{tokens}</span></div>;
}

const allSlides = [
  { id: "title", section: "intro", accent: "#a78bfa", content: () => (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", position: "relative", zIndex: 1 }}>
      <div className="stagger" style={{ "--d": "0ms", fontSize: 12, letterSpacing: 8, textTransform: "uppercase", color: "#64748b", fontWeight: 600, marginBottom: 16 }}>Workshop · 2026</div>
      <h1 className="hero-title stagger" style={{ "--d": "100ms" }}>Optimising Tokens &amp;<br/>AI Coding Agents</h1>
      <p className="stagger" style={{ "--d": "250ms", color: "#94a3b8", textAlign: "center", fontSize: 16, marginTop: 16, lineHeight: 1.7 }}>A practical guide to getting more from</p>
      <div className="stagger" style={{ "--d": "400ms", display: "flex", gap: 12, marginTop: 14 }}><Tag color={B.copilot.c}>⬡ Copilot</Tag><Tag color={B.cursor.c}>⌘ Cursor</Tag><Tag color={B.claude.c}>◈ Claude</Tag></div>
      <div className="stagger pulse-hint" style={{ "--d": "700ms", marginTop: 48, display: "flex", alignItems: "center", gap: 8, color: "#475569", fontSize: 13 }}><span>Press</span><kbd className="kbd">→</kbd><span>or swipe to begin</span></div>
    </div>
  )},
  { id: "why-now", section: "intro", accent: "#ef4444", content: () => (
    <SlideLayout tag="URGENT" tagColor="#ef4444" title="Why This Matters Right Now" sub="The billing earthquake of June 2026">
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <GlassCard delay={100} glow={B.copilot.c}><div className="card-header"><span className="card-icon" style={{ background: B.copilot.g }}>⬡</span><div><div className="card-name">{B.copilot.name}</div><div className="card-date">June 1, 2026</div></div></div><p className="card-body">Moving from <Bld>request-based</Bld> → <Bld>token-based</Bld> billing. 1 AI Credit = $0.01. Pro = $10/mo credits.</p></GlassCard>
        <GlassCard delay={200} glow={B.cursor.c}><div className="card-header"><span className="card-icon" style={{ background: B.cursor.g }}>⌘</span><div><div className="card-name">{B.cursor.name}</div><div className="card-date">Credit Pool</div></div></div><p className="card-body">Pro = <Bld>$20/mo</Bld> credits. Sonnet 4 ≈ <Bld>225 requests</Bld> per $20. Agent Mode multiplies cost fast.</p></GlassCard>
      </div>
      <Callout icon="🔥" color="#ef4444" delay={400}>Copilot's weekly cost <Bld>nearly doubled</Bld> since Jan 2026. They paused signups and tightened limits.</Callout>
    </SlideLayout>
  )},
  { id: "token-basics", section: "tokens", accent: "#22d3ee", content: () => (
    <SlideLayout tag="FUNDAMENTALS" tagColor="#22d3ee" title="What Is a Token?" sub="The currency your AI agent spends on every interaction">
      <Code accent="#22d3ee">{`"optimization"          →  3 tokens
"const x = await f()"  → 10 tokens
A 20-line function      → ~150 tokens
Your instructions file  → 300–2000 tokens  ← EVERY request`}</Code>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginTop: 16 }}>
        <GlassCard delay={200}><Num color="#ef4444" sub="Input / 1M tokens · GPT-5.4">$2.50</Num></GlassCard>
        <GlassCard delay={300}><Num color="#f59e0b" sub="Output / 1M tokens · GPT-5.4">$15</Num></GlassCard>
        <GlassCard delay={400}><Num color="#22d3ee" sub="Output costs more than input">3–6×</Num></GlassCard>
      </div>
      <Callout delay={500}>Output tokens (agent's response) cost <Bld>3–6× more</Bld> than input. Shorter responses = real savings.</Callout>
    </SlideLayout>
  )},
  { id: "anatomy", section: "tokens", accent: "#a78bfa", content: () => (
    <SlideLayout tag="DEEP DIVE" tagColor="#a78bfa" title="Anatomy of One Request" sub="Where your tokens actually go — the meter starts before you speak">
      <div className="stagger" style={{ "--d": "100ms", borderRadius: 14, overflow: "hidden", border: "1px solid #1e293b", background: "rgba(15,23,42,0.7)", backdropFilter: "blur(12px)", padding: "16px 18px" }}>
        <div style={{ fontSize: 11, letterSpacing: 2, color: "#64748b", marginBottom: 10, textTransform: "uppercase" }}>Input — what gets sent</div>
        <TokenBar label="System prompt" tokens={500} max={4500} color="#a78bfa" delay={150} />
        <TokenBar label="Instructions" tokens={300} max={4500} color="#fbbf24" delay={200} />
        <TokenBar label="Rules/skills" tokens={500} max={4500} color="#22d3ee" delay={250} />
        <TokenBar label="Open tabs" tokens={2000} max={4500} color="#ef4444" delay={300} />
        <TokenBar label="Current file" tokens={1000} max={4500} color="#22c55e" delay={350} />
        <TokenBar label="Your question" tokens={50} max={4500} color="#c084fc" delay={400} />
        <div style={{ borderTop: "1px solid #1e293b", margin: "12px 0 10px", paddingTop: 10 }}>
          <div style={{ fontSize: 11, letterSpacing: 2, color: "#64748b", marginBottom: 10, textTransform: "uppercase" }}>Output <span style={{ color: "#fbbf24" }}>(3–6× more expensive!)</span></div>
          <TokenBar label="Agent response" tokens={2000} max={4500} color="#fb923c" delay={450} />
        </div>
      </div>
    </SlideLayout>
  )},
  { id: "three-problems", section: "tokens", accent: "#ef4444", content: () => (
    <SlideLayout tag="PROBLEMS" tagColor="#ef4444" title="The 3 Costs of Bloated Context" sub="More isn't better — it's slower, dumber, and more expensive">
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>{[
        { n: "1", t: "Context Squeeze", c: "#ef4444", d: "Rules take 25% of window → AI has 25% less brain for your code." },
        { n: "2", t: "Lost in the Middle", c: "#fbbf24", d: "AI remembers top & bottom instructions. Rule #47 gets ignored." },
        { n: "3", t: "Latency & Cost", c: "#a78bfa", d: "More tokens = slower Time-to-First-Token + higher API bills." },
      ].map((p, i) => (
        <GlassCard key={i} delay={i * 120} glow={p.c}><div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}><div className="problem-num" style={{ "--pc": p.c }}>{p.n}</div><div><div style={{ fontWeight: 800, color: p.c, fontSize: 16, marginBottom: 4 }}>{p.t}</div><div style={{ fontSize: 14, color: "#cbd5e1", lineHeight: 1.6 }}>{p.d}</div></div></div></GlassCard>
      ))}</div>
    </SlideLayout>
  )},
  { id: "instructions", section: "config", accent: "#22d3ee", content: () => (
    <SlideLayout tag="CONFIG" tagColor="#22d3ee" title="Instructions Files" sub="Loaded EVERY request. Write instructions, not essays.">
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <GlassCard delay={100} glow="#ef4444" className="no-hover"><div className="compare-label bad">❌ Verbose — 45 tokens</div><Code>{`It is strongly recommended
that developers use TypeScript
interfaces rather than type
aliases when defining public
API contracts, as this
provides better extensibility…`}</Code></GlassCard>
        <GlassCard delay={200} glow="#22c55e" className="no-hover"><div className="compare-label good">✅ Dense — 9 tokens</div><Code>{`Prefer interface over type
for public APIs.


  
  80% fewer tokens ↗`}</Code></GlassCard>
      </div>
      <Callout icon="⚡" color="#fbbf24" delay={350}><Bld>Rule of Three:</Bld> Only add a rule after AI fails <Bld>3 times</Bld>. If it already works — skip the rule.</Callout>
    </SlideLayout>
  )},
  { id: "perfect-instructions", section: "config", accent: "#22c55e", content: () => (
    <SlideLayout tag="TEMPLATE" tagColor="#22c55e" title="The Perfect Instructions File" sub="copilot-instructions.md  ·  .cursor/rules/general.md">
      <Code title="copilot-instructions.md — 12 lines, ~200 tokens" accent="#22c55e">{`## Project: Hireflow — AI Resume Search
## Stack: FastAPI + React + PostgreSQL + Pinecone

## Standards
- Python: type hints, docstrings on public APIs
- TypeScript: strict mode, no \`any\`
- All endpoints return proper HTTP status codes

## Do Not Suggest
- Changes to migration files
- Edits to .env or config files
- Changes to /dist, /build, /node_modules`}</Code>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginTop: 14 }}>
        <GlassCard delay={200}><Num sub="tokens max for always-on" color="#22c55e">&lt;500</Num></GlassCard>
        <GlassCard delay={300}><Num sub="rules maximum" color="#fbbf24">5–15</Num></GlassCard>
        <GlassCard delay={400}><Num sub="requests/day — cost multiplies" color="#ef4444">100×</Num></GlassCard>
      </div>
    </SlideLayout>
  )},
  { id: "skills", section: "config", accent: "#22c55e", content: () => (
    <SlideLayout tag="GAME CHANGER" tagColor="#22c55e" title="Skills — On-Demand Expertise" sub="Load ONLY when relevant. Biggest token saver.">
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <GlassCard delay={100} glow="#ef4444"><div style={{ fontWeight: 800, color: "#ef4444", fontSize: 14, marginBottom: 6 }}>Instructions (Always-On)</div><div style={{ color: "#94a3b8", fontSize: 13 }}>Menu every customer sees — even for water</div><div className="big-pct" style={{ "--bc": "#ef4444" }}>100%</div><div style={{ fontSize: 11, color: "#64748b", textAlign: "center" }}>of requests</div></GlassCard>
        <GlassCard delay={200} glow="#22c55e"><div style={{ fontWeight: 800, color: "#22c55e", fontSize: 14, marginBottom: 6 }}>Skills (On-Demand)</div><div style={{ color: "#94a3b8", fontSize: 13 }}>Recipe book opened only for that dish</div><div className="big-pct" style={{ "--bc": "#22c55e" }}>~20%</div><div style={{ fontSize: 11, color: "#64748b", textAlign: "center" }}>of requests</div></GlassCard>
      </div>
      <GlassCard delay={350} glow="#22d3ee" className="no-hover"><div style={{ fontSize: 11, letterSpacing: 2, color: "#64748b", textTransform: "uppercase", marginBottom: 8 }}>Token Math — 100 requests/day</div><div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: 12, alignItems: "center" }}><div style={{ textAlign: "center" }}><div style={{ fontSize: 11, color: "#f87171" }}>All in instructions</div><div className="math-num" style={{ color: "#f87171" }}>200,000</div><div style={{ fontSize: 11, color: "#64748b" }}>tokens/day</div></div><div className="arrow-morph">→</div><div style={{ textAlign: "center" }}><div style={{ fontSize: 11, color: "#4ade80" }}>Rules + Skills</div><div className="math-num" style={{ color: "#4ade80" }}>40,000</div><div style={{ fontSize: 11, color: "#64748b" }}>80% saved</div></div></div></GlassCard>
    </SlideLayout>
  )},
  { id: "agents-md", section: "config", accent: "#fb923c", content: () => (
    <SlideLayout tag="UNIVERSAL" tagColor="#fb923c" title="AGENTS.md" sub="One file. All agents. Backed by Linux Foundation.">
      <div className="stagger" style={{ "--d": "100ms", display: "flex", gap: 8, marginBottom: 14, flexWrap: "wrap" }}><Tag color={B.copilot.c}>Copilot ✓</Tag><Tag color={B.cursor.c}>Cursor ✓</Tag><Tag color={B.claude.c}>Claude Code ✓</Tag><Tag color="#22c55e">Codex ✓</Tag><Tag color="#c084fc">Jules ✓</Tag></div>
      <Code title="AGENTS.md — project root" accent="#fb923c">{`# Architecture
Monorepo: React frontend + FastAPI backend
Database: PostgreSQL via SQLAlchemy
Search: Pinecone + BM25 hybrid (RRF)

# Build & Test
Backend:  pip install -e . && pytest
Frontend: pnpm install && pnpm test

# Critical Rules
- Never modify migration files
- Secrets in .env, never committed`}</Code>
      <Callout icon="📘" color="#fb923c" delay={350}>README = for humans. <Bld>AGENTS.md</Bld> = for AI. Version-controlled, shared with team.</Callout>
    </SlideLayout>
  )},
  { id: "other-configs", section: "config", accent: "#c084fc", content: () => (
    <SlideLayout tag="HIDDEN GEMS" tagColor="#c084fc" title="Configs You're Missing" sub="High-impact settings most teams overlook">
      {[
        { icon: "🚫", t: "Content Exclusion", impact: "HIGH", c: "#ef4444", d: "Exclude XML, YAML, vendor, generated files at org level." },
        { icon: "📁", t: ".gitignore Hygiene", impact: "HIGH", c: "#ef4444", d: "Stops indexing node_modules, dist, __pycache__, .env." },
        { icon: "🎯", t: "Cursor Globs", impact: "HIGH", c: "#ef4444", d: "Rules load ONLY for matching file patterns. Zero cost elsewhere." },
        { icon: "🔌", t: "MCP Servers", impact: "MED", c: "#fbbf24", d: "Connect DB/CI directly. No pasting data into chat." },
        { icon: "🪝", t: "Hooks", impact: "MED", c: "#fbbf24", d: "Auto-test/lint after agent actions — no tokens burned." },
      ].map((item, i) => (
        <GlassCard key={i} delay={i * 80} style={{ marginBottom: 8 }}><div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}><span style={{ fontSize: 22 }}>{item.icon}</span><div style={{ flex: 1 }}><div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><span style={{ fontWeight: 800, color: "#f1f5f9", fontSize: 14 }}>{item.t}</span><span className="impact-badge" style={{ "--ic": item.c }}>{item.impact}</span></div><div style={{ fontSize: 13, color: "#94a3b8", marginTop: 4, lineHeight: 1.5 }}>{item.d}</div></div></div></GlassCard>
      ))}
    </SlideLayout>
  )},
  { id: "10-ways", section: "optimize", accent: "#22c55e", content: () => (
    <SlideLayout tag="ACTION PLAN" tagColor="#22c55e" title="10 Ways to Cut Token Burn" sub="Ranked by impact — start from the top">
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>{[
        { n: 1, t: "Close unused tabs → max 5", e: "1 min", s: 5 },{ n: 2, t: "Trim instructions ≤15 rules", e: "30 min", s: 5 },
        { n: 3, t: "Move workflows → Skills", e: "1 hr", s: 5 },{ n: 4, t: "Scoped rules (Cursor globs)", e: "1 hr", s: 5 },
        { n: 5, t: "Specific prompts (file+fn)", e: "Ongoing", s: 4 },{ n: 6, t: "Add AGENTS.md to repo", e: "30 min", s: 4 },
        { n: 7, t: "Auto model for routine", e: "1 min", s: 4 },{ n: 8, t: "Disable AI non-code files", e: "5 min", s: 3 },
        { n: 9, t: "Plan Mode first", e: "Ongoing", s: 3 },{ n: 10, t: "Weekly rule audit", e: "15 min/wk", s: 3 },
      ].map((item, i) => (
        <GlassCard key={i} delay={i * 50} style={{ padding: "8px 12px" }}><div style={{ display: "flex", alignItems: "center", gap: 10 }}><div className="rank-badge" style={{ "--rc": item.s >= 5 ? "#ef4444" : item.s >= 4 ? "#fbbf24" : "#3b82f6" }}>{item.n}</div><div style={{ flex: 1 }}><div style={{ fontWeight: 700, color: "#e2e8f0", fontSize: 13 }}>{item.t}</div><div style={{ fontSize: 11, color: "#64748b" }}>{item.e}</div></div><div className="impact-dots">{Array.from({ length: item.s }).map((_, j) => <div key={j} className="dot" style={{ "--dc": item.s >= 5 ? "#ef4444" : item.s >= 4 ? "#fbbf24" : "#3b82f6" }} />)}</div></div></GlassCard>
      ))}</div>
    </SlideLayout>
  )},
  { id: "better-prompts", section: "optimize", accent: "#fbbf24", content: () => (
    <SlideLayout tag="PRO TIP" tagColor="#fbbf24" title="Better Context = Less Thinking" sub="Vague prompts burn expensive output tokens">
      {[
        { bad: `"Fix the auth"`, good: `"In auth.ts:42, JWT refresh\nfails when expired >24hrs.\nFix the expiry check."`, save: "~70% saved" },
        { bad: `"Make API faster"`, good: `"Add Redis cache GET /users/:id\n5min TTL, use lib/redis.ts"`, save: "~60% saved" },
        { bad: `"Write tests"`, good: `"Test processPayment() per\npattern in order.test.ts"`, save: "~50% saved" },
      ].map((p, i) => (
        <div key={i} className="stagger" style={{ "--d": `${i * 100}ms`, display: "grid", gridTemplateColumns: "1fr 1fr auto", gap: 10, marginBottom: 10, alignItems: "stretch" }}>
          <div className="prompt-card bad"><div className="prompt-label">❌ Vague</div><pre className="prompt-pre">{p.bad}</pre></div>
          <div className="prompt-card good"><div className="prompt-label">✅ Specific</div><pre className="prompt-pre">{p.good}</pre></div>
          <div className="save-badge">{p.save}</div>
        </div>
      ))}
    </SlideLayout>
  )},
  { id: "measuring", section: "metrics", accent: "#fbbf24", content: () => (
    <SlideLayout tag="METRICS" tagColor="#fbbf24" title={`"performance.now()" for Agents`} sub="6 ways to get real token numbers">
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>{[
        { n: 1, t: "VS Code Status Bar", tool: "Copilot", d: "Click icon → credits, limits, remaining." },
        { n: 2, t: "Billing Dashboard", tool: "Copilot", d: "github.com/settings/billing → analytics." },
        { n: 3, t: "Token Tracker Ext.", tool: "VS Code", d: '"AI Engineering Fluency" — daily tokens + cost.' },
        { n: 4, t: "Manual Stopwatch", tool: "Any", d: "Credits before → task → credits after = cost." },
        { n: 5, t: "Metrics API", tool: "Admin", d: "GET /orgs/{org}/copilot/usage" },
        { n: 6, t: "A/B Test", tool: "Team", d: "Week 1 default vs Week 2 optimized." },
      ].map((m, i) => (
        <GlassCard key={i} delay={i * 80} style={{ padding: "10px 14px" }}><div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}><span style={{ fontWeight: 800, color: "#fbbf24", fontSize: 13 }}>#{m.n} {m.t}</span><span className="tool-badge">{m.tool}</span></div><div style={{ fontSize: 12, color: "#94a3b8", lineHeight: 1.5 }}>{m.d}</div></GlassCard>
      ))}</div>
    </SlideLayout>
  )},
  { id: "proof", section: "metrics", accent: "#22c55e", content: () => (
    <SlideLayout tag="EVIDENCE" tagColor="#22c55e" title="Proof in Numbers" sub="Real measurements from production teams">
      {[
        { a: "Instructions 300→15 lines", r: "~80% fewer tokens/request", s: "Teams" },
        { a: "Tabs 15→5 open", r: "~60% less context", s: "GitHub" },
        { a: "Scoped Cursor globs", r: "20% vs 100% load rate", s: "Cursor" },
        { a: "Content exclusion", r: "50% less indexed content", s: "Enterprise" },
        { a: "Auto vs premium models", r: "4–10× more per dollar", s: "Cursor" },
        { a: "Prompt + tool narrowing", r: "14.9M→5M tokens (66%)", s: "GitHub int." },
        { a: "Full measurement (Faros)", r: "+210% tasks/developer", s: "22K devs" },
      ].map((row, i) => (
        <GlassCard key={i} delay={i * 60} style={{ marginBottom: 6, padding: "8px 14px" }}><div style={{ display: "grid", gridTemplateColumns: "1fr 1fr auto", gap: 8, alignItems: "center" }}><div style={{ fontSize: 13, color: "#e2e8f0", fontWeight: 600 }}>{row.a}</div><div style={{ fontSize: 13, color: "#4ade80", fontWeight: 700 }}>{row.r}</div><div style={{ fontSize: 10, color: "#64748b" }}>{row.s}</div></div></GlassCard>
      ))}
    </SlideLayout>
  )},
  { id: "copilot", section: "copilot", accent: "#a78bfa", content: () => (
    <SlideLayout tag="COPILOT" tagColor={B.copilot.c} title="GitHub Copilot — Setup" sub="File structure + key settings">
      <Code title="Project Structure" accent={B.copilot.c}>{`.github/
├── copilot-instructions.md  ← Always-on (tiny)
├── instructions/
│   ├── frontend.instructions.md (applyTo)
│   └── backend.instructions.md  (applyTo)
└── skills/
    ├── code-review/SKILL.md  ← On-demand
    └── test-gen/SKILL.md     ← On-demand
AGENTS.md                     ← Universal`}</Code>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 12 }}>{[
        { s: "Model", r: "Auto for routine", w: "Saves credits" },{ s: "Tabs", r: "Max 5 open", w: "−60% context" },
        { s: "Plan Mode", r: "Complex tasks", w: "Catches mistakes" },{ s: "Non-code", r: "Disable AI", w: "No wasted tokens" },
      ].map((c, i) => (
        <GlassCard key={i} delay={200 + i * 80} style={{ padding: "8px 12px" }} glow={B.copilot.c}><div style={{ fontWeight: 800, color: B.copilot.c, fontSize: 13 }}>{c.s}</div><div style={{ color: "#e2e8f0", fontSize: 13 }}>{c.r}</div><div style={{ fontSize: 11, color: "#64748b" }}>{c.w}</div></GlassCard>
      ))}</div>
    </SlideLayout>
  )},
  { id: "cursor", section: "cursor", accent: "#22d3ee", content: () => (
    <SlideLayout tag="CURSOR" tagColor={B.cursor.c} title="Cursor — Setup" sub="Modular .mdc rules with frontmatter">
      <Code title=".cursor/rules/testing.md — loads for test files only" accent={B.cursor.c}>{`---
description: Test conventions
globs: ["**/*.test.ts", "**/test_*.py"]
---
Vitest (unit), Playwright (E2E)
- Colocate tests next to source
- No DB mocking in E2E`}</Code>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 8, marginTop: 12 }}>{[
        { type: "Always", when: "Every req", cost: "🔴", c: "#ef4444" },{ type: "Globs", when: "Matching", cost: "🟢", c: "#22c55e" },
        { type: "Agent", when: "AI picks", cost: "🟢", c: "#22c55e" },{ type: "Manual", when: "You invoke", cost: "⚪", c: "#64748b" },
      ].map((r, i) => (
        <GlassCard key={i} delay={200 + i * 80} glow={r.c} style={{ padding: "10px", textAlign: "center" }}><div style={{ fontWeight: 800, color: r.c, fontSize: 15 }}>{r.type}</div><div style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}>{r.when}</div><div style={{ fontSize: 16, marginTop: 4 }}>{r.cost}</div></GlassCard>
      ))}</div>
      <Callout icon="⚡" color={B.cursor.c} delay={500}><Bld>Auto Mode</Bld> = free. <Bld>Cmd+K</Bld> for small edits — much cheaper than Agent Mode.</Callout>
    </SlideLayout>
  )},
  { id: "five-layers", section: "advanced", accent: "#c084fc", content: () => (
    <SlideLayout tag="ARCHITECTURE" tagColor="#c084fc" title="The 5-Layer Context Stack" sub="Teach the agent your project — broadest to most specific">
      {[
        { n: 1, name: "Instructions", desc: "Stack, naming, rules", tok: "~300t", when: "Always", c: "#ef4444" },
        { n: 2, name: "AGENTS.md", desc: "Architecture, build cmds", tok: "~500t", when: "In repo", c: "#fbbf24" },
        { n: 3, name: "Skills", desc: "Testing, deploy workflows", tok: "~500t", when: "On-demand", c: "#22c55e" },
        { n: 4, name: "@ / #file refs", desc: "Pin files per request", tok: "Variable", when: "Per-req", c: "#3b82f6" },
        { n: 5, name: "Cursor Globs", desc: "Pattern-scoped rules", tok: "~200t", when: "Matching", c: "#c084fc" },
      ].map((l, i) => (
        <GlassCard key={i} delay={i * 80} glow={l.c} style={{ marginBottom: 6, padding: "8px 14px" }}><div style={{ display: "flex", alignItems: "center", gap: 12 }}><div className="layer-num" style={{ "--lc": l.c }}>{l.n}</div><div style={{ flex: 1 }}><span style={{ fontWeight: 800, color: l.c }}>{l.name}</span><span style={{ color: "#94a3b8", fontSize: 13, marginLeft: 8 }}>{l.desc}</span></div><div style={{ textAlign: "right" }}><div style={{ fontFamily: "'Space Mono',monospace", fontWeight: 700, color: l.c, fontSize: 12 }}>{l.tok}</div><div style={{ fontSize: 10, color: "#64748b" }}>{l.when}</div></div></div></GlassCard>
      ))}
      <Callout icon="🔄" color="#c084fc" delay={500}><Bld>Retro Pattern:</Bld> Ask: "What confused you?" → improve AGENTS.md.</Callout>
    </SlideLayout>
  )},
  { id: "cheatsheet", section: "advanced", accent: "#fbbf24", content: () => (
    <SlideLayout tag="REFERENCE" tagColor="#fbbf24" title="Cheat Sheet" sub="Screenshot this slide">
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <GlassCard delay={100} className="no-hover"><div style={{ fontWeight: 800, color: "#f1f5f9", fontSize: 13, marginBottom: 8 }}>Config Files</div>{[
          ["copilot-instructions.md", "Copilot", "Every req"],["rules/*.md", "Cursor", "Frontmatter"],["SKILL.md", "Both", "On-demand"],["AGENTS.md", "Universal", "Always"],
        ].map(([f, t, w], i) => <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr auto auto", gap: 4, padding: "3px 0", borderBottom: "1px solid #1e293b", fontSize: 12 }}><code style={{ color: "#a78bfa", fontSize: 11 }}>{f}</code><span style={{ color: "#64748b" }}>{t}</span><span style={{ color: "#475569" }}>{w}</span></div>)}</GlassCard>
        <GlassCard delay={200} className="no-hover"><div style={{ fontWeight: 800, color: "#f1f5f9", fontSize: 13, marginBottom: 8 }}>Token Budgets</div>{[
          ["Always-on rules", "< 500 tokens"],["AGENTS.md", "< 1 page"],["Each skill", "< 500 tokens"],["Open tabs", "Max 5"],
        ].map(([w, t], i) => <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "3px 0", borderBottom: "1px solid #1e293b", fontSize: 12 }}><span style={{ color: "#cbd5e1" }}>{w}</span><span style={{ fontWeight: 700, color: "#4ade80", fontFamily: "'Space Mono',monospace" }}>{t}</span></div>)}</GlassCard>
      </div>
      <div className="stagger gradient-banner" style={{ "--d": "400ms" }}><strong>3-Second Test:</strong> Every request? · Failed 3×? · Shorter words?</div>
    </SlideLayout>
  )},
  { id: "end", section: "end", accent: "#fb923c", content: () => (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", position: "relative", zIndex: 1 }}>
      <h1 className="hero-title stagger" style={{ "--d": "0ms", fontSize: "clamp(36px, 6vw, 64px)" }}>Thank You</h1>
      <div className="stagger" style={{ "--d": "200ms", color: "#94a3b8", fontSize: 18, marginTop: 16 }}>Start with <Bld>3 quick wins</Bld> today:</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 16, width: "100%", maxWidth: 400 }}>{[
        { n: "1", t: "Close extra tabs", c: "#ef4444" },{ n: "2", t: "Add AGENTS.md", c: "#fbbf24" },{ n: "3", t: "Trim to 15 rules", c: "#22c55e" },
      ].map((item, i) => (
        <GlassCard key={i} delay={300 + i * 120} glow={item.c}><div style={{ display: "flex", alignItems: "center", gap: 12 }}><div className="rank-badge" style={{ "--rc": item.c }}>{item.n}</div><div style={{ fontWeight: 700, color: "#f1f5f9", fontSize: 16 }}>{item.t}</div></div></GlassCard>
      ))}</div>
      <div className="stagger" style={{ "--d": "700ms", display: "flex", gap: 12, marginTop: 32 }}><Tag color={B.copilot.c}>⬡ Copilot</Tag><Tag color={B.cursor.c}>⌘ Cursor</Tag><Tag color={B.claude.c}>◈ Claude</Tag></div>
    </div>
  )},
];

function AdminPanel({ slides, skippedSlides, toggleSkip, onClose, goToSlide }) {
  const secs = { intro: "Intro", tokens: "Tokens", config: "Configuration", optimize: "Optimization", metrics: "Metrics", copilot: "Copilot", cursor: "Cursor", advanced: "Advanced", end: "End" };
  let c = null;
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 1000 }}><div className="admin-overlay" onClick={onClose} /><div className="admin-drawer">
      <div className="admin-header"><div><div style={{ fontWeight: 800, fontSize: 16, color: "#f1f5f9" }}>Admin Panel</div><div style={{ fontSize: 12, color: "#64748b" }}>{skippedSlides.size} skipped · {slides.length - skippedSlides.size} active</div></div><button className="admin-close" onClick={onClose}>×</button></div>
      <div className="admin-body">{slides.map((s, idx) => {
        const isNew = s.section !== c; c = s.section; const skip = skippedSlides.has(s.id);
        return <div key={s.id}>{isNew && <div className="admin-section">{secs[s.section] || s.section}</div>}<div className={`admin-row ${skip ? "skipped" : ""}`}><button className={`admin-toggle ${skip ? "off" : "on"}`} onClick={() => toggleSkip(s.id)}>{skip ? "✕" : "✓"}</button><div className="admin-name" onClick={() => { goToSlide(idx); onClose(); }}>{s.id.replace(/-/g, " ").replace(/\b\w/g, x => x.toUpperCase())}</div><span className="admin-idx">{idx + 1}</span></div></div>;
      })}</div>
    </div></div>
  );
}

export default function App() {
  const [cur, setCur] = useState(0);
  const [skipped, setSkipped] = useState(new Set());
  const [showAdmin, setShowAdmin] = useState(false);
  const [dir, setDir] = useState(1);
  const [animKey, setAnimKey] = useState(0);
  const [goToOpen, setGoToOpen] = useState(false);
  const [goToVal, setGoToVal] = useState("");
  const touchRef = useRef(null);

  const active = allSlides.filter(s => !skipped.has(s.id));
  const activeIdx = active.findIndex(s => s === allSlides[cur]);
  const total = active.length;
  const slide = allSlides[cur];
  const progress = total > 1 ? (activeIdx / (total - 1)) * 100 : 0;
  const accent = slide.accent || "#a78bfa";

  const nav = useCallback((d) => {
    setDir(d); setCur(p => { let n = p + d; while (n >= 0 && n < allSlides.length && skipped.has(allSlides[n].id)) n += d; return (n < 0 || n >= allSlides.length) ? p : n; }); setAnimKey(k => k + 1);
  }, [skipped]);
  const goTo = useCallback((idx) => { setDir(idx > cur ? 1 : -1); setCur(idx); setAnimKey(k => k + 1); }, [cur]);

  useEffect(() => {
    const h = e => {
      if (showAdmin || goToOpen) { if (e.key === "Escape") { setShowAdmin(false); setGoToOpen(false); } return; }
      if (e.key === "ArrowRight" || e.key === " ") { e.preventDefault(); nav(1); }
      if (e.key === "ArrowLeft") { e.preventDefault(); nav(-1); }
      if (e.key === "a" || e.key === "A") setShowAdmin(true);
      if (e.key === "g" || e.key === "G") setGoToOpen(true);
    };
    window.addEventListener("keydown", h); return () => window.removeEventListener("keydown", h);
  }, [nav, showAdmin, goToOpen]);

  const handleGoTo = () => { const n = parseInt(goToVal, 10); if (n >= 1 && n <= allSlides.length) goTo(n - 1); setGoToVal(""); setGoToOpen(false); };

  return (
    <div style={{ width: "100%", height: "100vh", background: "#090d1a", fontFamily: "'Sora',system-ui,sans-serif", display: "flex", flexDirection: "column", overflow: "hidden", position: "relative", color: "#cbd5e1" }}
      onTouchStart={e => { touchRef.current = e.touches[0].clientX; }}
      onTouchEnd={e => { if (!touchRef.current) return; const d = e.changedTouches[0].clientX - touchRef.current; if (Math.abs(d) > 60) nav(d < 0 ? 1 : -1); touchRef.current = null; }}>

      <style>{`
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;600;700;800&family=Space+Mono:wght@400;700&family=JetBrains+Mono:wght@400;700&display=swap');
*{box-sizing:border-box;margin:0;padding:0}::-webkit-scrollbar{width:4px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:#1e293b;border-radius:4px}
.orb{position:absolute;border-radius:50%;filter:blur(100px);opacity:0.12;animation:orbFloat 20s ease-in-out infinite}.orb1{width:500px;height:500px;background:var(--clr);top:-10%;right:-10%}.orb2{width:350px;height:350px;background:var(--clr);bottom:-5%;left:-5%;animation-delay:-7s}.orb3{width:250px;height:250px;background:var(--clr);top:40%;left:30%;animation-delay:-14s}@keyframes orbFloat{0%,100%{transform:translate(0,0) scale(1)}33%{transform:translate(30px,-40px) scale(1.1)}66%{transform:translate(-20px,30px) scale(0.9)}}
.particle{position:absolute;width:var(--sz);height:var(--sz);left:var(--x);top:var(--y);background:var(--clr);border-radius:50%;opacity:0.3;animation:pFloat var(--dur) ease-in-out var(--del) infinite}@keyframes pFloat{0%,100%{transform:translateY(0) translateX(0);opacity:0.3}50%{transform:translateY(-30px) translateX(15px);opacity:0.6}}
.stagger{opacity:0;transform:translateY(16px);animation:staggerIn 0.55s cubic-bezier(0.22,1,0.36,1) forwards;animation-delay:var(--d,0ms)}@keyframes staggerIn{to{opacity:1;transform:translateY(0)}}
@keyframes slideR{from{opacity:0;transform:translateX(60px) scale(0.97)}to{opacity:1;transform:translateX(0) scale(1)}}@keyframes slideL{from{opacity:0;transform:translateX(-60px) scale(0.97)}to{opacity:1;transform:translateX(0) scale(1)}}.slide-anim{animation-duration:0.45s;animation-timing-function:cubic-bezier(0.22,1,0.36,1);animation-fill-mode:both}
.glass-card{background:rgba(15,23,42,0.55);border:1px solid rgba(148,163,184,0.08);border-radius:14px;padding:16px;backdrop-filter:blur(16px);position:relative;overflow:hidden;transition:transform 0.25s cubic-bezier(0.22,1,0.36,1),box-shadow 0.25s ease,border-color 0.25s ease}.glass-card::before{content:'';position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,rgba(255,255,255,0.06),transparent)}.glass-card::after{content:'';position:absolute;inset:-1px;border-radius:14px;background:radial-gradient(400px circle at 50% 0%,var(--glow,transparent) 0%,transparent 70%);opacity:0;transition:opacity 0.4s;pointer-events:none;z-index:0}.glass-card.hoverable:hover{transform:translateY(-3px) scale(1.01);border-color:rgba(148,163,184,0.15);box-shadow:0 8px 40px rgba(0,0,0,0.35),0 0 20px color-mix(in srgb,var(--glow,transparent) 15%,transparent)}.glass-card.hoverable:hover::after{opacity:0.12}.glass-card.no-hover:hover{transform:none;box-shadow:none}.glass-card>*{position:relative;z-index:1}
.card-header{display:flex;align-items:center;gap:10px;margin-bottom:10px}.card-icon{width:36px;height:36px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:18px;color:#fff;flex-shrink:0;box-shadow:0 4px 16px rgba(0,0,0,0.3)}.card-name{font-weight:800;color:#f1f5f9;font-size:14px}.card-date{font-size:11px;color:#64748b}.card-body{font-size:13px;color:#94a3b8;line-height:1.6;margin:0}
.tag{display:inline-block;padding:4px 12px;border-radius:8px;font-weight:700;font-size:12px;letter-spacing:0.3px;background:color-mix(in srgb,var(--tc) 12%,transparent);color:var(--tc);border:1px solid color-mix(in srgb,var(--tc) 20%,transparent);transition:transform 0.2s,box-shadow 0.2s}.tag:hover{transform:translateY(-2px);box-shadow:0 4px 12px color-mix(in srgb,var(--tc) 20%,transparent)}
.hero-title{font-size:clamp(30px,5vw,56px);font-weight:800;text-align:center;line-height:1.08;background:linear-gradient(135deg,#a78bfa,#22d3ee,#fb923c);-webkit-background-clip:text;-webkit-text-fill-color:transparent;filter:drop-shadow(0 0 40px rgba(167,139,250,0.15))}
.slide-tag{font-size:10px;letter-spacing:3px;text-transform:uppercase;font-weight:700;color:var(--stc);margin-bottom:6px}.slide-title{font-size:clamp(18px,3vw,28px);font-weight:800;color:#f1f5f9;line-height:1.15;text-shadow:0 2px 20px rgba(0,0,0,0.3)}.slide-sub{font-size:13px;color:#64748b;margin-top:4px}
.code-block{border-radius:12px;overflow:hidden;background:#0c1222;border:1px solid #1e293b;position:relative}.code-title{padding:8px 16px;font-size:11px;font-weight:600;color:#64748b;background:#0f172a}.code-pre{margin:0;padding:14px 16px;font-size:12px;line-height:1.65;font-family:'JetBrains Mono',monospace;color:#e2e8f0;overflow:auto;white-space:pre-wrap}.code-shine{position:absolute;top:0;right:0;width:120px;height:100%;background:linear-gradient(90deg,transparent,rgba(167,139,250,0.03));pointer-events:none}
.callout{padding:12px 16px;border-radius:12px;font-size:13px;line-height:1.6;display:flex;gap:10px;align-items:flex-start;margin-top:12px;background:color-mix(in srgb,var(--cc) 6%,#0f172a);border:1px solid color-mix(in srgb,var(--cc) 15%,transparent);box-shadow:inset 0 0 30px color-mix(in srgb,var(--cc) 4%,transparent)}.callout-icon{font-size:18px;flex-shrink:0}
.token-bar{display:flex;align-items:center;gap:8px;margin-bottom:5px}.token-label{width:130px;font-size:12px;color:#64748b;font-family:'JetBrains Mono',monospace}.token-track{flex:1;height:10px;border-radius:5px;background:#1e293b;overflow:hidden}.token-fill{height:100%;border-radius:5px;width:0;animation:barGrow 0.8s cubic-bezier(0.22,1,0.36,1) forwards;animation-delay:var(--d,0ms);box-shadow:0 0 10px color-mix(in srgb,currentColor 40%,transparent)}@keyframes barGrow{to{width:var(--tw)}}.token-val{width:44px;text-align:right;font-size:11px;font-weight:700;font-family:'Space Mono',monospace}
.num-stat{display:flex;flex-direction:column;align-items:center;padding:4px 0}
.problem-num{width:40px;height:40px;border-radius:12px;display:flex;align-items:center;justify-content:center;font-weight:900;font-size:20px;color:#fff;flex-shrink:0;background:linear-gradient(135deg,var(--pc),color-mix(in srgb,var(--pc) 60%,#000));box-shadow:0 4px 20px color-mix(in srgb,var(--pc) 30%,transparent)}
.compare-label{font-size:11px;font-weight:800;letter-spacing:1px;text-transform:uppercase;margin-bottom:8px}.compare-label.bad{color:#f87171}.compare-label.good{color:#4ade80}
.big-pct{font-size:32px;font-weight:900;font-family:'Space Mono',monospace;text-align:center;margin-top:12px;color:var(--bc);text-shadow:0 0 30px color-mix(in srgb,var(--bc) 25%,transparent)}
.math-num{font-size:26px;font-weight:900;font-family:'Space Mono',monospace}.arrow-morph{font-size:28px;color:#22d3ee;text-align:center;animation:arrowPulse 2s ease-in-out infinite}@keyframes arrowPulse{0%,100%{transform:translateX(0);opacity:1}50%{transform:translateX(6px);opacity:0.6}}
.impact-badge{font-size:10px;font-weight:800;padding:2px 8px;border-radius:6px;color:var(--ic);background:color-mix(in srgb,var(--ic) 12%,transparent);border:1px solid color-mix(in srgb,var(--ic) 20%,transparent)}
.rank-badge{width:30px;height:30px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-weight:900;font-size:13px;color:#fff;flex-shrink:0;background:var(--rc);box-shadow:0 4px 16px color-mix(in srgb,var(--rc) 30%,transparent)}
.impact-dots{display:flex;gap:3px}.impact-dots .dot{width:5px;height:16px;border-radius:3px;background:var(--dc);box-shadow:0 0 6px color-mix(in srgb,var(--dc) 30%,transparent)}
.prompt-card{border-radius:10px;padding:10px 12px}.prompt-card.bad{background:rgba(239,68,68,0.06);border:1px solid rgba(239,68,68,0.15)}.prompt-card.good{background:rgba(34,197,94,0.06);border:1px solid rgba(34,197,94,0.15)}.prompt-label{font-size:10px;font-weight:800;letter-spacing:1px;text-transform:uppercase;margin-bottom:6px;color:#64748b}.prompt-pre{margin:0;font-family:'JetBrains Mono',monospace;font-size:11px;line-height:1.5;white-space:pre-wrap;color:#cbd5e1}.save-badge{writing-mode:vertical-rl;text-orientation:mixed;transform:rotate(180deg);font-size:10px;font-weight:800;color:#4ade80;display:flex;align-items:center;padding:4px}
.tool-badge{font-size:10px;background:#1e293b;color:#64748b;padding:2px 8px;border-radius:4px}
.layer-num{width:30px;height:30px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:900;font-size:14px;color:#fff;flex-shrink:0;background:var(--lc);box-shadow:0 2px 12px color-mix(in srgb,var(--lc) 30%,transparent)}
.gradient-banner{margin-top:14px;padding:14px 20px;border-radius:12px;text-align:center;font-size:13px;color:#fff;line-height:1.6;background:linear-gradient(135deg,#a78bfa,#22d3ee,#fb923c);box-shadow:0 8px 32px rgba(167,139,250,0.2)}
.kbd{padding:3px 10px;border-radius:6px;background:#1e293b;border:1px solid #334155;font-family:'Space Mono',monospace;font-size:12px;color:#94a3b8;box-shadow:0 2px 0 #0f172a}
.pulse-hint{animation:pulseHint 2.5s ease-in-out infinite}@keyframes pulseHint{0%,100%{opacity:0.5}50%{opacity:1}}
.pdot{transition:all 0.3s cubic-bezier(0.22,1,0.36,1);cursor:pointer;border-radius:4px;flex-shrink:0}.pdot:hover{transform:scaleY(1.8);opacity:1!important}
.nav-btn{transition:all 0.2s cubic-bezier(0.22,1,0.36,1)}.nav-btn:hover:not(:disabled){transform:scale(1.1);box-shadow:0 4px 20px rgba(0,0,0,0.3);border-color:#334155;color:#f1f5f9}.nav-btn:active:not(:disabled){transform:scale(0.92)}
.hdr-btn{transition:all 0.15s}.hdr-btn:hover{background:#1e293b!important;color:#f1f5f9!important;border-color:#334155!important;transform:translateY(-1px)}
.admin-overlay{position:absolute;inset:0;background:rgba(0,0,0,0.6);backdrop-filter:blur(8px);animation:fadeIn 0.2s}@keyframes fadeIn{from{opacity:0}to{opacity:1}}.admin-drawer{position:absolute;right:0;top:0;bottom:0;width:380px;background:#0f172a;border-left:1px solid #1e293b;display:flex;flex-direction:column;animation:drawerIn 0.3s cubic-bezier(0.22,1,0.36,1);box-shadow:-8px 0 40px rgba(0,0,0,0.4)}@keyframes drawerIn{from{transform:translateX(100%)}to{transform:translateX(0)}}.admin-header{padding:16px 20px;border-bottom:1px solid #1e293b;display:flex;justify-content:space-between;align-items:center}.admin-close{width:32px;height:32px;border-radius:8px;border:1px solid #1e293b;background:#0f172a;color:#64748b;cursor:pointer;font-size:18px;display:flex;align-items:center;justify-content:center;transition:all 0.15s}.admin-close:hover{background:#1e293b;color:#f1f5f9}.admin-body{flex:1;overflow:auto;padding:12px 16px}.admin-section{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:3px;color:#475569;margin:16px 0 6px;padding-left:4px}.admin-row{display:flex;align-items:center;gap:10px;padding:8px 10px;border-radius:10px;margin-bottom:3px;background:rgba(15,23,42,0.5);border:1px solid #1e293b;transition:all 0.15s}.admin-row:hover{background:#1e293b;border-color:#334155}.admin-row.skipped{background:rgba(239,68,68,0.05);border-color:rgba(239,68,68,0.15)}.admin-toggle{width:24px;height:24px;border-radius:8px;border:2px solid;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:900;flex-shrink:0;transition:all 0.2s;padding:0}.admin-toggle.on{border-color:#22c55e;background:rgba(34,197,94,0.1);color:#22c55e}.admin-toggle.on:hover{background:#22c55e;color:#fff;box-shadow:0 0 12px rgba(34,197,94,0.3)}.admin-toggle.off{border-color:#ef4444;background:rgba(239,68,68,0.1);color:#ef4444}.admin-toggle.off:hover{background:#ef4444;color:#fff;box-shadow:0 0 12px rgba(239,68,68,0.3)}.admin-name{flex:1;font-size:13px;font-weight:600;color:#cbd5e1;cursor:pointer;transition:color 0.15s}.admin-name:hover{color:#f1f5f9}.admin-row.skipped .admin-name{text-decoration:line-through;color:#64748b}.admin-idx{font-size:11px;color:#475569;font-family:'Space Mono',monospace}
      `}</style>

      <AnimBg accent={accent} />
      <div style={{ height: 3, background: "#1e293b", flexShrink: 0, position: "relative", zIndex: 2 }}><div style={{ height: "100%", background: `linear-gradient(90deg,${accent},${accent}88)`, width: `${progress}%`, transition: "width 0.5s cubic-bezier(0.22,1,0.36,1)", boxShadow: `0 0 12px ${accent}44` }} /></div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 20px", borderBottom: "1px solid #1e293b15", flexShrink: 0, position: "relative", zIndex: 2, backdropFilter: "blur(12px)", background: "rgba(9,13,26,0.6)" }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: accent, textTransform: "uppercase", letterSpacing: 3 }}>{slide.section}</div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 13, fontFamily: "'Space Mono',monospace", color: "#475569" }}>{activeIdx + 1}/{total}</span>
          <button className="hdr-btn" onClick={() => setGoToOpen(true)} style={{ padding: "4px 12px", borderRadius: 8, border: "1px solid #1e293b", background: "transparent", cursor: "pointer", fontSize: 11, color: "#64748b", fontWeight: 700 }}>Go to</button>
          <button className="hdr-btn" onClick={() => setShowAdmin(true)} style={{ padding: "4px 12px", borderRadius: 8, border: "1px solid #1e293b", background: "transparent", cursor: "pointer", fontSize: 11, color: "#64748b", fontWeight: 700 }}>Admin</button>
        </div>
      </div>
      <div style={{ flex: 1, overflow: "hidden", position: "relative", zIndex: 1 }}><div key={animKey} className="slide-anim" style={{ animationName: dir > 0 ? "slideR" : "slideL", height: "100%", padding: "20px 32px 12px" }}>{slide.content()}</div></div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 20px 14px", flexShrink: 0, position: "relative", zIndex: 2, backdropFilter: "blur(12px)", background: "rgba(9,13,26,0.6)" }}>
        <button className="nav-btn" onClick={() => nav(-1)} disabled={cur === 0} style={{ width: 42, height: 42, borderRadius: 12, border: "1px solid #1e293b", background: "rgba(15,23,42,0.7)", cursor: cur === 0 ? "not-allowed" : "pointer", fontSize: 20, display: "flex", alignItems: "center", justifyContent: "center", opacity: cur === 0 ? 0.2 : 1, color: "#94a3b8" }}>←</button>
        <div style={{ display: "flex", gap: 3, alignItems: "flex-end", flexWrap: "wrap", justifyContent: "center", maxWidth: "65%" }}>
          {allSlides.map((s, i) => <div key={i} className="pdot" onClick={() => goTo(i)} style={{ width: i === cur ? 22 : 6, height: i === cur ? 10 : skipped.has(s.id) ? 4 : 6, background: skipped.has(s.id) ? "#7f1d1d" : i === cur ? accent : "#1e293b", opacity: skipped.has(s.id) ? 0.5 : i === cur ? 1 : 0.4, boxShadow: i === cur ? `0 0 12px ${accent}66` : "none" }} />)}
        </div>
        <button className="nav-btn" onClick={() => nav(1)} disabled={cur === allSlides.length - 1} style={{ width: 42, height: 42, borderRadius: 12, border: "1px solid #1e293b", background: "rgba(15,23,42,0.7)", cursor: cur === allSlides.length - 1 ? "not-allowed" : "pointer", fontSize: 20, display: "flex", alignItems: "center", justifyContent: "center", opacity: cur === allSlides.length - 1 ? 0.2 : 1, color: "#94a3b8" }}>→</button>
      </div>

      {goToOpen && <div style={{ position: "fixed", inset: 0, zIndex: 999, display: "flex", alignItems: "center", justifyContent: "center" }}><div onClick={() => setGoToOpen(false)} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(6px)" }} /><div style={{ position: "relative", background: "#0f172a", border: "1px solid #1e293b", borderRadius: 18, padding: 24, boxShadow: "0 20px 60px rgba(0,0,0,0.5)", width: 280, animation: "staggerIn 0.25s cubic-bezier(0.22,1,0.36,1)" }}><div style={{ fontWeight: 800, fontSize: 16, color: "#f1f5f9", marginBottom: 14 }}>Go to slide</div><div style={{ display: "flex", gap: 10 }}><input autoFocus type="number" min={1} max={allSlides.length} value={goToVal} onChange={e => setGoToVal(e.target.value)} onKeyDown={e => e.key === "Enter" && handleGoTo()} placeholder={`1–${allSlides.length}`} style={{ flex: 1, padding: "10px 14px", borderRadius: 10, border: "1px solid #1e293b", background: "#090d1a", color: "#f1f5f9", fontSize: 18, fontFamily: "'Space Mono',monospace", outline: "none" }} /><button onClick={handleGoTo} style={{ padding: "10px 18px", borderRadius: 10, background: "linear-gradient(135deg,#7c3aed,#a78bfa)", color: "#fff", border: "none", cursor: "pointer", fontWeight: 800, fontSize: 14 }}>Go</button></div></div></div>}
      {showAdmin && <AdminPanel slides={allSlides} skippedSlides={skipped} toggleSkip={id => setSkipped(p => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n; })} onClose={() => setShowAdmin(false)} goToSlide={goTo} />}
    </div>
  );
}
