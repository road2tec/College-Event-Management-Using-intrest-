import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getRecommendedEvents, getApprovedEvents, getMyRegistrations, getProfile } from "@/actions/student";
import StudentDashboardClient from "./StudentDashboardClient";

export default async function StudentDashboard() {
  const session = await auth();
  if (!session) {
    redirect("/login");
  }

  const [recommended, allEvents, myRegistrations, profile] = await Promise.all([
    getRecommendedEvents(),
    getApprovedEvents(),
    getMyRegistrations(),
    getProfile(),
  ]);

  return (
    <StudentDashboardClient
      session={session}
      recommended={recommended}
      allEvents={allEvents}
      myRegistrations={myRegistrations}
      profile={profile}
    />
  );
}
