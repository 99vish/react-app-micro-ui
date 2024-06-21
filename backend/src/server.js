const express = require('express');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

// Recursive function to list all files in a directory and its subdirectories
const listFilesRecursive = (dir) => {
    let fileList = [];
  
    const files = fs.readdirSync(dir);
    files.forEach(file => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      if (stat.isDirectory()) {
        fileList = fileList.concat(listFilesRecursive(filePath)); // Recursively process subdirectories
      } else {
        const content = fs.readFileSync(filePath, 'utf-8');
        fileList.push({
          fileName: file,
          filePath: filePath,
          fileType: path.extname(file).substring(1), // File extension as type
          fileContent: content
        });
      }
    });
  
    return fileList;
};

// Endpoint to list JSON files in a given directory (including subdirectories)
app.post('/api/list-files', (req, res) => {
  const filePath = req.body.filePath;

  if (fs.existsSync(filePath)) {
    try {
      const fileData = listFilesRecursive(filePath);
      res.json(fileData);
    } catch (error) {
      console.error('Error reading files:', error);
      res.status(500).json({ error: 'Failed to read files' });
    }
  } else {
    res.status(400).json({ error: 'Invalid file path' });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

