const saldoService = require("../services/saldoService")

exports.plugin = {
    name: "saldoRoutes",
    register: async function (server, options) {
        server.route([
            {
                method: "GET",
                path: "/",
                handler: saldoService.getSaldo
            }
        ]);
    }
};