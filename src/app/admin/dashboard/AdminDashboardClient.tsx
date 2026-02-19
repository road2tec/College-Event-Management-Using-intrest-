"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Users,
  CalendarCheck,
  Clock,
  ShieldCheck,
  UserPlus,
  CheckCircle2,
  XCircle,
  Trash2,
  GraduationCap,
  Building2,
  CalendarX,
} from "lucide-react";
import { Session } from "next-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/toaster";
import { createHod, approveEvent, rejectEvent, deleteUser } from "@/actions/admin";
import { DEPARTMENTS } from "@/lib/constants";
import DashboardLayout from "@/components/DashboardLayout";

interface AdminDashboardClientProps {
  session: Session;
  stats: {
    totalUsers: number;
    totalStudents: number;
    totalHods: number;
    pendingEvents: number;
    approvedEvents: number;
    rejectedEvents: number;
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  pendingEvents: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  students: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  hods: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  allEvents: any[];
}

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4 },
};

export default function AdminDashboardClient({
  session,
  stats,
  pendingEvents,
  students,
  hods,
  allEvents,
}: AdminDashboardClientProps) {
  const { toast } = useToast();
  const [hodDialogOpen, setHodDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedDept, setSelectedDept] = useState("");

  async function handleCreateHod(formData: FormData) {
    setLoading(true);
    formData.set("department", selectedDept);
    const result = await createHod(formData);
    setLoading(false);
    if (result.error) {
      toast({ title: "Error", description: result.error, variant: "destructive" });
    } else {
      toast({ title: "Success", description: "HOD created successfully!", variant: "success" });
      setHodDialogOpen(false);
    }
  }

  async function handleApprove(eventId: string) {
    const result = await approveEvent(eventId);
    if (result.error) {
      toast({ title: "Error", description: result.error, variant: "destructive" });
    } else {
      toast({ title: "Approved!", description: "Event has been approved", variant: "success" });
    }
  }

  async function handleReject(eventId: string) {
    const result = await rejectEvent(eventId);
    if (result.error) {
      toast({ title: "Error", description: result.error, variant: "destructive" });
    } else {
      toast({ title: "Rejected", description: "Event has been rejected" });
    }
  }

  async function handleDeleteUser(userId: string) {
    if (!confirm("Are you sure you want to delete this user?")) return;
    const result = await deleteUser(userId);
    if (result.error) {
      toast({ title: "Error", description: result.error, variant: "destructive" });
    } else {
      toast({ title: "Deleted", description: "User has been removed" });
    }
  }

  const kpiCards = [
    { title: "Total Users", value: stats.totalUsers, icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
    { title: "Pending Events", value: stats.pendingEvents, icon: Clock, color: "text-yellow-600", bg: "bg-yellow-50" },
    { title: "Approved Events", value: stats.approvedEvents, icon: CalendarCheck, color: "text-green-600", bg: "bg-green-50" },
    { title: "Total HODs", value: stats.totalHods, icon: ShieldCheck, color: "text-violet-600", bg: "bg-violet-50" },
  ];

  return (
    <DashboardLayout session={session} role="admin">
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Manage events, users, and HODs from one place.
          </p>
        </div>

        {/* KPI Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {kpiCards.map((kpi, i) => (
            <motion.div key={kpi.title} {...fadeIn} transition={{ delay: i * 0.1 }}>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {kpi.title}
                  </CardTitle>
                  <div className={`p-2 rounded-lg ${kpi.bg}`}>
                    <kpi.icon className={`h-4 w-4 ${kpi.color}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{kpi.value}</div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Main Tabs */}
        <Tabs defaultValue="pending" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="pending">
              <Clock className="mr-2 h-4 w-4" /> Pending ({pendingEvents.length})
            </TabsTrigger>
            <TabsTrigger value="events">
              <CalendarCheck className="mr-2 h-4 w-4" /> All Events
            </TabsTrigger>
            <TabsTrigger value="students">
              <GraduationCap className="mr-2 h-4 w-4" /> Students
            </TabsTrigger>
            <TabsTrigger value="hods">
              <Building2 className="mr-2 h-4 w-4" /> HODs
            </TabsTrigger>
          </TabsList>

          {/* Pending Events Tab */}
          <TabsContent value="pending">
            <Card>
              <CardHeader>
                <CardTitle>Event Approval Queue</CardTitle>
              </CardHeader>
              <CardContent>
                {pendingEvents.length === 0 ? (
                  <div className="text-center py-10 text-muted-foreground">
                    <CalendarX className="h-12 w-12 mx-auto mb-3 opacity-40" />
                    <p>No pending events to review</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pendingEvents.map((event) => (
                      <motion.div
                        key={event._id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center justify-between p-4 rounded-lg border bg-white hover:shadow-sm transition-shadow"
                      >
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">{event.title}</h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            {event.description.substring(0, 100)}...
                          </p>
                          <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
                            <span>📅 {new Date(event.date).toLocaleDateString()}</span>
                            <span>📍 {event.venue}</span>
                            <span>🏷️ {event.category}</span>
                            <span>👤 {event.organizer?.name}</span>
                            <span>👥 Capacity: {event.capacity}</span>
                          </div>
                        </div>
                        <div className="flex gap-2 ml-4">
                          <Button
                            size="sm"
                            onClick={() => handleApprove(event._id)}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle2 className="mr-1 h-4 w-4" /> Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleReject(event._id)}
                          >
                            <XCircle className="mr-1 h-4 w-4" /> Reject
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* All Events Tab */}
          <TabsContent value="events">
            <Card>
              <CardHeader>
                <CardTitle>All Events</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="text-left p-3 font-medium">Title</th>
                        <th className="text-left p-3 font-medium">Category</th>
                        <th className="text-left p-3 font-medium">Date</th>
                        <th className="text-left p-3 font-medium">Organizer</th>
                        <th className="text-left p-3 font-medium">Status</th>
                        <th className="text-left p-3 font-medium">Registrations</th>
                      </tr>
                    </thead>
                    <tbody>
                      {allEvents.map((event) => (
                        <tr key={event._id} className="border-b hover:bg-muted/30">
                          <td className="p-3 font-medium">{event.title}</td>
                          <td className="p-3">{event.category}</td>
                          <td className="p-3">{new Date(event.date).toLocaleDateString()}</td>
                          <td className="p-3">{event.organizer?.name || "N/A"}</td>
                          <td className="p-3">
                            <Badge
                              variant={
                                event.status === "approved"
                                  ? "success"
                                  : event.status === "pending"
                                  ? "warning"
                                  : "destructive"
                              }
                            >
                              {event.status}
                            </Badge>
                          </td>
                          <td className="p-3">{event.registeredStudents?.length || 0} / {event.capacity}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Students Tab */}
          <TabsContent value="students">
            <Card>
              <CardHeader>
                <CardTitle>Students ({students.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="text-left p-3 font-medium">Name</th>
                        <th className="text-left p-3 font-medium">Email</th>
                        <th className="text-left p-3 font-medium">Department</th>
                        <th className="text-left p-3 font-medium">Interests</th>
                        <th className="text-left p-3 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {students.map((student) => (
                        <tr key={student._id} className="border-b hover:bg-muted/30">
                          <td className="p-3 font-medium">{student.name}</td>
                          <td className="p-3">{student.email}</td>
                          <td className="p-3">{student.department}</td>
                          <td className="p-3">
                            <div className="flex flex-wrap gap-1">
                              {student.interests?.slice(0, 3).map((i: string) => (
                                <Badge key={i} variant="secondary" className="text-xs">
                                  {i}
                                </Badge>
                              ))}
                            </div>
                          </td>
                          <td className="p-3">
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              onClick={() => handleDeleteUser(student._id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* HODs Tab */}
          <TabsContent value="hods">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>HOD Management</CardTitle>
                <Dialog open={hodDialogOpen} onOpenChange={setHodDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <UserPlus className="mr-2 h-4 w-4" /> Add HOD
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create New HOD</DialogTitle>
                      <DialogDescription>
                        Add a new Head of Department. They will be able to create and manage events.
                      </DialogDescription>
                    </DialogHeader>
                    <form action={handleCreateHod} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input id="name" name="name" placeholder="Dr. John Doe" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" name="email" type="email" placeholder="hod@college.com" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="department">Department</Label>
                        <Select value={selectedDept} onValueChange={setSelectedDept}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select department" />
                          </SelectTrigger>
                          <SelectContent>
                            {DEPARTMENTS.map((dept) => (
                              <SelectItem key={dept} value={dept}>
                                {dept}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="password">Default Password</Label>
                        <Input id="password" name="password" defaultValue="hod123" placeholder="Default password" />
                      </div>
                      <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? "Creating..." : "Create HOD"}
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="text-left p-3 font-medium">Name</th>
                        <th className="text-left p-3 font-medium">Email</th>
                        <th className="text-left p-3 font-medium">Department</th>
                        <th className="text-left p-3 font-medium">Joined</th>
                        <th className="text-left p-3 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {hods.map((hod) => (
                        <tr key={hod._id} className="border-b hover:bg-muted/30">
                          <td className="p-3 font-medium">{hod.name}</td>
                          <td className="p-3">{hod.email}</td>
                          <td className="p-3">
                            <Badge variant="outline">{hod.department}</Badge>
                          </td>
                          <td className="p-3">{new Date(hod.createdAt).toLocaleDateString()}</td>
                          <td className="p-3">
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              onClick={() => handleDeleteUser(hod._id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
