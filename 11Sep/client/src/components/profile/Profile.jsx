import React, { useContext, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import Modal from 'react-modal';

// Set the app element for accessibility
Modal.setAppElement('#root'); // Adjust if your root element is different

const Profile = () => {
    const { user } = useContext(AuthContext);
    const [modalIsOpen, setModalIsOpen] = useState(false);

    const openModal = () => setModalIsOpen(true);
    const closeModal = () => setModalIsOpen(false);
    const saveChanges = () => {
        // Logic to save changes goes here
        alert('Changes saved!');
        closeModal();
    };

    return (
        <div className="flex justify-between p-5 bg-gray-100">
            <div className="flex flex-col gap-4 flex-1">
                <h1 className="border-2 border-gray-500 rounded-lg p-3 bg-white">
                    <b>Name:</b> {user.name}
                </h1>
                <p className="border-2 border-gray-500 rounded-lg p-3 bg-white">
                    <b>Email:</b> {user.email}
                </p>
            </div>
            <div className="flex items-center gap-2">
                <div className="w-24 h-24 rounded-full bg-gray-300"></div>
                <button className="px-5 py-2 bg-blue-500 text-white rounded-lg cursor-pointer" onClick={openModal}>
                    Update
                </button>
            </div>

            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                contentLabel="Update Profile"
                className="bg-white p-5 rounded-lg  w-96"
                overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
            >
                <h2 className="text-lg font-bold mb-4">Update Profile</h2>
                <div className="flex flex-col gap-2">
                    {/* Add your form fields here */}
                    <button className="bg-gray-300 border-none px-3 py-2 cursor-pointer">Cancel</button>
                    <button className="bg-blue-500 text-white px-5 py-2 rounded-lg cursor-pointer" onClick={saveChanges}>Save</button>
                </div>
            </Modal>
        </div>
    );
};

export default Profile;
