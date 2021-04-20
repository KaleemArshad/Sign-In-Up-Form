/* jshint esversion: 6 */
/* jshint esversion: 8 */
require("dotenv").config();
const express = require("express");
require("./db/conn");
const userSchema = require("./models/userSchema");
const hbs = require("hbs");
const path = require("path");
const bcrypt = require("bcryptjs");
const cookieParser = require("cookie-parser");
const auth = require("./middlewares/auth");

const port = process.env.PORT || 8000;
const app = express();

app.use(cookieParser())
app.use(express.json());
app.use(express.static(path.join(__dirname, "../public")));
app.set("view engine", hbs);
app.set("views", path.join(__dirname, "../templates/views"));
hbs.registerPartials(path.join(__dirname, "../templates/partials"));
app.use(
  express.urlencoded({
    extended: false,
  })
);

app.get("/", (req, res) => {
  res.render("index.hbs");
});

app.get("/auth", auth, (req, res) => {
  res.render("auth.hbs");
});

app.get("/logout", auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token;
        });  // To Logout From Current Device Only
       
        // req.user.tokens = [];  // To Logout From All Devices
        
        res.clearCookie('jwt');
        await req.user.save();
        res.render('index.hbs');
    } catch (error) {
        res.status(500).send(error);
    }

});

app.post("/success", async (req, res) => {
  try {
    const user = new userSchema({
      fullName: req.body.fullname,
      email: req.body.email,
      password: req.body.password,
    });
    const token = await user.genAuthToken();
    res.cookie("jwt", token, {
      httpOnly: true,
      expires: new Date(Date.now() + 3000000),
    });
    const createUser = await user.save();
    res.render("registered.hbs");
  } catch (error) {
    res.status(400).send(error);
    console.log(error);
  }
});

app.post("/logedIn", async (req, res) => {
  try {
    const email = req.body.lemail;
    const passcode = req.body.lpassword;
    const userAuth = await userSchema.findOne({
      email,
    });
    const isMatch = await bcrypt.compare(passcode, userAuth.password);
    const token = await userAuth.genAuthToken();
    res.cookie("jwt", token, {
      httpOnly: true,
      expires: new Date(Date.now() + 3000000),
    });
    if (isMatch) {
      res.render("logedIn.hbs");
    }
  } catch (error) {
    res.status(400).send(error);
  }
});

app.listen(port, () => {
  console.log(`Listening to Port No. ${port}`);
});
