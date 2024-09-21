import { useContext, useState, useRef, useEffect } from "react";
import { AuthContext } from "@/context/AuthContext";
import { ChatContext } from "@/context/ChatContext";
import { useFetchRecipientUser } from "@/hooks/useFetchRecipient";
import { Button } from "react-bootstrap";
import moment from 'moment';
import InputImoji from 'react-input-emoji';
import PotentialChats from "./PotentialChats";
import UserChat from "./UserChat";
import FileDisplay from "../fileHandling/FileDisplay";
import axios from 'axios'
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import { CommitOutlined } from "@mui/icons-material";

const notify = (message, type) => {
    const toastId = `${type}-${Date.now()}`;
    toast[type](message, {
      toastId,
    });
    toast.error("error file uploading!", {
        position: "top-right",
        autoClose: 5000, // duration in milliseconds
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
  };

const ChatBox = () => {
    const { user ,setFileChatId,file} = useContext(AuthContext);
    console.log('file is',file)
    const { currentChat, messages, isMessagesLoading, sendTextMessage, userChats, isUserChatsLoading } = useContext(ChatContext);
    const { recipientUser } = useFetchRecipientUser(currentChat, user);
    const [textMessage, setTextMessage] = useState('');
    const [currentTime, setCurrentTime] = useState(new Date());
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewURL, setPreviewURL] = useState(null);

    //--------------------------9/09/24-------------------------
    const [allMessages,setAllMessages] = useState()
    const [onlyMessages,setOnlyMessages] = useState([])
    const [combinedMessages,setCombinedMessages] = useState()




    
    const scroll = useRef();

   
    
    
    useEffect(() => {
        scroll.current?.scrollIntoView();
    }, [messages]);

    //all messages

    
    function getMessage() {
        const chatId = currentChat?.id
        axios.get(`http://localhost:4500/api/messages/${chatId}`)
        .then((resp) => {
                console.log("got messages for particular chatid",resp)
              setOnlyMessages(resp.data)
              console.log("onlu=y messages",onlyMessages)


              
              const combinedMessage = [...(file || []), ...(onlyMessages || [])];
            
              // Sort the combined array based on the createdAt timestamp
            //   combinedMessages.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
              combinedMessage.sort((a, b) => {
                const aTime = a.createdAt ? new Date(a.createdAt) : new Date(a.uploadedAt);
                const bTime = b.createdAt ? new Date(b.createdAt) : new Date(b.uploadedAt);
                return aTime - bTime;
            });
          setCombinedMessages(combinedMessage)
            
              console.log("combinedMessages",combinedMessages)
              console.log("files in combined",file)
             
            })
            .catch((err) => {
              console.warn("Error of allMessages",err)
            })

            
    
                
               
    }
   

    useEffect(() => {
        const chatId = currentChat?.id
        axios.get(`http://localhost:4500/api/upload/allMessages/${chatId}`)

        .then((resp) => {
            getMessage()
        //   alert(chatId)
          console.log("Got all messages with files",resp)
          setAllMessages(resp.data.result)
          // alert("got all messages")
        })
        .catch((err) => {
          console.warn("Error of allMessages",err)
        })
      },[file,combinedMessages,currentChat])
      
      const getFileUrl = (filePath) => {
        const formattedPath = filePath.replace(/\\/g, '/');
        const fullPath = formattedPath.startsWith('uploads/') ? formattedPath.replace('uploads/', '') : formattedPath;
        return `http://localhost:4500/uploads/${fullPath}`;
      };
    


    // Effect to update the time every minute
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000); // Update every second for real-time effect

        // Cleanup interval on component unmount
        return () => clearInterval(timer);
    }, []);

    // Function to get the ordinal suffix (st, nd, rd, th)
    function getOrdinalSuffix(day) {
        if (day > 3 && day < 21) return 'th'; // For 11th to 19th
        switch (day % 10) {
            case 1: return 'st';
            case 2: return 'nd';
            case 3: return 'rd';
            default: return 'th';
        }
    }

    // Extract the date, time, and year
    const hours = currentTime.getHours();
    const minutes = currentTime.getMinutes();
    const date = currentTime.getDate();
    const year = currentTime.getFullYear();
    
    // Format time to 12-hour format with AM/PM
    const formattedHours = hours % 12 || 12; // Convert 24-hour to 12-hour format
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedMinutes = minutes.toString().padStart(2, '0');
    const dayName = currentTime.toLocaleDateString('en-US', { weekday: 'long' });
    const monthName = currentTime.toLocaleDateString('en-US', { month: 'long' });

 ///----------------------------------------9/09/24--------------------------------------------

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
  

  const handleFileUpload = async () => {
    // console.log("filechatid")
    if (selectedFile) {
        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('chatId', currentChat?.id);
        formData.append('senderId',user.id);

        try {
            const response = await fetch('http://localhost:4500/api/upload', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw error
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

  



///=---------------------------------------9/09/24------------------------------------------------------------



    if (!recipientUser) return (
        <>
            {userChats?.length < 1 ? (
                <div className="h-[95vh] w-screen bg-black flex" >
                    {/* <div className="bg-blue-300 basis-[4%]"><SideBar/></div> */}
                    <div className="bg-blue-100 basis-[76%] flex flex-col justify-around pb-5">
                        <div className="mt-10 ml-20 mb-15">
                            <ul className="text-black ">
                                <li className="text-5xl">Welcome to TeamsConnect</li>
                                <li className="text-4xl">{formattedHours}:{formattedMinutes} {ampm}</li>
                                <li>{dayName}, {monthName} {date}<sup>{getOrdinalSuffix(date)}</sup>, {year}</li>
                            </ul>
                        </div>
                        <div className="flex justify-center m-0 h-72 w-[32rem] mx-auto ">
                            <img className="w-[32rem] drop-shadow-2xl" src="src/assets/home.png" alt="image"/>
                        </div>
                        <div className="flex justify-around w-full">
                            <div className="bg-blue-300 h-[10vh] w-[30vh] flex items-center justify-center text-black p-2 shadow-xl shadow-blue-400/40 rounded border-1 border-blue-400"> Search for people in your organization</div>
                            <div className="bg-blue-300 h-[10vh] w-[30vh] flex items-center justify-center text-black p-2 shadow-xl shadow-blue-400/40 rounded border-1 border-blue-400">Join Channel</div>
                            <div className="bg-blue-300 h-[10vh] w-[30vh] flex items-center justify-center text-black p-2 shadow-xl shadow-blue-400/40 rounded border-1 border-blue-400"> Try video conferencing </div>
                        </div>
                    </div>
                    <div className="bg-blue-300 basis-[20%]">
                        <PotentialChats/>
                        <UserChat/>
                    </div>
                </div>
            ) : 
                (
                    <div className="h-[95vh] w-[100%] m-0 bg- flex">
            {/* <div className="bg-blue-300 basis-[6%]"><SideBar/></div> */}
            <div className="bg-blue-100 basis-[100%] flex flex-col justify-around pb-5">
                <div className="mt-10 ml-20 mb-15">
                    <ul className="text-black ">
                        <li className="text-5xl">Welcome to TeamsConnect</li>
                        <li className="text-4xl">{formattedHours}:{formattedMinutes} {ampm}</li>
                        <li>{dayName}, {monthName} {date}<sup>{getOrdinalSuffix(date)}</sup>, {year}</li>
                    </ul>
                </div>
                <div className="flex justify-center m-0 h-72 w-[32rem] mx-auto ">
                    <img className="w-[32rem]" src="src/assets/home.png" alt="image"/>
                </div>
                <div className="flex justify-around w-full">
                    <div className="bg-blue-300 h-[10vh] w-[30vh] flex items-center justify-center text-black p-2 shadow-xl shadow-blue-400/40 rounded border-1 border-blue-400"> Search for people in your organization</div>
                    <div className="bg-blue-300 h-[10vh] w-[30vh] flex items-center justify-center text-black p-2 shadow-xl shadow-blue-400/40 rounded border-1 border-blue-400">Join Channel</div>
                    <div className="bg-blue-300 h-[10vh] w-[30vh] flex items-center justify-center text-black p-2 shadow-xl shadow-blue-400/40 rounded border-1 border-blue-400"> Try video conferencing </div>
                </div>
            </div>
        </div>
                )
            }
        </>
    );

    if (isMessagesLoading) return (
        <p style={{ textAlign: "center", width: "100%", color: "white" }}>
            Loading chat...
        </p>
    );

    // Handle keydown event for sending message on Enter key
    const handleKeyDown = (event) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault(); // Prevent default behavior (new line)
            sendTextMessage(textMessage, user, currentChat.id, setTextMessage);
        }
    };

    //---------------------------------------------------------//
    //------------------------------------------------------//

    return (
        <>
        <div gap={4} className='h-[95vh] w-[76vw] flex flex-col justify-between bg-b-30 text-center' style={{ color: "white" }}>
            <div className="bg-gray-400 flex rounded-[5px] border-1 border-black flex justify-between w-[76vw]">
                <strong class="text-black mr-80  p-1  ml-3   " title="user Name">
                    {recipientUser.map((user) => user.name).join(',')}
                </strong> 
                <div class=" text-black flex mx-3">
                <span class="material-symbols-outlined mt-1 hover:text-blue-500 pointer " title="Audio Call">
                wifi_calling_bar_2  
                </span>
                    <span class="material-symbols-outlined mt-1 ml-3 align-left hover:text-blue-500" title="Video Call">
                videocam
                </span></div>

            </div>

            
          <>
           <div gap={3} className="bg-blue-100 overflow-y-scroll scrollbar scrollbar-thumb-sky-500 scrollbar-corner-sky-500 scrollbar-thumb-rounded-full  hover:scrollbar-thumb-sky-500/60 overscroll-y-auto rounded-[5px] w-[76vw] h-[87vh]   
                  " style={{ color: "black" }}>
                    {/* <FileDisplay /> */}
                {combinedMessages && combinedMessages?.map((message, index) =>
                    <> {message.isFile?
                         <div className={
                            `${message?.senderId == user?.id
                                ? " w-auto max-w-[90%] min-w-[15%] p-1 rounded-[8px]  mt-2 ml-auto flex flex-col flex-grow-0 items-end  break-words  text-wrap  text-dark "
                                : " w-fit max-w-[70%] min-w-[15%] p-1s ml-2  rounded-[8px]  mt-2 flex flex-col flex-grow-0   break-words  text-dark"
                            }`}
                            ref={scroll}   >
                    {message.filePath.endsWith('.png') || message.filePath.endsWith('.jpg') || message.filePath.endsWith('.gif') ? (
              <img
                src={getFileUrl(message.filePath)}
                alt={file-`${index}`}
                style={{ width: '150px', height: '150px' }}
              />
            ) : (
              // Download link for non-image files
              <a  href={getFileUrl(message.filePath)} download>
                Download {message.filePath.split('/').pop()}
              </a>
            )}
            <p>Uploaded At: {new Date(message.uploadedAt).toLocaleString()}</p>
                    </div>:""}






                        <div key={index} className={
                            `${message?.senderId == user?.id
                                ? "bg-gray-400/40 w-fit max-w-[70%] min-w-[15%] p-1  px-3 mr-2  rounded-[8px]  mt-2 ml-auto flex-grow-0  break-words  text-wrap  text-dark "
                                : "bg-blue-300/70 w-fit max-w-[70%] min-w-[15%] p-1 px-3 ml-2  rounded-[8px]  mt-1 flex-grow-0   break-words  text-dark"
                            }`}
                            ref={scroll}    
                        >
                            <span>{message.text}</span>
                            <div className="">
                            <span className={
                           ` ${message?.senderId == user?.id
                                ? " ml-auto "
                                : " ml-auto"
                            }`}>{moment(message.createdAt).format('h:mm a')}</span></div>
                        </div>
                    

                   
                    </>
                )}




            </div>


       

            
    
            </>
            
                
{/* Input area */}
<div className="flex justify-between items-center bg-gray-400 rounded-[2px] flex-grow-0">
        <InputImoji
            value={textMessage}
            onChange={setTextMessage}
            className="border border-[rgba(72,255,200,0.4)] focus:outline-none focus:border-red-500 rounded-none px-4 py-2"
            onKeyDown={handleKeyDown}
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


                <Button className="send-btn" onClick={() => {
                    sendTextMessage(textMessage, user, currentChat.id, setTextMessage)
                    handleFileUpload()
                    
                }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="cyan" className="bi bi-send-fill" viewBox="1 1 16 16">
                        <path d="M15.964.686a.5.5 0 0 0-.588-.186L1.12 6.172a.5.5 0 0 0-.073.91l2.506 1.16-1.644 3.59a.5.5 0 0 0 .798.606l2.396-1.84 6.806 3.045a.5.5 0 0 0 .638-.263l4-9a.5.5 0 0 0-.209-.617z"/>
                    </svg>
                </Button>
            </div>
        </div>
        </>
        
    );
};

export default ChatBox;