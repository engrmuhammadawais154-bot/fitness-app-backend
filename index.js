// Basic Express server for the fitness app backend
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5000;

// CORS - Allow all origins for mobile app compatibility
app.use(cors({
  origin: '*',
  credentials: true
}));
app.use(express.json());

// Health check endpoint (for Render deployment)
app.get('/', (req, res) => {
  res.json({ 
    status: 'Fitness App API is running!',
    endpoints: {
      register: 'POST /api/auth/register',
      login: 'POST /api/auth/login',
      logout: 'POST /api/auth/logout',
      profile: 'GET /api/user/profile',
      updateProfile: 'PUT /api/user/profile',
      updateSteps: 'POST /api/user/steps'
    }
  });
});

// In-memory storage (in production, use a real database)
const users = new Map();
const sessions = new Map();

// Helper function to generate session token
function generateToken() {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

// Authentication middleware
function authenticate(req, res, next) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token || !sessions.has(token)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  req.userId = sessions.get(token);
  next();
}

// Register endpoint
app.post('/api/auth/register', (req, res) => {
  const { email, password, name, age, weight, heightFeet, heightInches, targetWeight } = req.body;
  
  // Validation
  if (!email || !password || !name || !age || !weight || heightFeet === undefined || heightInches === undefined) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  
  // Check if user already exists
  if (users.has(email)) {
    return res.status(400).json({ error: 'User already exists' });
  }
  
  // Create user
  const user = {
    email,
    password, // In production, hash this with bcrypt!
    name,
    age: parseInt(age),
    weight: parseFloat(weight),
    heightFeet: parseInt(heightFeet),
    heightInches: parseInt(heightInches),
    targetWeight: parseFloat(targetWeight || weight),
    createdAt: new Date().toISOString(),
    steps: 0,
    dailySteps: {}
  };
  
  users.set(email, user);
  
  // Create session
  const token = generateToken();
  sessions.set(token, email);
  
  res.json({ 
    token, 
    user: {
      email: user.email,
      name: user.name,
      age: user.age,
      weight: user.weight,
      heightFeet: user.heightFeet,
      heightInches: user.heightInches,
      targetWeight: user.targetWeight
    }
  });
});

// Login endpoint
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }
  
  const user = users.get(email);
  if (!user || user.password !== password) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  
  // Create session
  const token = generateToken();
  sessions.set(token, email);
  
  res.json({ 
    token,
    user: {
      email: user.email,
      name: user.name,
      age: user.age,
      weight: user.weight,
      heightFeet: user.heightFeet,
      heightInches: user.heightInches,
      targetWeight: user.targetWeight
    }
  });
});

// Logout endpoint
app.post('/api/auth/logout', authenticate, (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  sessions.delete(token);
  res.json({ message: 'Logged out successfully' });
});

// Get user profile
app.get('/api/user/profile', authenticate, (req, res) => {
  const user = users.get(req.userId);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  res.json({
    email: user.email,
    name: user.name,
    age: user.age,
    weight: user.weight,
    heightFeet: user.heightFeet,
    heightInches: user.heightInches,
    targetWeight: user.targetWeight,
    steps: user.steps,
    dailySteps: user.dailySteps
  });
});

// Update user profile
app.put('/api/user/profile', authenticate, (req, res) => {
  const user = users.get(req.userId);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  const { name, age, weight, heightFeet, heightInches, targetWeight } = req.body;
  
  if (name) user.name = name;
  if (age) user.age = parseInt(age);
  if (weight) user.weight = parseFloat(weight);
  if (heightFeet !== undefined) user.heightFeet = parseInt(heightFeet);
  if (heightInches !== undefined) user.heightInches = parseInt(heightInches);
  if (targetWeight) user.targetWeight = parseFloat(targetWeight);
  
  res.json({
    email: user.email,
    name: user.name,
    age: user.age,
    weight: user.weight,
    heightFeet: user.heightFeet,
    heightInches: user.heightInches,
    targetWeight: user.targetWeight
  });
});

// Update steps
app.post('/api/user/steps', authenticate, (req, res) => {
  const user = users.get(req.userId);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  const { steps, date } = req.body;
  const today = date || new Date().toISOString().split('T')[0];
  
  user.steps = parseInt(steps);
  user.dailySteps[today] = parseInt(steps);
  
  res.json({ steps: user.steps });
});

// Example endpoint for exercise suggestions
app.post('/api/suggestions', (req, res) => {
  const { weight, height, type } = req.body;
  // Grouped exercise suggestions with variations
  let groups = [];
  if (type === 'home') {
    groups = [
      {
        name: 'Push-ups',
        variations: [
          'Standard Push-up',
          'Diamond Push-up',
          'Wide Grip Push-up',
        ],
      },
      {
        name: 'Squats',
        variations: [
          'Bodyweight Squat',
          'Sumo Squat',
          'Jump Squat',
        ],
      },
      {
        name: 'Plank',
        variations: [
          'Standard Plank',
          'Side Plank',
          'Plank with Shoulder Tap',
        ],
      },
      {
        name: 'Lunges',
        variations: [
          'Forward Lunge',
          'Reverse Lunge',
          'Walking Lunge',
        ],
      },
      {
        name: 'Jumping Jacks',
        variations: [
          'Standard Jumping Jack',
          'Cross Jack',
          'Squat Jack',
        ],
      },
    ];
  } else if (type === 'gym') {
    groups = [
      {
        name: 'Bench Press',
        variations: [
          'Flat Bench Press',
          'Incline Bench Press',
          'Decline Bench Press',
        ],
      },
      {
        name: 'Deadlift',
        variations: [
          'Conventional Deadlift',
          'Sumo Deadlift',
          'Romanian Deadlift',
        ],
      },
      {
        name: 'Lat Pulldown',
        variations: [
          'Wide Grip Lat Pulldown',
          'Reverse Grip Lat Pulldown',
          'Close Grip Lat Pulldown',
        ],
      },
      {
        name: 'Leg Press',
        variations: [
          'Standard Leg Press',
          'Single Leg Press',
          'Wide Stance Leg Press',
        ],
      },
      {
        name: 'Cable Rows',
        variations: [
          'Seated Cable Row',
          'Standing Cable Row',
          'Single Arm Cable Row',
        ],
      },
    ];
  }
  // In a real app, use weight/height for more personalized suggestions
  res.json({ groups });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
