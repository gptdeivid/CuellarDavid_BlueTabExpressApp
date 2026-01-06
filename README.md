# 🚀 IBM Express Microservice

Microservicio profesional de Node.js Express con APIs duales (REST + GraphQL) siguiendo los requerimientos del proyecto.

---

## 📋 Requerimientos del Proyecto

Este proyecto cumple con los siguientes requerimientos:

| Requerimiento | Estado | Implementación |
|---------------|--------|----------------|
| **Programación Orientada a Objetos** | ✅ | Clases TypeScript con modificadores de acceso |
| **Patrón Singleton** | ✅ | `App.ts` con constructor privado y `getInstance()` |
| **Express como atributo readonly** | ✅ | `public get app(): Express` |
| **Solo tráfico de example.com** | ✅ | Middleware `domainRestriction.ts` |
| **OpenAPI Swagger** | ✅ | Documentación en `/api-docs` |
| **GraphQL** | ✅ | Apollo Server en `/graphql` |
| **PrismaJS con SQLite** | ✅ | Base de datos con modelo User |
| **Tabla Usuario (ID, Nombre)** | ✅ | Campos `id` y `name` en Prisma |
| **REST: GET /users/{id}** | ✅ | Endpoint implementado |
| **GraphQL con variables** | ✅ | Query `user(id: String!)` |
| **Coexistencia REST & GraphQL** | ✅ | Mismo servidor Express |

---

## 🏗️ Arquitectura: Patrón Singleton

El patrón Singleton garantiza **una única instancia** de la aplicación Express:

```typescript
export class App {
  // Única instancia estática
  private static instance: App;
  
  // Express como atributo readonly
  private readonly _app: Express;

  // Constructor PRIVADO - no se puede usar "new App()"
  private constructor() {
    this._app = express();
    this.initializeMiddleware();
    this.initializeRoutes();
  }

  // ÚNICO método para obtener la instancia
  public static getInstance(): App {
    if (!App.instance) {
      App.instance = new App();
    }
    return App.instance;
  }

  // Atributo readonly de la app de Express
  public get app(): Express {
    return this._app;
  }
}
```

**Uso:**
```typescript
const app1 = App.getInstance();  // Crea la instancia
const app2 = App.getInstance();  // Retorna LA MISMA instancia
app1 === app2;  // true - siempre es la misma
```

---

## 🔒 Restricción de Dominio: example.com

Solo se permite tráfico desde el dominio **example.com** (y localhost:3000 para desarrollo):

```typescript
const allowedHosts = [
  'example.com',
  'www.example.com',
  'localhost:3000',  // Para pruebas locales
];

// Cualquier otro dominio recibe 403 Forbidden
```

| Dominio | Resultado |
|---------|-----------|
| `example.com` | ✅ Permitido |
| `www.example.com` | ✅ Permitido |
| `localhost:3000` | ✅ Permitido (desarrollo) |
| Cualquier otro | ❌ 403 Forbidden |

---

## 🗄️ Base de Datos: PrismaJS + SQLite

### Modelo de Usuario

```prisma
model User {
  id   String @id @default(cuid())  // ID único
  name String                        // Nombre
}
```

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | String | Identificador único (CUID) |
| `name` | String | Nombre del usuario |

---

## 📡 API REST

### Endpoint: `GET /users/{id}`

**Consultar usuario por ID:**
```http
GET http://localhost:3000/users/user1
Host: localhost:3000
```

**Respuesta exitosa (200):**
```json
{
  "id": "user1",
  "name": "John Doe"
}
```

**Usuario no encontrado (404):**
```json
{
  "error": "Not Found",
  "message": "User with ID 'xyz' not found"
}
```

**Dominio no autorizado (403):**
```json
{
  "error": "Forbidden",
  "message": "Access denied. This API only accepts traffic from example.com or localhost:3000."
}
```

---

## 🔷 API GraphQL

### Endpoint: `POST /graphql`

### Esquema

```graphql
type User {
  id: String!
  name: String!
}

type Query {
  user(id: String!): User
}
```

### Query con Variables

```graphql
query GetUser($id: String!) {
  user(id: $id) {
    id
    name
  }
}
```

**Variables:**
```json
{
  "id": "<id>"
}
```

### Query Básica

```graphql
query {
  user(id: "user1") {
    id
    name
  }
}
```

**Respuesta:**
```json
{
  "data": {
    "user": {
      "id": "user1",
      "name": "John Doe"
    }
  }
}
```

---

## 📚 Documentación OpenAPI Swagger

Disponible en: **http://localhost:3000/api-docs**

La documentación incluye:
- Especificación OpenAPI 3.0
- Descripción de todos los endpoints REST
- Esquemas de request/response
- Prueba interactiva de endpoints
- Información sobre restricción de dominio

---

## 🚀 Inicio Rápido

```bash
# 1. Instalar dependencias
npm install

# 2. Configurar base de datos
npx prisma migrate dev

# 3. Iniciar servidor
npm run dev
```

**Resultado:**
```
🚀 Server is running on http://localhost:3000
📚 Swagger docs available at http://localhost:3000/api-docs
🔒 GraphQL endpoint at http://localhost:3000/graphql
```

---

## 🔗 Endpoints

| URL | Tipo | Descripción |
|-----|------|-------------|
| `/users/:id` | REST GET | Obtener usuario por ID |
| `/graphql` | GraphQL POST | Consultas GraphQL |
| `/api-docs` | Swagger | Documentación interactiva |
| `/health` | REST GET | Estado del servidor |

---

## 📁 Estructura del Proyecto

```
src/
├── app/
│   └── App.ts              # Singleton con Express readonly
├── middleware/
│   ├── domainRestriction.ts  # Filtro example.com
│   └── errorHandler.ts
├── routes/
│   └── userRoutes.ts       # GET /users/{id}
├── graphql/
│   ├── typeDefs.ts         # Esquema GraphQL
│   └── resolvers.ts        # Query user(id)
├── services/
│   └── userService.ts
└── index.ts
```

---

## 🎯 Coexistencia REST & GraphQL

Ambas APIs funcionan en el **mismo microservicio**:

```typescript
// index.ts
const appInstance = App.getInstance();
const expressApp = appInstance.app;

// REST API - ya configurado en App.ts
// GET /users/:id

// GraphQL API - Apollo Server
expressApp.use('/graphql', expressMiddleware(apolloServer));

// Mismo puerto, mismo servidor
appInstance.listen(3000);
```

---

## 👤 Usuarios de Prueba

| ID | Nombre |
|----|--------|
| user1 | John Doe |
| user2 | Jane Smith |
| user3 | Bob Wilson |

---

*Microservicio desarrollado con Express.js, TypeScript, Prisma, Apollo GraphQL y Swagger*

-----------

#Old Readme


# 🚀 IBM Express Microservice

Un microservicio profesional de Node.js con APIs duales (REST + GraphQL) para gestión de usuarios.

---

## 📋 ¿Qué es esta aplicación?

Esta aplicación es un **microservicio** - un servidor pequeño y enfocado que hace una cosa bien: gestionar usuarios a través de dos tipos de APIs.

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

## 🛠️ Tecnologías Utilizadas

| Tecnología | Propósito |
|------------|-----------|
| **Express.js** | Framework web para manejar peticiones HTTP |
| **TypeScript** | JavaScript con tipos para código más seguro |
| **Prisma** | ORM para comunicarse con la base de datos |
| **SQLite** | Base de datos ligera (archivo) |
| **Apollo Server** | Servidor GraphQL |
| **Swagger** | Documentación interactiva de la API |

---

## 🚀 Cómo Iniciar

### Requisitos Previos

- **Node.js** versión 18 o superior
- **npm** (viene con Node.js)

### Pasos de Instalación

```bash
# 1. Ir al directorio del proyecto
cd "c:\Users\cuell\OneDrive\Escritorio\IBM Express"

# 2. Instalar dependencias
npm install

# 3. Configurar la base de datos
npx prisma migrate dev

# 4. Iniciar el servidor
npm run dev
```

### Resultado Esperado

```
🚀 Server is running on http://localhost:3000
📚 Swagger docs available at http://localhost:3000/api-docs
🔒 GraphQL endpoint at http://localhost:3000/graphql
```

---

## 🔗 Endpoints Disponibles

| URL | Descripción |
|-----|-------------|
| `http://localhost:3000/users/:id` | API REST - Obtener usuario por ID |
| `http://localhost:3000/graphql` | API GraphQL - Interfaz de consultas |
| `http://localhost:3000/api-docs` | Documentación Swagger |
| `http://localhost:3000/health` | Verificación de salud del servidor |

---

## 📡 Cómo Usar la API

### API REST

**Obtener un usuario:**
```
GET http://localhost:3000/users/user1
```

**Respuesta exitosa (200):**
```json
{
  "id": "user1",
  "name": "John Doe"
}
```

**Usuario no encontrado (404):**
```json
{
  "error": "Not Found",
  "message": "User with ID 'xyz' not found"
}
```

---

### API GraphQL

**Consulta básica:**
```graphql
query {
  user(id: "user1") {
    id
    name
  }
}
```

**Respuesta:**
```json
{
  "data": {
    "user": {
      "id": "user1",
      "name": "John Doe"
    }
  }
}
```

---

## 🔒 Seguridad: Restricción de Dominio

La aplicación **solo acepta tráfico** de estos dominios:

| Dominio | Permitido |
|---------|-----------|
| `localhost:3000` | ✅ Sí |
| `example.com` | ✅ Sí |
| Cualquier otro | ❌ No (403 Forbidden) |

Esto protege la API de acceso no autorizado.

---

## 🗄️ Base de Datos

### Modelo de Usuario

```prisma
model User {
  id   String @id @default(cuid())  // ID único
  name String                        // Nombre del usuario
}
```

### Usuarios de Prueba

La base de datos viene con estos usuarios:

| ID | Nombre |
|----|--------|
| user1 | John Doe |
| user2 | Jane Smith |
| user3 | Bob Wilson |

### Explorar la Base de Datos

```bash
npx prisma studio
```

Abre un navegador visual para ver y editar datos.

---

## 📁 Estructura del Proyecto

```
IBM Express/
├── src/
│   ├── index.ts              # Punto de entrada
│   ├── app/
│   │   └── App.ts            # Aplicación Singleton
│   ├── middleware/
│   │   ├── domainRestriction.ts  # Seguridad de dominio
│   │   └── errorHandler.ts       # Manejo de errores
│   ├── routes/
│   │   └── userRoutes.ts     # Rutas REST
│   ├── graphql/
│   │   ├── typeDefs.ts       # Esquema GraphQL
│   │   └── resolvers.ts      # Resolvedores GraphQL
│   └── services/
│       └── userService.ts    # Lógica de negocio
├── prisma/
│   ├── schema.prisma         # Esquema de base de datos
│   ├── seed.ts               # Datos iniciales
│   └── dev.db                # Archivo de base de datos
├── swagger.yaml              # Especificación OpenAPI
└── package.json              # Configuración del proyecto
```

---

## 📝 Comandos Útiles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Iniciar servidor de desarrollo |
| `npm run build` | Compilar TypeScript |
| `npm start` | Ejecutar versión compilada |
| `npx prisma studio` | Abrir explorador de base de datos |
| `npx prisma migrate dev` | Crear/actualizar tablas |
| `npx prisma db seed` | Recargar datos de prueba |

---

## 🏛️ Patrón Singleton

La aplicación usa el **patrón Singleton** para garantizar que solo exista UNA instancia del servidor:

```typescript
// Solo puede haber una instancia
const app1 = App.getInstance();  // Crea la instancia
const app2 = App.getInstance();  // Devuelve LA MISMA instancia

app1 === app2;  // true
```

**¿Por qué?** Evita conflictos de puertos y asegura configuración consistente.

---

## 📚 Documentación Adicional

Ver la carpeta `Documentation for David/` para guías detalladas en inglés:

- Arquitectura del proyecto
- Explicación de dependencias
- Tutorial de TypeScript
- Guía de Prisma y base de datos
- Solución de problemas

---

## ❓ Preguntas Frecuentes

**¿Por qué recibo error 403?**
Tu petición viene de un dominio no autorizado. Asegúrate de usar `localhost:3000`.

**¿Cómo reinicio la base de datos?**
```bash
npx prisma migrate reset
```

**¿Cómo agrego más usuarios?**
```bash
npx prisma studio
# O edita prisma/seed.ts y ejecuta: npx prisma db seed
```

---

*Desarrollado con ❤️ usando Express.js, TypeScript, Prisma y Apollo GraphQL*
