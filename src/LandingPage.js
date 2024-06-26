import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css'; // Import your CSS file

const LandingPage = () => {
  const [filePath, setFilePath] = useState("C:\\Automation\\wtg-playwright-json-execution\\src\\inputs");
  const [files, setFiles] = useState([]);
  const [jsonFiles, setJsonFiles] = useState([]);
  const navigate = useNavigate();

  const fetchJsonFiles = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/list-files', { filePath });
      const allFiles = response.data;
      setFiles(allFiles);
      const jsonFiles = allFiles.filter(file => file.fileType === 'json');
      const filePaths = jsonFiles.map(file => file.filePath);
      console.log(filePaths);
      setJsonFiles(jsonFiles);
    } catch (error) {
      console.error('Error fetching JSON files:', error);
      alert('Invalid file path');
    }
  };

  console.log(files);

  const handleEditFile = (file) => {
    navigate('/add-steps', { state: { fileData: file, allFiles: files } });
  };

  return (
    <div className="landing-page">
      <h1 className="heading">Landing Page</h1>
      <div className="input-container">
        <input
          type="text"
          value={filePath}
          onChange={(e) => setFilePath(e.target.value)}
          className="file-path-input"
          placeholder="Enter file path"
        />
        <button className="fetch-button" onClick={fetchJsonFiles}>
          Fetch JSON Files
        </button>
      </div>

      <div className="json-file-tabs">
        {jsonFiles.length > 0 &&
          jsonFiles.map((file) => (
            <div key={file.fileName} className="json-file-tab">
              <span className="file-name">{file.fileName}</span>
              <button className="edit-button" onClick={() => handleEditFile(file)}>
                Edit
              </button>
            </div>
          ))}
      </div>
    </div>
  );
};

export default LandingPage;
