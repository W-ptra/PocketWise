
const authRouters = require("./authRouters");

exports.plugin = {
    name: "apiRoutes",
    register: async function (server, options) {
        await server.register({
            plugin: authRouters,
            routes: {
                prefix: "/api/auth"
            }
        });
    }
};