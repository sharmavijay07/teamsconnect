import React, { useState, useRef } from 'react';
import { useIdleTimer } from 'react-idle-timer';

function IdleTracker() {
  const [isIdle, setIsIdle] = useState(false); // Idle status state
  const [status, setStatus] = useState('Active'); // User status state
  const idleTimerRef = useRef(null);

  // Function to handle when the user goes idle
  const handleOnIdle = () => {
    setIsIdle(true);
    setStatus('Away');
    console.log('User is idle');
  };

  // Function to handle when the user becomes active again
  const handleOnActive = () => {
    setIsIdle(false);
    setStatus('Active');
    console.log('User is active');
  };

  // Set up the idle timer with a 5-minute timeout (300000 ms)
  useIdleTimer({
    ref: idleTimerRef,
    timeout: 5000, // 5 minutes
    onIdle: handleOnIdle,
    onActive: handleOnActive,
    debounce: 500 // Debounce to avoid too many event triggers
  });

  return (
    <div className='absolute'>
      {isIdle ? <p>🔴</p> : <p>🟢</p>}
    </div>
  );
}

export default IdleTracker;
