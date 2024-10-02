const express = require('express')
const router = express.Router()
const {handleMeetingSubmit} = require('../controllers/meetingController')

router.post('/submit',handleMeetingSubmit)


module.exports = router