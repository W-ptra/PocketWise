"use client";

import Navbar from "@/pages/dashboard/_components/Navbar";
import Footer from "@/pages/dashboard/_components/Footer";
import TransactionTable from "./_components/TransactionTable";
import TransactionForm from "./_components/TransactionForm";

function TransactionHistory() {

  return (
    <div className="min-h-screen flex flex-col bg-[#F2F2F2]">
      <Navbar />
      <div className="flex-1 grid grid-cols-3 gap-6 p-6">
        <div className="col-span-2">
          <TransactionTable />
        </div>
        <div className="col-span-1">
          <TransactionForm />
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default TransactionHistory;
