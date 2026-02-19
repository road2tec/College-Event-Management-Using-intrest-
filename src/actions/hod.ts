"use server";

import { revalidatePath } from "next/cache";
import connectDB from "@/lib/db";
import Event from "@/models/Event";
import { auth } from "@/lib/auth";

// ============================================
// HOD: Create Event (status = pending)
// ============================================
export async function createEvent(formData: FormData) {
  const session = await auth();
  if (!session || session.user.role !== "hod") {
    return { error: "Unauthorized: HOD access required" };
  }

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const date = formData.get("date") as string;
  const venue = formData.get("venue") as string;
  const category = formData.get("category") as string;
  const capacity = parseInt(formData.get("capacity") as string);
  const bannerUrl = formData.get("bannerUrl") as string;

  if (!title || !description || !date || !venue || !category || !capacity) {
    return { error: "All fields are required" };
  }

  try {
    await connectDB();

    await Event.create({
      title,
      description,
      organizer: session.user.id,
      date: new Date(date),
      venue,
      category,
      status: "pending", // SECURITY: Always pending, requires admin approval
      bannerUrl: bannerUrl || undefined,
      registeredStudents: [],
      capacity,
    });

    revalidatePath("/hod/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Create event error:", error);
    return { error: "Failed to create event" };
  }
}

// ============================================
// HOD: Get My Events
// ============================================
export async function getMyEvents() {
  const session = await auth();
  if (!session || session.user.role !== "hod") {
    return [];
  }

  try {
    await connectDB();
    const events = await Event.find({ organizer: session.user.id })
      .populate("registeredStudents", "name email department")
      .sort({ createdAt: -1 })
      .lean();
    return JSON.parse(JSON.stringify(events));
  } catch (error) {
    console.error("Get my events error:", error);
    return [];
  }
}

// ============================================
// HOD: Get Attendance for an Event
// ============================================
export async function getEventAttendance(eventId: string) {
  const session = await auth();
  if (!session || session.user.role !== "hod") {
    return { error: "Unauthorized" };
  }

  try {
    await connectDB();
    const event = await Event.findOne({ _id: eventId, organizer: session.user.id })
      .populate("registeredStudents", "name email department")
      .lean();

    if (!event) {
      return { error: "Event not found" };
    }

    return JSON.parse(JSON.stringify(event));
  } catch (error) {
    console.error("Get attendance error:", error);
    return { error: "Failed to fetch attendance" };
  }
}
