const { PrismaClient } = require("../../generated/prisma");
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

async function getUserById(id){
    const where = { id }
    const select = {
        id:         true,
        email:      true,
        name:       true,
    }
    const user = await prisma.user.findFirst({where,select});
    return user;
}

async function updateUser(id,name){
    const where = { id };
    const data = { 
        name
    }
    const user = await prisma.user.update({
        where,
        data
    })
    return user;
}

async function updateEmail(id,email){
    const where = { id };
    const data = { 
        email
    }
    const user = await prisma.user.update({
        where,
        data
    })
    return user;
}

async function updatePassword(id,password){
     const where = { id };
    const data = { 
        password
    }
    const user = await prisma.user.update({
        where,
        data
    })
    return user;
}

module.exports = {
    createUser,
    getUserByEmail,
    getUserById,
    updateUser,
    updateEmail,
    updatePassword
}