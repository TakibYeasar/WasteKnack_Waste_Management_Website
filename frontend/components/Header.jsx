'use client';

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, Coins, Leaf, Search, Bell, User, ChevronDown, LogIn, LogOut } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useRouter } from 'next/navigation';
import { useMediaQuery } from "../hooks/useMediaQuery";
import toast from 'react-hot-toast';
import { useCurrentUserQuery, useLogoutMutation } from "../redux/features/auth/authApi";

const Header = ({ onMenuClick, totalEarnings }) => {
  const router = useRouter();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const { data: userInfo } = useCurrentUserQuery();
  const [logoutApiCall] = useLogoutMutation(); // Use the mutation hook here

  const handleLogout = async () => {
    try {
      const response = await logoutApiCall().unwrap();

      toast.success(response?.message || "You have logged out successfully!");
      localStorage.clear();
      sessionStorage.clear();
      router.push("/sign-in");
    } catch (error) {
      const errorMessage =
        error?.data?.detail || "Error logging out. Please try again.";
      toast.error(errorMessage);

      console.error("Logout error:", error);
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="flex items-center justify-between px-4 py-2">
        {/* Left Section */}
        <div className="flex items-center">
          <Button variant="ghost" size="icon" className="mr-2 md:mr-4" onClick={onMenuClick}>
            <Menu className="h-6 w-6" />
          </Button>
          <Link href="/" className="flex items-center">
            <Leaf className="h-6 w-6 md:h-8 md:w-8 text-green-500 mr-1 md:mr-2" />
            <div className="flex flex-col">
              <span className="font-bold text-base md:text-lg text-gray-800">WasteKnack</span>
            </div>
          </Link>
        </div>

        {/* Search Bar (Visible on larger screens) */}
        {!isMobile && (
          <div className="flex-1 max-w-xl mx-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>
        )}

        {/* Right Section */}
        <div className="flex items-center space-x-4">
          {isMobile && (
            <Button variant="ghost" size="icon" className="mr-2">
              <Search className="h-5 w-5" />
            </Button>
          )}

          {/* Notifications Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="mr-2 relative">
                <Bell className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
              {/* Notification items go here */}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Total Earnings */}
          <div className="mr-2 md:mr-4 flex items-center bg-gray-100 rounded-full px-2 md:px-3 py-1">
            <Coins className="h-4 w-4 md:h-5 md:w-5 mr-1 text-green-500" />
            <span className="font-semibold text-sm md:text-base text-gray-800">{totalEarnings}</span>
          </div>

          {/* Authentication State: Sign In/Sign Up or User Profile */}
          {userInfo ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="flex items-center">
                  <User className="h-5 w-5 mr-1" />
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Link href="/profile">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/settings">Settings</Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout}>
                  Sign Out
                  <LogOut className="ml-2 h-4 w-4" />
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex space-x-2">
              <Link href="/sign-up">
                <Button className="bg-green-600 hover:bg-green-700 text-white text-sm">
                  Sign Up
                  <LogIn className="ml-1 md:ml-2 h-4 w-4 md:h-5 md:w-5" />
                </Button>
              </Link>
              <Link href="/sign-in">
                <Button className="bg-cyan-600 hover:bg-cyan-700 text-white text-sm">
                  Sign In
                  <LogIn className="ml-1 md:ml-2 h-4 w-4 md:h-5 md:w-5" />
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
