import {
  TrendingUp,
  PiggyBank,
  LineChart,
  ArrowUpRight,
  Info,
  Coins,
  Wallet,
  Building2,
  BadgeDollarSign,
  Bitcoin,
} from "lucide-react";
import { useState } from "react";

function InvestmentSuggestions() {
  const [activeTab, setActiveTab] = useState("stocks");
  const [showTooltip, setShowTooltip] = useState(false);

  const suggestions = {
    stocks: [
      {
        title: "LQ45 Blue Chip Stocks",
        description: "Top 45 most liquid stocks in IDX with strong fundamentals",
        potential: "12-15%",
        minInvestment: "Rp100.000",
        risk: "Moderate",
        examples: "BBCA, TLKM, ASII"
      },
      {
        title: "IDX Growth ETF",
        description: "Tracks fastest growing companies in Indonesian market",
        potential: "15-20%",
        minInvestment: "Rp200.000",
        risk: "Moderate-High",
        examples: "XIIT, XIJI, XPLQ"
      }
    ],
    mutual: [
      {
        title: "Money Market Fund",
        description: "Short-term debt instruments, ideal for emergency funds",
        potential: "4-6%",
        minInvestment: "Rp100.000",
        risk: "Very Low",
        examples: "Sucorinvest Money Market, Bahana Dana Likuid"
      },
      {
        title: "Mixed Fund Portfolio",
        description: "Balanced mix of stocks and bonds for steady growth",
        potential: "8-12%",
        minInvestment: "Rp100.000",
        risk: "Moderate",
        examples: "Schroder Dana Terpadu, Panin Dana Maksima"
      }
    ],
    bonds: [
      {
        title: "Government Bonds (SBN)",
        description: "State-backed securities with fixed returns",
        potential: "5.9-6.8%",
        minInvestment: "Rp1.000.000",
        risk: "Low",
        examples: "SR018, ORI022, SBR011"
      },
      {
        title: "Corporate Bonds",
        description: "Company-issued debt with higher yields",
        potential: "7-9%",
        minInvestment: "Rp5.000.000",
        risk: "Moderate",
        examples: "BBRI, TLKM, SMGR"
      }
    ],
    crypto: [
      {
        title: "Blue Chip Cryptocurrencies",
        description: "Established cryptocurrencies with large market caps",
        potential: "20-30%",
        minInvestment: "Rp100.000",
        risk: "Very High",
        examples: "Bitcoin (BTC), Ethereum (ETH)"
      },
      {
        title: "Stablecoins Savings",
        description: "USD-pegged tokens with lending yields",
        potential: "4-8%",
        minInvestment: "Rp50.000",
        risk: "Moderate-High",
        examples: "USDT, USDC"
      }
    ]
  };

  return (
    <div className="relative bg-white p-6 rounded-xl shadow-sm overflow-hidden h-full">
      {/* Decorative Elements */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <LineChart className="absolute top-4 right-8 w-8 h-8 text-[#00AB6B]/10 animate-pulse" />
        <Coins className="absolute bottom-6 left-10 w-6 h-6 text-[#FFB86B]/10 animate-pulse delay-200" />
        <TrendingUp className="absolute top-1/2 right-4 w-5 h-5 text-[#4ECDC4]/10 animate-pulse delay-500" />
      </div>
      
      {/* Gradient Accent */}
      <div className="absolute left-0 top-0 h-full w-2 bg-gradient-to-b from-[#4ECDC4] via-[#00AB6B] to-[#FFB86B] rounded-l-xl" />
      
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-gray-600 font-bold text-xl flex items-center gap-2">
            <PiggyBank className="w-6 h-6 text-[#4ECDC4]" />
            Investment Opportunities
          </h2>
          <div className="relative">
            <Info 
              className="w-5 h-5 text-gray-400 cursor-help"
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
            />
            {showTooltip && (
              <div className="absolute right-0 top-8 bg-white border border-gray-200 rounded-lg shadow-lg p-3 text-xs text-gray-700 w-64 z-20">
                Market data updated as of 2024. Returns are historical and not guaranteed. Always conduct thorough research before investing.
              </div>
            )}
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setActiveTab("stocks")}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors duration-200 flex items-center gap-1 cursor-pointer ${
              activeTab === "stocks"
                ? "bg-[#00AB6B] text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            <Building2 className="w-4 h-4" />
            Stocks & ETFs
          </button>
          <button
            onClick={() => setActiveTab("mutual")}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors duration-200 flex items-center gap-1 cursor-pointer ${
              activeTab === "mutual"
                ? "bg-[#00AB6B] text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            <Wallet className="w-4 h-4" />
            Mutual Funds
          </button>
          <button
            onClick={() => setActiveTab("bonds")}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors duration-200 flex items-center gap-1 cursor-pointer ${
              activeTab === "bonds"
                ? "bg-[#00AB6B] text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            <BadgeDollarSign className="w-4 h-4" />
            Bonds
          </button>
          <button
            onClick={() => setActiveTab("crypto")}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors duration-200 flex items-center gap-1 cursor-pointer ${
              activeTab === "crypto"
                ? "bg-[#00AB6B] text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            <Bitcoin className="w-4 h-4" />
            Crypto
          </button>
        </div>

        <div className="flex flex-col justify-between h-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {suggestions[activeTab].map((item, index) => (
              <div 
                key={index}
                className="bg-gray-50 rounded-xl p-4 hover:shadow-md transition-shadow duration-200 border border-gray-100"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-gray-800">{item.title}</h3>
                  <ArrowUpRight className="w-4 h-4 text-[#00AB6B]" />
                </div>
                <p className="text-sm text-gray-600 mb-3">{item.description}</p>
                <div className="grid grid-cols-2 gap-3 text-xs mb-3">
                  <div>
                    <div className="text-gray-500 mb-1">Potential Return</div>
                    <div className="font-semibold text-[#00AB6B]">
                      {item.potential}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-500 mb-1">Min. Investment</div>
                    <div className="font-semibold">
                      {item.minInvestment}
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <div className="text-gray-500 mb-1">Risk Level</div>
                    <div className="font-semibold text-gray-700">
                      {item.risk}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-500 mb-1">Popular Options</div>
                    <div className="font-medium text-gray-600">
                      {item.examples}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Action Button */}
          <div className="mt-6 flex justify-end bottom-0">
            <button className="bg-gradient-to-r from-[#4ECDC4] to-[#00AB6B] text-white font-semibold px-5 py-2 rounded-lg shadow hover:from-[#5CE0D7] hover:to-[#00CF81] transition-all duration-200 flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Start Investing
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InvestmentSuggestions;
