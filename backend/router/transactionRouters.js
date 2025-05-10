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
                method: "POST",
                path: "/",
                handler:  transactionService.createNewTransactions
            },
            {
                method: "PUT",
                path: "/{id}",
                handler:  transactionService.updateTransactions
            },
            {
                method: "DELETE",
                path: "/{id}",
                handler:  transactionService.deleteTransaction
            }
        ]);
    }
};