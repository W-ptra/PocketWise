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
            },
            {
                method: "POST",
                path: "/request-reset-password",
                handler:  authService.requestResetPassword
            },
            {
                method: "PUT",
                path: "/reset-password/{id}",
                handler:  authService.changePassword
            },
            {
                method: "GET",
                path: "/google/callback",
                handler:  authService.handleGoogleOauthCallback
            }
        ]);
    }
};