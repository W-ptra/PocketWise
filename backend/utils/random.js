const { v4: uuid } = require("uuid");

function getUuidv4() {
  return uuid();
}

module.exports = {
  getUuidv4,
};
