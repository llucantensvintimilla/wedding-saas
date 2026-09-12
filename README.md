# OurWeding - Premium Digital Wedding Experience

## 🌟 Product Vision
OurWeding is a premium SaaS providing a "technology experience for the entire wedding." It's not just a wedding website; it's a digital center that accompanies the couple and guests **Before, During, and After** the wedding.

**Positioning:** Luxury, elegant, automated, and effortless.
**Core Value:** A complete digital experience delivered in < 24 hours after onboarding.
**Target Price:** $1,499 (Main Product).

---

## 💼 Business Model
The customer journey follows a strict linear flow:
`Visitor` $\rightarrow$ `Checkout` $\rightarrow$ `Stripe Payment` $\rightarrow$ `Order` $\rightarrow$ `Onboarding` $\rightarrow$ `Automated Creation` $\rightarrow$ `Delivery` $\rightarrow$ `Couple Dashboard` $\rightarrow$ `Public Experience`.

### Key Commercial Entities
- **Order**: The master commercial entity. Tracks the purchase and status.
- **Payment**: Real transaction records from Stripe.
- **Wedding**: The digital product created as a result of a paid order.
- **Subscription**: Ongoing maintenance for keeping memories online.
- **Partner/Affiliate**: Business partners who refer clients and earn commissions ($300 standard).

---

## 🛠 Technical Stack
- **Framework**: Next.js 16 (App Router), React 19, TypeScript.
- **Styling**: Tailwind CSS 4, Framer Motion.
- **Backend/Database**: Supabase (PostgreSQL).
- **Auth**: Supabase Auth (Role-based: `admin`, `novios`, `afiliado`).
- **Payments**: Stripe.
- **Email**: Resend.

---

## 🗄 Database Architecture
### Core Tables
- `bodas`: Main wedding data, config (JSONB), and status.
- `perfiles`: User roles and wedding associations.
- `orders`: Commercial truth (customer email, amount, stripe\_session\_id, status).
- `payments`: Transactional logs (payment\_intent\_id, status, amount).
- `referrals`: Acquisition tracking (partner\_id, attribution\_source).
- `commission_ledger`: Ledger for partners (estimated $\rightarrow$ confirmed $\rightarrow$ paid).
- `delivery_queue`: Queue for the < 24h delivery workflow.

### Wedding Content Tables
- `invitados`, `rsvp`, `cronograma`, `faqs`, `hoteles`, `transporte`, `galeria_oficial`, `fotos_invitados`, `mensajes`, `regalos`.

---

## 🔐 Security & RLS
- **Tenant Isolation**: Strict Row Level Security (RLS) ensures that users only see their own data.
- **Roles**:
  - `admin`: Full access.
  - `novios`: Access to their own wedding, order, and payments.
  - `afiliado`: Access to their own referrals and commissions.
- **Public Data**: Separate views/policies for public wedding data vs. private operational/financial data.

---

## 🚀 Current Status (Audit 2026-08-30)
### ✅ Completed
- Initial DB schema and migrations.
- Multi-step onboarding frontend.
- Public wedding page render (`/[slug]`).
- Basic admin panel shell.
- Stripe basic integration (Checkout/Webhooks).
- Order-based payment flow (Fixed: Checkout $\rightarrow$ Order $\rightarrow$ Webhook).
- Payment-gate for onboarding.
- Referral capture and attribution system (Cookie-based $\rightarrow$ Order linkage).
- Automated Wedding Experience Generation: Implementation of Design Tokens, Theme Provider, and full thematization of all wedding components (Hero, Historia, Nav, Cronograma, Ubicación, DressCode, Galería, RSVP, Regalos, FAQ, Guestbook).
- Production Lifecycle: Implementation of `production_status` machine (awaiting_payment $\rightarrow$ awaiting_onboarding $\rightarrow$ onboarding_completed $\rightarrow$ delivered).
- Couple's Studio: Secure self-management dashboard for couples, including Content Editor, Guest Management, Gallery Moderation, and RSVP Curator.
- Partner Dashboard: Premium visual identity and commission tracking for affiliates.

### ⚠️ Partial / Broken
- **Partner System**: DB tables exist, but attribution logic is not implemented in the frontend.

### ❌ Missing
- Automated wedding generation based on luxury presets.
- Full "Couple Dashboard" (Studio) integration.
- Before/During/After state transitions.
- Animated Invitations & Custom Domains.
- Subscription billing system.

---

## 🗺 Roadmap
1. **Phase 1: Security & Isolation** $\rightarrow$ Harden RLS and storage.
2. **Phase 2: Commercial Core** $\rightarrow$ Fix the `Checkout` $\rightarrow$ `Order` $\rightarrow$ `Payment` flow. **(CURRENT)**
3. **Phase 3: Stripe Robustness** $\rightarrow$ Idempotency, refunds, and reconciliation.
4. **Phase 4: Partners Ecosystem** $\rightarrow$ Attribution and commission dashboards.
5. **Phase 5: Robust Onboarding** $\rightarrow$ Progress saving and payment-gate.
6. **Phase 6: Automated Generation** $\rightarrow$ Content to site automation.
7. **Phase 7: Production & Delivery** $\rightarrow$ < 24h workflow and status machine.
8. **Phase 8: Couple Dashboard** $\rightarrow$ Secure self-management.
9. **Phase 9: Full Wedding Experience** $\rightarrow$ Presets, Variants, Before/During/After.
10. **Phase 10: Animated Invitations**.
11. **Phase 11: Custom Domains**.
12. **Phase 12: Subscriptions**.

---

## 📝 Development Notes
- **Memory**: This README is the primary source of truth for any agent working on the project. Update it after every major change.
- **Environment Variables**:
  - `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`
  - `NEXT_PUBLIC_SITE_URL`
  - `SUPABASE_SERVICE_ROLE_KEY` (for admin operations)
  - `RESEND_API_KEY`

---

## 📜 Changelog
- **2026-08-30**: Initial Technical Audit and README initialization. Roadmap defined.
- **2026-08-30**: Fixed payment flow (Orders $\rightarrow$ Payments $\rightarrow$ Wedding). implemented payment gate for onboarding.
- **2026-08-30**: Implemented Partner Referral system: capture via `?ref=`, cookie persistence, and Order attribution.
- **2026-08-30**: Implemented Luxury Design System: ThemeProvider, Design Tokens, and preset-based visual variants for all components.
- **2026-08-30**: Implemented Production Lifecycle: Added `production_status` to DB and integrated it into Webhook, Onboarding, and Delivery Scheduler.
