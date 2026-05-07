import { useState, useEffect, useCallback, useRef, useMemo } from "react";

/* ═══ THEMES ═══ */
const TH = {
  golden: { name:"Golden hour",icon:"☀",bg:"#faf6ef",surface:"#f5eed9",surfAlt:"#efe4c8",elev:"#ffffff",border:"#d4b896",borderL:"#e8dcc4",tp:"#1a1008",ts:"#3d3226",tm:"#6b5c4d",accent:"#d48f00",accentAlt:"#a84545",accentW:"#d4b896",accentD:"#2e2318",code:"#2e2318",codeBd:"#d4b89655",good:"#2f6b14",bad:"#a84545",glow:"rgba(244,169,0,0.07)",tagBg:"rgba(244,169,0,0.12)",tagBd:"rgba(244,169,0,0.28)",particle:"#f4a900",particleAlt:"#c1666b",blobA:"rgba(244,169,0,0.08)",blobB:"rgba(193,102,107,0.06)" },
  desert: { name:"Desert rose",icon:"🌸",bg:"#faf5f1",surface:"#f3ebe4",surfAlt:"#e8d5c4",elev:"#ffffff",border:"#d4a5a5",borderL:"#e8d5c4",tp:"#1e0e16",ts:"#3a2230",tm:"#6b4558",accent:"#a0604e",accentAlt:"#4a1830",accentW:"#d4a5a5",accentD:"#3a1525",code:"#2a1520",codeBd:"#d4a5a555",good:"#2a7048",bad:"#a0604e",glow:"rgba(184,125,109,0.07)",tagBg:"rgba(93,46,70,0.10)",tagBd:"rgba(93,46,70,0.24)",particle:"#d4a5a5",particleAlt:"#5d2e46",blobA:"rgba(184,125,109,0.07)",blobB:"rgba(93,46,70,0.05)" },
  stage: { name:"Stage light",icon:"🎯",bg:"#f4f1ec",surface:"#e8e4dc",surfAlt:"#ddd8ce",elev:"#ffffff",border:"#b8b0a0",borderL:"#d0c8b8",tp:"#0a0a08",ts:"#1a1a16",tm:"#4a4840",accent:"#c45500",accentAlt:"#8b1a1a",accentW:"#d4c4a8",accentD:"#0a0a08",code:"#141210",codeBd:"#b8b0a044",good:"#1a6830",bad:"#b82020",glow:"rgba(196,85,0,0.08)",tagBg:"rgba(196,85,0,0.10)",tagBd:"rgba(196,85,0,0.30)",particle:"#c45500",particleAlt:"#8b1a1a",blobA:"rgba(196,85,0,0.06)",blobB:"rgba(139,26,26,0.04)" },
  midnight: { name:"Midnight galaxy",icon:"🌙",bg:"#1a1228",surface:"#2b1e3e",surfAlt:"#362952",elev:"#2b1e3e",border:"#4a4e8f",borderL:"#3d3560",tp:"#e6e6fa",ts:"#a490c2",tm:"#7a6b99",accent:"#a490c2",accentAlt:"#7c7cc9",accentW:"#c4b5db",accentD:"#e6e6fa",code:"#1a1228",codeBd:"#4a4e8f55",good:"#7cc9a4",bad:"#c97c8a",glow:"rgba(164,144,194,0.08)",tagBg:"rgba(164,144,194,0.12)",tagBd:"rgba(164,144,194,0.25)",particle:"#a490c2",particleAlt:"#7c7cc9",blobA:"rgba(164,144,194,0.08)",blobB:"rgba(124,124,201,0.06)" },
};
const FONT = "'Libre Baskerville','Georgia',serif";
const FBODY = "'Source Sans 3','Segoe UI',sans-serif";
const FMONO = "'JetBrains Mono','Fira Code',monospace";
const BR = { copilot:{c:"#6e40c9",n:"GitHub Copilot"}, cursor:{c:"#0891b2",n:"Cursor"}, claude:{c:"#d97706",n:"Claude Code"} };

/* ═══ ANIMATED BACKGROUND — persistent across all slides ═══ */
function AnimBg({ t }) {
  const particles = useMemo(() => Array.from({length:24},(_,i)=>({
    id:i, x:5+Math.random()*90, y:5+Math.random()*90,
    sz:2+Math.random()*4, dur:8+Math.random()*14, del:-Math.random()*10,
    drift:20+Math.random()*40, color:Math.random()>0.5?'var(--pa)':'var(--pb)',
    shape:['circle','diamond','ring','dot'][Math.floor(Math.random()*4)],
  })),[]);
  const shapes = useMemo(() => Array.from({length:6},(_,i)=>({
    id:i, x:10+Math.random()*80, y:10+Math.random()*80,
    sz:30+Math.random()*60, rot:Math.random()*360, dur:20+Math.random()*15,
    del:-Math.random()*12, type:['tri','hex','cross','square'][i%4],
  })),[]);
  return (
    <div className="anim-bg" style={{"--pa":t.particle,"--pb":t.particleAlt,"--ba":t.blobA,"--bb":t.blobB}}>
      <div className="blob blob-a"/><div className="blob blob-b"/><div className="blob blob-c"/>
      <svg className="grid-svg"><defs><pattern id="gp" width="50" height="50" patternUnits="userSpaceOnUse"><path d="M50 0L0 0 0 50" fill="none" stroke="currentColor" strokeWidth="0.4"/></pattern></defs><rect width="100%" height="100%" fill="url(#gp)"/></svg>
      {particles.map(p=>(
        <div key={p.id} className={`mote mote-${p.shape}`} style={{"--mx":`${p.x}%`,"--my":`${p.y}%`,"--msz":`${p.sz}px`,"--mdur":`${p.dur}s`,"--mdel":`${p.del}s`,"--mdrift":`${p.drift}px`,"--mc":p.color}}/>
      ))}
      {shapes.map(s=>(
        <div key={s.id} className={`geo geo-${s.type}`} style={{"--gx":`${s.x}%`,"--gy":`${s.y}%`,"--gsz":`${s.sz}px`,"--grot":`${s.rot}deg`,"--gdur":`${s.dur}s`,"--gdel":`${s.del}s`,"--gc":t.particle+"18"}}/>
      ))}
    </div>
  );
}

/* ═══ ANIMATED COUNTER ═══ */
function Counter({end,prefix="",suffix="",dur=1200,color,t,sub}){
  const ref=useRef(null);const [val,setVal]=useState(0);
  useEffect(()=>{
    const obs=new IntersectionObserver(([e])=>{if(e.isIntersecting){
      const start=performance.now();const numEnd=parseFloat(String(end).replace(/[^0-9.-]/g,''));
      const step=(now)=>{const p=Math.min((now-start)/dur,1);const ease=1-Math.pow(1-p,3);setVal(Math.round(numEnd*ease));if(p<1)requestAnimationFrame(step);};
      requestAnimationFrame(step);obs.disconnect();
    }},{threshold:0.5});if(ref.current)obs.observe(ref.current);return()=>obs.disconnect();
  },[end,dur]);
  return <div ref={ref} className="counter-wrap stagger" style={{"--d":"200ms"}}><span className="counter-val" style={{color:color||t.accent,fontFamily:FMONO}}>{prefix}{typeof end==='string'&&end.includes('.')?val.toFixed(1):val}{suffix}</span>{sub&&<span className="counter-sub" style={{color:t.tm,fontFamily:FBODY}}>{sub}</span>}</div>;
}

/* ═══ ATOMS ═══ */
function Tag({children,t}){return <span className="tag-anim" style={{"--tc":t.accentD,"--tbg":t.tagBg,"--tbd":t.tagBd,fontWeight:t.name==="Stage light"?800:600,fontSize:t.name==="Stage light"?13:12}}>{children}</span>;}
function B({children,t}){return <strong style={{fontWeight:t.name==="Stage light"?900:700,color:t.tp}}>{children}</strong>;}
function Card({children,t,delay=0,style:s}){return <div className="card stagger" style={{"--d":`${delay}ms`,"--glow":t.glow,background:t.elev,border:`1px solid ${t.borderL}`,borderRadius:12,padding:16,...s}}>{children}</div>;}
function Code({title,children,t}){return <div className="code-block stagger" style={{"--d":"120ms",border:`1px solid ${t.codeBd}`}}>{title&&<div className="code-title" style={{background:t.surface,color:t.tm,fontFamily:FBODY}}>{title}</div>}<pre className="code-pre" style={{background:t.code,color:t.name==="Midnight galaxy"?"#e6e6fa":"#f1ece2",fontFamily:FMONO}}>{children}</pre><div className="code-scanline"/></div>;}
function Callout({icon="✦",color,children,t,delay=300}){const c=color||t.accent;return <div className="callout stagger" style={{"--d":`${delay}ms`,"--cc":c,fontFamily:FBODY,color:t.tp}}><span className="callout-pulse">{icon}</span><div>{children}</div></div>;}

function SL({tag,title,sub,t,children}){const isStage=t.name==="Stage light";return(
  <div style={{display:"flex",flexDirection:"column",height:"100%",position:"relative",zIndex:1}}>
    <div className="stagger" style={{"--d":"0ms",marginBottom:14}}>
      {tag&&<div className="slide-tag" style={{color:t.accent,fontFamily:FBODY,fontWeight:isStage?800:700,fontSize:isStage?11:10}}>{tag}</div>}
      <h2 className="title-reveal" style={{fontSize:isStage?"clamp(20px,3.2vw,30px)":"clamp(18px,3vw,26px)",fontWeight:isStage?900:700,color:t.tp,lineHeight:1.15,margin:0,fontFamily:FONT}}>{title}</h2>
      {sub&&<p style={{fontSize:isStage?14:13,color:t.ts,margin:"4px 0 0",fontFamily:FBODY,fontWeight:isStage?600:400}}>{sub}</p>}
    </div>
    <div style={{flex:1,overflow:"auto",paddingBottom:8}}>{children}</div>
  </div>
);}

function TokenBar({label,tokens,max,color,t,delay=0}){return(
  <div className="stagger" style={{"--d":`${delay}ms`,display:"flex",alignItems:"center",gap:8,marginBottom:5}}>
    <span style={{width:130,fontSize:12,color:t.tm,fontFamily:FMONO}}>{label}</span>
    <div className="bar-track" style={{background:t.surface}}><div className="bar-fill" style={{"--tw":`${(tokens/max)*100}%`,background:color}}/></div>
    <span style={{width:44,textAlign:"right",fontSize:11,fontWeight:700,fontFamily:FMONO,color}}>{tokens}</span>
  </div>
);}

/* ═══ SLIDES ═══ */
function makeSlides(t){return[
  {id:"title",section:"intro",content:()=>(
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",height:"100%",position:"relative",zIndex:1}}>
      <div className="stagger" style={{"--d":"0ms",fontSize:11,letterSpacing:7,textTransform:"uppercase",color:t.tm,fontWeight:600,marginBottom:18,fontFamily:FBODY}}>Workshop · 2026</div>
      <h1 className="hero-title stagger" style={{"--d":"100ms",fontFamily:FONT,color:t.tp,fontWeight:t.name==="Stage light"?900:700}}>Optimising Tokens &<br/>AI Coding Agents</h1>
      <p className="stagger" style={{"--d":"250ms",color:t.ts,textAlign:"center",fontSize:15,marginTop:18,fontFamily:FBODY}}>A practical guide to getting more from</p>
      <div className="stagger" style={{"--d":"400ms",display:"flex",gap:10,marginTop:12}}><Tag t={t}>⬡ Copilot</Tag><Tag t={t}>⌘ Cursor</Tag><Tag t={t}>◈ Claude</Tag></div>
      <div className="stagger pulse-hint" style={{"--d":"650ms",marginTop:44,display:"flex",alignItems:"center",gap:8,color:t.tm,fontSize:13,fontFamily:FBODY}}>
        <span>Press</span><kbd className="kbd-anim" style={{background:t.surface,border:`1px solid ${t.borderL}`,color:t.ts,fontFamily:FMONO}}>→</kbd><span>to begin</span>
      </div>
    </div>
  )},

  {id:"why-now",section:"intro",content:()=>(
    <SL tag="URGENT" title="Why This Matters Right Now" sub="The billing earthquake of June 2026" t={t}>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
        <Card t={t} delay={100}><div style={{fontWeight:700,color:BR.copilot.c,fontSize:14,marginBottom:6,fontFamily:FBODY}}>⬡ {BR.copilot.n}</div><div style={{fontSize:11,color:t.tm,marginBottom:8,fontFamily:FBODY}}>June 1, 2026</div><p style={{fontSize:13,color:t.ts,margin:0,lineHeight:1.6,fontFamily:FBODY}}><B t={t}>Request → token billing.</B> 1 credit = $0.01. Pro = $10/mo.</p></Card>
        <Card t={t} delay={200}><div style={{fontWeight:700,color:BR.cursor.c,fontSize:14,marginBottom:6,fontFamily:FBODY}}>⌘ {BR.cursor.n}</div><div style={{fontSize:11,color:t.tm,marginBottom:8,fontFamily:FBODY}}>Credit pool</div><p style={{fontSize:13,color:t.ts,margin:0,lineHeight:1.6,fontFamily:FBODY}}>Pro = <B t={t}>$20/mo</B>. Sonnet 4 ≈ <B t={t}>225 req</B> / $20.</p></Card>
      </div>
      <Callout icon="⚡" color={t.accentAlt} t={t} delay={400}>Copilot cost <B t={t}>nearly doubled</B> since Jan 2026. They paused signups.</Callout>
    </SL>
  )},

  {id:"tokens",section:"tokens",content:()=>(
    <SL tag="FUNDAMENTALS" title="What Is a Token?" sub="The currency your AI agent spends" t={t}>
      <Code t={t}>{`"optimization"          →  3 tokens
"const x = await f()"  → 10 tokens
A 20-line function      → ~150 tokens
Your instructions file  → 300–2000 tokens  ← EVERY request`}</Code>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12,marginTop:16}}>
        <Card t={t} delay={200}><Counter end={2.5} prefix="$" suffix="" dur={1000} color={t.accentAlt} t={t} sub="Input / 1M tokens"/></Card>
        <Card t={t} delay={300}><Counter end={15} prefix="$" dur={1000} color={t.accent} t={t} sub="Output / 1M tokens"/></Card>
        <Card t={t} delay={400}><Counter end={6} suffix="×" dur={800} t={t} sub="Output costs more"/></Card>
      </div>
      <Callout t={t} delay={500}>Output tokens cost <B t={t}>3–6× more</B>. Shorter responses = real savings.</Callout>
    </SL>
  )},

  {id:"anatomy",section:"tokens",content:()=>(
    <SL tag="DEEP DIVE" title="Anatomy of One Request" sub="The meter starts before you even ask" t={t}>
      <Card t={t} delay={80} style={{background:t.code,border:`1px solid ${t.codeBd}`,padding:"16px 18px"}}>
        <div style={{fontSize:11,letterSpacing:2,color:t.tm,marginBottom:10,textTransform:"uppercase",fontFamily:FBODY}}>Input — what gets sent</div>
        {[{l:"System prompt",v:500,c:"#c1666b",d:150},{l:"Instructions",v:300,c:"#f4a900",d:200},{l:"Rules/skills",v:500,c:"#2d8b8b",d:250},{l:"Open tabs",v:2000,c:"#b87d6d",d:300},{l:"Current file",v:1000,c:"#5a8a3c",d:350},{l:"Your question",v:50,c:"#a490c2",d:400}].map((b,i)=>
          <TokenBar key={i} label={b.l} tokens={b.v} max={4500} color={b.c} t={{...t,tm:t.name==="Midnight galaxy"?"#7a6b99":"#9a8b7a",surface:t.name==="Midnight galaxy"?"#362952":"#3e3630"}} delay={b.d}/>
        )}
        <div style={{borderTop:`1px solid ${t.accent}22`,margin:"10px 0 8px",paddingTop:10}}>
          <div style={{fontSize:11,letterSpacing:2,color:t.accent,marginBottom:8,textTransform:"uppercase",fontFamily:FBODY}}>Output (3–6× pricier!)</div>
          <TokenBar label="Agent response" tokens={2000} max={4500} color={t.accent} t={{...t,tm:t.name==="Midnight galaxy"?"#7a6b99":"#9a8b7a",surface:t.name==="Midnight galaxy"?"#362952":"#3e3630"}} delay={450}/>
        </div>
      </Card>
    </SL>
  )},

  {id:"problems",section:"tokens",content:()=>(
    <SL tag="PROBLEMS" title="The 3 Costs of Bloated Context" sub="Slower, dumber, pricier" t={t}>
      {[{n:"1",title:"Context squeeze",c:t.accentAlt,d:"Rules take 25% of window → 25% less brain for code."},{n:"2",title:"Lost in the middle",c:t.accent,d:"AI remembers top & bottom. Rule #47 gets ignored."},{n:"3",title:"Latency & cost",c:t.accentD,d:"More tokens = slower TTFT and higher bills."}].map((p,i)=>(
        <Card key={i} t={t} delay={i*110} style={{marginBottom:10}}>
          <div style={{display:"flex",gap:14,alignItems:"flex-start"}}>
            <div className="num-badge pulse-border" style={{"--nc":p.c}}>{p.n}</div>
            <div><div style={{fontWeight:700,color:p.c,fontSize:15,marginBottom:3,fontFamily:FONT}}>{p.title}</div><div style={{fontSize:13,color:t.ts,lineHeight:1.6,fontFamily:FBODY}}>{p.d}</div></div>
          </div>
        </Card>
      ))}
    </SL>
  )},

  {id:"instructions",section:"config",content:()=>(
    <SL tag="CONFIG" title="Instructions Files" sub="Loaded EVERY request. Write instructions, not essays." t={t}>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
        <Card t={t} delay={100} style={{borderColor:`${t.bad}30`}}>
          <div className="compare-label" style={{color:t.bad}}>❌ Verbose — 45 tokens</div>
          <Code t={t}>{`It is strongly recommended
that developers use TypeScript
interfaces rather than type
aliases when defining public
API contracts…`}</Code>
        </Card>
        <Card t={t} delay={200} style={{borderColor:`${t.good}30`}}>
          <div className="compare-label" style={{color:t.good}}>✅ Dense — 9 tokens</div>
          <Code t={t}>{`Prefer interface over type
for public APIs.



  80% fewer tokens ↗`}</Code>
        </Card>
      </div>
      <Callout t={t} delay={350}><B t={t}>Rule of Three:</B> Only add after AI fails <B t={t}>3 times</B>.</Callout>
    </SL>
  )},

  {id:"template",section:"config",content:()=>(
    <SL tag="TEMPLATE" title="The Perfect Instructions File" sub="copilot-instructions.md · .cursor/rules/general.md" t={t}>
      <Code title="copilot-instructions.md — ~200 tokens" t={t}>{`## Project: Hireflow — AI Resume Search
## Stack: FastAPI + React + PostgreSQL + Pinecone

## Standards
- Python: type hints, docstrings on public APIs
- TypeScript: strict mode, no \`any\`

## Do Not Suggest
- Changes to migration files
- Edits to .env or config files`}</Code>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12,marginTop:14}}>
        <Card t={t} delay={200}><Counter end={500} prefix="<" dur={900} color={t.good} t={t} sub="tokens max always-on"/></Card>
        <Card t={t} delay={300}><Counter end={15} dur={700} t={t} sub="rules maximum"/></Card>
        <Card t={t} delay={400}><Counter end={100} suffix="×" dur={800} color={t.accentAlt} t={t} sub="daily cost multiplier"/></Card>
      </div>
    </SL>
  )},

  {id:"skills",section:"config",content:()=>(
    <SL tag="GAME CHANGER" title="Skills — On-Demand Expertise" sub="Biggest token saver you have" t={t}>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
        <Card t={t} delay={100}><div style={{fontWeight:700,color:t.bad,fontSize:14,marginBottom:5,fontFamily:FONT}}>Always-on</div><div style={{color:t.tm,fontSize:13,fontFamily:FBODY}}>Menu every customer sees</div><Counter end={100} suffix="%" dur={800} color={t.bad} t={t} sub="of requests"/></Card>
        <Card t={t} delay={200}><div style={{fontWeight:700,color:t.good,fontSize:14,marginBottom:5,fontFamily:FONT}}>On-demand</div><div style={{color:t.tm,fontSize:13,fontFamily:FBODY}}>Recipe opened only when needed</div><Counter end={20} suffix="%" dur={800} color={t.good} t={t} sub="of requests"/></Card>
      </div>
      <Card t={t} delay={350} style={{marginTop:14}}>
        <div style={{fontSize:11,letterSpacing:2,color:t.tm,textTransform:"uppercase",marginBottom:8,fontFamily:FBODY}}>Token math — 100 requests/day</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr auto 1fr",gap:12,alignItems:"center"}}>
          <div style={{textAlign:"center"}}><div style={{fontSize:11,color:t.bad,fontFamily:FBODY}}>All in instructions</div><Counter end={200000} dur={1200} color={t.bad} t={t} sub="tokens/day"/></div>
          <div className="arrow-morph" style={{fontSize:24,color:t.accent}}>→</div>
          <div style={{textAlign:"center"}}><div style={{fontSize:11,color:t.good,fontFamily:FBODY}}>Rules + Skills</div><Counter end={40000} dur={1200} color={t.good} t={t} sub="80% saved"/></div>
        </div>
      </Card>
    </SL>
  )},

  {id:"agents-md",section:"config",content:()=>(
    <SL tag="UNIVERSAL" title="AGENTS.md" sub="One file. All agents." t={t}>
      <div className="stagger" style={{"--d":"80ms",display:"flex",gap:8,marginBottom:14,flexWrap:"wrap"}}><Tag t={t}>Copilot ✓</Tag><Tag t={t}>Cursor ✓</Tag><Tag t={t}>Claude ✓</Tag><Tag t={t}>Codex ✓</Tag></div>
      <Code title="AGENTS.md — project root" t={t}>{`# Architecture
Monorepo: React + FastAPI + PostgreSQL
Search: Pinecone + BM25 hybrid (RRF)

# Build & Test
Backend:  pip install -e . && pytest
Frontend: pnpm install && pnpm test

# Critical Rules
- Never modify migration files
- Secrets in .env, never committed`}</Code>
      <Callout icon="📘" t={t} delay={300}>README = humans. <B t={t}>AGENTS.md</B> = AI. Version-controlled.</Callout>
    </SL>
  )},

  {id:"configs",section:"config",content:()=>(
    <SL tag="HIDDEN GEMS" title="Configs You're Missing" t={t}>
      {[{icon:"🚫",title:"Content exclusion",impact:"HIGH",d:"Exclude XML, YAML, vendor at org level."},{icon:"📁",title:".gitignore hygiene",impact:"HIGH",d:"Stop indexing node_modules, dist, .env."},{icon:"🎯",title:"Cursor globs",impact:"HIGH",d:"Rules load ONLY for matching patterns."},{icon:"🔌",title:"MCP servers",impact:"MED",d:"Connect DB/CI directly to agent."},{icon:"🪝",title:"Hooks",impact:"MED",d:"Auto-test after actions — zero tokens."}].map((item,i)=>(
        <Card key={i} t={t} delay={i*70} style={{marginBottom:8}}>
          <div style={{display:"flex",gap:12,alignItems:"flex-start"}}>
            <span className="icon-float" style={{fontSize:20}}>{item.icon}</span>
            <div style={{flex:1}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <span style={{fontWeight:700,color:t.tp,fontSize:14,fontFamily:FONT}}>{item.title}</span>
                <span className="impact-pill" style={{"--ic":item.impact==="HIGH"?t.bad:t.accent}}>{item.impact}</span>
              </div>
              <div style={{fontSize:13,color:t.ts,marginTop:3,lineHeight:1.5,fontFamily:FBODY}}>{item.d}</div>
            </div>
          </div>
        </Card>
      ))}
    </SL>
  )},

  {id:"10-ways",section:"optimize",content:()=>(
    <SL tag="ACTION PLAN" title="10 Ways to Cut Token Burn" sub="Ranked by impact" t={t}>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
        {[{n:1,x:"Close tabs → max 5",e:"1 min",s:5},{n:2,x:"Trim to ≤15 rules",e:"30 min",s:5},{n:3,x:"Workflows → Skills",e:"1 hr",s:5},{n:4,x:"Scoped globs",e:"1 hr",s:5},{n:5,x:"Specific prompts",e:"Ongoing",s:4},{n:6,x:"Add AGENTS.md",e:"30 min",s:4},{n:7,x:"Auto model routine",e:"1 min",s:4},{n:8,x:"Disable non-code AI",e:"5 min",s:3},{n:9,x:"Plan Mode first",e:"Ongoing",s:3},{n:10,x:"Weekly audit",e:"15 min",s:3}].map((item,i)=>(
          <Card key={i} t={t} delay={i*45} style={{padding:"8px 12px"}}>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <div className="num-badge" style={{"--nc":item.s>=5?t.bad:item.s>=4?t.accent:t.accentD}}>{item.n}</div>
              <div style={{flex:1}}><div style={{fontWeight:600,color:t.tp,fontSize:13,fontFamily:FBODY}}>{item.x}</div><div style={{fontSize:11,color:t.tm,fontFamily:FBODY}}>{item.e}</div></div>
              <div className="impact-dots">{Array.from({length:item.s}).map((_,j)=><div key={j} className="idot" style={{"--dc":item.s>=5?t.bad:item.s>=4?t.accent:t.accentD}}/>)}</div>
            </div>
          </Card>
        ))}
      </div>
    </SL>
  )},

  {id:"prompts",section:"optimize",content:()=>(
    <SL tag="PRO TIP" title="Better Context = Less Thinking" sub="Vague prompts burn output tokens" t={t}>
      {[{bad:`"Fix the auth"`,good:`"In auth.ts:42, JWT refresh\nfails >24hrs. Fix expiry."`,save:"~70%"},{bad:`"Make API faster"`,good:`"Redis cache GET /users/:id\n5min TTL, lib/redis.ts"`,save:"~60%"},{bad:`"Write tests"`,good:`"Test processPayment() per\npattern in order.test.ts"`,save:"~50%"}].map((p,i)=>(
        <div key={i} className="stagger" style={{"--d":`${i*100}ms`,display:"grid",gridTemplateColumns:"1fr 1fr auto",gap:10,marginBottom:10,alignItems:"stretch"}}>
          <div className="prompt-card bad-card" style={{"--pc":t.bad}}><div className="compare-label" style={{color:t.bad}}>❌ Vague</div><pre className="prompt-pre" style={{fontFamily:FMONO,color:t.ts}}>{p.bad}</pre></div>
          <div className="prompt-card good-card" style={{"--pc":t.good}}><div className="compare-label" style={{color:t.good}}>✅ Specific</div><pre className="prompt-pre" style={{fontFamily:FMONO,color:t.ts}}>{p.good}</pre></div>
          <div className="save-vert" style={{color:t.good,fontFamily:FBODY}}>{p.save} saved</div>
        </div>
      ))}
    </SL>
  )},

  {id:"measuring",section:"metrics",content:()=>(
    <SL tag="METRICS" title={`"performance.now()" for Agents`} sub="6 ways to get real numbers" t={t}>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
        {[{n:1,title:"VS Code status bar",tool:"Copilot",d:"Click icon → credits, limits."},{n:2,title:"Billing dashboard",tool:"Copilot",d:"github.com/settings/billing"},{n:3,title:"Token tracker ext.",tool:"VS Code",d:'"AI Engineering Fluency"'},{n:4,title:"Manual stopwatch",tool:"Any",d:"Credits before → after = cost."},{n:5,title:"Metrics API",tool:"Admin",d:"GET /orgs/{org}/copilot/usage"},{n:6,title:"A/B test",tool:"Team",d:"Default vs optimized week."}].map((m,i)=>(
          <Card key={i} t={t} delay={i*70} style={{padding:"10px 14px"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
              <span style={{fontWeight:700,color:t.accent,fontSize:13,fontFamily:FONT}}>#{m.n} {m.title}</span>
              <span className="tool-pill" style={{background:t.surface,color:t.tm,fontFamily:FBODY}}>{m.tool}</span>
            </div>
            <div style={{fontSize:12,color:t.ts,lineHeight:1.5,fontFamily:FBODY}}>{m.d}</div>
          </Card>
        ))}
      </div>
    </SL>
  )},

  {id:"proof",section:"metrics",content:()=>(
    <SL tag="EVIDENCE" title="Proof in Numbers" sub="Real measurements" t={t}>
      {[{a:"Instructions 300→15",r:"~80% fewer tokens",s:"Teams"},{a:"Tabs 15→5",r:"~60% less context",s:"GitHub"},{a:"Scoped globs",r:"20% vs 100% load",s:"Cursor"},{a:"Content exclusion",r:"50% less indexed",s:"Enterprise"},{a:"Auto vs premium",r:"4–10× per dollar",s:"Cursor"},{a:"Prompt narrowing",r:"14.9M→5M (66%)",s:"GitHub"},{a:"Faros measurement",r:"+210% tasks/dev",s:"22K devs"}].map((row,i)=>(
        <Card key={i} t={t} delay={i*55} style={{marginBottom:6,padding:"8px 14px"}}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr auto",gap:8,alignItems:"center"}}>
            <div style={{fontSize:13,color:t.tp,fontWeight:600,fontFamily:FBODY}}>{row.a}</div>
            <div style={{fontSize:13,color:t.good,fontWeight:700,fontFamily:FMONO}}>{row.r}</div>
            <div style={{fontSize:10,color:t.tm,fontFamily:FBODY}}>{row.s}</div>
          </div>
        </Card>
      ))}
    </SL>
  )},

  {id:"copilot",section:"copilot",content:()=>(
    <SL tag="COPILOT" title="GitHub Copilot — Setup" sub="File structure + settings" t={t}>
      <Code title="Project structure" t={t}>{`.github/
├── copilot-instructions.md  ← Always-on
├── instructions/
│   ├── frontend.instructions.md (applyTo)
│   └── backend.instructions.md  (applyTo)
└── skills/
    └── code-review/SKILL.md  ← On-demand
AGENTS.md                     ← Universal`}</Code>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginTop:12}}>
        {[{s:"Model",r:"Auto routine",w:"Saves credits"},{s:"Tabs",r:"Max 5",w:"−60% context"},{s:"Plan Mode",r:"Complex tasks",w:"Catches errors"},{s:"Non-code",r:"Disable AI",w:"No waste"}].map((c,i)=>(
          <Card key={i} t={t} delay={200+i*70} style={{padding:"8px 12px"}}><div style={{fontWeight:700,color:BR.copilot.c,fontSize:13,fontFamily:FBODY}}>{c.s}</div><div style={{color:t.tp,fontSize:13,fontFamily:FBODY}}>{c.r}</div><div style={{fontSize:11,color:t.tm,fontFamily:FBODY}}>{c.w}</div></Card>
        ))}
      </div>
    </SL>
  )},

  {id:"cursor",section:"cursor",content:()=>(
    <SL tag="CURSOR" title="Cursor — Setup" sub="Modular .mdc rules" t={t}>
      <Code title="testing.md — loads for test files only" t={t}>{`---
description: Test conventions
globs: ["**/*.test.ts", "**/test_*.py"]
---
Vitest (unit), Playwright (E2E)
- Colocate tests next to source`}</Code>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:8,marginTop:12}}>
        {[{type:"Always",when:"Every req",cost:"🔴"},{type:"Globs",when:"Matching",cost:"🟢"},{type:"Agent",when:"AI picks",cost:"🟢"},{type:"Manual",when:"You invoke",cost:"⚪"}].map((r,i)=>(
          <Card key={i} t={t} delay={200+i*70} style={{padding:10,textAlign:"center"}}><div style={{fontWeight:800,color:t.accent,fontSize:14,fontFamily:FBODY}}>{r.type}</div><div style={{fontSize:11,color:t.tm,marginTop:2,fontFamily:FBODY}}>{r.when}</div><div style={{fontSize:16,marginTop:4}}>{r.cost}</div></Card>
        ))}
      </div>
      <Callout icon="⚡" t={t} delay={500}><B t={t}>Auto Mode</B> = free. <B t={t}>Cmd+K</B> for small edits.</Callout>
    </SL>
  )},

  {id:"layers",section:"advanced",content:()=>(
    <SL tag="ARCHITECTURE" title="The 5-Layer Context Stack" t={t}>
      {[{n:1,name:"Instructions",desc:"Stack, rules",tok:"~300t",c:t.accentAlt},{n:2,name:"AGENTS.md",desc:"Architecture",tok:"~500t",c:t.accent},{n:3,name:"Skills",desc:"Workflows",tok:"~500t",c:t.good},{n:4,name:"@refs",desc:"Per request",tok:"Var",c:BR.cursor.c},{n:5,name:"Globs",desc:"Pattern rules",tok:"~200t",c:t.accentD}].map((l,i)=>(
        <Card key={i} t={t} delay={i*70} style={{marginBottom:6,padding:"8px 14px"}}>
          <div style={{display:"flex",alignItems:"center",gap:12}}>
            <div className="num-badge" style={{"--nc":l.c}}>{l.n}</div>
            <div style={{flex:1}}><span style={{fontWeight:700,color:l.c,fontFamily:FONT}}>{l.name}</span><span style={{color:t.tm,fontSize:13,marginLeft:8,fontFamily:FBODY}}>{l.desc}</span></div>
            <div style={{textAlign:"right"}}><div style={{fontFamily:FMONO,fontWeight:700,color:l.c,fontSize:12}}>{l.tok}</div></div>
          </div>
        </Card>
      ))}
      <Callout icon="🔄" t={t} delay={400}><B t={t}>Retro:</B> Ask "What confused you?" → improve AGENTS.md.</Callout>
    </SL>
  )},

  {id:"cheatsheet",section:"advanced",content:()=>(
    <SL tag="REFERENCE" title="Cheat Sheet" sub="Screenshot this" t={t}>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
        <Card t={t} delay={100}><div style={{fontWeight:700,color:t.tp,fontSize:13,marginBottom:8,fontFamily:FONT}}>Config files</div>{[["copilot-instructions.md","Every req"],["rules/*.md","Frontmatter"],["SKILL.md","On-demand"],["AGENTS.md","Always"]].map(([f,w],i)=><div key={i} style={{display:"flex",justifyContent:"space-between",padding:"3px 0",borderBottom:`1px solid ${t.borderL}`,fontSize:12}}><code style={{color:t.accent,fontSize:11,fontFamily:FMONO}}>{f}</code><span style={{color:t.tm,fontFamily:FBODY}}>{w}</span></div>)}</Card>
        <Card t={t} delay={200}><div style={{fontWeight:700,color:t.tp,fontSize:13,marginBottom:8,fontFamily:FONT}}>Budgets</div>{[["Always-on","< 500t"],["AGENTS.md","< 1 page"],["Each skill","< 500t"],["Tabs","Max 5"]].map(([w,tgt],i)=><div key={i} style={{display:"flex",justifyContent:"space-between",padding:"3px 0",borderBottom:`1px solid ${t.borderL}`,fontSize:12}}><span style={{color:t.ts,fontFamily:FBODY}}>{w}</span><span style={{fontWeight:700,color:t.good,fontFamily:FMONO}}>{tgt}</span></div>)}</Card>
      </div>
      <div className="stagger gradient-banner" style={{"--d":"350ms",background:`linear-gradient(135deg,${t.accent},${t.accentAlt})`,fontFamily:FBODY}}>3-Second Test: Every request? · Failed 3×? · Shorter?</div>
    </SL>
  )},

  {id:"end",section:"end",content:()=>(
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",height:"100%",position:"relative",zIndex:1}}>
      <h1 className="hero-title stagger" style={{"--d":"0ms",fontFamily:FONT,color:t.tp}}>Thank You</h1>
      <div className="stagger" style={{"--d":"200ms",color:t.ts,fontSize:17,marginTop:16,fontFamily:FBODY}}>Start with <B t={t}>3 quick wins</B> today:</div>
      <div style={{display:"flex",flexDirection:"column",gap:10,marginTop:18,width:"100%",maxWidth:380}}>
        {[{n:"1",x:"Close extra tabs",c:t.accentAlt},{n:"2",x:"Add AGENTS.md",c:t.accent},{n:"3",x:"Trim to 15 rules",c:t.good}].map((item,i)=>(
          <Card key={i} t={t} delay={300+i*120}><div style={{display:"flex",alignItems:"center",gap:12}}><div className="num-badge" style={{"--nc":item.c}}>{item.n}</div><div style={{fontWeight:600,color:t.tp,fontSize:15,fontFamily:FBODY}}>{item.x}</div></div></Card>
        ))}
      </div>
      <div className="stagger" style={{"--d":"700ms",display:"flex",gap:10,marginTop:32}}><Tag t={t}>⬡ Copilot</Tag><Tag t={t}>⌘ Cursor</Tag><Tag t={t}>◈ Claude</Tag></div>
    </div>
  )},
];}

/* ═══ ADMIN ═══ */
function AdminPanel({slides,skippedSlides,toggleSkip,onClose,goToSlide,t}){
  const secs={intro:"Intro",tokens:"Tokens",config:"Configuration",optimize:"Optimization",metrics:"Metrics",copilot:"Copilot",cursor:"Cursor",advanced:"Advanced",end:"End"};let c=null;
  return(<div style={{position:"fixed",inset:0,zIndex:1000}}><div className="admin-overlay" onClick={onClose} style={{background:`${t.bg}cc`}}/><div className="admin-drawer" style={{background:t.elev,borderLeft:`1px solid ${t.borderL}`}}>
    <div style={{padding:"16px 20px",borderBottom:`1px solid ${t.borderL}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}><div><div style={{fontWeight:700,fontSize:16,color:t.tp,fontFamily:FONT}}>Admin panel</div><div style={{fontSize:12,color:t.tm,fontFamily:FBODY}}>{skippedSlides.size} skipped · {slides.length-skippedSlides.size} active</div></div><button onClick={onClose} className="close-btn" style={{background:t.surface,border:`1px solid ${t.borderL}`,color:t.tm}}>×</button></div>
    <div style={{flex:1,overflow:"auto",padding:"12px 16px"}}>{slides.map((s,idx)=>{
      const isNew=s.section!==c;c=s.section;const skip=skippedSlides.has(s.id);
      return<div key={s.id}>{isNew&&<div style={{fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:3,color:t.tm,margin:`${idx===0?0:16}px 0 6px`,fontFamily:FBODY}}>{secs[s.section]||s.section}</div>}
        <div className="admin-row" style={{background:skip?`${t.bad}08`:t.surface,border:`1px solid ${skip?t.bad+"22":t.borderL}`}}>
          <button onClick={()=>toggleSkip(s.id)} className="admin-toggle" style={{borderColor:skip?t.bad:t.good,background:`${skip?t.bad:t.good}12`,color:skip?t.bad:t.good}}>{skip?"✕":"✓"}</button>
          <div onClick={()=>{goToSlide(idx);onClose();}} style={{flex:1,cursor:"pointer",fontSize:13,fontWeight:600,color:skip?t.tm:t.tp,textDecoration:skip?"line-through":"none",fontFamily:FBODY}}>{s.id.replace(/-/g," ").replace(/\b\w/g,x=>x.toUpperCase())}</div>
          <span style={{fontSize:11,color:t.tm,fontFamily:FMONO}}>{idx+1}</span>
        </div>
      </div>;
    })}</div>
  </div></div>);
}

/* ═══ MAIN ═══ */
export default function App(){
  const [themeKey,setThemeKey]=useState("golden");
  const [cur,setCur]=useState(0);
  const [skipped,setSkipped]=useState(new Set());
  const [showAdmin,setShowAdmin]=useState(false);
  const [dir,setDir]=useState(1);
  const [animKey,setAnimKey]=useState(0);
  const [goToOpen,setGoToOpen]=useState(false);
  const [goToVal,setGoToVal]=useState("");
  const touchRef=useRef(null);

  const t=TH[themeKey];const slides=makeSlides(t);
  const active=slides.filter(s=>!skipped.has(s.id));
  const activeIdx=active.findIndex(s=>s===slides[cur]);
  const total=active.length;
  const progress=total>1?(activeIdx/(total-1))*100:0;
  const themeOrder=["golden","desert","stage","midnight"];
  const cycleTheme=()=>{const i=themeOrder.indexOf(themeKey);setThemeKey(themeOrder[(i+1)%themeOrder.length]);};

  const nav=useCallback((d)=>{setDir(d);setCur(p=>{let n=p+d;while(n>=0&&n<20&&skipped.has(makeSlides(TH.golden)[n]?.id))n+=d;return(n<0||n>=20)?p:n;});setAnimKey(k=>k+1);},[skipped]);
  const goTo=useCallback((idx)=>{setDir(idx>cur?1:-1);setCur(idx);setAnimKey(k=>k+1);},[cur]);

  useEffect(()=>{const h=e=>{if(showAdmin||goToOpen){if(e.key==="Escape"){setShowAdmin(false);setGoToOpen(false);}return;}
    if(e.key==="ArrowRight"||e.key===" "){e.preventDefault();nav(1);}if(e.key==="ArrowLeft"){e.preventDefault();nav(-1);}
    if(e.key==="a"||e.key==="A")setShowAdmin(true);if(e.key==="g"||e.key==="G")setGoToOpen(true);if(e.key==="t"||e.key==="T")cycleTheme();};
    window.addEventListener("keydown",h);return()=>window.removeEventListener("keydown",h);},[nav,showAdmin,goToOpen,themeKey]);

  const handleGoTo=()=>{const n=parseInt(goToVal,10);if(n>=1&&n<=slides.length)goTo(n-1);setGoToVal("");setGoToOpen(false);};

  return(
    <div style={{width:"100%",height:"100vh",background:t.bg,fontFamily:FBODY,display:"flex",flexDirection:"column",overflow:"hidden",position:"relative",color:t.ts,transition:"background 0.5s,color 0.5s"}}
      onTouchStart={e=>{touchRef.current=e.touches[0].clientX;}}
      onTouchEnd={e=>{if(!touchRef.current)return;const d=e.changedTouches[0].clientX-touchRef.current;if(Math.abs(d)>60)nav(d<0?1:-1);touchRef.current=null;}}>

      <style>{`
@import url('https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Source+Sans+3:wght@300;400;600;700;800;900&family=JetBrains+Mono:wght@400;700&display=swap');
*{box-sizing:border-box;margin:0;padding:0}
::-webkit-scrollbar{width:4px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:${t.borderL};border-radius:4px}

/* ═══ BACKGROUND SYSTEM ═══ */
.anim-bg{position:absolute;inset:0;overflow:hidden;z-index:0;pointer-events:none}
.blob{position:absolute;border-radius:50%;filter:blur(80px);animation:blobDrift 22s ease-in-out infinite}
.blob-a{width:45%;height:45%;background:var(--ba);top:-10%;right:-5%;animation-delay:0s}
.blob-b{width:35%;height:35%;background:var(--bb);bottom:-5%;left:-5%;animation-delay:-8s}
.blob-c{width:25%;height:25%;background:var(--ba);top:35%;left:25%;animation-delay:-15s}
@keyframes blobDrift{0%,100%{transform:translate(0,0) scale(1) rotate(0deg)}25%{transform:translate(25px,-35px) scale(1.08) rotate(5deg)}50%{transform:translate(-15px,25px) scale(0.95) rotate(-3deg)}75%{transform:translate(20px,10px) scale(1.04) rotate(2deg)}}
.grid-svg{position:absolute;inset:0;width:100%;height:100%;color:${t.border}22;animation:gridPulse 8s ease-in-out infinite}
@keyframes gridPulse{0%,100%{opacity:0.3}50%{opacity:0.6}}

/* ═══ PARTICLES ═══ */
.mote{position:absolute;left:var(--mx);top:var(--my);animation:moteFloat var(--mdur) ease-in-out var(--mdel) infinite}
.mote-circle{width:var(--msz);height:var(--msz);border-radius:50%;background:var(--mc);opacity:0.35}
.mote-diamond{width:var(--msz);height:var(--msz);background:var(--mc);opacity:0.25;transform:rotate(45deg)}
.mote-ring{width:var(--msz);height:var(--msz);border-radius:50%;border:1.5px solid var(--mc);opacity:0.3}
.mote-dot{width:calc(var(--msz)*0.6);height:calc(var(--msz)*0.6);border-radius:50%;background:var(--mc);opacity:0.4;box-shadow:0 0 6px var(--mc)}
@keyframes moteFloat{0%,100%{transform:translateY(0) translateX(0);opacity:0.2}30%{opacity:0.5}50%{transform:translateY(calc(var(--mdrift)*-1)) translateX(calc(var(--mdrift)*0.5));opacity:0.45}70%{opacity:0.3}}

/* ═══ GEOMETRIC SHAPES ═══ */
.geo{position:absolute;left:var(--gx);top:var(--gy);width:var(--gsz);height:var(--gsz);animation:geoOrbit var(--gdur) linear var(--gdel) infinite;opacity:0.15}
.geo-tri{clip-path:polygon(50% 0%,0% 100%,100% 100%);background:var(--gc)}
.geo-hex{clip-path:polygon(25% 0%,75% 0%,100% 50%,75% 100%,25% 100%,0% 50%);background:var(--gc)}
.geo-cross{background:var(--gc);clip-path:polygon(35% 0%,65% 0%,65% 35%,100% 35%,100% 65%,65% 65%,65% 100%,35% 100%,35% 65%,0% 65%,0% 35%,35% 35%)}
.geo-square{background:var(--gc);border-radius:3px}
@keyframes geoOrbit{0%{transform:rotate(var(--grot)) scale(1)}50%{transform:rotate(calc(var(--grot) + 180deg)) scale(0.8)}100%{transform:rotate(calc(var(--grot) + 360deg)) scale(1)}}

/* ═══ STAGGER ENTRANCE ═══ */
.stagger{opacity:0;transform:translateY(18px) scale(0.98);animation:stIn 0.55s cubic-bezier(0.34,1.56,0.64,1) forwards;animation-delay:var(--d,0ms)}
@keyframes stIn{to{opacity:1;transform:translateY(0) scale(1)}}

/* ═══ SLIDE TRANSITION ═══ */
@keyframes slideR{from{opacity:0;transform:translateX(60px) scale(0.96) rotateY(2deg)}to{opacity:1;transform:translateX(0) scale(1) rotateY(0)}}
@keyframes slideL{from{opacity:0;transform:translateX(-60px) scale(0.96) rotateY(-2deg)}to{opacity:1;transform:translateX(0) scale(1) rotateY(0)}}
.slide-anim{animation-duration:0.5s;animation-timing-function:cubic-bezier(0.22,1,0.36,1);animation-fill-mode:both;perspective:800px}

/* ═══ CARD MICRO-INTERACTIONS ═══ */
.card{position:relative;overflow:hidden;transition:transform 0.32s cubic-bezier(0.22,1,0.36,1),box-shadow 0.32s ease,border-color 0.32s ease}
.card::after{content:'';position:absolute;top:0;left:0;width:3px;height:0;background:${t.accent};border-radius:0 2px 2px 0;transition:height 0.35s cubic-bezier(0.22,1,0.36,1);pointer-events:none;z-index:2}
.card:hover{transform:translateY(-3px);box-shadow:0 8px 28px var(--glow),0 2px 8px var(--glow);border-color:${t.accent}33}
.card:hover::after{height:100%}
.card>*{position:relative;z-index:1}
.card::before{content:'';position:absolute;inset:0;background:linear-gradient(135deg,${t.accent}04,${t.accent}00);opacity:0;transition:opacity 0.4s ease;pointer-events:none;z-index:0}
.card:hover::before{opacity:1}

/* ═══ ANIMATED COUNTER ═══ */
.counter-wrap{display:flex;flex-direction:column;align-items:center;padding:4px 0}
.counter-val{font-size:26px;font-weight:700;line-height:1;transition:color 0.3s}
.counter-sub{font-size:11px;margin-top:4px;text-align:center}

/* ═══ TAG MICRO ═══ */
.tag-anim{display:inline-block;padding:3px 11px;border-radius:6px;font-weight:600;font-size:12px;letter-spacing:0.2px;background:var(--tbg);color:var(--tc);border:1px solid var(--tbd);transition:transform 0.2s cubic-bezier(0.22,1,0.36,1),box-shadow 0.2s;cursor:default}
.tag-anim:hover{transform:translateY(-2px) scale(1.04);box-shadow:0 4px 12px var(--tbg)}

/* ═══ CODE BLOCK ═══ */
.code-block{border-radius:10px;overflow:hidden;position:relative}
.code-title{padding:7px 16px;font-size:11px;font-weight:600;letter-spacing:0.3px}
.code-pre{margin:0;padding:14px 16px;font-size:12px;line-height:1.65;overflow:auto;white-space:pre-wrap}
.code-scanline{position:absolute;top:0;left:0;right:0;height:2px;background:${t.accent}22;animation:scanDown 4s ease-in-out infinite;pointer-events:none}
@keyframes scanDown{0%{top:0;opacity:0}10%{opacity:0.6}90%{opacity:0.6}100%{top:100%;opacity:0}}

/* ═══ CALLOUT ═══ */
.callout{padding:11px 16px;border-radius:10px;font-size:13px;line-height:1.6;display:flex;gap:10px;align-items:flex-start;margin-top:12px;background:color-mix(in srgb,var(--cc) 5%,transparent);border:1px solid color-mix(in srgb,var(--cc) 15%,transparent);transition:border-color 0.3s,transform 0.2s}
.callout:hover{border-color:color-mix(in srgb,var(--cc) 30%,transparent);transform:translateX(3px)}
.callout-pulse{font-size:16px;flex-shrink:0;animation:iconPulse 3s ease-in-out infinite}
@keyframes iconPulse{0%,100%{transform:scale(1)}50%{transform:scale(1.15)}}

/* ═══ NUM BADGE ═══ */
.num-badge{width:30px;height:30px;border-radius:9px;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:13px;color:#fff;flex-shrink:0;background:var(--nc);transition:transform 0.2s,box-shadow 0.2s}
.num-badge:hover,.card:hover .num-badge{transform:scale(1.12) rotate(-3deg);box-shadow:0 4px 16px color-mix(in srgb,var(--nc) 30%,transparent)}
.pulse-border{animation:pulseBorder 2.5s ease-in-out infinite}
@keyframes pulseBorder{0%,100%{box-shadow:0 0 0 0 color-mix(in srgb,var(--nc) 25%,transparent)}50%{box-shadow:0 0 0 6px color-mix(in srgb,var(--nc) 0%,transparent)}}

/* ═══ ICON FLOAT ═══ */
.icon-float{animation:iconBob 3s ease-in-out infinite}
@keyframes iconBob{0%,100%{transform:translateY(0)}50%{transform:translateY(-3px)}}

/* ═══ IMPACT ═══ */
.impact-pill{font-size:10px;font-weight:800;padding:2px 8px;border-radius:5px;color:var(--ic);background:color-mix(in srgb,var(--ic) 10%,transparent);border:1px solid color-mix(in srgb,var(--ic) 20%,transparent);transition:transform 0.2s}
.card:hover .impact-pill{transform:scale(1.08)}
.impact-dots{display:flex;gap:3px;align-items:center}
.idot{width:4px;height:14px;border-radius:2px;background:var(--dc);transition:transform 0.2s,height 0.2s}
.card:hover .idot{height:18px;transform:scaleX(1.2)}

/* ═══ COMPARE / PROMPT ═══ */
.compare-label{font-size:11px;font-weight:700;letter-spacing:1px;text-transform:uppercase;margin-bottom:8px}
.prompt-card{border-radius:10px;padding:10px 12px;transition:transform 0.2s,box-shadow 0.2s}
.prompt-card:hover{transform:scale(1.02)}
.bad-card{background:color-mix(in srgb,var(--pc) 5%,transparent);border:1px solid color-mix(in srgb,var(--pc) 12%,transparent)}
.good-card{background:color-mix(in srgb,var(--pc) 5%,transparent);border:1px solid color-mix(in srgb,var(--pc) 12%,transparent)}
.prompt-pre{margin:0;font-size:11px;line-height:1.5;white-space:pre-wrap}
.save-vert{writing-mode:vertical-rl;text-orientation:mixed;transform:rotate(180deg);font-size:10px;font-weight:800;display:flex;align-items:center;animation:saveGlow 2s ease-in-out infinite}
@keyframes saveGlow{0%,100%{opacity:0.7}50%{opacity:1}}

/* ═══ TOKEN BAR ═══ */
.bar-track{flex:1;height:8px;border-radius:4px;overflow:hidden;position:relative}
.bar-fill{height:100%;border-radius:4px;width:0;animation:barG 0.8s cubic-bezier(0.22,1,0.36,1) forwards;animation-delay:var(--d,0ms);position:relative}
.bar-fill::after{content:'';position:absolute;right:0;top:0;bottom:0;width:12px;background:linear-gradient(90deg,transparent,rgba(255,255,255,0.25));border-radius:0 4px 4px 0;animation:barShine 2s ease-in-out infinite}
@keyframes barG{to{width:var(--tw)}}
@keyframes barShine{0%,100%{opacity:0.3}50%{opacity:0.7}}

/* ═══ MISC ═══ */
.hero-title{font-size:clamp(28px,5vw,50px);font-weight:700;text-align:center;line-height:1.12;margin:0}
.slide-tag{font-size:10px;letter-spacing:3px;text-transform:uppercase;font-weight:700;margin-bottom:5px}
.title-reveal{animation:titleSlide 0.6s cubic-bezier(0.22,1,0.36,1) forwards}
@keyframes titleSlide{from{opacity:0;transform:translateX(-20px)}to{opacity:1;transform:translateX(0)}}
.arrow-morph{animation:aPulse 2s ease-in-out infinite}
@keyframes aPulse{0%,100%{transform:translateX(0);opacity:1}50%{transform:translateX(5px);opacity:0.5}}
.pulse-hint{animation:pH 2.5s ease-in-out infinite}
@keyframes pH{0%,100%{opacity:0.4}50%{opacity:1}}
.kbd-anim{padding:2px 9px;border-radius:5px;font-size:11px;transition:transform 0.15s,box-shadow 0.15s}
.kbd-anim:hover{transform:translateY(-1px);box-shadow:0 2px 6px ${t.glow}}
.tool-pill{font-size:10px;padding:2px 8px;border-radius:4px}
.gradient-banner{margin-top:14px;padding:14px 20px;border-radius:10px;text-align:center;font-size:13px;color:#fff;font-weight:600;line-height:1.6;transition:transform 0.2s}
.gradient-banner:hover{transform:scale(1.01)}

/* ═══ PROGRESS ═══ */
.progress-bar{position:relative;overflow:hidden}
.progress-bar::after{content:'';position:absolute;top:0;height:100%;width:60px;background:linear-gradient(90deg,transparent,rgba(255,255,255,0.3),transparent);animation:progShimmer 3s ease-in-out infinite}
@keyframes progShimmer{0%{left:-60px}100%{left:100%}}

/* ═══ NAV ═══ */
.pdot{transition:all 0.25s cubic-bezier(0.22,1,0.36,1);cursor:pointer;border-radius:4px;flex-shrink:0}
.pdot:hover{transform:scaleY(1.8) scaleX(1.3);opacity:1!important}
.nav-btn{transition:all 0.2s cubic-bezier(0.22,1,0.36,1)}
.nav-btn:hover:not(:disabled){transform:scale(1.1);box-shadow:0 4px 16px ${t.glow}}
.nav-btn:active:not(:disabled){transform:scale(0.9)}
.hdr-btn{transition:all 0.15s}
.hdr-btn:hover{background:${t.surface}!important;color:${t.tp}!important;transform:translateY(-1px)}

/* ═══ ADMIN ═══ */
.admin-overlay{position:absolute;inset:0;backdrop-filter:blur(6px);animation:fadeIn 0.2s}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
.admin-drawer{position:absolute;right:0;top:0;bottom:0;width:380px;display:flex;flex-direction:column;animation:drawerIn 0.3s cubic-bezier(0.22,1,0.36,1);box-shadow:-6px 0 30px ${t.glow}}
@keyframes drawerIn{from{transform:translateX(100%)}to{transform:translateX(0)}}
.close-btn{width:32px;height:32px;border-radius:8px;cursor:pointer;font-size:16px;display:flex;align-items:center;justify-content:center;transition:all 0.15s}
.close-btn:hover{transform:rotate(90deg)}
.admin-row{display:flex;align-items:center;gap:10px;padding:7px 10px;border-radius:8px;margin-bottom:3px;transition:all 0.15s}
.admin-row:hover{transform:translateX(3px)}
.admin-toggle{width:22px;height:22px;border-radius:6px;border:2px solid;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:900;flex-shrink:0;transition:all 0.2s;padding:0}
.admin-toggle:hover{transform:scale(1.2)}
      `}</style>

      <AnimBg t={t}/>

      <div className="progress-bar" style={{height:3,background:t.surface,flexShrink:0,position:"relative",zIndex:2}}><div style={{height:"100%",background:`linear-gradient(90deg,${t.accent},${t.accentAlt})`,width:`${progress}%`,transition:"width 0.5s cubic-bezier(0.22,1,0.36,1)"}}/></div>

      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 20px",borderBottom:`1px solid ${t.borderL}`,flexShrink:0,background:`${t.bg}ee`,backdropFilter:"blur(8px)",position:"relative",zIndex:2}}>
        <div style={{fontSize:11,fontWeight:700,color:t.accent,textTransform:"uppercase",letterSpacing:3}}>{slides[cur]?.section}</div>
        <div style={{display:"flex",alignItems:"center",gap:7}}>
          <span style={{fontSize:13,fontFamily:FMONO,color:t.tm}}>{activeIdx+1}/{total}</span>
          <button className="hdr-btn" onClick={cycleTheme} title="Theme (T)" style={{padding:"4px 10px",borderRadius:7,border:`1px solid ${t.borderL}`,background:"transparent",cursor:"pointer",fontSize:13,color:t.tm}}>{t.icon}</button>
          <button className="hdr-btn" onClick={()=>setGoToOpen(true)} style={{padding:"4px 10px",borderRadius:7,border:`1px solid ${t.borderL}`,background:"transparent",cursor:"pointer",fontSize:11,color:t.tm,fontWeight:600}}>Go to</button>
          <button className="hdr-btn" onClick={()=>setShowAdmin(true)} style={{padding:"4px 10px",borderRadius:7,border:`1px solid ${t.borderL}`,background:"transparent",cursor:"pointer",fontSize:11,color:t.tm,fontWeight:600}}>Admin</button>
        </div>
      </div>

      <div style={{flex:1,overflow:"hidden",position:"relative",zIndex:1}}>
        <div key={`${animKey}-${themeKey}`} className="slide-anim" style={{animationName:dir>0?"slideR":"slideL",height:"100%",padding:"20px 32px 12px"}}>{slides[cur]?.content()}</div>
      </div>

      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 20px 14px",flexShrink:0,background:`${t.bg}ee`,backdropFilter:"blur(8px)",position:"relative",zIndex:2}}>
        <button className="nav-btn" onClick={()=>nav(-1)} disabled={cur===0} style={{width:40,height:40,borderRadius:10,border:`1px solid ${t.borderL}`,background:t.elev,cursor:cur===0?"not-allowed":"pointer",fontSize:18,display:"flex",alignItems:"center",justifyContent:"center",opacity:cur===0?0.3:1,color:t.ts}}>←</button>
        <div style={{display:"flex",gap:3,alignItems:"flex-end",flexWrap:"wrap",justifyContent:"center",maxWidth:"65%"}}>
          {slides.map((s,i)=><div key={i} className="pdot" onClick={()=>goTo(i)} style={{width:i===cur?20:6,height:i===cur?8:skipped.has(s.id)?3:6,background:skipped.has(s.id)?`${t.bad}55`:i===cur?t.accent:t.borderL,opacity:skipped.has(s.id)?0.5:i===cur?1:0.5}}/>)}
        </div>
        <button className="nav-btn" onClick={()=>nav(1)} disabled={cur===slides.length-1} style={{width:40,height:40,borderRadius:10,border:`1px solid ${t.borderL}`,background:t.elev,cursor:cur===slides.length-1?"not-allowed":"pointer",fontSize:18,display:"flex",alignItems:"center",justifyContent:"center",opacity:cur===slides.length-1?0.3:1,color:t.ts}}>→</button>
      </div>

      {goToOpen&&<div style={{position:"fixed",inset:0,zIndex:999,display:"flex",alignItems:"center",justifyContent:"center"}}><div onClick={()=>setGoToOpen(false)} style={{position:"absolute",inset:0,background:`${t.bg}bb`,backdropFilter:"blur(4px)"}}/><div className="stagger" style={{"--d":"0ms",position:"relative",background:t.elev,border:`1px solid ${t.borderL}`,borderRadius:14,padding:24,boxShadow:`0 16px 48px ${t.glow}`,width:280}}><div style={{fontWeight:700,fontSize:16,color:t.tp,marginBottom:14,fontFamily:FONT}}>Go to slide</div><div style={{display:"flex",gap:10}}><input autoFocus type="number" min={1} max={slides.length} value={goToVal} onChange={e=>setGoToVal(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleGoTo()} placeholder={`1–${slides.length}`} style={{flex:1,padding:"9px 14px",borderRadius:8,border:`1px solid ${t.borderL}`,background:t.surface,color:t.tp,fontSize:16,fontFamily:FMONO,outline:"none"}}/><button onClick={handleGoTo} style={{padding:"9px 16px",borderRadius:8,background:`linear-gradient(135deg,${t.accent},${t.accentAlt})`,color:"#fff",border:"none",cursor:"pointer",fontWeight:700,fontSize:14,fontFamily:FBODY}}>Go</button></div></div></div>}

      {showAdmin&&<AdminPanel slides={slides} skippedSlides={skipped} toggleSkip={id=>setSkipped(p=>{const n=new Set(p);n.has(id)?n.delete(id):n.add(id);return n;})} onClose={()=>setShowAdmin(false)} goToSlide={goTo} t={t}/>}
    </div>
  );
}
