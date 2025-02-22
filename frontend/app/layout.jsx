"use client";

import localFont from "next/font/local";
import { Toaster } from "react-hot-toast";
import { Provider } from "react-redux";
import store from "../store/store";
import { useGetAvailableRewardsQuery } from "@/store/features/user/userApi";
import Header from "@/components/Header";
import "./globals.css";

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

function MainLayout({ children }) {
  // Fetch rewards data
  const { data, isError, isLoading } = useGetAvailableRewardsQuery();
  const totalEarnings = !isLoading && !isError ? data : 0;

  return (
    <div className="flex flex-col min-h-screen">
      <header>
        <Header totalEarnings={totalEarnings} />
      </header>
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50`}
      >
        <Provider store={store}>
          <MainLayout>{children}</MainLayout>
        </Provider>
        <Toaster />
      </body>
    </html>
  );
}
