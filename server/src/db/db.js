// db.js
const mysql = require("mysql");

const connection = mysql.createConnection({
  host: process.env.DB_HOST, // Replace with your MySQL host
  user: process.env.DB_USER, // Replace with your MySQL username
  password: process.env.DB_PASS, // Replace with your MySQL password
  database: process.env.DB_DATABASE, // Replace with your MySQL database name
});

module.exports = connection;
