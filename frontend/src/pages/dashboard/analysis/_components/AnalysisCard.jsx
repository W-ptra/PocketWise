import { Lightbulb, TrendingUp, AlertCircle, Clock, Calendar } from "lucide-react";

const AnalysisCard = ({ name = "Analysis", insights = [] }) => {
  // Sample insights if none provided
  const sampleInsights = insights.length > 0 ? insights : [
    {
      type: "highlight",
      text: "Your food expenses have been consistently high this month. Consider meal planning to reduce costs.",
      priority: "high"
    },
    {
      type: "positive",
      text: "Great job on reducing entertainment spending! You've saved 20% compared to last month.",
      priority: "medium"
    },
    {
      type: "tip",
      text: "Setting up automatic transfers to your savings account could help you reach your goals faster.",
      priority: "low"
    }
  ];

  const isDaily = name.toLowerCase().includes('today') || name.toLowerCase().includes('daily');

  const getInsightIcon = (type) => {
    switch (type) {
      case "highlight":
        return <AlertCircle className="w-5 h-5 text-amber-500" />;
      case "positive":
        return <TrendingUp className="w-5 h-5 text-[#00AB6B]" />;
      case "tip":
        return <Lightbulb className="w-5 h-5 text-blue-500" />;
      default:
        return <Lightbulb className="w-5 h-5 text-[#00AB6B]" />;
    }
  };

  const getInsightStyle = (type) => {
    if (isDaily) {
      switch (type) {
        case "highlight":
          return "bg-orange-50 border-l-orange-500";
        case "positive":
          return "bg-teal-50 border-l-teal-500";
        case "tip":
          return "bg-sky-50 border-l-sky-500";
        default:
          return "bg-gray-50 border-l-gray-500";
      }
    } else {
      switch (type) {
        case "highlight":
          return "bg-purple-50 border-l-purple-500";
        case "positive":
          return "bg-emerald-50 border-l-emerald-500";
        case "tip":
          return "bg-indigo-50 border-l-indigo-500";
        default:
          return "bg-gray-50 border-l-gray-500";
      }
    }
  };

  return (
    <div className={`relative bg-white p-6 rounded-xl shadow-sm flex flex-col h-full transition-all duration-300 hover:shadow-md 
      ${isDaily ? 'border-t-4 border-t-orange-500' : 'border-t-4 border-t-purple-500'}`}>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className={`p-2 rounded-lg ${
          isDaily ? 'bg-orange-100' : 'bg-purple-100'
        }`}>
          {isDaily ? (
            <Clock className={`w-5 h-5 ${isDaily ? 'text-orange-500' : 'text-purple-500'}`} />
          ) : (
            <Calendar className={`w-5 h-5 ${isDaily ? 'text-orange-500' : 'text-purple-500'}`} />
          )}
        </div>
        <h2 className="text-xl font-bold text-gray-800">{name}</h2>
      </div>

      {/* Insights */}
      <div className="space-y-4 flex-grow">
        {sampleInsights.map((insight, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg border-l-4 transition-all duration-300 hover:translate-x-1 ${getInsightStyle(insight.type)}`}
          >
            <div className="flex gap-3">
              <div className="mt-1">{getInsightIcon(insight.type)}</div>
              <p className="text-gray-700 leading-relaxed">
                {insight.text}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-6 pt-4 border-t border-gray-100">
        <p className={`text-sm italic ${isDaily ? 'text-orange-600/60' : 'text-purple-600/60'}`}>
          {isDaily ? "Based on today's activities" : "Based on this month's data"}
        </p>
      </div>
    </div>
  );
};

export default AnalysisCard;