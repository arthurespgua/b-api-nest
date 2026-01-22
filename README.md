# 🚀 Bambú ToDo - API REST (NestJS)

## 📋 Descripción

API REST para la gestión de tareas (ToDo App) desarrollada con **NestJS 11** y **TypeScript**. Implementa arquitectura hexagonal (Clean Architecture), autenticación JWT, gestión de usuarios y tareas con PostgreSQL como base de datos. El proyecto sigue las mejores prácticas de desarrollo backend con seguridad, validación de datos y manejo robusto de errores.

## ✨ Características Implementadas

### ✅ Requerimientos Obligatorios
- ✅ **Framework**: NestJS 11.0.12 con TypeScript 5.8.2
- ✅ **Base de Datos**: PostgreSQL 17 con Prisma ORM 6.19.2
- ✅ **Autenticación**: JWT con tokens de 24 horas
- ✅ **Versionamiento**: API v1 con versionamiento URI
- ✅ **Validación**: class-validator + class-transformer
- ✅ **Migraciones**: Sistema de migraciones de Prisma

### 🌟 Características Extra (Puntos Adicionales)
- ✅ **Arquitectura Hexagonal**: Ports & Adapters (Clean Architecture)
- ✅ **Result Pattern**: Manejo funcional de errores sin excepciones
- ✅ **Domain Errors**: Jerarquía completa de errores de dominio
- ✅ **Global Exception Filter**: Manejo centralizado de errores HTTP
- ✅ **Seguridad Avanzada**:
  - Helmet para headers HTTP seguros
  - Rate Limiting (100 req/15min global, 5 login/15min)
  - bcrypt para hashing de contraseñas
  - Validación de sesiones en BD + JWT
- ✅ **Session Management**:
  - Sistema de expiración automática
  - Cron job para limpieza de sesiones cada hora
  - Logout con invalidación inmediata
  - CASCADE delete (user → sessions, tasks)
- ✅ **Logging**: Winston con rotación diaria de archivos
- ✅ **Docker**: docker-compose.yml para desarrollo
- ✅ **Variables de Entorno**: Configuración con dotenv
- ✅ **Guards**: JwtAuthGuard global con decorador @Public()
- ✅ **Pagination & Filters**: En endpoint de tareas

### 🎯 Funcionalidades Principales

#### Autenticación y Usuarios
- ✅ Registro de usuarios con validación automática
- ✅ Login con generación de JWT (24h)
- ✅ Logout con invalidación de sesión
- ✅ Validación de token JWT
- ✅ Hashing de contraseñas con bcrypt
- ✅ Una sesión activa por usuario (invalidación de anteriores)
- ✅ Protección de rutas con JWT + sesión en BD

#### Gestión de Tareas
- ✅ Crear tarea (auto-asignada al usuario autenticado)
- ✅ Listar tareas del usuario (con paginación)
- ✅ Actualizar tarea (solo propietario)
- ✅ Eliminar tarea (solo propietario)
- ✅ Filtros:
  - Por prioridad (baja, media, alta)
  - Por estado (completada/pendiente)
  - Paginación (page, limit)

## 🏗️ Arquitectura

```
src/
├── app/
│   ├── app.module.ts                   # Módulo principal
│   ├── users/                          # Módulo de Usuarios
│   │   ├── domain/                     # Capa de Dominio
│   │   │   ├── entities/               # User.entity.ts
│   │   │   └── repositories/           # Interfaces (ports)
│   │   ├── application/                # Casos de Uso
│   │   │   ├── create-user/
│   │   │   ├── login-user/
│   │   │   ├── logout-user/
│   │   │   ├── update-user/
│   │   │   └── delete-user/
│   │   ├── infrastructure/             # Adaptadores
│   │   │   ├── repositories/           # Implementación Prisma
│   │   │   └── mappers/                # DTOs → Entities
│   │   └── presentation/               # Controladores
│   │       └── users.controller.ts
│   │
│   └── tasks/                          # Módulo de Tareas
│       ├── domain/
│       │   ├── entities/               # Task.entity.ts
│       │   └── repositories/
│       ├── application/
│       │   ├── create-task/
│       │   ├── update-task/
│       │   ├── delete-task/
│       │   └── view-task-byUser/       # Con paginación
│       ├── infrastructure/
│       │   └── repositories/
│       └── presentation/
│           └── tasks.controller.ts
│
├── shared/                             # Código Compartido
│   ├── core/                           # Result, DomainError
│   ├── decorators/                     # @Public(), @CurrentUser()
│   ├── filters/                        # GlobalExceptionFilter
│   ├── guards/                         # JwtAuthGuard
│   ├── services/                       # JwtService, PasswordService
│   └── pipes/                          # ParseULIDPipe
│
├── config/                             # Configuración
├── middlewares/                        # Request/Body Logger
├── prisma/
│   ├── schema.prisma                   # Schema de BD
│   ├── migrations/                     # Historial de migraciones
│   └── seeders/                        # Seeds de datos
│
└── main.ts                             # Bootstrap de la app
```

### Capas de la Arquitectura Hexagonal

```
Presentation (Controllers)
         ↓
   Application (Use Cases)
         ↓
    Domain (Entities + Interfaces)
         ↓
Infrastructure (Prisma Repositories)
```

## 🔧 Tecnologías Utilizadas

- **NestJS**           : 11.0.12
- **TypeScript**       : 5.8.2
- **Prisma ORM**       : 6.19.2
- **PostgreSQL**       : 17
- **JWT**              : jsonwebtoken
- **bcryptjs**         : Hashing de contraseñas
- **helmet**           : 8.1.0
- **express-rate-limit**: 8.2.1
- **Winston**          : Logger
- **class-validator**  : Validación de DTOs
- **@nestjs/schedule** : Cron jobs

## 📦 Instalación y Configuración

### Prerrequisitos
- Node.js >= 18.x
- pnpm >= 9.x (o npm)
- Docker y Docker Compose (para PostgreSQL)

### 1. Clonar el Repositorio

```bash
git clone <repository-url>
cd api-nest
```

### 2. Instalar Dependencias

```bash
# Opción 1: con pnpm (recomendado)
pnpm install

# Opción 2: con npm
npm install
```

### 3. Configurar Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
# Base de Datos
DB_URL="postgresql://postgres:12345678@localhost:5555/DB_TODOLIST_BAMBU?schema=public"

# JWT
JWT_SECRET="tu-secreto-super-seguro-aqui"
JWT_EXPIRATION="24h"

# Server
PORT=3000
NODE_ENV=development

# CORS
CORS_ORIGIN="http://localhost:4200"
```

**⚠️ Importante**: Cambia `JWT_SECRET` por una cadena aleatoria y segura en producción.

### 4. Levantar la Base de Datos

```bash
# Iniciar PostgreSQL con Docker
docker-compose up -d

# Verificar que está corriendo
docker ps
```

El contenedor se levanta en el puerto **5555** con las credenciales:
- Usuario: `postgres`
- Contraseña: `12345678`
- Base de datos: `DB_TODOLIST_BAMBU`

### 5. Ejecutar Migraciones

```bash
# Aplicar todas las migraciones
npx prisma migrate deploy

# O en modo desarrollo (crea migraciones si hay cambios)
npx prisma migrate dev
```

Migraciones incluidas:
- `20260116011755_init` - Esquema inicial (Users, Tasks)
- `20260120211109_sessions_model` - Tabla Sessions
- `20260120230220_update_session_token_type` - Token como Text
- `20260121022418_add_cascade_delete_to_user_relations` - CASCADE delete
- `20260121173823_add_expires_at_to_sessions` - Expiración de sesiones

### 6. (Opcional) Generar Prisma Client

```bash
npx prisma generate
```

### 7. (Opcional) Seed de Datos

Si deseas datos de prueba:

```bash
npx ts-node prisma/seed.prisma.ts
```

### 8. Ejecutar el Proyecto

```bash
# Modo desarrollo (hot reload)
npm run start:dev

# Modo producción
npm run build
npm run start:prod
```

La API estará disponible en: **http://localhost:3000**

### 9. (Opcional) Prisma Studio

Para visualizar y editar datos en la BD:

```bash
npx prisma studio --port 3002
```

Abre: **http://localhost:3002**

## 🌐 Endpoints de la API

### Base URL
```
http://localhost:3000/api/v1
```

### Autenticación (`/users`)

| Método | Endpoint           | Descripción                | Auth Required |
|--------|--------------------|----------------------------|---------------|
| POST   | `/users/register`  | Registrar nuevo usuario    | ❌ No         |
| POST   | `/users/login`     | Iniciar sesión (JWT)       | ❌ No         |
| POST   | `/users/logout`    | Cerrar sesión              | ✅ Sí         |
| POST   | `/users/validate`  | Validar token JWT          | ✅ Sí         |
| GET    | `/users/:id`       | Obtener usuario por ID     | ✅ Sí         |
| PATCH  | `/users/:id`       | Actualizar usuario         | ✅ Sí         |
| DELETE | `/users/:id`       | Eliminar usuario           | ✅ Sí         |

### Tareas (`/tasks`)

| Método | Endpoint                  | Descripción                | Auth Required |
|--------|---------------------------|----------------------------|---------------|
| GET    | `/tasks/todo/list`        | Listar tareas (paginadas)  | ✅ Sí         |
| POST   | `/tasks/todo/create`      | Crear nueva tarea          | ✅ Sí         |
| PATCH  | `/tasks/todo/update/:id`  | Actualizar tarea           | ✅ Sí         |
| DELETE | `/tasks/todo/list/:id`    | Eliminar tarea             | ✅ Sí         |

### Ejemplos de Uso

#### 1. Registro de Usuario

```bash
curl -X POST http://localhost:3000/api/v1/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Juan Pérez",
    "email": "juan@example.com",
    "password": "Password123!"
  }'
```

**Respuesta:**
```json
{
  "message": "User created successfully",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "01JGXYZ...",
      "name": "Juan Pérez",
      "email": "juan@example.com"
    }
  }
}
```

#### 2. Login

```bash
curl -X POST http://localhost:3000/api/v1/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "juan@example.com",
    "password": "Password123!"
  }'
```

**Respuesta:**
```json
{
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "01JGXYZ...",
      "name": "Juan Pérez",
      "email": "juan@example.com"
    }
  }
}
```

#### 3. Crear Tarea

```bash
curl -X POST http://localhost:3000/api/v1/tasks/todo/create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TU_TOKEN_JWT" \
  -d '{
    "name": "Completar prueba técnica",
    "description": "Desarrollar API REST con NestJS",
    "priority": "alta"
  }'
```

#### 4. Listar Tareas con Filtros

```bash
# Con paginación
curl -X GET "http://localhost:3000/api/v1/tasks/todo/list?page=1&limit=10" \
  -H "Authorization: Bearer TU_TOKEN_JWT"

# Filtrar por prioridad y estado
curl -X GET "http://localhost:3000/api/v1/tasks/todo/list?priority=alta&status=false" \
  -H "Authorization: Bearer TU_TOKEN_JWT"
```

**Respuesta:**
```json
{
  "tasks": [
    {
      "id": "01JH...",
      "name": "Completar prueba técnica",
      "description": "Desarrollar API REST con NestJS",
      "priority": "alta",
      "status": false,
      "create_at": "2026-01-21T10:00:00.000Z",
      "update_at": "2026-01-21T10:00:00.000Z"
    }
  ],
  "total": 1,
  "page": 1,
  "limit": 10,
  "totalPages": 1
}
```

#### 5. Logout

```bash
curl -X POST http://localhost:3000/api/v1/users/logout \
  -H "Authorization: Bearer TU_TOKEN_JWT"
```

## 🔒 Seguridad

### Autenticación JWT
- Tokens válidos por **24 horas**
- Firma con algoritmo **HS256**
- Payload incluye: `id`, `email`, `name`, `iat`, `exp`

### Gestión de Sesiones
- **Una sesión activa** por usuario (se invalidan anteriores al login)
- Sesiones almacenadas en BD con fecha de expiración
- **Cron job** elimina sesiones expiradas cada hora
- Logout invalida sesión inmediatamente

### Protección de Rutas
- **JwtAuthGuard** global en todos los endpoints
- Decorador `@Public()` para rutas públicas (register, login)
- Validación doble: JWT válido + sesión existente en BD

### Hashing de Contraseñas
- **bcrypt** con salt rounds = 10
- Contraseñas nunca se almacenan en texto plano
- Script de migración para rehash de contraseñas legacy

### Rate Limiting
- **Global**: 100 requests / 15 minutos
- **Login**: 5 intentos / 15 minutos (previene fuerza bruta)

### Headers de Seguridad (Helmet)
- HSTS habilitado
- XSS Protection
- Content Security Policy
- X-Frame-Options: DENY

### Validación de Datos
- **class-validator** en todos los DTOs
- Validación de longitud de strings
- Validación de formatos (email, prioridad, etc.)
- Sanitización automática

## 🎨 Códigos HTTP Utilizados

| Código | Descripción                                  |
|--------|----------------------------------------------|
| 200    | OK - Operación exitosa                       |
| 201    | Created - Recurso creado                     |
| 400    | Bad Request - Validación fallida             |
| 401    | Unauthorized - Token inválido o expirado     |
| 403    | Forbidden - Sin permisos (no es propietario) |
| 404    | Not Found - Recurso no encontrado            |
| 409    | Conflict - Email duplicado                   |
| 500    | Internal Server Error                        |

## 🐳 Docker

### docker-compose.yml

El proyecto incluye `docker-compose.yml` para desarrollo:

```yaml
services:
  postgres:
    image: postgres:17
    container_name: postgres-todolist
    restart: always
    ports:
      - "5555:5432"
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: 12345678
      POSTGRES_DB: DB_TODOLIST_BAMBU
    volumes:
      - ./postgres:/var/lib/postgresql/data
```

**Comandos útiles:**

```bash
# Iniciar servicios
docker-compose up -d

# Ver logs
docker-compose logs -f

# Detener servicios
docker-compose down

# Detener y eliminar volúmenes (⚠️ borra datos)
docker-compose down -v
```

## 📝 Scripts Disponibles

| Script               | Descripción                                      |
|----------------------|--------------------------------------------------|
| `npm run start`      | Iniciar en modo producción                       |
| `npm run start:dev`  | Iniciar con hot reload (desarrollo)              |
| `npm run start:debug`| Iniciar con debugger                             |
| `npm run build`      | Compilar TypeScript → JavaScript                 |
| `npm run test`       | Ejecutar tests unitarios (Jest)                  |
| `npm run test:e2e`   | Ejecutar tests end-to-end                        |
| `npm run lint`       | Ejecutar ESLint                                  |
| `npm run format`     | Formatear código con Prettier                    |

### Scripts de Base de Datos

| Script                              | Descripción                              |
|-------------------------------------|------------------------------------------|
| `npx prisma migrate dev`            | Crear y aplicar migración                |
| `npx prisma migrate deploy`         | Aplicar migraciones (producción)         |
| `npx prisma migrate status`         | Ver estado de migraciones                |
| `npx prisma generate`               | Regenerar Prisma Client                  |
| `npx prisma studio`                 | Abrir UI de Prisma Studio                |
| `npx ts-node prisma/seed.prisma.ts` | Ejecutar seeds                           |

## 🧪 Testing

```bash
# Tests unitarios
npm run test

# Tests con cobertura
npm run test:cov

# Tests en modo watch
npm run test:watch

# Tests e2e
npm run test:e2e
```

## 📊 Estructura de Base de Datos

### Modelo de Datos (Prisma Schema)

```prisma
model Users {
  id           String    @id @default(uuid())
  name         String    @db.VarChar(52)
  email        String    @unique @db.VarChar(128)
  password     String    @db.VarChar(64)
  is_validated Boolean   @default(false)
  create_at    DateTime  @default(now())
  update_at    DateTime  @updatedAt
  
  sessions     Sessions[]
  tasks        Tasks[]
}

model Sessions {
  id        String   @id @default(uuid())
  token     String   @db.Text
  create_at DateTime @default(now())
  update_at DateTime @updatedAt
  expiresAt DateTime @default(dbgenerated("(now() + '24:00:00'::interval)"))
  id_user   String
  user      Users    @relation(fields: [id_user], references: [id], onDelete: Cascade)
}

model Tasks {
  id          String   @id @default(uuid())
  name        String   @db.VarChar(52)
  description String   @db.VarChar(256)
  priority    String   @db.VarChar(16)
  status      Boolean  @default(false)
  create_at   DateTime @default(now())
  update_at   DateTime @updatedAt
  id_user     String
  user        Users    @relation(fields: [id_user], references: [id], onDelete: Cascade)
}
```

### Relaciones
- **Users → Sessions**: 1:N (CASCADE delete)
- **Users → Tasks**: 1:N (CASCADE delete)

## 🚀 Deploy

### Producción

#### 1. Build de Producción

```bash
npm run build
```

Los archivos compilados estarán en `dist/`

#### 2. Variables de Entorno

Actualiza `.env` para producción:

```env
NODE_ENV=production
DB_URL="postgresql://user:password@host:5432/database?schema=public"
JWT_SECRET="tu-secreto-super-seguro-en-produccion"
PORT=3000
CORS_ORIGIN="https://tu-dominio-frontend.com"
```

#### 3. Ejecutar Migraciones

```bash
npx prisma migrate deploy
```

#### 4. Iniciar Servidor

```bash
npm run start:prod
```

### Servicios de Cloud Recomendados
- **Backend**: Railway, Render, Heroku, DigitalOcean
- **Base de Datos**: Supabase, Neon, Railway Postgres, RDS
- **Logs**: Papertrail, Loggly, Sentry

## 📖 Documentación Adicional

- [NestJS Docs](https://docs.nestjs.com)
- [Prisma Docs](https://www.prisma.io/docs)
- [TypeScript](https://www.typescriptlang.org)
- [PostgreSQL](https://www.postgresql.org/docs/)

### Documentación del Proyecto

- **Session Expiration Phase 1**: [`docs/SESSION_EXPIRATION_PHASE1.md`](docs/SESSION_EXPIRATION_PHASE1.md)

## 🔍 Troubleshooting

### Error: Puerto 3000 en uso

```bash
# Encontrar y matar proceso en puerto 3000
lsof -ti :3000 | xargs kill -9

# O cambiar puerto en .env
PORT=3001
```

### Error: Prisma Client no generado

```bash
npx prisma generate
```

### Error: Migraciones no sincronizadas

```bash
# Ver estado
npx prisma migrate status

# Sincronizar desde BD
npx prisma db pull

# Regenerar client
npx prisma generate
```

### Error: Cannot find module '@prisma/client'

```bash
pnpm install
npx prisma generate
```

### Limpiar cache de Node

```bash
rm -rf node_modules package-lock.json
pnpm install
```

## 👤 Autor

Desarrollado por **Arturo Espinosa Guadarrama** como parte de una prueba técnica para Bambu Techservices.

## 📝 Notas Técnicas

### Arquitectura Hexagonal
Este proyecto sigue **Clean Architecture** con separación clara de capas:
- **Domain**: Entidades y contratos (independiente de frameworks)
- **Application**: Casos de uso (lógica de negocio)
- **Infrastructure**: Implementaciones concretas (Prisma, HTTP)
- **Presentation**: Controladores (NestJS)

### Result Pattern
En lugar de lanzar excepciones, los use cases retornan `Result<T, E>`:

```typescript
const result = await createUserUseCase.execute(data);

if (result.isFailure()) {
  throw result.getError(); // DomainError
}

return result.getValue(); // User
```

### Domain Errors
Jerarquía completa de errores de dominio con códigos HTTP:
- `NotFoundError` (404)
- `ValidationError` (400)
- `UnauthorizedError` (401)
- `ForbiddenError` (403)
- `ConflictError` (409)
- `BusinessRuleError` (422)
- `InternalError` (500)

### Guards y Decoradores
- **JwtAuthGuard**: Validación automática de JWT + sesión
- **@Public()**: Marca rutas públicas (sin auth)
- **@CurrentUser()**: Inyecta payload del JWT en parámetro

---

**¿Listo para comenzar?** 🎉

```bash
# 1. Instalar dependencias
pnpm install

# 2. Levantar PostgreSQL
docker-compose up -d

# 3. Aplicar migraciones
npx prisma migrate deploy

# 4. Iniciar servidor
npm run start:dev
```

Luego abre [http://localhost:3000](http://localhost:3000) en tu navegador o Postman.

