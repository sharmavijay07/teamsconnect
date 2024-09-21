const express = require("express");
var router = express.Router();
const mongoose = require("mongoose");
const Employee = mongoose.model("Employee");
// const {user} = require('./userController')

let user
// On your backend (Port 3001)
router.post("/getUser", (req, res) => {
   user = req.body.user;

  if (user) {
      console.log("User received:", user);
      req.session.user = user; // Store user in session
      res.json({ message: "User received successfully" });
  } else {
      res.status(400).json({ message: "No user found" });
  }
});

router.get("/", (req, res) => {
    console.log("user in  loginController",user)
  res.render("home/sign", {
    viewTitle: "Insert Employee",
    user: user ? user : "no user is found"

  });
});
module.exports = router;
