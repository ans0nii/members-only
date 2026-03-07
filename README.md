# Members-Only Message Board
A secure full-stack authentication system with role-based access control, built with React and Express.
Features user registration, JWT authentication, and a message board with CRUD Operations.

## Live Demo
* **Frontend:** https://members-only-theta.vercel.app/
* **Backend API:** https://members-only-production-b018.up.railway.app/

## Screenshot
<img width="1417" height="1130" alt="image" src="https://github.com/user-attachments/assets/f7e29e59-26b4-4e5f-b5b7-58beeecfde3f" />
<img width="913" height="1150" alt="image" src="https://github.com/user-attachments/assets/4c69e4bf-a3a7-44ae-b66d-6e53e0216410" />



## Features

## Authentication & Security
* User registration and login with JWT tokens
* Persistent sessions with local storage
* Password hashing with bcrypt
* XSS attack prevention
* Responsive design for desktop and mobile

## Message Board
* Create, read, update, and delete messages
* Users can edit/delete their own messages
* Admin can delete any message
* Character limits with real-time counters
* 20-message display limit for performance

## User Experience
* Fully responsive design for desktop, tablet and mobile
* CSS modules for component-scoped styling
* Loading and error handling
* Modern React patterns with useContext API

## Technologies Used
**Frontend:**
* React with Hooks (useState, useEffect, useContext)
* Context API for state management
* JavaScript ES6+
* Vite build tooling
* CSS modules
* CSS3 with responsive grid layout

**Backend:**
* Express.js REST API with JWT authentication
* Node.js runtime
* Input sanitization for XSS protection
* PostgreSQL database with parameterized queries
* Middleware for authentication and authorization

## Deployment
* Frontend: Vercel with automatic deployments
* Backend: Railway with PostgreSQL database
* Environment variable management

## API Endpoints
* `POST /api/auth/signup` - Register new user
* `POST /api/auth/login` - User login
* `GET /api/messages` - Get all messages
* `POST /api/messages` - Create message
* `PUT /api/messages/:id` - Update message
* `DELETE /api/messages/:id` - Delete Message

## Installation & Setup (Local)

### Backend Setup
1. Clone the repository
2. Navigate to backend folder: `cd members-only`
3. Run `npm install`
4. Create a `.env` file with your database credentials:
```
   DB_HOST=localhost
   DB_USER=your_username
   DB_PASSWORD=your_password
   DB_DATABASE=members-only
   DB_PORT=5432
   PORT=3000
```
5. Set up PostgreSQL database
6. Run the SQL schema to create tables (Bottom of page)
7. Run `npm start`

### Frontend Setup
1. Navigate to frontend folder: `cd members-only-frontend`
2. Run `npm install`
3. Run `npm run dev`

## Things I Learned/Demonstrated
* JWT Token generation and validation
* Secure password handling with bcrypt
* Session persistence and management
* Role-based authorization middleware
* Context API for state management across components
* Custom hooks for data fetching and management
* Component composition and separation of concerns
* Secure API endpoint design
* Protection against common web vulnerabilities
* Database design with foreign key relationships


### Data Schema 
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  is_member BOOLEAN DEFAULT false,
  is_admin BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE messages (
  id SERIAL PRIMARY KEY,
  title VARCHAR(100) NOT NULL,
  text VARCHAR(500) NOT NULL,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```
