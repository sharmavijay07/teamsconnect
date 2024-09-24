const express = require('express')
const router = express.Router()

let user;
// On your backend (Port 3001)
router.post("/getUser", (req, res) => {
  const user = req.body.user;

  if (user) {
      console.log("User received:", user);
      req.session.user = user; // Store user in session
      res.json({ message: "User received successfully" });
  } else {
      res.status(400).json({ message: "No user found" });
  }
});



module.exports = {router,user}