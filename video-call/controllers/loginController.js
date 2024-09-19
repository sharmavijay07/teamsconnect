const express = require("express");
var router = express.Router();
const mongoose = require("mongoose");
const Employee = mongoose.model("Employee");
const {user} = require('./userController')

router.get("/", (req, res) => {

  res.render("home/sign", {
    viewTitle: "Insert Employee",
    user: user ? JSON.stringify(user) : null
  });
});
module.exports = router;
