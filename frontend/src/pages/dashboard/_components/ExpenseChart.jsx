import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { ChartArea } from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import DateDropdown from "./DateDropdown";
import LoadingSpinner from "../../../components/LoadingSpinner";
import { getRequest } from "@/utils/api";
import { getToken } from "@/utils/localStorage";

const generateRandomChartData = (base) => {
  return base.map((item) => ({
    ...item,
    income: Math.round(item.income * (0.8 + Math.random() * 0.4)),
    expense: Math.round(item.expense * (0.8 + Math.random() * 0.4)),
  }));
};

const DUMMY_CHART_DATA_BASE = [
  { date: "01/05", income: 1500000, expense: 1200000 },
  { date: "05/05", income: 1800000, expense: 1400000 },
  { date: "10/05", income: 1600000, expense: 1100000 },
  { date: "15/05", income: 2000000, expense: 1600000 },
  { date: "20/05", income: 1900000, expense: 1300000 },
  { date: "25/05", income: 1700000, expense: 1500000 },
  { date: "30/05", income: 2100000, expense: 1250000 },
];

const DUMMY_DATA = {
  today: generateRandomChartData(DUMMY_CHART_DATA_BASE),
  last_week: generateRandomChartData(DUMMY_CHART_DATA_BASE),
  last_month: generateRandomChartData(DUMMY_CHART_DATA_BASE),
  "1_year": generateRandomChartData(DUMMY_CHART_DATA_BASE),
  all_time: generateRandomChartData(DUMMY_CHART_DATA_BASE),
};

const formatCurrency = (value) => {
  if (value >= 1000000) {
    return `Rp${(value / 1000000).toFixed(1)}M`;
  } else if (value >= 1000) {
    return `Rp${(value / 1000).toFixed(0)}K`;
  }
  return `Rp${value}`;
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const sortedPayload = [...payload].sort((a, b) => b.value - a.value);

    return (
      <div className="bg-white/90 backdrop-blur-sm p-3 rounded-lg shadow-lg border border-gray-200/50 text-sm">
        <p className="font-bold text-gray-800 mb-2">{label}</p>
        <div className="space-y-1">
          {sortedPayload.map((pld) => (
            <div
              key={pld.dataKey}
              className="flex items-center justify-between"
            >
              <div className="flex items-center">
                <span
                  className="w-2 h-2 rounded-full mr-2"
                  style={{ backgroundColor: pld.stroke }}
                ></span>
                <span className="text-gray-600 capitalize">{pld.dataKey}</span>
              </div>
              <span className="font-semibold text-gray-900 ml-4">
                {formatCurrency(pld.value)}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return null;
};

function formatChartData(data, timeframe) {
  if (timeframe === "today") {
    const hourlyData = {};
    // Create entries from 00:00 to 23:59
    for (let i = 0; i < 24; i++) {
      const hour = i.toString().padStart(2, "0");
      if (i === 23) {
        hourlyData[`${hour}:59`] = {
          createdAt: `${hour}:59`,
          income: 0,
          expense: 0,
        };
      } else {
        hourlyData[`${hour}:00`] = {
          createdAt: `${hour}:00`,
          income: 0,
          expense: 0,
        };
      }
    }

    // Fill in actual data
    data.forEach((transaction) => {
      const hour = new Date(transaction.createdAt)
        .getHours()
        .toString()
        .padStart(2, "0");
      const timeKey = hour === "23" ? `${hour}:59` : `${hour}:00`;
      if (hourlyData[timeKey]) {
        if (transaction.type === "Income") {
          hourlyData[timeKey].income += Number(transaction.amount);
        } else {
          hourlyData[timeKey].expense += Math.abs(Number(transaction.amount));
        }
      }
    });

    return Object.values(hourlyData);
  }

  // For other timeframes, just return the data as is for now
  return data;
}

const getTransactionData = async (type,timeRange) => {
  console.log(timeRange);
  let time = "";
  if(timeRange === "today"){
    time = "day";
  } else if(timeRange === "last_week"){
    time = "week";
  } else if(timeRange === "last_month"){
    time = "month";
  } else if(timeRange === "1_year"){
    time= "year";
  } else if(timeRange === "all_time"){
    time= "alltime";
  }
  const result = await getRequest(`api/transaction/${type}?timeRange=${time}`, getToken());
  
  return result.data;
}

function ExpenseChart() {
  const [timeframe, setTimeframe] = useState("today");
  const [visibility, setVisibility] = useState({
    income: true,
    expense: true,
  });
  const [activeFilter, setActiveFilter] = useState("All");

  const {
    data: chartData,
    isLoadingGraphData,
    isErrorGraphData,
    errorGraphData,
  } = useQuery({
    queryKey: ["expenseChart", timeframe, visibility],
    queryFn: async () => {
      const graphData = {};

      if (visibility.expense) {
        const expenseData = await getTransactionData("expenses", timeframe);
        graphData["expense"] = expenseData;
      }

      if (visibility.income) {
        const incomeData = await getTransactionData("income", timeframe);
        graphData["income"] = incomeData;
      }

      const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        const pad = (n) => n.toString().padStart(2, '0');

        const year = date.getFullYear();
        const month = pad(date.getMonth() + 1);
        const day = pad(date.getDate());
        const hour = pad(date.getHours());

        switch (timeframe) {
          case 'today':
            return `${year}/${month}/${day} ${hour}:00:00`;
          case 'last_week':
          case 'last_month':
            return `${year}/${month}/${day} 00:00:00`;
          case 'last_year':
          case 'all_time':
            return `${year}/${month}/01 00:00:00`; // Month bucket on day 01
          default:
            return `${year}/${month}/${day} 00:00:00`;
        }
      };

      const aggregatedData = {};

      const addToAggregation = (type, data) => {
        for (const item of data) {
          const dateKey = formatDate(item.createdAt);
          const amount = parseFloat(item.amount);

          if (!aggregatedData[dateKey]) {
            aggregatedData[dateKey] = { date: dateKey };
          }

          if (!aggregatedData[dateKey][type]) {
            aggregatedData[dateKey][type] = 0;
          }

          aggregatedData[dateKey][type] += amount;
        }
      };

      if (graphData.expense) {
        addToAggregation('expense', graphData.expense);
      }

      if (graphData.income) {
        addToAggregation('income', graphData.income);
      }

      if (visibility.expense && visibility.income) {
        for (const key in aggregatedData) {
          if (!aggregatedData[key].expense) {
            aggregatedData[key].expense = 0;
          }
          if (!aggregatedData[key].income) {
            aggregatedData[key].income = 0;
          }
        }
      }

      const parseDateKey = (dateKey) => {
        // Format: YYYY:MM:DD HH:MM:SS
        const [datePart, timePart] = dateKey.split(' ');
        const [year, month, day] = datePart.split(':').map(Number);
        const [hour, minute, second] = timePart.split(':').map(Number);
        return new Date(year, month - 1, day, hour, minute, second);
      };

      const finalData = Object.values(aggregatedData).sort((a, b) => {
        return parseDateKey(a.date) - parseDateKey(b.date);
      });

      console.log("aaaaaaaaaaaaaaaaaaaaaaaaa");
      console.log(DUMMY_DATA[timeframe])
      console.log(finalData);
      return finalData;
    },



  });

  const handleTimeframeChange = (selectedTimeframe) => {
    setTimeframe(selectedTimeframe);
  };

  const formatYAxis = (value) => {
    if (value >= 1000000) {
      return `Rp${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `Rp${(value / 1000).toFixed(0)}K`;
    }
    return value;
  };

  const handleFilterClick = (filter) => {
    setActiveFilter(filter);
    setVisibility({
      income: filter === "All" || filter === "Income",
      expense: filter === "All" || filter === "Expense",
    });
  };

  const getButtonClass = (filter) => {
    const baseClass =
      "px-4 py-2 rounded-md font-semibold text-sm transition-all duration-200 cursor-pointer";
    if (activeFilter === filter) {
      switch (filter) {
        case "All":
          return `${baseClass} bg-gray-700 text-white shadow`;
        case "Income":
          return `${baseClass} bg-[#00AB6B] text-white shadow`;
        case "Expense":
          return `${baseClass} bg-[#FF6B6B] text-white shadow`;
      }
    }
    return `${baseClass} bg-transparent text-gray-600 hover:bg-gray-200`;
  };

  // if (isError) {
  //   return (
  //     <div className="bg-white p-6 rounded-xl shadow-sm h-[458px] flex justify-center items-center">
  //       <p className="text-red-500">Error loading data: {error.message}</p>
  //     </div>
  //   );
  // }

  const isLoading = false;

  return (
    <div
      className={`bg-white p-6 rounded-xl shadow-sm transition-opacity duration-300 ${
        isLoading ? "opacity-50" : "opacity-100"
      }`}
    >
      <div className="flex justify-between items-center mb-6">
        <div className="flex justify-between gap-2">
          <div className="bg-orange-50 p-2 rounded-lg">
            <ChartArea className="w-6 h-6 text-orange-300" />
          </div>
          <h2 className="text-xl font-bold text-gray-600 mt-2">Analytics</h2>
        </div>
        <DateDropdown onSelect={handleTimeframeChange} />
      </div>

      {isLoading && (
        <div className="bg-white p-6 rounded-xl shadow-sm flex justify-center items-center">
          <LoadingSpinner />
        </div>
      )}

      <div className="h-[350px] w-full">
        {chartData && (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#e0e0e0"
                vertical={false}
              />
              <XAxis
                dataKey="createdAt"
                axisLine={false}
                tickLine={false}
                dy={10}
                tick={{ fontSize: 12, fill: "#6b7280" }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tickFormatter={formatYAxis}
                tick={{ fontSize: 12, fill: "#6b7280" }}
                dx={-10}
                width={50}
              />
              <Tooltip
                cursor={{
                  stroke: "#00AB6B",
                  strokeWidth: 1,
                  strokeDasharray: "3 3",
                }}
                content={<CustomTooltip />}
              />
              {visibility.income && (
                <Line
                  type="linear"
                  dataKey="income"
                  stroke="#00AB6B"
                  strokeWidth={2.5}
                  dot={false}
                  activeDot={{
                    r: 6,
                    strokeWidth: 2,
                    fill: "#00AB6B",
                    stroke: "#fff",
                  }}
                />
              )}
              {visibility.expense && (
                <Line
                  type="linear"
                  dataKey="expense"
                  stroke="#FF6B6B"
                  strokeWidth={2.5}
                  dot={false}
                  activeDot={{
                    r: 6,
                    strokeWidth: 2,
                    fill: "#FF6B6B",
                    stroke: "#fff",
                  }}
                />
              )}
              {visibility.investment && (
                <Line
                  type="linear"
                  dataKey="investment"
                  stroke="#FFB86B"
                  strokeWidth={2.5}
                  dot={false}
                  activeDot={{
                    r: 6,
                    strokeWidth: 2,
                    fill: "#FFB86B",
                    stroke: "#fff",
                  }}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="flex justify-center items-center mt-4">
        <div className="flex gap-2 p-1 bg-gray-100 rounded-lg">
          <button
            onClick={() => handleFilterClick("All")}
            className={getButtonClass("All")}
          >
            All
          </button>
          <button
            onClick={() => handleFilterClick("Income")}
            className={getButtonClass("Income")}
          >
            Income
          </button>
          <button
            onClick={() => handleFilterClick("Expense")}
            className={getButtonClass("Expense")}
          >
            Expense
          </button>
        </div>
      </div>
    </div>
  );
}

export default ExpenseChart;
