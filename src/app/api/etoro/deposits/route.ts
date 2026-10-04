import { apiRoutes } from "@/config/api-routes";
import { backendRequest } from "@/lib/api/server";

export async function GET() {
  return backendRequest(apiRoutes.backend.etoro.deposits);
}
