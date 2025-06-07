const { getTransactionByUserIdWithoutPagination } = require("../database/postgres/transactionDatabase");
const { isInputInvalid } = require("../utils/validation");

const ALLOWED_TIME_RANGE = ["day","week","month","year","alltime"];
const ALLOWED_TRANSACTION_TYPE = ["income","expense","all"];

async function getAllTransactionForGraph(request,h){
    try{
        const user = request.user;
        let { timeRange,type } = request.query;
    
        if(isInputInvalid(timeRange,type))
            return h
                .response({
                error: "invalid input",
                })
                .code(400);
    
        const isTransactionTypeAndTimeRangeInvalid = !ALLOWED_TRANSACTION_TYPE.includes(type) || !ALLOWED_TIME_RANGE.includes(timeRange);

        if(isTransactionTypeAndTimeRangeInvalid){
            return h
                .response({
                error: "transactionType or timeRange is invalid",
                })
                .code(400);
        }
    
        let queryOption = {
            userId: user.id,
            timeRange,
            type
        }
    
        if(type === "all"){
            queryOption.type = "expense";
        }
        
        const transactions = await getTransactionByUserIdWithoutPagination(queryOption);
        console.log(queryOption,transactions);
        if(transactions.length === 0){
            return h
                .response({
                error: "transaction record is empty",
                })
                .code(404);
        }
    
        let transactionGraph = formatTransactionsToGraphData(transactions,timeRange);
    
        if( type === "expense" || type === "income"){
            transactionGraph = formatTransactionType(transactionGraph,type)
        } else if(type === "all"){
    
            const transactionGraphExpense = transactionGraph;
    
            const queryOptionIncome = {
                userId: user.id,
                timeRange,
                type: "income"
            }
            const transactionsIncome = await getTransactionByUserIdWithoutPagination(queryOptionIncome);
            const transactionGraphIncome = formatTransactionsToGraphData(transactionsIncome,timeRange);
    
            transactionGraph = formatTransactionTypeBoth(transactionGraphIncome,transactionGraphExpense);
        } 
    
        return h
            .response({
                message: "successfull retrive transaction graph data",
                data: transactionGraph
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

function formatTransactionsToGraphData(transactions,timeRange){
    const transactionAggregate = {};
    let timeRangeKey = "";

    transactions.forEach( transaction => {
        const dateTime = transaction.createdAt.toISOString().split("T");
        const date = dateTime[0].split("-");
        
        const year = date[0];
        const month = date[1];
        const day = date[2];
        const time =  dateTime[1].split(":");

        const hour = time[0];

        if(timeRange === "day"){
            timeRangeKey = `${year}/${month}/${day} ${hour}:00:00`;
        } else if (timeRange === "week" || timeRange === "month"){
            timeRangeKey = `${year}/${month}/${day} 00:00:00`;
        } else if (timeRange === "year" || timeRange === "alltime"){
            timeRangeKey = `${year}/${month}/01 00:00:00`;
        }

        if(!transactionAggregate[timeRangeKey]){

            

            transactionAggregate[timeRangeKey] = {
                date: timeRangeKey,
                amount: 0
            }
        }
        
        let amount = typeof(transaction.amount) === "number" ? transaction.amount : parseInt(transaction.amount);
        amount = amount > 0 ? amount : -amount;

        transactionAggregate[timeRangeKey].amount += amount;
    } )
    return transactionAggregate;
}

function formatTransactionType(transactionGraph,type){
    let transactionGraphDataUnsort = [];
    for(key in transactionGraph){
        if( type === "expense"){
            transactionGraphDataUnsort.push({
                date: transactionGraph[key].date,
                expense: transactionGraph[key].amount,
            })
            continue;
        }
        transactionGraphDataUnsort.push({
            date: transactionGraph[key].date,
            income: transactionGraph[key].amount,
        })
    }

    transactionGraphDataUnsort = transactionGraphDataUnsort.map(({ index, ...rest }) => rest);

    return transactionGraphDataUnsort.sort((a, b) => new Date(a.date) - new Date(b.date));
}

function formatTransactionTypeBoth(transactionGraphIncome, transactionGraphIncomeExpense) {
  let merged = {};

  const allDates = new Set([
    ...Object.keys(transactionGraphIncome),
    ...Object.keys(transactionGraphIncomeExpense)
  ]);

  allDates.forEach(date => {
    const income = transactionGraphIncome[date]?.amount || 0;
    const expense = transactionGraphIncomeExpense[date]?.amount || 0;

    merged[date] = {
      date,
      income,
      expense
    };
  });

    let transactionGraphDataUnsort = [];
    for(key in merged){
        transactionGraphDataUnsort.push({
                date: merged[key].date,
                income: merged[key].income,
                expense: merged[key].expense
        })
    }

    transactionGraphDataUnsort = transactionGraphDataUnsort.map(({ index, ...rest }) => rest);

    return transactionGraphDataUnsort.sort((a, b) => new Date(a.date) - new Date(b.date));
}

module.exports = {
    getAllTransactionForGraph
}