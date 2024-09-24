const express = require('express');
const multer = require('multer');
const path = require('path');
const db = require('../config/db'); // Import your database connection

const router = express.Router();

// Multer setup for storing voice recordings
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads/voice'); // Save voice recordings in the "uploads/voice" folder
    },
    filename: (req, file, cb) => {
        cb(null, `voice-${Date.now()}${path.extname(file.originalname)}`); // Save files with a unique name
    },
});

const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        const filetypes = /wav/; // Accept only WAV files
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

        if (mimetype && extname) {
            return cb(null, true);
        }
        cb("Error: File type not supported!");
    }
});


// POST route to handle voice upload
router.post('/', upload.single('file'), (req, res) => {
    const { chatId, senderId } = req.body;

    if (!req.file) {
        return res.status(400).json({ success: false, message: "No voice recording uploaded" });
    }

    const fileName = req.file.filename;
    const filePath = req.file.path;
    const fileType = req.file.mimetype;
    const uploadedAt = new Date();

    // SQL query to insert the voice file details into the MySQL database
    const query = `INSERT INTO files (chatId, fileName, filePath, fileType, uploadedAt, isFile, senderId) VALUES (?, ?, ?, ?, ?, ?, ?)`;

    db.query(query, [chatId, fileName, filePath, fileType, uploadedAt, 1, senderId], (err, result) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ success: false, message: "Database error", error: err });
        }

        res.status(200).json({ success: true, message: "Voice recording uploaded and saved in database", file: req.file });
    });
});

module.exports = router;
