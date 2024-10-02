import { createContext, useCallback, useEffect, useState ,useMemo} from "react";
import { getRequest,baseUrl ,postRequest, filebaseUrl} from "../utils/services";
import {io} from 'socket.io-client'


export const ChatContext = createContext();

export const ChatContextProvider = ({children,user}) => {
    const [userChats,setUserChats] = useState(null)
    const [isUserChatsLoading,setUserChatsLoading] = useState(false);
    const [userChatsError,setUserChatsError] = useState(null);
    const [potentialChats, setPotentialChats] = useState(null)
    const [currentChat,setCurrentChat] = useState(null)
    const [messages,setMessages] = useState(null)
    const [isMessagesLoading,setMessagesLoading] = useState(null)
    const [messagesError,setMessagesError] = useState(null)
    const [sendTextMessageError,setSendTextMessageError] = useState(null)
    const [newMessage,setNewMessage] = useState(null)
    const [socket,setSocket] = useState(null)
    const [onlineUsers,setOnlineUsers] = useState([])
    const [notifications, setNotification] = useState([])
    const [organizationId,setOrganizationId] = useState(null)
    const [currentGroup, setCurrentGroup] = useState(null);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [messagesGroup, setMessagesGroup] = useState([]);
  const [error, setError] = useState(null);

 // Memoize user ID to avoid recalculating it on every render
 const userId = useMemo(() => user?.id, [user]);

 // Socket initialization (memoized to avoid re-renders)
 useEffect(() => {
   if (!userId) return;

   const newSocket = io(`${filebaseUrl}`);
   setSocket(newSocket);

   return () => {
     newSocket.disconnect();
   };
 }, [userId]);

  useEffect(() => {
    const fetchGroups = async () => {
      setLoading(true);
      const result = await getRequest(`${baseUrl}/groups`);
      if (result.error) {
        setError(result.message);
      } else {
        setGroups(result);
      }
      setLoading(false);
    };

    fetchGroups();
  }, []);




// Function to set the current group
const selectGroup = async (groupId) => {
    const result = await getRequest(`${baseUrl}/groups/${groupId}`);
    if (result.error) {
      setError(result.message);
    } else {
      setCurrentGroup(result);
    }
  };

  // Function to send a message to a group
  const sendMessageToGroup = async (groupId) => {
    const result = await postRequest(`${baseUrl}/chat/${groupId}/messages`, JSON.stringify({ text: message }));
    if (result.error) {
      setError(result.message);
    } else {
      // Optionally update the current group with the new message
      if (currentGroup && currentGroup.id === groupId) {
        setCurrentGroup(prev => ({
          ...prev,
          messages: [...(prev.messages || []), result]
        }));
        setMessagesGroup(prevMessages => [...prevMessages, result]);

      }
    }
  };

  // Function to fetch messages for the current group
  const fetchGroupMessages = async (groupId) => {
    setLoading(true);
    const result = await getRequest(`${baseUrl}/groups/${groupId}/messages`);
    if (result.error) {
      setError(result.message);
    } else {
      setMessagesGroup(result);
    }
    setLoading(false);
  };


  


    //add online users
    useEffect(() => {
        if(socket === null) return
        
        socket.emit("addNewUser",user?.id)
        
        socket.on("getOnlineUsers",(response) => {
            setOnlineUsers(response)
        })

        return () => {
            socket.off("getOnlineUsers")
        }
    },[socket,userId])

    //send messages
    useEffect(() => {
        
        if(socket === null) return
        
    
        // const recipientId = currentChat?.members.find(id => id!=user?.id)
        const membersArray = typeof currentChat?.members === "string" ? JSON.parse(currentChat.members) : currentChat?.members;
    
    const recipientId = membersArray?.find(id => id != user?.id);
        // console.log("recipient after message",recipientId)

        socket.emit("sendMessage",{...newMessage,recipientId})
    },[newMessage])

    //receive message and notification
    useEffect(() => {
        if(socket === null) return
        
        socket.on("getMessages",response => {
            if(currentChat?.id !== response.chatId) return 

            setMessages(prev => [...prev,response])
        })


        socket.on("getNotification",(response) => {
            const isChatOpen = currentChat?.members.some(id => id === response.senderId)

            if(isChatOpen) {
                setNotification(prev => [{...response,isRead:true},...prev])
            }
            else {
                setNotification(prev => [response,...prev])
            }
        })

        return ()=> {
            socket.off("getMessages")
            socket.off("getNotification")
        }
    },[socket,currentChat])





    useEffect(() => {
        const getUser = async() => {
            const response = await getRequest(`${baseUrl}/users`)
            if(response.error) {
                return console.log("Error fetching users",response)
            }
            // console.log('upar',user)
            const pChats = response.filter((u) => {
                let isChatCreated = false
                
                // console.log("user n chat",u)
                if(user?.id === u.id) return false
            
                if(userChats) {
                    isChatCreated = userChats?.some((chat) => {
                        return chat.members[0] === u.id || chat.members[1] === u.id
                    })

                }

                return !isChatCreated
            })

            setPotentialChats(pChats)
            
        }
        getUser()
    },[userChats])

   

    useEffect(() => {
        const getUserChats = async() => {
            if(user?.id) {
                setUserChatsLoading(true)
                setUserChatsError(null)


                const response = await getRequest(`${baseUrl}/chat/${user?.id}`)

                setUserChatsLoading(false)
                if(response.error) {
                    return setUserChatsError(response)
                }
                setUserChats(response)
            }
        }
        getUserChats()
    },[user])



    
    useEffect(() => {
        if(!currentChat) {
            // console.log('Current chat is null or undefined,skipping getMessages')
            return;
        }
        // console.log("fetching messages for chatId:",currentChat.id)
        const getMessages = async() => {
           
                setMessagesLoading(true)
                setMessagesError(null)


                const response = await getRequest(`${baseUrl}/messages/${currentChat?.id}`)

                setMessagesLoading(false)
                if(response.error) {
                    return setMessagesError(response)
                }
                if (!Array.isArray(response)) {
                    console.error("Invalid response format, expected an array:", response);
                    return;
                }
                if (JSON.stringify(response) !== JSON.stringify(messages)) {
                    setMessages(response); // Only update if messages are different
                }
            
        }
        getMessages()
    },[currentChat])

    const sendTextMessage = useCallback(async(textMessage,sender,currentChatId,setTextMessage) => {
        if(!textMessage) return console.log("you must type something")
            const response = await postRequest(`${baseUrl}/messages`,JSON.stringify({
                chatId:currentChatId,
                senderId:sender.id,
                text:textMessage
            }))
            if(response.error) {
                return setSendTextMessageError(response)
            }
            setNewMessage(response)
            setMessages((prev)=>[...prev,response])
            setTextMessage("")

    },[setMessages,setNewMessage])

    const updateCurrentChat = useCallback((chat) => {
        // console.log("updating current chat to:",chat)
        setCurrentChat(chat)
    },[])



    const createChat = useCallback(async(Id1,Id2) => {
        const response = await postRequest(`${baseUrl}/chat`,JSON.stringify({
            firstId:`${Id1}`,
            secondId:`${Id2}`,
        }))
        
        if(response.error) {
            return console.log("Error creating chat",response)
        }
        if (!response.members) {
            console.error("Invalid chat structure:", response);
            return;
        }
        
        setUserChats((prev) => [...prev,response])
        // setUserChats((prev) => {
        //     const isAlreadyExist = prev.some(chat => chat.id === response.id);
        //     if (isAlreadyExist) return prev;
        //     return [...prev, response];
        // });

        

        // setPotentialChats((prev) => prev.filter((u) => u.id !== secondId));
    },[])



    

  

    const contextValue = useMemo(() => ({
        userChats,
        isUserChatsLoading,
        userChatsError,
        potentialChats,
        createChat,
        currentChat,
        updateCurrentChat,
        messages,
        isMessagesLoading,
        messagesError,
        sendTextMessage,
        onlineUsers,
        organizationId,
        setOrganizationId,
        currentGroup,
        groups,
        loading,
        error,
        selectGroup,
        sendMessageToGroup,
        messagesGroup,
        setMessagesGroup,
        fetchGroupMessages
    }), [
        userChats, isUserChatsLoading, userChatsError, potentialChats, createChat, currentChat, 
        updateCurrentChat, messages, isMessagesLoading, messagesError, sendTextMessage, onlineUsers,
        organizationId, currentGroup, groups, loading, error, messagesGroup
    ]);
    

    


    

    return <ChatContext.Provider value={contextValue}>
        {children}
        </ChatContext.Provider>
}