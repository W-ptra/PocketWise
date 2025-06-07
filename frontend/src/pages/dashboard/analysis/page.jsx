import Navbar from "@/pages/dashboard/_components/Navbar";
import Footer from "@/pages/dashboard/_components/Footer";
import AnalysisCard from "./_components/AnalysisCard";
import { getRequest } from "~utils/api";
import { getToken } from "@/utils/localStorage";
import { useEffect, useState } from "react";
import PredictionCard from "./_components/PredictionCard";

function Analysis() {
  const [monthlyInsights, setMonthlyInsights] = useState([]);
  const [dailyInsights, setDailyInsights] = useState([]);

  // Sample insights for demonstration
  const sampleDailyInsights = [
    {
      type: "highlight",
      text: "You've spent more on dining out today compared to your usual daily average. Consider bringing lunch from home tomorrow.",
      priority: "high"
    },
    {
      type: "positive",
      text: "No impulse purchases today! Keep up the good work on sticking to your planned expenses.",
      priority: "medium"
    },
    {
      type: "tip",
      text: "Try the 24-hour rule: Wait a day before making non-essential purchases to avoid impulse buying.",
      priority: "low"
    }
  ];

  const sampleMonthlyInsights = [
    {
      type: "highlight",
      text: "Your subscription services have increased by 15% this month. Review your recurring payments to identify any unused services.",
      priority: "high"
    },
    {
      type: "positive",
      text: "Your savings rate has improved! You're now saving 25% of your monthly income, up from 20% last month.",
      priority: "medium"
    },
    {
      type: "tip",
      text: "Based on your spending pattern, you could save more by bulk buying your most frequently purchased items.",
      priority: "low"
    }
  ];

  const fetchMonthlyInsights = async () => {
    try {
      const result = await getRequest("api/ai/journal/month", getToken());
      console.log(result);
      setMonthlyInsights(result.data);
    } catch (error) {
      console.error("Error fetching monthly insights:", error);
    }
  };

  const fetchDailyInsights = async () => {
    try {
      const result = await getRequest(
        "api/ai/journal/day?timeRange=month",
        getToken()
      );
      console.log(result);
      setDailyInsights(result.data);
    } catch (error) {
      console.error("Error fetching daily insights:", error);
    }
  };

  useEffect(() => {
    // Uncomment these when ready to fetch real data
    // fetchMonthlyInsights();
    // fetchDailyInsights();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Financial Insights</h1>
        <p className="text-gray-600 mb-8">Smart analysis of your spending patterns and financial habits</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AnalysisCard 
            name="Daily Insights" 
            insights={dailyInsights.length > 0 ? dailyInsights : sampleDailyInsights} 
          />
          <AnalysisCard 
            name="Monthly Insights" 
            insights={monthlyInsights.length > 0 ? monthlyInsights : sampleMonthlyInsights} 
          />
        </div>
        
        <div className="mt-6">
          <PredictionCard />
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Analysis;
