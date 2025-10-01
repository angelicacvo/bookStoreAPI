# BookStore App – Guía completa (Backend + Frontend)

Esta guía te lleva paso a paso para levantar, entender y extender este proyecto full‑stack (Node/Express + TypeScript en el backend y Vite + TypeScript en el frontend). Está pensada como material de estudio y referencia rápida para tu prueba: incluye arquitectura, comandos, flujos de trabajo y solución de problemas.

## Resumen del proyecto

- Objetivo: App de librería con autenticación JWT y roles (admin/usuario), catálogo de libros y CRUD de libros (solo admin).
- Backend: Node.js + Express + TypeScript; almacenamiento en archivos JSON; middlewares de auth y validación (Zod); rutas dinámicas.
- Frontend: Vite + TypeScript; Axios; SweetAlert2 para feedback; vistas estáticas con lógica de acceso por rol y redirecciones.
- Autenticación: Inicio de sesión con email + password (bcrypt). El backend entrega un JWT con userId, email, role, name. El frontend guarda el token en localStorage y aplica guardas por rol.

## Estructura de carpetas

```
bookStoreAPI/
  backend/
    src/
      app.ts                      # Bootstrap del servidor Express
      controllers/                # Controladores (auth, books, users)
      interfaces/                 # Tipos TS
      middlewares/                # auth, logger, zod
      models/                     # *.json con datos (users, books, ...)
      routes/                     # routers y router.ts (carga dinámica)
      services/                   # lógica de negocio y acceso a archivos
    package.json
    tsconfig.json

  frontend/
    bookstorefront/
      public/
        index.html
        views/
          login.html
          register.html
          search-books.html
          edit-books.html
      ts/
        main.ts                  # punto de entrada – inicializa por vista
        auth.ts                  # login + helpers de token
        users.ts                 # registro
        books.ts                 # lógica de libros (render + CRUD)
      package.json
```

## Requisitos previos

- Node.js 18+ recomendado (funciona con 16+, pero mejor 18/20)
- npm 8+
- Windows PowerShell (esta guía usa comandos para PowerShell)

Comprueba versiones (opcional):

```powershell
node -v
npm -v
```

## Configuración inicial (una sola vez)

1) Instala dependencias del backend

```powershell
cd backend
npm install
```

2) Instala dependencias del frontend

```powershell
cd ../frontend/bookstorefront
npm install
```

3) Variables de entorno (backend)

- El backend usa por defecto PORT=3002 y un JWT secret por defecto. Puedes crear un archivo `.env` en `backend/` para personalizar:

```
# backend/.env
PORT=3002
JWT_SECRET=secretkey
CORS_ORIGIN=http://localhost:5173
```

Nota: Si no creas `.env`, el código corre con valores por defecto compatibles con el frontend.

## Cómo ejecutar (modo desarrollo)

- Abre dos terminales (o pestañas) y ejecuta backend y frontend por separado.

1) Backend

```powershell
cd backend
# Opción A: desarrollo con recarga
npm run dev

# Opción B: compilar y ejecutar
npm run build; npm start
```

Por defecto escucha en http://localhost:3002

2) Frontend (Vite)

```powershell
cd frontend/bookstorefront
npm run dev
```

Abre http://localhost:5173

## Cuentas de prueba (password 123)

- Usuario: ana.gomez@example.com / 123 (rol user)
- Admin: carlos.perez@example.com / 123 (rol admin)

Estos usuarios están en `backend/src/models/users.json`. La clave está hasheada con bcrypt y corresponde a "123".

## Arquitectura y flujo

- Frontend
  - `public/index.html`: Home con cards de libros. Importa `ts/main.ts` que detecta la vista y ejecuta la init correspondiente.
  - `public/views/login.html` y `register.html`: autenticación. El login guarda el JWT en `localStorage`.
  - `public/views/search-books.html`: vista de usuario con guardia de rol user.
  - `public/views/edit-books.html`: vista de admin con CRUD (crear/editar/eliminar) con SweetAlert2.

- Backend
  - `src/routes/router.ts` carga routers dinámicamente. Habituales: `/auth`, `/books`, `/users`.
  - `/auth`: `POST /register`, `POST /login`.
  - `/books`: `GET /` público. `POST/PUT/DELETE` requieren JWT.
  - Middlewares: `auth.middleware.ts` valida JWT; `zod.middleware.ts` valida schemas; `logger.middleware.ts` loguea requests.
  - Datos en JSON: `src/models/*.json`.

- Autenticación y roles
  - Login devuelve `token` (JWT). El payload incluye `{ userId, email, role, name }`.
  - El frontend coloca `Authorization: Bearer <token>` para llamadas protegidas.
  - Guardias en frontend (books.ts):
    - `initEditBooks()` permite acceso solo a `role === 'admin'`.
    - `initSearchBooks()` permite acceso solo a `role === 'user'`.

## Endpoints principales (backend)

Base URL: `http://localhost:3002`

- Auth
  - POST `/auth/register` – Body: `{ name, lastName, email, passwordHash, phone, address, role? }`
    - Nota: Envíe `passwordHash` como texto plano; el servicio lo hashea internamente.
  - POST `/auth/login` – Body: `{ email, passwordHash }`
    - `passwordHash` = contraseña en texto plano. Si es válido, responde `{ token, user }`.

- Books
  - GET `/books` – Lista todos los libros.
  - GET `/books/:id` – Obtiene un libro por id.
  - POST `/books` – Crear (requiere JWT admin). Body: `{ title, author, genre, language, cover_url, description, isbn? }`
  - PUT `/books/:id` – Editar (requiere JWT admin). Body igual a POST.
  - DELETE `/books/:id` – Eliminar (requiere JWT admin).

## Flujos típicos de uso

1) Registro y login
- Ve a `http://localhost:5173/views/register.html` para crear una cuenta (por defecto rol "user").
- Luego login en `http://localhost:5173/views/login.html`.
- El frontend redirige según rol:
  - user → `search-books.html`
  - admin → `edit-books.html`

2) Buscar libros (usuario)
- `search-books.html` carga todos los libros y permite filtrar por título/autor.

3) CRUD de libros (admin)
- `edit-books.html` muestra una tabla. Botones para Edit/Delete por fila.
- Botón "Add Book" abre SweetAlert2 con formulario para crear.
- Todas las mutaciones envían el token en `Authorization: Bearer <token>`.

4) Cambiar de cuenta de forma segura
- Click en "Logout" para limpiar el token.
- Si el login te redirige automáticamente por tener token, abre `login.html?forceLogin=1` para forzar el formulario.

## Extender el backend (paso a paso)

Ejemplo: agregar un nuevo recurso (p.ej., categorías)

1) Modelo/datos
- Crea `backend/src/models/categories.json` con datos iniciales.

2) Service
- Crea `backend/src/services/categories.services.ts` con funciones para leer/escribir el JSON y lógica del dominio.

3) Router + Controller
- Crea `backend/src/controllers/categories.controller.ts` y `backend/src/routes/categories.router.ts`.
- Expón endpoints REST (GET/POST/PUT/DELETE). Usa `auth.middleware.ts` en mutaciones si requiere JWT.

4) Registro de ruta
- Si sigues la convención `*.router.ts`, `router.ts` lo montará automáticamente como `/categories`.

5) Validaciones
- Define schemas Zod en `backend/src/models/schemas` y aplícalos con `zod.middleware.ts`.

6) Probar
- Reinicia backend (`npm run dev`) y prueba con Thunder Client/Postman o desde el frontend.

## Extender el frontend (paso a paso)

Ejemplo: nueva vista para categorías

1) Crea la vista
- `frontend/bookstorefront/public/views/categories.html` que importe `../ts/main.ts`.

2) Inicializador TS
- Añade en `ts/main.ts` la detección de `categories.html` y llama a `initCategories()`.
- Crea `ts/categories.ts` con `initCategories` y helpers (similar a `books.ts`).

3) Llamadas a API
- Usa Axios como en `books.ts`. Para endpoints protegidos, adjunta `Authorization: Bearer <token>`.

4) UX/feedback
- Usa SweetAlert2 para formularios y avisos.

## Buenas prácticas y tips

- Mantén el shape del payload frontend = esperado por backend (p. ej., en login `passwordHash` lleva la contraseña en texto plano, el backend la compara contra el hash guardado).
- Evita exponer campos sensibles en respuestas.
- Centraliza los inits de vistas en `main.ts` para que cada HTML solo importe un script.
- Usa tipos de `interfaces/` para consistencia.
- Maneja errores con SweetAlert2 para UX consistente.

## Troubleshooting (errores comunes)

- 401 Unauthorized al hacer login
  - Revisa que el usuario exista y la contraseña sea "123" (o la que configuraste) y que `users.json` contenga el hash correcto.
  - Verifica el body del login: `{ email, passwordHash }` con `passwordHash` en texto plano.

- 403/401 en CRUD de libros
  - Asegúrate de estar logueado como admin (carlos.perez@example.com / 123).
  - Confirma que el frontend está enviando `Authorization: Bearer <token>`.

- CORS Error
  - El backend debe permitir `http://localhost:5173`. Ajusta `CORS_ORIGIN` en `.env` o revisa `app.ts`.

- Puerto en uso
  - Cambia el `PORT` en `.env` o cierra el proceso que está usando el puerto.

- No se renderizan todos los libros
  - Confirma que `GET /books` devuelve todos. Revisa `books.json` y la función `getBooks()`.

- Cambio de cuenta redirige mal
  - Usa el botón Logout primero o `login.html?forceLogin=1` para ignorar el token guardado.

## Checklist rápida para tu prueba (Dev Guide)

- Levantar backend y frontend en paralelo (3002 / 5173).
- Probar login con user y admin.
- Validar redirecciones por rol y guardias de vistas.
- Listar libros en Home y en Search, filtrar por título/autor.
- CRUD completo en admin (crear, editar, eliminar) con feedback SweetAlert2.
- Explicar arquitectura: rutas, middlewares, servicios, JSON storage, Vite + TS, guards por JWT.

## Scripts útiles

Backend (`backend/package.json`):
- `npm run dev` – nodemon sobre TS (desarrollo)
- `npm run build` – compila a JS (dist)
- `npm start` – ejecuta `dist/app.js`

Frontend (`frontend/bookstorefront/package.json`):
- `npm run dev` – Vite dev server en 5173
- `npm run build` – build de producción
- `npm run preview` – sirve la build de producción

## Licencia

Uso educativo. Ajusta a tus necesidades.
