# Connect to AI
to connect to ai first you need to starting up the ml model api by run following script

```bash
# make sure you are on ML directory
pip install -r requirements.txt # can skip if already do so

python main.py # please use python 3.10.x or 3.11.x
```
# Api Usage
postman doc: https://documenter.getpostman.com/view/29689178/2sB2jAbTYf#51c21326-ad81-4d2c-a066-8693f12f707d

# How to call ai service from backend
```javascript
const ML_HOST = "http://localhost:3001"
const journal_type = "lifestyle"
const url = `${ML_HOST}/journal/${journal_type}`

const result = await fetch(url,{
    method: "POST",
    headers: {
        "Content-Type: application/json"
    },
    body: JSON.stringify({
         journal_entry: {
            // example value
            Income: 8000000,
            Rent: 1500000,
            Loan_Repayment: 0,
            Insurance: 150000,
            Groceries: 1200000,
            Transport: 500000,
            Eating_Out: 300000,
            Entertainment: 200000,
            Utilities: 300000,
            Healthcare: 400000,
            Education: 100000
        }
    });
});
console.log(await result.json());
/* output
    {
        "prediction": "Overspender",
        "success": true
    }
*/
```

# Connect to LLM 

first make sure you have put the credential for ``NEBIUS_DEEPSEEK_API_KEY`` and ``NEBIUS_QWEN_API_KEY`` at ``.env`` file

## Explanation for each model
1. DEEPSEEK
deepseek is just like chatgpt where you send your chat then deepseek answer it. can be used for analyzing and further more.

2. QWEN
different from deepseek, it can process image. On this project we use qwen for OCR, where we pass a ``base64`` image file and give prompt to answer with expected response format and voila! you got json as respond ready to convert to js object and be process. 

##### Example:

![img](https://passingthroughresearcher.wordpress.com/wp-content/uploads/2019/06/img_20190511_084303.jpg?w=546&h=510&crop=1)

Turn into:

```json
{
  "data": [
    {
      "amount": 11500,
      "title": "Bread Butter Pudding",
      "createdAt": "10 May 19 16:32:47"
    },
    {
      "amount": 14000,
      "title": "Cream Bruille",
      "createdAt": "10 May 19 16:32:47"
    },
    {
      "amount": 10500,
      "title": "Choco Croissant",
      "createdAt": "10 May 19 16:32:47"
    },
    {
      "amount": 7500,
      "title": "Bank Of Chocolat",
      "createdAt": "10 May 19 16:32:47"
    }
  ]
}
```

## Usage
please refer to ``/backend/utils/AI.js``

1. DEEPSEEK
```javascript
const question = "hello";
const answer = await ask(question);
console.log(answer);
// asnwer: Hello! 😊 How can I assist you today?
```
2. QWEN
```javascript
const image = "image" // example this is a image or any file
const chunks = [];
for await (const chunk of image) {
    chunks.push(chunk);
}
const buffer = Buffer.concat(chunks);
const base64Image = buffer.toString("base64");
    
const mimeType = image.hapi.headers["content-type"];
const base64String = `data:${mimeType};base64,${base64Image}`;

const result = ocr(base64String);
```
| for custom use case feel free to modify any function on ``AI.js``