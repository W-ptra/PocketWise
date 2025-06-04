import React, { useState } from 'react';
import Navbar from "~components/navbar";
import Footer from "~components/footer";
import { postRequest } from "~utils/api";
import { getToken } from "~utils/localStorage";

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
    "11"
];

function TransactionHistory(){
    const [inputRows, setInputRows] = useState([
        { id: 0, amount: '', title: '', transactionTypeId: 'Groceries', createdAt: new Date().toISOString().split("T")[0]},
    ]);
    const [nextId, setNextId] = useState(1);
    const [isError, setIsError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [isSuccessMessage, setIsSuccessMessage] = useState("");
    const [successMessage,setSuccessMessage] = useState("");

    const addInputRow = () => {
        const newRow = { id: nextId, amount: '', title: '', transactionType: 'Groceries', dateTime: new Date().toISOString().split("T")[0]};
        setInputRows(prevRows => [...prevRows, newRow]);
        setNextId(prevId => prevId + 1);
    };

    const handleInputChange = (id, event) => {
        const { name, value } = event.target;
        console.log(id,name,value);
        setInputRows(prevRows =>
            prevRows.map(row =>
                row.id === id ? { ...row, [name]: value } : row
            )
        );
    };

    const handleDeleteRow = (id) => {
        if(inputRows.length === 1)return;

        setInputRows(prevRows => prevRows.filter(row => row.id !== id));
    };

    const insertTransaction = async () => {
        setIsError(false);
        setIsSuccessMessage(false);
        if(inputRows.length === 0){
            setIsError(true);
            setErrorMessage("transaction can't empty");
            return;
        }

        console.log(inputRows);

        inputRows.forEach( transaction => {
            const amount = transaction.amount;
            const title = transaction.title;
            const transactionType = transaction.transactionTypeId;
            const dateTime = transaction.createdAt;

            if(
                amount.length === 0 || title.length === 0 || transactionType.length === 0 || dateTime.length === 0
                || amount === undefined || title === undefined || transactionType === undefined || dateTime === undefined
            ){
                setIsError(true);
                setErrorMessage("transaction input can't empty");
                return;
            }

            if(amount < 1 || amount > 999999999999999){
                setIsError(true);
                setErrorMessage("transaction amount can't negative");
                return;
            }

            if(!allowedTransactionType.includes(transactionType)){
                setIsError(true);
                setErrorMessage("transactionType invalid");
                return;
            }
            const isAllowed = new Date(dateTime) > new Date();

            if(isAllowed){
                setIsError(true);
                setErrorMessage("date time can't in the futur");
                return;
            }
            
        } );
        
        const payload = {
            transactions: inputRows
        }
        const result = await postRequest("api/transaction",getToken(),payload);

        if(result.error){
            setIsError(true);
            setErrorMessage(result.error);
            return;
        }

        setInputRows([{ id: nextId, amount: '', title: '', transactionTypeId: 1, createdAt: new Date() }]);
        setIsSuccessMessage(true);
        setSuccessMessage(result.message);
    }


    return (
        <div>
            <Navbar/>
            <div class="mt-10 mb-10">
                <div className="mx-auto max-w-3xl rounded bg-white p-6 shadow">

                    <div className="text-center">
                        <button className="mx-auto mb-2 flex h-16 w-16 items-center justify-center rounded-full bg-green-500 text-white">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 11c.828 0 1.5-.895 1.5-2s-.672-2-1.5-2-1.5.895-1.5 2 .672 2 1.5 2z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V8a2 2 0 012-2h2.586a1 1 0 00.707-.293l.707-.707A1 1 0 0110.414 5h3.172a1 1 0 01.707.293l.707.707a1 1 0 00.707.293H19a2 2 0 012 2v10a2 2 0 01-2 2z" />
                            </svg>
                        </button>
                        <p className="font-semibold text-green-600">Scan Receipt</p>
                        <div className="my-2 text-gray-400">Or</div>
                        <p className="font-semibold text-[#00AB6B]">Manual Input</p>
                    </div>

                    {/* Input Rows Section */}
                    <div className="mt-4 space-y-2">
                        <div className="grid grid-cols-5 gap-2 text-sm font-semibold text-gray-600">
                            <label>Amount</label>
                            <label>Title</label>
                            <label>Transaction Type</label>
                            <label>Date Time</label>
                            <label>Delete</label>
                        </div>


                        <div id="input-rows">
                            {inputRows.map(row => (
                                <div key={row.id} className="mt-1 grid grid-cols-5 gap-2">
                                    <input
                                        type="number"
                                        min="1"
                                        max="9999999999999999"
                                        className="rounded border px-2 py-1"
                                        placeholder="Rp."
                                        name="amount"
                                        value={row.amount}
                                        onChange={(e) => handleInputChange(row.id, e)}
                                    />
                                    <input
                                        type="text"
                                        className="rounded border px-2 py-1"
                                        placeholder=""
                                        name="title"
                                        value={row.title}
                                        onChange={(e) => handleInputChange(row.id, e)}
                                    />
                                    <select
                                        className="rounded border px-2 py-1"
                                        name="transactionTypeId"
                                        value={row.transactionTypeId}
                                        onChange={(e) => handleInputChange(row.id, e)}
                                        >
                                        <option value="1">Income</option>
                                        <option value="2">Rent</option>
                                        <option value="3">Loan_Repayment</option>
                                        <option value="4">Insurance</option>
                                        <option value="5">Groceries</option>
                                        <option value="6">Transport</option>
                                        <option value="7">Eating_Out</option>
                                        <option value="8">Entertainment</option>
                                        <option value="9">Utilities</option>
                                        <option value="10">Healthcare</option>
                                        <option value="11">Education</option>
                                    </select>

                                    <input
                                        type="date"
                                        className="rounded border px-2 py-1"
                                        placeholder=""
                                        name="createdAt"
                                        value={row.dateTime}
                                        onChange={(e) => handleInputChange(row.id, e)}
                                    />
                                    <button
                                        className='bg-red-500 flex flex-row justify-center items-center hover:bg-red-400 cursor-pointer rounded'
                                        onClick={() => handleDeleteRow(row.id)}
                                    >
                                        <img src="/logo/cross.png" alt=""
                                            className='size-5'
                                        />
                                    </button>
                                </div>
                            ))}
                        </div>

                        
                    </div>
                    
                    <div className="flex justify-center w-full mt-4">
                        <button onClick={addInputRow} className="mt-2 w-full rounded border border-green-600 px-4 py-1 text-green-600 hover:bg-green-50 cursor-pointer">Add Another Item</button>
                    </div>

                    <div className="mt-4">
                        <button 
                            className="w-full rounded bg-green-600 py-2 font-semibold text-white  hover:bg-green-500 cursor-pointer"
                            onClick={insertTransaction}    
                        >
                            Add Transaction
                        </button>
                    </div>

                    { isError && (
                        <p className='text-center text-red-500 mt-2'>{errorMessage}</p>
                    )}
                    
                    { isSuccessMessage && (
                        <p className='text-center text-black mt-4'>{successMessage}</p>
                    )}
                </div>

                <div className="mx-auto max-w-3xl rounded bg-white p-6 shadow mt-5">
                    <div className="mt-6">
                        <div className="grid grid-cols-4 bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-700">
                            <div>Amount</div>
                            <div>Title</div>
                            <div>Transaction Type</div>
                            <div>Date Time</div>
                        </div>

                        {/* Sample Entries (consider making this dynamic with state too) */}
                        <div className="divide-y">
                            <div className="grid grid-cols-4 px-4 py-2 text-sm">
                                <div>Rp. 50.000</div>
                                <div>Indomie</div>
                                <div>Makanan</div>
                                <div>06/04/2025 13:08:43</div>
                            </div>
                            <div className="grid grid-cols-4 px-4 py-2 text-sm">
                                <div>Rp. 50.000</div>
                                <div>Indomie</div>
                                <div>Makanan</div>
                                <div>06/04/2025 13:08:43</div>
                            </div>
                        </div>

                        {/* Pagination */}
                        <div className="mt-4 text-center text-green-600"><span className="font-semibold">1</span> <span className="text-gray-400">2 3 ... 14</span></div>
                    </div>
                </div>
            </div>
            <Footer/>
        </div>
    )
}

export default TransactionHistory;