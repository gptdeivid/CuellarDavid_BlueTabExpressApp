# IBM Express Microservice

Microservicio dual REST + GraphQL desarrollado con Node.js, Express, TypeScript, Prisma y Apollo Server.

---

## ¿Qué es esta aplicación?

Un microservicio enfocado en gestión de usuarios a través de dos APIs que coexisten en el mismo servidor.

```
┌─────────────────────────────────────┐
│         SERVIDOR EXPRESS            │
│  ┌───────────────────────────────┐  │
│  │    CAPA DE SEGURIDAD          │  │
│  │  • Restricción de dominio     │  │
│  │  • Manejo de errores          │  │
│  └───────────────────────────────┘  │
│           │           │             │
│     ┌─────┴───┐ ┌─────┴───┐         │
│     │  REST   │ │ GraphQL │         │
│     │ /users  │ │/graphql │         │
│     └────┬────┘ └────┬────┘         │
│          └─────┬─────┘              │
│          ┌─────┴─────┐              │
│          │  PRISMA   │              │
│          │  SQLite   │              │
│          └───────────┘              │
└─────────────────────────────────────┘
```

---

## Inicio Rápido

```bash
npm install
npx prisma migrate dev
npm run dev
```

El servidor inicia en `http://localhost:3000` con:
- REST API en `/users/:id`
- GraphQL en `/graphql`
- Swagger en `/api-docs`

---

## Arquitectura

### Patrón Singleton

La clase `App` implementa el patrón Singleton con un constructor privado, garantizando una única instancia del servidor Express.

```typescript
export class App {
  private static instance: App;
  private readonly _app: Express;

  private constructor() {
    this._app = express();
    this.initializeMiddleware();
    this.initializeRoutes();
  }

  public static getInstance(): App {
    if (!App.instance) {
      App.instance = new App();
    }
    return App.instance;
  }

  public get app(): Express {
    return this._app;
  }
}
```

El atributo `_app` es `readonly` y se expone mediante un getter, cumpliendo con el requerimiento de Express como atributo de solo lectura.

### Restricción de Dominio

El middleware `domainRestriction.ts` filtra el tráfico por host, permitiendo únicamente:
- `example.com` / `www.example.com`
- `localhost:3000` (desarrollo)

Cualquier otro origen recibe `403 Forbidden`.

---

## Base de Datos

Prisma ORM con SQLite local. El modelo `User` tiene dos campos:

```prisma
model User {
  id   String @id @default(cuid())
  name String
}
```

Usuarios de prueba precargados:

| ID | Nombre |
|----|--------|
| user1 | John Doe |
| user2 | Jane Smith |
| user3 | Bob Wilson |

Para explorar los datos: `npx prisma studio`

---

## API REST

**GET /users/:id**

```bash
curl http://localhost:3000/users/user1
```

Respuestas:
- `200` - Usuario encontrado
- `404` - Usuario no existe
- `403` - Dominio no autorizado

---

## API GraphQL

**POST /graphql**

Query con variables:

```graphql
query GetUser($id: String!) {
  user(id: $id) {
    id
    name
  }
}
```

```json
{ "id": "user1" }
```

Disponible también el playground de Apollo en `/graphql`.

---

## Estructura

```
src/
├── app/App.ts                # Singleton
├── middleware/
│   ├── domainRestriction.ts  # Filtro de dominio
│   └── errorHandler.ts
├── routes/userRoutes.ts      # REST endpoints
├── graphql/
│   ├── typeDefs.ts           # Schema GraphQL
│   └── resolvers.ts
├── services/userService.ts   # Lógica de negocio
└── index.ts                  # Entry point

prisma/
├── schema.prisma
├── seed.ts
└── dev.db

swagger.yaml                  # OpenAPI spec
```

---

## Comandos

| Comando | Uso |
|---------|-----|
| `npm run dev` | Desarrollo |
| `npm run build` | Compilar TS |
| `npm start` | Producción |
| `npx prisma studio` | GUI de base de datos |
| `npx prisma migrate dev` | Migraciones |
| `npx prisma db seed` | Seed data |

---

## Documentación

- **Swagger UI**: http://localhost:3000/api-docs
- **GraphQL Playground**: http://localhost:3000/graphql
- **Guías adicionales**: `Documentation for David/`
