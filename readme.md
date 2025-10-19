# User Network Application

## 🚀 Features Implemented

✅ Complete CRUD API with Express.js  
✅ MySQL database with auto-initialization  
✅ React Flow dynamic graph visualization  
✅ Redux Toolkit state management  
✅ Drag & drop hobby management  
✅ Real-time popularity score calculation  
✅ Custom animated nodes (High/Low score)  
✅ Cluster mode with Node.js  
✅ Comprehensive test suite  
✅ Production-ready error handling  

## 📋 Prerequisites

- Node.js 18+
- MySQL 8.0+
- npm or yarn

## 🛠️ Installation & Setup

### 1. Clone Repository
```bash
git clone <your-repo-url>
cd user-network-app
```

### 2. Backend Setup
```bash
cd backend
npm install

# Configure environment
cp .env.example .env
# Edit .env with your MySQL credentials

# Run development server
npm run dev
```

### 3. Frontend Setup
```bash
cd frontend
npm install

# Run development server
npm run dev
```

### 4. Access Application
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000/api

## 🧪 Running Tests
```bash
cd backend
npm test
```

## 🌐 Deployment (Render)

### Backend
1. Push code to GitHub
2. Create Web Service on Render
3. Set environment variables
4. Deploy automatically

### Frontend
1. Create Static Site on Render
2. Build command: `cd frontend && npm install && npm run build`
3. Publish directory: `frontend/dist`

## 📊 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users` | Get all users |
| POST | `/api/users` | Create user |
| PUT | `/api/users/:id` | Update user |
| DELETE | `/api/users/:id` | Delete user |
| POST | `/api/users/:id/link` | Link users |
| DELETE | `/api/users/:id/unlink` | Unlink users |
| GET | `/api/graph` | Get graph data |

## 🎯 Key Features

### Popularity Score Formula
```
popularityScore = uniqueFriends + (sharedHobbies × 0.5)
```

### Business Rules
- Circular friendship prevention
- Delete protection with active friendships
- Real-time score recalculation
- Drag & drop hobby assignment

## 👨‍💻 Tech Stack

**Backend:** Node.js, Express, MySQL, Redis  
**Frontend:** React, Redux Toolkit, React Flow, Vite  
**Testing:** Jest, Supertest

## 📹 Demo Video

[[Link to demo video](https://docs.google.com/videos/d/1RINH883N2zpltgJCDvt4CqsFQwTchhMFnDoIlaJExO0/play#scene=id.p)]


```


