// ==================== backend/src/cluster.js ====================
import cluster from 'cluster';
import os from 'os';
import dotenv from 'dotenv';

dotenv.config();

const numCPUs = os.cpus().length;

if (cluster.isPrimary) {
  console.log(`🎯 Primary process ${process.pid} is running`);
  console.log(`🔧 Spawning ${numCPUs} workers...`);

  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`❌ Worker ${worker.process.pid} died. Spawning new worker...`);
    cluster.fork();
  });
} else {
  import('./server.js');
  console.log(`✅ Worker ${process.pid} started`);
}