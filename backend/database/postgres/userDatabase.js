const { PrismaClient } = require("../../generated/prisma");
const prisma = new PrismaClient;

async function createUser(user){
    const data = {
        name:               user.name,
        email:              user.email,
        password:           user.password,
        profileImageUrl:    user.profileImageUrl,
        authMethod:         user.authMethod
    }
    const newUser = await prisma.user.create({ data });
    return newUser;
}

async function upsertUser(user) {
    const data = {
        name: user.name,
        email: user.email,
        googleId: user.googleId,
        profileImageUrl: user.profileImageUrl,
        authMethod: user.authMethod 
    };
    try{
        const upsertedUser = await prisma.user.upsert({
            where: {
                googleId: user.googleId
            },
            update: data,
            create: data,
        });
    
        return upsertedUser;
    }
    catch(err){
        console.log(err)
    }
}

async function getUserByEmail(email){
    const where = { email }
    const select = {
        id:         true,
        googleId:   true,
        email:      true,
        name:       true,
        authMethod: true,
        password:   true,
    }
    const user = await prisma.user.findFirst({where,select});
    return user;
}

async function getUserById(id){
    const where = { id }
    const select = {
        id:                 true,
        googleId:           true,
        email:              true,
        name:               true,
        profileImageUrl:    true,
        authMethod:         true,
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
    upsertUser,
    getUserByEmail,
    getUserById,
    updateUser,
    updateEmail,
    updatePassword
}