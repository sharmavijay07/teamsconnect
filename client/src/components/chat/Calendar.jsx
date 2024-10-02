import { useState, useEffect } from "react";
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';
import './CalendarStyles.css';
import Modal from "react-modal";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { gapi } from "gapi-script";
import "material-icons/iconfont/material-icons.css";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import TimeZoneSelect from "react-timezone-select";
import ReminderIcon from "@mui/icons-material/Notifications";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import EventNoteIcon from "@mui/icons-material/EventNote"; // Icon for Scheduled Meetings

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
  const [participants, setParticipants] = useState([
    // Can Add more dummy participants
  ]);
  const [newParticipantName, setNewParticipantName] = useState("");
  const [newParticipantStatus, setNewParticipantStatus] = useState("free");

  const handleAddParticipant = () => {
    if (newParticipantName.trim() !== "") {
      setParticipants([
        ...participants,
        { name: newParticipantName, status: newParticipantStatus },
      ]);
      setNewParticipantName(""); // Reset input after adding
    } else {
      alert("Please enter a participant name.");
    }
  };

  const handleDeleteParticipant = (index) => {
    setParticipants(participants.filter((_, i) => i !== index));
  };

  useEffect(() => {
    const initClient = () => {
      gapi.load("client:auth2", () => {
        gapi.client.init({
          clientId: "YOUR_CLIENT_ID",
          scope: "https://www.googleapis.com/auth/calendar",
        }).then(() => {
          console.log("Google API initialized successfully.");
        }).catch((error) => {
          console.error("Error initializing Google API:", error);
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
        participants: eventParticipants
          .split(",")
          .map((participant) => participant.trim()),
        link: eventLink,
        id: Date.now(),
        recurrence: eventRecurrence,
        agenda: eventAgenda,
        notes: eventNotes,
        attachments: eventAttachments,
        timeZone: eventTimeZone,
        reminderTime: reminderTime, // Add reminder time to event
      };

      if (newEvent.reminderTime) {
        scheduleNotification(newEvent, dateString);
      }

      if (!isConflict(dateString, newEvent)) {
        setEvents((prevEvents) =>
          addNewEvent(prevEvents, dateString, newEvent)
        );
        handleCloseModal();
      } else {
        alert("Event time conflict! Please choose a different time.");
      }
    } else {
      alert("Please fill in all fields.");
    }
  };

  const scheduleNotification = (event, dateString) => {
    const eventDate = new Date(dateString);
    const [hours, minutes] = event.reminderTime.split(":").map(Number);
    eventDate.setHours(hours, minutes, 0, 0);

    const now = new Date();
    const timeUntilEvent = eventDate.getTime() - now.getTime();

    if (timeUntilEvent > 0) {
      setTimeout(() => {
        // Show notification
        if (Notification.permission === "granted") {
          const notification = new Notification("Meeting Reminder", {
            body: `Upcoming meeting: ${event.input} at ${event.startTime}`,
            icon: "https://cdn-icons-png.flaticon.com/512/2534/2534500.png", // Custom icon
            image:
              "https://img.freepik.com/free-vector/meeting-illustration_52683-39753.jpg", // Custom image
            badge: "https://cdn-icons-png.flaticon.com/512/3246/3246216.png", // Custom badge
            vibrate: [200, 100, 200],
            requireInteraction: true,
            actions: [
              {
                action: "open-meeting",
                title: "Open Meeting",
                icon: "https://cdn-icons-png.flaticon.com/512/748/748234.png",
              },
            ],
          });

          // Add event listener for button clicks
          notification.addEventListener("click", (event) => {
            if (event.action === "open-meeting") {
              // Code to open the meeting link (e.g., event.link) in a new tab
              window.open(event.link, "_blank");
            }
          });
        } else if (Notification.permission !== "denied") {
          Notification.requestPermission().then((permission) => {
            if (permission === "granted") {
              // Show notification with permission granted
              const notification = new Notification("Meeting Reminder", {
                body: `Upcoming meeting: ${event.input} at ${event.startTime}`,
                icon: "https://cdn-icons-png.flaticon.com/512/2534/2534500.png", // Custom icon
                image:
                  "https://img.freepik.com/free-vector/meeting-illustration_52683-39753.jpg", // Custom image
                badge:
                  "https://cdn-icons-png.flaticon.com/512/3246/3246216.png", // Custom badge
                vibrate: [200, 100, 200],
                requireInteraction: true,
                actions: [
                  {
                    action: "open-meeting",
                    title: "Open Meeting",
                    icon: "https://cdn-icons-png.flaticon.com/512/748/748234.png",
                  },
                ],
              });

              // Add event listener for button clicks
              notification.addEventListener("click", (event) => {
                if (event.action === "open-meeting") {
                  // Code to open the meeting link (e.g., event.link) in a new tab
                  window.open(event.link, "_blank");
                }
              });
            }
          });
        }
      }, timeUntilEvent);
    }
  };

  const isConflict = (dateString, newEvent) => {
    const existingEvents = events[dateString] || [];
    return existingEvents.some(
      (event) =>
        newEvent.startTime < event.endTime && newEvent.endTime > event.startTime
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
            participants: eventParticipants
              .split(",")
              .map((participant) => participant.trim()),
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
    const updatedEvents = events[dateString].filter(
      (event) => event.id !== eventToDelete.id
    );
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
        <CalendarTodayIcon
          style={{ verticalAlign: "middle", marginRight: "5px" }}
        />
        Calendar
      </div>
      <Calendar
        className="border border-gray-300 rounded-lg mb-8 bg-blue-400/50"
        onChange={handleDateChange}
        value={date}
      />
      <div className="bg-slate-400 rounded bg-gradient-to-r from-slate-400/50 to-blue-400 text-black mb-4 text-left max-w-80">
        <p>
          <CalendarTodayIcon
            style={{ verticalAlign: "middle", marginRight: "0px" }}
          />
          Selected Date: {date.toDateString()}
        </p>
      </div>

      <button
        className="add-event-btn flex items-center justify-start"
        onClick={() => handleOpenModal(null)}
      >
        <span
          className="material-icons"
          style={{ verticalAlign: "middle", marginRight: "5px" }}
        >
          add
        </span>
        Schedule Meeting
      </button>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId={date.toDateString()}>
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="events-list mt-8"
            >
              <h3 className="mb-4 p-2 rounded bg-slate-500/30 inline-block px-2 flex items-center">
                <EventNoteIcon className="mr-2" />
                Your Scheduled Meetings:
              </h3>
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
                        className="event-item bg-blue-100 rounded-md p-4 my-2 shadow-md flex flex-col transition-colors duration-300 hover:bg-blue-200"
                      >
                        <h4>
                          {event.input} ({event.startTime} - {event.endTime},{" "}
                          {event.timeZone})
                          {event.recurrence !== "none" && <span>🔁</span>}
                        </h4>
                        <p>{event.description}</p>
                        <p>Participants: {event.participants.join(", ")}</p>
                        <p>
                          <button onClick={() => handleJoinMeeting(event.link)}>
                            Join Meeting
                          </button>
                          <button
                            onClick={() => handleOpenModal(event)}
                            style={{ fontSize: "small" }}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteEvent(event)}
                            style={{ fontSize: "small" }}
                          >
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
        <div className="modal-container">
          <h2 className="modal-title">
            {currentEvent ? "Edit Meeting" : "Schedule Meeting"}
          </h2>
          <div className="modal-inputs space-y-4">
            {/* Meeting Title */}
            <div>
              <label className="block font-medium">Meeting Title</label>
              <input
                type="text"
                placeholder="Enter meeting title"
                value={eventInput}
                onChange={(e) => setEventInput(e.target.value)}
                className="input-field"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block font-medium">Description</label>
              <textarea
                placeholder="Enter meeting description"
                value={eventDescription}
                onChange={(e) => setEventDescription(e.target.value)}
                className="input-field"
              />
            </div>

            {/* Start and End Time */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-medium">Start Time</label>
                <input
                  type="time"
                  value={eventStartTime}
                  onChange={(e) => setEventStartTime(e.target.value)}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block font-medium">End Time</label>
                <input
                  type="time"
                  value={eventEndTime}
                  onChange={(e) => setEventEndTime(e.target.value)}
                  className="input-field"
                />
              </div>
            </div>

            {/* Participants */}
            <div>
              <label className="block font-medium">Participants</label>
              <input
                type="text"
                placeholder="Enter participants (comma separated)"
                value={eventParticipants}
                onChange={(e) => setEventParticipants(e.target.value)}
                className="input-field"
              />
            </div>

            {/* Meeting Link */}
            <div>
              <label className="block font-medium">Meeting Link</label>
              <input
                type="text"
                placeholder="Enter meeting link"
                value={eventLink}
                onChange={(e) => setEventLink(e.target.value)}
                className="input-field"
              />
            </div>

            {/* Recurrence */}
            <div>
              <label className="block font-medium">Recurrence</label>
              <select
                value={eventRecurrence}
                onChange={(e) => setEventRecurrence(e.target.value)}
                className="input-field"
              >
                <option value="none">No Recurrence</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>

            {/* Notes */}
            <div>
              <label className="block font-medium">Notes</label>
              <textarea
                placeholder="Enter additional notes"
                value={eventNotes}
                onChange={(e) => setEventNotes(e.target.value)}
                className="input-field"
              />
            </div>

            {/* File Upload */}
            <div>
              <label className="block font-medium">Attach Files</label>
              <input
                type="file"
                multiple
                onChange={handleFileChange}
                className="input-field"
              />
            </div>

            {/* Timezone */}
            <div>
              <label className="block font-medium">Time Zone</label>
              <TimeZoneSelect
                value={eventTimeZone}
                onChange={(timezone) => setEventTimeZone(timezone.value)}
                className="input-field"
              />
            </div>

            {/* Reminder Time */}
            <div>
              <label className="block font-medium">Reminder Time</label>
              <input
                type="time"
                placeholder="Set reminder time"
                value={reminderTime}
                onChange={(e) => setReminderTime(e.target.value)}
                className="input-field"
              />
            </div>
          </div>

          <div className="modal-actions mt-6 space-x-4">
            <button
              onClick={currentEvent ? handleEditEvent : handleAddEvent}
              className="bg-green-500/80 hover:bg-green-600 text-white px-4 py-2 rounded-md"
            >
              {currentEvent ? 'Update Meeting' : 'Schedule Meeting'}
            </button>
            <button
              onClick={handleCloseModal}
              className="bg-red-500/80 hover:bg-red-600 text-white px-4 py-2 rounded-md"
            >
              Close
            </button>
          </div>
        </div>
      </Modal>

      {/* Reminder Section (UI Improvement) */}
      <div className="reminders-section mt-8">
        <h3 className="mb-4 p-2 rounded bg-slate-500/30 inline-block px-2">
          <ReminderIcon
            style={{ verticalAlign: "middle", marginRight: "5px" }}
          />
          Reminders:
        </h3>
        <ul>
          {Object.values(reminders).map((reminder) => (
            <li
              key={reminder.eventId}
              className="reminder-item bg-yellow-100 rounded-md p-4 my-2 shadow-md flex items-center justify-between"
            >
              <div>
                <p className="font-bold">{reminder.eventTitle}</p>
                <p>
                  {reminder.eventDate} - {reminder.reminderTime}
                </p>
              </div>
              <ReminderIcon style={{ color: "orange" }} />
            </li>
          ))}
        </ul>
      </div>

      <div className="participants-section mt-8">
        <h3 className="mb-4 p-2 rounded bg-slate-500/30 inline-block px-2 flex items-center">
          <AccessTimeIcon className="mr-2" />
          Availability Status:
        </h3>

        <ul className="availability-list">
          {participants.map((participant, index) => (
            <li
              key={index}
              className={`status-${participant.status} flex justify-between items-center bg-blue-100 rounded-md p-4 my-2 shadow-md`}
            >
              <div>
                <span>{participant.name}:</span>
                <span>
                  {participant.status === "free" ? "🟢 Online" : "🔴 Offline"}
                </span>
              </div>
              <button
                onClick={() => handleDeleteParticipant(index)}
                className="bg-red-500 text-white rounded p-1"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>

        <div className="add-participant">
          <input
            type="text"
            placeholder="Participant Name"
            value={newParticipantName}
            onChange={(e) => setNewParticipantName(e.target.value)}
          />
          <select
            value={newParticipantStatus}
            onChange={(e) => setNewParticipantStatus(e.target.value)}
          >
            <option value="free">Online</option>
            <option value="busy">Offline</option>
          </select>
          <button
            onClick={handleAddParticipant}
            className="bg-green-500 text-white rounded p-1"          >
            Add Participant
          </button>
        </div>
      </div>
    </div>
  );
};

export default CalendarComponent;