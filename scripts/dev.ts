import { startServer } from '../server/index.js';
import { createServer } from 'vite';

let viteServer;
let apiServer;

async function startDev() {
  try {
    console.log('🚀 Starting development servers...');
    
    // Start the Express API server first
    console.log('📡 Starting API server on port 3001...');
    apiServer = await startServer(3001);
    console.log('✅ API server started successfully');

    // Wait for API server to be ready
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Test API server
    try {
      const response = await fetch('http://localhost:3001/health');
      if (response.ok) {
        const data = await response.json();
        console.log('✅ API server health check passed:', data);
      } else {
        console.log('⚠️ API server health check failed');
      }
    } catch (error) {
      console.error('❌ API server health check error:', error);
    }

    console.log('⚡ Starting Vite dev server...');
    viteServer = await createServer({
      configFile: './vite.config.js',
      server: {
        port: 3000,
        host: 'localhost',
        hmr: {
          port: 3010,
          host: 'localhost',
        },
        proxy: {
          '/api': {
            target: 'http://localhost:3001',
            changeOrigin: true,
            secure: false,
          },
          '/health': {
            target: 'http://localhost:3001',
            changeOrigin: true,
            secure: false,
          },
        },
      },
    });

    await viteServer.listen();
    
    console.log('');
    console.log('🌟 Development environment ready!');
    console.log('📌 Frontend: http://localhost:3000');
    console.log('📌 API: http://localhost:3001');
    console.log('📌 Health Check: http://localhost:3001/health');
    console.log('');

  } catch (error) {
    console.error('💥 Failed to start development servers:', error);
    process.exit(1);
  }
}

// Graceful shutdown handling
async function shutdown() {
  console.log('\n🛑 Shutting down development servers...');
  
  if (viteServer) {
    await viteServer.close();
    console.log('✅ Vite server closed');
  }

  if (apiServer) {
    apiServer.close();
    console.log('✅ API server closed');
  }

  process.exit(0);
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

// Start the development environment
startDev();