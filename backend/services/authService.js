const { createUser, getUserByEmail, updatePassword } = require("../database/postgres/userDatabase");
const { createNewSaldo } = require("../database/postgres/saldoDatabase");
const { hashPassword, comparePassword } = require("../utils/hashing");
const { sendPasswordResetEmail } = require("../utils/email");
const { isInputInvalid } = require("../utils/validation");
const { getUuidv4 } = require("../utils/random");
const { generateJwt } = require("../utils/jwt");
const { 
    setForgotPasswordUniqueString, 
    getForgotPasswordUniqueString,
    isEmailAlreadyRequestResetLink,
    deleteValue 
} = require("../database/redis/cacheForgotPassword");
require("dotenv").config();

const host = process.env.HOST;

async function login(request,h){
    const { email, password } = request.payload;
    
    if(isInputInvalid(email,password))
        return h.response({
            error:"input is invalid"
        }).code(400);
    
    const user = await getUserByEmail(email);
    if (user === null)
        return h.response({
            error:`User with email ${email} is not found`
        }).code(404);

    const isPasswordMatch = await comparePassword(password,user.password);
    if (!isPasswordMatch)
        return h.response({
            error:`Wrong password`
        }).code(401);

    const token = generateJwt(user);

    return {
        message: `successfully login`,
        token
    }
}

async function register(request,h){
    const { name, email, password } = request.payload;
    
    if(isInputInvalid(name,email,password))
        return h.response({
            error:"input is invalid"
        }).code(400);

    const isUserExist = await getUserByEmail(email);

    if(isUserExist)
        return h.response({
            error:`user with email ${email} already registered`
        }).code(409);

    const hashedPassword = await hashPassword(password);
    const user = {
        name,
        email,
        password: hashedPassword
    }

    const newUser = await createUser(user);

    await createNewSaldo(newUser.id);

    return h.response({
        message:`successfully create new user with id: ${newUser.id}`
    }).code(201);
}

async function requestResetPassword(request,h){
    const { email } = request.payload;

    if(isInputInvalid(email))
        return h.response({
            error:"input is invalid"
        }).code(400);

    const user = await getUserByEmail(email);
    if(!user)
        return h.response({
            error:`user with email ${email} doesn't exist`
        }).code(409);

    const isAlreadyRequested = await isEmailAlreadyRequestResetLink(email);

    if(isAlreadyRequested)
        return h.response({
            error:`user with email ${email} already requesting a reset link`
        }).code(409);

    const uniqueString = getUuidv4();
    const url = `${host}/change-password/${uniqueString}`;

    await setForgotPasswordUniqueString(uniqueString,email);
    await sendPasswordResetEmail(email,url);
    
    return h.response({
        message:`reset password link has been sent to ${email}`
    }).code(200);
}

async function changePassword(request,h){
    const uniqueString = request.params.id;
    const { password } = request.payload;

    if(isInputInvalid(password))
        return h.response({
            error:"input is invalid"
        }).code(400);

    const email = await getForgotPasswordUniqueString(uniqueString);

    if(!email)
        return h.response({
            error:"reset password link might expired or invalid"
        }).code(400);

    let user = await getUserByEmail(email);
    const hashedPassword =  await hashPassword(password);
    await updatePassword(user.id,hashedPassword);
    
    await deleteValue(email,uniqueString);

    return h.response({
        message:`password successfully update`
    }).code(201);
}

module.exports = {
    login,
    register,
    requestResetPassword,
    changePassword
}