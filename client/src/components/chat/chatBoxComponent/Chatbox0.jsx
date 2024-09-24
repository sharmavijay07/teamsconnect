const Chatbox0 = ()=>{
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