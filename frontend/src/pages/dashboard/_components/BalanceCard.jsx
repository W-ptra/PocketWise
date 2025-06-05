function BalanceCard({ balance }) {
    const formattedBalance = new Intl.NumberFormat('id-ID').format(balance);

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-gray-600 font-medium">Saldo</h2>
            </div>
            <div className="flex justify-between items-center">
                <div>
                    <p className="text-2xl font-bold text-gray-800">Rp{formattedBalance}</p>
                </div>
                <button className="bg-[#00AB6B] text-white px-4 py-2 rounded-lg hover:bg-[#00CF81] transition-colors duration-200">
                    Top Up
                </button>
            </div>
        </div>
    );
}

export default BalanceCard; 