"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { Session } from "next-auth";
import {
  LayoutDashboard,
  LogOut,
  Menu,
  X,
  GraduationCap,
  Shield,
  Building2,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface DashboardLayoutProps {
  children: React.ReactNode;
  session: Session;
  role: "admin" | "hod" | "student";
}

const roleConfig = {
  admin: {
    icon: Shield,
    label: "Admin Panel",
    color: "text-violet-600",
    bgColor: "bg-violet-50",
    navItems: [
      { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
    ],
  },
  hod: {
    icon: Building2,
    label: "HOD Panel",
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    navItems: [
      { href: "/hod/dashboard", label: "Dashboard", icon: LayoutDashboard },
    ],
  },
  student: {
    icon: GraduationCap,
    label: "Student Portal",
    color: "text-green-600",
    bgColor: "bg-green-50",
    navItems: [
      { href: "/student/dashboard", label: "Dashboard", icon: LayoutDashboard },
    ],
  },
};

export default function DashboardLayout({ children, session, role }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const config = roleConfig[role];
  const RoleIcon = config.icon;

  const initials = session.user?.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase() || "U";

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-full w-64 bg-white border-r shadow-sm transition-transform duration-300 lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center gap-3 px-6 py-5 border-b">
            <div className={cn("p-2 rounded-lg", config.bgColor)}>
              <Sparkles className={cn("h-5 w-5", config.color)} />
            </div>
            <div>
              <h2 className="font-bold text-lg">MeetMatch</h2>
              <p className="text-xs text-muted-foreground">{config.label}</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="ml-auto lg:hidden"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Nav Items */}
          <nav className="flex-1 px-4 py-4 space-y-1">
            {config.navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? `${config.bgColor} ${config.color}`
                      : "text-gray-600 hover:bg-gray-100"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <Separator />

          {/* User info */}
          <div className="p-4">
            <div className="flex items-center gap-3 mb-3">
              <Avatar className="h-9 w-9">
                <AvatarFallback className={cn(config.bgColor, config.color, "text-sm font-bold")}>
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{session.user?.name}</p>
                <p className="text-xs text-muted-foreground truncate">{session.user?.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 mb-2">
              <RoleIcon className={cn("h-3.5 w-3.5", config.color)} />
              <span className={cn("text-xs font-medium uppercase", config.color)}>{role}</span>
            </div>
            <Button
              variant="outline"
              className="w-full justify-start"
              size="sm"
              onClick={() => signOut({ callbackUrl: "/login" })}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex items-center gap-4 border-b bg-white/80 backdrop-blur-sm px-6 py-3">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <div className="flex-1" />
          <div className="flex items-center gap-2">
            <Badge role={role} />
          </div>
        </header>

        {/* Page content */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}

function Badge({ role }: { role: string }) {
  const colors = {
    admin: "bg-violet-100 text-violet-700",
    hod: "bg-blue-100 text-blue-700",
    student: "bg-green-100 text-green-700",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
        colors[role as keyof typeof colors]
      )}
    >
      {role.toUpperCase()}
    </span>
  );
}
