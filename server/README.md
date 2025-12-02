# Fitness App Backend API

A Node.js/Express backend API for the Fitness App mobile application.

## Features
- User registration and authentication
- Profile management (age, weight, height in feet/inches)
- Step tracking
- Exercise suggestions
- Session-based authentication with tokens

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user

### User Profile
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update user profile
- `POST /api/user/steps` - Update step count

### Exercise
- `POST /api/suggestions` - Get exercise suggestions

## Deployment

### Render (Recommended)
1. Push code to GitHub
2. Create new Web Service on Render
3. Connect GitHub repository
4. Deploy automatically

### Environment Variables
- `PORT` - Server port (automatically set by Render)

## Local Development
```bash
npm install
npm start
```

Server runs on http://localhost:5000
