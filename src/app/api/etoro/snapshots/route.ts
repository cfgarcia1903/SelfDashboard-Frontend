import { apiRoutes } from "@/config/api-routes";
import { backendRequest } from "@/lib/api/server";
import type { SnapshotPeriod } from "@/types/api";

const snapshotPeriods: readonly SnapshotPeriod[] = ["1D", "1W", "1M", "3M", "6M", "1Y"];

export async function GET(request: Request) {
  const period = new URL(request.url).searchParams.get("period");
  if (period !== null && !snapshotPeriods.includes(period as SnapshotPeriod)) {
    return Response.json({ message: "El período no es válido." }, { status: 400 });
  }

  const path = period === null ? apiRoutes.backend.etoro.snapshots : `${apiRoutes.backend.etoro.snapshots}?period=${encodeURIComponent(period)}`;
  return backendRequest(path);
}
