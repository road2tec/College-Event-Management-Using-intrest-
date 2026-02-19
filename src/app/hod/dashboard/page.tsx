import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getMyEvents } from "@/actions/hod";
import HodDashboardClient from "./HodDashboardClient";

export default async function HodDashboard() {
  const session = await auth();
  if (!session || session.user.role !== "hod") {
    redirect("/");
  }

  const events = await getMyEvents();

  return <HodDashboardClient session={session} events={events} />;
}
