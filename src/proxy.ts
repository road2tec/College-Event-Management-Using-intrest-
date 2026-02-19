import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const user = req.auth?.user;

  // Admin routes protection
  if (pathname.startsWith("/admin")) {
    if (!user) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    if (user.role !== "admin") {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  // HOD routes protection
  if (pathname.startsWith("/hod")) {
    if (!user) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    if (user.role === "student") {
      return NextResponse.redirect(new URL("/", req.url));
    }
    if (user.role !== "hod" && user.role !== "admin") {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  // Student routes protection
  if (pathname.startsWith("/student")) {
    if (!user) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*", "/hod/:path*", "/student/:path*"],
};
