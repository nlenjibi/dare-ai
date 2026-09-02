# 🏗️ SYSTEM ARCHITECTURE DOCUMENT
## Prospera – Personal Financial Intelligence Platform
**Version:** 1.0 | **Classification:** Technical Reference  
**Architect:** Senior Systems Design (Context: Next.js Fullstack on Vercel)  
**Pattern:** Hybrid Monolithic · MVC + Service + Repository · Event-Ready

---

# EXECUTIVE SUMMARY

Prospera is architected as a **hybrid monolithic system** using the Next.js App Router as both the presentation and API layer, backed by MongoDB Atlas as the primary data store, and an optional OpenAI-powered AI microservice for behavioral analytics. The system is designed for rapid MVP delivery in a 7-day sprint while remaining structurally ready for microservices extraction as usage scales.

**Key Architectural Decisions:**
- Single Next.js app for frontend + API routes (eliminates CORS, simplifies auth)
- MongoDB for flexible document schema suited to varied financial entities
- NextAuth.js for session management (battle-tested, supports OAuth + Credentials)
- Vercel edge deployment for global CDN + instant CI/CD
- OpenAI integration for AI insights (API-based, no self-hosted ML infra needed)

---

# STEP 1: REQUIREMENTS ANALYSIS

## Functional Requirements

| FR | Description |
|---|---|
| FR-01 | User registration, login, and Google OAuth |
| FR-02 | Income CRUD with source, category, date, and notes |
| FR-03 | Expense CRUD with category, tags, and date filtering |
| FR-04 | Monthly budget planning per expense category |
| FR-05 | To-Buy list with auto-conversion to expense on purchase |
| FR-06 | Debt tracking with partial repayment logging |
| FR-07 | Lending tracking with risk rating and repayment receipt |
| FR-08 | Analytics dashboard with 5 KPI widgets |
| FR-09 | Interactive charts: Line, Pie, Bar (Recharts) |
| FR-10 | AI-generated weekly summaries, predictions, anomaly alerts |
| FR-11 | User profile with photo, bio, social links, and portfolio |
| FR-12 | Dark/Light theme toggle (persisted in DB) |
| FR-13 | CSV export of all user financial data |
| FR-14 | Admin: user management, system stats, audit log |
| FR-15 | Public user portfolio page: `/u/[username]` |
| FR-16 | Legal pages: Terms, Privacy Policy |
| FR-17 | Account deletion with full data purge (GDPR) |

## Non-Functional Requirements

| NFR | Target |
|---|---|
| Performance | Page load < 2s; API < 500ms (P95) |
| Availability | 99.9% uptime via Vercel edge |
| Scalability | 10,000 users without re-architecture |
| Security | OWASP Top 10, HTTPS everywhere, bcrypt |
| Accessibility | WCAG 2.1 AA |
| SEO | Lighthouse SEO score > 90 |
| Responsiveness | Mobile, tablet, desktop |

## Constraints

- **Timeline:** 7-day MVP sprint
- **Budget:** Free-tier cloud services (Vercel Hobby, MongoDB Atlas M0, OpenAI pay-per-use)
- **Team:** Solo or 2-person
- **Infrastructure:** No self-hosted servers; fully managed PaaS

---

# STEP 2: DOMAIN MODEL

## Core Entities & Relationships

```
┌─────────────────────────────────────────────────────────┐
│                        USER                              │
│  id, name, email, password, role, username, currency,   │
│  theme, bio, image, socialLinks, portfolio               │
└────────────────────────┬────────────────────────────────┘
                         │ 1:N (all entities owned by user)
          ┌──────────────┼──────────────────┐
          │              │                  │
    ┌─────▼──────┐ ┌─────▼──────┐ ┌────────▼───────┐
    │   INCOME   │ │  EXPENSE   │ │     BUDGET     │
    │  source    │ │description │ │   category     │
    │  amount    │ │  amount    │ │  monthly_limit │
    │  category  │ │  category  │ │    month       │
    │  date      │ │  date,tags │ │    year        │
    └────────────┘ └─────▲──────┘ └────────────────┘
                         │ (converted from ToBuy)
                   ┌─────┴──────┐
                   │   TO-BUY   │
                   │  item_name │
                   │  est_price │
                   │  priority  │
                   │  status    │
                   └────────────┘

    ┌─────────────┐         ┌─────────────────┐
    │    DEBT     │         │    LENDING      │
    │creditor_name│         │  debtor_name    │
    │total_amount │         │  amount_lent    │
    │amount_paid  │         │  amount_received│
    │  balance    │         │    balance      │
    │  due_date   │         │  risk_rating    │
    │  payments[] │         │   payments[]   │
    └─────────────┘         └─────────────────┘

    ┌─────────────────────────────┐
    │         AUDIT_LOG           │
    │  adminId, action, target    │
    │  timestamp, metadata        │
    └─────────────────────────────┘
```

## Relationship Cardinalities

| Relationship | Cardinality |
|---|---|
| User → Income | 1:N |
| User → Expense | 1:N |
| User → Budget | 1:N (per category per month) |
| User → ToBuy | 1:N |
| ToBuy → Expense | 1:1 (optional, on conversion) |
| User → Debt | 1:N |
| Debt → Payments | 1:N (embedded array) |
| User → Lending | 1:N |
| Lending → Payments | 1:N (embedded array) |
| Admin → AuditLog | 1:N |

---

# STEP 3: SERVICE DECOMPOSITION

Since this is a hybrid monolith, services are **logical boundaries** within the same Next.js app, implemented as distinct API route groups:

| Service | Responsibility | Owned Data | Key APIs |
|---|---|---|---|
| **Auth Service** | Registration, login, sessions, OAuth | User (auth fields) | `/api/auth/[...nextauth]` |
| **Income Service** | CRUD income entries, aggregations | Income | `/api/income` |
| **Expense Service** | CRUD expenses, category filtering | Expense | `/api/expense` |
| **Budget Service** | Monthly budget limits, progress tracking | Budget | `/api/budget` |
| **ToBuy Service** | Wishlist CRUD, expense conversion | ToBuy | `/api/tobuy` |
| **Debt Service** | Debt CRUD, repayment logging | Debt | `/api/debt` |
| **Lending Service** | Lending CRUD, risk scoring | Lending | `/api/lending` |
| **Analytics Service** | Aggregation queries, trend data | Reads all entities | `/api/analytics` |
| **AI Service** | OpenAI integration, caching | None (stateless) | `/api/ai` |
| **Profile Service** | Profile, portfolio, data export | User (profile fields) | `/api/profile` |
| **Admin Service** | User management, audit | All entities (read) | `/api/admin` |

---

# STEP 4: DATA ARCHITECTURE

## Technology Choice: MongoDB Atlas

**Justification:**
- Schema flexibility: each financial entity has varying optional fields (e.g., debt has interest rate, lending has risk rating)
- Embedded documents: payment history arrays are co-located with parent documents (no joins)
- Atlas free tier: sufficient for 500MB MVP
- Mongoose: type-safe schema definition for TypeScript

**Trade-off:** Sacrifices strict relational integrity (no foreign key constraints) in exchange for flexible schema evolution and developer velocity.

## Database Schemas (Mongoose)

### Users Collection
```typescript
{
  _id: ObjectId,
  name: String (required),
  email: String (required, unique, indexed),
  password: String (hashed, select: false),
  role: Enum['user', 'admin'] (default: 'user'),
  username: String (unique, sparse),
  image: String (Cloudinary URL),
  bio: String (max: 500),
  currency: String (default: 'USD'),
  theme: Enum['light', 'dark', 'system'],
  socialLinks: { github, linkedin, twitter, facebook, email },
  portfolio: { projects: [], skills: [], experience: String },
  createdAt: Date,
  updatedAt: Date
}
```

### Income Collection
```typescript
{
  _id: ObjectId,
  userId: ObjectId (ref: User, required, indexed),
  source: String (required),
  amount: Number (required, min: 0),
  category: Enum['salary', 'freelance', 'investment', 'business', 'gift', 'other'],
  date: Date (required, indexed),
  notes: String,
  recurring: Boolean,
  recurringPeriod: Enum['weekly', 'monthly', 'yearly'],
  createdAt: Date
}
// Compound index: { userId: 1, date: -1 }
```

### Expense Collection
```typescript
{
  _id: ObjectId,
  userId: ObjectId (ref: User, required, indexed),
  description: String (required),
  amount: Number (required, min: 0),
  category: Enum['food', 'transport', 'housing', 'health', 'education',
                  'entertainment', 'clothing', 'utilities', 'shopping', 'other'],
  date: Date (required),
  tags: [String],
  fromToBuy: ObjectId (ref: ToBuy, optional),
  notes: String,
  createdAt: Date
}
// Compound index: { userId: 1, date: -1, category: 1 }
```

### Debt Collection
```typescript
{
  _id: ObjectId,
  userId: ObjectId (required, indexed),
  creditorName: String (required),
  totalAmount: Number (required),
  amountPaid: Number (default: 0),
  balance: Number (virtual, auto-calculated pre-save),
  interestRate: Number (optional),
  dueDate: Date (required),
  status: Enum['active', 'partially_paid', 'paid'],
  payments: [
    { amount: Number, date: Date, notes: String }
  ],
  notes: String,
  createdAt: Date
}
```

### Lending Collection
```typescript
{
  _id: ObjectId,
  userId: ObjectId (required, indexed),
  debtorName: String (required),
  amountLent: Number (required),
  amountReceived: Number (default: 0),
  balance: Number (auto-calculated),
  dueDate: Date (optional),
  status: Enum['active', 'partially_paid', 'fully_paid'],
  riskRating: Enum['low', 'medium', 'high'] (auto-calculated),
  payments: [{ amount, date, notes }],
  notes: String
}
```

## Caching Strategy

| Data | Cache Layer | TTL | Invalidation |
|---|---|---|---|
| Dashboard summary | Next.js `revalidate` (ISR) | 60s | On new transaction |
| AI insights | MongoDB (stored result) | 24h | Manual refresh button |
| User session | NextAuth JWT | 30d | On logout |
| Analytics trends | Server-side memo | 5 min | Time-based |

---

# STEP 5: API DESIGN

## Design Principles
- **RESTful** resource-oriented routes
- **Consistent response envelope:** `{ success: bool, data: any, error?: string }`
- **Validation** at route level using Zod schemas
- **Authentication** checked on every protected route via `getServerSession()`
- **Versioning:** Not needed for v1.0 (all internal). Prefix `/api/v2/` when breaking changes needed.

## Critical Endpoint Specifications

### POST /api/income
```json
// Request
{
  "source": "Freelance Project",
  "amount": 1500.00,
  "category": "freelance",
  "date": "2026-04-07",
  "notes": "Logo design for client"
}

// Response 201
{
  "success": true,
  "data": {
    "_id": "661a2b3c...",
    "userId": "661a1b2c...",
    "source": "Freelance Project",
    "amount": 1500,
    "category": "freelance",
    "date": "2026-04-07T00:00:00.000Z",
    "createdAt": "2026-04-07T09:00:00.000Z"
  }
}
```

### POST /api/debt/:id/payment
```json
// Request
{
  "amount": 200.00,
  "notes": "April installment"
}

// Response 200
{
  "success": true,
  "data": {
    "_id": "...",
    "creditorName": "Bank Loan",
    "totalAmount": 1000,
    "amountPaid": 400,
    "balance": 600,
    "status": "partially_paid"
  }
}
```

### POST /api/ai/insights
```json
// Request (auto-populated from server session)
{}

// Response 200
{
  "success": true,
  "data": {
    "summary": "You spent $2,800 this month, 12% less than last month. Food remains your top category at 35%.",
    "tip": "Consider meal prepping on Sundays — your food spending peaks on Fridays.",
    "observation": "You have $600 outstanding in lending. Two records are overdue by more than 7 days.",
    "generatedAt": "2026-04-07T09:00:00.000Z",
    "cachedUntil": "2026-04-08T09:00:00.000Z"
  }
}
```

## Rate Limiting

| Route Group | Limit | Window |
|---|---|---|
| `/api/auth/*` | 10 req | per minute |
| `/api/ai/*` | 5 req | per hour (cost control) |
| `/api/*` (general) | 200 req | per minute |
| `/api/admin/*` | 50 req | per minute |

---

# STEP 6: INFRASTRUCTURE & DEPLOYMENT

## Architecture Diagram

```
                        ┌─────────────────────────────┐
                        │         INTERNET             │
                        └──────────────┬──────────────┘
                                       │ HTTPS
                        ┌──────────────▼──────────────┐
                        │       Vercel Edge CDN         │
                        │   (Global, 30+ regions)      │
                        └──────────────┬──────────────┘
                                       │
               ┌───────────────────────┼───────────────────────┐
               │                       │                       │
    ┌──────────▼──────────┐ ┌──────────▼──────────┐ ┌─────────▼──────────┐
    │   Static Assets      │ │  Next.js SSR/SSG     │ │  API Routes        │
    │  (Vercel CDN cache)  │ │  (Vercel Functions)  │ │  (Vercel Serverless)│
    └─────────────────────┘ └──────────┬──────────┘ └─────────┬──────────┘
                                       │                       │
                            ┌──────────▼───────────────────────▼──────────┐
                            │            MongoDB Atlas (M0 Free)           │
                            │         (Connection via Mongoose)            │
                            └─────────────────────────────────────────────┘
                                       │AI calls│file uploads
                            ┌──────────▼────┐  ┌────────────▼────┐
                            │  OpenAI API   │  │  Cloudinary CDN │
                            │  (GPT-4o Mini)│  │  (Image storage)│
                            └───────────────┘  └─────────────────┘
```

## CI/CD Pipeline

```
Developer pushes to GitHub
        │
        ▼
GitHub Actions (pre-deploy checks)
  ├── npm run lint
  ├── npm run type-check
  └── npm run test
        │ (on success)
        ▼
Vercel Auto-Deploy
  ├── Preview URL on PR
  └── Production on merge to main
```

## Environment Setup

- **Development:** `localhost:3000` + local `.env.local`
- **Preview:** Vercel preview URLs per PR
- **Production:** `https://prospera.vercel.app`

---

# STEP 7: SECURITY ARCHITECTURE

## Authentication & Authorization

```
User Request
    │
    ▼
NextAuth Middleware (checks JWT token)
    │
    ├── No Token → Redirect to /login
    │
    └── Valid Token
            │
            ├── role: 'user'  → Access /dashboard/*
            └── role: 'admin' → Access /admin/* + /dashboard/*
```

## Security Controls

| Control | Implementation |
|---|---|
| **Password hashing** | bcrypt, cost factor 12 |
| **Session tokens** | JWT (HTTP-only via NextAuth) |
| **HTTPS** | Enforced by Vercel (HSTS) |
| **Input validation** | Zod schemas on all API routes |
| **SQL/NoSQL injection** | Mongoose ODM prevents injection |
| **CSRF protection** | NextAuth built-in CSRF tokens |
| **Rate limiting** | Vercel Edge middleware |
| **CORS** | Same-origin (Next.js API routes are same-domain) |
| **Secret management** | Vercel Environment Variables (encrypted at rest) |
| **Data encryption at rest** | MongoDB Atlas encryption at rest (default) |
| **Data export/deletion** | GDPR-compliant account deletion + CSV export |

## OWASP Top 10 Compliance

| Risk | Mitigation |
|---|---|
| A01 Broken Access Control | Middleware + session check on every API route |
| A02 Cryptographic Failures | bcrypt for passwords, HTTPS everywhere |
| A03 Injection | Mongoose ODM, Zod input validation |
| A04 Insecure Design | Principle of least privilege (user/admin roles) |
| A05 Security Misconfiguration | No debug info in production, secure headers |
| A06 Vulnerable Components | Regular `npm audit`, Dependabot enabled |
| A07 Auth Failures | NextAuth rate limiting, no credential exposure |
| A09 Logging Failures | Server-side error logging, Admin audit log |

---

# STEP 8: ARCHITECTURE DECISION RECORDS

## ADR-01: Hybrid Monolith vs. Microservices

| | Option A: Microservices | Option B: Hybrid Monolith ✅ |
|---|---|---|
| **Development speed** | Slow (separate repos, APIs) | Fast (single codebase) |
| **Operational complexity** | High (docker, k8s, service mesh) | Low (Vercel handles all) |
| **Team size fit** | 5+ engineers | 1-2 engineers |
| **Scalability** | Excellent | Good (sufficient for 10k users) |
| **Decision** | ❌ Over-engineered for MVP | ✅ Chosen |

**Trade-off Accepted:** Cannot scale individual services independently. Acceptable for v1.0; microservices can be extracted in v2.0 if needed.

## ADR-02: MongoDB vs. PostgreSQL

| | PostgreSQL | MongoDB ✅ |
|---|---|---|
| **Schema flexibility** | Rigid (migrations required) | Flexible (schema-less) |
| **Payment arrays** | Separate table + joins | Embedded documents |
| **Free tier** | Supabase (500MB) | Atlas M0 (512MB) |
| **Mongoose/Prisma** | Prisma (excellent) | Mongoose (excellent) |
| **Decision** | ❌ Extra migration overhead | ✅ Chosen for embedded arrays |

**Trade-off Accepted:** No referential integrity constraints. Mitigated by Mongoose validation.

## ADR-03: NextAuth vs. Clerk vs. Auth0

| | Clerk | Auth0 | NextAuth ✅ |
|---|---|---|---|
| **Cost** | Free (up to 10k users) | Free (7k users) | Free (open source) |
| **Customization** | Low (Clerk UI) | Medium | Full control |
| **Google OAuth** | ✅ | ✅ | ✅ |
| **Data ownership** | User data on Clerk | Data on Auth0 | Data in your DB |
| **Decision** | ❌ Less control | ❌ Limited free tier | ✅ Chosen |

## ADR-04: OpenAI API vs. Self-Hosted LLM

| | Self-Hosted (Ollama) | OpenAI API ✅ |
|---|---|---|
| **Infrastructure** | GPU server required | No infra |
| **Cost** | High upfront | Pay-per-use |
| **Quality** | Llama 3.2 (good) | GPT-4o Mini (excellent) |
| **Latency** | Variable | ~1s |
| **Decision** | ❌ Infra too complex | ✅ Chosen for MVP |

---

# STEP 9: SYNTHESIZED ARCHITECTURE DOCUMENT

## Application Layer Map

```
┌─────────────────────────────────────────────────────┐
│                  PRESENTATION LAYER                  │
│  Landing · Auth · Dashboard · Admin · Public Profile │
│  (React Server Components + Client Components)       │
├─────────────────────────────────────────────────────┤
│                   API LAYER                          │
│  Next.js API Routes (RESTful)                        │
│  Auth · Income · Expense · Budget · ToBuy            │
│  Debt · Lending · Analytics · AI · Admin             │
├─────────────────────────────────────────────────────┤
│                  SERVICE LAYER                       │
│  Business logic: calculations, validations           │
│  AI prompt engineering · CSV generation              │
│  Repayment calculations · Risk scoring               │
├─────────────────────────────────────────────────────┤
│                REPOSITORY LAYER                      │
│  Mongoose Models (User, Income, Expense,             │
│  Budget, ToBuy, Debt, Lending, AuditLog)             │
├─────────────────────────────────────────────────────┤
│                DATA LAYER                            │
│  MongoDB Atlas (primary store)                       │
│  Cloudinary (binary assets)                          │
│  OpenAI API (AI inference)                           │
└─────────────────────────────────────────────────────┘
```

## Request Lifecycle

```
Browser → Vercel Edge CDN → Next.js App
                              │
                    ┌─────────▼──────────┐
                    │  Route Handler     │
                    │  (API route)       │
                    └─────────┬──────────┘
                              │
                    ┌─────────▼──────────┐
                    │  NextAuth Session  │
                    │  Verification      │
                    └─────────┬──────────┘
                              │
                    ┌─────────▼──────────┐
                    │  Zod Validation    │
                    └─────────┬──────────┘
                              │
                    ┌─────────▼──────────┐
                    │  Business Logic    │
                    │  (Service Layer)   │
                    └─────────┬──────────┘
                              │
                    ┌─────────▼──────────┐
                    │  MongoDB Query     │
                    │  (via Mongoose)    │
                    └─────────┬──────────┘
                              │
                    ┌─────────▼──────────┐
                    │  JSON Response     │
                    │  { success, data } │
                    └────────────────────┘
```

## Next Steps & Roadmap

| Phase | Duration | Scope |
|---|---|---|
| Phase 1 | Day 1 | Foundation: Auth, DB, Layout |
| Phase 2 | Day 2 | Income + Expense CRUD |
| Phase 3 | Day 3 | Budget + To-Buy |
| Phase 4 | Day 4 | Debt + Lending |
| Phase 5 | Day 5 | Analytics Dashboard |
| Phase 6 | Day 6 | AI + Profile + Settings |
| Phase 7 | Day 7 | Testing + Deployment |

---

*Document generated: April 2026 | Prospera Architecture v1.0*