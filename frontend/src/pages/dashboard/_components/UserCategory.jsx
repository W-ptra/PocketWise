import { CircleUser, Sparkles, Target, Wallet, LineChart, Crown, Star, Rocket } from 'lucide-react'
import { useState } from 'react'

const categories = {
    "Overspender": {
        "name": "The Overspender",
        "description": "Your expenses frequently exceed your income. Consider creating a budget and tracking your spending more closely to improve your financial health.",
        "icon": "💸",
        "color": "red-500",
        "starColor": "#EF4444",
        "expBarClass": "bg-red-500",
        "bgGradient": "from-red-50 via-white to-red-50",
        "tips": ["Create a monthly budget", "Track daily expenses", "Identify non-essential spending"],
        "level": 1
    },
    "Savvy Saver": {
        "name": "The Savvy Saver",
        "description": "You maintain a healthy savings habit and consistently spend less than you earn. Keep up the great work!",
        "icon": "💰",
        "color": "green-500",
        "starColor": "#10B981",
        "expBarClass": "bg-green-500",
        "bgGradient": "from-emerald-50 via-white to-emerald-50",
        "tips": ["Consider investment options", "Set bigger financial goals", "Maintain emergency fund"],
        "level": 4
    },
    "Balanced": {
        "name": "The Balanced Spender",
        "description": "You maintain a good balance between spending and saving. Your financial habits show responsible money management.",
        "icon": "⚖️",
        "color": "blue-500",
        "starColor": "#3B82F6",
        "expBarClass": "bg-blue-500",
        "bgGradient": "from-[#E7F6F3] via-white to-[#E7F6F3]",
        "tips": ["Look for ways to increase savings", "Review monthly spending patterns", "Set specific financial goals"],
        "level": 3
    },
    "Beginner": {
        "name": "The Financial Beginner",
        "description": "You're just starting your financial journey. Focus on building good spending habits and start tracking your expenses regularly.",
        "icon": "🌱",
        "color": "yellow-500",
        "starColor": "#F59E0B",
        "expBarClass": "bg-yellow-500",
        "bgGradient": "from-amber-50 via-white to-amber-50",
        "tips": ["Start with small savings goals", "Learn budgeting basics", "Track all expenses"],
        "level": 2
    }
}

const UserCategory = () => {
  const [showTips, setShowTips] = useState(false);
  const userCategory = categories["Beginner"];

  return (
    <div className="relative bg-gradient-to-br from-white via-[#F8FDFB] to-white p-6 rounded-xl shadow-sm h-full overflow-hidden border border-[#00AB6B]/10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,#00AB6B_1px,transparent_1px)] [background-size:20px_20px] opacity-[0.03]" />
      
      <div className="absolute top-4 right-4 w-24 h-24 bg-gradient-to-br from-[#00AB6B]/5 to-transparent rounded-full blur-xl animate-pulse" />
      <div className="absolute bottom-4 left-4 w-32 h-32 bg-gradient-to-tr from-[#4ECDC4]/5 to-transparent rounded-full blur-xl animate-pulse delay-700" />

      <div className="relative z-10">
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-2 items-center">
            <div className="bg-[#00AB6B]/10 p-2 rounded-lg animate-pulse">
              <Crown className="w-5 h-5 text-[#00AB6B]" />
            </div>
            <h2 className="text-gray-700 font-bold text-xl">Financial Profile</h2>
          </div>
          <div className="flex items-center gap-2 bg-amber-50/50 px-3 py-1 rounded-full border border-amber-100">
            <Star className={`w-4 h-4 text-[${userCategory.starColor}] fill-[${userCategory.starColor}]`} />
            <span className={`text-xs font-medium text-[${userCategory.starColor}]`}>Level {userCategory.level}</span>
          </div>
        </div>

        <div className={`bg-gradient-to-br ${userCategory.bgGradient} rounded-2xl p-6 mb-4 border border-gray-100 relative group hover:border-[#00AB6B]/20 transition-colors duration-300`}>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,#00AB6B_1px,transparent_1px)] [background-size:16px_16px] opacity-0 group-hover:opacity-[0.03] transition-opacity duration-300" />
          <div className="relative">
            <div className="flex items-center gap-4 mb-3">
              <div className="bg-white p-3 rounded-xl shadow-sm relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-white/80 to-transparent" />
                <span className="text-3xl relative z-10">{userCategory.icon}</span>
              </div>
              <div>
                <h3 className={`text-lg font-bold text-${userCategory.color}`}>
                  {userCategory.name}
                </h3>
                <div className="flex items-center gap-1 mt-1">
                  <div className={`w-20 h-1.5 rounded-full ${userCategory.expBarClass}`} />
                  <div className="w-8 h-1.5 rounded-full bg-gray-200" />
                  <div className="w-8 h-1.5 rounded-full bg-gray-200" />
                </div>
              </div>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed">
              {userCategory.description}
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {showTips && (
            <div className="space-y-2 mb-4">
              {userCategory.tips.map((tip, index) => (
                <div key={index} 
                  className="flex items-center gap-3 bg-white p-3 rounded-lg border border-gray-100 hover:border-[#00AB6B]/20 transition-all duration-200 hover:shadow-sm group"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-[#00AB6B] group-hover:scale-125 transition-transform duration-200" />
                  <p className="text-sm text-gray-600">{tip}</p>
                </div>
              ))}
            </div>
          )}

          <button
            onClick={() => setShowTips(!showTips)}
            className="w-full group relative bg-[#00AB6B] hover:bg-[#00AB6B]/90 text-white font-semibold px-4 py-3 rounded-xl shadow-sm hover:shadow transition-all duration-200 flex items-center justify-center gap-2 overflow-hidden"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,#fff_1px,transparent_1px)] [background-size:10px_10px] opacity-0 group-hover:opacity-[0.05] transition-opacity duration-200 cursor-pointer" />
            <Rocket className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
            {showTips ? 'Hide Growth Tips' : 'View Growth Tips'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default UserCategory