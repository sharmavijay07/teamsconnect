const express = require('express');
const multer = require('multer');
const path = require('path');
const db = require('../config/db'); // Import the MySQL connection

const router = express.Router();

// Multer setup for file storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads'); // Save files in the "uploads" folder
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Append current timestamp to the file name
    },
});

const upload = multer({ storage });

//--------------------------------------------9/09/24---------------------------------------------------

// POST route to handle file upload
router.post('/', upload.single('file'), (req, res) => {
    console.log("File upload request:", req.file);
    const { chatId } = req.body; // Get chatId from the request body

    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    // File details
    const fileName = req.file.filename;     
    const filePath = req.file.path;
    const fileType = req.file.mimetype; // Get file type from the request file
    const uploadedAt = new Date(); // Get current timestamp

    // SQL query to insert file details into the MySQL database
    const query = `INSERT INTO files (chatId, fileName, filePath, fileType, uploadedAt) VALUES (?, ?, ?, ?, ?)`;
    
    db.query(query, [chatId, fileName, filePath, fileType, uploadedAt], (err, result) => {
        if (err) {
            console.error("Database insertion error:", err);
            return res.status(500).json({ success: false, message: "Database error", error: err });
        }

        res.status(200).json({ success: true, message: "File uploaded and saved in database successfully", file:req.file });
    });
});

router.get('/file/:chatId',(req,resp) => {
    const chatId = req.params.chatId
    const query = `SELECT filePath,isFile,uploadedAt FROM files WHERE chatId = ?`;
    db.query(query,[chatId],(err,result) => {
        if(err) {
            console.error("Database get error",err);
            return resp.status(500).json({success:false,message:"Database error",error:err})
        }
        resp.status(200).json({success:true,message:"File got successfully",file:result})
    })
})

const serveFile = (req, res) => {
    const filePath = req.params.filePath.replace(/\\/g, '/');; // Extract the file path from the URL
    const fullPath = path.join(__dirname, '..', 'uploads', filePath); 
    
  
    res.sendFile(fullPath, (err) => {
      if (err) {
        console.error('File sending error:', err);
        res.status(404).send('File not found');
      }
    });
  };



const getAllMessages = (req,resp) => {
    const chatId = req.params.chatId;
    const query = "SELECT m.id AS messageId,m.chatId,m.senderId,m.text, m.createdAt AS messageCreatedAt, m.updatedAt AS messageUpdatedAt, f.id AS fileId,f.fileName,f.filePath, f.fileType,f.uploadedAt FROM messages m inner JOIN  files f ON m.id = f.chatId  WHERE  m.chatId = ? ORDER BY  m.createdAt;"
    const newquery ="SELECT m.id AS messageId, m.chatId, m.senderId, m.text, m.createdAt AS messageCreatedAt, m.updatedAt AS messageUpdatedAt, f.id AS fileId, f.fileName, f.filePath, f.fileType, f.uploadedAt FROM messages m LEFT JOIN files f ON m.chatId = f.chatId WHERE m.chatId = ? GROUP BY m.id, f.id ORDER BY m.createdAt, f.uploadedAt"
    db.query(newquery,[chatId],(err,result) => {
        if(err) {
            console.log("Error got",err)
            resp.status(500).json({err})
        }
        else {
            resp.status(200).json({msg:"Successfully got messages",result:result})
        }
    })
}

router.get('/allMessages/:chatId',getAllMessages)
router.get('/:filePath',serveFile);

module.exports = router;
