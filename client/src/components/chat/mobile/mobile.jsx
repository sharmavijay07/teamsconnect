import Chat from "@/pages/Chat";
import React from "react";
const { default: ChatBox } = require("../ChatBox");

const checkScreenSize = () => {
    if (window.innerWidth < 768) {
      // Apply styles or changes for mobile devices
      document.body.style.backgroundColor = "lightgreen";
      document.body.style.fontSize = "16px";
    } else {
    //   Apply styles for larger screens
      document.body.style.backgroundColor = "lightblue";
      document.body.style.fontSize = "20px";
    }
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return(
        <div>
        {/* <Chat/> */}
        {/* <ChatBox/> */}
        </div>
    )
  }
  
export default checkScreenSize
  // Check on page load
 
  