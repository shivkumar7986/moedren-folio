# 🚀 Personal Portfolio — Inspired by K72.ca

> A production-ready, full-stack personal portfolio built with the latest web technologies. Inspired by the bold editorial aesthetic of [K72.ca](https://k72.ca) — cinematic project showcases, smooth transitions, and a built-in CMS. Agent-native from day one via [skills.sh](https://www.skills.sh).

---

## ✨ Features

- **Editorial hero** with full-screen video/image and live city clock
- **Project case studies** with rich media and scroll-triggered animations
- **Blog** with MDX support and syntax highlighting
- **Admin CMS** — manage projects, posts, and media from a dashboard
- **Dark mode** with system preference detection
- **SEO-first** — meta, OG tags, sitemap, robots.txt auto-generated
- **Contact form** with email notifications via Resend
- **Privacy-first analytics** via Plausible
- **Zero-ops** — Vercel + Supabase, infinitely scalable

---

## 🧠 Agent-Native with skills.sh

This project uses **[skills.sh](https://www.skills.sh)** — an open directory of reusable AI agent skills. Instead of re-explaining conventions every session, skills teach your agent (Claude Code, Cursor, Windsurf, etc.) exactly how to work with each technology.

### Install All Project Skills

```bash
npx skills add vercel-labs/next-skills/next-best-practices
npx skills add vercel-labs/agent-skills/vercel-react-best-practices
npx skills add vercel-labs/agent-skills/vercel-composition-patterns
npx skills add vercel-labs/agent-skills/deploy-to-vercel
npx skills add anthropics/skills/frontend-design
npx skills add pbakaus/impeccable/impeccable
npx skills add pbakaus/impeccable/animate
npx skills add pbakaus/impeccable/audit
npx skills add leonxlnx/taste-skill/design-taste-frontend
npx skills add leonxlnx/taste-skill/high-end-visual-design
npx skills add supabase/agent-skills/supabase
npx skills add supabase/agent-skills/supabase-postgres-best-practices
npx skills add shadcn/ui/shadcn
npx skills add obra/superpowers/executing-plans
npx skills add obra/superpowers/verification-before-completion
npx skills add mattpocock/skills/tdd
npx skills add coreyhaines31/marketingskills/seo-audit
npx skills add anthropics/skills/webapp-testing
```

Once installed, your agent reads the relevant SKILL.md before every task — no more repeated context-setting.

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | Next.js 15 (App Router), React 19, TypeScript |
| **Styling** | Tailwind CSS v4, CSS Variables, Framer Motion |
| **Backend** | Next.js API Routes + tRPC |
| **Database** | PostgreSQL via Supabase |
| **ORM** | Drizzle ORM |
| **Auth** | Supabase Auth (admin only) |
| **Storage** | Supabase Storage |
| **Admin UI** | shadcn/ui |
| **Email** | Resend + React Email |
| **Analytics** | Plausible |
| **Deployment** | Vercel + Supabase |
| **CI/CD** | GitHub Actions |
| **Agent Skills** | skills.sh |

---

## 📁 Project Structure

```
portfolio/
├── apps/
│   └── web/                        # Next.js 15 App Router
│       ├── app/
│       │   ├── (public)/           # Public-facing pages
│       │   │   ├── page.tsx        # Home / Hero
│       │   │   ├── work/           # Projects list + case studies
│       │   │   ├── about/
│       │   │   ├── blog/
│       │   │   └── contact/
│       │   ├── (admin)/            # Protected admin routes
│       │   │   ├── dashboard/
│       │   │   ├── projects/
│       │   │   └── posts/
│       │   └── api/                # tRPC + REST endpoints
│       ├── components/
│       │   ├── ui/                 # Primitive components (shadcn)
│       │   ├── sections/           # Page sections
│       │   └── layout/             # Nav, Footer
│       ├── lib/
│       │   ├── db/                 # Drizzle schema + client
│       │   ├── trpc/               # tRPC routers
│       │   └── utils/
│       └── public/
├── packages/
│   ├── db/                         # Shared DB schema (Drizzle)
│   ├── types/                      # Shared TypeScript types
│   └── config/                     # Shared ESLint, TS config
├── .github/
│   └── workflows/
│       ├── ci.yml
│       └── deploy.yml
├── docker-compose.yml
└── turbo.json
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 20+, pnpm 9+, Docker, Supabase account, Vercel account

### 1. Clone & Install

```bash
git clone https://github.com/yourusername/portfolio.git
cd portfolio
pnpm install
```

### 2. Install Agent Skills

```bash
npx skills add vercel-labs/next-skills/next-best-practices
# ... (full list above)
```

### 3. Environment Variables

```bash
cp .env.example .env.local
```

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
DATABASE_URL=postgresql://postgres:password@localhost:5432/portfolio
RESEND_API_KEY=re_xxxxxxxxxxxx
CONTACT_EMAIL=you@yourdomain.com
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=yourdomain.com
NEXT_PUBLIC_APP_URL=http://localhost:3000
UPSTASH_REDIS_REST_URL=https://...
UPSTASH_REDIS_REST_TOKEN=...
```

### 4. Start Local Database

```bash
docker-compose up -d
pnpm db:migrate
pnpm db:seed
```

### 5. Run Dev Server

```bash
pnpm dev
```

---

## 📦 Scripts

```bash
pnpm dev          # Start dev (Turborepo)
pnpm build        # Build all apps
pnpm lint         # ESLint
pnpm typecheck    # TypeScript check
pnpm test         # Vitest
pnpm db:generate  # Drizzle migration generation
pnpm db:migrate   # Apply migrations
pnpm db:studio    # Open Drizzle Studio
pnpm db:seed      # Seed demo data
```

---

## 🌐 Deployment

### Vercel

1. Connect GitHub repo to Vercel
2. Set all env vars in Vercel dashboard
3. Push to `main` — auto-deploys

### Supabase

1. Create a Supabase project
2. Run `pnpm db:migrate` (production `DATABASE_URL`)
3. Create Storage buckets: `media`, `thumbnails`, `og-images`
4. Enable Auth → Email → add your admin email

---

## 🎨 Design Philosophy

Inspired by K72.ca's editorial boldness:

- **Typography-first** — large confident type as primary design element
- **Motion with purpose** — animations that guide attention
- **Whitespace as a tool** — breathing room between every element
- **Image/video as content** — not decoration
- **Mobile-first** — every interaction designed touch-first

---

## 📝 License

MIT — use freely, credit appreciated.

---

## 👤 Author

**Your Name**  
[yoursite.com](https://yoursite.com) · [LinkedIn](https://linkedin.com) · [GitHub](https://github.com)
