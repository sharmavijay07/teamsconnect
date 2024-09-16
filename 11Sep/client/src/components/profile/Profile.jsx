import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import Modal from "react-modal";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Profile = () => {
<<<<<<< HEAD
  const { user, setUser,file } = useContext(AuthContext); // Assuming AuthContext provides user object
  console.log(file)

  // State to control modal visibility
=======
  const { user, setUser } = useContext(AuthContext);
>>>>>>> b7a548af83b2e41941ffcf7769d1319eb67b176d
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(user.profilePicture || ''); // Assuming user.profilePicture holds the URL

  useEffect(() => {
    // Update preview when file changes
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setPreview(user.profilePicture || ''); // Default to current profile picture if no file is selected
    }
  }, [file, user.profilePicture]);

  const openModal = () => setModalIsOpen(true);
  const closeModal = () => setModalIsOpen(false);

  const notify = (message, type) => {
    const toastId = `${type}-${Date.now()}`;
    toast[type](message, {
      toastId,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFile(file);
  };

  const uploadProfilePicture = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append('profilePicture', file, `profile-pic-${Date.now()}.jpg`);

    try {
      const response = await axios.post('http://localhost:4500/api/users/uploadProfilePicture', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const { fileName } = response.data;
      const updatedProfilePicture = `http://localhost:4500/uploads/${fileName}`; // Adjust path as needed

      setUser((prevUser) => ({
        ...prevUser,
        profilePicture: updatedProfilePicture,
      }));

      notify('Profile picture updated successfully!', 'success');
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      notify('Error uploading profile picture.', 'error');
    }
  };

  const saveChanges = async () => {
    const id = user.id;
    try {
      if (file) {
        await uploadProfilePicture();
      }

      const nameResponse = await axios.put(`http://localhost:4500/api/users/updateName/${id}`, { name });
      setUser((prevUser) => ({
        ...prevUser,
        name: nameResponse.data.name || name,
      }));
      notify('Name updated successfully!', 'success');

      const emailResponse = await axios.put(`http://localhost:4500/api/users/updateMail/${id}`, { email });
      setUser((prevUser) => ({
        ...prevUser,
        email: emailResponse.data.email || email,
      }));
      notify('Email updated successfully!', 'success');

    } catch (error) {
      console.log("Error updating profile:", error);
      notify('Error updating profile!', 'error');
    } finally {
      closeModal(); // Ensure modal is closed in finally block
    }
  };

  return (
    <div className="flex items-center p-4 bg-blue-300">
      <div className="grid items-center">
<<<<<<< HEAD
        <div className="w-[30vh] h-[30vh] rounded-full mb-4 p-4 bg-gray-300">
        </div>
=======
        <div
          className="w-[30vh] h-[30vh] rounded-full mb-4 p-4 bg-gray-300"
          style={{ backgroundImage: `url(${preview})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
        ></div>
>>>>>>> b7a548af83b2e41941ffcf7769d1319eb67b176d
        <button
          className="p-2 w-auto bg-blue-500 text-white rounded-3 cursor-pointer"
          onClick={openModal}
        >
          Update
        </button>
      </div>

      <div className="flex flex-col mx-5">
        <h1 className="rounded-lg p-3 text-[4rem]">{user.name}</h1>
        <p className="p-3 text-[2rem]">{user.email}</p>
      </div>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Update Profile"
        className="bg-gradient-to-l from-blue-200 to-blue-400 border-none p-5 rounded-5 w-auto overflow-auto"
        overlayClassName="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center"
      >
<<<<<<< HEAD
        <h2 className="text-lg font-bold mb-4">Update Profile
    
        </h2>
=======
        <div className="flex gap-5">
          <div className="grid items-center ml-4">
            <h2 className="text-[2rem] font-bold">Update Profile</h2>
          </div>
          <div className="flex flex-col p-4 gap-3">
            <div className="flex flex-col item-center">
              <label className="text-[1rem] font-semibold" htmlFor="name">
                Name:
              </label>
              <input
                id="name"
                type="text"
                className="border border-gray-300 rounded-3 p-2 mb-4"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
>>>>>>> b7a548af83b2e41941ffcf7769d1319eb67b176d

              <label className="text-sm font-semibold" htmlFor="email">
                Email:
              </label>
              <input
                id="email"
                type="email"
                className="border border-gray-300 rounded-3 p-2"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <label className="text-sm font-semibold" htmlFor="profilePicture">
                Profile Picture:
              </label>
              <input
                id="profilePicture"
                type="file"
                accept="image/*"
                className="border border-gray-300 rounded-3 p-2"
                onChange={handleFileChange}
              />
              {preview && (
                <img
                  src={preview}
                  alt="Profile Preview"
                  className="mt-3 w-24 h-24 object-cover rounded-full"
                />
              )}
            </div>
            <div className="flex justify-center gap-2 mt-4">
              <button
                className="bg-gradient-to-r from-gray-600 to-gray-700 text-white border-none rounded-3 px-3 py-2 cursor-pointer rounded-lg"
                onClick={closeModal}
              >
                Cancel
              </button>
              <button
                className="bg-gradient-to-r from-blue-600 to-blue-800 text-white px-5 py-2 rounded-3 cursor-pointer"
                onClick={saveChanges}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </Modal>
      <ToastContainer />
    </div>
  );
};

export default Profile;
