"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Sparkles,
  CalendarCheck,
  Shield,
  Users,
  Zap,
  ArrowRight,
  GraduationCap,
  Building2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    icon: Shield,
    title: "Role-Based Security",
    description:
      "Three distinct roles — Admin, HOD, and Student — each with tailored access and capabilities.",
    color: "text-violet-600",
    bg: "bg-violet-50",
  },
  {
    icon: CalendarCheck,
    title: "Event Approval Workflow",
    description:
      "HODs propose events, Admins approve them. No unauthorized events go live.",
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    icon: Sparkles,
    title: "Smart Recommendations",
    description:
      "Students get personalized event suggestions based on their selected interests.",
    color: "text-amber-600",
    bg: "bg-amber-50",
  },
  {
    icon: Users,
    title: "Seamless Registration",
    description:
      "One-click event registration with capacity management and ticket confirmation.",
    color: "text-green-600",
    bg: "bg-green-50",
  },
];

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
};

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-violet-100 rounded-lg">
                <Sparkles className="h-5 w-5 text-violet-600" />
              </div>
              <span className="text-xl font-bold text-gray-900">MeetMatch</span>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/login">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link href="/register">
                <Button>
                  <GraduationCap className="mr-2 h-4 w-4" /> Register
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-50 via-white to-purple-50" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24">
          <motion.div
            className="text-center max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="inline-flex items-center gap-2 bg-violet-100 text-violet-700 rounded-full px-4 py-1.5 text-sm font-medium mb-6">
              <Zap className="h-4 w-4" />
              Intelligent Event Management
            </div>
            <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 tracking-tight leading-tight">
              Campus Events,
              <br />
              <span className="text-violet-600">Simplified.</span>
            </h1>
            <p className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto">
              A secure, role-based platform where HODs propose events, Admins
              approve them, and Students discover opportunities tailored to
              their interests.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/register">
                <Button size="lg" className="text-base px-8">
                  Get Started <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="outline" size="lg" className="text-base px-8">
                  Sign In
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Floating Cards */}
          <motion.div
            className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            {[
              {
                icon: Shield,
                label: "Admin",
                desc: "Approve & manage",
                color: "text-violet-600",
                bg: "bg-violet-50",
              },
              {
                icon: Building2,
                label: "HOD",
                desc: "Create & propose",
                color: "text-blue-600",
                bg: "bg-blue-50",
              },
              {
                icon: GraduationCap,
                label: "Student",
                desc: "Discover & register",
                color: "text-green-600",
                bg: "bg-green-50",
              },
            ].map((role, i) => (
              <motion.div
                key={role.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + i * 0.15 }}
              >
                <Card className="text-center hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <div
                      className={`inline-flex p-3 rounded-xl ${role.bg} mb-3`}
                    >
                      <role.icon className={`h-6 w-6 ${role.color}`} />
                    </div>
                    <h3 className="font-semibold text-lg">{role.label}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {role.desc}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            {...fadeInUp}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold text-gray-900">
              Everything You Need
            </h2>
            <p className="mt-3 text-lg text-gray-600 max-w-2xl mx-auto">
              Built with security, usability, and intelligence at its core.
            </p>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <Card className="h-full hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    <div
                      className={`inline-flex p-3 rounded-xl ${feature.bg} mb-4`}
                    >
                      <feature.icon
                        className={`h-6 w-6 ${feature.color}`}
                      />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-gradient-to-r from-violet-600 to-purple-600 rounded-2xl p-12 text-white"
          >
            <h2 className="text-3xl font-bold mb-4">
              Ready to Simplify Campus Events?
            </h2>
            <p className="text-violet-100 mb-8 max-w-xl mx-auto">
              Join MeetMatch today and experience intelligent event management
              powered by personalized recommendations.
            </p>
            <Link href="/register">
              <Button
                size="lg"
                variant="secondary"
                className="text-violet-700 bg-white hover:bg-violet-50"
              >
                Register Now <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-violet-600" />
            <span className="text-sm font-medium text-gray-900">MeetMatch</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2026 MeetMatch. Built with Next.js, MongoDB & ❤️
          </p>
        </div>
      </footer>
    </div>
  );
}
