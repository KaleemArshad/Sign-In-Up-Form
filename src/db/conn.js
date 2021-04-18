/* jshint esversion: 6 */
/* jshint esversion: 8 */

const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/registerdUsers", {
    useCreateIndex: true,
    useFindAndModify: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connection Successful....');
}).catch((error) => {
    console.log(error);
});