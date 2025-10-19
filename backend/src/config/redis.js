// ==================== backend/src/config/redis.js ====================
import { createClient } from 'redis';

const redisClient = createClient({
  socket: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379')
  },
  password: process.env.REDIS_PASSWORD || undefined
});

redisClient.on('error', (err) => console.log('Redis Client Error', err));
redisClient.on('connect', () => console.log('✅ Redis connected'));

export const connectRedis = async () => {
  try {
    await redisClient.connect();
  } catch (error) {
    console.warn('⚠️ Redis not available, running without cache');
  }
};

export default redisClient;