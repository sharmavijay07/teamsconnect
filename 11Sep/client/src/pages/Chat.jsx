import { useContext, useState } from "react";
import { ChatContext } from "../context/ChatContext";
import { Container } from "react-bootstrap";
import UserChat from "../components/chat/UserChat";
import { AuthContext } from "../context/AuthContext";
import PotentialChats from "../components/chat/PotentialChats";
import ChatBox from "@/components/chat/ChatBox";
import NavBar from "@/components/NavBar";
import Sidebar from "@/components/chat/SideBar";
import Group from "@/components/chat/Group";
import Calendar from "@/components/chat/Calendar";
import GroupManagementPage from "@/components/chat/GroupManagementPage";

const Chat = () => {
    const { user } = useContext(AuthContext);
    const { userChats, isUserChatsLoading, updateCurrentChat } = useContext(ChatContext);
    const [activeSection, setActiveSection] = useState("chat"); // State to track active section

    return (
        <div className="w-screen bg-blue-300 h-screen">
            <NavBar />
            <Container className="bg-blue-300 w-full p-0 m-0">
                <div className="flex w-screen">
                    <Sidebar 
                        setActiveSection={setActiveSection} 
                        activeSection={activeSection} 
                        className="basis-[4%]" 
                    />
                    <div className="center-div basis-[76%] ">
                        {activeSection === "chat" && (
                            <>
                                {userChats?.length < 1 ? (
                                    <ChatBox />
                                ) : (
                                    <>
                                        <ChatBox />
                                        {/* <div className="flex flex-col gap-3">
                                            <PotentialChats />
                                            {isUserChatsLoading && <p>Loading chats....</p>}
                                            {userChats?.map((chat, index) => (
                                                <div key={index} onClick={() => updateCurrentChat(chat)}>
                                                    <UserChat chat={chat} user={user} />
                                                </div>
                                            ))}
                                        </div> */}
                                    </>
                                )}
                            </>
                        )}
                        {activeSection === "group" && <Group />}
                        {activeSection === "calendar" && <Calendar />}
                        {activeSection === "call" && <Call />}
                        {/* Add more sections here as needed */}
                    </div>
                    <div className="right-div basis-[20%]  border-l-2 border-black">
                    
                    {activeSection === "chat" && (
                            <>
                                <div className="flex flex-col gap-2">
                                    <PotentialChats />
                                    {isUserChatsLoading && <p>Loading chats....</p>}
                                    {userChats?.map((chat, index) => (
                                        <div key={index} onClick={() => updateCurrentChat(chat)}>
                                            <UserChat chat={chat} user={user} />
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
            {activeSection === "group" && <GroupManagementPage />}


                    </div>
                </div>
            </Container>
        </div>
    );
}

export default Chat;