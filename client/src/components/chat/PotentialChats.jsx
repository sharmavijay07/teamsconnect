import { useContext, useState, useEffect, useRef } from "react";
import { ChatContext } from "@/context/ChatContext";
import { AuthContext } from "@/context/AuthContext";

const PotentialChats = () => {
    const { user } = useContext(AuthContext);
    const { potentialChats, createChat, onlineUsers } = useContext(ChatContext);
    const [searchTerm, setSearchTerm] = useState("");
    const searchContainerRef = useRef(null);

    const filteredChats = potentialChats?.filter((chat) =>
        chat.name?.toLowerCase().includes(searchTerm?.toLowerCase())
    );

    const handleClickOutside = (event) => {
        // Check if the clicked element is outside the search container
        if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
            setSearchTerm(""); // Clear the search term to hide the search results
        }
    };

    useEffect(() => {
        // Add event listener for clicks outside
        document.addEventListener("mousedown", handleClickOutside);
        
        // Cleanup event listener on component unmount
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div ref={searchContainerRef} className="relative  max-w-sm mx-auto ">
            <div className="flex items-center relative ">
                <input
                    type="text"
                    placeholder="Search your friends"
                    className="w-full m-2 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button 
                    onClick={() => setSearchTerm(searchTerm)}
                    className="absolute right-3 top-3"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        fill="currentColor"
                        className="bi bi-search text-gray-500 relative top-2 right-2"
                        viewBox="0 0 16 16"
                    >
                        <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"/>
                    </svg>
                </button>
            </div>

            {/* Render filtered chats below the input */}
            {searchTerm && filteredChats && (
                <div className="absolute z-10 w-full rounded-md  mt-1 max-h-60 overflow-y-auto h-medium">
                    {filteredChats.map((u, index) => (
                        <div
                            className="single-user cursor-pointer px-4 py-2 hover:bg-purple-500 hover:text-black hover:font-bold  flex justify-between items-center mb-2 mt-2"
                            key={index}
                            onClick={() => createChat(user.id, u.id)}
                        >
                            <span>{u.name}</span>
                            <span
                                className={
                                    onlineUsers?.some((user) => user?.userId === u?.id)
                                        ? "user-online ml-2 inline-block h-2 w-2 bg-green-500 rounded-full"
                                        : ""
                                }
                            ></span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default PotentialChats;
