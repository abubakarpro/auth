const auth = require("../middleware/authmiddleware");
const admin = require("../middleware/adminmiddleware");
const config = require("config");
const jwt = require("jsonwebtoken");
const _ = require("lodash");
const bcryptjs = require("bcryptjs");
const { User, validateUser } = require("../models/user");
const express = require("express");
const router = express.Router();
const Joi = require("joi");

router.get("/posts", [auth, admin], async (req, res) => {
  return res.send("Now you are able to get goods");
});

router.post("/", async (req, res) => {
  const { error } = validateUser(req.body);
  if (error) {
    res.send({ status: 404, error: error.details[0].message });
    return;
  }
  let user = await User.findOne({ email: req.body.email });
  if (user) {
    return res.status(404).send("user already register");
  }

  user = new User(_.pick(req.body, ["name", "email", "password"]));
  const salt = await bcryptjs.genSalt(10);
  user.password = await bcryptjs.hash(user.password, salt);

  await user.save();

  //Here use token to directly login not required email to login
  const token = user.generateAuthToken();

  res
    .header("x-auth-token", token)
    .send({ status: 200, data: _.pick(user, ["_id", "name", "email"]) });
});

module.exports = router;
