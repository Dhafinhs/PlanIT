const { Pool } = require('pg');
require('dotenv').config();

console.log('Database Configuration:', {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
});

const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
});

// Test database connection
pool.connect((err, client, release) => {
  if (err) {
    console.error('Error acquiring client:', err.stack);
    console.error('Check if the role exists and matches DB_USER in .env');
    process.exit(1);
  }
  console.log(`Successfully connected to database as user: ${process.env.DB_USER}`);
  release();
});

// Add query logging
const originalQuery = pool.query;
pool.query = (...args) => {
  console.log('Executing Query:', {
    text: args[0],
    params: args[1],
    timestamp: new Date().toISOString(),
  });
  return originalQuery.apply(pool, args).catch(err => {
    console.error('Database Error:', {
      error: err,
      query: args[0],
      params: args[1],
    });
    throw err;
  });
};

module.exports = pool;
