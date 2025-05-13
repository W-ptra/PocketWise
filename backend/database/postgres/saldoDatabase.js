const { PrismaClient } = require("../../generated/prisma");
const prisma = new PrismaClient();

async function createNewSaldo(userId){
    return await prisma.saldo.create({
        data:{
            amount:0,
            userId
        }
    })
}

async function getSaldoByUserId(userId){
    return await prisma.saldo.findFirst({
        where: {
            userId
        },
        select: {
            amount: true
        }
    })
}

async function updateSaldoByUserId(userId,amount){
    return await prisma.saldo.update({
        where: {
            userId
        },
        data: {
            amount
        }
    })
}

module.exports = {
    createNewSaldo,
    getSaldoByUserId,
    updateSaldoByUserId
}