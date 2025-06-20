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
                handler: aiService.insertTransactionUsingOCR
            },
            {
                method: "GET",
                path: "/journal/month",
                handler: aiService.getMonthJournal
            },
            {
                method: "GET",
                path: "/journal/day",
                handler: aiService.getDailyJournal
            },
            {
                method: "GET",
                path: "/journal/prediction",
                handler: aiService.getTimePrediction
            },
            {
                method: "GET",
                path: "/journal/lifestyle",
                handler: aiService.getLifestylePrediction
            },
            {
                method: "GET",
                path: "/journal/suggestion",
                handler: aiService.getAiSuggestion
            }
        ]);
    }
};