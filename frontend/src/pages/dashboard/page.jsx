import { useState, useEffect } from "react";
import Navbar from "@/pages/dashboard/_components/Navbar";
import Footer from "@/pages/dashboard/_components/Footer";
import { getToken } from "~utils/localStorage";
import { getRequest } from "~utils/api";
import BalanceCard from "./_components/BalanceCard";
import ExpenseChart from "./_components/ExpenseChart";
import TransactionList from "./_components/TransactionList";
import ExpenseDistribution from "./_components/ExpenseDistribution";
import AISuggestions from "./_components/AISuggestions";
import InvestmentSuggestions from "./_components/InvestmentSuggestions";
import ComparisonPieChart from "./_components/ComparisonPieChart";

// Sample data - replace with actual data from your API
const chartData = [
  { date: "01/05", income: 1500000, expense: 1200000, investment: 1500000 },
  { date: "05/05", income: 1800000, expense: 1400000, investment: 1600000 },
  { date: "10/05", income: 1600000, expense: 1100000, investment: 1400000 },
  { date: "15/05", income: 2000000, expense: 1600000, investment: 1800000 },
  { date: "20/05", income: 1900000, expense: 1300000, investment: 1700000 },
  { date: "25/05", income: 1700000, expense: 1500000, investment: 1500000 },
  { date: "30/05", income: 1500000, expense: 1200000, investment: 1400000 },
];

const topExpenses = [
  { name: "MacBook M3", amount: -20000000, category: "Kebutuhan Kerja" },
  { name: "OS Shell I", amount: -10000000, category: "Kebutuhan Kerja" },
  { name: "Beras 2 kg", amount: -5000000, category: "Kebutuhan Pokok" },
  { name: "Sun M3 BB", amount: -210000, category: "Kebutuhan Pokok" },
  { name: "Casing Samsung A55", amount: -45000, category: "Kebutuhan Kerja" },
  { name: "MacBook M3", amount: -20000000, category: "Kebutuhan Kerja" },
  { name: "OS Shell I", amount: -10000000, category: "Kebutuhan Kerja" },
  { name: "Beras 2 kg", amount: -5000000, category: "Kebutuhan Pokok" },
];

const topIncome = [
  { name: "MacBook M3", amount: 20000000 },
  { name: "OS Shell I", amount: 10000000 },
  { name: "Beras 2 kg", amount: 5000000 },
  { name: "Sun M3 BB", amount: 210000 },
  { name: "Casing Samsung A55", amount: 45000 },
  { name: "Beras 2 kg", amount: 5000000 },
  { name: "Sun M3 BB", amount: 210000 },
  { name: "Casing Samsung A55", amount: 45000 },
];

const distributionData = [
  { name: "Kebutuhan pokok", value: 40 },
  { name: "Jajan", value: 30 },
  { name: "Investasi", value: 20 },
  { name: "Lainnya", value: 10 },
];

const nowComparisonData = [
  { name: "Kebutuhan pokok", value: 40 },
  { name: "Jajan", value: 30 },
  { name: "Investasi", value: 20 },
  { name: "Lainnya", value: 10 },
];

const lastComparisonData = [
  { name: "Kebutuhan pokok", value: 30 },
  { name: "Jajan", value: 20 },
  { name: "Investasi", value: 10 },
  { name: "Lainnya", value: 40 },
];

function DashboardPage() {
  const [profileImage, setProfileImage] = useState("/logo/User.png");

  useEffect(() => {
    async function fetchProfileImage() {
      try {
        const token = getToken();
        const response = await getRequest("api/user/profile", token);
        console.log("Full response:", response);

        if (response.data && response.data.profileImageUrl) {
          console.log("Profile image URL:", response.data.profileImageUrl);

          // For Google profile images, use our proxy
          if (response.data.profileImageUrl.includes("googleusercontent.com")) {
            const path = response.data.profileImageUrl.split(
              "https://lh3.googleusercontent.com"
            )[1];
            const proxyUrl = `/googleusercontent${path}`;
            console.log("Using proxy URL:", proxyUrl);
            setProfileImage(proxyUrl);
            return;
          }

          // For other images, use direct URL
          setProfileImage(response.data.profileImageUrl);
        }
      } catch (error) {
        console.error("Error fetching profile image:", error);
        setProfileImage("/logo/User.png");
      }
    }

    fetchProfileImage();
  }, []);

  return (
    <div className="bg-[#F2F2F2]">
      <Navbar profileImage={profileImage} />
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <ExpenseChart data={chartData} />
          </div>
          <div className="grid grid-cols-1 gap-6">
            <ExpenseDistribution data={distributionData} title="Pengeluaran" />
            <BalanceCard balance={5142567} />
          </div>
        </div>

        <div className="grid grid-cols-3 grid-rows-3 gap-6 min-h-[600px]">
          <div className="col-span-2 row-span-1">
            <AISuggestions />
          </div>
          <div className="col-span-2 row-start-2 row-span-2">
            <InvestmentSuggestions />
          </div>
          <div className="col-start-3 row-span-3 h-full">
            <div className="grid grid-rows-2 grid-cols-1 gap-6 h-full">
              <div className="h-full">
                <TransactionList
                  transactions={topExpenses}
                  title="Top Pengeluaran Mei 2025"
                />
              </div>
              <div className="h-full">
                <TransactionList
                  transactions={topIncome}
                  title="Top Pendapatan Mei 2025"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ComparisonPieChart
            data={nowComparisonData}
            title="Perbandingan Pengeluaran April 2025"
          />
          <ComparisonPieChart
            data={lastComparisonData}
            title="Perbandingan Pengeluaran April 2025"
          />
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default DashboardPage;
