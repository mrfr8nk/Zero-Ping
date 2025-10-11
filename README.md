

# Zero Ping Uptime Monitor

A full-stack uptime monitoring service that automatically pings your services to keep them alive. Built with React, Node.js, Express, and MongoDB.

## Features

✅ Add unlimited services with custom URLs
✅ Configurable ping intervals (1-30 minutes)
✅ Real-time status monitoring
✅ Response time tracking
✅ Uptime percentage calculation
✅ Automatic pinging every minute (checks which services need pinging)
✅ Pause/Resume services
✅ MongoDB database integration
✅ RESTful API
✅ Beautiful, responsive UI

## Tech Stack

**Frontend:**
- React 18
- Vite
- TailwindCSS
- Lucide Icons
- Axios

**Backend:**
- Node.js
- Express
- MongoDB (Mongoose)
- Node-Cron
- Axios

## Project Structure

```
uptime-monitor/
├── backend/          # Node.js/Express API
│   ├── src/
│   │   ├── models/   # MongoDB models
│   │   ├── routes/   # API routes
│   │   ├── jobs/     # Cron jobs for pinging
│   │   └── server.js # Main server file
│   └── package.json
├── frontend/         # React application
│   ├── src/
│   │   ├── components/
│   │   └── App.jsx
│   └── package.json
└── README.md
```

## Installation & Setup

### Prerequisites

- Node.js 18+ installed
- MongoDB Atlas account (or local MongoDB)
- Git

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd uptime-monitor
```

### 2. Backend Setup

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

Start the backend server:

```bash
npm start
# or for development with auto-reload
npm run dev
```

The API will be running at `http://localhost:5000`

### 3. Run the Full Stack Application

The app is configured to run as a single service. From the root directory:

```bash
npm run start
```

This will:
1. Start the backend server on port 5000
2. Serve the pre-built frontend files
3. Your app will be available at `http://localhost:5000`

**For development with hot-reload:**
```bash
npm run dev
```

This runs both frontend (port 5000) and backend (port 3000) with auto-reload.

## Deployment to Render (Single Service)

This application is configured to deploy as a **single web service** on Render, with both frontend and backend served from one domain.

### Option 1: Deploy Using render.yaml (Recommended)

1. Push your code to GitHub

2. Go to [Render Dashboard](https://dashboard.render.com/)

3. Click "New +" → "Blueprint"

4. Connect your GitHub repository

5. Render will automatically detect the `render.yaml` file

6. **Important:** Add the MongoDB URI as an environment variable:
   - Click on the service name
   - Go to "Environment" tab
   - Add:
     - `MONGODB_URI`: Your MongoDB Atlas connection string
   
7. Click "Apply" to deploy

### Option 2: Manual Deployment

1. Push your code to GitHub

2. Go to [Render Dashboard](https://dashboard.render.com/)

3. Click "New +" → "Web Service"

4. Connect your GitHub repository

5. Configure:
   - **Name:** zero-ping-uptime-monitor
   - **Environment:** Node
   - **Build Command:** `npm install && cd frontend && npm install && npm run build && cd ../backend && npm install`
   - **Start Command:** `cd backend && node src/server.js`
   - **Environment Variables:**
     - `MONGODB_URI`: Your MongoDB Atlas connection string
     - `NODE_ENV`: production
     - `PORT`: 10000

6. Click "Create Web Service"

7. Wait for deployment to complete

8. Your app will be available at: `https://your-service-name.onrender.com`

### How It Works

- The backend Express server serves both:
  - API endpoints at `/api/*`
  - Static frontend files from `/` (built React app)
  
- All requests are handled by a single service on one domain
- No CORS issues or separate domain management needed

## Environment Variables

### Development (Local)

**Backend (.env):**
```env
MONGODB_URI=your_mongodb_connection_string
PORT=5000
NODE_ENV=production
```

**Frontend (.env):**
Not required for single-domain deployment. The frontend automatically uses `/api` for API requests.

### Production (Render)

Set these in your Render dashboard under Environment tab:
- `MONGODB_URI`: Your MongoDB Atlas connection string
- `NODE_ENV`: production
- `PORT`: 10000 (or your preferred port)

## API Endpoints

### Services

- `GET /api/services` - Get all services
- `GET /api/services/:id` - Get single service
- `POST /api/services` - Create new service
  ```json
  {
    "name": "My Service",
    "url": "https://example.com",
    "interval": 5
  }
  ```
- `PUT /api/services/:id` - Update service
- `DELETE /api/services/:id` - Delete service
- `GET /api/services/:id/stats` - Get service statistics

### Health Check

- `GET /api/health` - API health status

## How It Works

1. **Add Services**: Enter service name, URL, and ping interval
2. **Automatic Pinging**: A cron job runs every minute checking which services need to be pinged based on their interval
3. **Status Updates**: Each ping updates the service status (online/offline), response time, and uptime percentage
4. **Real-time Dashboard**: The frontend auto-refreshes every 10 seconds to show latest status
5. **Persistent Storage**: All data is stored in MongoDB for persistence across restarts

## Usage Tips

- Use intervals of 5-15 minutes for most services to avoid rate limiting
- Services can be paused/resumed without deleting them
- The system tracks last 100 pings for each service
- Monitor the response times to identify slow services

## Troubleshooting

### Backend won't start
- Check MongoDB connection string is correct
- Ensure MongoDB Atlas allows connections from your IP
- Verify all dependencies are installed: `npm install`

### Frontend can't connect to backend
- Check `VITE_API_URL` in frontend `.env`
- Ensure backend is running
- Check CORS settings in backend

### Services not pinging
- Check backend logs for errors
- Verify the service URL is accessible
- Ensure cron job is running (check console logs)

## Contributing

Feel free to submit issues and pull requests!

## License

MIT License

## Developer

**Built with ❤️ by Mr Frank (Darrell Mucheri)**

📱 WhatsApp: +263719647303  
📧 Email: darrelmucheri@gmail.com

## Support

For issues and questions, please open a GitHub issue or contact the developer directly.
```

## Deployment Instructions Summary

### Quick Deploy to Render (Both Frontend & Backend)

1. **Push to GitHub:**
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-github-repo-url>
git push -u origin main
```

2. **Deploy Backend:**
   - Go to Render.com → New Web Service
   - Connect GitHub repo
   - Root directory: `backend`
   - Build: `npm install`
   - Start: `npm start`
   - Add environment variables

3. **Deploy Frontend:**
   - Render.com → New Static Site
   - Root directory: `frontend`
   - Build: `npm install && npm run build`
   - Publish: `dist`
   - Add `VITE_API_URL` env variable

4. **Update Backend FRONTEND_URL:**
   - Go to backend service settings
   - Update `FRONTEND_URL` with your frontend URL
   - Redeploy backend

### Quick Deploy to Vercel (Frontend) + Render (Backend)

1. **Deploy Backend to Render** (same as above)

2. **Deploy Frontend to Vercel:**
```bash
cd frontend
vercel
```
   - Add `VITE_API_URL` in Vercel dashboard
   - Redeploy: `vercel --prod`

## Testing Locally

1. Start backend: `cd backend && npm start`
2. Start frontend: `cd frontend && npm run dev`
3. Open browser: `http://localhost:5173`
4. Add a service and watch it ping automatically!

## Notes

- The cron job checks every minute which services need pinging
- Services are pinged based on their individual intervals
- MongoDB stores all service data and ping history
- The system keeps running 24/7 once deployed
- No browser needs to be open - backend handles all pinging

Enjoy your Zero Ping Uptime Monitor! 🚀
