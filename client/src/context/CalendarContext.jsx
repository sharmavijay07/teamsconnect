import React, { createContext, useState ,useEffect, useContext} from "react";
import { AuthContext } from "./AuthContext";


export const CalendarContext = createContext(null)



export const CalendarContextProvider = ({children}) => {

    const [date, setDate] = useState(new Date());
    const [events, setEvents] = useState({});
    const [eventInput, setEventInput] = useState();
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
    const {user} = useContext(AuthContext)
    const [newParticipantName, setNewParticipantName] = useState("");
    const [newParticipantStatus, setNewParticipantStatus] = useState("free");
  
    const handleAddParticipant = () => {
      if (newParticipantName.trim() !== "") {
        setParticipants([...participants, { name: newParticipantName, status: newParticipantStatus }]);
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
  
        if (newEvent.reminderTime) {
          scheduleNotification(newEvent, dateString);
        }
  
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
              image: "https://img.freepik.com/free-vector/meeting-illustration_52683-39753.jpg", // Custom image
              badge: "https://cdn-icons-png.flaticon.com/512/3246/3246216.png", // Custom badge
              vibrate: [200, 100, 200],
              requireInteraction: true,
              actions: [
                {
                  action: "open-meeting",
                  title: "Open Meeting",
                  icon: "https://cdn-icons-png.flaticon.com/512/748/748234.png"
                }
              ]
            });
  
            // Add event listener for button clicks
            notification.addEventListener('click', (event) => {
              if (event.action === 'open-meeting') {
                // Code to open the meeting link (e.g., event.link) in a new tab
                window.open(event.link, '_blank');
              }
            });
  
          } else if (Notification.permission !== "denied") {
            Notification.requestPermission().then((permission) => {
              if (permission === "granted") {
                // Show notification with permission granted
                const notification = new Notification("Meeting Reminder", {
                  body: `Upcoming meeting: ${event.input} at ${event.startTime}`,
                  icon: "https://cdn-icons-png.flaticon.com/512/2534/2534500.png", // Custom icon
                  image: "https://img.freepik.com/free-vector/meeting-illustration_52683-39753.jpg", // Custom image
                  badge: "https://cdn-icons-png.flaticon.com/512/3246/3246216.png", // Custom badge
                  vibrate: [200, 100, 200],
                  requireInteraction: true,
                  actions: [
                    {
                      action: "open-meeting",
                      title: "Open Meeting",
                      icon: "https://cdn-icons-png.flaticon.com/512/748/748234.png"
                    }
                  ]
                });
  
                // Add event listener for button clicks
                notification.addEventListener('click', (event) => {
                  if (event.action === 'open-meeting') {
                    // Code to open the meeting link (e.g., event.link) in a new tab
                    window.open(event.link, '_blank');
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


    const handleCloseModal = () => {
        setIsOpen(false);
        setCurrentEvent(null);

        const userId = user?.id
        axios.post(`${baseUrl}/meeting/submit`,{date,userId,description,participants,eventInput,eventLink})
        .then((result) => {
            console.log(result.data);
        })
        .catch((err) => {
            console.log(err);
        })





        resetForm();


        

      }

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



   return(
    <CalendarContext.Provider value={{
        date,
        setDate,
        events,
        setEvents,
        eventInput,
        setEventInput,
        eventDescription,
        setEventDescription,
        eventStartTime,
        setEventStartTime,
        eventEndTime,
        setEventEndTime,
        eventParticipants,
        setEventParticipants,
        eventLink,
        setEventLink,
        eventRecurrence,
        setEventRecurrence,
        eventNotes,
        setEventNotes,
        eventAttachments,
        setEventAttachments,
        eventTimeZone,
        setEventTimeZone,
        isOpen,
        setIsOpen,
        currentEvent,
        setCurrentEvent,
        reminderTime,
        setReminderTime,
        reminders,
        setReminders,
        participants,
        setParticipants,
        newParticipantName,
        setNewParticipantName,
        newParticipantStatus,
        setNewParticipantStatus,
        handleAddParticipant,
        handleDeleteParticipant,
        handleDateChange,
        handleOpenModal,
        resetForm,
        handleAddEvent,
        scheduleNotification,
        isConflict,
        addNewEvent,
        handleEditEvent,
        handleDeleteEvent,
        handleDragEnd,
        handleJoinMeeting,
        handleFileChange,
        handleCloseModal

    }}>
        {children}
    </CalendarContext.Provider>
   )
}