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

module.exports = {
  isInputInvalid,
};
