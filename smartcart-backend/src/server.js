const app = require('./app');

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`SmartCart backend running on port ${PORT}`);
});