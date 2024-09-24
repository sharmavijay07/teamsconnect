import { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import Modal from "react-modal";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { gapi } from "gapi-script";
import "material-icons/iconfont/material-icons.css"; 
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
// import TimeZoneSelect from "react-timezone-select"; 


Modal.setAppElement("#root");

const CalendarComponent = () => {
  const [date, setDate] = useState(new Date());
  const [events, setEvents] = useState({});
  const [eventInput, setEventInput] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [eventStartTime, setEventStartTime] = useState("");
  const [eventEndTime, setEventEndTime] = useState("");
  const [eventParticipants, setEventParticipants] = useState("");
  const [eventLink, setEventLink] = useState("");
  const [eventRecurrence, setEventRecurrence] = useState("none");
  const [eventAgenda, setEventAgenda] = useState("");
  const [eventNotes, setEventNotes] = useState("");
  const [eventAttachments, setEventAttachments] = useState([]);
  const [eventTimeZone, setEventTimeZone] = useState(""); 
  const [isOpen, setIsOpen] = useState(false);
  const [currentEvent, setCurrentEvent] = useState(null);
  const [reminderTime, setReminderTime] = useState(""); // New state for reminder time
  const [reminders, setReminders] = useState({}); // State to store reminders

  useEffect(() => {
    const initClient = () => {
      gapi.load("client:auth2", () => {
        gapi.client.init({
          clientId: "YOUR_CLIENT_ID",
          scope: "https://www.googleapis.com/auth/calendar",
        });
      });
    };
    initClient();
  }, []);

  const handleDateChange = (newDate) => setDate(newDate);

  const handleOpenModal = (event) => {
    setCurrentEvent(event);
    setEventInput(event ? event.input : "");
    setEventDescription(event ? event.description : "");
    setEventStartTime(event ? event.startTime : "");
    setEventEndTime(event ? event.endTime : "");
    setEventParticipants(event ? event.participants.join(", ") : "");
    setEventLink(event ? event.link : "");
    setEventRecurrence(event ? event.recurrence : "none");
    setEventAgenda(event ? event.agenda : "");
    setEventNotes(event ? event.notes : "");
    setEventAttachments(event ? event.attachments : []);
    setEventTimeZone(event ? event.timeZone : ""); 
    setReminderTime(event ? event.reminderTime : ""); // Load reminder time
    setIsOpen(true);
  };

  const handleCloseModal = () => {
    setIsOpen(false);
    setCurrentEvent(null);
    resetForm();
  };

  const resetForm = () => {
    setEventInput("");
    setEventDescription("");
    setEventStartTime("");
    setEventEndTime("");
    setEventParticipants("");
    setEventLink("");
    setEventRecurrence("none");
    setEventAgenda("");
    setEventNotes("");
    setEventAttachments([]);
    setEventTimeZone(""); 
    setReminderTime(""); // Reset reminder time
  };

  const handleAddEvent = () => {
    const dateString = date.toDateString();
    if (eventInput.trim() !== "" && eventStartTime && eventEndTime) {
      const newEvent = {
        input: eventInput,
        description: eventDescription,
        startTime: eventStartTime,
        endTime: eventEndTime,
        participants: eventParticipants.split(",").map((participant) => participant.trim()),
        link: eventLink,
        id: Date.now(),
        recurrence: eventRecurrence,
        agenda: eventAgenda,
        notes: eventNotes,
        attachments: eventAttachments,
        timeZone: eventTimeZone, 
        reminderTime: reminderTime, // Add reminder time to event
      };

      if (!isConflict(dateString, newEvent)) {
        setEvents((prevEvents) => addNewEvent(prevEvents, dateString, newEvent));
        handleCloseModal();
      } else {
        alert("Event time conflict! Please choose a different time.");
      }
    } else {
      alert("Please fill in all fields.");
    }
  };

  const isConflict = (dateString, newEvent) => {
    const existingEvents = events[dateString] || [];
    return existingEvents.some(
      (event) => newEvent.startTime < event.endTime && newEvent.endTime > event.startTime
    );
  };

  const addNewEvent = (prevEvents, dateString, newEvent) => {
    const updatedEvents = {
      ...prevEvents,
      [dateString]: [...(prevEvents[dateString] || []), newEvent],
    };

    let recurrenceDays = 0;
    switch (eventRecurrence) {
      case "daily":
        recurrenceDays = 1;
        break;
      case "weekly":
        recurrenceDays = 7;
        break;
      case "monthly":
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

    // Add reminder to the reminders state
    if (newEvent.reminderTime) {
      const reminderKey = `${newEvent.id}-${newEvent.reminderTime}`;
      setReminders((prevReminders) => ({
        ...prevReminders,
        [reminderKey]: {
          eventId: newEvent.id,
          reminderTime: newEvent.reminderTime,
          eventTitle: newEvent.input,
          eventDate: dateString, 
        },
      }));
    }

    return updatedEvents;
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
            participants: eventParticipants.split(",").map((participant) => participant.trim()),
            link: eventLink,
            recurrence: eventRecurrence,
            agenda: eventAgenda,
            notes: eventNotes,
            attachments: eventAttachments,
            timeZone: eventTimeZone, 
            reminderTime: reminderTime, // Update reminder time
          }
        : event
    );

    setEvents((prevEvents) => ({ ...prevEvents, [dateString]: updatedEvents }));
    handleCloseModal();
  };

  const handleDeleteEvent = (eventToDelete) => {
    const dateString = date.toDateString();
    const updatedEvents = events[dateString].filter((event) => event.id !== eventToDelete.id);
    setEvents((prevEvents) => ({ ...prevEvents, [dateString]: updatedEvents }));

    // Remove reminder from the reminders state
    const reminderKey = `${eventToDelete.id}-${eventToDelete.reminderTime}`;
    setReminders((prevReminders) => {
      const updatedReminders = { ...prevReminders };
      delete updatedReminders[reminderKey];
      return updatedReminders;
    });
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
      [destinationDateString]: [
        ...(prevEvents[destinationDateString] || []),
        movedEvent,
      ],
    }));

    // Update reminder in the reminders state
    const reminderKey = `${movedEvent.id}-${movedEvent.reminderTime}`;
    setReminders((prevReminders) => {
      const updatedReminders = { ...prevReminders };
      updatedReminders[reminderKey].eventDate = destinationDateString;
      return updatedReminders;
    });
  };

  const handleJoinMeeting = (link) => {
    window.open(link, "_blank");
  };

  const handleFileChange = (e) => {
    setEventAttachments([...eventAttachments, ...Array.from(e.target.files)]);
  };

  return (
    <div className="calendar-container text-center p-8 bg-gray-100 rounded-2xl shadow-lg">
      <div className="calendar-header bg-slate-500/50 m-2 rounded p-2">
        <CalendarTodayIcon style={{ verticalAlign: 'middle', marginRight: '5px' }} />
        Calendar
      </div>
      <Calendar
        className="border border-gray-300 rounded-lg mb-8 bg-blue-400/50"
        onChange={handleDateChange}
        value={date}
      />
      <div className="bg-slate-400 rounded bg-gradient-to-r from-slate-400/50 to-blue-400 text-black mb-4 text-left max-w-80">
        <p>
          <CalendarTodayIcon style={{ verticalAlign: 'middle', marginRight: '0px' }} />
          Selected Date: {date.toDateString()}
        </p>
      </div>

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
              <h3 className="mb-4 p-2 rounded bg-slate-500/30 inline-block px-2">
                Your Scheduled Meetings:
              </h3>
              <ul>
                {(events[date.toDateString()] || []).map((event, index) => (
                  <Draggable key={event.id} draggableId={event.id.toString()} index={index}>
                    {(provided) => (
                      <li ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} className="event-item bg-blue-100 rounded-md p-4 my-2 shadow-md flex flex-col transition-colors duration-300 hover:bg-blue-200">
                        <h4>
                          {event.input} ({event.startTime} - {event.endTime}, {event.timeZone})
                          {event.recurrence !== "none" && <span>🔁</span>}
                        </h4>
                        <p>{event.description}</p>
                        <p>Participants: {event.participants.join(", ")}</p>
                        <p>
                          <button onClick={() => handleJoinMeeting(event.link)}>
                            Join Meeting
                          </button>
                          <button onClick={() => handleOpenModal(event)} style={{ fontSize: 'small' }}>
                            Edit
                          </button>
                          <button onClick={() => handleDeleteEvent(event)} style={{ fontSize: 'small' }}>
                            Delete
                          </button>
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
        <h2>{currentEvent ? "Edit Meeting" : "Schedule Meeting"}</h2>
        <div className="modal-inputs">
          <input
            type="text"
            placeholder="Meeting Title"
            value={eventInput}
            onChange={(e) => setEventInput(e.target.value)}
          />
          <textarea
            placeholder="Description"
            value={eventDescription}
            onChange={(e) => setEventDescription(e.target.value)}
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
            placeholder="Participants (comma separated)"
            value={eventParticipants}
            onChange={(e) => setEventParticipants(e.target.value)}
          />
          <input
            type="text"
            placeholder="Meeting Link"
            value={eventLink}
            onChange={(e) => setEventLink(e.target.value)}
          />
          <select
            value={eventRecurrence}
            onChange={(e) => setEventRecurrence(e.target.value)}
          >
            <option value="none">No Recurrence</option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
          <textarea
            placeholder="Agenda"
            value={eventAgenda}
            onChange={(e) => setEventAgenda(e.target.value)}
          />
          <textarea
            placeholder="Notes"
            value={eventNotes}
            onChange={(e) => setEventNotes(e.target.value)}
          />
          <input type="file" multiple onChange={handleFileChange} />
          <TimeZoneSelect
            value={eventTimeZone}
            onChange={(timezone) => setEventTimeZone(timezone.value)}
            className="timezone-select"
          />
          <input
            type="time"
            placeholder="Reminder Time"
            value={reminderTime}
            onChange={(e) => setReminderTime(e.target.value)}
          />
        </div>
        <div className="modal-actions">
          <button onClick={currentEvent ? handleEditEvent : handleAddEvent} className="bg-green-500/50">
            {currentEvent ? 'Update Meeting' : 'Schedule Meeting'}
          </button>
          <button onClick={handleCloseModal} className="bg-red-500/60">Close</button>
        </div>
      </Modal>

      {/* Reminder Section (UI Improvement) */}
      <div className="reminders-section mt-8">
        <h3 className="mb-4 p-2 rounded bg-slate-500/30 inline-block px-2">
          <ReminderIcon style={{ verticalAlign: 'middle', marginRight: '5px' }} />
          Reminders:
        </h3>
        <ul>
          {Object.values(reminders).map((reminder) => (
            <li key={reminder.eventId} className="reminder-item bg-yellow-100 rounded-md p-4 my-2 shadow-md flex items-center justify-between">
              <div>
                <p className="font-bold">{reminder.eventTitle}</p>
                <p>{reminder.eventDate} - {reminder.reminderTime}</p> 
              </div>
              <ReminderIcon style={{ color: 'orange' }} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CalendarComponent;