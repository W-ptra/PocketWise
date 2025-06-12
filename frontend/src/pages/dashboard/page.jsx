"use client";

import { useState, useEffect } from "react";
import Navbar from "@/pages/dashboard/_components/Navbar";
import Footer from "@/pages/dashboard/_components/Footer";
import { getToken } from "~utils/localStorage";
import { getRequest } from "~utils/api";
import BalanceCard from "./_components/BalanceCard";
import ExpenseChart from "./_components/ExpenseChart";
import TransactionList from "./_components/TransactionList";
import DistributionChart from "./_components/DistributionChart";
import AISuggestions from "./_components/AISuggestions";
import InvestmentSuggestions from "./_components/InvestmentSuggestions";
import UserCategory from "./_components/UserCategory";

function DashboardPage() {
  const [profileImage, setProfileImage] = useState("/logo/User.png");

  return (
    <div className="bg-[#F2F2F2]">
      <Navbar profileImage={profileImage} />
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <ExpenseChart />
          </div>
          <div className="grid grid-cols-1 gap-6">
            <BalanceCard />
            <DistributionChart />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6 min-h-[300px]">
          <div className="col-span-1 row-span-1">
            <UserCategory />
          </div>
          <div className="col-span-2 row-span-1 col-start-2">
            <AISuggestions />
          </div>
        </div>
        <div className="w-full">
          <InvestmentSuggestions />
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default DashboardPage;
