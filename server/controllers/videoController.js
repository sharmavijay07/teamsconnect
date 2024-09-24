const path = require('path');
const db = require('../config/db')
// Configure MySQL connection



// Create a new meeting
exports.createMeeting = (req, res) => {
  const meetingId = req.body.meetingId;
  const userId = req.body.userId;

  const sql = 'INSERT INTO meetings (meeting_id, user_id) VALUES (?, ?)';
  db.query(sql, [meetingId, userId], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ message: 'Meeting created successfully', meetingId });
  });
};

// Join an existing meeting
exports.joinMeeting = (req, res) => {
  const meetingId = req.body.meetingId;

  const sql = 'SELECT * FROM meetings WHERE meeting_id = ?';
  db.query(sql, [meetingId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: 'Meeting not found' });
    }
    res.status(200).json({ message: 'Joined meeting successfully', meeting: results[0] });
  });
};

// Upload a file for a meeting
exports.uploadFile = (req, res) => {
  const meetingId = req.body.meeting_id;
  const username = req.body.username;
  const filePath = req.file.path;

  const sql = 'INSERT INTO files (meeting_id, username, file_path) VALUES (?, ?, ?)';
  db.query(sql, [meetingId, username, filePath], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ message: 'File uploaded successfully', filePath });
  });
};

// Send a message
exports.sendMessage = (req, res) => {
    const { meetingId, userId, message } = req.body;

    const sql = 'INSERT INTO meeting_messages (meeting_id, user_id, message) VALUES (?, ?, ?)';
    db.query(sql, [meetingId, userId, message], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ message: 'Message sent successfully', data: result });
    });
};

// Get messages for a meeting
exports.getMessages = (req, res) => {
    const meetingId = req.params.meetingId;

    const sql = 'SELECT * FROM meeting_messages WHERE meeting_id = ? ORDER BY timestamp ASC';
    db.query(sql, [meetingId], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json({ messages: results });
    });
};

// Use multer middleware for the upload route
