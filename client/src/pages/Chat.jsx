import { useContext, useEffect, useState } from "react";
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
import Video from "@/components/video/Video";
import HomePage from "@/components/chat/OriginalVideo/HomePage";
import { PurposeContext } from "@/context/PurposeContext";
// import '../components/chat/mobile/mobile.jsx'

const Chat = () => {
    const { user ,isRightBarOpen} = useContext(AuthContext);
    const { isUserChatsLoading, userChats } = useContext(ChatContext);
    const {updateCurrentChat} = useContext(ChatContext)
    const {activeSection,setActiveSection} = useContext(PurposeContext)
    

    return (
        <div className="w-screen bg-blue-300 h-screen">
            <NavBar />
            <Container className="bg-blue-300 w-full p-0 m-0">
                <div className="flex w-screen">
                    {/* Sidebar */}
                    <Sidebar 
                        setActiveSection={setActiveSection} 
                        activeSection={activeSection} 
                        className="basis-[4%]" 
                    />

                    {/* Conditionally render content based on active section */}
                    {activeSection === "video" ? (
                        // For "video" session, render only two divs (sidebar and active session)
                        <div className="center-div basis-[96%]">
                            <Video />
                        </div>
                    ) : (
                        // For all other sessions, render three divs (sidebar, center, and right div)
                        <>
                            <div className="center-div basis-[76%]">
                                {activeSection === "chat" && (
                                    <>
                                        {userChats?.length < 1 ? (
                                            <ChatBox />
                                        ) : (
                                            <>
                                                <ChatBox />
                                                {/* Uncomment if you want PotentialChats here */}
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
                                {activeSection === "video" && <HomePage />}
                                {/* Add more sections as needed */}
                            </div>

                            {/* Right div only for non-video sessions */}
                            <div 
                            className={isRightBarOpen?"hidden sm:block  right-div basis-[20%] border-l-2 border-black":
                                "   right-div basis-[20%] border-l-2 border-black"
                             }>
                                {activeSection === "chat" && (
                                    <>
                                        <div className="flex flex-col gap-2 ">
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
                        </>
                    )}
                </div>
            </Container>
        </div>
    );
}

export default Chat;
