const { isInputInvalid } = require("../utils/validation")
const { createUser,getUserByEmail } = require("../model/userModel")
const { hashPassword,comparePassword } = require("../utils/hashing")
const { generateJwt } = require("../utils/jwt");

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

    return h.response({
        message:`successfully create new user with id: ${newUser.id}`
    }).code(201);
}

module.exports = {
    login,
    register
}