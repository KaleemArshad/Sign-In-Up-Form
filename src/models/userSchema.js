/* jshint esversion: 6 */
/* jshint esversion: 8 */

const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: (email) => {
            if (!validator.isEmail(email)) {
                console.log('Email is Already taken');
            }
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
        maxlength: 20
    }
});

const User = mongoose.model("User", userSchema);

module.exports = User;