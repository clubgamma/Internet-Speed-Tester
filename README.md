# Internet Speed Test Web Application

This is a simple web application built using Node.js and Express to test the internet speed of the user. The application uses the `fast-cli` command to retrieve download, upload speeds, latency, buffer bloat, user location, and IP.

## Features
- Test internet download speed.
- Test internet upload speed.
- Get ping (latency) information.
- Measure buffer bloat.
- Display user's location and IP.

## Installation

1. Clone this repository:
   ```bash
   git clone https://github.com/your-username/internet-speed-test.git

2. Navigate into the project directory:
   ```bash
   cd internet-speed-test
3. Install the required dependencies:
    ```bash
    npm install
    ```
## Usage

1. Start the server:
    ```bash
    npm start
    ```

2. Open your browser and navigate to:
   ```bash
   http://localhost:3000
   ```   
3. To perform a speed test, go to:   
   ```bash
    http://localhost:3000/speed
   ```
## Requirements
- Node.js (v12+)
- ```fast-cli ``` installed globally:

    ```bash
    npm install -g fast-cli
