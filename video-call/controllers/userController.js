const express = require('express')
const router = express.Router()

let user;
// On your backend (Port 3001)
 const getUserDetail = (req, res) => {
    user = req.body.user;
 
   if (user) {
     
 
     console.log("User received:", user);
     localStorage.setItem("User",JSON.stringify(user))
     res.json({ message: "User received successfully" });
   } else {
     res.status(400).json({ message: "No user found" });
   }
 };
 

router.post("/getUser",getUserDetail)


module.exports = {router,user}