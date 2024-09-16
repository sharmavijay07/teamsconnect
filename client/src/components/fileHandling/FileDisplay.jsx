import React, { useContext } from 'react';
import { AuthContext } from '@/context/AuthContext';

const FileDisplay = () => {
  const { file } = useContext(AuthContext);

  // Function to construct the full URL for the file
  const getFileUrl = (filePath) => {
    // Replace backslashes with forward slashes to ensure correct URL formatting
    const formattedPath = filePath.replace(/\\/g, '/');
    const fullPath = formattedPath.startsWith('uploads/') ? formattedPath.replace('uploads/', '') : formattedPath; // Remove 'uploads/' prefix if present
    console.log("full path http://localhost:4500/uploads", fullPath);
    return `http://localhost:4500/uploads/${fullPath}`; // Construct the full URL for the file
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
                src={getFileUrl(filedemo.filePath)} // Correct URL path
                alt={`file-${index}`}
                style={{ width: '150px', height: '150px' }}
              />
            ) : (
              // Download link for non-image files
              <a href={getFileUrl(filedemo.filePath)} download>
                Download {filedemo.filePath.split('/').pop()} {/* Displaying the filename */}
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
