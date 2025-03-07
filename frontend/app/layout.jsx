"use client";

import localFont from "next/font/local";
import { Toaster } from "react-hot-toast";
import { Provider } from "react-redux";
import store from "../store/store";
import { useGetAvailableRewardsQuery } from "@/store/features/user/userApi";
import Header from "@/components/Header";
import "./globals.css";
import ProtectedRoute from "@/lib/ProtectedRoute";
import { usePathname } from "next/navigation";

// Define fonts
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

const protectedRoutes = [
  { path: "/admin-dashboard", roles: ["admin"] },
  { path: "/report", roles: ["user"] },
  { path: "/collect", roles: ["collector"] },
  { path: "/rewards", roles: ["user", "collector"] },
  { path: "/leaderboard", roles: ["admin", "user", "collector"] },
  { path: "/settings", roles: ["admin", "user", "collector"] },
];

function MainLayout({ children }) {
  // Fetch rewards data
  const { data: rewards, isError, isLoading } = useGetAvailableRewardsQuery();
  const totalEarnings = !isLoading && !isError ? rewards : 0;

  return (
    <div className="flex flex-col min-h-screen">
      <header>
        <Header totalEarnings={totalEarnings} />
      </header>
      <main className="flex-1">{children}</main>
    </div>
  );
}

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const isProtected = protectedRoutes.some((route) => route.path === pathname);

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50`}
      >
        <Provider store={store}>
          {isProtected ? (
            <ProtectedRoute allowedRoles={protectedRoutes.find(route => route.path === pathname)?.roles || []}>
              <MainLayout>{children}</MainLayout>
            </ProtectedRoute>
          ) : (
            <MainLayout>{children}</MainLayout>
          )}
        </Provider>
        <Toaster />
      </body>
    </html>
  );
}
