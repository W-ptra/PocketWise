import {
  Bus,
  CircleDollarSign,
  Clapperboard,
  GraduationCap,
  HeartPlus,
  House,
  Info,
  LeafyGreen,
  Plus,
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

// Dummy data for development
const DUMMY_DATA = [
  { name: "Rent", value: 2500000 },
  { name: "Groceries", value: 1800000 },
  { name: "Transport", value: 800000 },
  { name: "Entertainment", value: 500000 },
  { name: "Utilities", value: 750000 },
  { name: "Healthcare", value: 400000 },
  { name: "Education", value: 1200000 },
  { name: "Eating_Out", value: 900000 },
];

function giveIconByCategory(category, color) {
  switch (category) {
    case "Rent":
      return (
        <div className="border-2 border-gray-300 rounded-full p-2">
          <House style={{ color }} className="w-4 h-4" />
        </div>
      );
    case "Loan_Repayment":
      return (
        <div className="border-2 border-gray-300 rounded-full p-2">
          <CircleDollarSign style={{ color }} className="w-4 h-4" />
        </div>
      );
    case "Insurance":
      return (
        <div className="border-2 border-gray-300 rounded-full p-2">
          <ShieldPlus style={{ color }} className="w-4 h-4" />
        </div>
      );
    case "Groceries":
      return (
        <div className="border-2 border-gray-300 rounded-full p-2">
          <LeafyGreen style={{ color }} className="w-4 h-4" />
        </div>
      );
    case "Transport":
      return (
        <div className="border-2 border-gray-300 rounded-full p-2">
          <Bus style={{ color }} className="w-4 h-4" />
        </div>
      );
    case "Eating":
      return (
        <div className="border-2 border-gray-300 rounded-full p-2">
          <Utensils style={{ color }} className="w-4 h-4" />
        </div>
      );
    case "Eating_Out":
      return (
        <div className="border-2 border-gray-300 rounded-full p-2">
          <Soup style={{ color }} className="w-4 h-4" />
        </div>
      );
    case "Entertainment":
      return (
        <div className="border-2 border-gray-300 rounded-full p-2">
          <Clapperboard style={{ color }} className="w-4 h-4" />
        </div>
      );
    case "Utilities":
      return (
        <div className="border-2 border-gray-300 rounded-full p-2">
          <Wrench style={{ color }} className="w-4 h-4" />
        </div>
      );
    case "Healthcare":
      return (
        <div className="border-2 border-gray-300 rounded-full p-2">
          <HeartPlus style={{ color }} className="w-4 h-4" />
        </div>
      );
    case "Education":
      return (
        <div className="border-2 border-gray-300 rounded-full p-2">
          <GraduationCap style={{ color }} className="w-4 h-4" />
        </div>
      );
    default:
      return (
        <div className="border-2 border-gray-300 rounded-full p-1">
          <Info style={{ color }} className="w-4 h-4" />
        </div>
      );
  }
}

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-3 shadow-lg rounded-lg border border-gray-200">
        <p className="font-semibold text-gray-800">{data.name}</p>
        <p className="text-[#00AB6B]">
          Amount:{" "}
          {new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
          }).format(data.value)}
        </p>
        <p className="text-gray-600">{data.percentage.toFixed(1)}% of total</p>
      </div>
    );
  }
  return null;
};

function ExpenseDistribution({ title = "Expense Distribution" }) {
  const COLORS = [
    "#00AB6B",
    "#FFB86B",
    "#FF6B6B",
    "#4ECDC4",
    "#845EC2",
    "#D65DB1",
    "#FF9671",
    "#FFC75F",
    "#F9F871",
  ];

  // Process dummy data to include percentages
  const total = DUMMY_DATA.reduce((acc, curr) => acc + curr.value, 0);
  const data = DUMMY_DATA.map((item) => ({
    ...item,
    percentage: (item.value / total) * 100,
  })).sort((a, b) => b.value - a.value); // Sort by value in descending order

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm max-h-[325px] relative">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-gray-600 font-bold text-xl">{title}</h2>
        <div className="flex flex-row gap-2 absolute top-6 right-6">
          <button className="bg-[#00AB6B] text-white px-4 py-2 rounded-lg hover:bg-[#00CF81] transition-colors duration-200 border border-gray-300 cursor-pointer">
            Today
          </button>
          <button className="border-1 border-gray-300 text-[#00AB6B] px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors duration-200 border border-gray-300 cursor-pointer">
            Yesterday
          </button>
        </div>
      </div>
      <div className="flex flex-row items-center justify-center h-[200px] w-full">
        <div className="flex flex-col gap-3 mr-8 min-w-[120px] max-h-[200px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 pr-2">
          {data.map((entry, index) => (
            <div key={entry.name} className="flex items-center gap-2">
              {giveIconByCategory(entry.name, COLORS[index % COLORS.length])}
              <div className="flex flex-col">
                <span
                  className="text-sm font-medium"
                  style={{ color: COLORS[index % COLORS.length] }}
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
                    fill={COLORS[index % COLORS.length]}
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
