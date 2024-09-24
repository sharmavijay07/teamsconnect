// Sign.js
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { baseUrl } from '@/utils/services';
import { AuthContext } from '@/context/AuthContext';

const Sign = () => {
    // const [searchParams] = useSearchParams();
    const [userId, setUserId] = useState('');
    const {meetingId,setMeetingId} = useContext(AuthContext)
    const {createMeetingId} = useContext(AuthContext)

    const navigate = useNavigate();

   
 
 
    const handleHostMeeting = async () => {
        const eightDigitNumber = createMeetingId()

        await axios.post(`${baseUrl}/video/create`, {
            meetingId: eightDigitNumber,
            userId: userId,
        });

        navigate(`/videohome/${eightDigitNumber}/${userId}`);
    };

    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem('User'));
        setUserId(userData.name)

        if (userData) {
            setUserId(userData.name);
        }

        if (!userId) {
            alert('User ID is missing');
        }
    }, [userId]);

    const handleJoinMeeting = async (event) => {
      event.preventDefault();
      if (meetingId) {
          await axios.post(`${baseUrl}/video/join`, { meetingId })
          .then((resp) => {
              navigate(`/videohome/${meetingId}/${userId}`);
          })
          .catch((err) => {
              console.error("you got error:", err);
          });
      }
  };
  

    return (
        <div className="main-wrap">
            <div className="call-wrap card" style={{ zIndex: 99, backgroundColor: '#60a5fa' }}>
                <div className="action-wrap" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '30px', backgroundColor: '#60a5fa' }}>
                    <div className="host-meeting" onClick={handleHostMeeting} style={{ backgroundColor: '#bfdbfe', cursor: 'pointer' }}>
                        Host Meeting
                    </div>
                    <form onSubmit={handleJoinMeeting}>
                        <input
                            type="text"
                            value={meetingId}
                            onChange={(e) => setMeetingId(e.target.value)}
                            placeholder="Meeting ID"
                            required
                        />
                        <button type="submit">Join Meeting</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Sign;
