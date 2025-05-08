const authService = require("../services/authService")

exports.plugin = {
    name: "authRoutes",
    register: async function (server, options) {
        server.route([
            {
                method: "POST",
                path: "/login",
                handler: authService.login
            },
            {
                method: "POST",
                path: "/register",
                handler:  authService.register
            }
        ]);
    }
};