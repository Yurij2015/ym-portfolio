# Service page copy editing prompt

Skills: `.agents/skills/technical-author` (voice, structure, review checklist), `.agents/skills/seo-audit/references/ai-writing-detection.md` (AI-writing tells), `.agents/skills/copywriting/references/natural-transitions.md` (transitions).

## Task

Edit the service pages of Yurii Mokryi's personal portfolio: `content/uk/services/*.yml` first (source of truth), then `content/en` and `content/pl`. The reader is a product owner or technical lead deciding whether to get in touch. After reading a page they should know what kind of task to bring, what will be done and handed over, what to send for an estimate and how the price is formed.

## Voice

- First person singular, calm and matter-of-fact. Write like a developer telling a colleague what he works on, not like someone selling himself.
- State facts without amplification. "I work on ticket shops built with Symfony" — yes. "My main commercial experience is high-load…" — no.
- No scenes or dramatization: "a wave of buyers", "the system must survive the peak", "never sell a seat twice", "within minutes everyone wants…".
- No self-presentation constructions: "my main experience is…", "deep expertise in…", "I'm the developer who…". The word "main" is fine when it means "the main workflow", not when it frames a boast.
- Don't stack adjectives ("high-load multi-tenant ticket shops"). One qualifier per mention; anything else goes into a separate sentence, and only if it adds information.
- Weave technologies into ordinary sentences. No "Stack: …" lines.
- Don't repeat the same experience description across pages. Give the full description once, on the most relevant page; elsewhere use a short reference.

## Facts and boundaries

- Sources: `content/uk/projects/*.yml`, `content/uk/about.yml`. Do not invent clients, load figures, metrics, testimonials or certifications.
- Commercial work: multi-tenant ticket shops selling tickets for football, basketball, motorcycle and car racing, museums, exhibitions and festivals. Symfony with Doctrine, MySQL, Redis, queues, Vue.js, Stripe and Dalenys payments. Do not name clients or events (Formula 1, MotoGP, etc.) on service pages.
- Payment providers from experience: Stripe (VetSpace via Cashier; ticket shops), Dalenys (ticket shops), Revolut.
- Own projects: VetSpace — clinic CRM, separate database per clinic, Stripe subscriptions; VetCard — Nuxt SSR clinic pages and online booking via a Laravel API; DigiPulse — Laravel/Filament, checks in a separate Go service, Redis, MCP, Telegram/email alerts; NetPostPanel — source discovery, generation, Horizon, Qdrant, Langfuse, external API; DigiSpace — multilingual Laravel CMS with Filament alongside an older Inertia/Vue admin.
- Do not change slug, icon, group, order, priceFrom, priceUnit, technologies, projects or `indexable`. The price is a guide for a first agreed stage, not a package.
- Do not add SLAs, guarantees, free work or contractual terms.

## Language and rhythm

- At most one em dash (—) per page. Instead of "From $X — a guide for…" write "From $X is a guide for…" or restructure the sentence.
- Avoid bureaucratic phrasing and AI tells: "comprehensive", "robust", "efficient", "key", "it is worth noting", "in today's…", "not only … but also …", triplets of adjectives (and their uk/pl equivalents: «комплексний», «надійний», «ключовий», «варто зазначити», «не лише …, а й …»).
- Don't end every page with the same formula ("Send… The price from… is a guide…"). The information stays; the wording can vary.
- Cut repetition of "agree", "scope", "scenario", "first stage", "separately" (uk: «погоджуємо», «обсяг», «сценарій», «перший етап», «окремо»).
- Short paragraphs, active voice, concrete verbs. Keep a technical term when it explains the work.

## What goes where

- `title`: the service name, no evaluative adjectives.
- `description` (≤160 chars): what the work is and who it is for.
- `summary` (~35–60 words): which tasks I take on and how the work ends.
- `deliverables`: what the client receives and will use.
- `process`: three steps, each an action rather than "we agree".
- `content`: one relevant example from experience, specifics of the service, what to send for an estimate, how the price works.
- `faq`: real questions about starting, limits and handover; answers must not restate `content`.

## Translation

After the Ukrainian text, prepare en and pl versions with the same facts, prices and caveats. Translate meaning, not words. Polish: decline product names («Laravela», «w Laravelu») and use «Ty» consistently. English: plain English, no marketing adjectives.

## Review

1. The reader knows what to order, what they get, what to send and how the price is formed.
2. No dramatization, self-presentation, stacked adjectives or "Stack:" lines.
3. At most one em dash per page; none of the AI-tell words.
4. The commercial experience description is not duplicated verbatim across pages.
5. Facts match `projects/` and `about.yml`; prices match across all three locales.
6. YAML parses; no Cyrillic in en/pl.
7. Do not run the dev server or vitest. Do not commit without permission.
