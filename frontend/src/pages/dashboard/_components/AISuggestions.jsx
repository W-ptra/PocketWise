import { getRequest } from "@/utils/api";
import { getToken } from "@/utils/localStorage";
import { Sparkles, WandSparkles, CircleAlert, ThumbsUp, Info, TrendingUp, Lightbulb, PiggyBank } from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

const getAiSuggestion = async () => {
  const result = await getRequest("api/ai/journal/suggestion",getToken());
  console.log(result);
  return result.data.data;
}

function AISuggestions() {
  const [likedStates, setLikedStates] = useState({
    eating: false,
    savings: false,
    investment: false
  });
  const [showTooltip, setShowTooltip] = useState(false);

    const {
      data: aiSuggestion = {},
      isLoadingGraphData,
      isErrorGraphData,
      errorGraphData,
    } = useQuery({
      queryKey: ["expenseChart", "suggestion"],
      queryFn: async () => {
        const result = await getAiSuggestion();
        console.log(result);
        return result;
      }
    });

  const handleLike = (key) => {
    setLikedStates(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <div className="relative bg-white p-6 rounded-xl shadow-sm flex flex-col h-full">
      <div className="pointer-events-none absolute inset-0 z-0">
        <Sparkles className="absolute top-4 left-4 w-8 h-8 text-[#00AB6B]/10 animate-pulse" />
        <Sparkles className="absolute bottom-6 right-10 w-6 h-6 text-[#FFB86B]/10 animate-pulse delay-200" />
        <Sparkles className="absolute top-1/2 right-2 w-5 h-5 text-[#4ECDC4]/10 animate-pulse delay-500" />
      </div>
      <div className="absolute right-0 top-0 h-full w-2 bg-gradient-to-b from-[#00AB6B] via-[#4ECDC4] to-[#FFB86B] rounded-r-xl z-10" />
      
      <div className="flex-1 pr-3 z-10">
        <h2 className="text-gray-600 font-bold text-lg flex items-center gap-2 mb-2">
          <Sparkles className="w-5 h-5 text-[#00AB6B] animate-pulse" />
          AI Analysis & Suggestions
          <span className="bg-gradient-to-r from-[#00AB6B] to-[#4ECDC4] text-white text-xs font-bold px-2 py-0.5 rounded-full shadow animate-bounce">NEW</span>
        </h2>
        
        <div className="flex flex-col gap-2">
          <div className="bg-[#F8FDFB] border border-[#00AB6B]/20 rounded-xl px-3 py-2 shadow-sm">
            <div className="flex items-start gap-2">
              <Lightbulb className="w-5 h-5 text-[#00AB6B] mt-0.5 shrink-0" />
              <p className="text-gray-800 text-sm">
                {aiSuggestion.tip ? aiSuggestion.tip : "" }
              </p>
            </div>
            <div className="flex items-center gap-2 mt-1.5 ml-7">
              <span className="text-xs text-gray-400">AI Tip • Just now</span>
              <button
                className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-lg transition-colors duration-200 cursor-pointer ${likedStates.eating ? 'bg-[#00AB6B]/10 text-[#00AB6B]' : 'hover:bg-gray-100 text-gray-400'}`}
                onClick={() => handleLike('eating')}
                aria-label="Like this suggestion"
              >
                <ThumbsUp className={`w-3.5 h-3.5 ${likedStates.eating ? 'fill-[#00AB6B] text-[#00AB6B]' : ''}`} />
                {likedStates.eating ? 'Liked' : 'Like'}
              </button>
            </div>
          </div>

          <div className="bg-[#F8FDFB] border border-[#00AB6B]/20 rounded-xl px-3 py-2 shadow-sm">
            <div className="flex items-start gap-2">
              <TrendingUp className="w-5 h-5 text-[#4ECDC4] mt-0.5 shrink-0" />
              <p className="text-gray-800 text-sm">
                {aiSuggestion.insight ? aiSuggestion.insight : "" }
              </p>
            </div>
            <div className="flex items-center gap-2 mt-1.5 ml-7">
              <span className="text-xs text-gray-400">AI Insight • 2h ago</span>
              <button
                className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-lg transition-colors duration-200 cursor-pointer ${likedStates.savings ? 'bg-[#00AB6B]/10 text-[#00AB6B]' : 'hover:bg-gray-100 text-gray-400'}`}
                onClick={() => handleLike('savings')}
                aria-label="Like this suggestion"
              >
                <ThumbsUp className={`w-3.5 h-3.5 ${likedStates.savings ? 'fill-[#00AB6B] text-[#00AB6B]' : ''}`} />
                {likedStates.savings ? 'Liked' : 'Like'}
              </button>
            </div>
          </div>

          <div className="bg-[#F8FDFB] border border-[#FFB86B]/20 rounded-xl px-3 py-2 shadow-sm">
            <div className="flex items-start gap-2">
              <PiggyBank className="w-5 h-5 text-[#FFB86B] mt-0.5 shrink-0" />
              <p className="text-gray-800 text-sm">
                {aiSuggestion.investment ? aiSuggestion.investment : "" }
              </p>
            </div>
            <div className="flex items-center gap-2 mt-1.5 ml-7">
              <span className="text-xs text-gray-400">AI Investment Tip • 5h ago</span>
              <button
                className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-lg transition-colors duration-200 cursor-pointer ${likedStates.investment ? 'bg-[#00AB6B]/10 text-[#00AB6B]' : 'hover:bg-gray-100 text-gray-400'}`}
                onClick={() => handleLike('investment')}
                aria-label="Like this suggestion"
              >
                <ThumbsUp className={`w-3.5 h-3.5 ${likedStates.investment ? 'fill-[#00AB6B] text-[#00AB6B]' : ''}`} />
                {likedStates.investment ? 'Liked' : 'Like'}
              </button>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mt-1">
            <div className="flex items-center gap-1.5 text-gray-600 text-xs relative">
              <CircleAlert className="w-3.5 h-3.5 opacity-50" />
              <span
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
                className="underline cursor-help opacity-50"
              >
                This is just AI Analytics and Suggestions
              </span>
              {showTooltip && (
                <div className="absolute left-0 bottom-6 bg-white border border-gray-200 rounded-lg shadow-lg p-2 text-xs text-gray-700 w-56 z-20">
                  Our AI provides personalized financial tips based on your data, but you are always in control of your decisions.
                </div>
              )}
            </div>
            <button className="w-full sm:w-auto bg-gradient-to-r from-[#00AB6B] to-[#4ECDC4] text-white font-medium text-sm px-3 py-1.5 rounded-lg shadow hover:from-[#00CF81] hover:to-[#6EE7B7] transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer">
              <WandSparkles className="w-4 h-4" />
              Ask AI for more tips
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AISuggestions;
