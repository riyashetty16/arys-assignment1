const express = require('express');
const session = require('express-session');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));

// Session configuration
app.use(session({
  secret: 'tesla-secret-key-change-in-production',
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: false, // Set to true in production with HTTPS
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));


// Database setup
const db = new sqlite3.Database('tesla.db');

db.serialize(() => {
  // Users table
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Car models data
  db.run(`CREATE TABLE IF NOT EXISTS car_models (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    base_price INTEGER NOT NULL,
    image_url TEXT,
    description TEXT
  )`);

  // Insert default car models if they don't exist
  db.get("SELECT COUNT(*) as count FROM car_models", (err, row) => {
    if (row.count === 0) {
      db.run(`INSERT INTO car_models (name, base_price, image_url, description) VALUES 
        ('Model S', 74990, '/images/model-s.jpg', 'Plaid: The quickest car in production'),
        ('Model 3', 40240, '/images/model-3.jpg', 'Built for safety and range'),
        ('Model X', 79990, '/images/model-x.jpg', 'The safest SUV ever built'),
        ('Model Y', 47740, '/images/model-y.jpg', 'Versatile and efficient')`);
    }
  });
});

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/cars', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'cars.html'));
});

app.get('/customize', (req, res) => {
  if (!req.session.userId) {
    return res.redirect('/login');
  }
  res.sendFile(path.join(__dirname, 'public', 'customize.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/signup', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'signup.html'));
});

app.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: 'Could not log out' });
    }
    res.redirect('/');
  });
});

// API Routes
app.get('/api/cars', (req, res) => {
  db.all("SELECT * FROM car_models", (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

app.post('/api/signup', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    
    db.run(
      "INSERT INTO users (email, password) VALUES (?, ?)",
      [email, hashedPassword],
      function(err) {
        if (err) {
          if (err.message.includes('UNIQUE constraint')) {
            return res.status(400).json({ error: 'Email already exists' });
          }
          return res.status(500).json({ error: err.message });
        }
        
        req.session.userId = this.lastID;
        req.session.email = email;
        res.json({ success: true, message: 'Account created successfully' });
      }
    );
  } catch (error) {
    res.status(500).json({ error: 'Error creating account' });
  }
});

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  db.get("SELECT * FROM users WHERE email = ?", [email], async (err, user) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    try {
      const match = await bcrypt.compare(password, user.password);
      if (match) {
        req.session.userId = user.id;
        req.session.email = user.email;
        res.json({ success: true, message: 'Login successful' });
      } else {
        res.status(401).json({ error: 'Invalid email or password' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Error during login' });
    }
  });
});

app.get('/api/user', (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  res.json({ userId: req.session.userId, email: req.session.email });
});

app.get('/api/customize/options', (req, res) => {
  const options = {
    battery: [
      { name: 'Standard Range', price: 0 },
      { name: 'Long Range', price: 8000 },
      { name: 'Performance', price: 15000 }
    ],
    color: [
      { name: 'Pearl White Multi-Coat', price: 0 },
      { name: 'Solid Black', price: 1500 },
      { name: 'Midnight Silver Metallic', price: 1500 },
      { name: 'Deep Blue Metallic', price: 1500 },
      { name: 'Red Multi-Coat', price: 2500 }
    ],
    wheels: [
      { name: '18" Aero Wheels', price: 0 },
      { name: '19" Sport Wheels', price: 2000 },
      { name: '20" Uberturbine Wheels', price: 3500 },
      { name: '21" Arachnid Wheels', price: 5500 }
    ],
    interior: [
      { name: 'Black', price: 0 },
      { name: 'White', price: 2000 },
      { name: 'Cream', price: 2000 }
    ]
  };
  res.json(options);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

