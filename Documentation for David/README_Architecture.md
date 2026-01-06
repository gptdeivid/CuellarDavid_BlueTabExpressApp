# 🏗️ Architecture Overview

Understand how this project is structured and why.

---

## The Big Picture

This is a **microservice** - a small, focused application that does one thing well: manages users through two types of APIs.

```
┌─────────────────────────────────────────────────────────────┐
│                     EXPRESS SERVER                          │
│  ┌──────────────────────────────────────────────────────┐   │
│  │                    MIDDLEWARE                         │   │
│  │  Domain Check → JSON Parser → Error Handler          │   │
│  └──────────────────────────────────────────────────────┘   │
│                            │                                │
│         ┌──────────────────┼──────────────────┐             │
│         ▼                  ▼                  ▼             │
│   ┌──────────┐      ┌──────────┐      ┌──────────┐          │
│   │   REST   │      │ GraphQL  │      │ Swagger  │          │
│   │  /users  │      │ /graphql │      │/api-docs │          │
│   └────┬─────┘      └────┬─────┘      └──────────┘          │
│        │                 │                                  │
│        └────────┬────────┘                                  │
│                 ▼                                           │
│         ┌──────────────┐                                    │
│         │   SERVICES   │                                    │
│         │ (User Logic) │                                    │
│         └──────┬───────┘                                    │
│                ▼                                            │
│         ┌──────────────┐                                    │
│         │    PRISMA    │                                    │
│         │  (Database)  │                                    │
│         └──────────────┘                                    │
└─────────────────────────────────────────────────────────────┘
```

---

## Project Structure Explained

```
src/
├── index.ts              # 🚪 Entry point - starts everything
├── app/
│   └── App.ts            # 🏠 Singleton application class
├── middleware/
│   ├── domainRestriction.ts  # 🔒 Blocks unauthorized domains
│   └── errorHandler.ts       # ⚠️ Catches and formats errors
├── routes/
│   └── userRoutes.ts     # 🛤️ REST API endpoints
├── graphql/
│   ├── typeDefs.ts       # 📋 GraphQL schema definitions
│   └── resolvers.ts      # 🔧 GraphQL query handlers
└── services/
    ├── prismaService.ts  # 🔌 Database connection
    └── userService.ts    # 👤 User business logic
```

### Detailed Breakdown

| File | Purpose | When It Runs |
|------|---------|--------------|
| `index.ts` | Bootstraps the app, starts the server | Once at startup |
| `App.ts` | Creates and configures Express | Once (Singleton) |
| `domainRestriction.ts` | Validates request origin | Every request |
| `errorHandler.ts` | Catches uncaught errors | When errors occur |
| `userRoutes.ts` | Handles `/users/*` requests | REST API calls |
| `typeDefs.ts` | Defines GraphQL schema | GraphQL calls |
| `resolvers.ts` | Executes GraphQL queries | GraphQL calls |
| `userService.ts` | Database query logic | Any user operation |

---

## The Singleton Pattern

### What Is It?

A **Singleton** ensures only ONE instance of a class exists:

```typescript
// ❌ Normal class - creates new instance each time
const app1 = new App();  // Instance #1
const app2 = new App();  // Instance #2 (different!)

// ✅ Singleton - always returns same instance
const app1 = App.getInstance();  // Creates instance
const app2 = App.getInstance();  // Returns SAME instance
app1 === app2  // true
```

### How It Works in This Project

```typescript
export class App {
  // Static variable holds the single instance
  private static instance: App;
  
  // The actual Express app
  private readonly _app: Express;

  // PRIVATE constructor - can't use "new App()"
  private constructor() {
    this._app = express();
    // ... setup middleware, routes
  }

  // The ONLY way to get the app
  public static getInstance(): App {
    if (!App.instance) {
      App.instance = new App();
    }
    return App.instance;
  }

  // Read-only access to Express instance
  public get app(): Express {
    return this._app;
  }
}
```

### Why Use Singleton Here?

| Problem Without | Solution With Singleton |
|-----------------|------------------------|
| Multiple servers could start | Only one server ever |
| Middleware attached multiple times | Attached once |
| Configuration inconsistency | Single source of truth |
| Port conflicts | Impossible |

---

## Request Flow

When a request comes in, it flows through layers:

```
1. REQUEST ARRIVES
        ↓
2. MIDDLEWARE PIPELINE
   ┌─────────────────────────────┐
   │ Domain Restriction          │ → Block if unauthorized
   │ JSON Body Parser            │ → Parse request body
   └─────────────────────────────┘
        ↓
3. ROUTE MATCHING
   ┌─────────────────────────────┐
   │ /users/:id    → userRoutes  │
   │ /graphql      → Apollo      │
   │ /api-docs     → Swagger     │
   │ /health       → Health check│
   └─────────────────────────────┘
        ↓
4. HANDLER EXECUTION
   ┌─────────────────────────────┐
   │ UserService.findById()      │
   │     ↓                       │
   │ Prisma Database Query       │
   └─────────────────────────────┘
        ↓
5. RESPONSE SENT
```

---

## Layer Responsibilities

### 1. Middleware Layer
**What**: Functions that run before routes
**Why**: Cross-cutting concerns (security, logging, parsing)
**Files**: `middleware/*.ts`

### 2. Routes/Controllers Layer
**What**: HTTP endpoint definitions
**Why**: Handle incoming requests, validate input, return responses
**Files**: `routes/*.ts`, `graphql/*.ts`

### 3. Service Layer
**What**: Business logic
**Why**: Reusable logic, not tied to HTTP specifics
**Files**: `services/*.ts`

### 4. Data Layer
**What**: Database access
**Why**: Abstract database operations
**Files**: Prisma client

---

## Key Concepts

### Dependency Inversion

Higher layers depend on abstractions, not concrete implementations:

```
Routes → Service Interface → Prisma Implementation
```

This means you could swap Prisma for another ORM without changing routes.

### Separation of Concerns

Each file has ONE job:
- `domainRestriction.ts` - ONLY checks domains
- `userService.ts` - ONLY handles user logic
- `userRoutes.ts` - ONLY handles HTTP routing

### Single Source of Truth

- App configuration: `App.ts` Singleton
- Database schema: `schema.prisma`
- API spec: `swagger.yaml`

---

## Next Steps

- [Middleware Deep Dive](./README_Middleware.md) - Understand the middleware pipeline
- [Database & Prisma](./README_Database.md) - Learn how data is stored
