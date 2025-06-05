import { Sparkles, WandSparkles, CircleAlert, ThumbsUp, Info } from "lucide-react";
import { useState } from "react";

function AISuggestions() {
  const [liked, setLiked] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="relative bg-white p-6 rounded-xl shadow-lg flex overflow-hidden min-h-[220px]">
      <div className="pointer-events-none absolute inset-0 z-0">
        <Sparkles className="absolute top-4 left-8 w-8 h-8 text-[#00AB6B]/10 animate-pulse" />
        <Sparkles className="absolute bottom-6 right-10 w-6 h-6 text-[#FFB86B]/10 animate-pulse delay-200" />
        <Sparkles className="absolute top-1/2 right-2 w-5 h-5 text-[#4ECDC4]/10 animate-pulse delay-500" />
      </div>
      <div className="absolute left-0 top-0 h-full w-2 bg-gradient-to-b from-[#00AB6B] via-[#4ECDC4] to-[#FFB86B] rounded-l-xl z-10" />
      <div className="flex-1 pl-6 z-10">
        <h2 className="text-gray-700 font-bold text-xl flex items-center gap-2 mb-2">
          <Sparkles className="w-6 h-6 text-[#00AB6B] animate-pulse" />
          AI Analysis & Suggestions
          <span className="bg-gradient-to-r from-[#00AB6B] to-[#4ECDC4] text-white text-xs font-bold px-2 py-0.5 rounded-full shadow animate-bounce">NEW</span>
        </h2>
        <div className="flex flex-col gap-4 mt-2">
          <div className="flex items-start gap-3">
            <div className="relative bg-[#F8FDFB] border border-[#00AB6B]/20 rounded-2xl px-5 py-4 shadow-sm flex-1">
              <p className="text-gray-800 font-medium">
                You spent <span className="text-[#FF6B6B] font-bold">9.1%</span> of your income on <span className="font-bold">Eating Out</span> this month. Try cooking at home 2x a week to save up to <span className="text-[#00AB6B] font-bold">Rp900.153</span>!
              </p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs text-gray-400">AI Tip • Just now</span>
                <button
                  className={`ml-2 flex items-center gap-1 text-xs px-2 py-1 rounded-lg transition-colors duration-200 cursor-pointer ${liked ? 'bg-[#00AB6B]/10 text-[#00AB6B]' : 'hover:bg-gray-100 text-gray-400'}`}
                  onClick={() => setLiked(l => !l)}
                  aria-label="Like this suggestion"
                >
                  <ThumbsUp className={`w-4 h-4 ${liked ? 'fill-[#00AB6B] text-[#00AB6B]' : ''}`} />
                  {liked ? 'Liked' : 'Like'}
                </button>
              </div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row justify-between items-center mt-2 gap-2">
            <div className="flex items-center gap-2 text-gray-600 text-sm relative">
              <CircleAlert className="w-4 h-4 opacity-50" />
              <span
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
                className="underline cursor-help opacity-50"
              >
                This is just AI Analytics and Suggestions
              </span>
              {showTooltip && (
                <div className="absolute left-0 bottom-8 bg-white border border-gray-200 rounded-lg shadow-lg p-3 text-xs text-gray-700 w-64 z-20">
                  Our AI provides personalized financial tips based on your data, but you are always in control of your decisions. Use your own judgment for important choices!
                </div>
              )}
            </div>
            <button className="mt-2 sm:mt-0 bg-gradient-to-r from-[#00AB6B] to-[#4ECDC4] text-white font-semibold px-5 py-2 rounded-lg shadow hover:from-[#00CF81] hover:to-[#6EE7B7] transition-all duration-200 flex items-center gap-2 cursor-pointer">
              <WandSparkles className="w-5 h-5" />
              Ask AI for more tips
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AISuggestions;
