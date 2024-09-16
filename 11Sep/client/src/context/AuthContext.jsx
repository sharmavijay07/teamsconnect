import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { baseUrl, postRequest } from "../utils/services";
import axios from "axios";
import { ChatContext } from "./ChatContext"; // Ensure this is being correctly imported

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Check if ChatContext exists before trying to destructure messages
  const chatContext = useContext(ChatContext);
  const messages = chatContext?.messages || []; // Safely access messages, use an empty array as fallback

  const [registerError, setRegisterError] = useState(null);
  const [isRegisterLoading, setRegisterLoading] = useState(false);
  const [registerInfo, setRegisterInfo] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loginError, setLoginError] = useState(null);
  const [isLoginLoading, setLoginLoading] = useState(false);
  const [loginInfo, setLoginInfo] = useState({
    email: "",
    password: "",
  });

  // File Handling
  const [file, setFile] = useState([]);
  const [fileChatId, setFileChatId] = useState(null);

  useEffect(() => {
    // Ensure messages is an array before mapping over it
    if (Array.isArray(messages)) {
      messages.map((msg) => {
        setFileChatId(msg?.chatId);
      });
    }

    if (fileChatId) {
     axios
        .get(`http://localhost:4500/api/upload/file/${fileChatId}`)
        .then((resp) => {
          console.log("Response:", resp);

          if (resp.data && resp.data.file) {
            console.log("Files:", resp.data.file);
            setFile(resp.data.file); // Set the 'file' array to state
          } else {
            console.error("No file data found in the response");
          }
        })
        .catch((err) => {
          console.error("you got error:", err);
        });
    }
  }, [fileChatId, messages]);

  useEffect(() => {
    const user = localStorage.getItem("User");
    setUser(JSON.parse(user));
  }, []);

  const updateRegisterInfo = useCallback((info) => {
    setRegisterInfo(info);
  }, []);

  const registerUser = useCallback(
    async (e) => {
      e.preventDefault();
      setRegisterLoading(true);
      setRegisterError(null);
      const response = await postRequest(
        `${baseUrl}/users/register`,
        JSON.stringify(registerInfo)
      );
      setRegisterLoading(false);
      if (response.error) {
        setRegisterError(response);
      }
      localStorage.setItem("User", JSON.stringify(response));
      setUser(response);
    },
    [registerInfo]
  );

  const updateLoginInfo = useCallback((info) => {
    setLoginInfo(info);
  }, []);

  const loginUser = useCallback(
    async (e) => {
      e.preventDefault();
      setLoginLoading(true);
      setLoginError(null);
      const response = await postRequest(
        `${baseUrl}/users/login`,
        JSON.stringify(loginInfo)
      );
      setLoginLoading(false);
      if (response.error) {
        return setLoginError(response);
      }
      localStorage.setItem("User", JSON.stringify(response));
      setUser(response);
    },
    [loginInfo]
  );

  const logoutUser = useCallback(() => {
    localStorage.removeItem("User");
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        registerInfo,
        updateRegisterInfo,
        registerUser,
        registerError,
        isRegisterLoading,
        logoutUser,
        updateLoginInfo,
        loginUser,
        loginError,
        loginInfo,
        isLoginLoading,
        fileChatId,
        setFileChatId,
        file,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
