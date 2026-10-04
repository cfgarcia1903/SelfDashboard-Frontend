import { apiRoutes } from "@/config/api-routes";
import { backendRequest } from "@/lib/api/server";

export async function POST(request: Request) {
  const body = await request.text();
  return backendRequest(apiRoutes.backend.etoro.deleteDeposits, { method: "POST", body });
}
