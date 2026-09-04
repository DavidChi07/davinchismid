# DavinchisMid

E-commerce de comida yucateca. Backend (Express + Prisma + PostgreSQL) y frontend
(React + Vite + Tailwind) en el mismo repo, cada uno con su propio `package.json`.


Backend y frontend son dos procesos independientes. Compartir repo no significa
compartir configuración ni runtime — cada uno corre en su propio puerto y con su
propio `.env`.

---

## Setup local (primera vez o en una compu nueva)

### 0. Requisitos
- Node.js instalado
- PostgreSQL instalado y corriendo (local o en un servicio como Neon/Supabase free tier)

### 1. Backend (raíz del proyecto)

```bash
npm install
cp .env.example .env
```

Edita `.env` con tus datos locales (ver `.env.example` para la lista de variables).
**Usa una base de datos de PRUEBA, nunca la de producción.**

```bash
npx prisma generate
npx prisma migrate dev
npm run seed        # opcional: carga datos de ejemplo
npm run dev          # http://localhost:3000
```

### 2. Frontend (`client/`)

```bash
cd client
npm install
cp .env.example .env
```

Confirma que `VITE_API_URL` apunte a tu backend local (`http://localhost:3000`).

```bash
npm run dev          # http://localhost:5173
```

### 3. Trabajar en una rama, no en `master` directo

```bash
git checkout -b nombre-de-tu-mejora
```

Prueba tus cambios en local (localhost) antes de hacer push. Cuando ya funcione,
haces commit/push — si el deploy está conectado a GitHub, se redeploya solo.

---

## Producción (deploy)

| Parte     | Plataforma            | Config                          |
|-----------|------------------------|----------------------------------|
| Backend   | Railway / Render       | Variables de entorno en su dashboard (no en el repo) |
| Frontend  | Vercel                 | Variable `VITE_API_URL` apuntando al backend en producción |

El `.env` de producción **vive solo en esos dashboards**, nunca en el código
(está en `.gitignore`). Si algo se rompe en local, producción no se ve afectada
mientras no toques esas variables.

`npm run build` en la raíz corre `prisma generate && prisma migrate deploy` —
ese script es para CI/deploy, no para uso local (en local usa `migrate dev`).

---

## Scripts disponibles

**Backend** (`package.json` raíz):
- `npm run dev` — nodemon, recarga automática
- `npm start` — producción, sin recarga
- `npm run seed` — carga datos de ejemplo
- `npm test` — corre tests con Jest

**Frontend** (`client/package.json`):
- `npm run dev` — servidor Vite con HMR
- `npm run build` — build de producción
- `npm run preview` — sirve el build localmente para probarlo

---

## Modelos principales (Prisma)

`Producto`, `Usuario` (roles: admin/cliente), `Orden`, `OrdenItem` — ver
`prisma/schema.prisma` para el detalle completo.

---

## Notas / troubleshooting

- Si `prisma migrate dev` falla, confirma que Postgres esté corriendo y que
  `DATABASE_URL` en tu `.env` tenga usuario/contraseña/puerto correctos.
- Si el frontend no puede pegarle al backend, revisa CORS en `src/app.js` y que
  `VITE_API_URL` en `client/.env` sea el correcto.
- Actualiza este README cada vez que cambies algo del setup — es la fuente de
  verdad, no la memoria.