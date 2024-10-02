import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import './Homepage.css'

const HomePage = () => {
    const [roomId,setRoomId] = useState()
    const navigate = useNavigate()

    const handleRoomIdGenerate =() => {
        const randomId = Math.random().toString(36).substring(2,9)
        const timestamp = Date.now().toString().substring(-4)
        setRoomId(randomId+timestamp)
    }

    const handleOneAndOneCall = () => {
        if(!roomId) {
            alert('Please generate roomId')
            return;
        }
        navigate(`/room/${roomId}?type=one-one`)
    }

    const handleGroupCall = () => {
        if(!roomId) {
            alert('Please generate roomId')
            return;
        }
        navigate(`/room/${roomId}?type=group`)
    }
    return ( 
        <div className="homepage-container">
            <div className="homepage-content">
                <h1 className="homepage-title">Welcome to Video Calling section</h1>
                <p className="homepage-subtitle">
                    Start a video call 
                </p>
                <div className="room-id-container">
                    <input
                     type="text"
                     placeholder="Generated Room Id" 
                     className="room-id-input"
                     value={roomId}
                     readOnly/>
                     <button className="generate-button" onClick={handleRoomIdGenerate}>
                        Generate
                     </button>
                </div>
                <div className="call-buttons">
                        <button className="call-button" disabled={!roomId} onClick={handleOneAndOneCall}>One-to-One Call</button>
                        <button className="call-button" disabled={!roomId} onClick={handleGroupCall}>Group Call</button>
                     </div>
            </div>
        </div>
     );
}
 
export default HomePage;