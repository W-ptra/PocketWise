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
            description: "the date of time this recipient",
            type: "date/time",
          },
        },
        required: ["amount", "title", "createdAt"],
      },
    },
  },
  required: "data",
};

module.exports = {
  OCRSchema,
};
