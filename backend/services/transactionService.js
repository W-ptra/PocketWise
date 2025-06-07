const {
  getTransactionByUserIdWithoutPagination,
  createTransactions,
  getTransactionsByUserId,
  getSingleTransactionByUserId,
  updateTransaction,
  deleteTransactions,
} = require("../database/postgres/transactionDatabase");
const {
  getSaldoByUserId,
  updateSaldoByUserId,
} = require("../database/postgres/saldoDatabase");
const {
  getTransactionTypesByIds,
} = require("../database/postgres/transactionTypeDatabase");
const customParseFormat = require("dayjs/plugin/customParseFormat");
const { isInputInvalid } = require("../utils/validation");
const dayjs = require("dayjs");
dayjs.extend(customParseFormat);

// Enum values matching the Prisma schema
const TransactionType = {
  Income: 'Income',
  Rent: 'Rent',
  Loan_Repayment: 'Loan_Repayment',
  Insurance: 'Insurance',
  Groceries: 'Groceries',
  Transport: 'Transport',
  Eating_Out: 'Eating_Out',
  Entertainment: 'Entertainment',
  Utilities: 'Utilities',
  Healthcare: 'Healthcare',
  Education: 'Education'
};

async function getAllTransactions(request, h) {
  const user = request.user;

  const queryOption = ({
    page = 1,
    pageSize = 10,
    type,
    timeRange,
    limit,
    pagination,
  } = request.query);

  pagination = pagination === undefined || pagination === "true" ? true : false;

  queryOption.userId = user.id;
  queryOption.page = Number(queryOption.page) || 1;
  queryOption.pageSize = Number(queryOption.pageSize) || 10;

  try {
    const transactions = pagination
      ? await getTransactionsByUserId(queryOption)
      : await getTransactionByUserIdWithoutPagination(queryOption);

    if (!transactions?.length) {
      return h.response({
        error: "Transaction record is empty",
      }).code(404);
    }

    return h.response({
      message: "Successfully retrieve transactions data",
      data: transactions,
    }).code(200);
  } catch (error) {
    console.error('Error in getAllTransactions:', error);
    return h.response({
      error: "Internal server error",
    }).code(500);
  }
}

async function getAllTransactionsTypeComparison(request, h) {
  const user = request.user;
  const queryOption = ({ pagination, type, timeRange, limit } = request.query);
  queryOption.userId = user.id;

  try {
    const transactions = await getTransactionByUserIdWithoutPagination(queryOption);
    const transactionTypeComparison = getTransactionTypeComparisonFromTransaction(transactions);

    if (transactionTypeComparison.total === 0) {
      return h.response({
        error: "Transaction comparison record is empty",
      }).code(404);
    }

    return h.response({
      message: "Successfully retrieve transactions comparison",
      data: transactionTypeComparison,
    }).code(200);
  } catch (error) {
    console.error('Error in getAllTransactionsTypeComparison:', error);
    return h.response({
      error: "Internal server error",
    }).code(500);
  }
}

async function createNewTransactions(request, h) {
  try {
    const user = request.user;
    const { title, transactionType, amount, createdAt } = request.payload;

    // Validate required fields
    if (!title || !transactionType || amount === undefined || !createdAt) {
      return h.response({
        error: "Missing required fields",
      }).code(400);
    }

    // Validate transaction type
    if (!Object.values(TransactionType).includes(transactionType)) {
      return h.response({
        error: "Invalid transaction type",
        validTypes: Object.values(TransactionType),
      }).code(400);
    }

    // Validate amount
    const numAmount = Number(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      return h.response({
        error: "Amount must be a positive number",
      }).code(400);
    }

    // Validate date format
    const parsedDate = dayjs(createdAt);
    if (!parsedDate.isValid()) {
      return h.response({
        error: "Invalid date format for createdAt",
      }).code(400);
    }

    const transactionData = {
      title,
      type: transactionType,
      amount: numAmount,
      createdAt: parsedDate.toDate(),
      userId: user.id
    };

    const newTransaction = await createTransactions(transactionData);
    await updateSaldo(user.id, numAmount);

    return h.response({
      message: "Successfully created new transaction",
      data: newTransaction,
    }).code(201);
  } catch (error) {
    console.error('Error in createNewTransactions:', error);
    return h.response({
      error: "Internal server error",
    }).code(500);
  }
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
    const { id, title, transactionType, amount, createdAt } = request.payload;

    if (!id) {
      return h.response({
        error: "Transaction ID is required",
      }).code(400);
    }

    const existingTransaction = await getSingleTransactionByUserId(user.id, id);
    if (!existingTransaction) {
      return h.response({
        error: "Transaction not found",
      }).code(404);
    }

    const updateData = {};
    
    if (title) updateData.title = title;
    if (transactionType) {
      if (!Object.values(TransactionType).includes(transactionType)) {
        return h.response({
          error: "Invalid transaction type",
          validTypes: Object.values(TransactionType),
        }).code(400);
      }
      updateData.type = transactionType;
    }
    if (amount !== undefined) {
      const numAmount = Number(amount);
      if (isNaN(numAmount) || numAmount <= 0) {
        return h.response({
          error: "Amount must be a positive number",
        }).code(400);
      }
      updateData.amount = numAmount;
    }
    if (createdAt) {
      const parsedDate = dayjs(createdAt);
      if (!parsedDate.isValid()) {
        return h.response({
          error: "Invalid date format for createdAt",
        }).code(400);
      }
      updateData.createdAt = parsedDate.toDate();
    }

    const updatedTransaction = await updateTransaction(user.id, { id, ...updateData });

    if (updateData.amount) {
      const delta = updateData.amount - existingTransaction.amount;
      await updateSaldo(user.id, delta);
    }

    return h.response({
      message: "Successfully updated transaction",
      data: updatedTransaction,
    }).code(200);
  } catch (error) {
    console.error('Error in updateTransactions:', error);
    return h.response({
      error: "Internal server error",
    }).code(500);
  }
}

async function deleteTransaction(request, h) {
  try {
    const user = request.user;
    const { id } = request.payload;

    if (!id) {
      return h.response({
        error: "Transaction ID is required",
      }).code(400);
    }

    const transaction = await getSingleTransactionByUserId(user.id, id);
    if (!transaction) {
      return h.response({
        error: "Transaction not found",
      }).code(404);
    }

    await deleteTransactions(id);
    await updateSaldo(user.id, -transaction.amount);

    return h.response({
      message: `Successfully deleted transaction with id ${id}`,
    }).code(200);
  } catch (error) {
    console.error('Error in deleteTransaction:', error);
    return h.response({
      error: "Internal server error",
    }).code(500);
  }
}

async function updateSaldo(userId, amount) {
  try {
    const saldo = await getSaldoByUserId(userId);
    const currentAmount = Number(saldo.amount);
    const updateAmount = Number(amount);
    
    if (isNaN(currentAmount) || isNaN(updateAmount)) {
      throw new Error('Invalid amount format');
    }
    
    const newAmount = currentAmount + updateAmount;
    await updateSaldoByUserId(userId, newAmount);
  } catch (error) {
    console.error('Error in updateSaldo:', error);
    throw error;
  }
}

function getTransactionTypeComparisonFromTransaction(transactions) {
  const comparison = {
    total: 0
  };

  for (const transaction of transactions) {
    const type = transaction.type; // Updated to use the new schema
    const amount = Math.abs(Number(transaction.amount));

    if (!comparison[type]) {
      comparison[type] = 0;
    }

    comparison[type] += amount;
    comparison.total += amount;
  }

  return comparison;
}

module.exports = {
  getAllTransactionsTypeComparison,
  getAllTransactions,
  createNewTransactions,
  updateTransactions,
  deleteTransaction,
};
