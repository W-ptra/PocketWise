const { ocr } = require("../utils/AI")

async function getTransactionsUsingOcr(request, h) {
    const data = request.payload;
    const image = data.image;

    if (!image || typeof image._read !== "function") {
        return h.response({ error: "Image is required and must be a file." }).code(400);
    }

    const chunks = [];
    for await (const chunk of image) {
        chunks.push(chunk);
    }
    const buffer = Buffer.concat(chunks);
    const base64Image = buffer.toString("base64");

    const mimeType = image.hapi.headers["content-type"];
    const base64String = `data:${mimeType};base64,${base64Image}`;
    const transactions = await ocr(base64String);

    return h
        .response({
        message: "successfully retrive transactions",
        data: transactions,
        })
        .code(200);
}

module.exports = {
    getTransactionsUsingOcr
}