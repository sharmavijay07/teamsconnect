import React, { useState } from 'react';

const AddGameForm = () => {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append('imagefile', selectedFile);
    

    fetch('/addgame', {
      method: 'POST',
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Success:', data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  return (
    <form onSubmit={handleSubmit} encType="multipart/form-data">
      <div className="input-group mb-3">
        <div className="input-group-prepend">
          <span className="input-group-text" id="inputGroupFileAddon01">Upload</span>
        </div>
        <div className="custom-file">
          <input
            type="file"
            className="custom-file-input"
            id="imageInput"
            aria-describedby="inputGroupFileAddon01"
            onChange={handleFileChange}
          />
          <label className="custom-file-label" htmlFor="imageInput">
            {selectedFile ? selectedFile.name : 'Image file'}
          </label>
        </div>
      </div>

      <button type="submit" className="btn btn-primary">Submit</button>
    </form>
  );
};

export default AddGameForm;
