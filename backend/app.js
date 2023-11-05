const http = require('http');
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const session = require('express-session');
const cors = require('cors');
const cookieParser = require('cookie-parser');

// Import WebSocket server creation function (createWebSocketServer)
const createWebSocketServer = require('./config/websocket');

const app = express();
const server = http.createServer(app);

// Create a WebSocket server and attach it to your HTTP server
const wss = createWebSocketServer(server);

// Set up express-session middleware
// app.use(session({
//   secret: 'your-secret-key', // Replace with a strong and unique secret
//   resave: false,
//   saveUninitialized: false,
// }));

// const allowedOrigins = ['*'];

// const corsOptions = {
//   origin: (origin, callback) => {
//     if (allowedOrigins.includes(origin)) {
//       callback(null, true);
//     } else {
//       callback(new Error('Not allowed by CORS'));
//     }
//   },
// };

// app.use(cors(corsOptions));

app.use(cors())
// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Replace with your route handlers
app.use('/api/filter', require('./routes/filterRoutes'));
app.use('/payments', require('./routes/paymentRoutes'));
app.use('/', require('./routes/cartRoutes'));
app.use(require('./routes/categoriesRoutes'));
app.use('/', require('./routes/courseCreationRoutes'));
app.use('/', require('./routes/courseRoutes'));
app.use('/earnings', require('./routes/earningsRoutes'));
app.use('/', require('./routes/messageRoutes'));
app.use('/', require('./routes/notificationRoutes'));
app.use('/', require('./routes/ratingRoutes'));
app.use('/', require('./routes/requestRoutes'));
app.use('/', require('./routes/reviewRoutes'));
app.use('/', require('./routes/userRoutes'));
app.use('/',require('./routes/walletRoutes'));
app.use('/', require('./routes/searchRoutes'));
app.use('/', require('./routes/settingsRoutes'));
app.use(require('./routes/authRoutes'));
app.use('/', require('./routes/ThreadRoutes')); // Mount thread routes at /threads
app.use('/', require('./routes/PostRoutes')); // Mount post routes at /posts
app.use('/', require('./routes/communityRoutes'));
app.use('/', require('./routes/websiteStatisticsRoutes'));  



// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'frontend/build')));

// Catch all other routes and return the React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/build', 'index.html'));
});

// Custom middleware for handling 404 errors
const notFoundMiddleware = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

// Custom error handler middleware
const errorHandlerMiddleware = (error, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    message: error.message,
    stack: process.env.NODE_ENV === 'production' ? 'Error stack is hidden in production' : error.stack,
  });
};

// Apply custom middleware
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

// Serialize user to store in the session (implement this as needed)

// Connect to MongoDB
const start = async () => {
  try {
    const mongoURI = process.env.MONGO_URI; // Use the online MongoDB URI

    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    });

    const port = process.env.PORT || 5000;
    server.listen(port, () => {
      console.log(`Server is listening on port ${port}...`);
    });
  } catch (error) {
    console.error('MongoDB connection error:', error);
  }
};

start();
