import { Banknote } from "lucide-react";

function BalanceCard({ balance }) {
  const formattedBalance = new Intl.NumberFormat("id-ID").format(balance);

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <div className="flex justify-between gap-2">
          <Banknote className="w-6 h-6 text-[#00AB6B]" />
          <h2 className="text-gray-600 font-bold text-xl">Balance</h2>
        </div>
      </div>
      <div className="flex flex-col">
        <p className="text-4xl md:text-3xl lg:text-5xl font-bold text-gray-800">
          Rp{formattedBalance}
        </p>
        <div className="flex gap-4 mt-6 self-end">
          <a href="/transaction-history">
            <button className="bg-[#00AB6B] text-white px-4 py-2 rounded-lg hover:bg-[#00CF81] transition-colors duration-200 w-full sm:w-auto border border-gray-300 cursor-pointer">
              Update Balance
            </button>
          </a>
        </div>
      </div>
    </div>
  );
}

export default BalanceCard;
