const app = require('./app');

const PORT = process.env.PORT || 3000;

console.log(`Starting server on port ${PORT}...`);

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`✓ SmartCart backend running on port ${PORT}`);
});

// Error handling
server.on('error', (error) => {
  console.error('Server error:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});