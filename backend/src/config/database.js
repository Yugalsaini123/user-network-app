// ==================== backend/src/config/database.js ====================
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const {
  DB_HOST = 'localhost',
  DB_USER = 'root',
  DB_PASSWORD = '',
  DB_NAME = 'user_network',
  DB_PORT = '3306'
} = process.env;

// Create pool early so it's available for default export
const pool = mysql.createPool({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  port: parseInt(DB_PORT),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export const initializeDatabase = async () => {
  try {
    // Step 1: Connect without selecting a database
    const bootstrapConnection = await mysql.createConnection({
      host: DB_HOST,
      user: DB_USER,
      password: DB_PASSWORD,
      port: parseInt(DB_PORT)
    });

    // Step 2: Create the database if it doesn't exist
    await bootstrapConnection.query(
      `CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`
    );
    await bootstrapConnection.end();

    // Step 3: Create tables using the pool
    const connection = await pool.getConnection();

    await connection.query(`CREATE TABLE IF NOT EXISTS users (
      id VARCHAR(36) PRIMARY KEY,
      username VARCHAR(255) NOT NULL UNIQUE,
      age INT NOT NULL,
      hobbies JSON NOT NULL,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_username (username)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`);

    await connection.query(`CREATE TABLE IF NOT EXISTS friendships (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id_1 VARCHAR(36) NOT NULL,
      user_id_2 VARCHAR(36) NOT NULL,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE KEY unique_friendship (user_id_1, user_id_2),
      FOREIGN KEY (user_id_1) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (user_id_2) REFERENCES users(id) ON DELETE CASCADE,
      INDEX idx_user1 (user_id_1),
      INDEX idx_user2 (user_id_2)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`);

    connection.release();
    console.log('✅ Database initialized successfully');
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    throw error;
  }
};

// ✅ Default export for pool
export default pool;