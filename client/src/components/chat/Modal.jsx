import React from 'react';

const Modal = ({ isOpen, onClose, onConfirm, groupName }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded shadow-lg">
        <h2 className="text-lg font-bold">Join Group: {groupName}</h2>
        <div className="mt-4">
          <button onClick={onConfirm} className="mr-2 px-4 py-2 bg-blue-500 text-white rounded">
            Join Now
          </button>
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">
            Cancel
          </button>
        </div>
      </div>
      <div
        className="fixed inset-0 bg-black opacity-50"
        onClick={onClose}
      />
    </div>
  );
};

export default Modal;
