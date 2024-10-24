Internet Speed Tester

This project is an Internet Speed Testing tool built with React on the frontend and Node.js on the backend. It uses the fast-cli tool to check internet speeds (download, upload, ping) and provides actionable insights.

Features

	•	Display download and upload speed.
	•	Display ping and location.
	•	API to retrieve speed test results via fast-cli.

Installation

1. Forking & Cloning the Project

Fork the Repository

	1.	Go to the project’s repository on GitHub.
	2.	Click the Fork button in the top-right corner of the repository page.

Clone the Repository

After forking the project, follow these steps to clone it to your local machine:

	1.	Copy the repository URL from your forked repository.
	2.	Run the following command in your terminal:

    git clone https://github.com/YOUR-USERNAME/internet-speed-tester.git

    2. Navigate to the Project Folder

After cloning, navigate to the project folder:

    cd internet-speed-tester

3. Install Dependencies

The project is divided into two main folders: client for the frontend and server for the backend. You will need to install dependencies for both parts.

Frontend (React)

	1.	Navigate to the client folder:

    cd client

	2.	Install dependencies:

    npm install

Backend (Node.js)

	1.	Navigate to the server folder:

    cd server

	2.	Install dependencies:

    npm install

4. Setting Up Environment Variables

Create a .env file in the server folder and add the following:

    REACT_APP_API_URL=http://localhost:3000

File Structure

The project is divided into two main folders:

internet-speed-tester/
├── client/            # React Frontend
│   ├── public/        # Public folder for HTML and static assets
│   ├── src/           # Main React code
│       ├── App.js     # React app code
│       └── ...        # Other components and assets
├── server/            # Node.js Backend
│   ├── server.js      # Main server code
│   └── ...            # Other backend files
└── README.md          # Project documentation

Usage

Running the Frontend

	1.	Navigate to the client folder:

    cd client

	2.	Start the development server:

    npm start

Running the Backend

	1.	Navigate to the server folder:

    cd server

	2.	Start the backend server:

    node server.js

API Endpoint

	•	GET /api/speed: This endpoint returns the internet speed data (download, upload, ping).

IMP: If the website doesnt open on the local host then try running the server first and then the frontend.