const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const { exec } = require('child_process');
const Joi = require('joi');
const rateLimit = require('express-rate-limit');

app.set('view engine', 'ejs');
app.use(express.static("views"));

// Rate limiting: limit each IP to 100 requests per 10 minutes
const limiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 100,
    message: "Too many requests from this IP, please try again later."
});

// Apply rate limiting to /speed route
app.use("/speed", limiter);

// Validation schema for speed test data
const schema = Joi.object({
    downloadSpeed: Joi.number().min(0).required(),
    uploadSpeed: Joi.number().min(0).required(),
    latency: Joi.number().min(0).required(),
    bufferBloat: Joi.number().min(0).required(),
    userLocation: Joi.string().required(),
    userIp: Joi.string().ip().required()
});

app.get("/", (req, res) => {
    res.render('index', { ping: "", download: "", upload: "", latency: "", bufferBloat: "", location: "", ip: "" });
});

app.get("/speed", (req, res) => {
    exec(`fast --upload --json`, (error, stdout, stderr) => {
        if (error || stderr) {
            console.error(`Error: ${error?.message || stderr}`);
            // Send a generic error message to the client
            return res.status(500).send({ error: "An error occurred. Please try again later." });
        }

        try {
            const data = JSON.parse(stdout); // Parse the output
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
    console.log(`Server is running on port ${PORT}`);
});
