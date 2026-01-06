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
