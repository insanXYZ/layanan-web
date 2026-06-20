import { GetDashboardInformation } from "@/handlers/dashboard-handler";

export async function GET() {
  return GetDashboardInformation();
}
