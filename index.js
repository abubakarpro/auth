const config = require("config");
const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const app = express();
const users = require("./routes/users");
const auth = require("./routes/auth");

mongoose
  .connect("mongodb://localhost/playground")
  .then(() => console.log("connect to db"))
  .catch(err => console.error("could not connect to mongodb...", err));

app.use(cors());
app.use(express.json());

app.use("/api/users/", users);
app.use("/api/auth/", auth);

if (!config.get("jwtPrivateKey")) {
  console.log("Fatel error : private key is not define");
  process.exit(1);
}

//Get
app.get("/", (req, res) => {
  console.log(req.body);
  res.send("Hello From First Authentication Api!!");
});

//PORT

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`listening on Port ${port}`));
