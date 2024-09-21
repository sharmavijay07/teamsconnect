import React from "react";
import Modal from "react-modal";

const GroupJoinModal = ({ isOpen, group, onRequestClose, onJoin }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      style={{
        content: {
          top: "50%",
          left: "50%",
          right: "auto",
          height: "45vh",
          bottom: "auto",
          marginRight: "-50%",
          transform: "translate(-50%, -50%)",
          border: "1px solid #ccc",
          background: "black",
          opacity: "90%",
          color: "white",
          borderRadius: "20px",
          padding: "2rem",
          zIndex: 1000,
        },
        overlay: {
          background: "shadow",
          overflow: "hidden",
          // No dimming effect
        },
      }}
    >
      <div className=" flex flex-col justify-around gap-3">
        <div className="gap-4 w-full grid text-center justify-center p-3">
          <h2>{group.name}</h2>
          <p>Are you sure you want to join this group?</p>
        </div>
        <div className="gap-2 mt-5 flex items-center justify-center">
          <button
            onClick={onJoin}
            className="p-2 bg-blue-500 my-1 cursor-pointer flex justify-between  border-b-2 rounded-xl mx-1 border-gray-600/40 transform transition duration-500 hover:bg-blue-300"
          >
            Join Now
          </button>
          <button
            onClick={onRequestClose}
            className="p-2 bg-gray-500 cursor-pointer flex items-center border-b-2 rounded-xl border-gray-600/40 transform transition duration-500 hover:bg-gray-300"
          >
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default GroupJoinModal;
