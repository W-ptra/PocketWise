const { get,set,del } = require("./redis");

async function setForgotPasswordUniqueString(uniqueString,userEmail){
    const ttl = 60*60;
    /*
        ttl = time to live
        1 hour = 60 minutes * 60 seconds
    */
   await set(uniqueString,userEmail,ttl);
}

async function getForgotPasswordUniqueString(uniqueString){
    return await get(uniqueString);
}

async function deleteValue(uniqueString){
    return await del(uniqueString);
}

module.exports = {
    setForgotPasswordUniqueString,
    getForgotPasswordUniqueString,
    deleteValue
}