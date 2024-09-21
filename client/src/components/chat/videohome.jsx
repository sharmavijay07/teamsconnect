import React, { useEffect, useState } from 'react';
import $ from 'jquery';

const Videohome = () => {
  const [meetingId, setMeetingId] = useState('hello');
  const [userId, setUserId] = useState('hello');
  const [isMeetingVisible, setIsMeetingVisible] = useState(false);
  const [recordedBlobs, setRecordedBlobs] = useState([898]);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [recording, setRecording] = useState(false);
  const [messages, setMessages] = useState(["ldhfld"]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const meetingID = urlParams.get('meetingID');
    const uid = urlParams.get('uid') || prompt('Enter your nick!');

    if (!uid || !meetingID) {
      alert('User ID or meeting ID missing');
      window.location.href = '/sign';
      return;
    }

    setMeetingId(meetingID);
    setUserId(uid);
    setIsMeetingVisible(true);
    $(".username_holder").val(uid);
    // Initialize your app here
  }, []);

  const handleRecording = () => {
    if (recording) {
      mediaRecorder.stop();
      setRecording(false);
    } else {
      startRecording();
    }
  };

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    const options = { mimeType: 'video/webm; codecs=vp9,opus' };
    const newMediaRecorder = new MediaRecorder(stream, options);

    newMediaRecorder.ondataavailable = (event) => {
      if (event.data && event.data.size > 0) {
        setRecordedBlobs((prev) => [...prev, event.data]);
      }
    };

    newMediaRecorder.onstop = () => {
      console.log('Recorder stopped:', recordedBlobs);
    };

    newMediaRecorder.start();
    setMediaRecorder(newMediaRecorder);
    setRecording(true);
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
    }
  };

  const downloadVideo = () => {
    const blob = new Blob(recordedBlobs, { type: 'video/webm' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = 'test.webm';
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 100);
  };

  return (
    <main className="container-fluid flex flex-col bg-blue-200">
      {isMeetingVisible ? (
        <div className="flex">
          <div className="flex-1">
            <h1 id="meetingname">{meetingId}</h1>
            <div className="call-wrap bg-blue-300">
              <div id="divUsers" className="flex flex-wrap">
                <div id="me" className="userbox">
                  <h2 className="text-center text-sm"></h2>
                  <video className="video_box" autoPlay muted />
                </div>
              </div>
            </div>
          </div>
          <div className="flex-none w-1/4 bg-gray-200">
            <div className="flex justify-between items-center p-3">
              <h2 className="font-bold">Meeting Details</h2>
              <span className="cursor-pointer material-icons">clear</span>
            </div>
            <div className="border-b p-3 flex justify-between items-center">
              <span className="flex items-center">
                <span className="material-icons">people</span>
                Participant (<span className="participant-count">1</span>)
              </span>
              <span className="flex items-center cursor-pointer">
                <span className="material-icons">message</span> Chat
              </span>
            </div>
            <div className="p-3">
              <div className="chat-message-sent flex justify-between">
                <input type="text" className="border-b w-3/4" placeholder="Send a message" />
                <span className="material-icons cursor-pointer" id="btnsend">send</span>
              </div>
              <div id="messages" className="chat-message-show text-gray-700"></div>
            </div>
          </div>
        </div>
      ) : (
        <div id="meetingbox">
          <p>
            You may start a new meeting. Here is a generated link: <a id='meetingid' href="#"></a>
          </p>
        </div>
      )}
      <div className="flex justify-between items-center bg-gray-300 p-3">
        <button onClick={handleRecording} className="bg-red-500 text-white p-2">
          {recording ? 'Stop Recording' : 'Start Recording'}
        </button>
        <button onClick={downloadVideo} className="bg-green-500 text-white p-2">
          Download Video
        </button>
      </div>
    </main>
  );
};

export default Videohome;
