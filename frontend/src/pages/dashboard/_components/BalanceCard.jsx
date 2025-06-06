function BalanceCard({ balance }) {
  const formattedBalance = new Intl.NumberFormat("id-ID").format(balance);

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-gray-600 font-bold text-xl">Saldo</h2>
      </div>
      <div className="flex flex-col">
        <p className="text-4xl md:text-3xl lg:text-5xl font-bold text-gray-800">Rp{formattedBalance}</p>
        <div className="flex gap-4 mt-6 self-end">
          <button className="text-[#00AB6B] px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition-colors duration-200 w-full sm:w-auto cursor-pointer">
            Withdraw
          </button>
          <button className="bg-[#00AB6B] text-white px-4 py-2 rounded-lg hover:bg-[#00CF81] transition-colors duration-200 w-full sm:w-auto border border-gray-300 cursor-pointer">
            Top Up
          </button>
        </div>
      </div>
    </div>
  );
}

export default BalanceCard;
