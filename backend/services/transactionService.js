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
const customParseFormat = require("dayjs/plugin/customParseFormat");
const dayjs = require("dayjs");
dayjs.extend(customParseFormat);

const TransactionType = {
  Income: "Income",
  Rent: "Rent",
  Loan_Repayment: "Loan_Repayment",
  Insurance: "Insurance",
  Groceries: "Groceries",
  Transport: "Transport",
  Eating_Out: "Eating_Out",
  Entertainment: "Entertainment",
  Utilities: "Utilities",
  Healthcare: "Healthcare",
  Education: "Education",
};

async function getAllTransactions(request, h) {
  const user = request.user;

  const queryOption = ({
    type,
    timeRange,
    limit,
    pagination,
  } = request.query);

  pagination = pagination === "true" ? true : false;

  queryOption.userId = user.id;
  if (pagination) {
    queryOption.page = Number(queryOption.page) || 1;
    queryOption.pageSize = Number(queryOption.pageSize) || 10;
  }

  try {
    const transactions = pagination
      ? await getTransactionsByUserId(queryOption)
      : await getTransactionByUserIdWithoutPagination(queryOption);

    if (pagination) {
      return h
        .response({
          message: "Successfully retrieve transactions data",
          data: transactions || {
            data: [],
            total: 0,
            page: queryOption.page,
            pageSize: queryOption.pageSize,
            totalPages: 0,
          },
        })
        .code(200);
    }

    return h
      .response({
        message: "Successfully retrieve transactions data",
        data: transactions || [],
      })
      .code(200);
  } catch (error) {
    console.error("Error in getAllTransactions:", error);
    return h
      .response({
        error: "Internal server error",
      })
      .code(500);
  }
}

async function createNewTransactions(request, h) {
  try {
    const user = request.user;
    const { title, transactionType, amount, createdAt } = request.payload;

    // Validate required fields
    if (!title || !transactionType || amount === undefined || !createdAt) {
      return h
        .response({
          error: "Missing required fields",
        })
        .code(400);
    }

    // Validate transaction type
    if (!Object.values(TransactionType).includes(transactionType)) {
      return h
        .response({
          error: "Invalid transaction type",
          validTypes: Object.values(TransactionType),
        })
        .code(400);
    }

    // Validate amount
    const numAmount = Number(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      return h
        .response({
          error: "Amount must be a positive number",
        })
        .code(400);
    }

    // Validate date format
    const parsedDate = dayjs(createdAt);
    if (!parsedDate.isValid()) {
      return h
        .response({
          error: "Invalid date format for createdAt",
        })
        .code(400);
    }

    const transactionData = {
      title,
      type: transactionType,
      amount: numAmount,
      createdAt: parsedDate.toDate(),
      userId: user.id,
    };

    const newTransaction = await createTransactions(transactionData);
    if (transactionType === "Income") {
      await updateSaldo(user.id, numAmount);
    } else {
      await updateSaldo(user.id, -numAmount);
    }

    return h
      .response({
        message: "Successfully created new transaction",
        data: newTransaction,
      })
      .code(201);
  } catch (error) {
    console.error("Error in createNewTransactions:", error);
    return h
      .response({
        error: "Internal server error",
      })
      .code(500);
  }
}

async function updateTransactions(request, h) {
  try {
    const user = request.user;
    const { id, title, transactionType, amount, createdAt } = request.payload;

    if (!id) {
      return h
        .response({
          error: "Transaction ID is required",
        })
        .code(400);
    }

    const existingTransaction = await getSingleTransactionByUserId(user.id, id);
    if (!existingTransaction) {
      return h
        .response({
          error: "Transaction not found",
        })
        .code(404);
    }

    const updateData = {};

    if (title) updateData.title = title;
    if (transactionType) {
      if (!Object.values(TransactionType).includes(transactionType)) {
        return h
          .response({
            error: "Invalid transaction type",
            validTypes: Object.values(TransactionType),
          })
          .code(400);
      }
      updateData.type = transactionType;
    }
    if (amount !== undefined) {
      const numAmount = Number(amount);
      if (isNaN(numAmount) || numAmount <= 0) {
        return h
          .response({
            error: "Amount must be a positive number",
          })
          .code(400);
      }
      updateData.amount = numAmount;
    }
    if (createdAt) {
      const parsedDate = dayjs(createdAt);
      if (!parsedDate.isValid()) {
        return h
          .response({
            error: "Invalid date format for createdAt",
          })
          .code(400);
      }
      updateData.createdAt = parsedDate.toDate();
    }

    const updatedTransaction = await updateTransaction(user.id, {
      id,
      ...updateData,
    });

    if (updateData.amount) {
      const delta = updateData.amount - existingTransaction.amount;
      await updateSaldo(user.id, delta);
    }

    return h
      .response({
        message: "Successfully updated transaction",
        data: updatedTransaction,
      })
      .code(200);
  } catch (error) {
    console.error("Error in updateTransactions:", error);
    return h
      .response({
        error: "Internal server error",
      })
      .code(500);
  }
}

async function deleteTransaction(request, h) {
  try {
    const user = request.user;
    const { id } = request.payload;

    if (!id) {
      return h
        .response({
          error: "Transaction ID is required",
        })
        .code(400);
    }

    const transaction = await getSingleTransactionByUserId(user.id, id);
    if (!transaction) {
      return h
        .response({
          error: "Transaction not found",
        })
        .code(404);
    }

    await deleteTransactions(id);
    await updateSaldo(user.id, -transaction.amount);

    return h
      .response({
        message: `Successfully deleted transaction with id ${id}`,
      })
      .code(200);
  } catch (error) {
    console.error("Error in deleteTransaction:", error);
    return h
      .response({
        error: "Internal server error",
      })
      .code(500);
  }
}

async function updateSaldo(userId, amount) {
  try {
    const saldo = await getSaldoByUserId(userId);
    const currentAmount = Number(saldo.amount);
    const updateAmount = Number(amount);

    if (isNaN(currentAmount) || isNaN(updateAmount)) {
      throw new Error("Invalid amount format");
    }

    const newAmount = currentAmount + updateAmount;
    await updateSaldoByUserId(userId, newAmount);
  } catch (error) {
    console.error("Error in updateSaldo:", error);
    throw error;
  }
}

module.exports = {
  getAllTransactions,
  createNewTransactions,
  updateTransactions,
  deleteTransaction,
};
