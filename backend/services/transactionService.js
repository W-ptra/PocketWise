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
const customParseFormat = require("dayjs/plugin/customParseFormat");
const { isInputInvalid } = require("../utils/validation");
const dayjs = require("dayjs");
dayjs.extend(customParseFormat);

async function getAllTransaction(request, h) {
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

  console.log(pagination);

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
}

async function getAllTransactionTypeComparision(request,h){
  const user = request.user;
  const queryOption = {
    pagination,
    type,
    timeRange,
    limit
  } = request.query;
  queryOption["userId"] = user.id;
  const transactions = await getTransactionByUserIdWithoutPagination(queryOption);
  const transactionTypeComparision = getTransactionTypeComparationFromTransaction(transactions);

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
  
    let newTransactions = getNewTransactionsFromRequestPayload(
      user.id,
      processTransactions(transactions)
    );
    
    console.log(newTransactions);

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
  } catch (err) {
    console.log(err);
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

    
    if (transactionTypeIdNumber !== 1) {
      return {
        ...rest,
        transactionTypeId: transactionTypeIdNumber,
        amount: transaction.amount * -1,
      };
    }
    
    return {
      transactionTypeId: transactionTypeIdNumber,
      ...rest
    };
  });
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
  } catch (err) {
    console.log(err);
  }
}

async function deleteTransaction(request, h) {
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
}

function getNewTransactionsFromRequestPayload(userId, transactions) {
  return transactions.map((transaction) => {
    return {
      id: transaction.id,
      title: transaction.title,
      amount: parseInt(transaction.amount),
      createdAt: dayjs(transaction.createdAt, "YYYY-MM-DD").toDate(),
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
  console.log(userId,saldo,amounts);
  const saldoTotalAmount = parseInt(saldo.amount) + parseInt(amounts);
  await updateSaldoByUserId(userId,saldoTotalAmount);
  }catch(err){
    console.log(err)
  }
}

function getTransactionTypeComparationFromTransaction(transactions){
  let total = 0;
  let comparation = {}
  transactions.forEach(transaction => {
    if (!comparation[transaction.transactionType.name]) {
      comparation[transaction.transactionType.name] = 0;
    }
    let amount = typeof(transaction.amount) === "number" ? transaction.amount : parseInt(transaction.amount);
    amount = amount > 0 ? amount : (amount * -1);

    comparation[transaction.transactionType.name] += amount;
    total += amount;
  })
  comparation["total"]=total;
  return comparation;
}

module.exports = {
  getAllTransactionTypeComparision,
  getAllTransaction,
  createNewTransactions,
  updateTransactions,
  deleteTransaction,
};
