const mysql = require("mysql2/promise");
require("dotenv").config();

let pool;

async function connectDB() {
  if (!pool) {
    try {
      pool = mysql.createPool({
        host: process.env.DB_HOST,
        user: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
      });
      console.log("New pool created 🚀");
      return pool;
    } catch (error) {
      console.error("💀 Error connecting to MySQL:", error);
    }
  } else {
    console.log("pool was created");
    return pool;
  }
}

async function closeDB() {
  if (pool) {
    await pool.end();
    console.log("Connection pool closed 🚪");
  }
}

module.exports = { connectDB, closeDB };
