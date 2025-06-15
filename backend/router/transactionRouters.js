const transactionService = require("../services/transactionService")

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
                path: "/expenses",
                handler: transactionService.getAllExpenses
            },
            {
                method: "GET",
                path: "/income",
                handler: transactionService.getAllIncome
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
