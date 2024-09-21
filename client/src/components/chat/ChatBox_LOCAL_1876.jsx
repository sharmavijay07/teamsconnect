import { useContext, useState, useRef, useEffect } from "react";
import { AuthContext } from "@/context/AuthContext";
import { ChatContext } from "@/context/ChatContext";
import { useFetchRecipientUser } from "@/hooks/useFetchRecipient";
import { Button, Modal } from "react-bootstrap"; // Import Modal from react-bootstrap
import InputImoji from 'react-input-emoji';
import PotentialChats from "./PotentialChats";
import UserChat from "./UserChat";
import FileDisplay from "../fileHandling/FileDisplay";
import moment from 'moment';
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';

// Helper for notifications
const notify = (message, type) => {
  toast[type](message, { position: "top-right", autoClose: 5000, pauseOnHover: true });
};

const ChatBox = () => {
  const { user, setFileChatId } = useContext(AuthContext);
  const { currentChat, messages, sendTextMessage, userChats } = useContext(ChatContext);
  const { recipientUser } = useFetchRecipientUser(currentChat, user);
  const [textMessage, setTextMessage] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewURL, setPreviewURL] = useState(null);
  const [showModal, setShowModal] = useState(true); // State to manage the modal visibility
  const scroll = useRef();

  useEffect(() => {
    scroll.current?.scrollIntoView();
  }, [messages]);

  useEffect(() => {
    if (currentChat) {
      setFileChatId(currentChat.id);
    }
  }, [currentChat]);

  const openModal = () => setModalIsOpen(true);
  const closeModal = () => {
    setModalIsOpen(false);

  };

  // Handle file selection and open modal for preview
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewURL(URL.createObjectURL(file));
      setShowModal(true); // Open modal when file is selected
    }
  };

  // Handle file upload
  const handleFileUpload = async () => {
    if (selectedFile) {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('chatId', currentChat?.id);

      try {
        const response = await fetch('http://localhost:4500/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) throw new Error(`Error: ${response.statusText}`);

        const result = await response.json();
        if (result.success) {
          notify("File uploaded successfully!", "success");
          const fileUrl = result.fileUrl; // Assume API response contains the uploaded file URL

          // Send the file URL as a message
          sendTextMessage(fileUrl, user, currentChat.id, setTextMessage);
          setSelectedFile(null);
          setPreviewURL(null);
          setShowModal(false); // Close modal after upload
        } else {
          notify("File upload failed!", "error");
        }
      } catch (error) {
        console.error('Error during fetch:', error);
        notify('An error occurred during file upload: ' + error.message, 'error');
      }
    }
  };

  // Handle keydown event for sending message on Enter key
  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault(); // Prevent default behavior (new line)
      sendTextMessage(textMessage, user, currentChat.id, setTextMessage);
    }
  };

  // Render the chat UI
  return (
    <>
      <div className="h-[95vh] w-[76vw] flex flex-col justify-between bg-b-30 text-center" style={{ color: "white" }}>
        <div className="bg-gray-400 flex rounded-[5px] border-1 border-black flex justify-between w-[76vw]">
          <strong className="text-black mr-80 p-1 ml-3" title="user Name">
            {recipientUser.map((user) => user.name).join(',')}
          </strong>
          <div className="text-black flex mx-3">
            <span className="material-symbols-outlined mt-1 hover:text-blue-500 pointer" title="Audio Call">
              wifi_calling_bar_2
            </span>
            <span className="material-symbols-outlined mt-1 ml-3 align-left hover:text-blue-500" title="Video Call">
              videocam
            </span>
          </div>
        </div>

        <div className="bg-blue-100 overflow-y-scroll rounded-[5px] w-[76vw] h-[87vh]" style={{ color: "black" }}>
          <FileDisplay />
          {messages &&
            messages.map((message, index) => (
              <div
                key={index}
                className={`${message?.senderId == user?.id
                  ? "max-w-[30vh] min-w-[15%] p-1 px-3 rounded-[8px] mt-2 ml-auto"
                  : "bg-blue-300/70 w-fit max-w-[70%] min-w-[15%] p-1 px-3 ml-2 rounded-[8px] mt-1"
                  }`}
                ref={scroll}
              >
                <span>{message.text}</span>
                <div className="">
                  <span className={message?.senderId == user?.id ? "ml-auto" : "ml-auto"}>
                    {moment(message.createdAt).format('h:mm a')}
                  </span>
                </div>
              </div>
            ))}
        </div>

        {/* Input area */}
        <div className="flex justify-between items-center bg-gray-400 rounded-[2px]">
          <InputImoji
            value={textMessage}
            onChange={setTextMessage}
            className="border border-[rgba(72,255,200,0.4)] focus:outline-none px-4 py-2"
            onKeyDown={handleKeyDown}
          />

          <div>
            {/* File upload button */}
            
            <button onClick={showModal}>
              <span className="material-symbols-outlined text-gray-500 mt-1 mr-2 mb-1 hover:text-blue-500" style={{ fontSize: '4vh' }}>
                upload_file
              </span>
            </button>
          </div>

          <Button className="send-btn" onClick={() => sendTextMessage(textMessage, user, currentChat.id, setTextMessage)}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="cyan" className="bi bi-send-fill" viewBox="1 1 16 16">
              <path d="M15.964.686a.5.5 0 0 0-.588-.186L1.12 6.172a.5.5 0 0 0-.073.91l2.506 1.16-1.644 3.59a.5.5 0 0 0 .798.606l2.396-1.84 6.806 3.045a.5.5 0 0 0 .638-.263l4-9a.5.5 0 0 0-.209-.617z" />
            </svg>
          </Button>
        </div>
      </div>

      {/* File Preview Modal */}
      <Modal show={showModal} onHide={() => closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>File Preview</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <input
              type="file"
              id="fileInput"
              style={{ display: "none" }}
              onChange={handleFileChange} // Handle file selection
            />
          {previewURL && <img src={previewURL} alt="File preview" style={{ maxWidth: '100%' }} />}
          {selectedFile && <p>{selectedFile.name}</p>}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleFileUpload}>Upload</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ChatBox;
