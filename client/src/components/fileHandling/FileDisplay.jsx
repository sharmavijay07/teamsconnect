import React, { useContext, useEffect,useState } from 'react';
import { AuthContext } from '@/context/AuthContext';
import axios from 'axios';
import { ChatContext } from '@/context/ChatContext';

const FileDisplay = ({chatId}) => {
  const { file } = useContext(AuthContext);
  const [allMessages,setAllMessages] = useState()
  const {currentChat} = useContext(ChatContext)

  // Function to construct the full URL for the file
  const getFileUrl = (filePath) => {
    const formattedPath = filePath.replace(/\\/g, '/');
    const fullPath = formattedPath.startsWith('uploads/') ? formattedPath.replace('uploads/', '') : formattedPath;
    return `http://localhost:4500/uploads/${fullPath}`;
  };

  useEffect(() => {
    axios.get(`http://localhost:4500/api/upload/allMessages/${chatId}`)
    .then((resp) => {
      alert(chatId)
      console.log("Got all messages with files",resp)
      setAllMessages(resp.data.result)
      // alert("got all messages")
    })
    .catch((err) => {
      console.warn("Error of allMessages",err)
    })
  },[])

  return (
    <>
     <div>
      <h2>Uploaded Files</h2>
      <div className="file-list">
        {file.map((filedemo, index) => (
          <div key={index} className="file-item">
            {/* Displaying image files */}
            {filedemo.filePath.endsWith('.png') || filedemo.filePath.endsWith('.jpg') || filedemo.filePath.endsWith('.gif') ? (
              <img
                src={getFileUrl(filedemo.filePath)}
                alt={`file-${index}`}
                style={{ width: '150px', height: '150px', background:'none' }}
              />
            ) : (
              // Download link for non-image files
              <a href={getFileUrl(filedemo.filePath)} download>
                Download {filedemo.filePath.split('/').pop()}
              </a>
            )}
            <p>Uploaded At: {new Date(filedemo.uploadedAt).toLocaleString()}</p>
          </div>
        ))}
      </div>
    </div>

    <div className='flex flex-col'>
      <h1>all messages</h1>
      <div>
      {allMessages?.map((test, index) => (
          <div key={index} className="file-item">
            {/* Displaying image files */}
            {test.filePath.endsWith('.png') || test.filePath.endsWith('.jpg') || test.filePath.endsWith('.gif') ? (
              <img
                src={getFileUrl(test.filePath)}
                alt={`file-${index}`}
                style={{ width: '150px', height: '150px'  }}
              />
            ) : (
              // Download link for non-image files
              <a href={getFileUrl(test.filePath)} download>
                Download {test.filePath.split('/').pop()}
              </a>
            )}
            <p>Uploaded At: {new Date(test.uploadedAt).toLocaleString()}</p>
            <h4>{test.text}</h4>
          </div>
      
        ))}
      </div>
    </div>
    </>

  );
};

export default FileDisplay;
