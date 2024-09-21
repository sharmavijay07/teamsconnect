import React, { useRef, useState, useEffect } from 'react';
import { io } from 'socket.io-client';

const socket = io('http://localhost:4500'); // Your signaling server URL

const AudioCall = () => {
  const localStreamRef = useRef(null);
  const remoteStreamRef = useRef(null);
  const [isCallStarted, setIsCallStarted] = useState(false);
  const peerConnection = useRef(null);
  const [callerId, setCallerId] = useState(null);

  useEffect(() => {
    // Get access to local audio stream
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then((stream) => {
        localStreamRef.current.srcObject = stream;
        localStreamRef.current.play();
      });

    // Listen for incoming call offer
    socket.on('callMade', async ({ from, offer }) => {
      setCallerId(from);
      const answer = await handleCall(offer);
      socket.emit('answerCall', { to: from, answer });
    });

    // Listen for call answer
    socket.on('callAnswered', async ({ from, answer }) => {
      if (peerConnection.current) {
        await peerConnection.current.setRemoteDescription(new RTCSessionDescription(answer));
      }
    });

    // Handle ICE candidates
    socket.on('iceCandidate', ({ from, candidate }) => {
      if (peerConnection.current) {
        peerConnection.current.addIceCandidate(new RTCIceCandidate(candidate));
      }
    });

    return () => {
      socket.off('callMade');
      socket.off('callAnswered');
      socket.off('iceCandidate');
    };
  }, []);

  const handleCall = async (offer) => {
    peerConnection.current = new RTCPeerConnection({
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' }, // STUN server to get external IP addresses
      ],
    });

    peerConnection.current.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit('iceCandidate', { to: callerId, candidate: event.candidate });
      }
    };

    peerConnection.current.ontrack = (event) => {
      remoteStreamRef.current.srcObject = event.streams[0];
      remoteStreamRef.current.play();
    };

    const localStream = localStreamRef.current.srcObject;
    localStream.getTracks().forEach((track) => {
      peerConnection.current.addTrack(track, localStream);
    });

    await peerConnection.current.setRemoteDescription(new RTCSessionDescription(offer));
    const answer = await peerConnection.current.createAnswer();
    await peerConnection.current.setLocalDescription(new RTCSessionDescription(answer));

    return answer;
  };

  const startCall = async (to) => {
    peerConnection.current = new RTCPeerConnection({
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
      ],
    });

    peerConnection.current.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit('iceCandidate', { to, candidate: event.candidate });
      }
    };

    peerConnection.current.ontrack = (event) => {
      remoteStreamRef.current.srcObject = event.streams[0];
      remoteStreamRef.current.play();
    };

    const localStream = localStreamRef.current.srcObject;
    localStream.getTracks().forEach((track) => {
      peerConnection.current.addTrack(track, localStream);
    });

    const offer = await peerConnection.current.createOffer();
    await peerConnection.current.setLocalDescription(new RTCSessionDescription(offer));

    socket.emit('callUser', { to, offer });
    setIsCallStarted(true);
  };

  return (
    <div>
      <h1>Audio Call Feature</h1>
      <div>
        <audio ref={localStreamRef} autoPlay muted />
        <audio ref={remoteStreamRef} autoPlay />
      </div>
      <button onClick={() => startCall('another-socket-id')}>
        Start Call
      </button>
      {isCallStarted && <p>Call in progress...</p>}
    </div>
  );
};

export default AudioCall;
