# Architecture & Folder Structure Conventions

## Rule: Singular everywhere. Consistent always.

---

## 1. Next.js Monolith (Full-Stack)

Use this for: SaaS, ERP, Hospital Management, Student Records, Multi-tenant platforms (20+ modules).

```text
src/
├── app/                        # Next.js App Router (pages + API routes)
│   ├── (auth)/
│   ├── dashboard/
│   ├── api/
│   │   └── user/
│   │       └── route.ts        # Thin — delegates to controller
│   └── ...
│
├── frontend/
│   ├── module/
│   │   ├── auth/
│   │   ├── user/
│   │   ├── notification/
│   │   └── report/
│   ├── component/
│   ├── hook/
│   ├── provider/
│   ├── store/
│   └── layout/
│
├── backend/
│   ├── module/
│   │   ├── auth/
│   │   │   ├── controller/
│   │   │   ├── service/
│   │   │   ├── repository/
│   │   │   ├── dto/
│   │   │   └── validator/
│   │   ├── user/
│   │   ├── notification/
│   │   └── report/
│   ├── database/
│   ├── websocket/
│   ├── queue/
│   ├── event/
│   └── job/
│
├── common/
│   ├── config/
│   ├── constant/
│   ├── type/
│   ├── exception/
│   └── util/
│
├── shared/
│   ├── schema/
│   ├── dto/
│   ├── interface/
│   └── enum/
│
├── prisma/
├── tests/
└── middleware.ts
```

### Request Flow

```
Browser
  → app/user/page.tsx
  → frontend/module/user
  → app/api/user/route.ts
  → backend/module/user/controller
  → backend/module/user/service
  → backend/module/user/repository
  → Database
```

### API Route (thin layer)

```typescript
// app/api/user/route.ts
import { UserController } from "@/backend/module/user/controller/user.controller";

export async function GET() {
  return UserController.getUsers();
}
```

---

## 2. Node.js / Express / Fastify Backend

Use this for: standalone API servers, microservices.

```text
src/
├── config/
├── database/
├── middleware/
├── exception/
├── logger/
├── event/
├── queue/
├── cache/
├── security/
├── util/
│
├── module/
│   ├── user/
│   │   ├── controller/
│   │   │   └── user.controller.ts   # Route definitions + handlers
│   │   ├── service/
│   │   │   └── user.service.ts
│   │   ├── repository/
│   │   │   └── user.repository.ts
│   │   ├── entity/
│   │   │   └── user.entity.ts
│   │   ├── dto/
│   │   │   ├── create-user.dto.ts
│   │   │   └── update-user.dto.ts
│   │   ├── interface/
│   │   │   └── user.interface.ts
│   │   ├── validator/
│   │   │   └── user.validator.ts
│   │   └── index.ts
│   │
│   ├── auth/
│   ├── product/
│   ├── order/
│   ├── payment/
│   └── notification/
│
├── app.ts
└── server.ts
```

### controller (owns routes — no separate `route/` folder)

```typescript
// module/user/controller/user.controller.ts
import { Router, Request, Response } from "express";

export const userRouter = Router();

userRouter.get("/", async (req: Request, res: Response) => {
  res.json({ message: "All users" });
});

userRouter.get("/:id", async (req: Request, res: Response) => {
  res.json({ id: req.params.id });
});

userRouter.post("/", async (req: Request, res: Response) => {
  res.json({ message: "User created" });
});
```

### index.ts (module export)

```typescript
import { userRouter } from "./controller/user.controller";
export default userRouter;
```

### app.ts (register modules)

```typescript
import express from "express";
import userModule from "./module/user";

const app = express();
app.use(express.json());
app.use("/user", userModule);
```

---

## 3. Folder Naming Rules

| Rule | Example |
|------|---------|
| Always singular | `module/`, `controller/`, `service/`, `entity/` |
| File names match folder | `user.controller.ts`, `user.service.ts` |
| No `route/` folder | Controller owns route definitions |
| Consistent across all modules | Never mix `users/` with `service/` |

---

## 4. When to Use Each

| Project Type | Structure |
|---|---|
| SaaS / ERP / HMS / Multi-tenant | Next.js monolith (`src/app` + `src/frontend` + `src/backend`) |
| Standalone API | Node.js with `src/module/` |
| Blog / Portfolio / Landing page | Simple Next.js (`app/` only) |

---

## 5. Projects Using This Convention

- Student Records Management System
- SmartQueue Hospital Queue Management
- Product Expiry Alert Management
- Prospera (current)
