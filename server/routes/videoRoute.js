const express = require('express');
const router = express.Router();
const multer = require('multer');


// Configure Multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/'); // Directory to save files
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
    },
  });

const meetingController = require('../controllers/videoController');

// Create a new meeting
router.post('/create', meetingController.createMeeting);

// Join an existing meeting
router.post('/join', meetingController.joinMeeting);

// Upload a file for a meeting
router.post('/upload', meetingController.uploadFile);
// Send a message
router.post('/sendMessage', meetingController.sendMessage);

// Get messages for a meeting
router.get('/:meetingId', meetingController.getMessages);



const upload = multer({ storage });


router.post('/upload', upload.single('zipfile'), meetingController.uploadFile);


module.exports = router;
