const { body, validationResult, oneOf, check } = require("express-validator");
const { ifErrors } = require("./helper");

exports.signup = [
  check("firstName").exists().isString(),
  check("lastName").exists().isString(),
  check("email").exists().isEmail(),
  check("phone").exists().isNumeric(),
  check("password")
    .exists()
    .matches(/^[A-Za-z0-9 .,'!&]+$/),
  check("gender").exists().isString(),
  check("dob").exists().isString(),
  ifErrors,
];
