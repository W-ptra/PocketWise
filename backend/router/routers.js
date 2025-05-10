const authRouters = require("./authRouters");
const userRoutes = require("./userRouters");
const transactionRoutes = require("./transactionRouters");
const transactionTypeRoutes = require("./transactionTypeRouters");

exports.plugin = {
    name: "apiRoutes",
    register: async function (server, options) {
        await server.register({
            plugin: authRouters,
            routes: {
                prefix: "/api/auth"
            }
        });

        await server.register({
            plugin: userRoutes,
            routes: {
                prefix: "/api/user"
            }
        });

        await server.register({
            plugin: transactionRoutes,
            routes: {
                prefix: "/api/transaction"
            }
        });

        await server.register({
            plugin: transactionTypeRoutes,
            routes: {
                prefix: "/api/transaction-type"
            }
        });
    }
};