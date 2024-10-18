const express = require('express');
const path = require('path');
const { exec } = require('child_process');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors()); // Enable all CORS requests
app.use(express.static(path.join(__dirname, '../client/build'))); // Serve the React app

// API route for speed test
app.get('/api/speed', (req, res) => {
    console.log("Received request for speed test");
    exec(`fast --upload --json`, (error, stdout, stderr) => {
        if (error) {
            console.error(`error: ${error.message}`);
            return res.send({ error: error.message });
        }
        if (stderr) {
            console.error(`stderr: ${stderr}`);
            return res.send({ error: stderr });
        }

        try {
            const data = JSON.parse(stdout);
            res.send({
                ping: data.latency,
                download: data.downloadSpeed,
                upload: data.uploadSpeed,
                bufferBloat: data.bufferBloat,
                location: data.userLocation,
                ip: data.userIp
            });
        } catch (parseError) {
            console.error(`parseError: ${parseError.message}`);
            res.send({ error: parseError.message });
        }
    });
});

// Serve the React app for any unknown route
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});