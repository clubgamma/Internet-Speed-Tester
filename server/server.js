const express = require('express');
const path = require('path');
const { exec } = require('child_process');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;
const Joi = require('joi');
const rateLimit = require('express-rate-limit');

app.use(cors()); // Enable all CORS requests

// Rate limiting: limit each IP to 100 requests per 10 minutes
const limiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 100,
    message: "Too many requests from this IP, please try again later."
});

app.use("/speed", limiter);

const schema = Joi.object({
    downloadSpeed: Joi.number().min(0).required(),
    uploadSpeed: Joi.number().min(0).required(),
    latency: Joi.number().min(0).required(),
    bufferBloat: Joi.number().min(0).required(),
    userLocation: Joi.string().required(),
    userIp: Joi.string().ip().required()
});

app.get('/api/hello',(req,res)=>{
    res.send("Hello!!");
});


// API route for speed test
app.get('/api/speed', (req, res) => {
    console.log("Received request for speed test");
    exec(`fast --upload --json`, (error, stdout, stderr) => {
        if (error || stderr) {
            console.error(`Error: ${error?.message || stderr}`);
            // Send a generic error message to the client
            return res.status(500).send({ error: "An error occurred. Please try again later." });
        }

        try {
            const data = JSON.parse(stdout);
            delete data.downloaded;
            delete data.uploaded;
            console.log(data);
            const validation = schema.validate(data); // Validate the parsed data
            if (validation.error) {
                throw new Error(validation.error.details[0].message); // Throw error if validation fails
            }
            const { downloadSpeed, uploadSpeed, latency, bufferBloat, userLocation, userIp } = validation.value;
            res.send({
                ping: latency,
                download: downloadSpeed,
                upload: uploadSpeed,
                bufferBloat,
                location: userLocation,
                ip: userIp
            });
        } catch (parseError) {
            console.error(`Parsing Error: ${parseError.message}`);
            res.status(500).send({ error: "Failed to process the speed test data. Please try again later." });
        }
    });
});



app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
});