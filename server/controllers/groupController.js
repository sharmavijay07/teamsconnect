const db = require('../config/db'); // Your MySQL database connection

// Create a new group
exports.createGroup = (req, res) => {
  const { name, description, organizationId } = req.body;
  db.query('INSERT INTO grouptable (name, description, organizationId) VALUES (?, ?, ?)', [name, description, organizationId], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ id: results.insertId });
  });
};

// Add a user to a group

exports.addUserToGroup = (req, res) => {
  const { userId, groupId } = req.body;
  db.query('INSERT INTO user_groups (user_id, group_id) VALUES (?, ?)', [userId, groupId], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ success: true });
  });
};

// Get all groups in an organization
exports.getGroupsInOrganization = (req, res) => {
  const orgId = req.params.orgId;
  db.query('SELECT * FROM grouptable WHERE organizationId = ?', [orgId], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

// Search groups within an organization
exports.searchGroups = (req, res) => {
  const orgId = req.params.orgId;
  const query = `%${req.params.query}%`;
  db.query('SELECT * FROM grouptable WHERE organizationId = ? AND name LIKE ?', [orgId, query], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

exports.sendGroupMessages = async (req, res) => {
  const { senderId, text } = req.body;
  const { groupId } = req.params;

  if (!senderId || !text || !groupId) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // Check if a chat already exists for the group
    const getChatQuery = `
      SELECT id 
      FROM chat 
      WHERE JSON_CONTAINS(members, ?) 
      AND type = 'group'
    `;

    db.query(getChatQuery, [JSON.stringify([groupId])], (err, chatResults) => {
      if (err) {
        console.error("Error finding chat:", err);
        return res.status(500).json({ error: 'Internal server error' });
      }

      let chatId;
      
      if (chatResults.length > 0) {
        chatId = chatResults[0].id;
        console.log("Chat found with ID:", chatId);
        insertMessage(chatId);
      } else {
        // Create a new chat if none exists
        const createChatQuery = `
          INSERT INTO chat (members, type)
          VALUES (?, 'group')
        `;
        db.query(createChatQuery, [JSON.stringify([groupId])], (error, result) => {
          if (error) {
            console.error("Error creating chat:", error);
            return res.status(500).json({ error: 'Failed to create chat' });
          }
          chatId = result.insertId;
          console.log("New chat created with ID:", chatId);
          insertMessage(chatId);
        });
      }
    });

    // Function to insert the message
    function insertMessage(chatId) {
      const insertMessageQuery = 'INSERT INTO messages (chatId, senderId, text) VALUES (?, ?, ?)';
      db.query(insertMessageQuery, [chatId, senderId, text], (error, results) => {
        if (error) {
          console.error("Error inserting message:", error);
          return res.status(500).json({ error: 'Failed to create message' });
        }

        const newMessageId = results.insertId;
        console.log("Message inserted with ID:", newMessageId);

        // Insert the message-group association into group_messages table
        const insertGroupMessageQuery = 'INSERT INTO group_messages (groupId, messageId,chatId) VALUES (?, ?,?)';
        db.query(insertGroupMessageQuery, [groupId, newMessageId,chatId], (error) => {
          if (error) {
            console.error("Error linking message to group:", error);
            return res.status(500).json({ error: 'Failed to link message to group' });
          }

          // Retrieve and return the newly created message
          const selectQuery = 'SELECT * FROM messages WHERE id = ?';
          db.query(selectQuery, [newMessageId], (error, [newMessage]) => {
            if (error) {
              console.error("Error retrieving message:", error);
              return res.status(500).json({ error: 'Failed to retrieve the created message' });
            }

            console.log("Returning the created message:", newMessage);
            res.status(200).json(newMessage);
          });
        });
      });
    }
  } catch (error) {
    console.error("Unexpected error:", error);
    res.status(500).json({ error: 'Unexpected error occurred' });
  }
};



exports.getGroupMessages = async (req, res) => {
  const { groupId } = req.params;
  
  if (!groupId) {
    return res.status(400).json({ error: 'Missing groupId' });
  }

  const query = 'SELECT * FROM group_messages WHERE groupId = ?';
  db.query(query, [groupId], (error, results) => {
    if (error) {
      console.error(error);
      return res.status(500).json({ error: 'Failed to retrieve messages' });
    }

    res.status(200).json(results);
  });
}


exports.findGroupChats = (req, res) => {
  const { groupId } = req.params;

  if (!groupId) {
    return res.status(400).json({ error: 'Missing groupId' });
  }

  const getChatIdsQuery = `
    SELECT DISTINCT m.chatId
    FROM messages m
    JOIN group_messages gm ON m.id = gm.messageId
    WHERE gm.groupId = ?
  `;


  db.query(getChatIdsQuery, [groupId], (err, results) => {
    if (err) {
      console.error("Error retrieving chat IDs:", err);
      return res.status(500).json({ error: 'Internal server error' });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'No chat IDs found for this group' });
    }

    // Extract chat IDs from results
    const chatIds = results.map(row => row.chatId);
    return res.status(200).json(results);
  });
};



exports.findGroupMessages = (req, res) => {
  const { groupId } = req.params;

  if (!groupId) {
    return res.status(400).json({ error: 'Missing groupId' });
  }

  const getChatIdsQuery = `
     select * from messages
  where chatId = (SELECT DISTINCT m.chatId
  FROM messages m
  JOIN group_messages gm ON m.id = gm.messageId
  WHERE gm.groupId = ?)
  `

  db.query(getChatIdsQuery, [groupId], (err, results) => {
    if (err) {
      console.error("Error retrieving chat IDs:", err);
      return res.status(500).json({ error: 'Internal server error' });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'No chat IDs found for this group' });
    }

    // Extract chat IDs from results
    const chatIds = results.map(row => row.chatId);
    return res.status(200).json(results);
  });
};



exports.getUserGroups = (req, res) => {
  const userId = req.params.userId;

  if (!userId) {
    return res.status(400).json({ error: 'Missing userId' });
  }

  const query = `
    SELECT g.id, g.name, g.description, g.organizationId
    FROM grouptable g
    JOIN user_groups ug ON g.id = ug.group_id
    WHERE ug.user_id = ?
  `;

  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error("Error retrieving user's groups:", err);
      return res.status(500).json({ error: 'Internal server error' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'No groups found for this user' });
    }

    return res.status(200).json(results);
  });
};