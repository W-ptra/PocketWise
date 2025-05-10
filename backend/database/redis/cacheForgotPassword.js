const { get,set } = require("./redis");

async function setForgotPasswordUniqueString(uniqueString,userId){
    const ttl = 60*60;
    /*
        ttl = time to live
        1 hour = 60 minutes * 60 seconds
    */
   await set(uniqueString,userId,ttl);
}

async function getForgotPasswordUniqueString(uniqueString){
    return await get(uniqueString);
}

module.exports = {
    setForgotPasswordUniqueString,
    getForgotPasswordUniqueString
}