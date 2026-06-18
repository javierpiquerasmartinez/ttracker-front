# Slott — Frontend

Frontend de **Slott**, aplicación de registro y análisis de horas de trabajo para freelancers.

Construido con React 18 + TypeScript + Vite + Tailwind CSS.

## Requisitos

- Node.js >= 20
- pnpm

## Puesta en marcha

```bash
pnpm install
pnpm run dev
```

La app se sirve en `http://localhost:5173`.

Por defecto el formulario de login precarga el usuario semilla `admin@slott.com` / `admin123` (creado por el backend).

## Scripts

| Script | Descripción |
|--------|-------------|
| `pnpm run dev` | Servidor de desarrollo con HMR |
| `pnpm run build` | Compila TypeScript y genera build de producción |
| `pnpm run preview` | Sirve el build de producción localmente |
| `pnpm run lint` | ESLint |

## Configuración

El backend se espera en `http://localhost:3000` por defecto. Ver `src/services/api.ts` para cambiar la URL base (o usar una variable de entorno).
