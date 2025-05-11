const userService = require("../services/userService")

exports.plugin = {
    name: "userRoutes",
    register: async function (server, options) {
        server.route([
            {
                method: "GET",
                path: "/profile",
                handler: userService.getUserProfile
            },
            {
                method: "PUT",
                path: "/profile",
                handler:  userService.updateUserProfile
            },
            {
                method: "PUT",
                path: "/profile/email",
                handler:  userService.updateUserEmail
            }
        ]);
    }
};