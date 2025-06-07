function isInputInvalid(...args) {
  return args.some((value) => {
    return (
      value === undefined ||
      value === null ||
      (typeof value === "string" && value.trim() === "") ||
      (Array.isArray(value) && value.length === 0)
    );
  });
}

function isTransactionDateInvalid(transactions) {
  const permittedDateFormatRegex = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/; // YYYY-MM-DD HH-MM-SS

  for (const transaction of transactions) {
    const dateString = transaction.createdAt;
    
    if (!permittedDateFormatRegex.test(dateString)) {
      return true;
    }

    const date = new Date(dateString.replace(" ", "T"));
    if (isNaN(date.getTime())) {
      return true;
    }
  }
  return false;
}

module.exports = {
<<<<<<< HEAD
    isInputInvalid,
    isTransactionDateInvalid
}
=======
  isInputInvalid,
};
>>>>>>> 93950df4b810ddb3b6e861fe9975189ff1e4007b
