"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Sparkles,
  Search,
  Calendar,
  MapPin,
  Users,
  Tag,
  Ticket,
  ChevronLeft,
  ChevronRight,
  User,
  Heart,
} from "lucide-react";
import { Session } from "next-auth";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
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
import { registerForEvent, updateInterests } from "@/actions/student";
import { INTEREST_TAGS } from "@/lib/constants";
import DashboardLayout from "@/components/DashboardLayout";

interface StudentDashboardClientProps {
  session: Session;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  recommended: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  allEvents: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  myRegistrations: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  profile: any;
}

export default function StudentDashboardClient({
  session,
  recommended,
  allEvents,
  myRegistrations,
  profile,
}: StudentDashboardClientProps) {
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [interests, setInterests] = useState<string[]>(profile?.interests || []);
  const [profileDialogOpen, setProfileDialogOpen] = useState(false);
  const [loading, setLoading] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const registeredIds = new Set(myRegistrations.map((e: { _id: string }) => e._id));

  const filteredEvents = allEvents.filter((event) => {
    const matchSearch =
      !search ||
      event.title.toLowerCase().includes(search.toLowerCase()) ||
      event.description.toLowerCase().includes(search.toLowerCase());
    const matchCategory = categoryFilter === "all" || event.category === categoryFilter;
    return matchSearch && matchCategory;
  });

  async function handleRegister(eventId: string) {
    setLoading(eventId);
    const result = await registerForEvent(eventId);
    setLoading(null);
    if (result.error) {
      toast({ title: "Error", description: result.error, variant: "destructive" });
    } else {
      toast({
        title: "Registered! 🎉",
        description: "You've successfully registered for this event.",
        variant: "success",
      });
    }
  }

  async function handleUpdateInterests() {
    const result = await updateInterests(interests);
    if (result.error) {
      toast({ title: "Error", description: result.error, variant: "destructive" });
    } else {
      toast({
        title: "Updated!",
        description: "Your interests have been updated. Recommendations will refresh.",
        variant: "success",
      });
      setProfileDialogOpen(false);
    }
  }

  function scrollCarousel(direction: "left" | "right") {
    if (scrollRef.current) {
      const scrollAmount = 320;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function EventCard({ event, isRegistered }: { event: any; isRegistered: boolean }) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 h-full flex flex-col">
          <div className="h-40 bg-gradient-to-br from-violet-500 to-purple-600 relative overflow-hidden">
            {event.bannerUrl && (
              <Image
                src={event.bannerUrl}
                alt={event.title}
                fill
                className="object-cover opacity-80"
              />
            )}
            <div className="absolute top-3 right-3">
              <Badge className="bg-white/90 text-violet-700 hover:bg-white">
                {event.category}
              </Badge>
            </div>
          </div>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg line-clamp-1">{event.title}</CardTitle>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {event.description}
            </p>
          </CardHeader>
          <CardContent className="space-y-2 flex-1">
            <div className="flex items-center text-sm text-muted-foreground gap-2">
              <Calendar className="h-4 w-4 text-violet-500" />
              {new Date(event.date).toLocaleDateString("en-US", {
                weekday: "short",
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </div>
            <div className="flex items-center text-sm text-muted-foreground gap-2">
              <MapPin className="h-4 w-4 text-violet-500" />
              {event.venue}
            </div>
            <div className="flex items-center text-sm text-muted-foreground gap-2">
              <Users className="h-4 w-4 text-violet-500" />
              {event.registeredStudents?.length || 0} / {event.capacity} seats
            </div>
            {event.organizer && (
              <div className="flex items-center text-sm text-muted-foreground gap-2">
                <Tag className="h-4 w-4 text-violet-500" />
                {event.organizer.name} — {event.organizer.department}
              </div>
            )}
          </CardContent>
          <CardFooter>
            {isRegistered ? (
              <Button variant="outline" className="w-full" disabled>
                <Ticket className="mr-2 h-4 w-4" /> View Ticket ✓
              </Button>
            ) : (
              <Button
                className="w-full"
                onClick={() => handleRegister(event._id)}
                disabled={loading === event._id || event.registeredStudents?.length >= event.capacity}
              >
                {loading === event._id
                  ? "Registering..."
                  : event.registeredStudents?.length >= event.capacity
                  ? "Event Full"
                  : "Register Now"}
              </Button>
            )}
          </CardFooter>
        </Card>
      </motion.div>
    );
  }

  return (
    <DashboardLayout session={session} role="student">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Welcome, {session.user?.name?.split(" ")[0]}! 👋
            </h1>
            <p className="text-muted-foreground mt-1">
              Discover events tailored to your interests.
            </p>
          </div>
          <Dialog open={profileDialogOpen} onOpenChange={setProfileDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <User className="mr-2 h-4 w-4" /> Edit Profile
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Edit Your Interests</DialogTitle>
                <DialogDescription>
                  Select topics you&apos;re interested in to get better event recommendations.
                </DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-3 max-h-64 overflow-y-auto py-2">
                {INTEREST_TAGS.map((tag) => (
                  <div key={tag} className="flex items-center space-x-2">
                    <Checkbox
                      id={tag}
                      checked={interests.includes(tag)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setInterests([...interests, tag]);
                        } else {
                          setInterests(interests.filter((i) => i !== tag));
                        }
                      }}
                    />
                    <Label htmlFor={tag} className="text-sm cursor-pointer">
                      {tag}
                    </Label>
                  </div>
                ))}
              </div>
              <Button onClick={handleUpdateInterests} className="w-full">
                <Heart className="mr-2 h-4 w-4" /> Save Interests
              </Button>
            </DialogContent>
          </Dialog>
        </div>

        {/* Recommended Section */}
        {recommended.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-violet-600" />
                <h2 className="text-xl font-semibold">Picked for You</h2>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => scrollCarousel("left")}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => scrollCarousel("right")}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div
              ref={scrollRef}
              className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {recommended.map((event) => (
                <div key={event._id} className="min-w-[300px] max-w-[300px]">
                  <EventCard event={event} isRegistered={registeredIds.has(event._id)} />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Main Content Tabs */}
        <Tabs defaultValue="explore" className="space-y-4">
          <TabsList>
            <TabsTrigger value="explore">
              <Search className="mr-2 h-4 w-4" /> Explore Events
            </TabsTrigger>
            <TabsTrigger value="registered">
              <Ticket className="mr-2 h-4 w-4" /> My Registrations ({myRegistrations.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="explore">
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search events..."
                  className="pl-10"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {INTEREST_TAGS.map((tag) => (
                    <SelectItem key={tag} value={tag}>
                      {tag}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Events Grid */}
            {filteredEvents.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground">
                <Search className="h-12 w-12 mx-auto mb-3 opacity-40" />
                <p className="text-lg">No events found</p>
                <p className="text-sm">Try adjusting your search or filters</p>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredEvents.map((event) => (
                  <EventCard
                    key={event._id}
                    event={event}
                    isRegistered={registeredIds.has(event._id)}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="registered">
            {myRegistrations.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground">
                <Ticket className="h-12 w-12 mx-auto mb-3 opacity-40" />
                <p className="text-lg">No registrations yet</p>
                <p className="text-sm">Explore events and register for ones that interest you!</p>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {myRegistrations.map((event) => (
                  <EventCard key={event._id} event={event} isRegistered={true} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
