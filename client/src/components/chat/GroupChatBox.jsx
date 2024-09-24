import React, { useState, useContext, useEffect, useRef } from "react";
import { GroupContext } from "../../context/GroupContext";
import { ChatContext } from "@/context/ChatContext";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import moment from "moment"; // Import moment.js for date formatting
import SideBar from "./SideBar";
import InputImoji from "react-input-emoji";
import FileDisplay from "../fileHandling/FileDisplay";
import { baseUrl } from "@/utils/services";

// input statements above ^ ^ ^ 



const GroupChatBox = ({ group }) => {
  const { user ,setFileChatId,file} = useContext(AuthContext);
    console.log('file is',file)
  const { groupMessages, sendGroupMessage ,currentChat} = useContext(GroupContext);
  const { messages } = useContext(ChatContext);
  const [selectedFile, setSelectedFile] = useState(null);

  const [textMessage, setTextMessage] = useState("");
  const [previewURL, setPreviewURL] = useState(null);


  // Create a ref to reference the chat container for scrolling
  const scroll = useRef();

  const [message, setMessage] = useState("");
  const [senderNames, setSenderNames] = useState({});

  useEffect(() => {
    scroll.current?.scrollIntoView();
  }, [groupMessages]); // Ensure smooth scrolling whenever groupMessages changes

  useEffect(()=> {
    if(currentChat) {
    setFileChatId(currentChat.id)

    }
 },[currentChat])
 const handleFileChange = (event) => {
    const file = event.target.files[0];
    console.log("Selected File:", file);
    setSelectedFile(file);
    setPreviewURL(URL.createObjectURL(file));
  };
  

  useEffect(() => {
    const fetchSenderNames = async () => {
      const senderIds = [...new Set(groupMessages.map((msg) => msg.senderId))];
      const names = {};

      try {
        for (let id of senderIds) {
          const response = await axios.get(
            `${baseUrl}/users/find/${id}`
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

  const handleFileUpload = async () => {
    // console.log("filechatid")
    if (selectedFile) {
        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('chatId', currentChat?.id);

        try {
            const response = await fetch(`${baseUrl}/upload`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }

            const result = await response.json();
            if (result.success) {
                const fileUrl = result.fileUrl; // Assume API response contains the uploaded file URL
                notify("file uploaded successfully!", "success");
                
                // Send the file URL as a message
                sendTextMessage(fileUrl, user, currentChat.id, setTextMessage);
                
                setSelectedFile(null);
                setPreviewURL(null);
            } else {
                notify("file upload failed!", "error");
            }   
        } catch (error) {
            console.error('Error during fetch:', error);
            
            alert('An error occurred during file upload: ' + error.message);
        }
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

        {/* below is div for file click and upload  */}
        <div>
            <input
                type="file"
                id="fileInput"
                style={{ display: "none" }}
                onChange={handleFileChange}
            />
            <button onClick={() => document.getElementById('fileInput').click()}>
                <span className="material-symbols-outlined text-gray-500 mt-1 mr-2 mb-1 hover:text-blue-500" style={{ fontSize: '4vh' }}>
                    upload_file
                </span>
            </button>
            {previewURL && (
                <div className="file-preview mt-2">
                    {selectedFile.type.startsWith('image/') ? (
                        <img src={previewURL} alt="File preview" style={{ maxWidth: '100px', maxHeight: '100px' }} />
                    ) : (
                        <div className="file-info">
                            <span>{selectedFile.name}</span>
                        </div>
                    )}
                    {/* <button onClick={handleFileUpload} className="send-file-btn text-black border border-gray-600 rounded px-2 py-1 mt-1">
                        Send
                    </button> */}
                </div>
            )}
        </div>
        
        <button
          onClick={()=>{ handleSend , handleFileUpload()}}
          className="p-2 m-3 bg-blue-500 rounded-3xl text-white"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="cyan"
            className="bi bi-send-fill"
            viewBox="1 1 16 16"
          >
            <path d="M15.964.686a.5.5 0 0 0-.588-.186L1.12 6.172a.5.5 0 0 0-.073.91l2.506 1.16-1.644 3.59a.5.5 0 0 0 .798.606l2.396-1.84 6.806 3.045a.5.5 0 0 0 .638-.263l4-9a.5.5 0 0 0-.209-.617z" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default GroupChatBox;
