const { PrismaClient } = require("../generated/prisma");
const prisma = new PrismaClient;

async function createUser(user){
    const data = {
        name:       user.name,
        email:      user.email,
        password:   user.password
    }
    const newUser = await prisma.user.create({ data });
    return newUser;
}

async function getUserByEmail(email){
    const where = { email }
    const select = {
        id:         true,
        email:      true,
        name:       true,
        password:   true,
    }
    const user = await prisma.user.findFirst({where,select});
    return user;
}

module.exports = {
    createUser,
    getUserByEmail
}