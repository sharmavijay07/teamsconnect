import PotentialChats from "../PotentialChats";
import UserChat from "../UserChat";

import { useContext, useState, useRef, useEffect } from "react";


const Chatbox0 = ()=>{
    const [currentTime, setCurrentTime] = useState(new Date());

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

    return(
        <>
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
    </>
    )
}
export default Chatbox0;