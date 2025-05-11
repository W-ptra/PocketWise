const { getUserByEmail, updateEmail, updateUser }  = require("../database/postgres/userDatabase");
const { isInputInvalid }  = require("../utils/validation");

async function getUserProfile(request,h){
    return h.response({
        message:`success get user profile`,
        data: {
            id: request.user.id,
            name: request.user.name,
            email: request.user.email
        }
    }).code(200);
}

async function updateUserProfile(request,h){
    const user = request.user;

    const { name } = request.payload;

    if(isInputInvalid(name))
        return h.response({
            error:"input is invalid"
        }).code(400);

    await updateUser(user.id,name);

    return h.response({
        message:`successfully update user profile`
    }).code(200);
}

async function updateUserEmail(request,h){
    const user = request.user;

    const { email } = request.payload;

    if(isInputInvalid(email))
        return h.response({
            error:"input is invalid"
        }).code(400);

    const isEmailExist = await getUserByEmail(email);
    if (isEmailExist)
        return h.response({
            error:`email ${email} already being use`
        }).code(409);

    await updateEmail(user.id,email);

    return h.response({
        message:`successfully update user email ${email}`
    }).code(200);
}

module.exports = {
    getUserProfile,
    updateUserProfile,
    updateUserEmail
}