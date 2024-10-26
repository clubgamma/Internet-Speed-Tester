const express = require('express');
const fs = require('fs');
const path = require('path');
const cors=require('cors');

const app = express();

app.use(cors());
const PORT = 3000;

app.get('/download', (req, res) => {
    const filePath = path.join(__dirname, 'testfile.dat');
    res.download(filePath);
});

app.post('/upload', express.raw({ type: 'application/octet-stream', limit: '50mb' }), (req, res) => {
    console.log(`Uploaded ${req.body.length} bytes`);
    res.sendStatus(200);
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
