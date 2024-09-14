import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import Modal from "react-modal";
import axios from "axios";

// Set the app element for accessibility
Modal.setAppElement("#root"); // Adjust if your root element is different

const Profile = () => {
  const { user, setUser } = useContext(AuthContext); // Assuming AuthContext provides user object

  // State to control modal visibility
  const [modalIsOpen, setModalIsOpen] = useState(false);

  // Local state for form input fields (name and email)
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);

  // Open and close modal functions
  const openModal = () => setModalIsOpen(true);
  const closeModal = () => setModalIsOpen(false);

  // Save updated values (you can also update these values in the context or backend)
  const saveChanges = () => {
    const id = user.id;

    // Update the name
    axios
      .put(`http://localhost:4500/api/users/updateName/${id}`, { name })
      .then((resp) => {
        console.log("Name updated successfully", resp.data);
        setUser((prevUser) => ({
          ...prevUser,
          name: resp.data.name || name, // Ensure the name from response is used, fallback to local state
        }));
      })
      .catch((err) => {
        console.log("Error updating name:", err);
      });

    // Update the email
    axios
      .put(`http://localhost:4500/api/users/updateMail/${id}`, { email })
      .then((resp) => {
        console.log("Email updated successfully", resp.data);
        setUser((prevUser) => ({
          ...prevUser,
          email: resp.data.email || email, // Ensure the email from response is used, fallback to local state
        }));
      })
      .catch((err) => {
        console.log("Error updating email:", err);
      });

    alert("Changes saved!");
    closeModal();
  };

  return (
    <div className="flex p-5 bg-blue-300">
      <div className="grid items-center">
        <div className="w-[30vh] h-[30vh] rounded-full mb-4 p-4 bg-gray-300"></div>
        <button
          className="px-5 py-2 bg-blue-500 text-white rounded-lg cursor-pointer"
          onClick={openModal}
        >
          Update
        </button>
      </div>
      <div className="flex flex-col mx-2 ">
        <h1 className=" rounded-lg p-1 text-[4rem]">{user.name}</h1>
        <p className=" p-3 text-[2rem]">
          <b>Email: </b> {user.email}
        </p>
      </div>

      {/* Modal to Update Profile */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Update Profile"
        className="bg-white p-5 rounded-lg w-96"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
      >
        <h2 className="text-lg font-bold mb-4">Update Profile</h2>

        <div className="flex flex-col gap-4">
          {/* Input for Name */}
          <label className="text-sm font-semibold" htmlFor="name">
            Name:
          </label>
          <input
            id="name"
            type="text"
            className="border border-gray-300 rounded-lg p-2"
            value={name}
            onChange={(e) => setName(e.target.value)} // Update the name state
          />

          {/* Input for Email */}
          <label className="text-sm font-semibold" htmlFor="email">
            Email:
          </label>
          <input
            id="email"
            type="email"
            className="border border-gray-300 rounded-lg p-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)} // Update the email state
          />

          {/* Buttons */}
          <div className="flex justify-end gap-2 mt-4">
            <button
              className="bg-gray-300 border-none px-3 py-2 cursor-pointer rounded-lg"
              onClick={closeModal}
            >
              Cancel
            </button>
            <button
              className="bg-blue-500 text-white px-5 py-2 rounded-lg cursor-pointer"
              onClick={saveChanges}
            >
              Save
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Profile;
