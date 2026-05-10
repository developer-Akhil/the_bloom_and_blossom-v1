// This file acts as the entry point for deployments on mPanel / cPanel Node.js selectors 
// that look for 'app.js' by default.

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const serverPath = path.join(__dirname, 'dist', 'server.js');

if (!fs.existsSync(serverPath)) {
  console.error("===============================================================");
  console.error("[ERROR] Missing 'dist/server.js'");
  console.error("This happens because the application has not been built yet.");
  console.error("To fix this in mPanel / cPanel Node.js Selector:");
  console.error("1. Go to your Node.js Application settings.");
  console.error("2. In the 'Run NPM script' field, type 'build' and click Run.");
  console.error("   (This will generate the missing 'dist' folder).");
  console.error("3. Restart the application.");
  console.error("===============================================================");
  process.exit(1);
}

// Load the compiled server
import('./dist/server.js').catch(err => {
    console.error("Failed to load the compiled server:", err);
});
