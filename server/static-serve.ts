import path from 'path';
import express from 'express';

/**
 * Sets up static file serving for the Express app
 * @param app Express application instance
 */
export function setupStaticServing(app: express.Application) {
  console.log('📁 Setting up static file serving...');
  
  // In production, the built files are in dist/public
  const publicPath = path.join(process.cwd(), 'public');
  console.log(`📂 Serving static files from: ${publicPath}`);
  
  // Serve static files from the public directory
  app.use(express.static(publicPath));

  // For any non-API routes, serve the index.html file (SPA routing)
  app.get('/*splat', (req, res, next) => {
    // Skip API routes
    if (req.path.startsWith('/api/')) {
      return next();
    }
    
    console.log(`🌐 Serving SPA for route: ${req.path}`);
    const indexPath = path.join(publicPath, 'index.html');
    res.sendFile(indexPath);
    return;
  });
  
  console.log('✅ Static file serving configured');
}