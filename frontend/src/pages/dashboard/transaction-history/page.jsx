import React, { useEffect, useState } from "react";
import Navbar from "@/pages/dashboard/_components/Navbar";
import Footer from "@/pages/dashboard/_components/Footer";
import { getRequest, postRequest } from "~utils/api";
import { getToken } from "~utils/localStorage";
import TransactionTable from "./_components/TransactionTable";
import TransactionForm from "./_components/TransactionForm";

const allowedTransactionType = [
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "11",
];

function TransactionHistory() {
  const [inputRows, setInputRows] = useState([
    {
      id: 0,
      amount: "",
      title: "",
      transactionTypeId: "Groceries",
      createdAt: new Date().toISOString().split("T")[0],
    },
  ]);
  const [nextId, setNextId] = useState(1);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSuccessMessage, setIsSuccessMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [transactionHistory, setTransactionHistory] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPage, setTotalPage] = useState(0);

  const addInputRow = () => {
    const newRow = {
      id: nextId,
      amount: "",
      title: "",
      transactionType: "Groceries",
      dateTime: new Date().toISOString().split("T")[0],
    };
    setInputRows((prevRows) => [...prevRows, newRow]);
    setNextId((prevId) => prevId + 1);
  };

  const handleInputChange = (id, event) => {
    const { name, value } = event.target;
    console.log(id, name, value);
    setInputRows((prevRows) =>
      prevRows.map((row) => (row.id === id ? { ...row, [name]: value } : row))
    );
  };

  const handleDeleteRow = (id) => {
    if (inputRows.length === 1) return;

    setInputRows((prevRows) => prevRows.filter((row) => row.id !== id));
  };

  const insertTransaction = async () => {
    setIsError(false);
    setIsSuccessMessage(false);
    if (inputRows.length === 0) {
      setIsError(true);
      setErrorMessage("transaction can't empty");
      return;
    }

    console.log(inputRows);

    inputRows.forEach((transaction) => {
      const amount = transaction.amount;
      const title = transaction.title;
      const transactionType = transaction.transactionTypeId;
      const dateTime = transaction.createdAt;

      if (
        amount.length === 0 ||
        title.length === 0 ||
        transactionType.length === 0 ||
        dateTime.length === 0 ||
        amount === undefined ||
        title === undefined ||
        transactionType === undefined ||
        dateTime === undefined
      ) {
        setIsError(true);
        setErrorMessage("transaction input can't empty");
        return;
      }

      if (amount < 1 || amount > 999999999999999) {
        setIsError(true);
        setErrorMessage("transaction amount can't negative");
        return;
      }

      if (!allowedTransactionType.includes(transactionType)) {
        setIsError(true);
        setErrorMessage("transactionType invalid");
        return;
      }
      const isAllowed = new Date(dateTime) > new Date();

      if (isAllowed) {
        setIsError(true);
        setErrorMessage("date time can't in the futur");
        return;
      }
    });

    const payload = {
      transactions: inputRows,
    };
    const result = await postRequest("api/transaction", getToken(), payload);

    if (result.error) {
      setIsError(true);
      setErrorMessage(result.error);
      return;
    }

    setInputRows([
      {
        id: nextId,
        amount: "",
        title: "",
        transactionTypeId: 1,
        createdAt: new Date(),
      },
    ]);
    setIsSuccessMessage(true);
    setSuccessMessage(result.message);
    fetchTransactionHistory();
  };

  const fetchTransactionHistory = async (pageNumberParameter) => {
    const page = pageNumberParameter || pageNumber;
    console.log(page);
    const result = await getRequest(
      `api/transaction?page=${page}&pageSize=${pageSize}`,
      getToken()
    );

    if (result.error) return;
    console.log(result);
    setTransactionHistory(result.data.data);
    setPageSize(result.data.pageSize);
    setPageNumber(result.data.page);
    setTotalPage(result.data.totalPages);
  };

  const generatePageNumbers = (currentPage, totalPages) => {
    if (totalPages <= 0) return [];
    if (totalPages === 1) return [1];

    const pages = [1];
    const leftEllipsis = currentPage > 3 && totalPages > 4;
    const rightEllipsis = currentPage < totalPages - 2 && totalPages > 4;

    if (leftEllipsis) {
      pages.push("...");
    }

    if (currentPage <= 3) {
      // Show 2,3 if available
      for (let i = 2; i <= Math.min(4, totalPages - 1); i++) {
        pages.push(i);
      }
    } else if (currentPage >= totalPages - 2) {
      // Show pages near the end
      for (let i = Math.max(2, totalPages - 3); i <= totalPages - 1; i++) {
        pages.push(i);
      }
    } else {
      // Show middle pages
      for (let i = currentPage - 1; i <= currentPage + 1; i++) {
        if (i > 1 && i < totalPages) {
          pages.push(i);
        }
      }
    }

    if (rightEllipsis) {
      pages.push("...");
    }

    // Add last page if not already present
    if (!pages.includes(totalPages)) {
      pages.push(totalPages);
    }

    return pages;
  };

  useEffect(() => {
    fetchTransactionHistory(1);
  }, []);

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
