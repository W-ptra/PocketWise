const { createUser, upsertUser, getUserByEmail, updatePassword } = require("../database/postgres/userDatabase");
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

const frontendHost = process.env.FRONTEND_HOST;
const backendHost = process.env.BACKEND_HOST;
const googleOauthClientId = process.env.GOOGLE_OAUTH_CLIENT_ID;
const googleOauthClientSecret = process.env.GOOGLE_OAUTH_CLIENT_SECRET;

async function login(request,h){
    const { email, password } = request.payload;
    
    if(isInputInvalid(email,password))
        return h.response({
            error:"input is invalid"
        }).code(400);
    
    const user = await getUserByEmail(email);
    if (user === null){
        return h.response({
            error:`User with email ${email} is not found`
        }).code(404);
    }

    if (user.authMethod !== "web"){
        return h.response({
            error:`User with email ${email} is not found`
        }).code(404);
    }

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
        password: hashedPassword,
        authMethod: "web"
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

    if (user.authMethod !== "web")
         return h.response({
            error:`User with email ${email} is not found`
        }).code(404);

    const isAlreadyRequested = await isEmailAlreadyRequestResetLink(email);

    if(isAlreadyRequested)
        return h.response({
            error:`user with email ${email} already requesting a reset link`
        }).code(409);

    const uniqueString = getUuidv4();
    const url = `${frontendHost}/change-password/${uniqueString}`;

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

    const user = await getUserByEmail(email);

    if (user.authMethod !== "web")
         return h.response({
            error:`User with email ${email} is not found`
        }).code(404);

    const hashedPassword =  await hashPassword(password);
    await updatePassword(user.id,hashedPassword);
    
    await deleteValue(email,uniqueString);

    return h.response({
        message:`password successfully update`
    }).code(201);
}

async function handleGoogleOauthCallback(request, h) {
    const { code } = request.query;

    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            client_id: googleOauthClientId,
            client_secret: googleOauthClientSecret,
            code,
            redirect_uri: `${backendHost}/api/auth/google/callback`,
            grant_type: 'authorization_code',
        }),
    });

    if (!tokenResponse.ok) {
        console.error("Failed to fetch tokens:", await tokenResponse.text());
        return h.response("Failed to authenticate with Google").code(400);
    }

    const tokenData = await tokenResponse.json();
    const { access_token } = tokenData;

    const userInfoResponse = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
        method: "GET",
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
    });

    if (!userInfoResponse.ok) {
        console.error("Failed to fetch user info:", await userInfoResponse.text());
        return h.response("Failed to fetch user details").code(400);
    }

    const userInfo = await userInfoResponse.json();
    
    const user = await upsertUserFromGoogleOauth(userInfo);
    console.log(user)
    const jwtToken = generateJwt(user);
    const redirectUrl = `${frontendHost}/auth/google/callback?token=${jwtToken}`;

    return h.redirect(redirectUrl).code(302);
}

async function upsertUserFromGoogleOauth(user){
    const newUser = {
        name:               user.name,
        email:              user.email,
        profileImageUrl:    user.picture,
        googleId:           user.sub,
        authMethod:         "google"
    }
    
    return await upsertUser(newUser);
}

module.exports = {
    login,
    register,
    requestResetPassword,
    changePassword,
    handleGoogleOauthCallback
}