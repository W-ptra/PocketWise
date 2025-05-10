const authRouters = require("./authRouters");
const userRoutes = require("./userRouters");

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
    }
};