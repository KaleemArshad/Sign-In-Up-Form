/* jshint esversion: 6 */
/* jshint esversion: 8 */
const jwt = require("jsonwebtoken");
const userSchema = require("../models/userSchema");

const auth = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    const verifyUser = jwt.verify(token, process.env.SECRET_KEY);
    const userData = await userSchema.findOne({ _id: verifyUser._id });
    req.token = token;
    req.user = userData;
    next();
  } catch (error) {
    res.status(401).send(error);
  }
};

module.exports = auth;
