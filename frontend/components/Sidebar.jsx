"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { MapPin, Trash, Coins, Medal, MessageCircle, Home, Settings } from "lucide-react";
import { useCurrentUserQuery } from "@/store/features/auth/authApi";

const sidebarItems = {
  user: [
    { href: "/", icon: Home, label: "Home" },
    { href: "/report", icon: MapPin, label: "Report Waste" },
    { href: "/rewards", icon: Coins, label: "Rewards" },
    { href: "/leaderboard", icon: Medal, label: "Leaderboard" },
    { href: "/messages", icon: MessageCircle, label: "Chat AI" },
  ],
  collector: [
    { href: "/", icon: Home, label: "Home" },
    { href: "/collect", icon: Trash, label: "Collect Waste" },
    { href: "/rewards", icon: Coins, label: "Rewards" },
    { href: "/leaderboard", icon: Medal, label: "Leaderboard" },
    { href: "/messages", icon: MessageCircle, label: "Chat AI" },
  ],
  admin: [
    { href: "/", icon: Home, label: "Home" },
    { href: "/leaderboard", icon: Medal, label: "Leaderboard" },
    { href: "/messages", icon: Medal, label: "Chat AI" },
  ],
};

export default function Sidebar({ open }) {
  const pathname = usePathname();
  const { data: user } = useCurrentUserQuery();

  if (!user) return null; // Don't show sidebar if user is not logged in

  const menuItems = sidebarItems[user.role] || sidebarItems.user; // Default to "user" if role is unknown

  return (
    <aside
      className={`bg-white border-r pt-20 border-gray-200 text-gray-800 w-64 fixed inset-y-0 left-0 z-30 transform transition-transform duration-300 ease-in-out ${open ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
    >
      <nav className="h-full flex flex-col justify-between">
        <div className="px-4 py-6 space-y-8">
          {menuItems.map((item) => (
            <Link key={item.href} href={item.href} passHref>
              <Button
                variant={pathname === item.href ? "secondary" : "ghost"}
                className={`w-full justify-start py-3 ${pathname === item.href ? "bg-green-100 text-green-800" : "text-gray-600 hover:bg-gray-100"}`}
              >
                <item.icon className="mr-3 h-5 w-5" />
                <span className="text-base">{item.label}</span>
              </Button>
            </Link>
          ))}
        </div>
        {user.role === "admin" && (
          <div className="p-4 border-t border-gray-200">
            <Link href="/settings" passHref>
              <Button
                variant={pathname === "/settings" ? "secondary" : "outline"}
                className={`w-full py-3 ${pathname === "/settings" ? "bg-green-100 text-green-800" : "text-gray-600 border-gray-300 hover:bg-gray-100"}`}
              >
                <Settings className="mr-3 h-5 w-5" />
                <span className="text-base">Settings</span>
              </Button>
            </Link>
          </div>
        )}
      </nav>
    </aside>
  );
}
