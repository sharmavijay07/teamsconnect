// Videohome.js
import React, { useEffect, useState, useRef, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import io from 'socket.io-client';
import axios from 'axios';
import { AuthContext } from '@/context/AuthContext';
import { baseUrl } from '@/utils/services';

const Videohome = () => {
    const [localStream, setLocalStream] = useState(null);
    const [remoteStreams, setRemoteStreams] = useState([]);
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');
    const socketRef = useRef();
    let { meetingId } = useContext(AuthContext);
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (!meetingId || !user.id) {
            alert('User ID or Meeting ID is missing');
            navigate('/sign'); // Redirect if missing
            return;
        }

        socketRef.current = io('http://localhost:4500');
        socketRef.current.emit('userconnect', { displayName: user.id, meetingid: meetingId });

        socketRef.current.on('userconnected', (otherUsers) => {
            // Handle connected users
        });

        socketRef.current.on('showChatMessage', (msg) => {
            setMessages((prev) => [...prev, msg]);
        });

        return () => {
            socketRef.current.disconnect();
            if (localStream) {
                localStream.getTracks().forEach(track => track.stop());
            }
        };
    }, [navigate, localStream, meetingId, user?.id]);

    const startVideoConference = async () => {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        setLocalStream(stream);

        socketRef.current.emit('broadcaster', meetingId);

        socketRef.current.on('watcher', async (watcherId) => {
            const peerConnection = new RTCPeerConnection();
            localStream.getTracks().forEach(track => peerConnection.addTrack(track, localStream));

            peerConnection.onicecandidate = (event) => {
                if (event.candidate) {
                    socketRef.current.emit('candidate', meetingId, watcherId, event.candidate);
                }
            };

            peerConnection.ontrack = (event) => {
                setRemoteStreams((prev) => [...prev, event.streams[0]]);
            };

            const offer = await peerConnection.createOffer();
            await peerConnection.setLocalDescription(offer);
            socketRef.current.emit('offer', meetingId, watcherId, offer);
        });

        socketRef.current.on('answer', async (answer, watcherId) => {
            const peerConnection = new RTCPeerConnection();
            peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
            remoteStreams.forEach((stream) => {
                stream.getTracks().forEach(track => peerConnection.addTrack(track, stream));
            });
        });
    };

    const leaveMeeting = () => {
        socketRef.current.emit('reset', { meetingid: meetingId });
        navigate('/sign'); // Redirect to the sign page
    };

    const handleSendMessage = async () => {
        if (message.trim()) {
            const msg = { from: user.id, text: message };
            socketRef.current.emit('sendMessageMeeting', msg);
            await axios.post(`${baseUrl}/video/sendMessage`, { 
                meetingId: meetingId, 
                userId: user.id, 
                message: message 
            })
            .then((resp) => {
                setMessages((prev) => [...prev, msg]);
                setMessage('');
            })
            .catch((err) => {
                console.log("you got error",err)
            })
           
        }
    };

    return (
        <div className="container">
            <h1>Meeting ID: {meetingId}</h1>
            <button onClick={startVideoConference}>Start Video Conference</button>
            <button onClick={leaveMeeting}>Leave Meeting</button>
            <div className="video-container">
                <video autoPlay muted ref={video => { if (video) video.srcObject = localStream; }} />
                {remoteStreams.map((stream, index) => (
                    <video key={index} autoPlay ref={video => { if (video) video.srcObject = stream; }} />
                ))}
            </div>
            <div className="message-box">
                <div className="messages">
                    {messages.map((msg, index) => (
                        <div key={index}>
                            <strong>{msg.from}: </strong><span>{msg.text}</span>
                        </div>
                    ))}
                </div>
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type a message"
                />
                <button onClick={handleSendMessage}>Send</button>
            </div>
        </div>
    );
};

export default Videohome;
