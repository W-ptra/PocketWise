const authRouters = require("./authRouters");
const userRoutes = require("./userRouters");
const transactionRoutes = require("./transactionRouters");
const saldoRoutes = require("./saldoRouters");
const aiRoutes = require("./aiRouters");

exports.plugin = {
  name: "apiRoutes",
  register: async function (server, options) {
    await server.register({
      plugin: authRouters,
      routes: {
        prefix: "/api/auth",
      },
    });

    await server.register({
      plugin: userRoutes,
      routes: {
        prefix: "/api/user",
      },
    });

    await server.register({
      plugin: transactionRoutes,
      routes: {
        prefix: "/api/transaction",
      },
    });

    await server.register({
      plugin: saldoRoutes,
      routes: {
        prefix: "/api/saldo",
      },
    });

    await server.register({
      plugin: aiRoutes,
      routes: {
        prefix: "/api/ai",
      },
    });

    server.route({
      method: "OPTIONS",
      path: "/{path*}",
      handler: (request, h) => {
        const response = h.response();
        response.header("Access-Control-Allow-Origin", "*");
        response.header(
          "Access-Control-Allow-Methods",
          "GET, POST, PUT, DELETE, OPTIONS"
        );
        response.header(
          "Access-Control-Allow-Headers",
          "Authorization, Content-Type"
        );
        return response;
      },
    });
  },
};
