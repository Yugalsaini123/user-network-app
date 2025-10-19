// ==================== backend/src/server.js ====================
import dotenv from 'dotenv';
dotenv.config();

import { createApp } from './app.js';
import { initializeDatabase } from './config/database.js';
import { connectRedis } from './config/redis.js';

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await initializeDatabase();

    try {
      await connectRedis();
    } catch (error) {
      console.warn('⚠️ Running without Redis');
    }

    const app = createApp();
    
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🌐 API: http://localhost:${PORT}/api`);
    });
  } catch (error) {
    console.error('❌ Server startup failed:', error);
    process.exit(1);
  }
};

startServer();
