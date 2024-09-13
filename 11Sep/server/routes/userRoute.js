const express = require('express')
const {registerUser,userLogin, findUser, getUser} = require('../controllers/userController')
const router = express.Router();


router.post('/register',registerUser)
router.post('/login',userLogin)
router.get('/find/:userId',findUser)
router.get('/',getUser)


module.exports = router;