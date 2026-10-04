import { apiRoutes } from "@/config/api-routes";
import { request } from "@/lib/api/http-client";
import type { AccountSummaryResponse, DeleteDepositsRequest, DepositsResponse, EditDepositsRequest, SnapshotPeriod, SnapshotsResponse } from "@/types/api";

function snapshotsPath(period?: SnapshotPeriod): string {
  return period ? `${apiRoutes.frontend.etoro.snapshots}?period=${encodeURIComponent(period)}` : apiRoutes.frontend.etoro.snapshots;
}

export const etoroService = {
  getSummary: () => request<AccountSummaryResponse>(apiRoutes.frontend.etoro.summary),
  getSnapshots: (period?: SnapshotPeriod) => request<SnapshotsResponse>(snapshotsPath(period)),
  getDeposits: () => request<DepositsResponse>(apiRoutes.frontend.etoro.deposits),
  editDeposits: (body: EditDepositsRequest) => request<DepositsResponse>(apiRoutes.frontend.etoro.editDeposits, { method: "PUT", body: JSON.stringify(body), headers: { "Content-Type": "application/json" } }),
  deleteDeposits: (body: DeleteDepositsRequest) => request<DepositsResponse>(apiRoutes.frontend.etoro.deleteDeposits, { method: "POST", body: JSON.stringify(body), headers: { "Content-Type": "application/json" } })
};
