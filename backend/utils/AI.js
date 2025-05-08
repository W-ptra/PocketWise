const { OCRSchema } = require("./schema");
const OpenAI = require("openai");
require("dotenv").config();

const OCRSchemaJsonStringify = JSON.stringify(OCRSchema);

const qwenClient = new OpenAI({
  baseURL: "https://api.studio.nebius.com/v1/",
  apiKey: process.env.NEBIUS_QWEN_API_KEY,
});

const deepseekClient = new OpenAI({
  baseURL: "https://api.studio.nebius.com/v1/",
  apiKey: process.env.NEBIUS_DEEPSEEK_API_KEY,
});

async function ocr(imageBase64) {
    const messages = [
        {
            role: "user",
            content: [
              {
                type: "text",
                text: OCRSchemaJsonStringify,
              },
              {
                type: "image_url",
                image_url: {
                    url: `data:image/jpeg;base64,${imageBase64}`
                },
              },
            ],
        },
    ]

    const response = await qwenClient.chat.completions.create({
        model: "Qwen/Qwen2-VL-72B-Instruct",
        temperature: 0,
        messages,
    });

    const reponseObject = JSON.parse(response.choices[0].message.content);
    return reponseObject;
}

async function ask(message){
    const messages = [
        {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": message
                }
            ]
        }
    ]
    const result = await deepseekClient.chat.completions.create({
        "model": "deepseek-ai/DeepSeek-V3",
        "max_tokens": 512,
        "temperature": 0.3,
        "top_p": 0.95,
        "messages": messages
    })

    console.log(result.choices[0].message.content);
}