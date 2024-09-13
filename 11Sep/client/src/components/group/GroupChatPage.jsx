import React, { useContext, useEffect, useState } from 'react';
import { GroupContext } from '../../context/GroupContext';

const GroupPage = ({ groupId, userId }) => {
  const {
    groupMessages,
    groupChats,
    fetchGroupMessages,
    sendGroupMessage,
    fetchGroupChats,
  } = useContext(GroupContext);
  
  const [messageText, setMessageText] = useState('');

  useEffect(() => {
    if (groupId) {
      fetchGroupMessages(groupId);
      fetchGroupChats(groupId);
    }
  }, [groupId, fetchGroupMessages, fetchGroupChats]);

  const handleSendMessage = () => {
    if (messageText.trim()) {
      console.log("kmessages n group",groupId)
      sendGroupMessage(groupId, userId, messageText);
      setMessageText('');
    }
  };

  return (
    <div>
      <h2>Group Messages</h2>
      <ul>
        {groupMessages.map((message) => (
          <li key={message.id}>{message.text}</li>
        ))}
      </ul>

      <input
        type="text"
        value={messageText}
        onChange={(e) => setMessageText(e.target.value)}
      />
      <button onClick={handleSendMessage}>Send</button>

      <h2>Group Chats</h2>
      <ul>
        {groupChats.map((chatId, index) => (
          <li key={index}>Chat ID: {chatId}</li>
        ))}
      </ul>
    </div>
  );
};

export default GroupPage;
