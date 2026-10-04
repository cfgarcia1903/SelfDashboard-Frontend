/**
 * Single map for every public proxy route and OpenAPI backend path.
 * Edit this file when the backend contract changes.
 */
export const apiRoutes = {
  frontend: {
    health: "/api/health",
    etoro: {
      summary: "/api/etoro/summary",
      snapshots: "/api/etoro/snapshots",
      deposits: "/api/etoro/deposits",
      editDeposits: "/api/etoro/deposits/edit",
      deleteDeposits: "/api/etoro/deposits/delete"
    }
  },
  backend: {
    health: "/health",
    etoro: {
      summary: "/api/etoro/summary",
      snapshots: "/api/etoro/snapshots",
      deposits: "/api/etoro/deposits",
      editDeposits: "/api/etoro/deposits/edit",
      deleteDeposits: "/api/etoro/deposits/delete"
    }
  }
} as const;
