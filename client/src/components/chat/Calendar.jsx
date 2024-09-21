// import React, { useState, useEffect } from 'react';
// import Calendar from 'react-calendar';
// import 'react-calendar/dist/Calendar.css';
// // import '../../styles.css';
// import Modal from 'react-modal';
// import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
// import { gapi } from 'gapi-script';
// // import 'material-icons/iconfont/material-icons.css';


// Modal.setAppElement('#root');

// const CalendarComponent = () => {
//   const [date, setDate] = useState(new Date());
//   const [events, setEvents] = useState({});
//   const [eventInput, setEventInput] = useState('');
//   const [eventDescription, setEventDescription] = useState('');
//   const [eventStartTime, setEventStartTime] = useState('');
//   const [eventEndTime, setEventEndTime] = useState('');
//   const [isRecurring, setIsRecurring] = useState(false);
//   const [isOpen, setIsOpen] = useState(false);
//   const [currentEvent, setCurrentEvent] = useState(null);

//   useEffect(() => {
//     // Initialize Google API client
//     const initClient = () => {
//       gapi.load('client:auth2', () => {
//         gapi.client.init({
//           clientId: 'YOUR_CLIENT_ID', // Replace with your client ID
//           scope: 'https://www.googleapis.com/auth/calendar',
//         });
//       });
//     };

//     initClient();
//   }, []);

//   const handleDateChange = newDate => {
//     setDate(newDate);
//   };

//   const handleOpenModal = (event) => {
//     setCurrentEvent(event);
//     setEventInput(event ? event.input : '');
//     setEventDescription(event ? event.description : '');
//     setEventStartTime(event ? event.startTime : '');
//     setEventEndTime(event ? event.endTime : '');
//     setIsRecurring(event ? event.isRecurring : false);
//     setIsOpen(true);
//   };

//   const handleCloseModal = () => {
//     setIsOpen(false);
//     setCurrentEvent(null);
//     setEventInput('');
//     setEventDescription('');
//     setEventStartTime('');
//     setEventEndTime('');
//     setIsRecurring(false);
//   };

//   const handleAddEvent = () => {
//     const dateString = date.toDateString();
//     if (eventInput.trim() !== '' && eventStartTime && eventEndTime) {
//       const newEvent = {
//         input: eventInput,
//         description: eventDescription,
//         startTime: eventStartTime,
//         endTime: eventEndTime,
//         id: Date.now(),
//         isRecurring,
//       };

//       setEvents(prevEvents => {
//         const updatedEvents = {
//           ...prevEvents,
//           [dateString]: [...(prevEvents[dateString] || []), newEvent],
//         };

//         if (isRecurring) {
//           for (let i = 1; i <= 5; i++) {
//             const nextDate = new Date(date);
//             nextDate.setDate(date.getDate() + i);
//             const nextDateString = nextDate.toDateString();
//             updatedEvents[nextDateString] = [
//               ...(updatedEvents[nextDateString] || []),
//               newEvent,
//             ];
//           }
//         }

//         return updatedEvents;
//       });
//       handleCloseModal();
//     } else {
//       alert("Please fill in all fields.");
//     }
//   };

//   const handleEditEvent = () => {
//     const dateString = date.toDateString();
//     const updatedEvents = events[dateString].map(event =>
//       event.id === currentEvent.id ? {
//         ...event,
//         input: eventInput,
//         description: eventDescription,
//         startTime: eventStartTime,
//         endTime: eventEndTime,
//         isRecurring,
//       } : event
//     );

//     setEvents(prevEvents => ({
//       ...prevEvents,
//       [dateString]: updatedEvents,
//     }));
//     handleCloseModal();
//   };

//   const handleDeleteEvent = (eventToDelete) => {
//     const dateString = date.toDateString();
//     const updatedEvents = events[dateString].filter(event => event.id !== eventToDelete.id);
//     setEvents(prevEvents => ({
//       ...prevEvents,
//       [dateString]: updatedEvents,
//     }));
//   };

//   const handleDragEnd = (result) => {
//     if (!result.destination) return;

//     const sourceDateString = date.toDateString();
//     const destinationDateString = result.destination.droppableId;

//     const movedEvent = events[sourceDateString][result.source.index];

//     const updatedSourceEvents = events[sourceDateString].filter((_, index) => index !== result.source.index);

//     setEvents(prevEvents => ({
//       ...prevEvents,
//       [sourceDateString]: updatedSourceEvents,
//       [destinationDateString]: [
//         ...(prevEvents[destinationDateString] || []),
//         movedEvent,
//       ],
//     }));
//   };

//   return (
//     <div className="calendar-container">
//       <h1>My Calendar</h1>
//       <Calendar
//         onChange={handleDateChange}
//         value={date}
//       />
//       <p>Selected Date: {date.toDateString()}</p>

//       <button className="add-event-btn" onClick={() => handleOpenModal(null)}>
//       <span className="material-icons" style={{ verticalAlign: 'middle', marginRight: '5px' }}>add</span>
//       Add Event
//       </button>
      
//       <DragDropContext onDragEnd={handleDragEnd}>
//         <Droppable droppableId={date.toDateString()}>
//           {(provided) => (
//             <div {...provided.droppableProps} ref={provided.innerRef} className="events-list">
//               <h3>Events:</h3>
//               <ul>
//                 {(events[date.toDateString()] || []).map((event, index) => (
//                   <Draggable key={event.id} draggableId={event.id.toString()} index={index}>
//                     {(provided) => (
//                       <li ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} className="event-item">
//                         <h4>{event.input} ({event.startTime} - {event.endTime})</h4>
//                         <p>{event.description}</p>
//                         <button onClick={() => handleOpenModal(event)}>Edit</button>
//                         <button onClick={() => handleDeleteEvent(event)}>Delete</button>
//                       </li>
//                     )}
//                   </Draggable>
//                 ))}
//               </ul>
//               {provided.placeholder}
//             </div>
//           )}
//         </Droppable>
//       </DragDropContext>

//       <Modal isOpen={isOpen} onRequestClose={handleCloseModal} contentLabel="Event Modal">
//         <h2>{currentEvent ? 'Edit Event' : 'Add Event'}</h2>
//         <input
//           type="text"
//           value={eventInput}
//           onChange={e => setEventInput(e.target.value)}
//           placeholder="Event Name"
//           required
//         />
//         <textarea
//           value={eventDescription}
//           onChange={e => setEventDescription(e.target.value)}
//           placeholder="Event Description"
//         />
//         <input
//           type="time"
//           value={eventStartTime}
//           onChange={e => setEventStartTime(e.target.value)}
//         />
//         <input
//           type="time"
//           value={eventEndTime}
//           onChange={e => setEventEndTime(e.target.value)}
//         />
//         <label>
//           <input
//             type="checkbox"
//             checked={isRecurring}
//             onChange={(e) => setIsRecurring(e.target.checked)}
//           />
//           Recurring Event
//         </label>
//         <button onClick={currentEvent ? handleEditEvent : handleAddEvent}>
//           {currentEvent ? 'Update Event' : 'Add Event'}
//         </button>
//         <button onClick={handleCloseModal}>Close</button>
//       </Modal>
//     </div>
//   );
// };

// export default CalendarComponent;


import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import Modal from 'react-modal';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { gapi } from 'gapi-script';
import 'material-icons/iconfont/material-icons.css';

Modal.setAppElement('#root');

const CalendarComponent = () => {
  const [date, setDate] = useState(new Date());
  const [events, setEvents] = useState({});
  const [eventInput, setEventInput] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [eventStartTime, setEventStartTime] = useState('');
  const [eventEndTime, setEventEndTime] = useState('');
  const [eventParticipants, setEventParticipants] = useState('');
  const [eventLink, setEventLink] = useState('');
  const [eventRecurrence, setEventRecurrence] = useState('none'); // none, daily, weekly, monthly
  const [isOpen, setIsOpen] = useState(false);
  const [currentEvent, setCurrentEvent] = useState(null);

  useEffect(() => {
    const initClient = () => {
      gapi.load('client:auth2', () => {
        gapi.client.init({
          clientId: 'YOUR_CLIENT_ID',
          scope: 'https://www.googleapis.com/auth/calendar',
        });
      });
    };
    initClient();
  }, []);

  const handleDateChange = (newDate) => setDate(newDate);

  const handleOpenModal = (event) => {
    setCurrentEvent(event);
    setEventInput(event ? event.input : '');
    setEventDescription(event ? event.description : '');
    setEventStartTime(event ? event.startTime : '');
    setEventEndTime(event ? event.endTime : '');
    setEventParticipants(event ? event.participants.join(', ') : '');
    setEventLink(event ? event.link : '');
    setEventRecurrence(event ? event.recurrence : 'none');
    setIsOpen(true);
  };

  const handleCloseModal = () => {
    setIsOpen(false);
    setCurrentEvent(null);
    setEventInput('');
    setEventDescription('');
    setEventStartTime('');
    setEventEndTime('');
    setEventParticipants('');
    setEventLink('');
    setEventRecurrence('none');
  };

  const handleAddEvent = () => {
    const dateString = date.toDateString();
    if (eventInput.trim() !== '' && eventStartTime && eventEndTime) {
      const participantsArray = eventParticipants.split(',').map(participant => participant.trim());
      const newEvent = {
        input: eventInput,
        description: eventDescription,
        startTime: eventStartTime,
        endTime: eventEndTime,
        participants: participantsArray,
        link: eventLink,
        id: Date.now(),
        recurrence: eventRecurrence,
      };

      setEvents((prevEvents) => {
        const updatedEvents = {
          ...prevEvents,
          [dateString]: [...(prevEvents[dateString] || []), newEvent],
        };

        // Handle recurrence
        let recurrenceDays = 0;
        switch (eventRecurrence) {
          case 'daily':
            recurrenceDays = 1;
            break;
          case 'weekly':
            recurrenceDays = 7;
            break;
          case 'monthly':
            recurrenceDays = 30; // Approximation for simplicity
            break;
          default:
            recurrenceDays = 0;
            break;
        }

        for (let i = 1; i <= 5; i++) {
          if (recurrenceDays > 0) {
            const nextDate = new Date(date);
            nextDate.setDate(date.getDate() + i * recurrenceDays);
            const nextDateString = nextDate.toDateString();
            updatedEvents[nextDateString] = [
              ...(updatedEvents[nextDateString] || []),
              newEvent,
            ];
          }
        }

        return updatedEvents;
      });
      handleCloseModal();
    } else {
      alert('Please fill in all fields.');
    }
  };

  const handleEditEvent = () => {
    const dateString = date.toDateString();
    const updatedEvents = events[dateString].map((event) =>
      event.id === currentEvent.id
        ? {
            ...event,
            input: eventInput,
            description: eventDescription,
            startTime: eventStartTime,
            endTime: eventEndTime,
            participants: eventParticipants.split(',').map(participant => participant.trim()),
            link: eventLink,
            isRecurring,
          }
        : event
    );

    setEvents((prevEvents) => ({
      ...prevEvents,
      [dateString]: updatedEvents,
    }));
    handleCloseModal();
  };

  const handleDeleteEvent = (eventToDelete) => {
    const dateString = date.toDateString();
    const updatedEvents = events[dateString].filter(
      (event) => event.id !== eventToDelete.id
    );
    setEvents((prevEvents) => ({
      ...prevEvents,
      [dateString]: updatedEvents,
    }));
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const sourceDateString = date.toDateString();
    const destinationDateString = result.destination.droppableId;

    const movedEvent = events[sourceDateString][result.source.index];
    const updatedSourceEvents = events[sourceDateString].filter(
      (_, index) => index !== result.source.index
    );

    setEvents((prevEvents) => ({
      ...prevEvents,
      [sourceDateString]: updatedSourceEvents,
      [destinationDateString]: [
        ...(prevEvents[destinationDateString] || []),
        movedEvent,
      ],
    }));
  };

  const handleJoinMeeting = (link) => {
    window.open(link, '_blank');
  };

  return (
    <div className="calendar-container">
      <h1>My Calendar</h1>
      <Calendar onChange={handleDateChange} value={date} />
      <p>Selected Date: {date.toDateString()}</p>

      <button className="add-event-btn" onClick={() => handleOpenModal(null)}>
      <span className="material-icons" style={{ verticalAlign: 'middle', marginRight: '5px' }}>add</span>
      Add Event
      </button>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId={date.toDateString()}>
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef} className="events-list">
              <h3>Events:</h3>
              <ul>
                {(events[date.toDateString()] || []).map((event, index) => (
                  <Draggable
                    key={event.id}
                    draggableId={event.id.toString()}
                    index={index}
                  >
                    {(provided) => (
                      <li
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="event-item"
                      >
                        <h4>
                          {event.input} ({event.startTime} - {event.endTime}) 
                          {event.recurrence !== 'none' && <span>🔁</span>}
                        </h4>
                        <p>{event.description}</p>
                        <button onClick={() => handleOpenModal(event)}>Edit</button>
                        <button onClick={() => handleDeleteEvent(event)}>Delete</button>
                      </li>
                    )}
                  </Draggable>
                ))}
              </ul>
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      <Modal isOpen={isOpen} onRequestClose={handleCloseModal}>
        <h2>{currentEvent ? 'Edit Meeting' : 'Schedule Meeting'}</h2>
        <div className="modal-inputs">
          <input
            type="text"
            value={eventInput}
            onChange={(e) => setEventInput(e.target.value)}
            placeholder="Meeting Title"
          />
          <textarea
            value={eventDescription}
            onChange={(e) => setEventDescription(e.target.value)}
            placeholder="Meeting Description"
          />
          <input
            type="time"
            value={eventStartTime}
            onChange={(e) => setEventStartTime(e.target.value)}
          />
          <input
            type="time"
            value={eventEndTime}
            onChange={(e) => setEventEndTime(e.target.value)}
          />
          <input
            type="text"
            value={eventParticipants}
            onChange={(e) => setEventParticipants(e.target.value)}
            placeholder="Participants (comma-separated)"
          />
          <input
            type="text"
            value={eventLink}
            onChange={(e) => setEventLink(e.target.value)}
            placeholder="Meeting Link"
          />
          <label>
            <input
              type="checkbox"
              checked={isRecurring}
              onChange={(e) => setIsRecurring(e.target.checked)}
            />
            Recurring Meeting
          </label>
        </div>
        <div className="modal-actions">
          <button onClick={currentEvent ? handleEditEvent : handleAddEvent}>
            {currentEvent ? 'Update Meeting' : 'Schedule Meeting'}
          </button>
          <button onClick={handleCloseModal}>Close</button>
        </div>
      </Modal>
    </div>
  );
};

export default CalendarComponent;
