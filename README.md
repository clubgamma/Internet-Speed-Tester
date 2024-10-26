# Internet Speed Tester 🚀

A modern web application for testing internet speeds built with React and Node.js. Get real-time measurements of your download speed, upload speed, and ping with actionable insights.

## Features ✨

- Real-time download and upload speed testing
- Ping and location information
- Clean, intuitive user interface
- RESTful API for speed test results

## Prerequisites 📋

Before you begin, ensure you have installed:
- [Node.js](https://nodejs.org/) (v14 or higher)
- [npm](https://www.npmjs.com/) (usually comes with Node.js)
- [Git](https://git-scm.com/)

## Installation 🛠️

### 1. Fork & Clone the Repository

First, fork this repository, then clone your forked version:

```bash
git clone https://github.com/YOUR-USERNAME/internet-speed-tester.git
cd internet-speed-tester
```

### 2. Install Dependencies

You'll need to install dependencies for both the frontend and backend:

#### Frontend (React)
```bash
cd client
npm install
```

#### Backend (Node.js)
```bash
cd ../server
npm install
```

### 3. Environment Setup

Create a `.env` file in the server directory:

```env
BACK_END_URL=http://localhost:3000
```

## Project Structure 📁

```
internet-speed-tester/
├── client/            # React Frontend
│   ├── public/        # Public assets
│   ├── src/          # Source files
│       ├── App.jsx   # Main React component
│       └── ...       # Other components
├── server/           # Node.js Backend
│   ├── index.js     # Server entry point
│   └── ...          # Other server files
└── README.md        # Project documentation
```

## Running the Application 🚀

### Start the Backend Server

```bash
cd server
npm run dev
```

### Start the Frontend Development Server

```bash
cd client
npm run dev
```

> **Important Note**: If you experience issues accessing the website, try starting the backend server before launching the frontend.

Returns internet speed test results including:
- Download speed
- Upload speed
- Latency

## Contributing 🤝

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License 📝

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments 🙏

- [React](https://reactjs.org/) for the frontend framework
- [Node.js](https://nodejs.org/) for the backend runtime

## Support 💬

If you encounter any issues or have questions, please file an issue in the GitHub repository.
