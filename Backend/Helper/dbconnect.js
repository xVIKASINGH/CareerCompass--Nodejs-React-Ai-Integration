require('dotenv').config();
const { Client } = require('pg');
const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.POSTGRES_URI,
  ssl: { rejectUnauthorized: false } 
});




module.exports={pool};