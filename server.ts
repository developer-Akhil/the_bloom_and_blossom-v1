import express from "express";
import { createServer as createViteServer } from "vite";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./server/routes/authRoutes.js";
import paymentRoutes from "./server/routes/paymentRoutes.js";
import contactRoutes from "./server/routes/contactRoutes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '50mb' }));

  // API router
  app.use("/api/auth", authRoutes);
  app.use("/api/payment", paymentRoutes);
  app.use("/api/contact", contactRoutes);

  app.post("/api/upload-image", (req, res) => {
    const { folderId, fileName, base64Data } = req.body;
    if (!folderId || !fileName || !base64Data) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    try {
      // Allow writing to collections or product_images sub-paths dynamically
      let cleanFolderId = folderId.replace(/\s+/g, '_');
      // e.g. "collections/bows"
      let targetDir = path.join(process.cwd(), "public", "images");
      const subParts = cleanFolderId.split('/');
      for (const part of subParts) {
         targetDir = path.join(targetDir, part.replace(/[^a-zA-Z0-9_\-]/g, ""));
      }

      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
      }

      const safeFileName = fileName.replace(/[^a-zA-Z0-9_\-\.]/g, "");
      const targetPath = path.join(targetDir, safeFileName);

      // Extract the actual base64 content
      const base64Content = base64Data.replace(/^data:image\/\w+;base64,/, "");
      fs.writeFileSync(targetPath, Buffer.from(base64Content, 'base64'));

      // Return the public URL for the newly created file
      const publicUrl = `/images/${subParts.join('/')}/${safeFileName}`;

      res.json({ success: true, url: publicUrl });
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/create-folder", (req, res) => {
    const { name, parent } = req.body;
    if (!name) return res.status(400).json({ error: "Folder name is required" });

    // Ensure we create strings safely
    const safeName = name.replace(/[^a-zA-Z0-9_\- ]/g, "").replace(/\s+/g, "_");

    // Base directory for collections
    let baseDir = path.join(process.cwd(), "public", "images", "collections");

    let targetPath = path.join(baseDir, safeName);
    
    try {
      if (!fs.existsSync(targetPath)) {
        fs.mkdirSync(targetPath, { recursive: true });
        // Add a .keep file ensures the folder persists
        fs.writeFileSync(path.join(targetPath, ".keep"), "");
      }
      res.json({ success: true, path: targetPath });
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: e.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.use('/api', (err: any, req: any, res: any, next: any) => {
    console.error('API Error:', err);
    res.status(500).json({ error: err.message || 'Internal Server Error' });
  });

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
