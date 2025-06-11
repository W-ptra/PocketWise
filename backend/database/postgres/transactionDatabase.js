const { PrismaClient } = require("../../generated/prisma");
const prisma = new PrismaClient();

async function createTransactions(transaction) {
  return await prisma.transaction.create({
    data: transaction,
  });
}

async function getSingleTransactionByUserId(userId, transactionId) {
  return await prisma.transaction.findFirst({
    where: {
      id: transactionId,
      userId: userId,
    },
  });
}

async function getTransactionByUserIdWithoutPagination(option = {}) {
  const queryOption = queryOptionBuilderWithoutPagination(option);

  const data = await prisma.transaction.findMany({
    ...queryOption,
    select: {
      id: true,
      title: true,
      amount: true,
      createdAt: true,
      type: true,
    },
  });

  return data;
}

async function getTransactionsByUserId(option = {}) {
  let { userId, page = 1, pageSize = 10 } = option;
  page = page || 1;
  pageSize = pageSize || 10;

  const queryOption = queryOptionBuilder(option);
  const [data, total] = await Promise.all([
    prisma.transaction.findMany({
      ...queryOption,
      select: {
        id: true,
        title: true,
        amount: true,
        createdAt: true,
        type: true,
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.transaction.count({
      where: { userId },
    }),
  ]);

  return {
    data,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };
}

async function getTransactionsByIds(ids) {
  const where = {
    id: {
      in: ids,
    },
  };
  return await prisma.transaction.findMany({
    where,
  });
}

async function updateTransaction(userId, transaction) {
  return await prisma.transaction.update({
    where: {
      id: transaction.id,
      userId: userId,
    },
    data: {
      title: transaction.title,
      amount: transaction.amount,
      createdAt: transaction.createdAt,
      type: transaction.type,
    },
  });
}

async function getExpensesByUserId(userId, queryOption = {}) {
  const { timeRange } = queryOption;
  let createdAtFilter;

  if (timeRange && timeRange !== "alltime") {
    const now = new Date();
    let fromDate = new Date(now);

    if (timeRange === "day") {
      fromDate.setDate(fromDate.getDate() - 1);
    } else if (timeRange === "week") {
      fromDate.setDate(fromDate.getDate() - 7);
    } else if (timeRange === "month") {
      fromDate.setMonth(fromDate.getMonth() - 1);
    } else if (timeRange === "year") {
      fromDate.setFullYear(fromDate.getFullYear() - 1);
    }

    fromDate.setHours(0, 0, 0, 0);

    createdAtFilter = {
      gte: fromDate,
    };
  }

  return await prisma.transaction.findMany({
    where: {
      userId,
      type: {
        not: "Income",
      },
      ...(createdAtFilter && { createdAt: createdAtFilter }),
    },
    orderBy: {
      createdAt: 'desc'
    },
    select: {
      id: true,
      title: true,
      amount: true,
      createdAt: true,
      type: true,
    },
  });
}

async function getIncomeByUserId(userId, queryOption = {}) {
  const { timeRange } = queryOption;
  let createdAtFilter;

  if (timeRange  && timeRange !== "alltime") {
    const now = new Date();
    let fromDate = new Date(now);

    if (timeRange === "day") {
      fromDate.setDate(fromDate.getDate() - 1);
    } else if (timeRange === "week") {
      fromDate.setDate(fromDate.getDate() - 7);
    } else if (timeRange === "month") {
      fromDate.setMonth(fromDate.getMonth() - 1);
    } else if (timeRange === "year") {
      fromDate.setFullYear(fromDate.getFullYear() - 1);
    }

    fromDate.setHours(0, 0, 0, 0);

    createdAtFilter = {
      gte: fromDate,
    };
  }

  return await prisma.transaction.findMany({
    where: {
      userId,
      type: "Income",
      ...(createdAtFilter && { createdAt: createdAtFilter }),
    },
    orderBy: {
      createdAt: 'desc'
    },
    select: {
      id: true,
      title: true,
      amount: true,
      createdAt: true,
      type: true,
    },
  });
}

async function deleteTransactions(transactionId) {
  return await prisma.transaction.delete({
    where: {
      id: transactionId,
    },
  });
}

function queryOptionBuilder(option = {}) {
  const { userId, page, pageSize, type, timeRange, limit } = option;

  let amountFilter;
  let createdAtFilter;
  let orderBy;

  if (type === "expense") {
    amountFilter = { lt: 0 };
    orderBy = { amount: "asc" };
  } else if (type === "income") {
    amountFilter = { gt: 0 };
    orderBy = { amount: "desc" };
  } else {
    orderBy = { createdAt: "desc" };
  }

  if (timeRange) {
    const now = new Date();
    let fromDate = new Date(now);

    if (timeRange === "day") {
      fromDate.setDate(fromDate.getDate() - 1);
    } else if (timeRange === "week") {
      fromDate.setDate(fromDate.getDate() - 7);
    } else if (timeRange === "month") {
      fromDate.setMonth(fromDate.getMonth() - 1);
    } else if (timeRange === "year") {
      fromDate.setFullYear(fromDate.getFullYear() - 1);
    }

    fromDate.setHours(0, 0, 0, 0);

    createdAtFilter = {
      gte: fromDate,
    };
  }

  return {
    where: {
      userId,
      ...(amountFilter && { amount: amountFilter }),
      ...(createdAtFilter && { createdAt: createdAtFilter }),
    },
    orderBy,
  };
}

function queryOptionBuilderWithoutPagination(option = {}) {
  const { userId, type, timeRange } = option;

  let amountFilter;
  let createdAtFilter;
  let orderBy;

  if (type === "expense") {
    orderBy = { amount: "asc" };
  } else {
    orderBy = { createdAt: "desc" };
  }

  if (timeRange && timeRange !== "alltime") {
    const now = new Date();
    let fromDate = new Date(now);

    if (timeRange === "day") {
      fromDate.setDate(fromDate.getDate() - 1);
    } else if (timeRange === "week") {
      fromDate.setDate(fromDate.getDate() - 7);
    } else if (timeRange === "month") {
      fromDate.setMonth(fromDate.getMonth() - 1);
    } else if (timeRange === "year") {
      fromDate.setFullYear(fromDate.getFullYear() - 1);
    }

    fromDate.setHours(0, 0, 0, 0);

    createdAtFilter = {
      gte: fromDate,
    };
  }

  return {
    where: {
      userId,
      ...(amountFilter && { amount: amountFilter }),
      ...(createdAtFilter && { createdAt: createdAtFilter }),
    },
    orderBy,
  };
}

module.exports = {
  getTransactionByUserIdWithoutPagination,
  createTransactions,
  getSingleTransactionByUserId,
  getTransactionsByIds,
  getTransactionsByUserId,
  updateTransaction,
  deleteTransactions,
  getExpensesByUserId,
  getIncomeByUserId,
};
