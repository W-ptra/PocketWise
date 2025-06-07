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
  Scale,
  Home,
  Landmark,
  ShieldCheck,
  TrendingDown,
  AlertTriangle,
  ChevronRight,
  X
} from "lucide-react";
import * as Ariakit from "@ariakit/react";
import { useState } from "react";

function InvestmentSuggestions() {
  const [selectedInvestment, setSelectedInvestment] = useState(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const dialog = Ariakit.useDialogStore();

  const investmentTypes = [
    {
      id: "government_bonds",
      title: "Government Bonds",
      icon: <Landmark className="w-8 h-8 text-blue-600" />,
      description: "State-backed securities with guaranteed returns",
      products: [
        {
          name: "Retail Government Bonds (ORI)",
          return: "6.2-7.1%",
          risk: "Very Low",
          minInvestment: "Rp1.000.000",
          lockPeriod: "3-4 years",
          features: ["Government guaranteed", "Fixed returns", "Tax-free"]
        },
        {
          name: "Retail Sukuk (SR)",
          return: "6.4-7.3%",
          risk: "Very Low", 
          minInvestment: "Rp1.000.000",
          lockPeriod: "3 years",
          features: ["Shariah compliant", "Monthly payments", "Tax-free"]
        }
      ]
    },
    {
      id: "stocks",
      title: "Stocks & ETFs",
      icon: <TrendingUp className="w-8 h-8 text-emerald-600" />,
      description: "Ownership in publicly traded companies",
      products: [
        {
          name: "Blue Chip Stocks",
          return: "12-15%",
          risk: "Moderate",
          minInvestment: "Rp100.000",
          lockPeriod: "None",
          features: ["High liquidity", "Dividend potential", "Capital gains"]
        },
        {
          name: "Index ETFs",
          return: "10-13%",
          risk: "Moderate",
          minInvestment: "Rp100.000",
          lockPeriod: "None",
          features: ["Diversified", "Low fees", "Easy trading"]
        }
      ]
    },
    {
      id: "mutual_funds",
      title: "Mutual Funds",
      icon: <PiggyBank className="w-8 h-8 text-purple-600" />,
      description: "Professionally managed investment pools",
      products: [
        {
          name: "Money Market Funds",
          return: "4-6%",
          risk: "Low",
          minInvestment: "Rp100.000",
          lockPeriod: "None",
          features: ["High liquidity", "Stable returns", "Low risk"]
        },
        {
          name: "Equity Funds",
          return: "10-15%",
          risk: "High",
          minInvestment: "Rp100.000",
          lockPeriod: "None",
          features: ["Professional management", "Diversified portfolio", "Long-term growth"]
        }
      ]
    },
    {
      id: "property",
      title: "Property Investment",
      icon: <Home className="w-8 h-8 text-orange-600" />,
      description: "Real estate and property investments",
      products: [
        {
          name: "REITs",
          return: "8-12%",
          risk: "Moderate",
          minInvestment: "Rp1.000.000",
          lockPeriod: "None",
          features: ["Regular income", "Property exposure", "Professional management"]
        },
        {
          name: "Property Crowdfunding",
          return: "12-20%",
          risk: "High",
          minInvestment: "Rp5.000.000",
          lockPeriod: "1-3 years",
          features: ["Fractional ownership", "Development projects", "Exit options"]
        }
      ]
    },
    {
      id: "gold",
      title: "Gold Investment",
      icon: <Coins className="w-8 h-8 text-yellow-600" />,
      description: "Physical and digital gold investments",
      products: [
        {
          name: "Digital Gold",
          return: "8-15%",
          risk: "Moderate",
          minInvestment: "Rp10.000",
          lockPeriod: "None",
          features: ["High liquidity", "24/7 trading", "Secure storage"]
        },
        {
          name: "Gold Savings",
          return: "8-15%",
          risk: "Moderate",
          minInvestment: "Rp50.000",
          lockPeriod: "None",
          features: ["Regular buying", "Physical delivery option", "No storage fee"]
        }
      ]
    },
    {
      id: "p2p",
      title: "P2P Lending",
      icon: <Wallet className="w-8 h-8 text-red-600" />,
      description: "Direct lending to businesses/individuals",
      products: [
        {
          name: "Business Lending",
          return: "15-20%",
          risk: "High",
          minInvestment: "Rp100.000",
          lockPeriod: "3-12 months",
          features: ["High returns", "Monthly repayments", "Diversification options"]
        },
        {
          name: "Invoice Financing",
          return: "12-18%",
          risk: "Moderate-High",
          minInvestment: "Rp1.000.000",
          lockPeriod: "1-6 months",
          features: ["Short term", "Business backed", "Regular returns"]
        }
      ]
    }
  ];

  const handleOpenModal = (investment) => {
    setSelectedInvestment(investment);
    dialog.show();
  };

  const handleCloseModal = () => {
    setSelectedInvestment(null);
    dialog.hide();
  };

  return (
    <div className="relative bg-white p-6 rounded-xl shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-gray-800 font-bold text-xl flex items-center gap-2">
          <Scale className="w-6 h-6 text-blue-600" />
          Types of Investments
        </h2>
        <div className="relative">
          <Info 
            className="w-5 h-5 text-gray-400 cursor-help"
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
          />
          {showTooltip && (
            <div className="absolute right-0 top-8 bg-white border border-gray-200 rounded-lg shadow-lg p-3 text-xs text-gray-700 w-64 z-20">
              Returns are historical and not guaranteed. Always conduct thorough research and consider consulting with a financial advisor before investing.
            </div>
          )}
        </div>
      </div>

      {/* Investment Types Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {investmentTypes.map((type) => (
          <div
            key={type.id}
            className="relative bg-white rounded-xl p-4 border border-gray-200 transition-all duration-200 cursor-pointer hover:border-blue-300 hover:shadow-sm"
            onClick={() => handleOpenModal(type)}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                {type.icon}
                <h3 className="font-semibold text-gray-800">{type.title}</h3>
              </div>
              <ArrowUpRight className="w-5 h-5 text-gray-400" />
            </div>
            <p className="text-sm text-gray-600 mb-2">{type.description}</p>
          </div>
        ))}
      </div>

      {/* Risk Warning */}
      <div className="flex items-start gap-3 p-4 bg-orange-50 rounded-lg text-sm text-orange-800">
        <AlertTriangle className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-medium mb-1">Investment Risk Warning:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Past performance does not guarantee future results</li>
            <li>Investment values can go up and down</li>
            <li>Consider your risk tolerance and investment goals</li>
            <li>Diversify your investments across different types</li>
            <li>Consult with a financial advisor for personalized advice</li>
          </ul>
        </div>
      </div>

      {/* Investment Details Modal */}
      <InvestmentModal 
        dialog={dialog} 
        investment={selectedInvestment} 
        onClose={handleCloseModal}
      />
    </div>
  );
}

const InvestmentModal = ({ dialog, investment, onClose }) => {
  if (!investment) return null;

  return (
    <Ariakit.Dialog
      store={dialog}
      className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto z-50"
      backdrop={<div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-1000" />}
    >
      <div className="p-6">
        {/* Modal Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            {investment.icon}
            <h2 className="text-xl font-bold text-gray-800">{investment.title}</h2>
          </div>
          <Ariakit.DialogDismiss 
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </Ariakit.DialogDismiss>
        </div>

        {/* Investment Description */}
        <p className="text-gray-600 mb-6">{investment.description}</p>

        {/* Products Grid */}
        <div className="space-y-4">
          {investment.products.map((product, idx) => (
            <div key={idx} className="bg-gray-50 rounded-lg p-4 border border-gray-100">
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-semibold text-gray-800">{product.name}</h3>
                <span className="text-emerald-600 font-medium">{product.return}</span>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-4 text-sm">
                <div>
                  <span className="block text-gray-500 mb-1">Risk Level</span>
                  <span className="font-medium">{product.risk}</span>
                </div>
                <div>
                  <span className="block text-gray-500 mb-1">Min. Investment</span>
                  <span className="font-medium">{product.minInvestment}</span>
                </div>
                <div>
                  <span className="block text-gray-500 mb-1">Lock Period</span>
                  <span className="font-medium">{product.lockPeriod}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {product.features.map((feature, fidx) => (
                  <span 
                    key={fidx}
                    className="text-xs bg-white px-2 py-1 rounded-full text-gray-600 border border-gray-200"
                  >
                    {feature}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Modal Footer */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Want to learn more about {investment.title.toLowerCase()}?
            </p>
            <Ariakit.DialogDismiss
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Close
            </Ariakit.DialogDismiss>
          </div>
        </div>
      </div>
    </Ariakit.Dialog>
  );
};

export default InvestmentSuggestions;
