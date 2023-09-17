const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = require('./app');  // Import the app instance from app.js

dotenv.config({ path: './config.env' });

// Database connection
const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);
mongoose.connect(DB, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('DB connection successful!'))
  .catch((err) => console.error('DB connection error:', err));

// Test route for debugging
app.get('/test', (req, res) => {
    res.send('Test route');
});

// Server listening
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
