const transactionTypeDB = require("../database/postgres/transactionTypeDatabase");
const { isInputInvalid } = require("../utils/validation")

async function getTransactionTypeByName(request,h){
    const { name } = request.query;
    
    if(isInputInvalid(name))
        return h.response({
            message:"invalid input"
        }).code(400);


    const transactionTypes = await transactionTypeDB.getTransactionTypesByName(name);

    return h.response({
        message:"success",
        data: transactionTypes
    }).code(200);
}

async function createNewTransactionType(request,h){
    const { name } = request.payload;
    
    if(isInputInvalid(name))
        return h.response({
            message:"invalid input"
        }).code(400);
    
    const newTransactionType = {
        name
    }

    const transactionTypes = await transactionTypeDB.createTransactionTypes(newTransactionType);

    return h.response({
        message:"success create new transactionTypes",
        data: transactionTypes
    }).code(200);
}

module.exports = {
    getTransactionTypeByName,
    createNewTransactionType
}