const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'root',
  database: process.env.DB_NAME || 'skillhub',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Tester la connexion
pool.getConnection()
  .then(connection => {
    console.log('Connexion à la base de données réussie.');
    connection.release();
  })
  .catch(err => {
    console.error('Erreur de connexion à la base de données:', err);
  });

module.exports = pool;
