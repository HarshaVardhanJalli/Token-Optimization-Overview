# Optimising Tokens & Getting the Best Out of AI Coding Agents
## A Practical Guide for Teams Using GitHub Copilot & Cursor

> **Why this matters now:** GitHub Copilot is moving to token-based billing on June 1, 2026. Every token you waste is money burned. Cursor uses a credit-pool system where model choice directly affects how far your budget goes. This guide will help your team write less, get more, and prove it with numbers.

---

## Table of Contents

1. [The Token Tax — What It Is and Why It Matters](#1-the-token-tax)
2. [Instructions Files — Your Agent's Onboarding Doc](#2-instructions-files)
3. [Skills Files — On-Demand Expertise](#3-skills-files)
4. [Other Config Files You Might Be Missing](#4-other-config-files)
5. [How Token Consumption Actually Works](#5-how-token-consumption-works)
6. [10 Proven Ways to Reduce Token Consumption](#6-reduce-token-consumption)
7. [Measuring Impact — The "performance.now" for Agents](#7-measuring-impact)
8. [Better Context = Less Thinking = Fewer Tokens](#8-better-context)
9. [Teaching the Agent Your Project](#9-teaching-the-agent)
10. [GitHub Copilot — Complete Setup Guide](#10-copilot-guide)
11. [Cursor — Complete Setup Guide](#11-cursor-guide)
12. [Cheat Sheet — Quick Reference Card](#12-cheat-sheet)

---

## 1. The Token Tax — What It Is and Why It Matters {#1-the-token-tax}

### What is a token?

Think of a token like a syllable for AI. The word "optimization" is about 3 tokens. A line of code like `const result = await fetchData()` is roughly 10 tokens.

**Every single interaction with your AI agent has a cost measured in tokens:**

| What Gets Sent | Token Cost |
|---|---|
| Your instructions file | Sent on EVERY request |
| Open editor tabs (Copilot) | Sent as context automatically |
| Rules files marked "always" (Cursor) | Sent on EVERY request |
| Your actual prompt/question | Sent once |
| The code the agent reads to answer | Variable |
| The agent's response back to you | Output tokens (more expensive) |

### The real-world cost

Think of it like a taxi meter. The meter starts running before you even ask your question — because all your config files, open tabs, and project context get loaded first. If your instructions file is 2,000 tokens and you make 100 requests in a day, you've spent 200,000 tokens just on instructions alone — before asking a single question.

### Why this is urgent now

**GitHub Copilot (from June 1, 2026):**
- Moving from request-based to token-based billing
- 1 AI Credit = $0.01 USD
- Pro plan: $10/month with $10 in credits
- Pro+: $39/month with $39 in credits
- Every wasted token is real money now

**Cursor:**
- Pro plan: $20/month with $20 in credits
- Agent Mode costs multiply fast
- Claude Sonnet 4 ≈ 225 requests from a $20 pool
- Auto Mode is free and unlimited (uses cheaper models)

---

## 2. Instructions Files — Your Agent's Onboarding Doc {#2-instructions-files}

Instructions files are like a permanent system prompt. They get injected before EVERY AI interaction — chat, autocomplete, code generation, all of it.

### The Golden Rule
> **Write instructions, not essays. The AI doesn't need persuasion — it needs directions.**

### Bad vs Good Instructions

```markdown
# ❌ BAD — Verbose (wastes tokens every single request)
It is strongly recommended that developers use TypeScript 
interfaces rather than type aliases when defining public API 
contracts, as this provides better extensibility and clearer 
intent for consumers of the API surface.

# ✅ GOOD — Dense (same meaning, 80% fewer tokens)
Prefer interface over type for public APIs.
```

```markdown
# ❌ BAD — Too much detail crammed into instructions
When writing React components, always use functional components 
with hooks instead of class components. Use useState for local 
state, useEffect for side effects, useContext for shared state. 
Always memoize expensive computations with useMemo and callbacks 
with useCallback. Prefer named exports over default exports.
Use Tailwind CSS for styling. Never use inline styles...
[continues for 500 more words]

# ✅ GOOD — Essential rules only, details in Skills
Stack: React 18 + TypeScript + Tailwind
- Functional components only, no classes
- Named exports, no default exports  
- No inline styles
- See .cursor/skills/ for detailed patterns
```

### How many lines should your instructions be?

| Tool | File | Recommended Size |
|---|---|---|
| GitHub Copilot | `.github/copilot-instructions.md` | 5–15 rules, under 500 tokens |
| Cursor | `.cursor/rules/general.md` (always-on) | 5–8 core rules |
| Both | `AGENTS.md` | Under 1 page of essential context |

### The Rule of Three
Only add a rule to your instructions after the AI gets it wrong THREE times. If the agent already handles your naming conventions correctly without a rule, skip the rule. Every unnecessary rule is wasted context.

---

## 3. Skills Files — On-Demand Expertise {#3-skills-files}

Skills are the opposite of instructions: they load ONLY when relevant, not on every request. This is your biggest lever for token savings.

### The difference (think of it like a restaurant)

| | Instructions | Skills |
|---|---|---|
| **Analogy** | The menu that every customer sees | The recipe book the chef opens only when needed |
| **Loaded** | Every single request | Only when the task matches |
| **Best for** | Coding style, naming, stack info | Specific workflows: testing, deployment, review |
| **Token cost** | Always paid | Paid only when used |

### Folder structure

```
your-project/
├── .github/
│   ├── copilot-instructions.md          # Copilot global rules
│   └── skills/                          # Copilot skills (on-demand)
│       ├── code-review/
│       │   └── SKILL.md
│       └── test-generation/
│           └── SKILL.md
├── .cursor/
│   ├── rules/                           # Cursor rules
│   │   ├── general.md                   # always-on (keep tiny)
│   │   ├── testing.md                   # loads for test files only
│   │   └── api.md                       # loads for API files only
│   └── skills/                          # Cursor skills (on-demand)
│       ├── code-reviewer/
│       │   └── SKILL.md
│       └── deploy/
│           └── SKILL.md
├── AGENTS.md                            # Universal agent context
└── src/
```

### Example SKILL.md

```markdown
---
name: test-generation
description: Generate unit tests following project conventions
---

# Test Generation Skill

## When to use
When writing or generating unit tests.

## Conventions
- Framework: Vitest for unit, Playwright for E2E
- Colocate tests next to source files
- File naming: `*.test.ts`
- No mocking of database calls in E2E

## Template
```typescript
import { describe, it, expect } from 'vitest'
import { functionName } from './module'

describe('functionName', () => {
  it('should handle normal case', () => {
    expect(functionName(input)).toBe(expected)
  })
  
  it('should handle edge case', () => {
    expect(() => functionName(null)).toThrow()
  })
})
```
```

### Why Skills save tokens — a real example

Without skills, you might put 50 rules in your always-on instructions = ~2,000 tokens on EVERY request.

With skills, you keep 8 rules always-on (~300 tokens) and move the rest into skills that load only when needed. If you make 100 requests/day and only 20 need the testing skill:

| Approach | Daily Token Cost (instructions only) |
|---|---|
| Everything in instructions | 100 × 2,000 = **200,000 tokens** |
| Split into rules + skills | (100 × 300) + (20 × 500) = **40,000 tokens** |
| **Savings** | **160,000 tokens/day (80% reduction)** |

---

## 4. Other Config Files You Might Be Missing {#4-other-config-files}

### AGENTS.md — The Universal Agent README

AGENTS.md is an open standard (backed by the Linux Foundation) that works across ALL coding agents — Copilot, Cursor, Claude Code, Codex, and more.

```markdown
# AGENTS.md (project root)

## Architecture
- Monorepo: frontend (React) + backend (FastAPI)
- Database: PostgreSQL via SQLAlchemy
- Auth: JWT tokens, refresh in HTTP-only cookies

## Directory Structure
- /src/api — FastAPI route handlers
- /src/services — Business logic
- /src/models — SQLAlchemy models
- /frontend/src — React components

## Build & Test
- Backend: `pip install -e . && pytest`
- Frontend: `pnpm install && pnpm test`
- Lint: `ruff check --fix && pnpm lint`

## Critical Rules
- Never modify migration files directly
- All API endpoints need OpenAPI docstrings
- Secrets go in .env, never committed
```

**Key insight:** AGENTS.md is version-controlled and shared with the team. It's like onboarding docs for AI — every team member's agent reads the same context.

### .gitignore — The Hidden Token Saver

A clean `.gitignore` prevents Copilot from indexing irrelevant files:

```gitignore
# These waste tokens if Copilot indexes them
node_modules/
dist/
build/
.next/
*.lock
__pycache__/
.env
coverage/
```

### Content Exclusion (Copilot Enterprise/Business)

Admins can exclude entire directories from Copilot's context:

```yaml
# In repository settings or org-level config
# Excluded paths won't be sent as context
- "*.xml"
- "*.yaml" 
- "**/generated/**"
- "**/vendor/**"
```

This is the single most powerful token reduction tool for Copilot at the org level.

### .cursorrules (Legacy) vs .cursor/rules/ (Current)

The old single-file `.cursorrules` is deprecated. The new system uses modular `.mdc` files in `.cursor/rules/` with YAML frontmatter that controls WHEN each rule loads:

```markdown
---
description: React component conventions
globs: ["src/components/**/*.tsx"]
---

- Use functional components with hooks
- Props interface above component
- No default exports
```

This rule ONLY loads when you're editing files in `src/components/` — zero cost when you're working on backend code.

---

## 5. How Token Consumption Actually Works {#5-how-token-consumption-works}

### The anatomy of a single request

```
┌─────────────────────────────────────────────┐
│              WHAT GETS SENT (INPUT)          │
├─────────────────────────────────────────────┤
│ 1. System prompt (tool's built-in)   ~500t  │
│ 2. Your instructions file            ~300t  │
│ 3. Active rules/skills               ~500t  │
│ 4. Open editor tabs context        ~2,000t  │
│ 5. Current file content            ~1,000t  │
│ 6. Your actual question               ~50t  │
├─────────────────────────────────────────────┤
│ TOTAL INPUT                        ~4,350t  │
├─────────────────────────────────────────────┤
│                                             │
│              WHAT COMES BACK (OUTPUT)        │
├─────────────────────────────────────────────┤
│ Agent's response + code            ~2,000t  │
│ (Output tokens cost 3-6x more!)             │
└─────────────────────────────────────────────┘
```

### The three problems of bloated context

1. **Context Squeeze** — LLMs have a fixed context window. If your rules take up 25% of that window, the AI has 25% less "brain space" to look at your actual code.

2. **Lost in the Middle** — Research shows that when prompts get too long, AI models remember the top and bottom instructions but lose track of things in the middle. Your most important rule buried on line 47 might get ignored.

3. **Latency & Cost** — More tokens = slower "Time to First Token" and higher API costs.

### Token cost by model (GitHub Copilot, as of June 2026)

| Model | Input (per 1M tokens) | Output (per 1M tokens) |
|---|---|---|
| GPT-5.4 | ~$2.50 | ~$15.00 |
| Claude Sonnet 4 | ~$3.00 | ~$15.00 |
| Claude Opus 4.6 | ~$15.00 | ~$75.00 |

**Key takeaway:** Output tokens cost 3–6x more than input tokens. Asking the agent to produce shorter, more focused responses saves real money.

### Token cost spectrum for Copilot configuration layers

```
Low cost ────────────────────────────────────── High cost

Hooks     Path-Specific    Repo-Wide    Skills    Agent Prompt
(0 tokens) Instructions   Instructions (on-demand) (always-on)
           (conditional)   (always-on)
```

---

## 6. 10 Proven Ways to Reduce Token Consumption {#6-reduce-token-consumption}

### 1. Keep instructions under 500 tokens
Your instructions file loads on EVERY request. Treat it like expensive real estate.

### 2. Close unused editor tabs
Each open tab sends its content as context. Copilot recommends keeping a maximum of 5 tabs open. This alone can save thousands of tokens per request.

### 3. Use scoped rules (not global rules)
In Cursor, use `globs` in your rule frontmatter so rules only load for matching files:
```yaml
globs: ["src/api/**/*.ts"]  # Only loads for API files
```

### 4. Move workflows to Skills
Anything that's a specific procedure (testing, deployment, code review) belongs in a SKILL.md, not in your instructions.

### 5. Use selection-scoped prompts
Instead of broad questions, highlight specific code and ask about just that selection. The agent sends less context.

```
❌ "How should I refactor this project?"
✅ [select 20 lines] "Refactor this function to use async/await"
```

### 6. Choose the right model for the task
Don't use Opus/GPT-5.4 for simple autocomplete. Use cheaper models for routine work:

| Task | Recommended Model |
|---|---|
| Simple autocomplete | Standard/Auto mode |
| Code review | Sonnet-class |
| Complex architecture | Opus/GPT-5.4 (use sparingly) |

### 7. Disable AI for non-coding files
Turn off Copilot for XML, YAML, properties files, and Markdown. These waste tokens without useful suggestions.

### 8. Work on one module at a time
Open only the specific service/package folder. In a monorepo, don't open the entire repo — open just the microservice you're working on.

### 9. Don't retry large prompts
If the agent gives a bad response, refine your prompt rather than submitting the same long prompt again. Each retry burns the full token cost.

### 10. Use Plan Mode before Agent Mode
Both Cursor and Copilot now offer plan mode — the agent outlines what it will do before doing it. This catches wrong approaches early, before the agent burns tokens executing a bad plan.

---

## 7. Measuring Impact — The "performance.now" for Agents {#7-measuring-impact}

You asked for something like JavaScript's `performance.now()` but for agent usage. Here's how to get real numbers.

### Method 1: Before/After Token Tracking (Copilot)

**Step 1: Measure your baseline**
```
Go to: github.com/settings/billing
→ Premium request analytics
→ Note: tokens consumed this week, requests made
```

**Step 2: Implement optimizations (rules, skills, tab hygiene)**

**Step 3: Measure again after 1 week**

**Metrics to track:**

| Metric | Where to Find It | What It Tells You |
|---|---|---|
| Tokens per request (avg) | Billing → Premium analytics | Is your context bloated? |
| Weekly token total | Billing → Usage | Overall consumption trend |
| Premium requests used | Billing → Overview | Are you hitting limits? |
| Credits remaining | VS Code status bar | Budget pacing |

### Method 2: VS Code Extension for Real-Time Tracking

Install the **"AI Engineering Fluency"** extension (by Rob Bos):
- Shows daily and monthly token usage
- Cost estimates per interaction
- Tracks trends over time

### Method 3: Cursor Token Monitor

Cursor shows token usage in the status bar at the bottom of the chat panel. Watch for it approaching 100% — that's your signal to prune rules.

### Method 4: The A/B Test (Team-Level)

Run a structured experiment:

```
Week 1 (Baseline):
  - Team uses default config (no instructions, no skills)
  - Record: tokens used, requests made, tasks completed

Week 2 (Optimized):
  - Add instructions.md (under 500 tokens)
  - Add AGENTS.md
  - Add 3-5 targeted Skills
  - Enforce 5-tab limit
  - Record same metrics

Compare:
  - Tokens per task (should decrease)
  - First-attempt success rate (should increase)
  - Rework/retry count (should decrease)
```

### Method 5: The Manual Stopwatch

For individual tasks, you can measure the "cost" of a single interaction:

```
Before starting a task:
  1. Note current credit balance (Copilot: billing page, Cursor: status bar)
  2. Note the time
  
Complete the task with the agent

After the task:
  1. Note new credit balance
  2. Calculate: credits_before - credits_after = cost of this task
  3. Note the time
  4. Calculate: time spent = total time including review
```

### Method 6: GitHub Copilot Metrics API (For Admins)

```bash
# Get organization-level usage metrics
curl -H "Authorization: Bearer $TOKEN" \
  "https://api.github.com/orgs/{org}/copilot/usage"

# Returns: total_tokens, active_users, suggestions_accepted, etc.
```

### Real-World Numbers That Prove Optimization Works

| Optimization | Measured Impact |
|---|---|
| Reducing instructions from 300 lines to 15 lines | ~80% reduction in baseline tokens per request |
| Closing tabs (15 → 5 open) | ~60% reduction in context tokens |
| Moving to scoped rules (Cursor) | Rules load on 20% of requests instead of 100% |
| Content exclusion (Copilot Enterprise) | Up to 50% less indexed content |
| Using Auto mode vs premium models | 4-10x more requests per dollar |
| One real workflow: prompt condensing + tool narrowing | Reduced a workflow from 14.9M tokens to ~5M tokens (66% savings) |

---

## 8. Better Context = Less Thinking = Fewer Tokens {#8-better-context}

When the agent "goes into thinking mode" and produces long, exploratory responses, it's usually because your prompt was vague. Better context = shorter, more focused responses = fewer output tokens (which cost 3-6x more than input tokens).

### The Specificity Spectrum

```
VAGUE (expensive)                        SPECIFIC (cheap)
──────────────────────────────────────────────────────────
"Fix the auth"                           "In auth.ts line 42, 
                                          the JWT refresh fails
                                          when the token has 
                                          expired > 24hrs.
                                          Fix the expiry check."
```

### 5 Rules for Better Prompts

**1. Name the file and the problem**
```
❌ "There's a bug in login"
✅ "In src/auth/login.ts, the validatePassword function returns 
   true for empty strings. Add a check for empty/null input."
```

**2. State the desired outcome**
```
❌ "Make the API faster"
✅ "Add Redis caching to GET /api/users/:id with 5-minute TTL. 
   Use the existing Redis client in src/lib/redis.ts."
```

**3. Point to existing patterns**
```
❌ "Write a test for the payment service"
✅ "Write a test for processPayment() following the pattern 
   in tests/order.test.ts. Use the test fixtures in tests/fixtures/."
```

**4. Constrain the scope**
```
❌ "Refactor the codebase"
✅ "Extract the validation logic from UserController.create() 
   into a separate validateUserInput() function in the same file."
```

**5. Use @ references (Cursor) or #file (Copilot) to pin context**
```
# Cursor
@src/models/user.ts @src/api/routes.ts
"Add a new /users/search endpoint following the pattern in routes.ts"

# Copilot
#file:src/models/user.ts
"Add a search method to the User model"
```

### What makes the agent "think" too much (and waste tokens)

| Trigger | Why It's Expensive | Fix |
|---|---|---|
| Ambiguous scope | Agent explores multiple interpretations | Specify file + function + line |
| No examples to follow | Agent invents patterns from scratch | Point to existing patterns |
| Contradicting rules | Agent tries to satisfy both, fails | Audit rules for conflicts |
| Too many open files | Agent reads irrelevant context | Close unrelated tabs |
| No architecture context | Agent guesses your structure | Add AGENTS.md |

---

## 9. Teaching the Agent Your Project {#9-teaching-the-agent}

The goal: your agent should understand your project as well as a new team member who's read all the docs. Here's the layered approach:

### Layer 1: Instructions (Always Active — Keep Tiny)
```
Stack, naming, critical "never do this" rules
~300 tokens, loads on every request
```

### Layer 2: AGENTS.md (Always Available in Repo)
```
Architecture, directory structure, build/test commands
~500 tokens, read by all agents, version-controlled
```

### Layer 3: Skills (Load On Demand)
```
Testing workflows, deployment procedures, review checklists
~500 tokens each, only loaded when relevant
```

### Layer 4: Inline Context (Per-Request)
```
@ mentions, #file references, selected code
Only sent for this specific request
```

### Layer 5: Cursor Rules with Globs (File-Specific)
```
React rules only load for .tsx files
API rules only load for route handlers
Zero cost when working on other files
```

### The "New Teammate" Checklist

Ask yourself: if a skilled developer joined your team today, what would they need to know? Put that in AGENTS.md:

- [ ] What's the tech stack?
- [ ] How is the project structured?
- [ ] How do I build and run it?
- [ ] How do I run tests?
- [ ] What are the critical "never do this" rules?
- [ ] What patterns should new code follow?
- [ ] How do I deploy?

### Living Documentation

Rules are not "set and forget." Treat them like unit tests:

- **Weekly audit:** Which rules is the AI consistently ignoring? (Usually means the rule is too vague or conflicts with another rule)
- **Remove rules the AI already follows by default.** If the agent never makes a mistake you have a rule for, delete that rule.
- **Add rules only after the third mistake.** Not the first, not the second — the third.

---

## 10. GitHub Copilot — Complete Setup Guide {#10-copilot-guide}

### File Structure

```
your-project/
├── .github/
│   ├── copilot-instructions.md      # Global instructions (always-on)
│   ├── instructions/                # Path-specific instructions
│   │   ├── frontend.instructions.md
│   │   └── backend.instructions.md
│   └── skills/                      # On-demand skills
│       ├── code-review/
│       │   └── SKILL.md
│       └── test-generation/
│           └── SKILL.md
├── AGENTS.md                        # Universal agent context
└── .gitignore                       # Keep clean to reduce indexing
```

### copilot-instructions.md (keep this SHORT)

```markdown
## Project: Hireflow — AI Resume Search App
## Stack: FastAPI + React + PostgreSQL + Pinecone

## Coding Standards
- Python: type hints on all functions, docstrings on public APIs
- TypeScript: strict mode, no `any` types  
- Use constructor injection / dependency injection
- Return proper HTTP status codes from all endpoints

## Do Not Suggest
- Changes to migration files
- Edits to .env or config files
- Changes to /dist, /build, or /node_modules

## Build & Test
- Backend: `pip install -e . && pytest`
- Frontend: `pnpm install && pnpm test`
```

### Path-specific instructions (applyTo)

Create `.instructions.md` files with `applyTo` headers for file-specific context:

```markdown
---
applyTo: "src/api/**/*.py"
---
- All endpoints must validate input with Pydantic models
- Use dependency injection for database sessions
- Return ResponseEntity-style responses with status codes
```

### Key Copilot settings to configure

| Setting | Recommendation | Why |
|---|---|---|
| Model selection | Use Auto for routine work | Saves premium credits |
| Open tabs | Max 5 at a time | Reduces context tokens |
| Plan mode | Use before complex tasks | Catches mistakes early |
| Completions panel | Use Tab, not Enter | More deliberate acceptance |
| Content exclusion | Exclude XML, YAML, generated | Prevents junk context |

### Monitoring your usage

1. **VS Code status bar:** Click the Copilot icon to see credit usage
2. **Billing page:** `github.com/settings/billing` → Premium request analytics  
3. **VS Code extension:** Install "AI Engineering Fluency" for detailed tracking
4. **API (admins):** Use the Copilot usage metrics API for org-level data

### Copilot-specific token tips

- **Disable Copilot for non-code files:** Turn off for Markdown, YAML, XML, JSON
- **Use inline suggestions for simple tasks:** Cheaper than Chat
- **Reserve Chat for complex tasks:** Multi-file reasoning, architecture questions
- **Use `/explain` and `/fix` commands:** More focused than open-ended questions
- **Avoid `/fleet` and parallel agents** when approaching limits — they multiply token consumption

---

## 11. Cursor — Complete Setup Guide {#11-cursor-guide}

### File Structure

```
your-project/
├── .cursor/
│   ├── rules/                       # Modular rules (.mdc files)
│   │   ├── general.md               # Always-on (keep minimal)
│   │   ├── testing.md               # Globs: test files only
│   │   ├── api.md                   # Globs: API routes only
│   │   ├── ui.md                    # Globs: components only
│   │   └── personal.md             # .gitignore this one
│   └── skills/                      # On-demand skills
│       ├── code-reviewer/
│       │   └── SKILL.md
│       └── deploy/
│           └── SKILL.md
├── AGENTS.md                        # Universal agent context
└── .cursorrules                     # Legacy (still works, but deprecated)
```

### Rule Types and When to Use Each

| Type | When It Loads | Use For | Token Impact |
|---|---|---|---|
| **Always** (no globs) | Every single request | Stack, core conventions | HIGH — keep tiny |
| **Globs** (file patterns) | Only matching files | Framework-specific rules | LOW — conditional |
| **Agent-decided** | AI decides relevance | Skills, imported rules | LOW — on-demand |
| **Manual** | You explicitly invoke | Rare workflows | ZERO until invoked |

### general.md (Always-On — Keep Under 300 Tokens)

```markdown
---
description: Core project conventions
---

Stack: React 18 + TypeScript + FastAPI + PostgreSQL + Pinecone
Package manager: pnpm (frontend), pip (backend)

Strict rules:
- No `any` types in TypeScript
- Type hints on all Python functions
- No inline styles — use Tailwind
- All DB writes in transactions
- Tests required for new functions
```

### testing.md (Conditional — Only for Test Files)

```markdown
---
description: Test conventions and patterns
globs: ["**/*.test.ts", "**/*.test.tsx", "**/test_*.py", "**/*_test.py"]
---

Frontend: Vitest for unit, Playwright for E2E
Backend: pytest with fixtures
- Colocate tests next to source files
- No mocking DB calls in E2E
- Use factories for test data, not raw objects
- Test command: `pnpm test` (frontend), `pytest` (backend)
```

### api.md (Conditional — Only for API Files)

```markdown
---
description: API route conventions
globs: ["src/api/**/*.py", "app/api/**/*.ts"]
---

- Validate all input with Pydantic/Zod
- Early returns for error states
- All responses: JSON with `data` key
- Add OpenAPI docstrings to every endpoint
- Use dependency injection for DB sessions
```

### Cursor-specific settings to configure

| Setting | Recommendation | Why |
|---|---|---|
| Auto Mode | Use for routine work | Free and unlimited on individual plans |
| Agent Mode | Reserve for complex tasks | Credits multiply fast |
| Model | Sonnet for most work, Opus for hard problems | Balance cost/quality |
| @ references | Always pin relevant files | Reduces guessing |
| `/create-rule` | Use when agent repeats a mistake | Quick rule creation in chat |
| Background Agents | Use sparingly | High token consumption |

### Monitoring in Cursor

- **Status bar:** Token usage percentage shown at bottom of chat panel
- **When it hits ~80%:** Time to prune rules or close the conversation
- **Start a new chat** for new tasks rather than continuing a long one

### Cursor-specific token tips

- **Use `@file` and `@folder` references** to pin exactly the context you need
- **Start new conversations** for new tasks (don't let chat history grow endlessly)
- **Use Auto Mode** for routine coding — it's free
- **Split rules by file pattern** using globs — biggest token saver
- **Use Cmd/Ctrl+K (inline edit)** for small targeted changes — cheaper than agent mode
- **Add `.cursor/rules/personal.md` to `.gitignore`** for individual settings
- **Import rules from Claude skills** — they appear as agent-decided rules
- **Use `/create-rule` in chat** when you spot a pattern the agent keeps getting wrong

---

## 12. Cheat Sheet — Quick Reference Card {#12-cheat-sheet}

### Config Files at a Glance

| File | Tool | Scope | Loads When |
|---|---|---|---|
| `.github/copilot-instructions.md` | Copilot | Repo-wide | Every request |
| `.instructions.md` (with applyTo) | Copilot | Path-specific | Matching files |
| `.github/skills/*/SKILL.md` | Copilot | On-demand | Agent decides |
| `.cursor/rules/*.md` | Cursor | Configurable | Based on frontmatter |
| `.cursor/skills/*/SKILL.md` | Cursor | On-demand | Agent decides |
| `AGENTS.md` | Universal | Repo-wide | Always (all agents) |
| `.cursorrules` | Cursor | Repo-wide | Every request (LEGACY) |

### Token Budget Rules of Thumb

| What | Target |
|---|---|
| Always-on instructions | Under 500 tokens (~15 rules) |
| AGENTS.md | Under 1 page |
| Individual skill | Under 500 tokens |
| Open editor tabs | Max 5 |
| Total context per request | Watch for 80%+ in status bar |

### The "3-Second Test"

Before adding ANY rule to your always-on instructions, ask:

1. Does this apply to EVERY interaction? (If not → make it conditional/skill)
2. Has the AI gotten this wrong 3+ times? (If not → don't add it yet)
3. Can I say it in fewer words? (If yes → rewrite it shorter)

### Quick Wins Ranked by Impact

| Rank | Action | Effort | Impact |
|---|---|---|---|
| 1 | Close unused tabs (→ max 5) | 1 min | High |
| 2 | Trim instructions to 15 rules | 30 min | High |
| 3 | Move workflows to Skills | 1 hour | High |
| 4 | Add AGENTS.md to repo | 30 min | Medium |
| 5 | Use scoped rules (Cursor globs) | 1 hour | High |
| 6 | Disable AI for non-code files | 5 min | Medium |
| 7 | Use Auto/standard model for routine work | 1 min | Medium |
| 8 | Write specific prompts (file + function + outcome) | Ongoing | High |
| 9 | Use Plan Mode before Agent Mode | Ongoing | Medium |
| 10 | Weekly rule audit | 15 min/week | Medium |

---

## Appendix: Things You Might Have Missed

### MCP (Model Context Protocol) Servers
Both Cursor and Copilot support MCP — a way to connect external tools (databases, APIs, CI/CD) directly to the agent. Instead of copying data into chat, the agent queries the tool directly. This saves tokens AND gives more accurate context.

### Hooks (Cursor)
Hooks are scripts that run before or after agent actions. Use them for automated guardrails:
- Pre-commit validation
- Test running after code changes
- Security scanning

### Sub-Agents (Copilot)
Copilot supports sub-agents that run in isolated context. This is a token optimization because each sub-agent only sees the context it needs, rather than the full conversation history.

### Context Window Management
- **Start new chats for new tasks.** Long conversations accumulate history that gets sent with every request.
- **Clear chat history** periodically in Cursor.
- **Use background agents for long-running tasks** — they manage their own context more efficiently.

### The Retro Pattern
After completing a task with the agent, paste a "retro" prompt:
```
What did you find confusing about this codebase? 
What context would have helped you work faster?
```
Use the agent's answer to improve your AGENTS.md and rules.

---

*Last updated: May 2026*
*Covers: GitHub Copilot (post June 1 billing), Cursor (2026 rules system)*
