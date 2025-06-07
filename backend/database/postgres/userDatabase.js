const { PrismaClient } = require("../../generated/prisma");
const prisma = new PrismaClient();

async function createUser(user) {
  const data = {
    name: user.name,
    email: user.email,
    password: user.password,
    profileImageUrl: user.profileImageUrl,
    authMethod: user.authMethod,
  };
  const newUser = await prisma.user.create({ data });
  return newUser;
}

async function upsertUser(user) {
  const data = {
    name: user.name,
    email: user.email,
    googleId: user.googleId,
    profileImageUrl: user.profileImageUrl,
    authMethod: user.authMethod,
  };
  try {
    const upsertedUser = await prisma.user.upsert({
      where: {
        googleId: user.googleId,
<<<<<<< HEAD
        profileImageUrl: user.profileImageUrl,
        authMethod: user.authMethod 
    };
    const upsertedUser = await prisma.user.upsert({
        where: {
            googleId: user.googleId
        },
        update: data,
        create: data,
    });
    
    return upsertedUser;
=======
      },
      update: data,
      create: data,
    });

    return upsertedUser;
  } catch (err) {
    console.log(err);
  }
>>>>>>> 93950df4b810ddb3b6e861fe9975189ff1e4007b
}

async function getUserByEmail(email) {
  const where = { email };
  const select = {
    id: true,
    googleId: true,
    email: true,
    name: true,
    authMethod: true,
    password: true,
  };
  const user = await prisma.user.findFirst({ where, select });
  return user;
}

async function getUserById(id) {
  const where = { id };
  const select = {
    id: true,
    googleId: true,
    email: true,
    name: true,
    profileImageUrl: true,
    authMethod: true,
  };
  const user = await prisma.user.findFirst({ where, select });
  return user;
}

async function updateUser(id, name) {
  const where = { id };
  const data = {
    name,
  };
  const user = await prisma.user.update({
    where,
    data,
  });
  return user;
}

async function updateEmail(id, email) {
  const where = { id };
  const data = {
    email,
  };
  const user = await prisma.user.update({
    where,
    data,
  });
  return user;
}

async function updateUserProfileImage(id, url) {
  const where = { id };
  const data = {
    profileImageUrl: url,
  };
  const user = await prisma.user.update({
    where,
    data,
  });
  return user;
}

<<<<<<< HEAD
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
=======
async function updatePassword(id, password) {
  const where = { id };
  const data = {
    password,
  };
  const user = await prisma.user.update({
    where,
    data,
  });
  return user;
>>>>>>> 93950df4b810ddb3b6e861fe9975189ff1e4007b
}

module.exports = {
  createUser,
  upsertUser,
  getUserByEmail,
  getUserById,
  updateUser,
  updateEmail,
  updateUserProfileImage,
  updatePassword,
};
