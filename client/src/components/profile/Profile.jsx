  import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import Modal from "react-modal";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import NavBar from "../NavBar";
import Sidebar from "../chat/SideBar";

const Profile = () => {
  const { user, setUser } = useContext(AuthContext);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(user.profilePicture || "");
  const [cameraPreview, setCameraPreview] = useState("");
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [cameraStream, setCameraStream] = useState(null);

  useEffect(() => {
    if (file && !cameraPreview) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    } else if (!file && !cameraPreview) {
      setPreview(user.profilePicture || "");
    }
  }, [file, user.profilePicture, cameraPreview]);

  const openModal = () => setModalIsOpen(true);
  const closeModal = () => {
    setModalIsOpen(false);
    stopCamera();
    setCameraPreview("");
  };

  const notify = (message, type) => {
    const toastId = `${type}-${Date.now()}`;
    toast[type](message, {
      toastId,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFile(file);
    setCameraPreview("");
  };

  const uploadProfilePicture = async () => {
    if (!file && !cameraPreview) return;

    const formData = new FormData();
    const selectedFile =
      file || dataURLtoFile(cameraPreview, `profile-pic-${Date.now()}.jpg`);
    formData.append("profilePicture", selectedFile, selectedFile.name);

    try {
      const response = await axios.post(
        "http://localhost:4500/api/users/uploadProfilePicture",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const { fileName } = response.data;
      const updatedProfilePicture = `http://localhost:4500/uploads/${fileName}`;

      setUser((prevUser) => ({
        ...prevUser,
        profilePicture: updatedProfilePicture,
      }));

      notify("Profile picture updated successfully!", "success");
    } catch (error) {
      console.error("Error uploading profile picture:", error);
      notify("Error uploading profile picture.", "error");
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
        },
      });
      const videoElement = document.querySelector("#camera");
      if (videoElement) {
        videoElement.srcObject = stream;
        videoElement.play();
      }
      setCameraStream(stream);
      setIsCameraOpen(true);
    } catch (error) {
      console.error("Error accessing camera:", error);
      notify("Error accessing camera.", "error");
    }
  };

  const capturePhoto = () => {
    const videoElement = document.querySelector("#camera");
    const canvasElement = document.createElement("canvas");
    canvasElement.width = videoElement.videoWidth;
    canvasElement.height = videoElement.videoHeight;
    const context = canvasElement.getContext("2d");
    context.drawImage(
      videoElement,
      0,
      0,
      canvasElement.width,
      canvasElement.height
    );
    const dataUrl = canvasElement.toDataURL("image/jpeg");
    setCameraPreview(dataUrl);
    setFile(null);
    stopCamera();
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
    }
    setIsCameraOpen(false);
  };

  const dataURLtoFile = (dataUrl, filename) => {
    const arr = dataUrl.split(",");
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  };

  const saveChanges = async () => {
    const id = user.id;

    try {
      let hasChanges = false;

      if (file || cameraPreview) {
        await uploadProfilePicture();
        hasChanges = true;
      }

      if (name !== user.name) {
        const nameResponse = await axios.put(
          `http://localhost:4500/api/users/updateName/${id}`,
          { name }
        );
        const updatedName = nameResponse.data.name || name;
        setUser((prevUser) => ({
          ...prevUser,
          name: updatedName,
        }));
        hasChanges = true;
      }

      if (email !== user.email) {
        const emailResponse = await axios.put(
          `http://localhost:4500/api/users/updateMail/${id}`,
          { email }
        );
        const updatedEmail = emailResponse.data.email || email;
        setUser((prevUser) => ({
          ...prevUser,
          email: updatedEmail,
        }));
        hasChanges = true;
      }

      if (hasChanges) {
        const updatedUser = { ...user, name, email };
        localStorage.setItem("User", JSON.stringify(updatedUser));
        notify("Profile updated successfully!", "success");
      } else {
        notify("No changes made to the profile.", "info");
      }
    } catch (error) {
      console.log("Error updating profile:", error);
      notify("Error updating profile!", "error");
    } finally {
      closeModal();
    }
  };

  return (
    <>
      <div className="flex flex-col min-h-screen">
        <NavBar />
        <div className="flex flex-1">
          <Sidebar />
          <div className="flex flex-col items-center bg-gradient-to-r from-blue-500 to-gray-400"> {/* flex-1 */}
            {/* Profile section with partitioned background */}
            <div className="relative w-full h-[30vh] bg-gradient-to-r from-blue-500 to-gray-400">
              {/* Profile Picture */}
              <div
                className="absolute w-[30vh] h-[30vh] rounded-full bg-gray-300 shadow-2xl border-none"
                style={{
                  backgroundImage: `url(${cameraPreview || preview})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  left: "50%",
                  transform: "translateX(-50%) translateY(50%)",
                }}
              ></div>
            </div>

            {/* Name and Email */}
            <div className="flex flex-col items-center p-4 mt-20"> {/* Ensuring margin to avoid overlap */}
              <h1 className="rounded-lg p-2 text-[3rem] text-center">{user.name}</h1>
              <p className="p-2 text-[1.5rem] text-center mb-3 ">{user.email}</p>
              <button
                className="p-2 w-auto text-auto bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-3 border-none cursor-pointer"
                onClick={openModal}
              >
                Update
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal remains unchanged */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Update Profile"
        className="bg-gradient-to-l from-blue-300 to-blue-500 border-none p-5 rounded-5 w-auto overflow-auto"
        overlayClassName="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center"
      >
        <div className="flex gap-5">
          <div className="grid items-center justify-center">
            {isCameraOpen && (
              <div>
                <video id="camera" className="w-full h-auto"></video>
                <button
                  className="p-2 w-auto bg-red-500 text-white rounded-3 cursor-pointer mt-2"
                  onClick={capturePhoto}
                >
                  Capture Photo
                </button>
              </div>
            )}
            {cameraPreview ? (
              <img
                src={cameraPreview}
                alt="Captured Preview"
                className="mt-3 ml-5 w-40 h-40 items-center object-cover rounded-full"
              />
            ) : preview ? (
              <img
                src={preview}
                alt="Profile Preview"
                className="mt-3 ml-5 w-40 h-40 items-center object-cover rounded-full"
              />
            ) : null}
            <h2 className="text-[2rem] font-bold">Update Profile</h2>
          </div>
          <div className="flex flex-col p-4 gap-3 border-l-4 border-white ">
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

              <label className="text-sm font-semibold" htmlFor="email">
                Email:
              </label>
              <input
                id="email"
                type="email"
                className="border border-gray-300 rounded-3 p-2 mb-2"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <label
                className="text-sm font-semibold p-2"
                htmlFor="profilePicture"
              >
                Profile Picture:
              </label>
              <input
                id="profilePicture"
                type="file"
                accept="image/*"
                className="border border-gray-400 rounded-3 p-2"
                onChange={handleFileChange}
              />

              {!isCameraOpen && (
                <button
                  className="p-2 w-auto bg-blue-500 text-white rounded-3 cursor-pointer mt-4"
                  onClick={startCamera}
                >
                  Take a Photo
                </button>
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
    </>
  );
};

export default Profile;