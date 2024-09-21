import React, { createContext, useContext, useState, useEffect } from 'react';
import { getRequest, postRequest, baseUrl } from '../utils/services';

export const GroupContext = createContext();

export const useGroup = () => {
  return useContext(GroupContext);
};

export const GroupProvider = ({ children }) => {
  const [groupMessages, setGroupMessages] = useState([]);
  const [groupChats, setGroupChats] = useState([]);
  const [currentGroupId, setCurrentGroupId] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(null);



  const fetchGroupMessages = async (groupId) => {
    try {
      const data = await getRequest(`${baseUrl}/chat/${groupId}/findMessages`);
      if (Array.isArray(data)) {
        setGroupMessages(data);
      } else {
        console.error('Expected an array of messages, but received:', data);
        setGroupMessages([]); // Ensure it defaults to an empty array
      }
    } catch (error) {
      console.error('Failed to fetch group messages:', error);
    }
  };
  

  const sendGroupMessage = async (groupId, senderId, text) => {
    try {
      const data = await postRequest(`${baseUrl}/chat/${groupId}/messages`, JSON.stringify({
        senderId:`${senderId}`,
        text:`${text}`,
      }));
      setGroupMessages((prevMessages) => [...prevMessages, data]);
    } catch (error) {
      console.error('Failed to send group message:', error);
    }
  };

  const fetchGroupChats = async (groupId) => {
    try {
      const data = await getRequest(`${baseUrl}/chat/${groupId}/findChat`);
      setGroupChats(data);
    } catch (error) {
      console.error('Failed to fetch group chats:', error);
    }
  };

  return (
    <GroupContext.Provider
      value={{
        groupMessages,
        groupChats,
        fetchGroupMessages,
        sendGroupMessage,
        fetchGroupChats,
        setCurrentGroupId,
        setSelectedGroup,
        selectedGroup
      }}
    >
      {children}
    </GroupContext.Provider>
  );
};
