import React, { useState, useContext, useEffect } from "react";
import { GroupContext } from "../../context/GroupContext";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";

const GroupChatBox = ({ group }) => {
  const { groupMessages, sendGroupMessage } = useContext(GroupContext);
  const { user } = useContext(AuthContext);
  const [message, setMessage] = useState("");
  const [senderNames, setSenderNames] = useState({});

  useEffect(() => {
    const fetchSenderNames = async () => {
      const senderIds = [...new Set(groupMessages.map((msg) => msg.senderId))];
      const names = {};

      try {
        for (let id of senderIds) {
          const response = await axios.get(
            `http://localhost:4500/api/users/find/${id}`
          );
          names[id] = response.data.name;
        }
      } catch (err) {
        console.error("Error fetching sender names:", err);
      }

      setSenderNames(names);
    };

    fetchSenderNames();
  }, [groupMessages]);

  const handleSend = () => {
    if (message.trim()) {
      sendGroupMessage(group.id, user.id, message);
      setMessage("");
    }
  };

  return (
    <div className="flex flex-col p-4 border border-gray-300">
      <h4>Chat for {group.name}</h4>
      <div className="flex-1 overflow-auto">
        {groupMessages?.map((msg) => (
          <div key={msg.id} className="p-2 border-b">
            <strong>{senderNames[msg.senderId] || "Unknown"}: </strong>
            {msg.text}
          </div>
        ))}
      </div>
      <div className="flex">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-1 border p-2"
        />
        <button onClick={handleSend} className="p-2 bg-blue-500 text-white">
          Send
        </button>
      </div>
    </div>
  );
};

export default GroupChatBox;
