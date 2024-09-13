import { Stack } from "react-bootstrap";
import { useFetchRecipientUser } from "../../hooks/useFetchRecipient";
import avatar from "../../assets/avatar.svg"
import { useContext } from "react";
import { ChatContext } from "@/context/ChatContext";

import Webcam from "react-webcam";
import { useRef} from "react";
 

const UserChat = ({chat,user}) => {
    const webRef=useRef(null)
    const {recipientUser} = useFetchRecipientUser(chat,user)
    const {onlineUsers} = useContext(ChatContext)

   
    const isOnline =  onlineUsers?.some(user => user?.userId === recipientUser?.id)
    console.log("user is online",isOnline,onlineUsers)
    console.log("Recipient User",recipientUser)
    return ( 
        <>
        <div direction="horizontal" gap={1} className=" flex justify-between  border-b-2 rounded-xl mx-1 p-1 border-gray-600/40 bg-blue-200 transform h-50 transition duration-500 hover:bg-blue-100" role="button">    
            <div className="d-flex  ">
                <div className="me-2">
                    <img src={avatar} height='35px' className="profile-image"/>
                </div>
                <div className="text-content">
                    
                {Array.isArray(recipientUser) ? (
                        recipientUser.map((user, index) => (
                            <div className="name" key={index}>
                                {user?.name || 'NO Name Available'}
                            </div>
                        ))
                    ) : (
                        <div className="name ">{recipientUser?.name || 'No Name Available'}</div>
                    )}
                    <div className="text">Text Message</div>
                </div>
            </div>

 
            <div className=" d-flex  flex-column justify-around p-1 items-end ">
                <div className="this-user-notifications">2</div>
                <div className="date">{chat?.lastChatDate}</div>
                <div className={isOnline?"user-online":""}></div>

            </div>
            
        </div>
        </>
    );
}
 
export default UserChat;

//user-card align-items-center p-2 justify-between 