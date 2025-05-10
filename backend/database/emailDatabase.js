const { PrismaClient } = require("../generated/prisma");
const prisma = new PrismaClient;

async function createEmailLog(request,reponse){
    const data = {
        request,
        reponse
    }
    await prisma.emailLog.create({ data });
}

module.exports = {
    createEmailLog
}