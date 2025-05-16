const { get,set,del } = require("./redis");

const ttl = 60*60;

async function setForgotPasswordUniqueString(uniqueString,userEmail){
    /*
        ttl = time to live
        1 hour = 60 minutes * 60 seconds
    */
   await set(uniqueString,userEmail,ttl);
}

async function getForgotPasswordUniqueString(uniqueString){
    return await get(uniqueString);
}

async function isEmailAlreadyRequestResetLink(email){
    const key = `email:${email}`;
    const alreadyRequested = await get(key);

    if(!alreadyRequested){
        await set(key,"true",ttl);
        return false;
    }
    return true;
}

async function deleteValue(email,uniqueString){
    const key = `email:${email}`;
    await del(key);
    return await del(uniqueString);
}

module.exports = {
    setForgotPasswordUniqueString,
    getForgotPasswordUniqueString,
    isEmailAlreadyRequestResetLink,
    deleteValue
}