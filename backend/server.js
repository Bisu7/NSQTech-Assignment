require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');

// Initialize database connection
connectDB();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
