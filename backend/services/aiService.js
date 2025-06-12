const { ocr, ask } = require("../utils/AI")
const {
  getTransactionByUserIdWithoutPagination,
  createTransactions,
} = require("../database/postgres/transactionDatabase");
const { setMlJournal,getMlJournal } = require("../database/redis/cacheMlJournal");
const { isInputInvalid } = require("../utils/validation");
const { getMonthlyAnalysisSchema,getTimePredictionPrompt,getAiSuggestionPrompt, getPdfOcrSchema } = require("../utils/schema");
const pdfParse = require('pdf-parse');
const customParseFormat = require("dayjs/plugin/customParseFormat");
const dayjs = require("dayjs");
const { getSaldoByUserId, updateSaldoByUserId } = require("../database/postgres/saldoDatabase");
dayjs.extend(customParseFormat);
require("dotenv").config();

const ML_HOST = process.env.ML_HOST;
const PERMITTED_TIME_RANGE = [ "day","month"];
const ALLOWED_MIME_TYPE = [
    "image/png",
    "image/jpeg",
    "application/pdf"
];

async function insertTransactionUsingOCR(request, h) {
    try{
        const user = request.user;
        const data = request.payload;
        const image = data.image;
    
        if (!image || typeof image._read !== "function") {
            return h.response({ error: "Image is required and must be a file." }).code(400);
        }
    
        const mimeType = image.hapi.headers["content-type"];

        if (!ALLOWED_MIME_TYPE.includes(mimeType)) {
            return h
                .response({ error: `Unsupported file type: ${mimeType}. Allowed types: PNG, JPEG, PDF.` })
                .code(400);
        }

        const chunks = [];
        for await (const chunk of image) {
            chunks.push(chunk);
        }
        const buffer = Buffer.concat(chunks);

        let newTransactions = [];
        let newTransactionFromData = [];

        if(mimeType === "application/pdf"){
            const pdfData = await pdfParse(buffer);
            const pdfText = pdfData.text;

            const deepseekPrompt = getPdfOcrSchema(pdfText);
            const deepseekAnswer = await ask(JSON.stringify(deepseekPrompt));
            const deepseekResult = JSON.parse(deepseekAnswer);

            newTransactions = deepseekResult.data;
        } else {
            const base64Image = buffer.toString("base64");
            const base64String = `data:${mimeType};base64,${base64Image}`;
            const transactions = await ocr(base64String);
            newTransactions = transactions.data;
        }

        for(const transaction of newTransactions){

            const parsedDate = dayjs(transaction.createdAt);
            const transactionData = {
                title: transaction.title,
                type: transaction.transactionType,
                amount: transaction.amount,
                createdAt: parsedDate.toDate(),
                userId: user.id,
            };

            newTransactionFromData = await createTransactions(transactionData);
            if (transaction.transactionType === "Income") {
            await updateSaldo(user.id, transaction.amount);
            } else {
            await updateSaldo(user.id, -transaction.amount);
            }
        }
    
        return h
            .response({
            message: "successfully retrive transactions",
            data: newTransactions,
            })
            .code(200);
    } catch(err){
        console.error(err);
        return h
            .response({
                error: "something went wrong, please contact pocketwise support",
            })
            .code(500);
    }
}

async function updateSaldo(userId, amount) {
  try {
    const saldo = await getSaldoByUserId(userId);
    const currentAmount = Number(saldo.amount);
    const updateAmount = Number(amount);

    if (isNaN(currentAmount) || isNaN(updateAmount)) {
      throw new Error("Invalid amount format");
    }

    const newAmount = currentAmount + updateAmount;
    await updateSaldoByUserId(userId, newAmount);
  } catch (error) {
    console.error("Error in updateSaldo:", error);
    throw error;
  }
}

async function getDailyJournal(request,h) {
    try{
        const journalType = "daily";
        const user = request.user;
    
        const pagination = {
            page: 1,
            pageSize: 100,
        }
    
        const timeRange = "day";
    
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
    
        const mlJournalCache = await getMlJournal(`ml:${journalType}:${transactions}::${user.id}`,transactions)
    
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
        
        const result = await fetch(`${ML_HOST}/ai/journal/month`,option);
        const data = await result.json();

        const deepseekPrompt = getMonthlyAnalysisSchema(data.feedback);
        const deepseekAnswer = await ask(JSON.stringify(deepseekPrompt));
        const deepseekJsonParse = JSON.parse(deepseekAnswer);

        setMlJournal(`ml:${journalType}:${transactions}:${user.id}`,transactions,deepseekJsonParse);
    
        return h
            .response({
            message: "successfully retrive daily journal",
            data: deepseekJsonParse,
            })
            .code(200);
    } catch(err){
        console.error(err);
        return h
            .response({
                error: "something went wrong, please contact pocketwise support",
            })
            .code(500);
    }
}

async function getTimePrediction(request,h) {
    try{
        const journalType = "prediction";
        const user = request.user;
        const { timeRange } = request.query;
    
        if (isInputInvalid(timeRange)){
            return h
                .response({
                error: "invalid input",
                })
                .code(400);
        }
    
        if(!PERMITTED_TIME_RANGE.includes(timeRange)){
            return h
                .response({
                error: "timeRange invalid",
                })
                .code(400);
        }
    
        const queryOption = {
            userId: user.id,
            timeRange: "year"
        }
    
        const transactions = await getTransactionByUserIdWithoutPagination(queryOption);

        const journal_entry = formatMlDayRequest(transactions);
    
        const mlJournalCache = await getMlJournal(`${journalType}:${timeRange}`,journal_entry)
    
        if(mlJournalCache){
            return h
                .response({
                    message: `successfully retrive daily journal with time range ${timeRange}`,
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

        const result = await fetch(`${ML_HOST}/ai/journal/day?time=month`,option);
        const data = await result.json();

        const mlPredictionValue = timeRange === "day" ? data.prediction[0] : data.prediction[29];

        const deepseekPrompt = getTimePredictionPrompt(transactions,mlPredictionValue,timeRange);
        const deepseekAnswer = await ask(JSON.stringify(deepseekPrompt));

        const predictionResult = JSON.parse(deepseekAnswer);
        setMlJournal(`${journalType}:${timeRange}`,journal_entry,predictionResult);
    
        return h
            .response({
                message: `successfully retrive daily journal with time range ${timeRange}`,
                data: predictionResult
            })
            .code(200);
    } catch(err){
        console.error(err)
        return h
            .response({
                error: "something went wrong, please contact pocketwise support",
            })
            .code(500);
    }
}

async function getLifestylePrediction(request,h){
    try{
        const user = request.user;
        const journalType = "lifestyle";
        const pagination = {
            page: 1,
            pageSize: 100,
        }
    
        const timeRange = "day";
    
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
    
        const mlJournalCache = await getMlJournal(`ml:${journalType}:${transactions}:${user.id}`,transactions)
    
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
        
        const result = await fetch(`${ML_HOST}/ai/journal/lifestyle`,option);
        const data = await result.json();
        const prediction = data.prediction;

        let lifestyle = "";
        if(prediction === "Overspender"){
            lifestyle = "Overspender"
        } else if(prediction === "Beginner"){
            lifestyle = "Beginner"
        } else if(prediction === "Saver"){
            lifestyle = "Savvy Saver"
        } else if(prediction === "Balanced"){
            lifestyle = "Balanced"
        }

        await getMlJournal(`ml:${journalType}:${transactions}:${user.id}`,lifestyle)

        return h
            .response({
                message: "successfull get lifestyle prediction",
                data: lifestyle
            })
            .code(200);
    } catch(err){
        console.error(err)
        return h
            .response({
                error: "something went wrong, please contact pocketwise support",
            })
            .code(500);
    }
}

async function getAiSuggestion(request,h){
    try{
        const user = request.user;
        const journalType = "suggestion";
        const pagination = {
            page: 1,
            pageSize: 100,
        }
    
        const timeRange = "alltime";
    
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
    
        const mlJournalCache = await getMlJournal(`ml:${journalType}:${transactions}:${user.id}`,transactions)
    
        if (mlJournalCache){
            return h
                .response({
                message: "successfully retrive month journal",
                data: mlJournalCache,
                })
                .code(200);
        }
    
        const deepseekPrompt = getAiSuggestionPrompt(transactions);
        const deepseekAnswer = await ask(JSON.stringify(deepseekPrompt));
        const deepseekResult = JSON.parse(deepseekAnswer);

        await setMlJournal(`ml:${journalType}:${transactions}:${user.id}`,transactions,deepseekResult)

        return h
            .response({
                message: "successfull get ai suggestion",
                data: deepseekResult
            })
            .code(200);
    } catch(err){
        console.error(err)
        return h
            .response({
                error: "something went wrong, please contact pocketwise support",
            })
            .code(500);
    }
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

async function getMonthJournal(request,h) {
    try{
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
    
        const mlJournalCache = await getMlJournal(`ml:${journalType}:${transactions}:${user.id}`,transactions)
    
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
        
        const result = await fetch(`${ML_HOST}/ai/journal/month`,option);
        const data = await result.json();

        const deepseekPrompt = getMonthlyAnalysisSchema(data.feedback);
        const deepseekAnswer = await ask(JSON.stringify(deepseekPrompt));
        const deepseekJsonParse = JSON.parse(deepseekAnswer);

        setMlJournal(`ml:${journalType}:${transactions}:${user.id}`,transactions,deepseekJsonParse);
    
        return h
            .response({
            message: "successfully retrive month journal",
            data: deepseekJsonParse,
            })
            .code(200);
    } catch(err){
        console.error(err);
        return h
            .response({
                error: "something went wrong, please contact pocketwise support",
            })
            .code(500);
    }
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
        const type = transaction.type;
        const amount = Math.abs(transaction.amount);
        if (journal_entry.hasOwnProperty(type)) {
            journal_entry[type] += amount;
        }
    });

    return journal_entry;
}

module.exports = {
    insertTransactionUsingOCR,
    getTimePrediction,
    getDailyJournal,
    getMonthJournal,
    getLifestylePrediction,
    getAiSuggestion
}