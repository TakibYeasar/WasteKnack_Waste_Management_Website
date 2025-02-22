'use client';
import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { useMediaQuery } from "../hooks/useMediaQuery";
import { useCurrentUserQuery } from "../store/features/auth/authApi";
import { resetAuthState } from "@/store/features/auth/authSlice";
import { useGetUnreadNotificationsQuery, useMarkNotificationAsReadMutation } from "@/store/features/notification/notificationApi";
import { useGetUserBalanceQuery } from "@/store/features/transaction/transactionApi";
import { useDispatch } from "react-redux";
import {
  Menu, Coins, Leaf, Search, Bell, User, ChevronDown, LogIn, LogOut
} from "lucide-react";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const Header = ({ onMenuClick }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const isMobile = useMediaQuery("(max-width: 768px)");

  // Redux queries and mutations
  const { data: userInfo } = useCurrentUserQuery();
  const { data: notifications = [] } = useGetUnreadNotificationsQuery();
  const [markNotificationAsRead] = useMarkNotificationAsReadMutation();
  const { data: balance = 0 } = useGetUserBalanceQuery();

  useEffect(() => {
    const tokenTimestamp = localStorage.getItem('loginTimestamp');
    if (tokenTimestamp) {
      const timeElapsed = Date.now() - Number(tokenTimestamp);
      if (timeElapsed >= 3600000) {
        handleLogout();
      } else {
        setTimeout(handleLogout, 3600000 - timeElapsed);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    localStorage.removeItem('loginTimestamp');
    sessionStorage.clear();
    dispatch(resetAuthState());
    toast.success('Logged out successfully');
    router.push('/sign-in');
  };

  const handleNotificationClick = async (notificationId) => {
    try {
      await markNotificationAsRead(notificationId).unwrap();
      toast.success("Notification marked as read.");
    } catch (error) {
      console.error("Error marking notification as read:", error);
      toast.error("Failed to mark notification as read.");
    }
  };

  const handleDashboardClick = () => {
    const dashboardPath =
      userInfo?.role === "admin" ? "/admin-dashboard" :
        userInfo?.role === "collector" ? "/collector-dashboard" :
          userInfo?.role === "user" ? "/user-dashboard" : '/sign-in';

    router.push(dashboardPath);
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
                {notifications.length > 0 && (
                  <Badge className="absolute -top-1 -right-1 px-1 min-w-[1.2rem] h-5">
                    {notifications.length}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
              {notifications.length > 0 ? (
                notifications.map((notification) => (
                  <DropdownMenuItem
                    key={notification.id}
                    onClick={() => handleNotificationClick(notification.id)}
                  >
                    <div className="flex flex-col">
                      <span className="font-medium">{notification.type}</span>
                      <span className="text-sm text-gray-500">{notification.message}</span>
                    </div>
                  </DropdownMenuItem>
                ))
              ) : (
                <DropdownMenuItem>No new notifications</DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Total Earnings */}
          <div className="mr-2 md:mr-4 flex items-center bg-gray-100 rounded-full px-2 md:px-3 py-1">
            <Coins className="h-4 w-4 md:h-5 md:w-5 mr-1 text-green-500" />
            <span className="font-semibold text-sm md:text-base text-gray-800">{balance.toFixed(2)}</span>
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
                <DropdownMenuItem>{userInfo?.username || "User"}</DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/profile">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleDashboardClick}>
                  Dashboard
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
