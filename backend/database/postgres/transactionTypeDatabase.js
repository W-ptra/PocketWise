const { PrismaClient } = require("../../generated/prisma");
const prisma = new PrismaClient;

async function getTransactionTypesByIds(ids) {
    const where = {
        id:{
            in: ids
        }
    }

    return await prisma.transactionType.findMany({
        where
    });
}

async function getTransactionTypesByNames(names) {
    const where = {
        OR: names.map(name => ({
            name: {
                contains: name.toLowerCase(),
                mode: 'insensitive'
            }
        }))
    };

    return await prisma.transactionType.findMany({
        where,
    });
}

async function getTransactionTypesByName(name) {
    const where = {
         name: {
            contains: name.toLowerCase(),
            mode: 'insensitive'
        }
    }

    return await prisma.transactionType.findMany({
        where,
        take: 10
    });
}

async function createTransactionTypes(transactionTypes){
    return await prisma.transactionType.createMany({
        data: transactionTypes
    });
}

module.exports = {
    getTransactionTypesByIds,
    getTransactionTypesByNames,
    getTransactionTypesByName,
    createTransactionTypes,
}