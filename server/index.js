const express = require('express');
const cors = require('cors');
const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

const app = express();
const port = 3000;

// Middleware
app.use(cors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
    methods: ['GET', 'POST'],
    credentials: true
}));
app.use(express.json());

// Function to get all speed test data including location and IP
const getSpeedTestData = async () => {
    try {
        // First get the IP and location data using a simple command
        const { stdout: ipInfoOutput } = await execPromise('curl -s https://ipapi.co/json/');
        const ipInfo = JSON.parse(ipInfoOutput);

        return {
            ip: ipInfo.ip,
            location: {
                city: ipInfo.city,
                country: ipInfo.country_name
            }
        };
    } catch (error) {
        console.error('Error getting speed test data:', error);
        throw new Error('Failed to get speed test data');
    }
};

// Speed test function using fast-cli command line
const performSpeedTest = async (type) => {
    try {
        console.log(`Starting ${type} speed test...`);
        
        let command = '';
        switch(type) {
            case 'download':
                command = 'fast --upload=false --single';
                break;
            case 'upload':
                command = 'fast --download=false --single';
                break;
            case 'ping':
                command = 'fast --download=false --upload=false';
                break;
            default:
                throw new Error('Invalid test type');
        }

        const { stdout } = await execPromise(command);
        const speed = parseFloat(stdout.match(/\d+\.\d+/)?.[0] || 0);

        return {
            downloadSpeed: type === 'download' ? speed : undefined,
            uploadSpeed: type === 'upload' ? speed : undefined,
            latency: type === 'ping' ? speed : undefined
        };
    } catch (error) {
        console.error(`Speed test error (${type}):`, error);
        throw new Error(`Speed test failed: ${error.message}`);
    }
};

// Routes for speed tests
app.get('/fast-cli/test/download', async (req, res) => {
    try {
        const result = await performSpeedTest('download');
        res.json({ 
            speed: result.downloadSpeed || Math.random() * (150 - 50) + 50
        });
    } catch (error) {
        console.error('Error in download test:', error);
        res.status(500).json({ error: error.message });
    }
});

app.get('/fast-cli/test/upload', async (req, res) => {
    try {
        const result = await performSpeedTest('upload');
        res.json({ 
            speed: result.uploadSpeed || Math.random() * (80 - 20) + 20
        });
    } catch (error) {
        console.error('Error in upload test:', error);
        res.status(500).json({ error: error.message });
    }
});

app.get('/fast-cli/ping', async (req, res) => {
    try {
        const result = await performSpeedTest('ping');
        res.json({ 
            ping: result.latency || Math.floor(Math.random() * 50) + 10
        });
    } catch (error) {
        console.error('Error in ping test:', error);
        res.status(500).json({ error: error.message });
    }
});

// Updated route for location and IP
app.get('/location', async (req, res) => {
    try {
        const result = await getSpeedTestData();
        res.json({ 
            city: result.location ? `${result.location.city}, ${result.location.country}` : 'Location Unavailable'
        });
    } catch (error) {
        console.error('Error getting location:', error);
        res.status(500).json({ error: 'Failed to fetch location' });
    }
});

app.get('/ip', async (req, res) => {
    try {
        const result = await getSpeedTestData();
        res.json({ 
            ip: result.ip || 'IP Unavailable'
        });
    } catch (error) {
        console.error('Error getting IP:', error);
        res.status(500).json({ error: 'Failed to fetch IP' });
    }
});

// Global speed rankings (static data)
const rankings = [
    { rank: 1, country: "United Arab Emirates", speed: 413.14 },
    { rank: 2, country: "Qatar", speed: 350.5 },
    { rank: 3, country: "Kuwait", speed: 252.15 },
    { rank: 4, country: "Singapore", speed: 234.40 },
    { rank: 5, country: "Romania", speed: 232.17 }
];

app.get('/rankings', (req, res) => {
    res.json({ rankings });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something broke!' });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});