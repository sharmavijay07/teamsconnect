import { AuthContext } from "@/context/AuthContext";
import { useContext, useState, useRef, useEffect } from "react";
import { NavLink } from "react-router-dom";

const Chatbox1 = ()=>{
    const [currentTime, setCurrentTime] = useState(new Date());
    const {setRightBarOpen,isRightBarOpen} = useContext(AuthContext)

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

<div className="sm:h-[95vh] h-[95vh] w-[100%] m-0  flex sm:m-auto sm:overflow-auto overflow-hidden m-0 p-0 ">
{/* <div className="bg-blue-300 basis-[6%]"><SideBar/></div> */}
<div className="bg-blue-100 basis-[100%] sm:w-auto w-screen sm:h-auto h-[100%] flex flex-col justify-between sm:pb-5">
    {/* <div className="sm:hidden h-[30vh] flex">
        <CalenderToday/>
    </div> */}
    <div className="mt-10 ml-20 mb-15">
        <ul className="text-black sm:text-left ">
            <li className=" sm:text-5xl text-4xl ">Welcome to TeamsConnect</li>
            <li className="text-5xl">{formattedHours}:{formattedMinutes} {ampm}</li>
            <li className="">{dayName}, {monthName} {date}<sup>{getOrdinalSuffix(date)}</sup>, {year}</li>
        </ul>
    </div>
    <div className="flex justify-center sm:m-auto m-5  sm:h-72 h-[30vh] sm:w-[32rem] mx-auto ">
        <img className=" w-[12rem] sm:w-[32rem] w-fit " src="src/assets/home.png" alt="image"/>
    </div>
    <div className="flex sm:flex-row sm:p-2 sm:justify-around w-full sm:m-auto mb-3 sm:bottom-auto bottom-0 sm:flex hidden">
        <div className="bg-blue-300 sm:h-[10vh] sm:w-[30vh] text-black p-2 shadow-xl shadow-blue-400/40 sm:rounded sm:border-1 border-blue-400 sm:text-auto text-wrap"> Search for people in your organization</div>
        <div className="bg-blue-300   sm:h-[10vh] sm:w-[30vh] text-black p-2 shadow-xl shadow-blue-400/40 sm:rounded sm:border-1 border-blue-400">Join Channel</div>
        <div className="bg-blue-300   sm:h-[10vh] sm:w-[30vh] text-black p-2 shadow-xl shadow-blue-400/40 sm:rounded sm:border-1 border-blue-400"> Try video conferencing </div>
    </div>

    {/* mobile section */}
    <div className="sm:hidden bg-gray-900 text-white h-[10vh]  flex justify-around items-center">
        
                
                <button className="flex flex-col items-center" onClick={()=>setActiveSection('calender')}>
                    
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 2.994v2.25m10.5-2.25v2.25m-14.252 13.5V7.491a2.25 2.25 0 0 1 2.25-2.25h13.5a2.25 2.25 0 0 1 2.25 2.25v11.251m-18 0a2.25 2.25 0 0 0 2.25 2.25h13.5a2.25 2.25 0 0 0 2.25-2.25m-18 0v-7.5a2.25 2.25 0 0 1 2.25-2.25h13.5a2.25 2.25 0 0 1 2.25 2.25v7.5m-6.75-6h2.25m-9 2.25h4.5m.002-2.25h.005v.006H12v-.006Zm-.001 4.5h.006v.006h-.006v-.005Zm-2.25.001h.005v.006H9.75v-.006Zm-2.25 0h.005v.005h-.006v-.005Zm6.75-2.247h.005v.005h-.005v-.005Zm0 2.247h.006v.006h-.006v-.006Zm2.25-2.248h.006V15H16.5v-.005Z" />
                    </svg>
                    Schedule
                    
            </button>
        
        
            <button className="flex flex-col items-center"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z" />
                    </svg>
                    Meet
            </button>
        
        
            <button className="flex flex-col items-center"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6"
            onClick={setRightBarOpen(!isRightBarOpen)}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z" />
                    </svg>
                    Start Chat
            </button>
        
    </div>
</div>
</div>
)
}

export default Chatbox1;