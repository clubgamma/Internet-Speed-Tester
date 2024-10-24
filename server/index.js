const WebSocket = require('ws');
const crypto = require('crypto');

const wss = new WebSocket.Server({ port: 8080 });

function generateTestData(sizeInBytes) {
    return crypto.randomBytes(sizeInBytes);
}

function calculateSpeed(bytes, milliseconds) {
    const bits = bytes * 8;
    const megabits = bits / 1000000;
    return (megabits / (milliseconds / 1000)).toFixed(2); // Convert milliseconds to seconds
}

async function measureDownloadSpeed(ws) {
    const TEST_SIZE = 30 * 1024 * 1024; // 30 MB
    const testData = generateTestData(TEST_SIZE);
    const start = Date.now();

    return new Promise((resolve, reject) => {
        ws.send(testData, { binary: true }, (error) => {
            if (error) {
                console.error("Error sending data for download speed test:", error);
                reject(error);
            } else {
                ws.once('message', (message) => {
                    const duration = Date.now() - start;
                    const speedMbps = calculateSpeed(TEST_SIZE, duration);
                    resolve(speedMbps);
                });
            }
        });
    });
}

async function measureUploadSpeed(ws) {
    return new Promise((resolve, reject) => {
        const TEST_SIZE = 30 * 1024 * 1024; // 30 MB
        ws.send(JSON.stringify({ type: 'upload-test-start', size: TEST_SIZE }));

        let receivedSize = 0;
        const start = Date.now();

        const uploadHandler = (message) => {
            if (message instanceof Buffer) {
                receivedSize += message.length;

                if (receivedSize >= TEST_SIZE) {
                    const duration = Date.now() - start;
                    const speedMbps = calculateSpeed(receivedSize, duration);
                    ws.removeListener('message', uploadHandler);
                    resolve(speedMbps);
                }
            } else {
                console.warn("Unexpected message received during upload test:", message);
            }
        };

        ws.on('message', uploadHandler);
    });
}

wss.on('connection', (ws) => {
    console.log('Client connected');

    ws.on('message', async (message) => {
        try {
            const parsedMessage = JSON.parse(message);
            if (parsedMessage.action === 'startTest') {
                console.log('Starting speed test...');
                
                const uploadSpeed = await measureUploadSpeed(ws);
                console.log(`Upload Speed: ${uploadSpeed} Mbps`);
                ws.send(JSON.stringify({ type: 'upload', value: uploadSpeed }));

                const downloadSpeed = await measureDownloadSpeed(ws);
                console.log(`Download Speed: ${downloadSpeed} Mbps`);
                ws.send(JSON.stringify({ type: 'download', value: downloadSpeed }));

                // Optionally, terminate the connection after testing
                ws.terminate(); // Close the connection after the tests
            }
        } catch (error) {
            console.error('Error processing message:', error);
        }
    });

    ws.on('error', (error) => {
        console.error('WebSocket error:', error);
    });

    ws.on('close', () => {
        console.log('Client disconnected');
    });
});

console.log('WebSocket server is running on ws://localhost:8080');
