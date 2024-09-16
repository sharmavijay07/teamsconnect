const express = require("express");
const {
  registerUser,
  userLogin,
  findUser,
  getUser,
  updateName,
  updateMail,
} = require("../controllers/userController");
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", userLogin);
router.get("/find/:userId", findUser);
router.get("/", getUser);
router.put("/updateName/:userId", updateName);
router.put("/updateMail/:userId", updateMail);

module.exports = router;
