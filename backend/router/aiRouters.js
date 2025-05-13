const aiService = require("../services/aiService")

exports.plugin = {
    name: "aiRoutes",
    register: async function (server, options) {
        server.route([
            {
                method: "POST",
                path: "/ocr",
                options: {
                    payload: {
                        output: "stream",
                        parse: true,
                        multipart: true,
                        maxBytes: 10 * 1024 * 1024,
                        allow: "multipart/form-data"
                    }
                },
                handler: aiService.getTransactionsUsingOcr
            }
        ]);
    }
};