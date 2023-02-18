const express = require("express");
const argon2 = require("argon2");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

const app = express.Router();

app.post("/signup", async (req, res) => {
  const { username, email, password, phone } = req.body;
  console.log(username, email, password, phone);
  let hash = await argon2.hash(password);
  try {
    let userExist = await User.findOne({ email });
    if (userExist) {
      return res
        .status(404)
        .send("cannot create a user with existing email id");
    } else {
      let user = await User.create({
        username,
        email,
        password: hash,
        phone,
      });
      return res.send({ user, message: "SignUp Success" });
    }
  } catch (e) {
    res.status(404).send(e.message);
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
console.log(email, password);

  try {
    let user = await User.findOne({ email });
    if (user) {
      let verify = argon2.verify(user.password, password);
      if (verify) {
        let token = jwt.sign(
          {
            id: user.id,
            username: user.username,
            phone: user.phone,
          },
          "SERCRETKEY123456789",
          { expiresIn: "50 days" }
        );
        return res.send({
          token: token,
          user,
          message: "Login Successfull",
        });
      } else {
        res.status(401).send(`Authentication failed, incorrect password`);
      }
    } else {
      res.status(401).send(`User with email: ${email} not found`);
    }
  } catch (e) {
    res.status(404).send(e.message);
  }
});

module.exports = app;
