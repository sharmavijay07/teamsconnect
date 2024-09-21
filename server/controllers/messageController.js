const db = require('../config/db')

const createMessage = (req, res) => {
    const { chatId, senderId, text } = req.body;
    
    // Insert the new message
    const insertQuery = 'INSERT INTO messages (chatId, senderId, text) VALUES (?, ?, ?)';
  
    db.query(insertQuery, [chatId, senderId, text], (error, results) => {
      if (error) {
        console.log(error);
        return res.status(500).json({ error: 'Failed to create message' });
      }
  
      // Get the ID of the newly inserted message
      const newMessageId = results.insertId;
  
      // Fetch the newly inserted message including timestamps
      const selectQuery = 'SELECT * FROM messages WHERE id = ?';
  
      db.query(selectQuery, [newMessageId], (error, [newMessage]) => {
        if (error) {
          console.log(error);
          return res.status(500).json({ error: 'Failed to retrieve the created message' });
        }
  
        res.status(200).json(newMessage);
      });
    });
  };
  
  const getMessages = (req, res) => {
    const { chatId } = req.params;
    const query = 'SELECT * FROM messages WHERE chatId = ?';
  
    db.query(query, [chatId], (error, results) => {
      if (error) {
        console.log(error);
        return res.status(500).json({ error: 'Failed to retrieve messages' });
      }
      res.status(200).json(results);
    });
  };

  
  module.exports = {createMessage,getMessages}