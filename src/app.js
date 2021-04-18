/* jshint esversion: 6 */
/* jshint esversion: 8 */

const express = require('express');
require("./db/conn");
const userSchema = require("./models/userSchema");
const hbs = require("hbs");
const path = require("path");
const bcrypt = require("bcryptjs");
const { error } = require('console');

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
        password = await bcrypt.hash(req.body.password, 10);
        const user = new userSchema({
            fullName: req.body.fullname,
            email: req.body.email,
            password: password
        });
        const createUser = await user.save();
        res.render("registered.hbs");
    } catch (error) {
        res.status(400).send(error);
    }

});

app.post("/logedIn", async (req, res) => {
    try {
        const email = req.body.lemail;
        const passcode = req.body.lpassword;
        const userAuth = await userSchema.findOne({
            email
        });
        const confirm = await bcrypt.compare(passcode, userAuth.password);
        if (confirm) {
            res.render('logedIn.hbs');
        }
    } catch (error) {
        res.status(400).send(error);
    }

});

app.listen(port, () => {
    console.log(`Listening to Port No. ${port}`);
});