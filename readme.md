<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:7c3aed,50:4f46e5,100:2563eb&height=180&section=header&text=JoshTVR%20Portfolio&fontSize=52&fontAlignY=38&animation=fadeIn&desc=Full-stack%20personal%20portfolio%20·%20Next.js%2014%20+%20Supabase%20+%20Stripe&descAlignY=60&descSize=16&fontColor=ffffff"/>

<br/>

[![Live](https://img.shields.io/badge/Live-joshtvr.com-7c3aed?style=for-the-badge&logo=vercel&logoColor=white)](https://joshtvr.com)
[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?style=for-the-badge&logo=typescript&logoColor=white)](https://typescriptlang.org)
[![Supabase](https://img.shields.io/badge/Supabase-DB%20+%20Auth-3ecf8e?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com)
[![Stripe](https://img.shields.io/badge/Stripe-Payments-635bff?style=for-the-badge&logo=stripe&logoColor=white)](https://stripe.com)

</div>

---

## Overview

Personal portfolio and business platform for **Joshua Hernandez (JoshTVR)** — VR developer, 3D artist, and data scientist based in Hidalgo, Mexico.

Built as a production-grade full-stack app: content managed through a custom admin panel, GitHub stats synced automatically, payments via Stripe, and a bilingual (EN/ES) interface using next-intl.

---

## Features

| Module | Description |
|---|---|
| **Portfolio** | Projects, experience, certifications, and testimonials — all managed from admin |
| **Open Source** | GitHub repos auto-synced every 6h via REST API, linkable to full projects |
| **GitHub Stats** | Live contribution heatmap, top languages, streak — cached in Supabase |
| **Store** | Stripe Checkout for digital/physical products with stock management |
| **Services** | Service catalog with variants and custom inquiry flow |
| **CV System** | 8 HTML/PDF CV variants (EN/ES × role) with public download pages |
| **Admin Panel** | Full CRUD for all content — projects, store, orders, CVs, testimonials, notes |
| **i18n** | Full bilingual EN/ES with next-intl and locale routing |

---

## Tech Stack

<div align="center">

[![Next.js](https://skillicons.dev/icons?i=nextjs)](https://nextjs.org)
[![TypeScript](https://skillicons.dev/icons?i=ts)](https://typescriptlang.org)
[![Supabase](https://skillicons.dev/icons?i=supabase)](https://supabase.com)
[![PostgreSQL](https://skillicons.dev/icons?i=postgres)](https://postgresql.org)
[![Vercel](https://skillicons.dev/icons?i=vercel)](https://vercel.com)
[![Figma](https://skillicons.dev/icons?i=figma)](https://figma.com)

</div>

**Core dependencies**
- `next` 14 — App Router, Server Components, Server Actions
- `next-intl` — bilingual routing (EN/ES)
- `@supabase/ssr` — auth + DB + storage
- `stripe` + `@stripe/stripe-js` — checkout + webhook
- `@tiptap/react` — rich-text editor for admin content
- `three` + `@react-three/fiber` — 3D scene in hero section
- `framer-motion` — section animations

---

## Project Structure

```
app/
├── [locale]/          # Public routes (EN + ES)
│   ├── page.tsx       # Homepage — all sections
│   ├── cv/[slug]/     # Public CV download pages
│   ├── orders/        # Customer order history
│   └── store/         # Product listing
├── admin/             # Protected admin panel
│   ├── projects/      # Projects CRUD
│   ├── store/         # Product management
│   ├── orders/        # Order management
│   ├── cvs/           # CV upload + toggle
│   ├── testimonials/  # Testimonials CRUD
│   ├── services/      # Services CRUD
│   └── notes/         # Private notes & plans
├── api/
│   ├── github/refresh # Manual cache refresh
│   ├── stripe/        # Checkout + webhook
│   └── admin/upload   # Image/file uploads
components/
├── sections/          # Homepage sections (Server Components)
├── layout/            # Navbar, Footer, AdminSidebar
└── admin/editors/     # Rich-text + form editors
lib/
├── github/            # GitHub API + cache (TTL 6h)
├── stripe/            # Stripe client singleton
└── supabase/          # Client / server / admin clients
public/cv/             # 8 HTML CV files (print-to-PDF)
```

---

## Local Setup

### 1. Clone and install

```bash
git clone https://github.com/JoshTVR/JoshTVR-Portfolio.git
cd JoshTVR-Portfolio
npm install
```

### 2. Environment variables

Copy the example file and fill in your values:

```bash
cp .env.example .env.local
```

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (admin only) |
| `GITHUB_TOKEN` | GitHub PAT for stats/repo API |
| `GITHUB_USERNAME` | GitHub username (e.g. `JoshTVR`) |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key |
| `STRIPE_SECRET_KEY` | Stripe secret key |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret |
| `NEXT_PUBLIC_SITE_URL` | Canonical URL (e.g. `https://joshtvr.com`) |
| `RESEND_API_KEY` | Optional — email notifications for inquiries |

### 3. Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Admin panel at [http://localhost:3000/admin](http://localhost:3000/admin) — requires Supabase auth (invite-only).

---

## Deployment

Deployed on **Vercel** with automatic deployments on push to `main`.

Stripe webhooks must point to `https://yourdomain.com/api/stripe/webhook`.

GitHub Actions runs the contribution snake animation on a schedule — requires `GITHUB_TOKEN` with write access to `JoshTVR/JoshTVR`.

---

<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:2563eb,50:4f46e5,100:7c3aed&height=100&section=footer&animation=fadeIn"/>

</div>
