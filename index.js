const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const { exec } = require('child_process');

app.set('view engine', 'ejs');
app.use(express.static("views"));

app.get("/", (req, res) => {
    res.render('index', { ping: "", download: "", upload: "", latency: "", bufferBloat: "", location: "", ip: "" });
});

app.get("/speed", (req, res) => {
    exec(`fast --upload --json`, (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            return res.send({ error: error.message });
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
            return res.send({ error: stderr });
        }

        try {
            const data = JSON.parse(stdout);
            const { downloadSpeed, uploadSpeed, latency, bufferBloat, userLocation, userIp } = data;

            res.send({
                ping: latency,
                download: downloadSpeed,
                upload: uploadSpeed,
                bufferBloat,
                location: userLocation,
                ip: userIp
            });
        } catch (parseError) {
            console.log(`parseError: ${parseError.message}`);
            res.send({ error: parseError.message });
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
