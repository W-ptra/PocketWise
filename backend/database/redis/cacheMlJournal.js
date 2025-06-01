const { get,set } = require("./redis");

const ttl = 60*60;

async function setMlJournal(type,transactions,result){
    const transactionsString = JSON.stringify(transactions);
    const key = `ml_journal:${type}:${transactionsString}`;
    const value = JSON.stringify(result);
    await set(key,value,ttl);
}

async function getMlJournal(type,transactions){
    const transactionsString = JSON.stringify(transactions);
    const key = `ml_journal:${type}:${transactionsString}`;
    const value = await get(key);
    return JSON.parse(value);
}

module.exports = {
    setMlJournal,
    getMlJournal
}