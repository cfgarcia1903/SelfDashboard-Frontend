# SelfDashboard Frontend

Frontend responsive de SelfDashboard para visualizar patrimonio e inversiones usando exclusivamente el contrato `openapi.yaml`.

## Requisitos

- Node.js 20+
- Backend Flask accesible desde `BACKEND_URL`

## Configuración

Copia `.env.example` a `.env.local` y completa las variables privadas del backend:

```env
BACKEND_URL=http://127.0.0.1:5001
BACKEND_USER_ID=...
BACKEND_USER_PIN=...
BACKEND_API_KEY=...
```

Las credenciales se consumen únicamente en los Route Handlers de Next y no se exponen al navegador.

Después de modificar `.env.local`, reinicia Next (`pnpm dev` de nuevo). Si una ruta devuelve `503`, la respuesta indica únicamente los nombres de las variables ausentes o vacías. No uses prefijos `NEXT_PUBLIC_` para estas credenciales.

## Desarrollo

```bash
pnpm install
pnpm dev
```

Abre `http://localhost:3000`.

## Estructura para editar

```text
src/
├── app/                         # URLs públicas y Route Handlers de Next
│   ├── page.tsx                 # /
│   ├── etoro/page.tsx           # /etoro
│   └── api/                     # Proxies server-side hacia Flask
├── config/api-routes.ts         # Mapa central de URLs frontend/backend
├── features/                    # Entrada de cada página por dominio
│   ├── dashboard/DashboardPage.tsx
│   └── etoro/EtoroPage.tsx
├── services/                    # Operaciones API editables por dominio
│   ├── dashboard/dashboard.service.ts
│   └── etoro/etoro.service.ts
├── lib/api/                     # HTTP genérico, errores y proxy privado
├── components/                  # UI reutilizable
└── types/api.ts                 # Tipos derivados de OpenAPI
```

### Cambiar una URL del backend

Edita solamente `src/config/api-routes.ts`. Los servicios y Route Handlers importan ese mapa; no es necesario buscar strings de URL por todo el proyecto.

### Añadir una página

1. Crea `src/app/stocks/page.tsx` para obtener `/stocks`.
2. Crea `src/features/stocks/StocksPage.tsx` para la lógica de esa pantalla.
3. Añade la entrada de navegación en `src/components/layout/Navbar.tsx`.
4. Si necesita API, añade sus rutas en `src/config/api-routes.ts`, un servicio en `src/services/stocks/` y los Route Handlers correspondientes en `src/app/api/stocks/`.

Los componentes React no llaman a `fetch()` directamente. La cadena es `página → feature → service → http-client → Route Handler → backend Flask`.

## Validación

```bash
pnpm typecheck
pnpm lint
pnpm test
pnpm build
```

La página `/` usa resumen y snapshots. `/etoro` usa resumen, snapshots y depósitos. El contrato actual no expone retiradas, comisiones ni otros movimientos, por lo que la diferencia entre balance y depósitos se muestra como referencia y no como P&L.

## Contrato de snapshots

Los snapshots usan la respuesta `{ snapshots: [...] }`. Cada elemento contiene `date`, `value_usd` y `value_pen`. El selector de histórico envía el periodo opcional `1D`, `1W`, `1M`, `3M`, `6M` o `1Y` a `GET /api/etoro/snapshots`; si se omite, el backend aplica su valor por defecto `1M`. El frontend selecciona el valor de la moneda de la cuenta sin convertir monedas no soportadas.

Las rutas proxy disponibles son `/api/etoro/summary`, `/api/etoro/snapshots`, `/api/etoro/deposits`, `/api/etoro/deposits/edit` y `/api/etoro/deposits/delete`.
