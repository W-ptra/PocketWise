const {
    createTransactions,
    getSingleTransactionByUserId,
    getTransactionsByUserId,
    updateTransaction,
    deleteTransactions
} = require("../database/postgres/transactionDatabase")
const { 
    getTransactionTypesByNames,
    getTransactionTypesByName,
    createTransactionTypes,
    getTransactionTypesByIds,
} = require("../database/postgres/transactionTypeDatabase");
const { isInputInvalid } = require("../utils/validation");

async function getAllTransaction(request,h){
    const user = request.user;

    const { page,size:pageSize } = request.query;
    const pagination = {page,pageSize}
    const transactions = await getTransactionsByUserId(user.id,pagination);
    
    return h.response({
        message:   "successfully retrive transactions data",
        data: transactions
    }).code(200);
}

async function createNewTransactions(request, h) {
    const user = request.user;
    const { transactions } = request.payload;

    if(isInputInvalid(transactions))
        return h.response({
            message:"invalid input"
        }).code(400);

    let newTransactionIds = {};

    let newTransactions = transactions.map(transaction => {
        const newTransactionId = transaction.transacionTypeId;
        newTransactionIds[newTransactionId] = (newTransactionIds[newTransactionId] || 0) + 1;

        return {
            amount: transaction.amount,
            title: transaction.title,
            transacionTypeId: newTransactionId,
            userId: user.id
        };
    });

    const confirmedTransactionTypes = await getTransactionTypesByIds(Object.keys(newTransactionIds));

    let wrongTransactionIds = [];

    confirmedTransactionTypes.forEach(confirmedTransactionType => {
        if (!newTransactionIds[confirmedTransactionType.id]) {
            wrongTransactionIds.push(confirmedTransactionType.id);
        }
    });

    if (wrongTransactionIds.length > 0)
        return h.response({
            error:   `Invalid transaction type IDs: ${wrongTransactionIds.join(', ')}`
        }).code(403);

    newTransactions = await createTransactions(newTransactions);

    return h.response({
        message:  "Successfully created new transactions",
        data: newTransactions
    }).code(200);
}

async function updateTransactions(request, h) {
    const user = request.user;
    const { transactions } = request.payload;

    if (isInputInvalid(transactions))
        return h.response({
            message:"invalid input"
        }).code(400);

    let newTransactionIds = {};
    let mismatchedTransactions = [];
    let updatedTransactionIds = [];

    let newTransactions = transactions.map(transaction => {
        const newTransactionId = transaction.transacionTypeId;

        if (transaction.userId !== user.id) {
            mismatchedTransactions.push(transaction);
        }
        updatedTransactionIds.push(transaction.id)
        newTransactionIds[newTransactionId] = (newTransactionIds[newTransactionId] || 0) + 1;

        return {
            amount: transaction.amount,
            title: transaction.title,
            transacionTypeId: newTransactionId,
            userId: user.id
        };
    });

    if (mismatchedTransactions.length > 0) {
        const mismatchedIds = mismatchedTransactions.map(t => t.id);
        return h.response({
            error:  `Transactions with IDs ${mismatchedIds.join(', ')} do not belong to the current user.`
        }).code(403);
    }

    const confirmedTransactionTypes = await getTransactionTypesByIds(Object.keys(newTransactionIds));

    let wrongTransactionIds = [];

    confirmedTransactionTypes.forEach(confirmedTransactionType => {
        if (!newTransactionIds[confirmedTransactionType.id]) {
            wrongTransactionIds.push(confirmedTransactionType.id);
        }
    });

    if (wrongTransactionIds.length > 0)
        return h.response({
            error:  `Invalid transaction type IDs: ${wrongTransactionIds.join(', ')}`
        }).code(403);

    newTransactions = await updateTransaction(userId,updatedTransactionIds,newTransactions);

    return h.response({
        message: `Successfully updated transactions`,
        data: newTransactions
    }).code(200);
}

async function deleteTransaction(request,h) {
    const user = request.user;

    const { ids } = request.payload;
 
    if(isInputInvalid(ids))
        return h.response({
            message:"invalid input"
        }).code(400);

    let mismatchedTransactionIds = [];
    let transactionIds = [];
    const transactions = await getTransactionsByIds(ids);

    transactions.map(transaction => {
        if(transaction.userId !== user.id){
            mismatchedTransactionIds.push(transaction.id);
        }
        transactionIds.push(transaction.id);
    });

    if(mismatchedTransactionIds.length > 0)
        return h.response({
            error: `Transactions with IDs ${mismatchedTransactionIds.join(', ')} do not belong to the current user.`,
        }).code(403);
        

    await deleteTransactions(transactionIds);

    return h.response({
        message: `Successfully delete transactions with id ${transactionIds.join(', ')}`,
    }).code(200);
}

module.exports = {
    getAllTransaction,
    createNewTransactions,
    updateTransactions,
    deleteTransaction
}