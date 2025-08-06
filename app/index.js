const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const ENVIRONMENT = process.env.NODE_ENV || 'development';

// Middleware
app.use(express.static('public'));
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Deployment Demo!',
    environment: ENVIRONMENT,
    version: process.env.npm_package_version || '1.0.0',
    timestamp: new Date().toISOString(),
    commit: process.env.GITHUB_SHA || 'local'
  });
});

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    environment: ENVIRONMENT,
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

app.get('/version', (req, res) => {
  res.json({
    version: process.env.npm_package_version || '1.0.0',
    commit: process.env.GITHUB_SHA || 'local',
    environment: ENVIRONMENT
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Something went wrong!',
    environment: ENVIRONMENT
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.originalUrl,
    environment: ENVIRONMENT
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Environment: ${ENVIRONMENT}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
});
