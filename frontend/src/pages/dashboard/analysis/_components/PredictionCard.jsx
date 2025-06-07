import { Brain, TrendingUp, AlertTriangle, Calendar, Clock, ChevronRight, Bot, ArrowUp, ArrowDown } from "lucide-react";

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

const PredictionCard = ({ predictions = {} }) => {
  // Sample predictions if none provided
  const samplePredictions = {
    tomorrow: {
      model_prediction: {
        expected_spending: 850000,
        confidence: 85,
        trend: "increase",
        categories: ["Food", "Transportation"],
        percentage_change: 15
      },
      llm_insight: {
        summary: "Our AI predicts a 15% increase in spending tomorrow, primarily in Food and Transportation categories.",
        explanation: "This prediction is based on your historical Wednesday spending patterns and two scheduled payments.",
        recommendations: [
          "Consider preparing meals at home tomorrow",
          "Review your scheduled payments",
          "Use public transportation if possible"
        ]
      }
    },
    nextMonth: {
      model_prediction: {
        expected_spending: 2450000,
        confidence: 92,
        trend: "increase",
        categories: ["Entertainment", "Subscriptions"],
        percentage_change: 25
      },
      llm_insight: {
        summary: "A significant 25% increase in monthly expenses is predicted, mainly due to Entertainment and Subscription costs.",
        explanation: "The model has identified multiple subscription renewals and an upward trend in entertainment spending.",
        recommendations: [
          "Audit your subscription services",
          "Create a dedicated entertainment budget",
          "Consider annual subscription plans for better rates"
        ]
      }
    }
  };

  const predictions_data = Object.keys(predictions).length > 0 ? predictions : samplePredictions;

  const PredictionSection = ({ title, icon: Icon, data, colorClass }) => (
    <div className={`p-6 rounded-xl bg-white border-l-4 ${colorClass}`}>
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className={`p-2 rounded-lg ${colorClass.replace('border-l-', 'bg-')}/10`}>
          <Icon className={`w-5 h-5 ${colorClass.replace('border-l-', 'text-')}`} />
        </div>
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      </div>

      {/* Model Prediction */}
      <div className="mb-6 p-4 rounded-lg bg-gray-50">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Brain className="w-4 h-4 text-gray-500" />
            <p className="font-medium text-gray-800">Model Prediction</p>
          </div>
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${colorClass.replace('border-l-', 'bg-')}/10 ${colorClass.replace('border-l-', 'text-')}`}>
            {data.model_prediction.confidence}% confidence
          </div>
        </div>
        
        <div className="flex items-center gap-4 mb-3">
          <div>
            <p className="text-sm text-gray-500">Expected Spending</p>
            <p className="text-xl font-bold text-gray-800">
              {formatCurrency(data.model_prediction.expected_spending)}
            </p>
          </div>
          <div className={`flex items-center gap-1 ${
            data.model_prediction.trend === 'increase' ? 'text-red-500' : 'text-green-500'
          }`}>
            {data.model_prediction.trend === 'increase' ? 
              <ArrowUp className="w-4 h-4" /> : 
              <ArrowDown className="w-4 h-4" />
            }
            <span>{data.model_prediction.percentage_change}%</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {data.model_prediction.categories.map((category, index) => (
            <span 
              key={index}
              className={`px-2 py-1 rounded-full text-xs font-medium ${colorClass.replace('border-l-', 'bg-')}/10 ${colorClass.replace('border-l-', 'text-')}`}
            >
              {category}
            </span>
          ))}
        </div>
      </div>

      {/* LLM Insights */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-3">
          <Bot className="w-4 h-4 text-gray-500" />
          <p className="font-medium text-gray-800">AI Analysis</p>
        </div>
        
        <p className="text-gray-700">{data.llm_insight.summary}</p>
        <p className="text-sm text-gray-600">{data.llm_insight.explanation}</p>
        
        <div className="mt-4">
          <p className="text-sm font-medium text-gray-800 mb-2">Recommended Actions:</p>
          <ul className="space-y-2">
            {data.llm_insight.recommendations.map((recommendation, index) => (
              <li key={index} className="flex items-center gap-2 text-gray-600">
                <div className={`w-1.5 h-1.5 rounded-full ${colorClass.replace('border-l-', 'bg-')}`} />
                {recommendation}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-gray-100 rounded-xl p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-indigo-100 p-2 rounded-lg">
          <Brain className="w-5 h-5 text-indigo-600" />
        </div>
        <h2 className="text-xl font-bold text-gray-800">AI-Powered Predictions</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <PredictionSection
          title="Tomorrow's Prediction"
          icon={Clock}
          data={predictions_data.tomorrow}
          colorClass="border-l-orange-500"
        />
        <PredictionSection
          title="Next Month's Prediction"
          icon={Calendar}
          data={predictions_data.nextMonth}
          colorClass="border-l-purple-500"
        />
      </div>

      <div className="mt-6 flex items-center justify-between text-sm text-gray-500">
        <p className="italic">Predictions powered by Machine Learning and analyzed by AI</p>
      </div>
    </div>
  );
};

export default PredictionCard;
