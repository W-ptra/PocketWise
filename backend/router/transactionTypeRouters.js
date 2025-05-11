const transactionTypeService = require("../services/transactionTypeService")

exports.plugin = {
    name: "transactionTypeRoutes",
    register: async function (server, options) {
        server.route([
            {
                method: "GET",
                path: "/",
                handler: transactionTypeService.getTransactionTypeByName
            },
            {
                method: "POST",
                path: "/",
                handler:  transactionTypeService.createNewTransactionType
            }
        ]);
    }
};