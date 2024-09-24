// Sign.js
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { baseUrl } from '@/utils/services';
import { AuthContext } from '@/context/AuthContext';

const Sign = () => {
    const [searchParams] = useSearchParams();
    const [userId, setUserId] = useState('');
    let {meetingId,setMeetingId} = useContext(AuthContext)
    let {createMeetingId} = useContext(AuthContext)

    const navigate = useNavigate();

    useEffect(() => {
        const uid = searchParams.get('uid');
        const userData = JSON.parse(localStorage.getItem('User'));

        if (userData) {
            setUserId(userData.name);
        }

        if (!userId) {
            alert('User ID is missing');
        }
    }, [searchParams, userId]);
 
 
    const handleHostMeeting = async () => {
        const eightDigitNumber = createMeetingId()

        await axios.post(`${baseUrl}/video/create`, {
            meetingId: eightDigitNumber,
            userId: userId,
        });

        navigate(`/videohome?meetingID=${eightDigitNumber}&uid=${userId}`);
    };

    const handleJoinMeeting = async (event) => {
      event.preventDefault();
      if (meetingId) {
          await axios.post(`${baseUrl}/video/join`, { meetingId })
          .then((resp) => {
              navigate(`/videohome?meetingID=${meetingId}&uid=${userId}`);
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
