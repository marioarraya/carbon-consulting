# Master Prompt — Build: Carbon Consulting Website

> Paste this entire file into Claude Code as your initial prompt, or run it with:
> `cat carbon-master-prompt.md | claude`

---

## 1. Project Brief

Build the marketing website for **Carbon Consulting**, an independent IT advisory firm. Five pages: **Home, Services, Approach, About, Contact**. The site must read as an established, senior advisory firm — think private-wealth practice, architecture firm, established consultancy. It must **not** read as a SaaS product, startup, managed IT provider, or design agency.

The writing is final and must be used verbatim. Tone in the UI (microcopy, CTAs, form labels) must match the register of the body copy: declarative, understated, specific.

---

## 2. Stack & Output

- **Plain static HTML, CSS, and vanilla JS.** No React, no Next.js, no Astro, no Tailwind, no Bootstrap, no jQuery. No build step.
- One `.html` file per page. One shared `styles.css`. One small `main.js` for nav + scroll reveals + form validation.
- Must work by double-clicking `index.html`. No server required for development.
- Ship-ready as a static site (deployable to Netlify, Vercel, or plain S3).

### File structure

```
carbon-consulting/
├── index.html          # Home
├── services.html
├── approach.html
├── about.html
├── contact.html
├── css/
│   └── styles.css      # All styles, organized with comment sections
├── js/
│   └── main.js         # Nav toggle, scroll reveal, form validation
├── assets/
│   └── favicon.svg     # Simple monogram — "CC" in Instrument Serif
└── README.md           # How to preview locally, notes on deploy
```

---

## 3. Design System

### 3.1 Palette (use CSS custom properties, exact hex values)

```
--bg            : #FFFFFF
--bg-alt        : #F7F6F3   /* secondary surfaces — callouts, form bg */
--ink           : #1F2A37   /* primary text, headlines */
--ink-muted     : #6B7280   /* secondary text, eyebrow labels */
--accent        : #3E5C76   /* muted blue — CTAs, rules, left-border accents */
--accent-ink    : #FFFFFF   /* text on accent */
--rule          : #E5E7EB   /* hairline dividers */
```

No other colors. No gradients anywhere.

### 3.2 Typography

**Display face:** `Instrument Serif` (Google Fonts, weight 400, italic available)
**Body face:** `Satoshi` (Fontshare CDN, weights 400/500/700)
**Body fallback:** if Fontshare is unreachable, fall back to `DM Sans` from Google Fonts, then system-ui.

Load with `font-display: swap`. Preconnect to both CDNs.

**Type scale** (desktop; scale down ~20% on mobile via `clamp()` or media queries):

| Role               | Size       | Line-height | Weight | Font     |
|--------------------|-----------:|-------------|--------|----------|
| Hero display       | 80px       | 1.05        | 400    | Instrument Serif |
| Page title (h1)    | 56px       | 1.1         | 400    | Instrument Serif |
| Section head (h2)  | 40px       | 1.15        | 400    | Instrument Serif |
| Subsection (h3)    | 24px       | 1.3         | 500    | Satoshi |
| Eyebrow label      | 12px       | 1          | 700    | Satoshi, `text-transform: uppercase`, `letter-spacing: 0.14em` |
| Body               | 18px       | 1.65        | 400    | Satoshi |
| Body large (lede)  | 22px       | 1.5         | 400    | Satoshi |
| Small/meta         | 14px       | 1.5         | 400    | Satoshi |
| Nav link           | 15px       | 1           | 500    | Satoshi |

Reading-width max for paragraph columns: **640–680px**. Never let body copy stretch to full viewport width.

### 3.3 Spacing & Grid

- Page gutter: `clamp(24px, 5vw, 64px)` left and right.
- Max content width: `1200px`.
- Section vertical padding: `clamp(80px, 12vw, 160px)` top/bottom.
- Rhythm between paragraphs: `1em`.
- Rhythm between subsections within a section: `48px`.

### 3.4 Motion (subtle only)

- **Page load:** body fades `opacity 0 → 1` over 400ms. Hero elements (eyebrow, headline, paragraph, CTAs) stagger in with `translateY(12px) → 0` + opacity, 80ms delay between each.
- **Scroll reveal:** use `IntersectionObserver`. Sections fade in + translate up 12px when 15% visible. Run once, don't re-trigger.
- **Links:** underline slides in left-to-right on hover (use `background-image` with linear-gradient trick or a pseudo-element + `transform: scaleX`). 220ms ease.
- **Buttons:** background/border color transitions only, 180ms. No `transform`, no `box-shadow` on hover.
- **Nav:** current-page link has a persistent thin underline.
- **Respect `prefers-reduced-motion: reduce`** — disable all transitions and reveals; show content immediately.

### 3.5 CTA buttons

Two variants only:

**Primary**
```
background: var(--accent);
color: var(--accent-ink);
padding: 16px 32px;
border-radius: 2px;
font: 500 15px/1 Satoshi;
letter-spacing: 0.02em;
border: 1px solid var(--accent);
```
Hover: background darkens ~8% (precompute a `--accent-hover` token, approximately `#344E66`).

**Secondary**
```
background: transparent;
color: var(--ink);
border: 1px solid var(--ink);
padding: 15px 31px;  /* -1px to account for border */
border-radius: 2px;
font: 500 15px/1 Satoshi;
```
Hover: background becomes `var(--ink)`, text becomes `#FFFFFF`.

### 3.6 Rules & callouts

- **Hairline rule**: `1px solid var(--rule)` — used to separate sections inside a page, never as decoration.
- **Principle callout** (for "Ownership & Continuity"): light `var(--bg-alt)` background, **4px solid `var(--accent)` left border**, 32–40px padding. Title in Instrument Serif 24px. Body in italic Satoshi 18px.

---

## 4. Hard Rules (What NOT to Do)

These are non-negotiable. If in doubt, omit.

- **No gradients** anywhere.
- **No drop shadows** on cards, buttons, or nav.
- **No rounded-pill buttons.** Max 2–3px border radius.
- **No stock photos** of people, handshakes, offices, skylines, or laptops.
- **No illustrations** of people, abstract "growth" imagery, or isometric scenes.
- **No icons** representing services. Services are presented as numbered typographic blocks.
- **No emoji.**
- **No decorative SVG patterns or geometric backgrounds.**
- **No parallax, no typing effects, no animated counters, no scale-on-hover, no "magnetic" cursors.**
- **No purple, no teal, no neon, no trendy accent colors.** Palette is locked above.
- **No "Get Started," "Learn More," "Let's Talk,"** or any CTA language not on the approved list in §5.8.
- **No placeholder lorem ipsum.** Use the exact copy below.
- **No dark mode toggle.** Site is light-mode only.
- **No cookie banner.** (Add only if/when analytics are added.)
- **No chat widget, no popup modals, no newsletter signup.**

---

## 5. Pages & Copy (VERBATIM — do not edit)

### 5.1 Global — Navigation

Sticky top, 72px tall desktop, 64px mobile. White background. 1px bottom border in `--rule` that appears only after the user scrolls past 16px.

- **Left:** wordmark — "Carbon Consulting" in Instrument Serif 20px. Clickable, returns to home.
- **Right (desktop):** nav links, 32px gap between them:
  - Home · Services · Approach · About · Contact
- **Mobile (<768px):** right side shows a minimal hamburger (two horizontal lines, 24px wide). Tapping opens a full-viewport overlay with nav links in Instrument Serif 40px, stacked vertically, centered. Close button ("✕" as text) top-right.

Current-page link gets a 1px underline offset 6px from the baseline.

### 5.2 Global — Footer

Appears on every page. 80px top padding, 48px bottom. Top border 1px `--rule`.

Two columns on desktop, stacked on mobile:

Left column:
```
Carbon Consulting
IT Advisory & Consulting
```
(wordmark in Instrument Serif 22px, category in Satoshi 14px muted)

Right column:
```
Services    Approach    About    Contact
[contact@carbonconsulting.com]
```
(links in Satoshi 14px, email in Satoshi 14px muted, stacked)

Bottom row, full width, above bottom padding:
```
© 2026 Carbon Consulting. All rights reserved.
```
(Satoshi 13px, muted)

### 5.3 HOME (`index.html`)

#### Hero

- Eyebrow: `IT ADVISORY & CONSULTING` (small, muted blue)
- Hero headline: **Carbon Consulting** (Instrument Serif, 80px on desktop)
- Lede paragraph (22px body, max-width 640px):
  > Carbon Consulting works with organizations that want technology decisions handled with structure, discipline, and experienced oversight — from strategy through vendor selection and implementation.
- CTA row: **[Schedule a Consultation]** (primary) · **[Contact Us]** (secondary)
- Generous vertical space. No image, no graphic. A single thin horizontal rule spans the hero below the CTAs as a structural cue.

#### Problem section

- Eyebrow: `THE PROBLEM`
- Section head: **Where decisions break down.**
- Body (two paragraphs, max-width 680px):
  > Most organizations do not struggle because the technology is wrong. They struggle because the structure around the decision is not there. Vendors work at cross purposes. Evaluations stall without a defined framework. Implementations drift from their original intent. Over time, ownership becomes diffuse, documentation falls behind, and the environment becomes difficult to govern or change.
  >
  > Carbon Consulting is built to address that directly.

#### Services section

- Eyebrow: `SERVICES`
- Section head: **Five connected areas of practice.**
- Intro paragraph (max-width 680px):
  > Work is organized across five connected areas. Engagements are defined narrowly or run end-to-end, depending on what the situation requires.
- Below the intro, a vertical list of five services. Each service row is separated by a 1px `--rule` top border. Structure:
  - Left column (narrow, ~80px): number "01" through "05" in Instrument Serif 28px, muted blue
  - Right column: title (Instrument Serif 28px) + description (Satoshi 17px, max-width 600px)
- Services (use EXACTLY these titles and descriptions):
  1. **Technology Strategy & Architecture** — Definition of direction: where the environment needs to go, what should be retained, what should be replaced, and in what sequence. Includes architectural review, roadmap development, and decision frameworks for executive and board-level review.
  2. **Vendor & Platform Advisory** — Structured evaluation and selection of software, platforms, and service providers. Requirements definition, shortlist development, reference review, commercial analysis, and a documented, defensible recommendation.
  3. **Program & Implementation Oversight** — Independent oversight of active implementations. Governance, milestone review, risk identification, vendor management, and escalation. Applied where internal capacity or independence is limited.
  4. **Systems & Governance Alignment** — Assessment and restructuring of how systems, processes, and ownership fit together. Clarifies responsibility, reduces redundancy, and establishes documentation and control standards that hold after the engagement ends.
  5. **Vendor Ecosystem Management** — Consolidation and ongoing coordination of the vendor landscape. Rationalization of overlapping tools, renegotiation where warranted, and structural changes that reduce dependency on any single provider or individual.
- Below the list, a small link: **View all services →** (links to `services.html`)

#### Approach section

- Eyebrow: `APPROACH`
- Section head: **How we work.**
- Two short paragraphs:
  > Every engagement is led directly by senior practitioners. There is no layered staffing model. The person evaluating the decision is the person accountable for it.
  >
  > Work is structured. Evaluations follow defined criteria. Recommendations are documented. Trade-offs are made explicit. Clients receive the reasoning, not only the conclusion.
- **Ownership & Continuity callout** (see §3.6 for styling):
  > **Ownership & Continuity**
  > Carbon Consulting structures engagements so ownership remains clear and environments remain transferable. Systems, documentation, and vendor relationships are not tied to ongoing dependence on the firm. When the engagement ends, the client owns the outcome in full.

#### Initial Engagement Options section

- Eyebrow: `INITIAL ENGAGEMENT`
- Section head: **Three structured entry points.**
- Intro: *For organizations considering engagement, three defined reviews are available. Each is a structured initial review — not a sales conversation.*
- Three-column grid (stacked on mobile). Each card has no background, no border, only a 1px `--rule` top border at the top of the card. Padding 32px top.
  - **Website Security Audit** *(Automated)* — A standardized external review of public-facing web properties. Produces a written summary of findings and observations.
    - Link: **Request audit →** (href `/contact.html?inquiry=audit`)
  - **Network Port Scan** *(Automated)* — An external scan of internet-facing infrastructure. Identifies exposed services and common configuration issues. Delivered as a short report.
    - Link: **Request scan →** (href `/contact.html?inquiry=scan`)
  - **30-Minute Strategic Briefing** — A structured discussion on a specific technology question — a pending decision, a stalled evaluation, or a vendor situation. Senior-led, with written follow-up.
    - Link: **Request briefing →** (href `/contact.html?inquiry=briefing`)

#### When Clients Engage section

- Eyebrow: `TYPICAL SITUATIONS`
- Section head: **When clients engage.**
- Intro: *Clients generally engage Carbon Consulting around:*
- Clean list (no bullet points — instead, each item on its own line with a small muted-blue dash or `No. 01`-style prefix, Satoshi 18px):
  - Platform transitions and migrations
  - Vendor evaluations and selection
  - Complex deployments requiring independent oversight
  - Reinforcement or restructuring of IT governance
  - Consolidation of fragmented vendor environments

#### Closing CTA section

Center-aligned. Very generous vertical space (240px top and bottom on desktop).
- **Start the conversation.** (Instrument Serif, 64px)
- Below, the primary CTA: **[Schedule a Consultation]**

---

### 5.4 SERVICES (`services.html`)

- Eyebrow: `SERVICES`
- Page title: **Services**
- Intro paragraph (max-width 680px):
  > Carbon Consulting operates across five service areas. They are defined to function independently or in combination. Most engagements involve more than one, though not always at the same stage.

Then five detailed service sections, each separated by a 1px `--rule` divider. For each service:

- A small number label: "01" / "02" / "03" / "04" / "05" (Instrument Serif, muted blue, 18px)
- Service title (h2, Instrument Serif 40px)
- Positioning paragraph
- A `Scope` subheading (eyebrow style)
- Scope list — simple left-aligned items, each prefixed with a thin 16px muted-blue em-dash `—`

Content:

#### 01 — Technology Strategy & Architecture
> Organizations often arrive with a set of pending decisions — a platform consolidation, a build-versus-buy question, a modernization sequence — and no structured basis for choosing among them. This service establishes that basis.

**Scope**
- Current-state review of the technology environment
- Identification of structural issues and constraints
- Roadmap development with sequencing and dependency
- Decision frameworks for executive and board review
- Architectural recommendations tied to business outcomes

#### 02 — Vendor & Platform Advisory
> Vendor and platform decisions are often made under commercial pressure and incomplete information. This service introduces structured evaluation — defined criteria, comparative analysis, and a recommendation that can withstand scrutiny.

**Scope**
- Requirements definition with stakeholder input
- Market scan and shortlist development
- Structured RFP or evaluation process
- Reference review and due diligence
- Commercial analysis
- Documented recommendation

#### 03 — Program & Implementation Oversight
> Once a decision is made, execution carries its own set of risks — scope drift, vendor performance, integration issues, governance gaps. This service provides independent oversight through the implementation cycle.

**Scope**
- Governance structure and cadence
- Milestone and deliverable review
- Risk identification and escalation
- Vendor and partner management
- Independent status reporting to leadership

#### 04 — Systems & Governance Alignment
> Environments accumulate tools, processes, and informal arrangements that no longer fit. This service assesses how systems and ownership align — and restructures where they do not.

**Scope**
- Inventory of systems, processes, and ownership
- Identification of redundancy and gaps
- Documentation and control standards
- Governance model and policy alignment
- Handoff structure that remains durable after engagement

#### 05 — Vendor Ecosystem Management
> Vendor landscapes expand faster than they are reviewed. The result is overlap, unclear accountability, and structural dependency on specific providers. This service rationalizes the ecosystem and establishes ongoing coordination.

**Scope**
- Consolidation of overlapping tools and contracts
- Renegotiation where warranted
- Dependency reduction across providers and individuals
- Ongoing vendor coordination and review cadence

Closing CTA at bottom of page:
- **Start the conversation.** · [Schedule a Consultation]

---

### 5.5 APPROACH (`approach.html`)

- Eyebrow: `APPROACH`
- Page title: **Approach**
- Opening paragraph (max-width 680px):
  > Carbon Consulting is structured to be useful where generalist advisory firms and vendor-aligned consultancies are not. Every engagement is led by senior practitioners. Work is documented. Recommendations are defensible. Ownership is transferred cleanly.

Then five principle sections, each separated by 1px `--rule`:

#### Senior Involvement
> Engagements are led directly by senior practitioners throughout. There is no staffing layer between the client and the person accountable for the work. The individual evaluating the decision is the individual making the recommendation.

#### Structured Evaluation
> Every evaluation follows a defined framework. Criteria are established before analysis begins. Inputs are gathered systematically. Conclusions are traced to evidence. Where judgment is required, it is stated as judgment.

#### Transparent Process
> Clients see the reasoning behind the work. Trade-offs are made explicit. Assumptions are surfaced. Where information is incomplete, the limitations are named. Recommendations are written to be read and challenged, not accepted on authority.

#### Accountability
> Each engagement has a single accountable lead. Scope, timeline, and deliverables are defined in writing. Progress is reported against that structure. If scope changes, the change is documented before the work continues.

#### Ownership & Continuity
> Carbon Consulting structures engagements so ownership remains clear and environments remain transferable. Systems, documentation, and vendor relationships are not tied to ongoing dependence on the firm. When the engagement ends, the client owns the outcome in full — with the documentation, governance structures, and vendor standing to operate it independently.

Closing CTA.

---

### 5.6 ABOUT (`about.html`)

- Eyebrow: `ABOUT THE FIRM`
- Page title: **About the Firm**
- Three paragraphs (max-width 680px):
  > Carbon Consulting is an independent IT advisory firm. We work with organizations on the decisions that shape their technology environment — strategy, vendor selection, implementation, governance, and ecosystem structure.
  >
  > The firm was established to address a recurring gap: the absence of structured, senior, independent oversight across the full decision-to-execution cycle. Strategy work is often separated from execution. Vendors advocate for their own products. Internal teams are stretched across operations and new initiatives. The result is fragmented decision-making and uneven outcomes.
  >
  > Our engagements are led by senior practitioners with direct operating experience. We are not a reseller, we are not aligned with any platform, and we do not carry incentives from vendors. Recommendations are made on the basis of what the situation requires.

#### Operating Principles

Present as a simple typographic list (no icons, no checkmarks), each item prefixed with `No. 01` through `No. 06` in muted blue Instrument Serif 16px, title in Satoshi 18px 500 weight, one-line description in Satoshi 16px muted:

- **No. 01 — Senior-led engagement** — without staffing layers
- **No. 02 — Structured, documented evaluation**
- **No. 03 — Independence from vendor relationships and incentives**
- **No. 04 — Clear accountability for every engagement**
- **No. 05 — Continuity from decision through execution**
- **No. 06 — Clean transfer of ownership at engagement close**

Closing CTA.

---

### 5.7 CONTACT (`contact.html`)

- Eyebrow: `CONTACT`
- Page title: **Contact**
- Opening (max-width 680px):
  > To discuss an engagement or request an initial briefing, use the form below or contact us directly.

Two-column layout on desktop (form 60%, direct contact 40%), stacked on mobile.

**Left — Form** (`<form>` element, no background, fields separated by 24px vertical rhythm):

Labels above inputs, Satoshi 13px uppercase muted. Inputs are borderless except for a 1px bottom border in `--ink-muted` that becomes 1px solid `--accent` on focus. No placeholder text — labels suffice. 16px top padding, 12px bottom padding on each input. Font inside input: Satoshi 17px.

Fields (in order):
1. Name (text, required)
2. Organization (text, required)
3. Role (text, optional)
4. Email (email, required)
5. Nature of inquiry — `<select>` with options:
   - Engagement inquiry
   - Initial briefing
   - Website security audit
   - Network port scan
   - Other
6. Message (`<textarea>`, 6 rows, required)

**Query-string behavior:** on page load, parse `?inquiry=audit|scan|briefing` and pre-select the corresponding option in the `Nature of inquiry` dropdown. Non-matching values fall through to default (Engagement inquiry).

Submit button: primary CTA style, label **Send**.

**Submission state** (since there's no backend): on submit, client-side validate required fields. If valid, hide the form and show a simple response block:
> **Message received.**
> We'll respond within two business days.

(Instrument Serif 32px head, Satoshi 17px body.)

If any required field is empty, show a 1px `--accent` border under the offending input and a small message below it: *Required.*

**Right — Direct contact block:**

```
Email
contact@carbonconsulting.com

Response time
Within two business days
```

Small type (Satoshi 14px muted for labels, Satoshi 17px for values).

Below the direct contact block, a short secondary paragraph:
> Initial briefings, audits, and scans are treated as structured reviews, not sales conversations. A written response follows every inquiry.

### 5.8 CTA Copy — Master List

Use ONLY these CTA constructions across the entire site:

- Schedule a Consultation
- Contact Us
- Request audit
- Request scan
- Request briefing
- Send
- View all services →

Do not introduce variants.

---

## 6. Implementation Requirements

- **Responsive:** 320px min → 1600px+. Mobile-first CSS.
- **Semantic HTML:** `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`, `<h1>`–`<h3>` in order, `aria-current="page"` on nav.
- **Accessibility:**
  - Visible focus states on all interactive elements (custom focus ring: 2px `--accent` outline, 2px offset).
  - Form inputs have associated `<label>` elements.
  - Color contrast passes WCAG AA at all sizes.
  - Skip link at top of each page: "Skip to content" → `#main`.
  - Honor `prefers-reduced-motion`.
- **Performance:**
  - Preconnect to font CDNs.
  - `font-display: swap`.
  - No third-party scripts.
  - Images (if any are added later): `loading="lazy"`, explicit `width`/`height`, modern formats.
  - Target Lighthouse: Performance ≥ 95, Accessibility ≥ 95, Best Practices ≥ 95, SEO ≥ 95.
- **SEO basics:**
  - Each page has a unique `<title>` (e.g., "Services — Carbon Consulting") and `<meta name="description">`.
  - Open Graph tags with a placeholder OG image reference (`/assets/og-image.png`).
  - Single `favicon.svg`.
- **CSS architecture:**
  - Vanilla CSS. One file. Organized with block comments: `/* === TOKENS === */`, `/* === RESET === */`, `/* === TYPOGRAPHY === */`, `/* === NAV === */`, `/* === FOOTER === */`, `/* === HOME === */`, `/* === SERVICES === */`, etc.
  - Use CSS custom properties for all tokens (palette, type scale, spacing).
  - Use `clamp()` for fluid typography where appropriate.
- **JS:**
  - One `main.js` handling: mobile nav toggle, scroll reveal (IntersectionObserver), form validation and submission state, query-string parsing on contact page.
  - Strict mode. No jQuery. No polyfills needed (target evergreen browsers).
  - Must degrade gracefully — all content visible without JS, form submission still works (show block, no validation).

---

## 7. Quality Bar & Reference Feel

Before shipping, the hero of the home page and the nav/footer should be the first things to look right. Do not move on to other pages until those feel correct.

**Reference feel (the site should read like):**
- A senior advisory firm — Bruce Greenwald, Lazard, Brunswick Group
- An established private-wealth practice
- A serious architecture firm's practice page

**Not like:**
- Stripe, Linear, Notion, Vercel
- A design agency's homepage
- A SaaS product
- A managed IT provider
- A founder's personal brand

If the site starts to feel "tech product-y," stop and revisit typography, spacing, and palette discipline before adding more.

---

## 8. Build Order

1. Scaffold files. Set up `styles.css` with `/* === TOKENS === */` block containing all CSS custom properties. Load fonts in a shared `<head>` partial (inline in each page's head for now — no build system).
2. Implement global nav and footer. Get them pixel-correct on desktop and mobile before anything else.
3. Build the home page hero. Get typography, spacing, and CTA styling right. Review.
4. Build remaining home page sections, top to bottom.
5. Build `services.html`, `approach.html`, `about.html`, `contact.html`.
6. Motion pass: page load stagger + scroll reveals + link underline hover + button hovers. Respect `prefers-reduced-motion`.
7. Responsive pass: test 320, 375, 768, 1024, 1280, 1600.
8. Accessibility pass: tab through every page, verify focus states, verify skip link, verify contrast.
9. Write `README.md` with local-preview instructions (just: "open `index.html` in a browser" or "run `python3 -m http.server`") and deployment notes.
10. Final review: read every page top to bottom, check for typos, confirm tone, confirm CTAs match master list.

---

## 9. Deliverable

A zipped or directory-form static site matching the structure in §2. `README.md` explains how to preview and deploy. No external dependencies beyond the two web font CDNs.

When done, output a short summary of:
- Files produced
- Any deviations from this brief and why
- Any known issues or TODOs

---

*End of master prompt.*
