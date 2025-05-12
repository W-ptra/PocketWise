const { PrismaClient } = require("../../generated/prisma");
const prisma = new PrismaClient();
const dayjs = require("dayjs");

async function createTransactions(transactions) {
  console.log(transactions)
  try {
    const created = [];
    for (const tx of transactions) {
      const result = await prisma.transaction.create({ data: tx });
      created.push(result);
    }
    return created;
  } catch (err) {
    console.log(err);
  }
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

  try {
    const data = await prisma.transaction.findMany({
      ...queryOption,
      select: {
        transactionType: true,
      },
    });

    return data;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

async function getTransactionsByUserId(option = {}) {
  const { userId, pagination = {} } = option;
  const page = pagination.page || 1;
  const pageSize = pagination.pageSize || 10;

  const queryOption = queryOptionBuilder(option);

  try {
    const [data, total] = await Promise.all([
      prisma.transaction.findMany({
        ...queryOption,
        select: {
          id: true,
          title: true,
          amount: true,
          createdAt: true,
          transactionType: true,
        },
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
  } catch (err) {
    console.log(err);
  }
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

async function updateTransaction(userId, transactionList) {
  return await Promise.all(
    transactionList.map(tx =>
      prisma.transaction.update({
        where: {
          id: tx.id,
          userId: userId
        },
        data: {
          title: tx.title,
          amount: tx.amount,
          createdAt: tx.createdAt,
          transactionTypeId: tx.transactionTypeId
        }
      })
    )
  );
}

async function deleteTransactions(transactionId) {
  return await prisma.transaction.deleteMany({
    where: {
      id: {
        in: transactionId
      },
    },
  });
}

function queryOptionBuilder(option = {}) {
  const {
    userId,
    pagination = {},
    type,
    timeRange,
    limit,
  } = option;
  const page = parseInt(pagination.page) || 1;
  const pageSize = parseInt(pagination.pageSize) || 10;

  let amountFilter;
  let createdAtFilter;
  let orderBy;

  if (type === "top-expense") {
    amountFilter = { lt: 0 };
    orderBy = { amount: "asc" };
  } else if (type === "top-income") {
    amountFilter = { gt: 0 };
    orderBy = { amount: "desc" };
  } else {
    orderBy = { createdAt: "desc" };
  }

  if (timeRange) {
    if (timeRange === "day") {
      createdAtFilter = {
        gte: dayjs().subtract(1, "day").startOf("day").toDate(),
      };
    } else if (timeRange === "month") {
      createdAtFilter = {
        gte: dayjs().subtract(1, "month").startOf("day").toDate(),
      };
    } else if (timeRange === "year") {
      createdAtFilter = {
        gte: dayjs().subtract(1, "year").startOf("day").toDate(),
      };
    }
  }

  return {
    where: {
      userId,
      ...(amountFilter && { amount: amountFilter }),
      ...(createdAtFilter && { createdAt: createdAtFilter }),
    },
    orderBy,
    ...(type ? { take: parseInt(limit) || 5 } : {
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
  };
}

function queryOptionBuilderWithoutPagination(option = {}) {
  const {
    userId,
    type,
    timeRange,
  } = option;

  let amountFilter;
  let createdAtFilter;
  let orderBy;

  if (type === "top-expense") {
    amountFilter = { lt: 0 };
    orderBy = { amount: "asc" };
  } else if (type === "top-income") {
    amountFilter = { gt: 0 };
    orderBy = { amount: "desc" };
  } else {
    orderBy = { createdAt: "desc" };
  }

  if (type && ["top-expense", "top-income"].includes(type) && timeRange) {
    if (timeRange === "day") {
      createdAtFilter = {
        gte: dayjs().subtract(1, "day").startOf("day").toDate(),
      };
    } else if (timeRange === "month") {
      createdAtFilter = {
        gte: dayjs().subtract(1, "month").startOf("day").toDate(),
      };
    } else if (timeRange === "year") {
      createdAtFilter = {
        gte: dayjs().subtract(1, "year").startOf("day").toDate(),
      };
    }
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
};
