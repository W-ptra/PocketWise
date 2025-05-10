const { PrismaClient } = require("../../generated/prisma");
const prisma = new PrismaClient;

async function createTransactions(transactions){
    return await prisma.transaction.createMany({
        data: transactions
    })
}

async function getSingleTransactionByUserId(userId, transactionId) {
  return await prisma.transaction.findFirst({
    where: {
      id: transactionId,
      userId: userId
    }
  });
}

async function getTransactionsByUserId(userId, pagination = { page: 1, pageSize: 10 }) {
  const { page = 1, pageSize = 10 } = pagination;

  const [data, total] = await Promise.all([
    prisma.transaction.findMany({
      where: { userId },
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        amount: true,
        type: true,
        createdAt: true
      }
    }),
    prisma.transaction.count({
      where: { userId }
    })
  ]);

  return {
    data,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize)
  };
}

async function getTransactionsByIds(ids) {
    const where = {
        ids:{
            in: ids
        }
    }
    return await prisma.transaction.findMany({
        where
    });
}

async function updateTransaction(userId, transactionId, updateData) {
  return await prisma.transaction.updateMany({
    where: {
      id: transactionId,
      userId: userId
    },
    data: updateData
  });
}

async function deleteTransactions(transactionId) {
  return await prisma.transaction.deleteMany({
    where: {
      id: transactionId
    }
  });
}

module.exports = {
    createTransactions,
    getSingleTransactionByUserId,
    getTransactionsByIds,
    getTransactionsByUserId,
    updateTransaction,
    deleteTransactions
}