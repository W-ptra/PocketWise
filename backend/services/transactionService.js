const {
  getTransactionByUserIdWithoutPagination,
  createTransactions,
  getTransactionsByUserId,
  getTransactionsByIds,
  updateTransaction,
  deleteTransactions,
} = require("../database/postgres/transactionDatabase");
const { getSaldoByUserId,updateSaldoByUserId } = require("../database/postgres/saldoDatabase");
const { getTransactionTypesByIds } = require("../database/postgres/transactionTypeDatabase");
const { isInputInvalid, isTransactionDateInvalid } = require("../utils/validation");

const ALLOWED_TIME_RANGE = ["day","week","month","year","alltime"];
const ALLOWED_TRANSACTION_TYPE = ["income","expense","all"];

async function getAllTransaction(request, h) {
  try{
    const user = request.user;
  
    const queryOption = {
      page = 1,
      pageSize = 10,
      type,
      timeRange,
      limit,
      pagination
    } = request.query;
  
    pagination = pagination === undefined || pagination === "true" ? true : false;

  
    queryOption["userId"] = user.id;
    queryOption.page = typeof(queryOption.page) === "number" ? queryOption.page : parseInt(queryOption.page);
    queryOption.pageSize = typeof(queryOption.pageSize) === "number" ? queryOption.pageSize : parseInt(queryOption.pageSize);
  
    const transactions = pagination ? await getTransactionsByUserId(queryOption) : await getTransactionByUserIdWithoutPagination(queryOption);
  
    if(transactions.length === 0){
      return h
        .response({
          error: "transaction record is empty",
        })
        .code(404);
    }
  
    return h
      .response({
        message: "successfully retrive transactions data",
        data: transactions,
      })
      .code(200);
  } catch(err){
      console.error(err);
      return h
        .response({
          error: "something went wrong, please contact pocketwise support",
        })
        .code(500);
  }
}

async function getAllTransactionTypeComparision(request,h){
  try{
    const user = request.user;
    const queryOption = {
      pagination,
      type,
      timeRange,
      limit
    } = request.query;

    if(!ALLOWED_TIME_RANGE.includes(timeRange)){
      return h
        .response({
          error: "time range is invalid",
        })
        .code(400);
    }

    if(!ALLOWED_TRANSACTION_TYPE.includes(type)){
      return h
        .response({
          error: "type is invalid",
        })
        .code(400);
    }

    queryOption["userId"] = user.id;
    const transactions = await getTransactionByUserIdWithoutPagination(queryOption);

    const transactionTypeComparision = getTransactionTypeComparationFromTransaction(transactions,type);

    if(transactionTypeComparision.total === 0){
      return h
        .response({
          error: "transaction comparision record is empty",
        })
        .code(404);
    }
  
    return h
      .response({
        message: "successfully retrive transactions comparision",
        data: transactionTypeComparision,
      })
      .code(200);
  } catch(err){
      console.error(err);
      return h
        .response({
          error: "something went wrong, please contact pocketwise support",
        })
        .code(500);
  }
}

async function createNewTransactions(request, h) {
  try {
    const user = request.user;
    const { transactions } = request.payload;

    if (isInputInvalid(transactions))
      return h
        .response({
          message: "invalid input",
        })
        .code(400);

    if(isTransactionTypeIdValid(transactions)){
      return h
        .response({
          message: "transactionTypeId must number and range between 1 to 11",
        })
        .code(400);
    }
  
    if(isTransactionDateInvalid(transactions)){
      return h
        .response({
          message: "createdAt is invalid, please use YYYY-MM-DD HH:MM:SS format",
        })
        .code(400);
    }

    if(isTransactionAmountInvalid(transactions)){
      return h
        .response({
          message: "amount is invalid, please make sure the type is number and negative value for expense and positive for income",
        })
        .code(400);
    }

    let newTransactions = getNewTransactionsFromRequestPayload(
      user.id,
      processTransactions(transactions)
    );

    const invalidTransactionTypeIds =
      await getInvalidTransactionTypeIds(newTransactions);

    if (invalidTransactionTypeIds.length > 0){
      return h
        .response({
          error: `Invalid transaction type IDs: ${invalidTransactionTypeIds.join(", ")}`,
        })
        .code(403);
    }

    newTransactions = await createTransactions(newTransactions);

    const totalAmount = getTotalAmount(newTransactions);
    await updateSaldo(user.id,totalAmount);
    return h
      .response({
        message: "Successfully created new transactions",
        data: newTransactions,
      })
      .code(200);
  } catch(err){
      console.error(err);
      return h
        .response({
          error: "something went wrong, please contact pocketwise support",
        })
        .code(500);
  }
}

function isTransactionTypeIdValid(transactions) {
  return transactions.some(transaction => {
    const rawId = transaction.transactionTypeId;
    const transactionTypeId = typeof rawId === "number" ? rawId : parseInt(rawId);

    if (isNaN(transactionTypeId)) return true;

    return transactionTypeId < 1 || transactionTypeId > 11;
  });
}

function processTransactions(transactions) {

  return transactions.map(transaction => {
    const { id,transactionTypeId, ...rest } = transaction;

    let transactionTypeIdNumber = typeof(transactionTypeId) === "number" ? transactionTypeId : parseInt(transactionTypeId)

    return {
      transactionTypeId: transactionTypeIdNumber,
      ...rest
    };
  });
}

function isTransactionAmountInvalid(transactions){
  for(const transaction in transactions){
    const amount = typeof(transaction.amount) === "number" ? transaction.amount : parseInt(transaction.amount);
    
    if( (transaction.transactionTypeId === "1" && amount < 0) || (transaction.transactionTypeId !== "1" && amount > 0)) return true;
  }
  return false;
}

async function updateTransactions(request, h) {
  try {
    const user = request.user;
    const { transactions } = request.payload;

    if (isInputInvalid(transactions))
      return h
        .response({
          message: "invalid input",
        })
        .code(400);

    let newTransactions = getNewTransactionsFromRequestPayload(
      user.id,
      transactions
    );

    const invalidTransactionIds =
      await getInvalidTransactionTypeIds(newTransactions);

    if (invalidTransactionIds.length > 0){
      return h
        .response({
          error: `Invalid transaction type IDs: ${invalidTransactionIds}`,
        })
        .code(403);
    }
    const forbiddenTransactionIds = await getForbiddenTransactionIds(
      user.id,
      newTransactions
    );
    if (forbiddenTransactionIds.length > 0)
      return h
        .response({
          error: `Transaction with IDs: ${forbiddenTransactionIds.join(", ")} doesn't belong to current User`,
        })
        .code(403);

    const totalAmountOld = await getTotalAmountFromTransaction(newTransactions);
    newTransactions = await updateTransaction(
      user.id,
      newTransactions
    );

    const totalAmountNew = getTotalAmount(newTransactions);

    const delta = totalAmountNew - totalAmountOld;
    await updateSaldo(user.id,delta);

    return h
      .response({
        message: `Successfully updated transactions`,
        data: newTransactions,
      })
      .code(200);
  } catch(err){
      console.error(err);
      return h
        .response({
          error: "something went wrong, please contact pocketwise support",
        })
        .code(500);
  }
}

async function deleteTransaction(request, h) {
  try{
    const user = request.user;
  
    const { ids } = request.payload;
  
    if (isInputInvalid(ids))
      return h
        .response({
          message: "invalid input",
        })
        .code(400);
  
    let mismatchedTransactionIds = [];
    let transactionIds = [];
    const transactions = await getTransactionsByIds(ids);
  
    transactions.map((transaction) => {
      if (transaction.userId !== user.id) {
        mismatchedTransactionIds.push(transaction.id);
      }
      transactionIds.push(transaction.id);
    });
  
    if (mismatchedTransactionIds.length > 0)
      return h
        .response({
          error: `Transactions with IDs ${mismatchedTransactionIds.join(", ")} do not belong to the current user.`,
        })
        .code(403);
  
    const totalAmount = (getTotalAmount(transactions) * -1);
  
    await deleteTransactions(transactionIds);
  
    await updateSaldo(user.id,totalAmount);
  
    return h
      .response({
        message: `Successfully delete transactions with id ${transactionIds.join(", ")}`,
      })
      .code(200);
  } catch(err){
      console.error(err);
      return h
        .response({
          error: "something went wrong, please contact pocketwise support",
        })
        .code(500);
  }
}

function getNewTransactionsFromRequestPayload(userId, transactions) {
  return transactions.map((transaction) => {
    return {
      id: transaction.id,
      title: transaction.title,
      amount: parseInt(transaction.amount),
      createdAt: new Date(transaction.createdAt),
      transactionTypeId: parseInt(transaction.transactionTypeId),
      userId: userId,
    };
  });
}

async function getInvalidTransactionTypeIds(transactions) {
  const distinctTransactionTypeIdsArray =
    getDistinctTransactionTypeId(transactions);

  const confirmedTransactionTypes = await getTransactionTypesByIds(
    distinctTransactionTypeIdsArray
  );
  const confirmedTransactionTypeIds = confirmedTransactionTypes.map(
    (confirmedTransactionTypes) => {
      return confirmedTransactionTypes.id;
    }
  );

  let invalidTransactionTypeIds = [];
  distinctTransactionTypeIdsArray.forEach((distinctTransactionTypeId) => {
    if (!confirmedTransactionTypeIds.includes(distinctTransactionTypeId)) {
        invalidTransactionTypeIds.push(distinctTransactionTypeId)
    }
  });

  return invalidTransactionTypeIds
}

async function getForbiddenTransactionIds(userId, transactions) {
  const transactionIds = transactions.map((transaction) => transaction.id);
  const transactionFromDBs = await getTransactionsByIds(transactionIds);

  let forbiddenTransactionIds = [];
  transactionFromDBs.forEach((transactionFromDB) => {
    if (transactionFromDB.userId !== userId) {
        forbiddenTransactionIds.push(transactionFromDB.id)
    }
  });
  return forbiddenTransactionIds;
}

function getDistinctTransactionTypeId(transactions) {
  const distinctTransactionTypeIdsMap = new Map();
  transactions.forEach((transaction) => {
    const id = transaction.transactionTypeId;

    if (!distinctTransactionTypeIdsMap.get(id)) {
      distinctTransactionTypeIdsMap.set(id, id);
    }
  });
  
  return [...distinctTransactionTypeIdsMap.keys()];
}

async function getTotalAmountFromTransaction(newTransaction){
  const transactionIds = newTransaction.map((transaction) => transaction.id);
  const transactionFromDBs = await getTransactionsByIds(transactionIds);
  return getTotalAmount(transactionFromDBs);
}

function getTotalAmount(transactions){
  let total = 0;
  [...transactions].forEach(transaction => total += parseInt(transaction.amount))
  return total;
}

async function updateSaldo(userId,amounts){
  try{
  const saldo = await getSaldoByUserId(userId);
  const saldoTotalAmount = parseInt(saldo.amount) + parseInt(amounts);
  await updateSaldoByUserId(userId,saldoTotalAmount);
  }catch(err){
    console.log(err)
  }
}

function getTransactionTypeComparationFromTransaction(transactions,type){
  let comparation = {}
  transactions.forEach(transaction => {

    if(type === "expense"){
      if (!comparation[transaction.transactionType.name]) {
        comparation[transaction.transactionType.name] = 0;
      }
    } else if(type === "income"){
      if (!comparation[transaction.title]) {
        comparation[transaction.title] = 0;
      }
    }

    let amount = typeof(transaction.amount) === "number" ? transaction.amount : parseInt(transaction.amount);
    amount = amount > 0 ? amount : (amount * -1);

    if(type === "expense"){
      comparation[transaction.transactionType.name] += amount;
    } else if(type === "income"){
      comparation[transaction.title] += amount;
    }
  })
  return comparation;
}

module.exports = {
  getAllTransactionTypeComparision,
  getAllTransaction,
  createNewTransactions,
  updateTransactions,
  deleteTransaction,
};
