import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { Utensils, Pizza, Coins, Info } from "lucide-react";

function giveIconByCategory(category, color) {
    switch (category) {
        case "Kebutuhan pokok":
            return (
                <div className="border-2 border-gray-300 rounded-full p-2">
                    <Utensils style={{ color }} className="w-4 h-4" />
                </div>
            );
        case "Jajan":
            return (
                <div className="border-2 border-gray-300 rounded-full p-2">
                    <Pizza style={{ color }} className="w-4 h-4" />
                </div>
            );
        case "Investasi":
            return (
                <div className="border-2 border-gray-300 rounded-full p-2">
                    <Coins style={{ color }} className="w-4 h-4" />
                </div>
            );
        case "Lainnya":
            return (
                <div className="border-2 border-gray-300 rounded-full p-2">
                    <Info style={{ color }} className="w-4 h-4" />
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

function ComparisonPieChart({ data, title }) {
  const COLORS = ["#00AB6B", "#FFB86B", "#FF6B6B", "#4ECDC4"];

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-gray-600 font-bold text-xl">{title}</h2>
      </div>
      <div className="flex flex-row items-center justify-center h-[200px] w-full">
        <div className="flex flex-col gap-4 mr-8 min-w-[120px]">
          {data.map((entry, index) => (
            <div key={entry.name} className="flex items-center gap-2">
              {giveIconByCategory(entry.name, COLORS[index % COLORS.length])}
              <span
                className="text-sm font-medium"
                style={{ color: COLORS[index % COLORS.length] }}
              >
                {entry.name}
              </span>
            </div>
          ))}
        </div>
        {/* Chart */}
        <div className="flex-1 h-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart className="w-full h-full flex justify-center items-center">
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                outerRadius={90}
                paddingAngle={1}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default ComparisonPieChart;
