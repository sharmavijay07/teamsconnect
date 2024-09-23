import { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import Modal from 'react-modal';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { gapi } from 'gapi-script';
import 'material-icons/iconfont/material-icons.css';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
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
  const [eventRecurrence, setEventRecurrence] = useState('none');
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
    resetForm();
  };

  const resetForm = () => {
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
      const newEvent = {
        input: eventInput,
        description: eventDescription,
        startTime: eventStartTime,
        endTime: eventEndTime,
        participants: eventParticipants.split(',').map(participant => participant.trim()),
        link: eventLink,
        id: Date.now(),
        recurrence: eventRecurrence,
      };

      if (!isConflict(dateString, newEvent)) {
        setEvents((prevEvents) => addNewEvent(prevEvents, dateString, newEvent));
        handleCloseModal();
      } else {
        alert('Event time conflict! Please choose a different time.');
      }
    } else {
      alert('Please fill in all fields.');
    }
  };

  const isConflict = (dateString, newEvent) => {
    const existingEvents = events[dateString] || [];
    return existingEvents.some(event =>
      (newEvent.startTime < event.endTime && newEvent.endTime > event.startTime)
    );
  };

  const addNewEvent = (prevEvents, dateString, newEvent) => {
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
        recurrenceDays = 30;
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
  };

  const handleEditEvent = () => {
    const dateString = date.toDateString();
    const updatedEvents = events[dateString].map((event) =>
      event.id === currentEvent.id
        ? { ...event, input: eventInput, description: eventDescription, startTime: eventStartTime, endTime: eventEndTime, participants: eventParticipants.split(',').map(participant => participant.trim()), link: eventLink, recurrence: eventRecurrence }
        : event
    );

    setEvents((prevEvents) => ({ ...prevEvents, [dateString]: updatedEvents }));
    handleCloseModal();
  };

  const handleDeleteEvent = (eventToDelete) => {
    const dateString = date.toDateString();
    const updatedEvents = events[dateString].filter((event) => event.id !== eventToDelete.id);
    setEvents((prevEvents) => ({ ...prevEvents, [dateString]: updatedEvents }));
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const sourceDateString = date.toDateString();
    const destinationDateString = result.destination.droppableId;

    const movedEvent = events[sourceDateString][result.source.index];
    const updatedSourceEvents = events[sourceDateString].filter((_, index) => index !== result.source.index);

    setEvents((prevEvents) => ({
      ...prevEvents,
      [sourceDateString]: updatedSourceEvents,
      [destinationDateString]: [...(prevEvents[destinationDateString] || []), movedEvent],
    }));
  };

  const handleJoinMeeting = (link) => {
    window.open(link, '_blank');
  };

  return (
    <div className="calendar-container text-center p-8 bg-gray-100 rounded-2xl shadow-lg">
      <div className="calendar-header bg-slate-500/50 m-2 rounded p-2 ">
  <      CalendarTodayIcon style={{ verticalAlign: 'middle', marginRight: '5px' }} />
         Calendar
      </div>
      <Calendar className="border border-gray-300 rounded-lg mb-8 bg-blue-400/50 rounded"  onChange={handleDateChange} value={date} />
      <div className="bg-slate-400 rounded bg-gradient-to-r from-slate-400/50  to-blue-400 text-black mb-4  text-left  max-w-80"><p ><CalendarTodayIcon style={{ verticalAlign: 'middle', marginRight: '0px' }} />
      Selected Date: {date.toDateString()}</p></div>
      

      <button className="add-event-btn flex items-center justify-start" onClick={() => handleOpenModal(null)}>
        <span className="material-icons" style={{ verticalAlign: 'middle', marginRight: '5px' }}>
          add
        </span>
        Schedule Meeting
      </button>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId={date.toDateString()}>
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef} className="events-list mt-8">
              <h3 className="mb-4 p-2 rounded bg-slate-500/30 inline-block px-2"> Your Scheduled Meetings:</h3>
              <ul>
                {(events[date.toDateString()] || []).map((event, index) => (
                  <Draggable key={event.id} draggableId={event.id.toString()} index={index}>
                    {(provided) => (
                      <li ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} className="event-item bg-blue-100 rounded-md p-4 my-2 shadow-md flex flex-col transition-colors duration-300 hover:bg-blue-200">
                        <h4>
                          {event.input} ({event.startTime} - {event.endTime}) 
                          {event.recurrence !== 'none' && <span>🔁</span>}
                        </h4>
                        <p>{event.description}</p>
                        <p>Participants: {event.participants.join(', ')}</p>
                        <p>
                          <button onClick={() => handleJoinMeeting(event.link)}>Join Meeting</button>
                          <button onClick={() => handleOpenModal(event)}>Edit</button>
                          <button onClick={() => handleDeleteEvent(event)}>Delete</button>
                        </p>
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
          <input type="text" value={eventInput} onChange={(e) => setEventInput(e.target.value)} placeholder="Meeting Title" />
          <textarea value={eventDescription} onChange={(e) => setEventDescription(e.target.value)} placeholder="Meeting Description" />
          <input type="time" value={eventStartTime} onChange={(e) => setEventStartTime(e.target.value)} />
          <input type="time" value={eventEndTime} onChange={(e) => setEventEndTime(e.target.value)} />
          <input type="text" value={eventParticipants} onChange={(e) => setEventParticipants(e.target.value)} placeholder="Participants (comma-separated)" />
          <input type="text" value={eventLink} onChange={(e) => setEventLink(e.target.value)} placeholder="Meeting Link" />
          <select value={eventRecurrence} onChange={(e) => setEventRecurrence(e.target.value)}>
            <option value="none">No Recurrence</option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>
        <div className="modal-actions">
          <button onClick={currentEvent ? handleEditEvent : handleAddEvent} className="bg-green-500/50">
            {currentEvent ? 'Update Meeting' : 'Schedule Meeting'}
          </button>
          <button onClick={handleCloseModal} className="bg-red-500/60">close</button>
        </div>
      </Modal>
    </div>
  );
};

export default CalendarComponent;
