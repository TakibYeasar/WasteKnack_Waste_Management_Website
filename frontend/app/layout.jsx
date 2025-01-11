"use client";

import { useState } from "react";
import localFont from "next/font/local";
import { Toaster } from "react-hot-toast";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import "./globals.css";
import { Provider } from "react-redux";
import store from "../redux/store/store";
import { useGetAvailableRewardsQuery } from "@/redux/features/user/userApi";

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

export default function RootLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-gray-50 flex flex-col`}
      >
        <Provider store={store}>
          <ContentWrapper sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}>
            {children}
          </ContentWrapper>
        </Provider>
      </body>
    </html>
  );
}

// Extracted Content Wrapper to Use Redux Hooks
function ContentWrapper({ children, sidebarOpen, setSidebarOpen }) {
  const { data: totalEarnings, isError, isLoading } = useGetAvailableRewardsQuery();

  return (
    <>
      {/* Header Section */}
      <Header
        onMenuClick={() => setSidebarOpen((prev) => !prev)}
        totalEarnings={!isLoading && !isError ? totalEarnings : 0}
      />

      {/* Main Content Section */}
      <div className="flex flex-1">
        <Sidebar open={sidebarOpen} />
        <main className="flex-1 p-4 lg:p-8 ml-0 lg:ml-64 transition-all duration-300">
          {children}
        </main>
      </div>

      {/* Toast Notifications */}
      <Toaster />
    </>
  );
}
