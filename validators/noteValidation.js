const { body, validationResult, oneOf, check } = require("express-validator");
const { ifErrors } = require("./helper");

exports.create = [
  check("title").exists().isString(),
  check("description").exists().isString(),
  ifErrors,
];
