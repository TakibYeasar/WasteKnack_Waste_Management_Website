'use client'
import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { ArrowRight, Leaf, Recycle, Users, Coins, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AnimatedGlobe from '@/components/containers/AnimatedGlobe';
import FeatureCard from '@/components/containers/FeatureCard';
import ImpactCard from '@/components/containers/ImpactCard';
import { useCurrentUserQuery } from "../../store/features/auth/authApi";
import { useGetRecentReportsQuery, useGetWasteCollectionTasksQuery } from '@/store/features/waste/wasteApi';
import { useGetAllRewardsQuery } from '@/store/features/user/userApi';

export default function Home() {
  const { data: userInfo } = useCurrentUserQuery();
  const { data: reportsData } = useGetRecentReportsQuery({ limit: 100 });
  const { data: rewardsData } = useGetAllRewardsQuery();
  const { data: tasksData } = useGetWasteCollectionTasksQuery({ limit: 100 });

  const [impactData, setImpactData] = useState({
    wasteCollected: 0,
    reportsSubmitted: 0,
    tokensEarned: 0,
    co2Offset: 0
  });

  const calculateImpact = useMemo(() => ({
    wasteCollected: (tasksData?.data || []).reduce((total, task) => {
      const match = task.amount.match(/(\d+(\.\d+)?)/);
      return total + (match ? parseFloat(match[0]) : 0);
    }, 0),
    reportsSubmitted: (reportsData?.data || []).length,
    tokensEarned: (rewardsData?.data || []).reduce((total, reward) => total + (reward.points || 0), 0)
  }), [tasksData, reportsData, rewardsData]);

  useEffect(() => {
    const co2Offset = calculateImpact.wasteCollected * 0.5;

    setImpactData({
      wasteCollected: Number(calculateImpact.wasteCollected.toFixed(1)),
      reportsSubmitted: calculateImpact.reportsSubmitted,
      tokensEarned: calculateImpact.tokensEarned,
      co2Offset: Number(co2Offset.toFixed(1))
    });
  }, [calculateImpact]);

  const actionButton = useMemo(() => {
    if (!userInfo) {
      return (
        <Link href="/sign-in">
          <Button className="bg-green-600 hover:bg-green-700 text-white text-lg py-6 px-10 rounded-full font-medium transition-all duration-300 ease-in-out transform hover:scale-105">
            Get Started
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </Link>
      );
    }

    const href = userInfo.role === "user"
      ? "/report"
      : userInfo.role === "collector"
        ? "/collect"
        : "#";

    const label = userInfo.role === "user"
      ? "Report Waste"
      : userInfo.role === "collector"
        ? "Collect Waste"
        : "Dashboard";

    return (
      <Link href={href}>
        <Button className="bg-green-600 hover:bg-green-700 text-white text-lg py-6 px-10 rounded-full font-medium transition-all duration-300 ease-in-out transform hover:scale-105">
          {label}
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </Link>
    );
  }, [userInfo]);

  return (
    <div className="container mx-auto px-4 py-16">
      <section className="text-center mb-20">
        <AnimatedGlobe />
        <h1 className="text-4xl md:text-6xl font-bold mb-6 text-gray-800 tracking-tight">
          WasteKnack <span className="text-green-600">Waste Management</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed mb-8">
          Join our community in making waste management more efficient and rewarding!
        </p>
        {actionButton}
      </section>

      <section className="grid md:grid-cols-3 gap-8 md:gap-10 mb-16 md:mb-20">
        <FeatureCard
          icon={Leaf}
          title="Eco-Friendly"
          description="Contribute to a cleaner environment by reporting and collecting waste."
        />
        <FeatureCard
          icon={Coins}
          title="Earn Rewards"
          description="Get tokens for your contributions to waste management efforts."
        />
        <FeatureCard
          icon={Users}
          title="Community-Driven"
          description="Be part of a growing community committed to sustainable practices."
        />
      </section>

      <section className="bg-white p-6 md:p-10 rounded-xl md:rounded-3xl shadow-lg mb-16 md:mb-20">
        <h2 className="text-3xl md:text-4xl font-bold mb-8 md:mb-12 text-center text-gray-800">
          Our Impact
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          <ImpactCard
            title="Waste Collected"
            value={`${impactData.wasteCollected} kg`}
            icon={Recycle}
          />
          <ImpactCard
            title="Reports Submitted"
            value={impactData.reportsSubmitted.toString()}
            icon={MapPin}
          />
          <ImpactCard
            title="Tokens Earned"
            value={impactData.tokensEarned.toString()}
            icon={Coins}
          />
          <ImpactCard
            title="CO2 Offset"
            value={`${impactData.co2Offset} kg`}
            icon={Leaf}
          />
        </div>
      </section>
    </div>
  );
}