import React, { useState, useContext, useEffect, useRef } from "react";
import { GroupContext } from "../../context/GroupContext";
import { ChatContext } from "@/context/ChatContext";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import moment from "moment"; // Import moment.js for date formatting
import SideBar from "./SideBar";
import InputImoji from "react-input-emoji";

const GroupChatBox = ({ group }) => {
  const { groupMessages, sendGroupMessage } = useContext(GroupContext);
  const { messages } = useContext(ChatContext);
  const { user } = useContext(AuthContext);
  const [textMessage, setTextMessage] = useState("");

  // Create a ref to reference the chat container for scrolling
  const scroll = useRef();

  const [message, setMessage] = useState("");
  const [senderNames, setSenderNames] = useState({});

  useEffect(() => {
    scroll.current?.scrollIntoView({ behavior: "smooth" });
  }, [groupMessages]); // Ensure smooth scrolling whenever groupMessages changes

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
    if (textMessage.trim()) {
      sendGroupMessage(group.id, user.id, textMessage);
      setTextMessage("");
      scroll.current?.scrollIntoView({ behavior: "smooth" }); // Smooth scroll to the latest message
    }
  };

  // Handle "Enter" key to send the message
  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col p-0 bg-blue-100 h-[89vh] overflow-hidden">
      <h4 className="text-lg font-semibold mb-2">Chat for {group.name}</h4>
      <div
        // Ref attached to the chat container
        className="flex-1 overflow-auto scrollbar scrollbar-thumb-sky-500 scrollbar-corner-sky-500 scrollbar-thumb-rounded-full hover:scrollbar-thumb-sky-500/60 overscroll-y-auto rounded-[5px] w-[76vw] h-[87vh]"
      >
        {groupMessages?.map((msg) => (
          <div key={msg.id}>
            <div>
              <div
                className={`${
                  msg?.senderId == user?.id
                    ? "bg-gray-400/40 w-fit max-w-[70%] min-w-[15%] p-1  px-3 mr-2  rounded-[8px]  mt-2 ml-auto flex-grow-0  break-words  text-wrap  text-dark "
                    : "bg-blue-300/70 w-fit max-w-[70%] min-w-[15%] p-1 px-3 ml-2  rounded-[8px]  mt-1 flex-grow-0   break-words  text-dark"
                }`}
                ref={scroll} // Reference for smooth scrolling
              >
                <strong>{senderNames[msg.senderId] || "Unknown"}:</strong>
                <div>{msg.text}</div>
                <div className="">
                  <span
                    className={`${
                      msg?.senderId == user?.id ? " ml-auto " : " ml-auto"
                    }`}
                  >
                    {moment(msg.createdAt).format("h:mm a")}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex">
        <InputImoji
          value={textMessage}
          onChange={setTextMessage} // Update the message state
          className="border border-[rgba(72,255,200,0.4)] focus:outline-none focus:border-red-500 rounded-none px-4 py-2"
          onKeyDown={handleKeyDown} // Handle "Enter" key press to send message
        />
        <button onClick={handleSend} className="p-2 m-3 bg-blue-500 text-white">
          Send
        </button>
      </div>
    </div>
  );
};

export default GroupChatBox;
