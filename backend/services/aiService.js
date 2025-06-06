const { ocr } = require("../utils/AI")
const {
  getTransactionsByUserId,
  getTransactionByUserIdWithoutPagination,
} = require("../database/postgres/transactionDatabase");
const { setMlJournal,getMlJournal } = require("../database/redis/cacheMlJournal");
const { isInputInvalid } = require("../utils/validation");
require("dotenv").config();

const ML_HOST = process.env.ML_HOST;
const PERMITTED_TIME_RANGE = [ "week","month","year" ];

async function getTransactionsUsingOcr(request, h) {
    const data = request.payload;
    const image = data.image;

    if (!image || typeof image._read !== "function") {
        return h.response({ error: "Image is required and must be a file." }).code(400);
    }

    const chunks = [];
    for await (const chunk of image) {
        chunks.push(chunk);
    }
    const buffer = Buffer.concat(chunks);
    const base64Image = buffer.toString("base64");

    const mimeType = image.hapi.headers["content-type"];
    const base64String = `data:${mimeType};base64,${base64Image}`;
    const transactions = await ocr(base64String);

    return h
        .response({
        message: "successfully retrive transactions",
        data: transactions,
        })
        .code(200);
}

async function getDailyJournal(request,h) {
    const journalType = "daily";
    const user = request.user;
    const { timeRange } = request.query;

    if (isInputInvalid(timeRange)){
        return h
            .response({
            message: "invalid input",
            })
            .code(400);
    }

    if(!PERMITTED_TIME_RANGE.includes(timeRange)){
        return h
            .response({
            message: "invalid input",
            })
            .code(400);
    }

    const queryOption = {
        userId: user.id,
        type: "top-expense"
    }

    const transactions = await getTransactionByUserIdWithoutPagination(queryOption);
    const journal_entry = formatMlDayRequest(transactions);

    const mlJournalCache = await getMlJournal(`${journalType}:${timeRange}`,journal_entry)

    if(mlJournalCache){
        return h
            .response({
                message: "successfully retrive month journal",
                data: mlJournalCache
            })
            .code(200);
    }

    if(journal_entry.length < 7){
        return h
            .response({
                message: "expense record must at least 7 or more",
            })
            .code(404);
    }

        const option = {
        method: "POST",
        headers: {
            "Content-Type":"application/json"
        },
        body: JSON.stringify({journal_entry})
    }
    
    const result = await fetch(`${ML_HOST}/journal/day?time=${timeRange}`,option);
    const data = await result.json();

    const respond = {
        prediction: data.predicted_expense_next_7_days,
        prediction_raw: data.raw_values
    }

    setMlJournal(`${journalType}:${timeRange}`,journal_entry,respond);

    return h
        .response({
            message: "successfully retrive month journal",
            data: respond
        })
        .code(200);
}

function formatMlDayRequest(transactions) {
    let dateTotalExpense = {};
    
    transactions.forEach(transaction => {
        const date = new Date(transaction.createdAt).toISOString().split('T')[0];

        let amount = typeof transaction.amount === "number"
            ? transaction.amount
            : parseInt(transaction.amount);

        amount = amount > 0 ? amount : -amount;

        dateTotalExpense[date] = (dateTotalExpense[date] || 0) + amount;
    });

    let journal_entry = [];
    
    for (key in dateTotalExpense){
        journal_entry.push({
            Date: key,
            Total_Expense: dateTotalExpense[key]
        })
    }
    
    return journal_entry;
}

async function getMonthJournay(request,h) {
    const journalType = "monthly";
    const user = request.user;

    const pagination = {
        page: 1,
        pageSize: 100,
    }

    const timeRange = "month";

    const limit = 100;

    const queryOption = {
        pagination,
        timeRange,
        limit,
        userId: user.id
    }

    const transactions = await getTransactionByUserIdWithoutPagination(queryOption);

    if(transactions.length === 0){
        return h
            .response({
                message: "transaction record is empty",
            })
            .code(404);
    }

    const mlJournalCache = await getMlJournal(`ml:${journalType}:${transactions}`,transactions)

    if (mlJournalCache){
        return h
            .response({
            message: "successfully retrive month journal",
            data: mlJournalCache,
            })
            .code(200);
    }

    const journal_entry = formatMlMonthlyRequest(transactions);

    const option = {
        method: "POST",
        headers: {
            "Content-Type":"application/json"
        },
        body: JSON.stringify({journal_entry})
    }
    
    const result = await fetch(`${ML_HOST}/journal/month`,option);
    const data = await result.json();

    setMlJournal(journalType,transactions,data);

    return h
        .response({
        message: "successfully retrive month journal",
        data: data,
        })
        .code(200);
}

function formatMlMonthlyRequest(transactions){
    const journal_entry = {
      Income: 0,
      Rent: 0,
      Loan_Repayment: 0,
      Insurance: 0,
      Groceries: 0,
      Transport: 0,
      Eating_Out: 0,
      Entertainment: 0,
      Utilities: 0,
      Healthcare: 0,
      Education: 0
    }

    transactions.forEach(transaction => {
        const type = transaction.transactionType.name;
        const amount = Math.abs(transaction.amount);
        if (journal_entry.hasOwnProperty(type)) {
            journal_entry[type] += amount;
        }
    });

    return journal_entry;
}

module.exports = {
    getTransactionsUsingOcr,
    getDailyJournal,
    getMonthJournay
}