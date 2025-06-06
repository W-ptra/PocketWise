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

const CATEGORY_COLORS = {
  Rent: "#4B5563",
  Loan_Repayment: "#D97706",
  Insurance: "#0EA5E9",
  Groceries: "#22C55E",
  Transport: "#3B82F6",
  Eating: "#F97316",
  Eating_Out: "#EA580C",
  Entertainment: "#8B5CF6",
  Utilities: "#6B7280",
  Healthcare: "#EF4444",
  Education: "#6366F1",
  default: "#9CA3AF",
};

const generateRandomData = (base) => {
  return base.map((item) => ({
    ...item,
    value: Math.round(item.value * (0.8 + Math.random() * 0.4)),
  }));
};

const DUMMY_DATA_BASE = [
  { name: "Rent", value: 2500000 },
  { name: "Groceries", value: 1800000 },
  { name: "Transport", value: 800000 },
  { name: "Entertainment", value: 500000 },
  { name: "Utilities", value: 750000 },
  { name: "Healthcare", value: 400000 },
  { name: "Education", value: 1200000 },
  { name: "Eating_Out", value: 900000 },
];

const DUMMY_DATA = {
  today: generateRandomData(DUMMY_DATA_BASE),
  last_week: generateRandomData(DUMMY_DATA_BASE),
  last_month: generateRandomData(DUMMY_DATA_BASE),
  "1_year": generateRandomData(DUMMY_DATA_BASE),
  all_time: generateRandomData(DUMMY_DATA_BASE),
};

const fetchExpenseDistribution = async (timeframe = "today") => {
  console.log(`Fetching expense distribution for timeframe: ${timeframe}`);
  await new Promise((resolve) => setTimeout(resolve, 300)); // Simulate network delay
  return DUMMY_DATA[timeframe];
};

function giveIconByCategory(category) {
  switch (category) {
    case "Rent":
      return (
        <div className="border-2 border-gray-300 rounded-full p-2">
          <House style={{ color: "#4B5563" }} className="w-4 h-4" />{" "}
          {/* Gray - represents shelter/home */}
        </div>
      );
    case "Loan_Repayment":
      return (
        <div className="border-2 border-gray-300 rounded-full p-2">
          <CircleDollarSign style={{ color: "#D97706" }} className="w-4 h-4" />{" "}
          {/* Amber - caution/debt */}
        </div>
      );
    case "Insurance":
      return (
        <div className="border-2 border-gray-300 rounded-full p-2">
          <ShieldPlus style={{ color: "#0EA5E9" }} className="w-4 h-4" />{" "}
          {/* Sky blue - safety and trust */}
        </div>
      );
    case "Groceries":
      return (
        <div className="border-2 border-gray-300 rounded-full p-2">
          <LeafyGreen style={{ color: "#22C55E" }} className="w-4 h-4" />{" "}
          {/* Green - fresh food */}
        </div>
      );
    case "Transport":
      return (
        <div className="border-2 border-gray-300 rounded-full p-2">
          <Bus style={{ color: "#3B82F6" }} className="w-4 h-4" />{" "}
          {/* Blue - mobility */}
        </div>
      );
    case "Eating":
      return (
        <div className="border-2 border-gray-300 rounded-full p-2">
          <Utensils style={{ color: "#F97316" }} className="w-4 h-4" />{" "}
          {/* Orange - food/warmth */}
        </div>
      );
    case "Eating_Out":
      return (
        <div className="border-2 border-gray-300 rounded-full p-2">
          <Soup style={{ color: "#EA580C" }} className="w-4 h-4" />{" "}
          {/* Deep orange - restaurants */}
        </div>
      );
    case "Entertainment":
      return (
        <div className="border-2 border-gray-300 rounded-full p-2">
          <Clapperboard style={{ color: "#8B5CF6" }} className="w-4 h-4" />{" "}
          {/* Violet - fun/creativity */}
        </div>
      );
    case "Utilities":
      return (
        <div className="border-2 border-gray-300 rounded-full p-2">
          <Wrench style={{ color: "#6B7280" }} className="w-4 h-4" />{" "}
          {/* Neutral gray - infrastructure */}
        </div>
      );
    case "Healthcare":
      return (
        <div className="border-2 border-gray-300 rounded-full p-2">
          <HeartPlus style={{ color: "#EF4444" }} className="w-4 h-4" />{" "}
          {/* Red - health */}
        </div>
      );
    case "Education":
      return (
        <div className="border-2 border-gray-300 rounded-full p-2">
          <GraduationCap style={{ color: "#6366F1" }} className="w-4 h-4" />{" "}
          {/* Indigo - wisdom */}
        </div>
      );
    default:
      return (
        <div className="border-2 border-gray-300 rounded-full p-1">
          <Info style={{ color: "#9CA3AF" }} className="w-4 h-4" />{" "}
          {/* Light gray - unknown */}
        </div>
      );
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

function ExpenseDistribution({ title = "Expense Distribution" }) {
  const [timeframe, setTimeframe] = useState("today");

  const {
    data: expenseData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["expenseDistribution", timeframe],
    queryFn: () => fetchExpenseDistribution(timeframe),
    staleTime: 5 * 60 * 1000,
    keepPreviousData: true,
  });

  const handleTimeframeChange = (selectedTimeframe) => {
    setTimeframe(selectedTimeframe);
  };

  if (isLoading && !expenseData) {
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

  const total = expenseData.reduce((acc, curr) => acc + curr.value, 0);
  const data = expenseData
    .map((item) => ({
      ...item,
      percentage: (item.value / total) * 100,
    }))
    .sort((a, b) => b.value - a.value);

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm relative">
      <div className="flex justify-between items-center">
        <div className="flex justify-between gap-2">
          <BanknoteArrowDown className="w-6 h-6 text-red-500" />
          <h2 className="text-xl font-bold text-gray-600">Expenses</h2>
        </div>
        <DateDropdown onSelect={handleTimeframeChange} />
      </div>
      <div
        className={`flex flex-row items-center justify-center h-[200px] w-full transition-opacity duration-300 ${
          isLoading ? "opacity-50" : "opacity-100"
        }`}
      >
        <div className="flex flex-col gap-3 mr-8 min-w-[120px] max-h-[200px] overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-gray-300 pr-2">
          {data.map((entry, index) => (
            <div key={entry.name} className="flex items-center gap-2">
              {giveIconByCategory(entry.name)}
              <div className="flex flex-col">
                <span
                  className="text-sm font-medium"
                  style={{ color: CATEGORY_COLORS[entry.name] || CATEGORY_COLORS.default }}
                >
                  {entry.name}
                </span>
                <span className="text-xs text-gray-500">
                  {entry.percentage.toFixed(1)}%
                </span>
              </div>
            </div>
          ))}
        </div>
        {/* Chart */}
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

export default ExpenseDistribution;
