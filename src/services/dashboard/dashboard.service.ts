import { apiRoutes } from "@/config/api-routes";
import { request } from "@/lib/api/http-client";
import type { AccountSummaryResponse, SnapshotPeriod, SnapshotsResponse } from "@/types/api";

function snapshotsPath(period?: SnapshotPeriod): string {
  return period ? `${apiRoutes.frontend.etoro.snapshots}?period=${encodeURIComponent(period)}` : apiRoutes.frontend.etoro.snapshots;
}

export const dashboardService = {
  getSummary: () => request<AccountSummaryResponse>(apiRoutes.frontend.etoro.summary),
  getSnapshots: (period?: SnapshotPeriod) => request<SnapshotsResponse>(snapshotsPath(period))
};
