import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { AuthContext } from '@/context/AuthContext';

const FileDisplay = () => {
  const [files, setFiles] = useState([]);
  const {file} = useContext(AuthContext)


  const getFileUrl = (filePath) => {
    const fullPath = filePath.replace(/\\/g, '/'); // Correct file path formatting
    console.log("filepath in filedisplay",fullPath)
    return `http://localhost:4500/uploads/${fullPath}`; // Correct URL path formatting
  };

  return (
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
                style={{ width: '150px', height: '150px' }}
              />
            ) : (
              <a href={getFileUrl(filedemo.filePath)} download>
                Download {file.filePath.split('\\').pop()}
              </a>
            )}
            <p>Uploaded At: {new Date(filedemo.uploadedAt).toLocaleString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FileDisplay;
