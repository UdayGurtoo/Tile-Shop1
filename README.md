# Mohit Tiles & Granites — Production App

Database-driven Next.js storefront and admin panel for **Mohit Tiles & Granites** (Ghaziabad).

Dynamic content (products, categories, banners, gallery, FAQs, contact, SEO, inquiries) lives in **Neon PostgreSQL** via **Prisma**. Images are stored on **Cloudinary** (URLs in the DB). Admins manage everything from `/admin` with **NextAuth** (JWT + bcrypt).

The original static HTML site is preserved in `../legacy/`.

---

## Stack

| Layer | Technology |
|--------|------------|
| Frontend | Next.js 15 (App Router), React 19, Tailwind CSS 4 |
| Database | Neon PostgreSQL |
| ORM | Prisma 6 |
| Auth | NextAuth.js Credentials (JWT), bcrypt |
| Images | Cloudinary |
| Validation | Zod |
| Rate limiting | In-memory (+ optional Upstash Redis) |

---

## Project structure

```
web/
├── prisma/
│   ├── schema.prisma      # Full data model
│   ├── seed.ts            # Migrates all existing catalog content
│   └── migrations/        # Prisma migrations
├── public/images/         # Local seed/dev images (upload to Cloudinary for production)
├── src/
│   ├── app/
│   │   ├── (public pages) # /, /products, /categories, /brands, /gallery, /contact...
│   │   ├── admin/         # Secure admin dashboard
│   │   ├── api/           # Public + admin API routes
│   │   ├── sitemap.ts
│   │   └── robots.ts
│   ├── components/
│   │   ├── public/        # Storefront UI (matches original look)
│   │   └── admin/         # Dashboard components
│   └── lib/               # prisma, auth, cloudinary, products, validations
├── .env.example
└── README.md
```

---

## 1. Prerequisites

- Node.js 20+
- A [Neon](https://neon.tech) PostgreSQL database
- A [Cloudinary](https://cloudinary.com) account (for production image uploads)
- (Optional) [Upstash Redis](https://upstash.com) for distributed rate limiting

---

## 2. Setup

```bash
cd web
cp .env.example .env
npm install
```

### Configure `.env`

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST/neondb?sslmode=require"

NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="paste-output-of-openssl-rand-base64-32"

ADMIN_EMAIL="admin@mohittiles.com"
ADMIN_PASSWORD="ChangeMe_StrongPassword123!"
ADMIN_NAME="Store Admin"

CLOUDINARY_CLOUD_NAME="..."
CLOUDINARY_API_KEY="..."
CLOUDINARY_API_SECRET="..."
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="..."

NEXT_PUBLIC_SITE_URL="http://localhost:3000"
NEXT_PUBLIC_SITE_NAME="Mohit Tiles & Granites"
```

Generate a secret:

```bash
openssl rand -base64 32
```

---

## 3. Database migrate + seed

```bash
npm run db:migrate
# when prompted for migration name: init

npm run db:seed
```

Or push schema without migration history (quick start):

```bash
npm run db:push
npm run db:seed
```

Seed loads:

- Store + super admin user
- Brands (Cera, Somany, …)
- Categories (toilets, faucets, granites, kitchen, …)
- All granite / faucet / toilet products from the old site
- Hero + promo banners, offers, FAQs, testimonials, services
- Kitchen gallery (O-1 … O-40)
- Contact details (phone, map, timings)

Default admin: values from `ADMIN_EMAIL` / `ADMIN_PASSWORD` in `.env`.

---

## 4. Run locally

```bash
npm run dev
```

- Storefront: http://localhost:3000  
- Admin: http://localhost:3000/admin/login  

---

## 5. Image storage (Cloudinary)

**Do not commit production media into the repo.**

1. Set Cloudinary env vars.
2. In Admin → Products / Banners / Gallery, use the uploader (posts to `/api/admin/upload`).
3. Only Cloudinary URLs are saved in Neon.
4. Thumbnails use Cloudinary transformations (`f_auto,q_auto,w_…`).

For local/demo, seed uses `/images/...` files copied from the old static site into `public/images/`. Re-upload those assets to Cloudinary before production launch, then update records in admin (or write a one-off migration script).

---

## 6. Admin capabilities

| Area | Actions |
|------|---------|
| Products | Create / edit / delete, hide, featured, new arrival, stock, prices, multi-image upload + reorder |
| Categories / Brands | Full CRUD |
| Homepage | Edit content blocks & SEO copy |
| Banners / Offers | Hero + promo banners |
| Gallery | Kitchen and other galleries |
| Testimonials / FAQs / Services | Full CRUD |
| Contact | Address, phones, email, map, socials, timings, about |
| Inquiries | View submissions, mark in-progress / resolved |

No code deploy is required for day-to-day content changes.

---

## 7. Public features

- Search & filters: name, category, brand, size, material, finish, color, price, featured, new arrival, sorting
- Pagination on product lists and kitchen gallery
- Dynamic metadata, Open Graph, canonical URLs
- Product JSON-LD (Schema.org)
- `sitemap.xml` + `robots.txt`
- Contact form → DB (+ rate limited)
- SSR / ISR (`revalidate = 60`) on key pages
- Lazy-loaded images, API `Cache-Control` headers

---

## 8. Security

- Admin-only JWT sessions (8h)
- bcrypt password hashing (cost 12)
- Zod validation on inputs
- Prisma parameterized queries (SQLi protection)
- HTML escaping on inquiry fields
- Rate limits on inquiries & uploads
- Middleware protection for `/admin/*` (except login)
- Secrets only via environment variables

---

## 9. Deployment (Vercel recommended)

1. Push this `web` app to GitHub.
2. Import project in Vercel; root directory = `web` (or deploy this folder alone).
3. Add all env vars from `.env.example`.
4. Build command: `npm run build` (runs `prisma generate`).
5. After first deploy, run migrations:

```bash
npx prisma migrate deploy
npx tsx prisma/seed.ts
```

Or use a Vercel build hook / one-off job. Neon works with Vercel serverless out of the box (use the **pooled** connection string if you hit connection limits).

---

## 10. Future-ready schema notes

The Prisma model includes `Store` and role enum (`SUPER_ADMIN`, `ADMIN`, `MANAGER`, `CUSTOMER`) so you can later add:

- Multi-store / multi-admin
- Customer accounts, wishlist, cart, checkout
- Payments, GST invoices, inventory workflows
- Analytics dashboard

without rewriting the core content model.

---

## Useful commands

```bash
npm run db:studio          # Browse data
npm run db:migrate:deploy  # Production migrations
npm run lint
npm run build
```

---

## Support contacts (seed defaults)

- Phone / WhatsApp: `+91 98186 97434`
- Location: Shalimar Garden, Ghaziabad
- Hours: Everyday 10:00 – 20:00

Update these any time from **Admin → Contact**.
