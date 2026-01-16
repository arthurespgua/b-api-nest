# Bambú ToDo - API

### Instrucciones:

Objetivo
Desarrollar una REST API para la gestión de tareas (To-Do App) utilizando Node.js. El objetivo de esta prueba es evaluar tus habilidades en el diseño, desarrollo y estructuración de servicios RESTful, manejo de autenticación y buenas prácticas de desarrollo backend.

1. Autenticación:

    a. POST /v1/register

    Registra un nuevo usuario con los siguientes campos:
    i.   nombre (string, requerido)
    ii.  email (string, requerido, único)
    iii. password (string, requerido)

    b. POST /v1/login

    Autentica a un usuario existente y genera un token JWT válido por 24 horas.
    i. Campos requeridos: email, password

2. Módulo de Tareas (To-Do)

    a. POST /v1/todo/create

    Crea una nueva tarea con los siguientes campos:
    i. nombre (string, requerido)
    ii. prioridad (enum: baja, media, alta, requerido)
    iii. finalizada (boolean, por defecto en falso)
    iv. fechaCreacion (date, generada automáticamente)
    v. fechaActualizacion (date, generada automáticamente)

Requerimientos Técnicos
    ● Lenguaje: Node.js con Typescript
    ● Framework: Express.js (puedes usar otro si lo prefieres)
    ● Base de datos: SQL obligatoria (PostgreSQL, MySQL, etc.)
    ● Autenticación: JWT
    ● ORM o query builder sugerido: Prisma, Sequelize, o TypeORM

Extra (Opcional)
Los siguientes puntos no son obligatorios, pero otorgan puntos adicionales si se implementan correctamente:
    ● Framework: NestJS
    ● Manejo de variables de entorno con dotenv o equivalente.
    ● Documentación básica (README detallado de como levantar el proyecto)
    ● Dockerfile y docker-compose.yml para levantar el proyecto de forma automatizada y dockerizada.
    ● Versionamiento de migraciones de base de datos (por ejemplo, usando el sistema
    de migraciones de Prisma, Sequelize o TypeORM). Criterios de Evaluación
    ● Diseño y estructura del proyecto (claridad, organización y escalabilidad).
    ● Uso correcto de códigos HTTP.
    ● Validación de datos de entrada.
    ● Seguridad (manejo de contraseñas y autenticación)

Pasos a seguir para levantar el proyecto:

1. Levantar la base de datos

```bash
docker-compose up -d
```

2. Ejecutar el comando siguiente para realizar la migración

```bash
npm run migrate
```

3. Ejecutar prisma studio medoamte el siguiente comando:

```bash
npx prisma studio --port 3002
```

4. 
```bash

```
