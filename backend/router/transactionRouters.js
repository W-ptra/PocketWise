const transactionService = require("../services/transactionService")
const transactionGraphService = require("../services/transactionGraphService")

exports.plugin = {
    name: "transactionRoutes",
    register: async function (server, options) {
        server.route([
            {
                method: "GET",
                path: "/",
                handler: transactionService.getAllTransactions
            },
            {
                method: "GET",
                path: "/comparison",
                handler: transactionService.getAllTransactionsTypeComparison
            },
            {
                method: "GET",
                path: "/graph",
                handler: transactionGraphService.getAllTransactionForGraph
            },
            {
                method: "POST",
                path: "/",
                handler:  transactionService.createNewTransactions
            },
            {
                method: "PUT",
                path: "/",
                handler:  transactionService.updateTransactions
            },
            {
                method: "DELETE",
                path: "/",
                handler:  transactionService.deleteTransaction
            }
        ]);
    }
};
