<div align="center">

# ⚡ Zero Ping Uptime Monitor

### Keep Your Services Alive 24/7

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green.svg)](https://www.mongodb.com/)
[![React](https://img.shields.io/badge/React-18-blue.svg)](https://reactjs.org/)

A full-stack uptime monitoring service that automatically pings your services to keep them alive. Built with modern web technologies for maximum reliability.

[Features](#-features) • [Tech Stack](#-tech-stack) • [Installation](#-installation) • [Deployment](#-deployment) • [API](#-api-endpoints)

</div>

---

## ✨ Features

- 🌐 **Unlimited Services** - Add as many services as you need
- ⏰ **Custom Intervals** - Configure ping intervals from 1-30 minutes
- 📊 **Real-time Monitoring** - Live status updates every 10 seconds
- ⚡ **Response Time Tracking** - Monitor service performance
- 📈 **Uptime Percentage** - Track service reliability
- 🔄 **Auto-Ping System** - Automatic pinging every minute
- ⏸️ **Pause/Resume** - Control services without deletion
- 💾 **MongoDB Integration** - Persistent data storage
- 🎨 **Beautiful UI** - Modern, responsive design with dark mode
- 📱 **Mobile Friendly** - Works seamlessly on all devices

## 🛠️ Tech Stack

### Frontend
<div align="center">

| Technology | Purpose |
|------------|---------|
| ![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black) | UI Framework |
| ![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=for-the-badge&logo=vite&logoColor=white) | Build Tool |
| ![TailwindCSS](https://img.shields.io/badge/Tailwind-3-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white) | Styling |
| ![Axios](https://img.shields.io/badge/Axios-1.6-5A29E4?style=for-the-badge&logo=axios&logoColor=white) | HTTP Client |
| ![Lucide](https://img.shields.io/badge/Lucide-Icons-F56565?style=for-the-badge) | Icons |

</div>

### Backend
<div align="center">

| Technology | Purpose |
|------------|---------|
| ![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js&logoColor=white) | Runtime |
| ![Express](https://img.shields.io/badge/Express-4-000000?style=for-the-badge&logo=express&logoColor=white) | Web Framework |
| ![MongoDB](https://img.shields.io/badge/MongoDB-8-47A248?style=for-the-badge&logo=mongodb&logoColor=white) | Database |
| ![Node-Cron](https://img.shields.io/badge/Node--Cron-3-E34F26?style=for-the-badge) | Task Scheduler |

</div>

## 📁 Project Structure

```
uptime-monitor/
├── 📂 backend/          # Node.js/Express API
│   ├── src/
│   │   ├── models/      # MongoDB models
│   │   ├── routes/      # API routes
│   │   ├── jobs/        # Cron jobs for pinging
│   │   └── server.js    # Main server file
│   └── package.json
├── 📂 frontend/         # React application
│   ├── src/
│   │   ├── components/
│   │   └── App.jsx
│   └── package.json
└── 📄 README.md
```

## 🚀 Installation

### Prerequisites

- ✅ Node.js 18+ installed
- ✅ MongoDB Atlas account (or local MongoDB)
- ✅ Git

### Quick Start

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd uptime-monitor
```

2. **Backend Setup**
```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory:
```env
MONGODB_URI=your_mongodb_connection_string_here
PORT=5000
NODE_ENV=production
```

3. **Start the Application**

From the root directory:
```bash
npm run start
```

This will:
- ✅ Start the backend server on port 5000
- ✅ Serve the pre-built frontend files
- ✅ Your app will be available at `http://localhost:5000`

**For development with hot-reload:**
```bash
npm run dev
```

## 🌐 Deployment

### Deploy to Replit (Recommended)

This application is optimized for Replit deployment as a single web service.

#### Option 1: Using render.yaml (Recommended)

1. 📤 Push your code to GitHub
2. 🔗 Go to [Render Dashboard](https://dashboard.render.com/)
3. ➕ Click "New +" → "Blueprint"
4. 🔌 Connect your GitHub repository
5. 🎯 Render will auto-detect the `render.yaml` file
6. 🔐 Add environment variables:
   - `MONGODB_URI`: Your MongoDB Atlas connection string
7. ✅ Click "Apply" to deploy

#### Option 2: Manual Deployment

1. 📤 Push your code to GitHub
2. 🔗 Go to [Render Dashboard](https://dashboard.render.com/)
3. ➕ Click "New +" → "Web Service"
4. ⚙️ Configure:
   - **Name:** zero-ping-uptime-monitor
   - **Environment:** Node
   - **Build Command:** 
     ```bash
     npm install && cd frontend && npm install && npm run build && cd ../backend && npm install
     ```
   - **Start Command:** 
     ```bash
     cd backend && node src/server.js
     ```
   - **Environment Variables:**
     - `MONGODB_URI`: Your MongoDB Atlas connection string
     - `NODE_ENV`: production
     - `PORT`: 10000
5. 🚀 Click "Create Web Service"
6. ⏳ Wait for deployment to complete
7. 🎉 Your app will be live!

### How It Works

- The backend Express server serves both:
  - 🔌 API endpoints at `/api/*`
  - 🎨 Static frontend files from `/` (built React app)
- ✅ All requests handled by a single service on one domain
- 🚫 No CORS issues or separate domain management needed

## 🔐 Environment Variables

### Development (Local)

**Backend (.env):**
```env
MONGODB_URI=your_mongodb_connection_string
PORT=5000
NODE_ENV=production
```

### Production (Render)

Set these in your Render dashboard under Environment tab:
- `MONGODB_URI`: Your MongoDB Atlas connection string
- `NODE_ENV`: production
- `PORT`: 10000 (or your preferred port)

## 📡 API Endpoints

### Services

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/services` | Get all services |
| `GET` | `/api/services/:id` | Get single service |
| `POST` | `/api/services` | Create new service |
| `PUT` | `/api/services/:id` | Update service |
| `DELETE` | `/api/services/:id` | Delete service |
| `GET` | `/api/services/:id/stats` | Get service statistics |

### Health Check

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/health` | API health status |

### Example: Create Service
```json
POST /api/services
{
  "name": "My Service",
  "url": "https://example.com",
  "interval": 5
}
```

## 💡 How It Works

1. **📝 Add Services** - Enter service name, URL, and ping interval
2. **⏰ Automatic Pinging** - Cron job runs every minute checking which services need pinging
3. **📊 Status Updates** - Each ping updates status (online/offline), response time, and uptime
4. **🔄 Real-time Dashboard** - Frontend auto-refreshes every 10 seconds
5. **💾 Persistent Storage** - All data stored in MongoDB for persistence

## 💡 Usage Tips

- ⏱️ Use intervals of 5-15 minutes for most services to avoid rate limiting
- ⏸️ Services can be paused/resumed without deleting them
- 📈 System tracks last 100 pings for each service
- 🐌 Monitor response times to identify slow services

## 🐛 Troubleshooting

### Backend won't start
- ✅ Check MongoDB connection string is correct
- ✅ Ensure MongoDB Atlas allows connections from your IP
- ✅ Verify all dependencies are installed: `npm install`

### Frontend can't connect to backend
- ✅ Check `VITE_API_URL` in frontend `.env`
- ✅ Ensure backend is running
- ✅ Check CORS settings in backend

### Services not pinging
- ✅ Check backend logs for errors
- ✅ Verify the service URL is accessible
- ✅ Ensure cron job is running (check console logs)

## 🤝 Contributing

Feel free to submit issues and pull requests!

## 📄 License

MIT License - see the [LICENSE](LICENSE) file for details

## 👨‍💻 Developer

<div align="center">

**Built with ❤️ by [Mr Frank (Darrell Mucheri)](https://github.com/mrfr8nk)**

[![GitHub](https://img.shields.io/badge/GitHub-mrfr8nk-181717?style=for-the-badge&logo=github)](https://github.com/mrfr8nk)
[![WhatsApp](https://img.shields.io/badge/WhatsApp-+263719647303-25D366?style=for-the-badge&logo=whatsapp&logoColor=white)](https://wa.me/263719647303)
[![Email](https://img.shields.io/badge/Email-darrelmucheri@gmail.com-D14836?style=for-the-badge&logo=gmail&logoColor=white)](mailto:darrelmucheri@gmail.com)

</div>

## 💬 Support

For issues and questions, please open a GitHub issue or contact the developer directly.

---

<div align="center">

**⭐ Star this repo if you find it helpful!**

Made with 💙 using React, Node.js & MongoDB

</div>