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
    const location = useLocation();
    const { meetingId ,uid } = useParams();

    useEffect(() => {
        if (!meetingId) {
            alert('User ID or Meeting ID is missing');
            navigate('/sign');
            return;
        }

        // Initialize socket connection
        socketRef.current = io('http://localhost:4500');
        socketRef.current.emit('userconnect', { displayName: user.id, meetingid: meetingId });

        socketRef.current.on('userconnected', (otherUsers) => {
            otherUsers.forEach(otherUser => createPeerConnection(otherUser.connectionId));
        });

        socketRef.current.on('informAboutNewConnection', ({ connId }) => {
            createPeerConnection(connId);
        });

        socketRef.current.on('receiveOffer', async ({ from_connid, offer }) => {
            const peerConnection = peerConnections[from_connid];
            await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
            const answer = await peerConnection.createAnswer();
            await peerConnection.setLocalDescription(answer);
            socketRef.current.emit('answer', { to_connid: from_connid, answer });
        });

        socketRef.current.on('receiveAnswer', async ({ from_connid, answer }) => {
            const peerConnection = peerConnections[from_connid];
            if (peerConnection) {
                await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
            }
        });

        socketRef.current.on('receiveCandidate', ({ from_connid, candidate }) => {
            const peerConnection = peerConnections[from_connid];
            if (peerConnection) {
                peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
            }
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

        // Add local stream to the video element
        document.getElementById('local-video').srcObject = stream;
        
        // Notify others that you are broadcasting
        socketRef.current.emit('broadcaster', meetingId);
    };

    const createPeerConnection = (otherUserId) => {
        const peerConnection = new RTCPeerConnection();

        // Add local stream tracks to peer connection
        localStream.getTracks().forEach(track => peerConnection.addTrack(track, localStream));

        // Handle ICE candidates
        peerConnection.onicecandidate = (event) => {
            if (event.candidate) {
                socketRef.current.emit('candidate', { meetingId, to_connid: otherUserId, candidate: event.candidate });
            }
        };

        // Handle remote stream
        peerConnection.ontrack = (event) => {
            setRemoteStreams(prevStreams => ({
                ...prevStreams,
                [otherUserId]: event.streams[0]
            }));
        };

        // Create offer
        peerConnection.createOffer().then(offer => {
            peerConnection.setLocalDescription(offer);
            socketRef.current.emit('offer', { meetingId, to_connid: otherUserId, offer });
        });

        setPeerConnections(prevConnections => ({
            ...prevConnections,
            [otherUserId]: peerConnection
        }));
    };

    return (
        <div>
            <div>
                <video id="local-video" autoPlay muted></video>
                {Object.keys(remoteStreams).map((userId) => (
                    <video key={userId} id={`remote-video-${userId}`} srcObject={remoteStreams[userId]} autoPlay></video>
                ))}
            </div>
            <button onClick={startVideoConference}>Start Video Conference</button>
        </div>
    );
};

export default Videohome;
