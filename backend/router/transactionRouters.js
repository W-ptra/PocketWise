const transactionService = require("../services/transactionService")

exports.plugin = {
    name: "transactionRoutes",
    register: async function (server, options) {
        server.route([
            {
                method: "GET",
                path: "/",
                handler: transactionService.getAllTransaction
            },
            {
                method: "GET",
                path: "/comparision",
                handler: transactionService.getAllTransactionTypeComparision
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