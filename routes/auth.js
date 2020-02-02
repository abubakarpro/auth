const config = require("config");
const jwt = require("jsonwebtoken");
const _ = require("lodash");
const bcryptjs = require("bcryptjs");
const { User } = require("../models/user");
const express = require("express");
const router = express.Router();
const Joi = require("joi");

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) {
    res.send({ status: 404, error: error.details[0].message });
    return;
  }
  let user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(200).send("Invalid email or password!");

  const validPassword = await bcryptjs.compare(
    req.body.password,
    user.password
  );
  if (!validPassword) return res.status(400).send("Invalid email or password!");

  const token = user.generateAuthToken();

  res.status(200).send(token);
});

function validate(req) {
  const schema = {
    email: Joi.string()
      .email()
      .min(5)
      .max(255)
      .required(),
    password: Joi.string()
      .min(5)
      .max(255)
      .required()
  };
  return Joi.validate(req, schema);
}

module.exports = router;
