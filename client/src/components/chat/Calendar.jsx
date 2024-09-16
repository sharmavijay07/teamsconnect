// src/Calendar.jsx
import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; // Import default styles

const CalendarComponent = () => {
  const [date, setDate] = useState(new Date());

  const handleDateChange = newDate => {
    setDate(newDate);
  };

  return (
    <div className="calendar-container">
      <h1>My Calendar</h1>
      <Calendar
        onChange={handleDateChange}
        value={date}
      />
      <p>Selected Date: {date.toDateString()}</p>
    </div>
  );
};

export default CalendarComponent;
