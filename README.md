# Poutou Store — AI Agent Handoff README

This repository is a Next.js 15 storefront for a boutique selling traditional Guinean poutous. The project is currently in a partial scaffold / implementation stage: the architecture, data model, integrations, and route structure are in place, but several UI and business-flow modules are still not fully implemented yet.

The goal of this README is to help another AI agent quickly understand the current state of the project so work can continue without re-discovering the basics.

---

## 1. Project summary

- Product: a small e-commerce / marketplace experience for Poutou Store
- Main audience: customers browsing products, placing orders, and admins managing catalog/orders
- Primary stack:
  - Next.js 15 (App Router)
  - React 19
  - TypeScript
  - Tailwind CSS
  - Prisma + PostgreSQL
  - Supabase Auth + Storage
  - Resend for transactional emails
  - shadcn/ui-style component structure via local UI primitives

---

## 2. Project structure

```text
poutou-store/
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
├── public/
│   └── images/
│       └── products/
├── src/
│   ├── actions/
│   ├── app/
│   │   ├── (store)/
│   │   │   ├── account/
│   │   │   ├── cart/
│   │   │   ├── checkout/
│   │   │   │   └── success/
│   │   │   │       └── [orderId]/
│   │   │   ├── forgot-password/
│   │   │   ├── login/
│   │   │   ├── products/
│   │   │   │   └── [slug]/
│   │   │   ├── reset-password/
│   │   │   └── signup/
│   │   ├── admin/
│   │   │   ├── broadcast/
│   │   │   ├── categories/
│   │   │   ├── customers/
│   │   │   ├── orders/
│   │   │   │   └── [id]/
│   │   │   ├── products/
│   │   │   │   ├── [id]/
│   │   │   │   │   └── edit/
│   │   │   │   └── new/
│   │   └── auth/
│   │       └── callback/
│   ├── components/
│   │   ├── admin/
│   │   ├── cart/
│   │   ├── store/
│   │   └── ui/
│   ├── emails/
│   └── lib/
│       ├── auth.ts
│       ├── email.ts
│       ├── format.ts
│       ├── labels.ts
│       ├── prisma.ts
│       ├── serializers.ts
│       ├── utils.ts
│       ├── whatsapp.ts
│       └── supabase/
│           ├── admin.ts
│           ├── client.ts
│           ├── middleware.ts
│           └── server.ts
├── components.json
├── next-env.d.ts
├── next.config.ts
├── package.json
├── postcss.config.mjs
├── tailwind.config.ts
└── tsconfig.json
```

---

## 3. What is already present

### Core app structure

The app router structure exists under:

- src/app/(store) for public storefront routes
- src/app/admin for admin routes
- src/app/auth/callback for auth callback handling

The following route areas are already scaffolded as folders:

- Store routes: account, cart, checkout, forgot-password, login, products, reset-password, signup
- Admin routes: broadcast, categories, customers, orders, products

### Database and ORM

The Prisma schema is already defined in [prisma/schema.prisma](prisma/schema.prisma) with these core models:

- User
- Category
- Product
- Order
- OrderItem

The data model supports:

- customer/admin roles
- guest orders (userId can be null)
- product categories
- order lifecycle with payment and delivery status
- per-item pricing at purchase time

### Seed data

The seed script in [prisma/seed.ts](prisma/seed.ts) already:

- creates sample product categories
- creates sample products with rich descriptions, pricing, stock, and region metadata
- creates an admin user in Prisma
- optionally creates a Supabase Auth admin user if service credentials are available

### Authentication and user access

There is a server-side auth layer in [src/lib/auth.ts](src/lib/auth.ts) that:

- detects the Supabase-authenticated user
- resolves the matching Prisma User record by email
- exposes helpers such as getCurrentUser, requireAdminPage, and requireAdminAction

This indicates the app is intended to use Supabase Auth for login/session handling and Prisma for app-level user roles.

### Email system

The email integration exists in [src/lib/email.ts](src/lib/email.ts):

- order confirmation emails
- order status update emails
- broadcast emails to a list of recipients

It uses Resend and is designed to be silent when the API key is missing.

### Supabase integration

The project already expects Supabase for:

- authentication via SSR client
- storage of product images
- possible admin user provisioning during seed

The server client helper is in [src/lib/supabase/server.ts](src/lib/supabase/server.ts).

### UI foundation

There is a UI component layer under [src/components/ui](src/components/ui) and a basic app structure for store/admin components.

---

## 3. What is not fully implemented yet

This should be treated as a work-in-progress project, not a fully finished e-commerce app.

Important signs of incompleteness:

- The public/admin route folders exist, but the actual page files are not yet present in the checked-in tree.
- The component folders under [src/components/store](src/components/store) and [src/components/admin](src/components/admin) are currently empty.
- The actions folder at [src/actions](src/actions) is empty.
- The app appears to be at a scaffold / wiring stage rather than a fully polished storefront.

In practical terms, the app is ready for the next implementation phase, but many user-facing flows still need to be built.

---

## 4. Main domain model

The core business objects are:

- User: customer or admin account
- Category: product grouping
- Product: sale item with price, stock, images, metadata, and category
- Order: a purchase with payment and delivery state
- OrderItem: each product line inside an order

The schema uses PostgreSQL and decimal values for money.

---

## 5. Environment variables

The project expects a standard environment file based on [env.example](.env.example).

Key variables include:

- DATABASE_URL
- DIRECT_URL
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY
- SUPABASE_SERVICE_ROLE_KEY
- SUPABASE_STORAGE_BUCKET
- RESEND_API_KEY
- EMAIL_FROM
- NEXT_PUBLIC_WHATSAPP_PHONE
- NEXT_PUBLIC_ORANGE_MONEY_NUMBER
- NEXT_PUBLIC_CURRENCY
- NEXT_PUBLIC_SITE_URL
- ADMIN_EMAIL
- ADMIN_PASSWORD

If these are missing, the app may run partially but email/Supabase features will be degraded or non-functional.

---

## 6. How to run the project

Install dependencies:

```bash
npm install
```

Run the dev server:

```bash
npm run dev
```

Database workflow:

```bash
npm run db:push
npm run db:seed
```

Useful scripts from [package.json](package.json):

- npm run dev
- npm run build
- npm run start
- npm run db:migrate
- npm run db:push
- npm run db:seed
- npm run db:studio

---

## 7. Development conventions and clues

### App Router

This project uses the Next.js App Router pattern. New pages and route handlers should be placed under [src/app](src/app) using the existing folders as a guide.

### Prisma-first data access

Most application data should be read/written through Prisma. The singleton client is already configured in [src/lib/prisma.ts](src/lib/prisma.ts).

### Server-side auth

Use the helpers in [src/lib/auth.ts](src/lib/auth.ts) for access control and current-user lookups.

### Email is optional but expected

Resend integrations should be treated as optional during development unless the environment is fully configured.

### Images are expected to come from Supabase Storage

The schema and seed assume product images can be stored as URLs, likely from a public Supabase bucket.

---

## 8. Recommended next implementation areas

If continuing this project, the most natural next steps are:

1. Implement the store pages under the public routes
2. Build the cart and checkout flow
3. Implement admin catalog and order management screens
4. Add server actions for product/order management
5. Wire real UI components to Prisma-backed data
6. Connect product image upload to Supabase Storage

---

## 9. What an AI agent should assume when continuing work

Assume the following unless proven otherwise:

- The project is a starter/partial implementation, not a finished production app
- Prisma schema is the source of truth for core domain entities
- Supabase Auth is intended for authentication, but the UI wiring is not yet complete
- The app is intended to support both customer-facing storefront flows and admin management flows
- The repository is currently in the phase of implementing pages and business logic around an existing backend foundation

If you are picking up the project, the safest approach is to inspect the existing Prisma schema, auth helpers, and route folders first, then implement the missing UI and server actions incrementally.
