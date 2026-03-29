const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const path = require('path');
const { errorHandler, notFound } = require('./middleware/errorMiddleware');

const app = express();

// Load swagger document
let swaggerDocument;
try {
  swaggerDocument = YAML.load(path.join(__dirname, 'docs', 'swagger.yaml'));
} catch (error) {
  console.log('Swagger document not found. Skipping API docs.');
}

// Security & Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

// HTTP logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  message: 'Too many requests from this IP, please try again after 15 minutes'
});
app.use('/api', limiter);

// API Documentation
if (swaggerDocument) {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
}

// Routes Definition
app.use('/api/v1/auth', require('./routes/authRoutes'));
app.use('/api/v1/tasks', require('./routes/taskRoutes'));

// Basic route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Error Handling Middleware
app.use(notFound);
app.use(errorHandler);

module.exports = app;
