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

// Sample data - replace with actual data from your API
const chartData = [
  {
    date: "01/05/2024",
    income: 1500000,
    expense: 1200000,
    investment: 1500000,
  },
  {
    date: "05/05/2024",
    income: 1800000,
    expense: 1400000,
    investment: 1600000,
  },
  {
    date: "10/05/2024",
    income: 1600000,
    expense: 1100000,
    investment: 1400000,
  },
  {
    date: "15/05/2024",
    income: 2000000,
    expense: 1600000,
    investment: 1800000,
  }
];

const distributionData = [
  { name: "Kebutuhan pokok", value: 1 },
  { name: "Jajan", value: 30 },
  { name: "Investasi", value: 20 },
  { name: "Lainnya", value: 10 },
];

function DashboardPage() {
  const [profileImage, setProfileImage] = useState("/logo/User.png");

  const [saldo, setSaldo] = useState(0);

  const fetchSaldo = async () => {
    const result = await getRequest("api/saldo", getToken());
    if (result.error) return;

    setSaldo(result.data.amount);
  };

  useEffect(() => {
    fetchSaldo();

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
            <BalanceCard balance={saldo} />
            <DistributionChart data={distributionData} title="Pengeluaran" />
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
