import {
  Bus,
  CircleDollarSign,
  Clapperboard,
  GraduationCap,
  HeartPlus,
  House,
  Info,
  LeafyGreen,
  BanknoteArrowDown,
  ShieldPlus,
  Soup,
  Utensils,
  Wrench,
  Briefcase,
  Gift,
  Banknote,
  TrendingUp,
  Wallet,
  BanknoteArrowUp,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import DateDropdown from "./DateDropdown";
import LoadingSpinner from "../../../components/LoadingSpinner";
import { getRequest } from "@/utils/api";
import { getToken } from "@/utils/localStorage";

const CATEGORY_COLORS = {
  // Expenses
  Rent: "#64748B",
  Loan_Repayment: "#F59E0B",
  Insurance: "#38BDF8",
  Groceries: "#4ADE80",
  Transport: "#60A5FA",
  Eating: "#FB923C",
  Eating_Out: "#F87171",
  Entertainment: "#A78BFA",
  Utilities: "#94A3B8",
  Healthcare: "#FB7185",
  Education: "#818CF8",
  // Income
  Salary: "#10B981",
  Investments: "#F59E0B",
  Freelance: "#6366F1",
  Gifts: "#EC4899",
  Other: "#8B5CF6",
  default: "#CBD5E1",
};

const DUMMY_DATA_BASE = {
  expenses: [
    { name: "Rent", value: 2500000 },
    { name: "Groceries", value: 1800000 },
    { name: "Transport", value: 800000 },
    { name: "Entertainment", value: 500000 },
    { name: "Utilities", value: 750000 },
    { name: "Healthcare", value: 400000 },
    { name: "Education", value: 1200000 },
    { name: "Eating_Out", value: 900000 },
  ],
  income: [
    { name: "Salary", value: 8000000 },
    { name: "Investments", value: 2000000 },
    { name: "Freelance", value: 1500000 },
    { name: "Gifts", value: 500000 },
    { name: "Other", value: 300000 },
  ],
};

const generateRandomData = (base) => {
  return base.map((item) => ({
    ...item,
    value: Math.round(item.value * (0.8 + Math.random() * 0.4)),
  }));
};

const DUMMY_DATA = {
  today: {
    expenses: generateRandomData(DUMMY_DATA_BASE.expenses),
    income: generateRandomData(DUMMY_DATA_BASE.income),
  },
  last_week: {
    expenses: generateRandomData(DUMMY_DATA_BASE.expenses),
    income: generateRandomData(DUMMY_DATA_BASE.income),
  },
  last_month: {
    expenses: generateRandomData(DUMMY_DATA_BASE.expenses),
    income: generateRandomData(DUMMY_DATA_BASE.income),
  },
  "1_year": {
    expenses: generateRandomData(DUMMY_DATA_BASE.expenses),
    income: generateRandomData(DUMMY_DATA_BASE.income),
  },
  all_time: {
    expenses: generateRandomData(DUMMY_DATA_BASE.expenses),
    income: generateRandomData(DUMMY_DATA_BASE.income),
  },
};

const fetchExpenseDistribution = async (timeframe = "today", type = "expenses") => {
  console.log("fetchExpenseDistribution", timeframe,type);
  let timeRange = "a";

  if(timeframe === "today"){
    timeRange = "day";
  } else if(timeframe === "last_week"){
    timeRange = "week";
  } else if(timeframe === "last_month"){
    timeRange= "month";
  } else if(timeframe === "1_year"){
    timeRange= "year";
  }  else if(timeframe === "all_time"){
    timeRange= "alltime";
  }
  
  if(type === "expenses"){
    type = "expense"
  } else if(type === "incomes"){
    type = "income"
  }
  
  const result = await getRequest(`api/transaction/comparision?timeRange=${timeRange}&type=${type}`,getToken());

  return formatDistributonData(result.data);
};

function formatDistributonData(comparisions){
  const distributions = [];
  console.log(comparisions);
  for( const key in comparisions){
    distributions.push({
      name: key,
      value: comparisions[key]
    })
  }
  return distributions;
}

function giveIconByCategory(category) {
  switch (category) {
    // Expenses
    case "Rent":
      return (
        <div className="border-2 border-gray-300 rounded-full p-2">
          <House style={{ color: "#64748B" }} className="w-4 h-4" />
        </div>
      );
    case "Loan_Repayment":
      return (
        <div className="border-2 border-gray-300 rounded-full p-2">
          <CircleDollarSign style={{ color: "#F59E0B" }} className="w-4 h-4" />
        </div>
      );
    case "Insurance":
      return (
        <div className="border-2 border-gray-300 rounded-full p-2">
          <ShieldPlus style={{ color: "#38BDF8" }} className="w-4 h-4" />
        </div>
      );
    case "Groceries":
      return (
        <div className="border-2 border-gray-300 rounded-full p-2">
          <LeafyGreen style={{ color: "#4ADE80" }} className="w-4 h-4" />
        </div>
      );
    case "Transport":
      return (
        <div className="border-2 border-gray-300 rounded-full p-2">
          <Bus style={{ color: "#60A5FA" }} className="w-4 h-4" />
        </div>
      );
    case "Eating":
      return (
        <div className="border-2 border-gray-300 rounded-full p-2">
          <Utensils style={{ color: "#FB923C" }} className="w-4 h-4" />
        </div>
      );
    case "Eating_Out":
      return (
        <div className="border-2 border-gray-300 rounded-full p-2">
          <Soup style={{ color: "#F87171" }} className="w-4 h-4" />
        </div>
      );
    case "Entertainment":
      return (
        <div className="border-2 border-gray-300 rounded-full p-2">
          <Clapperboard style={{ color: "#A78BFA" }} className="w-4 h-4" />
        </div>
      );
    case "Utilities":
      return (
        <div className="border-2 border-gray-300 rounded-full p-2">
          <Wrench style={{ color: "#94A3B8" }} className="w-4 h-4" />
        </div>
      );
    case "Healthcare":
      return (
        <div className="border-2 border-gray-300 rounded-full p-2">
          <HeartPlus style={{ color: "#FB7185" }} className="w-4 h-4" />
        </div>
      );
    case "Education":
      return (
        <div className="border-2 border-gray-300 rounded-full p-2">
          <GraduationCap style={{ color: "#818CF8" }} className="w-4 h-4" />
        </div>
      );
    // Income
    case "Salary":
      return (
        <div className="border-2 border-gray-300 rounded-full p-2">
          <Briefcase style={{ color: "#10B981" }} className="w-4 h-4" />
        </div>
      );
    case "Investments":
      return (
        <div className="border-2 border-gray-300 rounded-full p-2">
          <TrendingUp style={{ color: "#F59E0B" }} className="w-4 h-4" />
        </div>
      );
    case "Freelance":
      return (
        <div className="border-2 border-gray-300 rounded-full p-2">
          <Banknote style={{ color: "#6366F1" }} className="w-4 h-4" />
        </div>
      );
    case "Gifts":
      return (
        <div className="border-2 border-gray-300 rounded-full p-2">
          <Gift style={{ color: "#EC4899" }} className="w-4 h-4" />
        </div>
      );
    case "Other":
      return (
        <div className="border-2 border-gray-300 rounded-full p-2">
          <Wallet style={{ color: "#8B5CF6" }} className="w-4 h-4" />
        </div>
      );
    default: {
      const randomColor = "#" + Math.floor(Math.random() * 16777215).toString(16);

      return (
        <div className="border-2 border-gray-300 rounded-full p-1">
          <Info style={{ color: randomColor }} className="w-4 h-4" />
        </div>
      );
    }
  }
}

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const color = payload[0].fill;

    return (
      <div className="bg-white/90 backdrop-blur-sm p-3 rounded-lg shadow-lg border border-gray-200/50 text-sm">
        <p className="font-bold text-gray-800 mb-2 capitalize">{data.name.replace(/_/g, ' ')}</p>
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <span className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: color }}></span>
              <span className="text-gray-600">Amount</span>
            </div>
            <span className="font-semibold text-gray-900 ml-4">
                {new Intl.NumberFormat("id-ID", {
                    style: "currency",
                    currency: "IDR",
                    minimumFractionDigits: 0,
                }).format(data.value)}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <span className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: color, opacity: 0.6 }}></span>
              <span className="text-gray-600">Share</span>
            </div>
            <span className="font-semibold text-gray-900 ml-4">{data.percentage.toFixed(1)}%</span>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

function DistributionChart({ title = "Distribution" }) {
  const [timeframe, setTimeframe] = useState("today");
  const [type, setType] = useState("expenses");

  const {
    data: distributionData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["distribution", timeframe, type],
    queryFn: () => fetchExpenseDistribution(timeframe, type),
    staleTime: 5 * 60 * 1000,
    keepPreviousData: true,
  });

  const handleTimeframeChange = (selectedTimeframe) => {
    setTimeframe(selectedTimeframe);
  };

  if (isLoading && !distributionData) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-sm flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-sm flex items-center justify-center">
        <p className="text-red-500">Error: {error.message}</p>
      </div>
    );
  }

  const total = distributionData.reduce((acc, curr) => acc + curr.value, 0);
  const data = distributionData
    .map((item) => ({
      ...item,
      percentage: (item.value / total) * 100,
    }))
    .sort((a, b) => b.value - a.value);

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm relative">
      <div className="flex justify-between items-center mb-1  ">
        <div className="flex items-center gap-4">
          <div className="flex justify-between gap-2">
            <div className={`p-2 rounded-lg ${type === 'expenses' ? 'bg-red-50' : 'bg-green-50'}`}>
              {type === 'expenses' ? (
                <BanknoteArrowDown className="w-6 h-6 text-red-500" />
              ) : (
                <BanknoteArrowUp className="w-6 h-6 text-green-500" />
              )}
            </div>
          </div>
          <div className="flex rounded-lg border border-gray-200 p-1">
            <button
              onClick={() => setType('expenses')}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors cursor-pointer ${
                type === 'expenses'
                  ? 'bg-red-100 text-red-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Expenses
            </button>
            <button
              onClick={() => setType('income')}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors cursor-pointer ${
                type === 'income'
                  ? 'bg-green-100 text-green-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Income
            </button>
          </div>
        </div>
        <DateDropdown onSelect={handleTimeframeChange} />
      </div>
      <div
        className={`flex flex-row items-center justify-center h-[200px] w-full transition-opacity duration-300 ${
          isLoading ? "opacity-50" : "opacity-100"
        }`}
      >
        <div className="flex flex-col gap-3 mr-8 min-w-[120px] max-h-[180px] overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-gray-300 pr-2">
          {data.map((entry, index) => (
            <div key={entry.name} className="flex items-center gap-2">
              {giveIconByCategory(entry.name)}
              <div className="flex flex-col">
                <span
                  className="text-sm font-medium"
                  style={{ color: CATEGORY_COLORS[entry.name] || CATEGORY_COLORS.default }}
                >
                  {entry.name.replace(/_/g, ' ')}
                </span>
                <span className="text-xs text-gray-500">
                  {entry.percentage.toFixed(1)}%
                </span>
              </div>
            </div>
          ))}
        </div>
        <div className="flex-1 h-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={65}
                paddingAngle={5}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={CATEGORY_COLORS[entry.name] || CATEGORY_COLORS.default}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default DistributionChart;
