import React, { useEffect, useState, useRef, useContext } from 'react';
import { useNavigate, useLocation ,useParams} from 'react-router-dom';
import io from 'socket.io-client';
import axios from 'axios';
import { AuthContext } from '@/context/AuthContext';
import { baseUrl } from '@/utils/services';

const Videohome = () => {
    const [localStream, setLocalStream] = useState(null);
    const [peerConnections, setPeerConnections] = useState({});
    const [remoteStreams, setRemoteStreams] = useState({});
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');
    const socketRef = useRef();
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const { meetingId } = useParams();

    useEffect(() => {
        if (!meetingId) {
            alert('User ID or Meeting ID is missing');
            navigate('/sign'); // Redirect if missing
            return;
        }

        // Initialize socket connection
        socketRef.current = io('http://localhost:4500');
        socketRef.current.emit('userconnect', { displayName: user.id, meetingid: meetingId });

        socketRef.current.on('userconnected', (otherUsers) => {
            console.log("Connected users: ", otherUsers);
        });

        socketRef.current.on('showChatMessage', (msg) => {
            setMessages((prev) => [...prev, msg]);
        });

        // Listen for incoming offers
        socketRef.current.on('offer', handleReceiveOffer);
        socketRef.current.on('answer', handleReceiveAnswer);
        socketRef.current.on('candidate', handleReceiveCandidate);

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

        // Add local stream to the video element
        const localVideo = document.getElementById('local-video');
        if (localVideo) {
            localVideo.srcObject = stream;
        }

        // Notify others that you are broadcasting
        socketRef.current.emit('broadcaster', meetingId);

        // Broadcast your local stream to all other participants
        socketRef.current.emit('broadcaster', meetingId);
    };

    const handleReceiveOffer = async (offer, fromId) => {
        const peerConnection = createPeerConnection(fromId);
        await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
        const answer = await peerConnection.createAnswer();
        await peerConnection.setLocalDescription(answer);

        socketRef.current.emit('answer', { meetingId, toId: fromId, answer });
    };

    const handleReceiveAnswer = async (answer, fromId) => {
        const peerConnection = peerConnections[fromId];
        if (peerConnection) {
            await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
        }
    };

    const handleReceiveCandidate = (candidate, fromId) => {
        const peerConnection = peerConnections[fromId];
        if (peerConnection) {
            peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
        }
    };

    const createPeerConnection = (otherUserId) => {
        const peerConnection = new RTCPeerConnection();

        // Add local stream tracks to peer connection
        localStream.getTracks().forEach(track => peerConnection.addTrack(track, localStream));

        // Handle ICE candidates
        peerConnection.onicecandidate = (event) => {
            if (event.candidate) {
                socketRef.current.emit('candidate', { meetingId, toId: otherUserId, candidate: event.candidate });
            }
        };

        // Handle remote stream
        peerConnection.ontrack = (event) => {
            setRemoteStreams((prevStreams) => ({
                ...prevStreams,
                [otherUserId]: event.streams[0],
            }));
        };

        // Save the peer connection
        setPeerConnections((prevConnections) => ({
            ...prevConnections,
            [otherUserId]: peerConnection,
        }));

        return peerConnection;
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
                meetingId, 
                userId: user.id, 
                message 
            })
            .then((resp) => {
                setMessages((prev) => [...prev, msg]);
                setMessage('');
            })
            .catch((err) => {
                console.log("Error:", err);
            });
        }
    };

    return (
        <div className="container">
            <h1>Meeting ID: {meetingId}</h1>
            <button onClick={startVideoConference}>Start Video Conference</button>
            <button onClick={leaveMeeting}>Leave Meeting</button>
            <div className="video-container">
                <video id="local-video" autoPlay muted></video>
                {Object.keys(remoteStreams).map((userId, index) => (
                    <video key={index} autoPlay ref={video =>
                         { if(video)
                            video.srcObject = remoteStreams[userId]; 
                            

                         }} />
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
