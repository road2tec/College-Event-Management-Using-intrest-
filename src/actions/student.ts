"use server";

import { revalidatePath } from "next/cache";
import connectDB from "@/lib/db";
import Event from "@/models/Event";
import User from "@/models/User";
import { auth } from "@/lib/auth";

// ============================================
// Student: Get Recommended Events
// ============================================
export async function getRecommendedEvents() {
  const session = await auth();
  if (!session) return [];

  try {
    await connectDB();
    const user = await User.findById(session.user.id);
    if (!user || user.interests.length === 0) return [];

    const events = await Event.find({
      status: "approved",
      category: { $in: user.interests },
      date: { $gte: new Date() },
    })
      .populate("organizer", "name department")
      .sort({ date: 1 })
      .lean();

    return JSON.parse(JSON.stringify(events));
  } catch (error) {
    console.error("Get recommended events error:", error);
    return [];
  }
}

// ============================================
// Student: Get All Approved Events
// ============================================
export async function getApprovedEvents(search?: string, category?: string) {
  try {
    await connectDB();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filter: any = { status: "approved" };
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { venue: { $regex: search, $options: "i" } },
      ];
    }
    if (category && category !== "all") {
      filter.category = category;
    }

    const events = await Event.find(filter)
      .populate("organizer", "name department")
      .sort({ date: 1 })
      .lean();

    return JSON.parse(JSON.stringify(events));
  } catch (error) {
    console.error("Get approved events error:", error);
    return [];
  }
}

// ============================================
// Student: Register for Event
// ============================================
export async function registerForEvent(eventId: string) {
  const session = await auth();
  if (!session) {
    return { error: "Please login to register" };
  }

  try {
    await connectDB();

    const event = await Event.findById(eventId);
    if (!event) return { error: "Event not found" };
    if (event.status !== "approved") return { error: "Event is not approved" };

    // Check if already registered
    if (event.registeredStudents.includes(session.user.id as unknown as import("mongoose").Types.ObjectId)) {
      return { error: "Already registered for this event" };
    }

    // Check capacity
    if (event.registeredStudents.length >= event.capacity) {
      return { error: "Event is full. No more registrations." };
    }

    // Add student to event
    await Event.findByIdAndUpdate(eventId, {
      $addToSet: { registeredStudents: session.user.id },
    });

    revalidatePath("/student/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Register for event error:", error);
    return { error: "Registration failed" };
  }
}

// ============================================
// Student: Get My Registrations
// ============================================
export async function getMyRegistrations() {
  const session = await auth();
  if (!session) return [];

  try {
    await connectDB();
    const events = await Event.find({
      registeredStudents: session.user.id,
      status: "approved",
    })
      .populate("organizer", "name department")
      .sort({ date: 1 })
      .lean();

    return JSON.parse(JSON.stringify(events));
  } catch (error) {
    console.error("Get my registrations error:", error);
    return [];
  }
}

// ============================================
// Student: Update Interests
// ============================================
export async function updateInterests(interests: string[]) {
  const session = await auth();
  if (!session) return { error: "Unauthorized" };

  try {
    await connectDB();
    await User.findByIdAndUpdate(session.user.id, { interests });
    revalidatePath("/student/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Update interests error:", error);
    return { error: "Failed to update interests" };
  }
}

// ============================================
// Student: Get Profile
// ============================================
export async function getProfile() {
  const session = await auth();
  if (!session) return null;

  try {
    await connectDB();
    const user = await User.findById(session.user.id).select("-password").lean();
    return JSON.parse(JSON.stringify(user));
  } catch (error) {
    console.error("Get profile error:", error);
    return null;
  }
}
