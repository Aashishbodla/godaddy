const express = require('express');
const cors = require('cors');
const { initializeDatabase, testConnection } = require('./db');
const apiRoutes = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 5000;

// Configure CORS with dynamic origin check
const corsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = [
      'http://127.0.0.1:5500',
      'http://localhost:3000',
      'https://www.peeracademic.in',
      'https://peeracademic.in'
    ];
    if (!origin || allowedOrigins.includes(origin) || origin.match(/https:\/\/peeracademic-.*\.vercel\.app/)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());
app.use('/api', apiRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.get('/', (req, res) => {
  res.json({ 
    message: 'Peer Academic API is running', 
    status: 'ok',
    endpoints: ['/api/register', '/api/login', '/api/doubts', '/api/notifications']
  });
});

async function startServer() {
  try {
    await initializeDatabase();
    await testConnection();
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

startServer();