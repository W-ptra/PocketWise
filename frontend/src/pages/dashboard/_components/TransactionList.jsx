function TransactionList({ transactions, title }) {
    return (
        <div className="bg-white p-6 rounded-xl shadow-sm">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">{title}</h2>
            <div className="space-y-4">
                {transactions.map((transaction, index) => (
                    <div key={index} className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <span className="text-sm font-medium">{index + 1}</span>
                            <span className="text-sm font-medium">{transaction.name}</span>
                        </div>
                        <span className={`text-sm font-semibold ${
                            transaction.amount < 0 ? 'text-red-500' : 'text-[#00AB6B]'
                        }`}>
                            Rp{new Intl.NumberFormat('id-ID').format(Math.abs(transaction.amount))}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default TransactionList; 