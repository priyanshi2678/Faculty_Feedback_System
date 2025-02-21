import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables

// Debugging: Log environment variables to check if they're loaded correctly
console.log("DB_HOST:", process.env.DB_HOST);
console.log("DB_USER:", process.env.DB_USER);
console.log("DB_PASSWORD:", process.env.DB_PASSWORD);
console.log("DB_NAME:", process.env.DB_NAME);
console.log("DB_PORT:", process.env.DB_PORT);


// Create a connection pool
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user:  process.env.DB_USER,    // Your MySQL username
  password: process.env.DB_PASSWORD, // Your MySQL password
  database: process.env.DB_NAME, // Your database name
  port: process.env.DB_PORT, // Default MySQL port
});

// Function to check DB connection
export const connectToDB = async () => {
  try {
    const connection = await db.getConnection(); // Ensure the connection works
    console.log('Connected to MySQL database');
    connection.release(); // Release connection back to the pool
  } catch (err) {
    console.error('Error connecting to MySQL database:', err.stack);
  }
};

// Function to get the DB pool for queries
export const getDB = () => {
  return db; // Return the pool, which can be used for queries
};
