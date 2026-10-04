import { apiRoutes } from "@/config/api-routes";
import { backendRequest } from "@/lib/api/server";

export async function PUT(request: Request) {
  const body = await request.text();
  return backendRequest(apiRoutes.backend.etoro.editDeposits, { method: "PUT", body });
}
