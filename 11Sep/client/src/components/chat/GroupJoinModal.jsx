import React from 'react';
import Modal from 'react-modal';

const GroupJoinModal = ({ isOpen, group, onRequestClose, onJoin }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      style={{
        content: {
          top: '50%',
          left: '50%',
          right: 'auto',
          bottom: 'auto',
          marginRight: '-50%',
          transform: 'translate(-50%, -50%)',
          border: '1px solid #ccc',
          background: '#fff',
          borderRadius: '4px',
          padding: '20px',
          zIndex: 1000,
        },
        overlay: {
          backgroundColor: 'transparent', // No dimming effect
        },
      }}
    >
      <h2>{group.name}</h2>
      <p>Are you sure you want to join this group?</p>
      <button onClick={onJoin}>Join Now</button>
      <button onClick={onRequestClose}>Cancel</button>
    </Modal>
  );
};

export default GroupJoinModal;
