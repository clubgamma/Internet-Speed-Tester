const express = require('express');
const cors = require('cors');

const app = express();
require('dotenv').config();

// Configure CORS for your specific domain in production
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? [process.env.ALLOWED_ORIGIN]  // Your frontend URL in production
    : 'http://localhost:5173',      // Default Vite development port
  methods: ['GET', 'POST'],
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// For download speed test
app.get('/download', (req, res) => {
    // Generate random data instead of reading from file (better for Vercel)
    const size = 2 * 1024 * 1024; // 2MB of data
    const buffer = Buffer.alloc(size);
    for (let i = 0; i < size; i++) {
        buffer[i] = Math.floor(Math.random() * 256);
    }
    res.set('Content-Type', 'application/octet-stream');
    res.send(buffer);
});

// For upload speed test
app.post('/upload', express.raw({ type: 'application/octet-stream', limit: '50mb' }), (req, res) => {
    res.sendStatus(200);
});

// For Vercel, we need to export the app as a module
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
}

module.exports = app;