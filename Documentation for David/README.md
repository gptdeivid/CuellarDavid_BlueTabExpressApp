# 📚 IBM Express Microservice Documentation

A complete guide from beginner to advanced for this dual-API Express microservice.

---

## 🎯 Start Here

| Your Goal | Read This |
|-----------|-----------|
| Just get it running | [Getting Started](./README_GettingStarted.md) |
| Understand the codebase | [Architecture](./README_Architecture.md) |
| Learn about dependencies | [Node Modules](./README_NodeModules.md) |
| Work with the database | [Database & Prisma](./README_Database.md) |
| Use the APIs | [API Reference](./README_API.md) |
| Understand middleware | [Middleware Deep Dive](./README_Middleware.md) |
| Learn TypeScript basics | [TypeScript 101](./README_TypeScript101.md) |
| Why these tech choices? | [Design Decisions](./README_Justifications.md) |
| Fix common issues | [Troubleshooting](./README_Troubleshooting.md) |

---

## 📁 Project Overview

```
IBM Express/
├── src/                      # Source code
│   ├── app/App.ts            # Main application (Singleton)
│   ├── middleware/           # Request processors
│   ├── routes/               # REST endpoints
│   ├── graphql/              # GraphQL API
│   └── services/             # Business logic
├── prisma/                   # Database
├── Documentation for David/  # You are here!
├── swagger.yaml              # API documentation spec
└── package.json              # Project configuration
```

---

## 🚀 Quick Commands

```bash
npm install          # Install all dependencies
npm run dev          # Start development server
npm run build        # Compile TypeScript to JavaScript
npm start            # Run compiled production build
npx prisma studio    # Visual database browser
```

---

## 🔗 Endpoints

| URL | Description |
|-----|-------------|
| http://localhost:3000/users/:id | REST - Get user by ID |
| http://localhost:3000/graphql | GraphQL playground |
| http://localhost:3000/api-docs | Swagger documentation |
| http://localhost:3000/health | Health check |

---

## 📖 Reading Path

**Beginner** → Getting Started → Architecture → API Reference

**Intermediate** → Database → Middleware → Node Modules

**Advanced** → TypeScript 101 → Design Decisions → Troubleshooting

Happy learning! 🎉
