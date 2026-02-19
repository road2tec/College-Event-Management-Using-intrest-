"use server";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import connectDB from "@/lib/db";
import User from "@/models/User";
import Event from "@/models/Event";
import { auth } from "@/lib/auth";

// ============================================
// Admin-only: Create HOD
// ============================================
export async function createHod(formData: FormData) {
  const session = await auth();
  if (!session || session.user.role !== "admin") {
    return { error: "Unauthorized: Admin access required" };
  }

  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const department = formData.get("department") as string;
  const password = formData.get("password") as string || "hod123";

  if (!name || !email || !department) {
    return { error: "Name, email and department are required" };
  }

  try {
    await connectDB();

    const existing = await User.findOne({ email });
    if (existing) {
      return { error: "Email already exists" };
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    await User.create({
      name,
      email,
      password: hashedPassword,
      role: "hod", // Admin can create HODs
      department,
    });

    revalidatePath("/admin/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Create HOD error:", error);
    return { error: "Failed to create HOD" };
  }
}

// ============================================
// Admin-only: Approve Event
// ============================================
export async function approveEvent(eventId: string) {
  const session = await auth();
  if (!session || session.user.role !== "admin") {
    return { error: "Unauthorized" };
  }

  try {
    await connectDB();
    await Event.findByIdAndUpdate(eventId, { status: "approved" });
    revalidatePath("/admin/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Approve event error:", error);
    return { error: "Failed to approve event" };
  }
}

// ============================================
// Admin-only: Reject Event
// ============================================
export async function rejectEvent(eventId: string) {
  const session = await auth();
  if (!session || session.user.role !== "admin") {
    return { error: "Unauthorized" };
  }

  try {
    await connectDB();
    await Event.findByIdAndUpdate(eventId, { status: "rejected" });
    revalidatePath("/admin/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Reject event error:", error);
    return { error: "Failed to reject event" };
  }
}

// ============================================
// Admin-only: Delete Student
// ============================================
export async function deleteUser(userId: string) {
  const session = await auth();
  if (!session || session.user.role !== "admin") {
    return { error: "Unauthorized" };
  }

  try {
    await connectDB();
    await User.findByIdAndDelete(userId);
    // Remove student from all event registrations
    await Event.updateMany(
      { registeredStudents: userId },
      { $pull: { registeredStudents: userId } }
    );
    revalidatePath("/admin/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Delete user error:", error);
    return { error: "Failed to delete user" };
  }
}

// ============================================
// Admin: Get Dashboard Stats
// ============================================
export async function getAdminStats() {
  try {
    await connectDB();
    const [totalUsers, totalStudents, totalHods, pendingEvents, approvedEvents, rejectedEvents] =
      await Promise.all([
        User.countDocuments(),
        User.countDocuments({ role: "student" }),
        User.countDocuments({ role: "hod" }),
        Event.countDocuments({ status: "pending" }),
        Event.countDocuments({ status: "approved" }),
        Event.countDocuments({ status: "rejected" }),
      ]);

    return { totalUsers, totalStudents, totalHods, pendingEvents, approvedEvents, rejectedEvents };
  } catch (error) {
    console.error("Stats error:", error);
    return { totalUsers: 0, totalStudents: 0, totalHods: 0, pendingEvents: 0, approvedEvents: 0, rejectedEvents: 0 };
  }
}

// ============================================
// Admin: Get all pending events
// ============================================
export async function getPendingEvents() {
  try {
    await connectDB();
    const events = await Event.find({ status: "pending" })
      .populate("organizer", "name email department")
      .sort({ createdAt: -1 })
      .lean();
    return JSON.parse(JSON.stringify(events));
  } catch (error) {
    console.error("Get pending events error:", error);
    return [];
  }
}

// ============================================
// Admin: Get all users
// ============================================
export async function getAllUsers(role?: string) {
  try {
    await connectDB();
    const filter = role ? { role } : {};
    const users = await User.find(filter)
      .select("-password")
      .sort({ createdAt: -1 })
      .lean();
    return JSON.parse(JSON.stringify(users));
  } catch (error) {
    console.error("Get users error:", error);
    return [];
  }
}

// ============================================
// Admin: Get all events
// ============================================
export async function getAllEvents() {
  try {
    await connectDB();
    const events = await Event.find()
      .populate("organizer", "name email department")
      .sort({ createdAt: -1 })
      .lean();
    return JSON.parse(JSON.stringify(events));
  } catch (error) {
    console.error("Get all events error:", error);
    return [];
  }
}
