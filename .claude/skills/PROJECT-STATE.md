# Project State

Updated: 2026-10-02T09:50:00Z

## Components
- DashboardClient: `src/components/dashboard/DashboardClient.tsx`, client, home summary and net worth timeline.
- EtoroClient: `src/components/etoro/EtoroClient.tsx`, client, eToro detail view with partial-data handling.
- DashboardLayout: `src/components/layout/DashboardLayout.tsx`, server, shared page shell.
- Navbar: `src/components/layout/Navbar.tsx`, client, responsive Home/eToro navigation.
- NetWorthChart: `src/components/charts/NetWorthChart.tsx`, client, Apache ECharts net worth line with contained integer Y-axis labels.
- EtoroTimeline: `src/components/charts/EtoroTimeline.tsx`, client, balance, accumulated deposits and derived difference lines.
- PortfolioCompositionChart: `src/components/charts/PortfolioCompositionChart.tsx`, client, balance composition donut.
- CapitalProgress: `src/components/dashboard/CapitalProgress.tsx`, server-compatible, deposited/current balance figures with absolute and percentage comparison indicator.
- DashboardPage: `src/features/dashboard/DashboardPage.tsx`, feature entry for the `/` page.
- EtoroPage: `src/features/etoro/EtoroPage.tsx`, feature entry for the `/etoro` page.

## Routes
- `/`: `src/app/page.tsx`, wrapped by root `DashboardLayout`.
- `/etoro`: `src/app/etoro/page.tsx`, wrapped by root `DashboardLayout`.
- `/api/etoro/summary`: server Route Handler proxy for backend summary.
- `/api/etoro/snapshots`: server Route Handler proxy for backend snapshots.
- `/api/etoro/deposits`: server Route Handler proxy for backend deposits.
- `/api/health`: server Route Handler proxy for backend health.
- `/api/etoro/deposits/edit`: server Route Handler proxy for `PUT` deposit edits.
- `/api/etoro/deposits/delete`: server Route Handler proxy for `POST` deposit deletion.

## API endpoints
- `backendRequest` (`src/lib/api/server.ts`): server-side proxy validates all four backend variables and protects credential headers.
- `GET /api/etoro/summary`: account summary.
- `GET /api/etoro/snapshots?period=...`: historical account snapshots. `period` is optional and accepts `1D`, `1W`, `1M`, `3M`, `6M` or `1Y`; the backend defaults to `1M` when omitted.
- `GET /api/etoro/deposits`: complete deposits table.
- `PUT /api/etoro/deposits/edit`: edit or create deposits and return the complete table.
- `POST /api/etoro/deposits/delete`: remove deposits by id and return the remaining table.

Snapshot responses use `{ snapshots: [{ date, value_usd, value_pen }] }`. The frontend selects the field matching the account currency and keeps unsupported currencies unavailable without conversion.

## Dependencies
- `next`, `react`, `react-dom`: App Router application runtime.
- `echarts`, `echarts-for-react`: responsive financial charts.
- `lucide-react`: interface icons.
- `vitest`: pure calculation and API client tests.
- `eslint`, `eslint-config-next`: linting with explicit Next.js rules.

## Conventions
- OpenAPI schemas are mirrored in `src/types/api.ts`; components call services, never `fetch` directly.
- Private backend headers are attached only by `src/lib/api/server.ts` using server environment variables.
- Balance minus deposits is labeled as a reference difference, not P&L, because the contract has no withdrawals, fees, or other movements.
- Financial calculations are pure functions under `src/lib/calculations` and keep missing values distinct from zero.
- Deposit timelines use `deposited_at`, normalize `dd-mm-aaaa` or ISO dates, preserve currency boundaries, group same-day movements, carry historical totals into the visible snapshot domain, and represent unavailable mixed-currency series as `null`.
- Financial chart axes use integer thousands-separated labels while tooltips retain precision; the eToro timeline exposes balance, deposits and derived difference as separate series.
- `src/config/api-routes.ts` is the single editable registry for frontend proxy and backend OpenAPI paths.
- `src/lib/api/http-client.ts` owns generic browser HTTP behavior; domain operations live in `src/services/{domain}/`.
- `src/app/{route}/page.tsx` owns public URLs; `src/features/{domain}/` owns each page entry.
- `vitest.config.ts` mirrors the TypeScript `@/*` alias for test imports; `.eslintrc.json` is the active Next lint configuration.
