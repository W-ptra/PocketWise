const OCRSchema = {
  description:
    "extract text/number from provided recipient, expense record, shopping notes, cash book image, extract the only goods/services, if it not a recipient, expense record, shopping notes or cash book just return empty array, only answer this request in JSON format with this JSON schema only like '{ //content }', no other string outside the angle bracket '{'/'}', dont hallucinate, follow the order",
  type: "object",
  property: {
    data: {
      description: "this is array of object recipient",
      type: "array",
      property: {
        description: "this is an object of recipient",
        type: "object",
        property: {
          amount: {
            description: "number of recipient amount",
            type: "number",
          },
          title: {
            description: "the title of the recipient",
            type: "string",
          },
          createdAt: {
            description: "the date of time this recipient, use following format YYYY-MM-DD HH-MM-SS",
            type: "date time",
          },
        },
        required: ["amount", "title", "createdAt"],
      },
    },
  },
  required: "data",
};

function getMonthlyAnalysisSchema(feedback){
  return {
    description: `Help me analys this array feedback ${feedback} and turn it into array of insight object, translate it to english,on transaction type or categories if you find character '_' replace it with space ' ' .Answer this request in JSON format with this JSON schema only like '{ //content }', no other string outside the angle bracket '{'/'}', dont hallucinate, follow the order`,
    type: "object",
    property: {
      data: {
        description: "this is array of object insight",
        type: "array",
        property: {
          description: "this is object of insight",
          type: "object",
          property: {
            type: {
              description: "this is insight type with option of 'highlight','positive' and 'tip'",
              type: "string",
            },
            text: {
              description: "this is an text of short description about the insight, with max of 200 character, explain more about the insight",
              type: "string",
            },
            priority: {
              description: "this is an priority with option of 'low','medium' and 'high', showing how urgent the insight is",
              type: "string",
            },
          },
          required: ["type", "text", "priority"],
        },
      },
    },
    required: "data",
  }
}

function getTimePredictionPrompt(transactions,mlPredictionValue,timeRange){

    return {
      description: `Help me analysis for ${timeRange === "day" ? "tomorrow" : "next month"} prediction, this is array of transaction to help you ${JSON.stringify(transactions)},please ignore the transaction with type income as this is intended for expense analysis only, if you answer with transaction type if you find character '_' replace it with space ' ' ,analyze and turn it into array of insight object.Answer this request in JSON format with this JSON schema only like '{ //content }', no other string outside the angle bracket '{'/'}', dont hallucinate, follow the order`,
      type: "object",
      property: {
        data: {
          description: "this is object of prediction",
          type:"object",
          property: {
            model_prediction: {
              description: "this is object of model_prediction",
              type: "object",
              property: {
                expected_spending: {
                  description: `answer with this value: '${mlPredictionValue}'`,
                  type: "number"
                },
                confidence: {
                  description: `this is confidence, answer with number range 1 to 100 of how confident you are with the prediction you giving`,
                  type: "number"
                },
                trend: {
                  description: `this is trend of how the overall transaction going overtime. the answer is option of 'incrase' or 'decrease'`,
                  type: "string"
                },
                categories: {
                  description: `this is categories of the provided transactions, asnwer with array of 'type' from transaction data, dont duplicate the type name, make it distinc.`,
                  type: "array",
                  propery: {
                    description: `this is 'type' from transaction data`,
                    type: "string",
                  }
                },
                percentage_change: {
                  description: `answer with number range 0 to 100 of how the overall of pass transaction againts the predicted expense of ${mlPredictionValue}`,
                  type: "number",
                }
              },
              required: ["expected_spending","confidence","trend","categories","percentage_change"]
            },
            llm_insight: {
              description: "this is object of llm_insight",
              type: "object",
              property: {
                summary: {
                  description: "this is summary of your prediction, write in short to medium lenght, the size is range from 50 to 400 characters",
                  type:"string"
                },
                explanation: {
                  description: "this is your explanation of your summary, please give description of the proof, use the provided transaction data to answer this",
                  type:"string"
                },
                recommendations:{
                  description: "answer this with your recomendedation to the user about his/her expense, make total of 3 array of string containing your small recomendation",
                  type:"array",
                  property: {
                    description: "write your recomendation in string, with length of no more than 100 characters",
                    type:"string"
                  }
                }
              },
              required: ["summary", "explanation","recommendations"],
            },
            required: ["model_prediction", "llm_insight"],
          }
        }
      },
      required: ["data"]
    };
}

function getAiSuggestionPrompt(transactions){
  return {
    description: `Using this transactions data: ${transactions}, give your best 3 suggestion, analysis and advice about 3 topic: 'tip','insight' and 'investment', the amount is on IDR so when you mention number write like this 'Rp. 50.000' .Answer this request in JSON format with this JSON schema only like '{ //content }', no other string outside the angle bracket '{'/'}', dont hallucinate, follow the order`,
    type: "object",
    property: {
        data: {
          description: "this is object your suggestion",
          type: "object",
          property: {
            property: {
              tip: {
                description: "give your tips about the provided transactions, mention the amount and explain it, answer must no longer than 300 characters",
                type: "string",
              },
              insight: {
                description: "give your inisght about the provided transactions, give your analysis about the transaction such as trend etc., answer must no longer than 300 charactert",
                type: "string",
              },
              investment: {
                description: "give your investment suggestion based on the provided transactions, mention the potential return of investment and some general tips of investment, answer must no longer than 300 character",
                type: "string",
              },
            },
            required: ["tip", "insight", "investment"],
          },
        },
        required: ["data"],
    },
  }
}

module.exports = {
  OCRSchema,
  getMonthlyAnalysisSchema,
  getTimePredictionPrompt,
  getAiSuggestionPrompt
};
