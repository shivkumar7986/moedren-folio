# 📋 IMPLEMENTATION PLAN — Personal Portfolio (K72-Inspired)
## Production-Ready · Execution-Agent Task Breakdown · Powered by skills.sh

**Reference Site:** https://k72.ca  
**Stack:** Next.js 15 · tRPC · Drizzle ORM · PostgreSQL (Supabase) · Tailwind CSS v4 · Framer Motion  
**Monorepo:** Turborepo + pnpm workspaces  
**Deploy:** Vercel + Supabase + GitHub Actions  
**Agent Skills:** https://www.skills.sh

---

# 🧠 SKILLS.SH SETUP — Install Before Any Task

> skills.sh provides reusable SKILL.md files that teach your AI agent (Claude Code, Cursor, Windsurf, etc.)
> *exactly* how to work with each technology — best practices, patterns, and constraints baked in.
> Install once per repo, then every agent session automatically reads the right skill before acting.

## Install the CLI

```bash
npm install -g skills
# or
npx skills add <owner/repo>
```

## Required Skills for This Project

Run these from your repo root **before starting any phase**:

```bash
# ── FRONTEND ──────────────────────────────────────────────────────────────────
npx skills add vercel-labs/agent-skills/vercel-react-best-practices   # React patterns, hooks, performance
npx skills add vercel-labs/next-skills/next-best-practices            # Next.js 15 App Router conventions
npx skills add vercel-labs/agent-skills/web-design-guidelines         # Web design rules for agents
npx skills add vercel-labs/agent-skills/deploy-to-vercel              # Vercel deployment workflow
npx skills add vercel-labs/agent-skills/vercel-composition-patterns   # RSC composition patterns

# ── DESIGN & UI ───────────────────────────────────────────────────────────────
npx skills add anthropics/skills/frontend-design                      # High-quality frontend (top-2 globally)
npx skills add pbakaus/impeccable/impeccable                          # Production-grade UI polish
npx skills add pbakaus/impeccable/frontend-design                     # Impeccable frontend design
npx skills add pbakaus/impeccable/animate                             # Animation best practices
npx skills add pbakaus/impeccable/audit                               # UI audit checklist
npx skills add leonxlnx/taste-skill/design-taste-frontend             # Design taste for frontend
npx skills add leonxlnx/taste-skill/high-end-visual-design            # High-end visual standards
npx skills add leonxlnx/taste-skill/minimalist-ui                     # Minimalist UI principles

# ── DATABASE ──────────────────────────────────────────────────────────────────
npx skills add supabase/agent-skills/supabase-postgres-best-practices # Supabase + Postgres patterns
npx skills add supabase/agent-skills/supabase                         # Supabase general skill

# ── SHADCN/UI (Admin dashboard) ───────────────────────────────────────────────
npx skills add shadcn/ui/shadcn                                        # shadcn/ui component patterns

# ── AGENT WORKFLOW ────────────────────────────────────────────────────────────
npx skills add obra/superpowers/executing-plans                        # How agents execute plans
npx skills add obra/superpowers/systematic-debugging                   # Debug methodology
npx skills add obra/superpowers/test-driven-development                # TDD approach
npx skills add obra/superpowers/verification-before-completion         # Verify before marking done
npx skills add mattpocock/skills/tdd                                   # TDD patterns (Matt Pocock)
npx skills add mattpocock/skills/improve-codebase-architecture         # Architecture improvement
npx skills add mattpocock/skills/to-prd                                # Turn plans into PRDs

# ── SEO & MARKETING (Portfolio needs to be found) ─────────────────────────────
npx skills add coreyhaines31/marketingskills/seo-audit                 # SEO audit skill
npx skills add coreyhaines31/marketingskills/ai-seo                    # AI-era SEO
npx skills add coreyhaines31/marketingskills/content-strategy          # Content strategy

# ── TESTING ───────────────────────────────────────────────────────────────────
npx skills add anthropics/skills/webapp-testing                        # Web app testing patterns
```

## Skill-to-Phase Mapping

| Phase | Active Skills |
|---|---|
| ARCH | `executing-plans`, `improve-codebase-architecture`, `to-prd` |
| DB | `supabase-postgres-best-practices`, `supabase`, `tdd` |
| Backend | `vercel-composition-patterns`, `supabase`, `verification-before-completion` |
| Frontend | `frontend-design`, `impeccable`, `animate`, `vercel-react-best-practices`, `next-best-practices`, `web-design-guidelines`, `design-taste-frontend`, `high-end-visual-design` |
| Admin UI | `shadcn`, `frontend-design`, `impeccable` |
| Deploy | `deploy-to-vercel`, `webapp-testing`, `seo-audit` |

---

# PHASE 0 — ARCHITECTURE DECISIONS

## TASK-ARCH-001: Monorepo Setup
**Agent:** Infrastructure Agent  
**Priority:** P0 (blocking all others)  
**Skills:** `mattpocock/skills/improve-codebase-architecture`, `obra/superpowers/executing-plans`

**Decision:** Turborepo + pnpm workspaces

```
Rationale:
- Shared types between frontend and DB schema
- Single lint/typecheck command across packages
- Incremental builds — only rebuild what changed
- Future-proof: add a mobile app workspace later
```

**Workspace layout:**
```
apps/web          → Next.js 15 App Router (primary app)
packages/db       → Drizzle schema + client (shared)
packages/types    → Shared TypeScript interfaces
packages/config   → Shared ESLint, Tailwind, TS configs
```

**Output files to create:**
- `turbo.json`
- `pnpm-workspace.yaml`
- `package.json` (root)
- `packages/config/eslint.config.js`
- `packages/config/tailwind.config.ts`
- `packages/config/tsconfig.base.json`

---

## TASK-ARCH-002: Rendering Strategy
**Agent:** Frontend Architecture Agent  
**Priority:** P0  
**Skills:** `vercel-labs/next-skills/next-best-practices`, `vercel-labs/agent-skills/vercel-composition-patterns`

**Decision:** Next.js 15 App Router with hybrid rendering

| Route | Strategy | Reason |
|---|---|---|
| `/` (home) | SSG + ISR (1hr) | Rarely changes, must be fast |
| `/work` | SSG + ISR (1hr) | Project list, mostly static |
| `/work/[slug]` | SSG + ISR (1hr) | Case study pages |
| `/blog` | SSG + ISR (30min) | Blog list |
| `/blog/[slug]` | SSG + ISR (30min) | Blog articles |
| `/about` | SSG | Almost never changes |
| `/contact` | CSR | Form, no SEO content needed |
| `/admin/*` | CSR | Protected, no SEO |
| `/api/*` | SSR (Edge Runtime) | API routes |

**Key config:** `export const revalidate = 3600` per route

---

## TASK-ARCH-003: API Layer
**Agent:** Backend Architecture Agent  
**Priority:** P0  
**Skills:** `vercel-labs/agent-skills/vercel-react-best-practices`

**Decision:** tRPC over plain REST

```
Rationale:
- End-to-end type safety (schema shared via packages/types)
- No API documentation needed — types ARE the contract
- Works perfectly with Next.js App Router server components
- Easier refactoring — TS catches breaking changes at compile time
```

**tRPC router structure:**
```
server/
├── routers/
│   ├── projects.ts     → list, getBySlug, create, update, delete
│   ├── posts.ts        → list, getBySlug, create, update, delete
│   ├── contact.ts      → submit (public, rate-limited)
│   └── media.ts        → upload, delete (admin only)
├── middleware/
│   ├── auth.ts         → Supabase session validation
│   └── rateLimit.ts    → Upstash Redis rate limiting
└── trpc.ts             → createTRPCRouter, publicProcedure, adminProcedure
```

---

## TASK-ARCH-004: Auth Strategy
**Agent:** Security Agent  
**Priority:** P0  
**Skills:** `supabase/agent-skills/supabase`

**Decision:** Supabase Auth — email+password, admin-only

```
- No public user registration
- Single admin account (your email)
- JWT stored in httpOnly cookie via Supabase SSR helpers
- Middleware protects all /admin/* routes
- Public API routes use rate limiting (Upstash), not auth
```

**Files:**
- `middleware.ts` → Supabase session check on `/admin/*`
- `lib/supabase/server.ts` → server-side Supabase client
- `lib/supabase/client.ts` → browser-side Supabase client

---

## TASK-ARCH-005: Media Strategy
**Agent:** Infrastructure Agent  
**Priority:** P1  
**Skills:** `supabase/agent-skills/supabase-postgres-best-practices`

**Decision:** Supabase Storage + Next.js Image optimization

```
Buckets:
- "media"        → original uploads (project images, videos)
- "thumbnails"   → auto-generated WebP thumbnails (via Edge Function)
- "og-images"    → OG/social images

Access:
- Public read on all buckets (no signed URLs needed for portfolio)
- Write access: service role key only (server-side admin routes)

Video strategy:
- Short clips (<10MB): store in Supabase Storage
- Long videos: use Vimeo embed (as K72 does)
```

---

# PHASE 1 — DATABASE SCHEMA

## TASK-DB-001: Core Schema Design
**Agent:** Database Agent  
**Priority:** P0  
**Skills:** `supabase/agent-skills/supabase-postgres-best-practices`, `supabase/agent-skills/supabase`

**Technology:** Drizzle ORM + PostgreSQL (Supabase)  
**File:** `packages/db/schema.ts`

```typescript
// ─── PROJECTS TABLE ───────────────────────────────────────────────
export const projects = pgTable("projects", {
  id:           uuid("id").defaultRandom().primaryKey(),
  slug:         text("slug").notNull().unique(),
  title:        text("title").notNull(),
  client:       text("client"),
  year:         integer("year").notNull(),
  tags:         text("tags").array().notNull().default([]),
  summary:      text("summary"),
  description:  text("description"),
  coverImage:   text("cover_image"),
  coverVideo:   text("cover_video"),
  images:       jsonb("images").$type<MediaItem[]>().default([]),
  featured:     boolean("featured").default(false),
  published:    boolean("published").default(false),
  order:        integer("order").default(0),
  seoTitle:     text("seo_title"),
  seoDesc:      text("seo_description"),
  createdAt:    timestamp("created_at").defaultNow().notNull(),
  updatedAt:    timestamp("updated_at").defaultNow().notNull(),
});

// ─── BLOG POSTS TABLE ─────────────────────────────────────────────
export const posts = pgTable("posts", {
  id:           uuid("id").defaultRandom().primaryKey(),
  slug:         text("slug").notNull().unique(),
  title:        text("title").notNull(),
  excerpt:      text("excerpt"),
  content:      text("content").notNull(),
  coverImage:   text("cover_image"),
  tags:         text("tags").array().notNull().default([]),
  published:    boolean("published").default(false),
  publishedAt:  timestamp("published_at"),
  seoTitle:     text("seo_title"),
  seoDesc:      text("seo_description"),
  createdAt:    timestamp("created_at").defaultNow().notNull(),
  updatedAt:    timestamp("updated_at").defaultNow().notNull(),
});

// ─── CONTACT SUBMISSIONS ──────────────────────────────────────────
export const contacts = pgTable("contacts", {
  id:           uuid("id").defaultRandom().primaryKey(),
  name:         text("name").notNull(),
  email:        text("email").notNull(),
  message:      text("message").notNull(),
  ip:           text("ip"),
  read:         boolean("read").default(false),
  createdAt:    timestamp("created_at").defaultNow().notNull(),
});

// ─── SITE SETTINGS (key/value) ────────────────────────────────────
export const settings = pgTable("settings", {
  key:   text("key").primaryKey(),
  value: jsonb("value"),
});

// ─── INDEXES ──────────────────────────────────────────────────────
export const projectsPublishedIdx = index("projects_published_idx")
  .on(projects.published, projects.order);

export const postsPublishedIdx = index("posts_published_idx")
  .on(posts.published, posts.publishedAt);

// Types
export type MediaItem = { url: string; caption?: string; order: number };
export type Project   = typeof projects.$inferSelect;
export type Post      = typeof posts.$inferSelect;
export type Contact   = typeof contacts.$inferSelect;
```

---

## TASK-DB-002: Migrations Setup
**Agent:** Database Agent  
**Priority:** P1  
**Skills:** `supabase/agent-skills/supabase-postgres-best-practices`

**Files to create:**
- `packages/db/drizzle.config.ts`
- `packages/db/migrate.ts`
- `drizzle/` folder (auto-generated by Drizzle Kit)

**Scripts:**
```json
{
  "db:generate": "drizzle-kit generate",
  "db:migrate":  "tsx packages/db/migrate.ts",
  "db:studio":   "drizzle-kit studio",
  "db:seed":     "tsx packages/db/seed.ts"
}
```

---

## TASK-DB-003: Seed Data
**Agent:** Database Agent  
**Priority:** P2  
**Skills:** `supabase/agent-skills/supabase`

Seed 3–5 demo projects and 2 blog posts so the portfolio looks populated on first boot. Realistic placeholder data matching the portfolio's design domain.

---

# PHASE 2 — BACKEND SERVICES

## TASK-BE-001: tRPC Server Setup
**Agent:** Backend Agent  
**Priority:** P0  
**Skills:** `vercel-labs/agent-skills/vercel-composition-patterns`, `vercel-labs/next-skills/next-best-practices`

**Files:**
```
apps/web/server/
├── trpc.ts
├── context.ts
└── routers/
    ├── _app.ts
    ├── projects.ts
    ├── posts.ts
    ├── contact.ts
    └── media.ts
```

**Key patterns:**
```typescript
export const publicProcedure = t.procedure;
export const adminProcedure = t.procedure.use(async ({ ctx, next }) => {
  if (!ctx.session) throw new TRPCError({ code: "UNAUTHORIZED" });
  return next({ ctx: { ...ctx, session: ctx.session } });
});
```

---

## TASK-BE-002: Projects Router
**Agent:** Backend Agent  
**Priority:** P0  
**Skills:** `supabase/agent-skills/supabase-postgres-best-practices`, `obra/superpowers/verification-before-completion`

```
Procedures:
  list           (public)  → published=true, ordered by order ASC
  listAll        (admin)   → all projects, any status
  getBySlug      (public)  → single published project
  getBySlugAdmin (admin)   → single project, any status
  create         (admin)   → insert + revalidatePath("/work")
  update         (admin)   → update + revalidate slug
  delete         (admin)   → soft delete + revalidate
  reorder        (admin)   → bulk update order field
```

---

## TASK-BE-003: Posts Router
**Agent:** Backend Agent  
**Priority:** P1  
**Skills:** `supabase/agent-skills/supabase`, `vercel-labs/agent-skills/vercel-composition-patterns`

```
Procedures:
  list           (public)  → published=true, sorted by publishedAt DESC
  listAll        (admin)   → all posts
  getBySlug      (public)  → single published post
  getBySlugAdmin (admin)   → any status
  create / update / delete (admin)

MDX:
  - Store raw MDX in DB
  - Compile at request time with next-mdx-remote/rsc
  - Cache with React cache()
```

---

## TASK-BE-004: Contact Router
**Agent:** Backend Agent  
**Priority:** P1  
**Skills:** `supabase/agent-skills/supabase`, `obra/superpowers/verification-before-completion`

```
submit (public, rate-limited):
  1. Zod validate: name min 2, email valid, message min 10
  2. Rate limit: 3 per IP per hour (Upstash Redis)
  3. Insert into contacts table
  4. Send notification email via Resend
  5. Return { success: true }

list / markRead (admin)
```

---

## TASK-BE-005: Media Router
**Agent:** Backend Agent  
**Priority:** P1  
**Skills:** `supabase/agent-skills/supabase`

```
getUploadUrl (admin):
  - Generate Supabase Storage signed upload URL
  - Frontend uploads directly to Supabase (no server proxy)
  - Returns { url, path, publicUrl }

delete (admin):
  - Delete from Supabase Storage by path
```

---

## TASK-BE-006: Rate Limiting Middleware
**Agent:** Backend Agent  
**Priority:** P1

Technology: Upstash Redis + @upstash/ratelimit  
File: `server/middleware/rateLimit.ts`

```typescript
const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(3, "1 h"),
});
```

---

## TASK-BE-007: Email Service
**Agent:** Backend Agent  
**Priority:** P1

Technology: Resend + React Email

```
emails/
├── ContactNotification.tsx
└── ContactConfirmation.tsx

lib/email.ts  →  Resend client wrapper
```

---

# PHASE 3 — FRONTEND SERVICES

## TASK-FE-001: Base Next.js App Setup
**Agent:** Frontend Agent  
**Priority:** P0  
**Skills:** `vercel-labs/next-skills/next-best-practices`, `anthropics/skills/frontend-design`, `leonxlnx/taste-skill/high-end-visual-design`

**Config files:**
- `next.config.ts` — image domains (Supabase), bundle analyzer
- `tailwind.config.ts` (v4) — design tokens
- `app/layout.tsx` — root layout with fonts, providers
- `app/globals.css` — CSS variables, base styles

**Fonts:**
```typescript
import { Inter, Playfair_Display } from "next/font/google";
// Playfair Display → headings (editorial feel like K72)
// Inter → body text
```

**CSS Custom Properties:**
```css
:root {
  --font-heading: "Playfair Display", serif;
  --font-body:    "Inter", sans-serif;
  --color-bg:     #0a0a0a;
  --color-fg:     #f5f5f5;
  --color-accent: #e8e020;
  --color-muted:  #888888;
  --spacing-page: clamp(1.5rem, 5vw, 4rem);
}
```

---

## TASK-FE-002: Navigation Component
**Agent:** Frontend Agent  
**Priority:** P0  
**Skills:** `anthropics/skills/frontend-design`, `pbakaus/impeccable/impeccable`, `vercel-labs/agent-skills/web-design-guidelines`

```
Features:
- Fixed top nav with blur backdrop
- Logo (text-based, animated on hover)
- Links: Work, About, Blog, Contact
- Live clock: "YOURCITY_HH:MM:SS" (updates every second via useEffect)
- Hamburger menu on mobile (full-screen overlay)
- Framer Motion page transition trigger
- Active link highlighting
```

---

## TASK-FE-003: Home Page — Hero Section
**Agent:** Frontend Agent  
**Priority:** P0  
**Skills:** `anthropics/skills/frontend-design`, `pbakaus/impeccable/animate`, `leonxlnx/taste-skill/design-taste-frontend`, `leonxlnx/taste-skill/high-end-visual-design`

```
Layout (K72-inspired):
  - Full viewport height
  - Background: dark solid or subtle video loop
  - Large editorial headline with word-by-word reveal
  - Subtext with fade-in (300ms delay)
  - Two CTAs: "View Work" + "About Me" — slide-up stagger
  - Live clock overlay (bottom-left, monospace)
  - Scroll indicator (animated)
```

---

## TASK-FE-004: Work / Projects List Page
**Agent:** Frontend Agent  
**Priority:** P0  
**Skills:** `anthropics/skills/frontend-design`, `pbakaus/impeccable/impeccable`, `vercel-labs/agent-skills/vercel-react-best-practices`, `leonxlnx/taste-skill/design-taste-frontend`

```
Layout:
  - "Work — 12" editorial title with count badge
  - Masonry/editorial grid of project cards
  - Card: full-bleed cover image/video, title, client + year
  - Hover: scale + brightness on image, overlay text reveal
  - Page enter: staggered card reveal (Framer Motion)
```

---

## TASK-FE-005: Project Case Study Page
**Agent:** Frontend Agent  
**Priority:** P0  
**Skills:** `anthropics/skills/frontend-design`, `pbakaus/impeccable/animate`, `vercel-labs/next-skills/next-best-practices`, `leonxlnx/taste-skill/high-end-visual-design`

```
Layout:
  - Full-bleed cover image/video (viewport height)
  - Info bar: Client / Year / Tags
  - Long-form MDX case study content
  - Lightbox image gallery
  - Video embed (Vimeo or HTML5)
  - Next/Prev project navigation

SEO:
  - generateMetadata() — dynamic title, description, OG image
  - generateStaticParams() — full SSG for all published projects

Animations:
  - Parallax scroll on hero image
  - Fade-in sections on scroll (Framer Motion + Intersection Observer)
```

---

## TASK-FE-006: About Page
**Agent:** Frontend Agent  
**Priority:** P1  
**Skills:** `anthropics/skills/frontend-design`, `pbakaus/impeccable/impeccable`, `leonxlnx/taste-skill/design-taste-frontend`

```
Sections:
  1. Intro: large portrait photo + headline
  2. Bio: 2-3 paragraphs
  3. Skills grid: technology badges
  4. Experience timeline
  5. "Let's work together" CTA → /contact
```

---

## TASK-FE-007: Blog List + Article Pages
**Agent:** Frontend Agent  
**Priority:** P1  
**Skills:** `anthropics/skills/frontend-design`, `vercel-labs/next-skills/next-best-practices`, `coreyhaines31/marketingskills/content-strategy`

```
Blog list:   editorial grid, cover image, title, date, excerpt, read time, tag filter
Article:     MDX rendering, reading progress bar, author block, related posts, social share

MDX custom components:
  <Callout>   — highlighted note
  <CodeBlock> — Shiki syntax highlighting
  <Image>     — Next.js Image with caption
  <Video>     — HTML5 or Vimeo embed
```

---

## TASK-FE-008: Contact Page
**Agent:** Frontend Agent  
**Priority:** P1  
**Skills:** `anthropics/skills/frontend-design`, `pbakaus/impeccable/impeccable`

```
- Large headline: "Let's build something"
- Form: Name, Email, Message
- React Hook Form + Zod client-side validation
- tRPC mutation: contact.submit
- Optimistic UI, success/error states
- Social links: GitHub, LinkedIn, Email
```

---

## TASK-FE-009: Admin Dashboard
**Agent:** Frontend Agent  
**Priority:** P1  
**Skills:** `shadcn/ui/shadcn`, `anthropics/skills/frontend-design`, `supabase/agent-skills/supabase`

```
app/(admin)/
├── layout.tsx          ← auth check, sidebar nav
├── dashboard/          ← stats: project count, post count, unread contacts
├── projects/           ← table + create/edit forms
│   ├── new/
│   └── [id]/
├── posts/              ← MDX editor + preview
│   ├── new/
│   └── [id]/
└── contacts/           ← submissions inbox with read/unread

UI: shadcn/ui components throughout admin
Project form fields:
  Title, Client, Year, Slug (auto-gen), Tags, Summary,
  Description (MDX), Cover image upload, Gallery, Video URL,
  Featured toggle, Published toggle
```

---

## TASK-FE-010: Animations & Transitions
**Agent:** Frontend Agent  
**Priority:** P1  
**Skills:** `pbakaus/impeccable/animate`, `pbakaus/impeccable/impeccable`, `vercel-labs/agent-skills/web-design-guidelines`

```
Global page transitions:   slide-up reveal on route change (AnimatePresence in layout)
Scroll animations:         useInView → fade+slide up, staggered children, parallax on hero
Micro-interactions:        button hover, nav underline slide, image scale (1.02)
Live clock:                number flip (CSS only)
Performance rules:
  - transform/opacity only (GPU composited)
  - Respect prefers-reduced-motion via Framer Motion config
```

---

## TASK-FE-011: SEO & Metadata
**Agent:** Frontend Agent  
**Priority:** P1  
**Skills:** `coreyhaines31/marketingskills/seo-audit`, `coreyhaines31/marketingskills/ai-seo`, `vercel-labs/next-skills/next-best-practices`

```
app/sitemap.ts          → dynamic sitemap (all published projects + posts)
app/robots.ts           → allow all, disallow /admin
app/opengraph-image.tsx → auto-generated OG image (Next.js built-in)

Per-page: generateMetadata() with title, description, OG image, canonical URL
```

---

# PHASE 4 — API CONTRACTS

## TASK-API-001: tRPC Procedure Contracts
**Skills:** `obra/superpowers/verification-before-completion`, `mattpocock/skills/tdd`

### projects.list
```typescript
Input:  void
Output: Project[]  // published only, ordered by order ASC
Cache:  ISR 1hr
```

### projects.getBySlug
```typescript
Input:  { slug: string }
Output: Project | null
Error:  NOT_FOUND if unpublished or missing
```

### projects.create (admin)
```typescript
Input: {
  title, client?, year, slug, tags: string[],
  summary?, description?, coverImage?, coverVideo?,
  featured: boolean, published: boolean
}
Output: Project
Side effects: revalidatePath("/work")
```

### posts.list
```typescript
Input:  { limit?: number, tag?: string }
Output: Omit<Post, "content">[]   // no content in list
Cache:  ISR 30min
```

### contact.submit
```typescript
Input:  { name: string, email: string, message: string }
Output: { success: true }
Errors: TOO_MANY_REQUESTS | INTERNAL_SERVER_ERROR
```

### media.getUploadUrl (admin)
```typescript
Input:  { filename, mimeType, bucket: "media" | "thumbnails" }
Output: { uploadUrl, publicUrl, path }
```

---

# PHASE 5 — DEPLOYMENT WORKFLOW

## TASK-DEPLOY-001: Local Development
**Agent:** DevOps Agent  
**Priority:** P0  
**Skills:** `vercel-labs/agent-skills/deploy-to-vercel`

**`docker-compose.yml`:**
```yaml
services:
  postgres:
    image: postgres:16-alpine
    ports: ["5432:5432"]
    environment:
      POSTGRES_DB: portfolio
      POSTGRES_PASSWORD: password
    volumes: ["pgdata:/var/lib/postgresql/data"]
  redis:
    image: redis:7-alpine
    ports: ["6379:6379"]
volumes:
  pgdata:
```

**Bootstrap:**
```bash
docker-compose up -d
pnpm db:migrate
pnpm db:seed
pnpm dev
```

---

## TASK-DEPLOY-002: Supabase Production Setup
**Agent:** DevOps Agent  
**Priority:** P0  
**Skills:** `supabase/agent-skills/supabase`, `supabase/agent-skills/supabase-postgres-best-practices`

```
1. Create Supabase project
2. pnpm db:migrate (production DATABASE_URL)
3. Create Storage buckets: media, thumbnails, og-images
4. Set bucket policies: public read, service-role write
5. Enable Auth → Email provider → add admin email
6. Copy env vars to Vercel
```

---

## TASK-DEPLOY-003: Vercel Production Setup
**Agent:** DevOps Agent  
**Priority:** P0  
**Skills:** `vercel-labs/agent-skills/deploy-to-vercel`

**`vercel.json`:**
```json
{
  "framework": "nextjs",
  "buildCommand": "pnpm build",
  "installCommand": "pnpm install"
}
```

**Required env vars:**
```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
DATABASE_URL
RESEND_API_KEY
CONTACT_EMAIL
UPSTASH_REDIS_REST_URL
UPSTASH_REDIS_REST_TOKEN
NEXT_PUBLIC_APP_URL
NEXT_PUBLIC_PLAUSIBLE_DOMAIN
```

---

## TASK-DEPLOY-004: GitHub Actions CI/CD
**Agent:** DevOps Agent  
**Priority:** P1  
**Skills:** `obra/superpowers/verification-before-completion`, `mattpocock/skills/tdd`

**`.github/workflows/ci.yml`:**
```yaml
name: CI
on: [push, pull_request]
jobs:
  ci:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v3
      - uses: actions/setup-node@v4
        with: { node-version: "20", cache: "pnpm" }
      - run: pnpm install --frozen-lockfile
      - run: pnpm typecheck
      - run: pnpm lint
      - run: pnpm test
```

---

## TASK-DEPLOY-005: Performance & SEO Audit
**Agent:** DevOps Agent  
**Priority:** P1  
**Skills:** `coreyhaines31/marketingskills/seo-audit`, `pbakaus/impeccable/audit`, `anthropics/skills/webapp-testing`

| Metric | Target |
|---|---|
| Lighthouse Performance | ≥ 95 |
| Lighthouse Accessibility | ≥ 95 |
| LCP | < 2.0s |
| CLS | < 0.05 |
| TTFB | < 200ms |
| JS bundle (gzipped) | < 150KB |

**Audit skills to run before launch:**
```bash
# Your agent will use these skill files to run structured audits
# pbakaus/impeccable/audit   → visual polish checklist
# coreyhaines31/seo-audit    → SEO completeness check
# anthropics/webapp-testing  → functional test patterns
```

---

# EXECUTION ORDER

```
Week 1:  skills.sh install → ARCH-001→005, DB-001→002, BE-001
Week 2:  BE-002→007 (all backend routers)
Week 3:  FE-001→005 (base + public pages: home, work, case study)
Week 4:  FE-006→009 (about, blog, contact, admin dashboard)
Week 5:  FE-010→011 + DB-003 (animations, SEO, seed data)
Week 6:  DEPLOY-001→005 + audits (impeccable/audit + seo-audit)
```

---

## Dependencies Graph

```
skills.sh install (ALL) ──► unblocks every task below

ARCH-001 ──► DB-001 ──► BE-001 ──► BE-002 ──► FE-004
                                 ├──► BE-003 ──► FE-007
                                 ├──► BE-004 ──► FE-008
                                 └──► BE-005 ──► FE-009

ARCH-002 ──► FE-001 ──► FE-002 ──► FE-003
ARCH-004 ──► BE-001 ──► FE-009 (admin auth)
ARCH-005 ──► BE-005 ──► FE-009 (media upload)

All FE tasks ──► DEPLOY-001
DEPLOY-001 ──► DEPLOY-002 ──► DEPLOY-003 ──► DEPLOY-004 ──► DEPLOY-005
```

---

*Total tasks: 27 | Skills installed: 25 | Estimated timeline: 6 weeks solo / 2–3 weeks with 2 agents*
