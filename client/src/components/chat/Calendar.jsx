import { useState, useEffect, useContext, useCallback } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import Modal from "react-modal";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { gapi } from "gapi-script";
import "material-icons/iconfont/material-icons.css";
import "material-icons/iconfont/material-icons.css";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import TimeZoneSelect from "react-timezone-select";
import ReminderIcon from "@mui/icons-material/Notifications";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import EventNoteIcon from "@mui/icons-material/EventNote"; // Icon for Scheduled Meetings
import { CalendarContext } from "@/context/CalendarContext";
import { AuthContext } from "@/context/AuthContext";
import axios from "axios";
import { baseUrl } from "@/utils/services";

Modal.setAppElement("#root");

const CalendarComponent = () => {
  const {
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
    
  } = useContext(CalendarContext)

  const {user} = useContext(AuthContext)
  

 
    

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
                <p>{reminder.eventDate} - {reminder.reminderTime}</p>
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
            <li key={index} className={`status-${participant.status} flex justify-between items-center bg-blue-100 rounded-md p-4 my-2 shadow-md`}>
              <div>
                <span>{participant.name}:</span>
                <span>{participant.status === 'free' ? '🟢 Online' : '🔴 Offline'}</span>
              </div>
              <button onClick={() => handleDeleteParticipant(index)} className="bg-red-500 text-white rounded p-1">Delete</button>
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
            <option value="free">Free</option>
            <option value="busy">Busy</option>
          </select>
          <button onClick={handleAddParticipant} className="bg-green-500 text-white rounded p-1">Add Participant</button>
        </div>
      </div>

    </div>
  );
};

export default CalendarComponent;
