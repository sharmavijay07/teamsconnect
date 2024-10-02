const db = require('../config/db');

const createChat = (req, res) => {
    const { firstId, secondId } = req.body;
    console.log("Request to create chat with:", { firstId, secondId });

    // Prepare JSON stringified member arrays
    const members1 = JSON.stringify([firstId, secondId]);
    const members2 = JSON.stringify([secondId, firstId]);

    const existingChatQuery = `
       SELECT * FROM chat
        WHERE members = ? OR members = ?
    `;

    db.query(existingChatQuery, [members1, members2], (err, existingChatResult) => {
        if (err) {
            console.error("Error in createChat:", err);
            return res.status(500).json({ error: 'Internal server error' });
        }

        console.log("Existing chat query result:", existingChatResult);

        if (existingChatResult.length > 0) {
            console.log("Chat already exists with id:", existingChatResult[0].id);
            return res.status(200).json(existingChatResult[0]); // Return the complete existing chat object
        } else {
            const newMembers = JSON.stringify([firstId, secondId]);
            const newChatQuery = `
                INSERT INTO chat (members, created_at)
                VALUES (?, CURRENT_TIMESTAMP)
            `;
            
            db.query(newChatQuery, [newMembers], (err, newChatResult) => {
                if (err) {
                    console.error("Error creating new chat:", err);
                    return res.status(500).json({ error: 'Internal server error' });
                }

                console.log("New chat created with id:", newChatResult.insertId);

                // Fetch the full chat details for the newly created chat
                const fetchChatQuery = `SELECT * FROM chat WHERE id = ?`;
                db.query(fetchChatQuery, [newChatResult.insertId], (err, newChatDetails) => {
                    if (err) {
                        console.error("Error fetching new chat details:", err);
                        return res.status(500).json({ error: 'Internal server error' });
                    }

                    console.log("New chat details fetched:", newChatDetails[0]);

                    if (!newChatDetails[0]) {
                        console.error("Error: Chat details not found after insertion");
                        return res.status(500).json({ error: 'Chat details not found' });
                    }

                    return res.status(201).json(newChatDetails[0]); // Return full chat object
                });
            });
        }
    });
};


const findUserChats = (req, res) => {
    const { userId } = req.params;
    console.log("Request to find chats for user:", userId); // Debugging log

    const findUserChatsQuery = `
        SELECT id, members, created_at, updated_at
        FROM chat
        WHERE JSON_CONTAINS(members, ?)
    `;

    db.query(findUserChatsQuery, [JSON.stringify([userId])], (err, userChats) => {
        if (err) {
            console.error("Error in findUserChats:", err); // Enhanced error log
            return res.status(500).json({ error: 'Internal server error' });
        }

        console.log("User chats found:", userChats); // Debugging log
        return res.status(200).json(userChats);
    });
};

const findChat = (req, res) => {
  // Extract member IDs from URL parameters
  const memberId1 = req.params.memberId1;
  const memberId2 = req.params.memberId2;

  if (!memberId1 || !memberId2) {
      return res.status(400).json({ message: 'Both member IDs are required' });
  }

  // Prepare JSON strings for querying
  const membersJson1 = JSON.stringify([memberId1, memberId2]);
  const membersJson2 = JSON.stringify([memberId2, memberId1]);

  const findChatQuery = `
      SELECT id, members, created_at, updated_at
      FROM chat
      WHERE JSON_CONTAINS(members, ?) OR JSON_CONTAINS(members, ?)
  `;

  db.query(findChatQuery, [membersJson1, membersJson2], (err, chat) => {
      if (err) {
          console.error("Error in findChat:", err); // Enhanced error log
          return res.status(500).json({ error: 'Internal server error' });
      }

      console.log("Chat found:", chat); // Debugging log

      if (chat.length > 0) {
          return res.status(200).json(chat[0]);
      } else {
          return res.status(404).json({ message: 'Chat not found' });
      }
  });
};




module.exports = { createChat, findUserChats, findChat };
