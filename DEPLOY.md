# Deployment Guide — JoshTVR Platform

## 1. Supabase Setup

### Create project at supabase.com, then run this SQL in the SQL editor:

```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TABLE projects (
  id             uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug           text UNIQUE NOT NULL,
  title_en       text NOT NULL,
  title_es       text NOT NULL,
  description_en text NOT NULL,
  description_es text NOT NULL,
  content_en     text,
  content_es     text,
  category       text NOT NULL CHECK (category IN ('vr','ar','data','backend','design','3d','video')),
  tech_tags      text[] NOT NULL DEFAULT '{}',
  github_url     text,
  demo_url       text,
  cover_image    text,
  images         text[] DEFAULT '{}',
  is_published   boolean NOT NULL DEFAULT false,
  is_featured    boolean NOT NULL DEFAULT false,
  sort_order     integer NOT NULL DEFAULT 0,
  created_at     timestamptz NOT NULL DEFAULT now(),
  updated_at     timestamptz NOT NULL DEFAULT now()
);
CREATE TRIGGER trg_projects_updated_at BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TABLE products (
  id                uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name_en           text NOT NULL,
  name_es           text NOT NULL,
  description_en    text NOT NULL,
  description_es    text NOT NULL,
  type              text NOT NULL CHECK (type IN ('physical','digital','commission')),
  price             integer NOT NULL,
  currency          text NOT NULL DEFAULT 'usd',
  images            text[] DEFAULT '{}',
  stripe_price_id   text,
  stripe_product_id text,
  is_active         boolean NOT NULL DEFAULT false,
  stock             integer,
  created_at        timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE services (
  id              uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  title_en        text NOT NULL,
  title_es        text NOT NULL,
  description_en  text NOT NULL,
  description_es  text NOT NULL,
  features        text[] DEFAULT '{}',
  price_from      integer,
  currency        text NOT NULL DEFAULT 'usd',
  category        text NOT NULL,
  is_active       boolean NOT NULL DEFAULT true,
  sort_order      integer NOT NULL DEFAULT 0,
  created_at      timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE orders (
  id                    uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  stripe_session_id     text UNIQUE NOT NULL,
  product_id            uuid REFERENCES products(id) ON DELETE SET NULL,
  customer_email        text NOT NULL,
  customer_name         text,
  amount                integer NOT NULL,
  currency              text NOT NULL DEFAULT 'usd',
  status                text NOT NULL DEFAULT 'pending'
                          CHECK (status IN ('pending','paid','failed','refunded')),
  stripe_payment_intent text,
  metadata              jsonb DEFAULT '{}',
  created_at            timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE inquiries (
  id          uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  service_id  uuid REFERENCES services(id) ON DELETE SET NULL,
  name        text NOT NULL,
  email       text NOT NULL,
  message     text NOT NULL,
  budget      text,
  status      text NOT NULL DEFAULT 'new'
                CHECK (status IN ('new','read','replied')),
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE experience (
  id              uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  role_en         text NOT NULL,
  role_es         text NOT NULL,
  company         text NOT NULL,
  description_en  text NOT NULL,
  description_es  text NOT NULL,
  tags            text[] DEFAULT '{}',
  start_date      date NOT NULL,
  end_date        date,
  sort_order      integer NOT NULL DEFAULT 0,
  created_at      timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE certifications (
  id         uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name_en    text NOT NULL,
  name_es    text NOT NULL,
  issuer     text NOT NULL,
  year       integer NOT NULL,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE testimonials (
  id              uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  quote_en        text NOT NULL,
  quote_es        text NOT NULL,
  author_name     text NOT NULL,
  author_role_en  text NOT NULL,
  author_role_es  text NOT NULL,
  is_visible      boolean NOT NULL DEFAULT true,
  sort_order      integer NOT NULL DEFAULT 0,
  created_at      timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE settings (
  key        text PRIMARY KEY,
  value      jsonb NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);
INSERT INTO settings (key, value) VALUES
  ('store_visible',     'false'),
  ('about_text_en',     '"I am a passionate developer..."'),
  ('about_text_es',     '"Soy un desarrollador apasionado..."'),
  ('about_stat1_value', '"30"'),
  ('about_stat2_value', '"4"'),
  ('about_stat3_value', '"5"'),
  ('about_stat4_value', '"2"'),
  ('sections_visible',  '{"github_stats":true,"testimonials":true,"store_nav":false}');

CREATE TABLE github_cache (
  key        text PRIMARY KEY,
  data       jsonb NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- RLS
ALTER TABLE projects       ENABLE ROW LEVEL SECURITY;
ALTER TABLE products       ENABLE ROW LEVEL SECURITY;
ALTER TABLE services       ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders         ENABLE ROW LEVEL SECURITY;
ALTER TABLE inquiries      ENABLE ROW LEVEL SECURITY;
ALTER TABLE experience     ENABLE ROW LEVEL SECURITY;
ALTER TABLE certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials   ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings       ENABLE ROW LEVEL SECURITY;
ALTER TABLE github_cache   ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public_read_projects"       ON projects       FOR SELECT USING (is_published = true);
CREATE POLICY "public_read_products"       ON products       FOR SELECT USING (is_active = true);
CREATE POLICY "public_read_services"       ON services       FOR SELECT USING (is_active = true);
CREATE POLICY "public_read_experience"     ON experience     FOR SELECT USING (true);
CREATE POLICY "public_read_certifications" ON certifications FOR SELECT USING (true);
CREATE POLICY "public_read_testimonials"   ON testimonials   FOR SELECT USING (is_visible = true);
CREATE POLICY "public_read_settings"       ON settings       FOR SELECT USING (true);
CREATE POLICY "public_read_github_cache"   ON github_cache   FOR SELECT USING (true);
CREATE POLICY "public_insert_inquiries"    ON inquiries      FOR INSERT WITH CHECK (true);

-- Stock decrement function (used by Stripe webhook)
CREATE OR REPLACE FUNCTION decrement_stock(product_id uuid)
RETURNS void AS $$
  UPDATE products SET stock = stock - 1 WHERE id = product_id AND stock > 0;
$$ LANGUAGE sql;
```

### Storage bucket
- Go to Storage → New bucket
- Name: `project-images`
- Public: yes

### GitHub OAuth
- Go to Authentication → Providers → GitHub
- Enable it
- Add Client ID and Secret from: github.com/settings/applications/new
  - Homepage URL: `https://joshtvr.com`
  - Callback URL: `https://<your-supabase-project>.supabase.co/auth/v1/callback`

---

## 2. Environment Variables

Create `.env.local` in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

GITHUB_TOKEN=ghp_...
GITHUB_USERNAME=JoshTVR

NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

NEXT_PUBLIC_SITE_URL=https://joshtvr.com
NEXT_PUBLIC_DEFAULT_LOCALE=en
ADMIN_GITHUB_USERNAME=JoshTVR

NOTIFICATION_EMAIL=joshtvr4@gmail.com
```

---

## 3. Vercel Deploy

```bash
npm i -g vercel
vercel --prod
```

Or connect GitHub repo at vercel.com and add all env vars in Project Settings → Environment Variables.

### Custom domain
- Vercel → Project → Settings → Domains → Add `joshtvr.com`
- Point DNS: CNAME `www` → `cname.vercel-dns.com`, A `@` → `76.76.21.21`

---

## 4. Stripe Webhook

After deploying to Vercel:
1. Go to dashboard.stripe.com → Developers → Webhooks
2. Add endpoint: `https://joshtvr.com/api/stripe/webhook`
3. Events to listen: `checkout.session.completed`
4. Copy the signing secret → paste as `STRIPE_WEBHOOK_SECRET` in Vercel env vars
5. Redeploy (or the env var will take effect on next deploy)

---

## 5. Smoke Test Checklist

- [ ] `https://joshtvr.com/en` loads home page
- [ ] Language toggle switches EN ↔ ES
- [ ] `/en/services` shows services from admin
- [ ] `/admin/login` → GitHub OAuth → only JoshTVR gets in
- [ ] Create a project in admin → appears at `/en`
- [ ] GitHub Stats section shows heatmap (requires GITHUB_TOKEN)
- [ ] Enable store in Settings → `/en/store` appears in nav
- [ ] Stripe test checkout → success page → order in `/admin/orders`
- [ ] Submit inquiry form → appears in `/admin/inquiries`
- [ ] `npm run build` passes with 0 errors
