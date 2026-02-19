"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  CalendarPlus,
  Clock,
  CheckCircle2,
  Users,
  Eye,
  CalendarCheck,
  XCircle,
} from "lucide-react";
import { Session } from "next-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/toaster";
import { createEvent } from "@/actions/hod";
import { INTEREST_TAGS } from "@/lib/constants";
import DashboardLayout from "@/components/DashboardLayout";

interface HodDashboardClientProps {
  session: Session;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  events: any[];
}

export default function HodDashboardClient({ session, events }: HodDashboardClientProps) {
  const { toast } = useToast();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [viewingAttendance, setViewingAttendance] = useState<any>(null);

  const pendingEvents = events.filter((e) => e.status === "pending");
  const approvedEvents = events.filter((e) => e.status === "approved");
  const rejectedEvents = events.filter((e) => e.status === "rejected");

  async function handleCreateEvent(formData: FormData) {
    setLoading(true);
    formData.set("category", selectedCategory);
    const result = await createEvent(formData);
    setLoading(false);
    if (result.error) {
      toast({ title: "Error", description: result.error, variant: "destructive" });
    } else {
      toast({
        title: "Event Submitted! 🎉",
        description: "Event submitted for Admin approval.",
        variant: "success",
      });
      setCreateDialogOpen(false);
      setSelectedCategory("");
    }
  }

  const statusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case "rejected":
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return null;
    }
  };

  return (
    <DashboardLayout session={session} role="hod">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">HOD Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Create events and track their approval status.
            </p>
          </div>
          <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button size="lg">
                <CalendarPlus className="mr-2 h-5 w-5" /> Create Event
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Create New Event</DialogTitle>
                <DialogDescription>
                  Fill in the details. Event will be sent for Admin approval.
                </DialogDescription>
              </DialogHeader>
              <form action={handleCreateEvent} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Event Title</Label>
                  <Input id="title" name="title" placeholder="Code Sprint 2026" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Describe the event..."
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date">Date</Label>
                    <Input id="date" name="date" type="date" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="capacity">Capacity</Label>
                    <Input
                      id="capacity"
                      name="capacity"
                      type="number"
                      placeholder="100"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="venue">Venue</Label>
                  <Input id="venue" name="venue" placeholder="Main Auditorium" required />
                </div>
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {INTEREST_TAGS.map((tag) => (
                        <SelectItem key={tag} value={tag}>
                          {tag}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bannerUrl">Banner Image URL (optional)</Label>
                  <Input id="bannerUrl" name="bannerUrl" placeholder="https://..." />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Submitting..." : "Submit for Approval"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Pending
                </CardTitle>
                <Clock className="h-4 w-4 text-yellow-600" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-yellow-600">{pendingEvents.length}</div>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Approved
                </CardTitle>
                <CheckCircle2 className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">{approvedEvents.length}</div>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Registrations
                </CardTitle>
                <Users className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600">
                  {events.reduce((acc, e) => acc + (e.registeredStudents?.length || 0), 0)}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Events Table */}
        <Tabs defaultValue="all" className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">
              <CalendarCheck className="mr-2 h-4 w-4" /> All Events ({events.length})
            </TabsTrigger>
            <TabsTrigger value="pending">
              <Clock className="mr-2 h-4 w-4" /> Pending ({pendingEvents.length})
            </TabsTrigger>
            <TabsTrigger value="approved">
              <CheckCircle2 className="mr-2 h-4 w-4" /> Approved ({approvedEvents.length})
            </TabsTrigger>
          </TabsList>

          {["all", "pending", "approved"].map((tab) => {
            const filtered =
              tab === "all"
                ? events
                : tab === "pending"
                ? pendingEvents
                : approvedEvents;

            return (
              <TabsContent key={tab} value={tab}>
                <Card>
                  <CardContent className="pt-6">
                    {filtered.length === 0 ? (
                      <div className="text-center py-10 text-muted-foreground">
                        <CalendarPlus className="h-12 w-12 mx-auto mb-3 opacity-40" />
                        <p>No events found</p>
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b bg-muted/50">
                              <th className="text-left p-3 font-medium">Title</th>
                              <th className="text-left p-3 font-medium">Date</th>
                              <th className="text-left p-3 font-medium">Category</th>
                              <th className="text-left p-3 font-medium">Status</th>
                              <th className="text-left p-3 font-medium">Registrations</th>
                              <th className="text-left p-3 font-medium">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {filtered.map((event) => (
                              <tr key={event._id} className="border-b hover:bg-muted/30">
                                <td className="p-3 font-medium">{event.title}</td>
                                <td className="p-3">
                                  {new Date(event.date).toLocaleDateString()}
                                </td>
                                <td className="p-3">
                                  <Badge variant="secondary">{event.category}</Badge>
                                </td>
                                <td className="p-3">
                                  <div className="flex items-center gap-2">
                                    {statusIcon(event.status)}
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
                                  </div>
                                </td>
                                <td className="p-3">
                                  {event.registeredStudents?.length || 0} / {event.capacity}
                                </td>
                                <td className="p-3">
                                  {event.status === "approved" && (
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => setViewingAttendance(event)}
                                    >
                                      <Eye className="mr-1 h-4 w-4" /> Attendance
                                    </Button>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            );
          })}
        </Tabs>

        {/* Attendance Dialog */}
        <Dialog
          open={!!viewingAttendance}
          onOpenChange={() => setViewingAttendance(null)}
        >
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>
                Attendance: {viewingAttendance?.title}
              </DialogTitle>
              <DialogDescription>
                {viewingAttendance?.registeredStudents?.length || 0} students registered
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {viewingAttendance?.registeredStudents?.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No students registered yet
                </p>
              ) : (
                viewingAttendance?.registeredStudents?.map(
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  (student: any, index: number) => (
                    <div
                      key={student._id || index}
                      className="flex items-center justify-between p-3 rounded-lg border"
                    >
                      <div>
                        <p className="font-medium text-sm">{student.name}</p>
                        <p className="text-xs text-muted-foreground">{student.email}</p>
                      </div>
                      <Badge variant="outline">{student.department}</Badge>
                    </div>
                  )
                )
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
