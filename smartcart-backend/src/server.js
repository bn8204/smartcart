const app = require('./app');

const PORT = 3000;

console.log('Server starting...');

const server = app.listen(PORT, () => {
  console.log(`SmartCart backend running on port ${PORT}`);
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