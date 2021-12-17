const jwt = require("jsonwebtoken");
const config = require("../config/config");

exports.auth = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];

    const decode = jwt.verify(token, config.encryptionKey);
    const _id = decode._id;
    if (req.body.user_id !== _id) {
      throw "Authentication Error";
    } else {
      next();
    }
  } catch (error) {
    console.log("There seems to be an error", error);
    res.status(401).json({
      error: "You aren't Authorized",
    });
  }
};
