const { PrismaClient } = require("../../generated/prisma");
const prisma = new PrismaClient();

async function createTransactions(transactions) {
  try{
      return await prisma.transaction.createMany({
    data: transactions,
  });
  } catch(err){
    console.log(err)
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

async function getTransactionsByUserId(
  userId,
  pagination = { page: 1, pageSize: 10 }
) {
  const { page = 1, pageSize = 10 } = pagination;
  try{
    const [data, total] = await Promise.all([
      prisma.transaction.findMany({
        where: { userId },
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: "desc" },
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
  } catch(err){
    console.log(err)
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

module.exports = {
  createTransactions,
  getSingleTransactionByUserId,
  getTransactionsByIds,
  getTransactionsByUserId,
  updateTransaction,
  deleteTransactions,
};
