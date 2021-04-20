/* jshint esversion: 6 */
/* jshint esversion: 8 */

const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: (email) => {
      if (!validator.isEmail(email)) {
        console.log("Email is Already taken");
      }
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
  },
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
});
userSchema.methods.genAuthToken = async function () {
  try {
    token = jwt.sign(
      {
        _id: this._id.toString(),
      },
      process.env.SECRET_KEY
    );
    this.tokens = this.tokens.concat({
      token,
    });
    await this.save();
    return token;
  } catch (error) {
    console.log(error);
  }
};

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
