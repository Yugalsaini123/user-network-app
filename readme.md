# User Network Application - Cybernauts Assignment

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

[Link to demo video]

## 📧 Contact

Created for Cybernauts Development Assignment
```

---

## 🎬 STEP 3: VIDEO SCRIPT (2-3 MINUTES)
```
[INTRO - 15 seconds]
"Hello! I'm [Your Name], and this is my submission for the Cybernauts User Network Assignment. 
Let me walk you through the features I've implemented."

[BACKEND DEMO - 30 seconds]
"Starting with the backend, I've built a complete REST API using Node.js and Express with MySQL database.
The API handles all CRUD operations for users and friendships.
*Show Postman or terminal with API calls*
Key features include:
- Automatic database initialization
- Popularity score calculation
- Circular friendship prevention
- Delete protection for connected users"

[FRONTEND DEMO - 60 seconds]
"Now for the frontend - I've used React with Redux Toolkit and React Flow for visualization.

*Click 'New User' button*
First, let me create a user named Alice, age 25, with hobbies reading and gaming.
*Create user*

*Create another user*
Now Bob, age 28, with hobbies gaming and cooking.

*Drag node onto another*
Watch how I can create friendships by dragging one node onto another.
The connection appears instantly.

*Show popularity score*
Notice the popularity scores updating in real-time.
Alice has 1 friend and shares gaming hobby with Bob, so her score is 1.5.

*Drag hobby from sidebar*
The sidebar shows all hobbies. I can drag 'reading' onto Bob's node to add it.
*Drag and drop*
See how the score updates immediately!

*Show different node types*
Users with scores above 5 get the green 'high score' node with a crown.
Lower scores have blue nodes. These transition smoothly when scores change.

*Try to delete*
If I try to delete Alice while she has friendships...
*Click delete*
The system prevents it and shows an error message.

*Show network stats panel*
The stats panel shows total users, connections, and average score."

[FEATURES HIGHLIGHT - 30 seconds]
"Additional features include:
- Undo/Redo functionality with keyboard shortcuts
- Search and filter for hobbies
- Toast notifications for all actions
- Error boundary for crash prevention
- Responsive design
- Loading states and spinners

*Show cluster mode in terminal*
The backend also supports cluster mode for production scaling."

[TESTING & DEPLOYMENT - 20 seconds]
"I've included comprehensive tests covering:
- User creation and validation
- Popularity score calculation  
- Friendship management
- Delete protection

*Run npm test*
All tests passing with good coverage.

The application is deployment-ready for Render with environment configuration."

[CLOSING - 10 seconds]
"Thank you for reviewing my submission. The code is well-organized, documented, 
and production-ready. I'm excited about the opportunity to join Cybernauts!"