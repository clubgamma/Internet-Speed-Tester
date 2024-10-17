const express = require('express');
const path = require('path');
const { exec } = require('child_process');
const app = express();
const PORT = process.env.PORT || 3000;
const cors = require('cors');

app.use(cors()); // Enable all CORS requests

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../src')));

// Speed test route
app.get("/speed", (req, res) => {
    console.log("Received request for speed test");
    exec(`fast --upload --json`, (error, stdout, stderr) => {
        console.log("Executing fast command");
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

// For any other route, serve the React app
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});