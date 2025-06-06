import { useState } from "react";
import { Calendar } from "lucide-react";
import * as Ariakit from "@ariakit/react";

const TransactionType = [
  "Income",
  "Rent",
  "Loan Repayment",
  "Insurance",
  "Groceries",
  "Transport",
  "Eating Out",
  "Entertainment",
  "Utilities",
  "Healthcare",
  "Education",
  "Other",
];

const TransactionForm = () => {
  const [formData, setFormData] = useState({
    amount: "",
    title: "",
    transactionType: TransactionType[0],
    date: new Date().toISOString().split("T")[0],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTransactionTypeChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      transactionType: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Handle form submission
    console.log(formData);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Add Transaction</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="amount"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Amount
          </label>
          <div className="relative rounded-lg">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
              Rp.
            </div>
            <input
              type="number"
              name="amount"
              id="amount"
              value={formData.amount}
              onChange={handleChange}
              className="block w-full rounded-lg border border-gray-300 py-2 pl-10 pr-3 text-gray-900 placeholder:text-gray-400 focus:border-[#00AB6B] focus:outline-none focus:ring-1 focus:ring-[#00AB6B] sm:text-sm cursor-pointer"
              placeholder="0.00"
              required
            />
          </div>
        </div>

        {/* Title Field */}
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Title
          </label>
          <input
            type="text"
            name="title"
            id="title"
            value={formData.title}
            onChange={handleChange}
            className="block w-full rounded-lg border border-gray-300 py-2 px-3 text-gray-900 placeholder:text-gray-400 focus:border-[#00AB6B] focus:outline-none focus:ring-1 focus:ring-[#00AB6B] sm:text-sm cursor-pointer"
            placeholder="Enter transaction title"
            required
          />
        </div>

        <div>
          <label
            htmlFor="transactionType"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Transaction Type
          </label>
          <TransactionDropdown 
            selected={formData.transactionType}
            onSelect={handleTransactionTypeChange}
          />
        </div>

        <div>
          <label
            htmlFor="date"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Date
          </label>
          <div className="relative rounded-lg">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Calendar className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="date"
              name="date"
              id="date"
              value={formData.date}
              onChange={handleChange}
              className="block w-full rounded-lg border border-gray-300 py-2 pl-10 pr-3 text-gray-900 focus:border-[#00AB6B] focus:outline-none focus:ring-1 focus:ring-[#00AB6B] sm:text-sm cursor-pointer"
              required
            />
          </div>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            className="w-full rounded-lg bg-[#00AB6B] px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#00AB6B]/90 focus:outline-none focus:ring-2 focus:ring-[#00AB6B] focus:ring-offset-2 transition-colors duration-200 cursor-pointer"
          >
            Add Transaction
          </button>
        </div>
      </form>
    </div>
  );
};

const TransactionDropdown = ({ selected, onSelect }) => {
  const menu = Ariakit.useMenuStore();

  return (
    <Ariakit.MenuProvider>
      <Ariakit.MenuButton 
        className="flex w-full items-center justify-between rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 hover:bg-gray-50 focus:border-[#00AB6B] focus:outline-none focus:ring-1 focus:ring-[#00AB6B] cursor-pointer"
      >
        <span>{selected}</span>
        <svg
          className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${
            menu.open ? 'rotate-180' : ''
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </Ariakit.MenuButton>
      <Ariakit.Menu 
        gutter={4}
        className="z-50 max-h-[280px] w-full overflow-auto rounded-lg border border-gray-200 bg-white py-1 shadow-lg focus:outline-none"
      >
        {TransactionType.map((type) => (
          <Ariakit.MenuItem
            key={type}
            className="flex cursor-pointer items-center px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 focus:bg-gray-50 focus:text-gray-900 focus:outline-none"
            onClick={() => {
              onSelect(type);
              menu.hide();
            }}
          >
            {type}
          </Ariakit.MenuItem>
        ))}
      </Ariakit.Menu>
    </Ariakit.MenuProvider>
  );
};

export default TransactionForm;
