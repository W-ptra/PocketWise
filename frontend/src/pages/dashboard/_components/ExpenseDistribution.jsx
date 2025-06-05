import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

function ExpenseDistribution({ data, title }) {
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
              <span
                className="inline-block w-4 h-4 rounded-sm"
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              ></span>
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
                innerRadius={60}
                outerRadius={80}
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
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default ExpenseDistribution;
