/* jshint esversion: 6 */
/* jshint esversion: 8 */

const express = require('express');
require("./db/conn");
const userSchema = require("./models/userSchema");
const hbs = require("hbs");
const path = require("path");

const port = process.env.PORT || 8000;
const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, "../public")));
app.set('view engine', hbs);
app.set('views', path.join(__dirname, "../templates/views"));
hbs.registerPartials(path.join(__dirname, "../templates/partials"));
app.use(express.urlencoded({
    extended: false
}));

app.get('/', (req, res) => {
    res.render('index.hbs');
});

app.post('/success', async (req, res) => {
    try {
        const user = new userSchema({
            fullName: req.body.fullname,
            email: req.body.email,
            password: req.body.password
        });
        const createUser = await user.save();
        console.log(createUser);
        res.render("registered.hbs");
    } catch (error) {
        res.status(400).send(error);
    }

});

app.listen(port, () => {
    console.log(`Listening to Port No. ${port}`);
});