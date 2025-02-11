import express, { type Express } from "express";
import { EventEmitter } from 'events'; 
import fs from "fs";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer, createLogger } from "vite";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import { type Server } from "http";
import viteConfig from "../vite.config";
import { nanoid } from "nanoid";
import {db} from "../db/index";
import { eq } from "drizzle-orm";


const viteLogger = createLogger();

// Create a custom event emitter for tasks
const taskEmitter = new EventEmitter();

taskEmitter.on('takeScreenshot', async ({ url }: { url: string }) => {
    try {
      const pathSegments = url.split('/');

        try {
          if (pathSegments[1] === "fid" && pathSegments[2]) {
              const fid = pathSegments[2]; // Extract the fid from the URL
              console.log(`Extracted fid: ${fid}`);
          }
        } catch (error:unknown) {
            console.error('Error processing URL:', pathSegments.join('/'));
            return
        }

      const fidNumber = 4003; // example fid
      const result = await db.query.fidMapping.findFirst({
        where: (table) => eq(table.fid, fidNumber)
      });
      
      if (result) {
        console.log('Found record:', result);
      } else {
        console.log('No record found for fid:', fidNumber);
      }
      console.log('Screenshot completed:');
      return url;
    } catch (error) {
      console.error('Screenshot failed:', error);
      // Handle error (retry logic if needed)
    }
});

taskEmitter.setMaxListeners(20);


export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}


export async function setupVite(app: Express, server: Server) {
  const vite = await createViteServer({
    ...viteConfig,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      },
    },
    server: {
      middlewareMode: true,
      hmr: { server },
    },
    appType: "custom",
  });

  app.use(vite.middlewares);
  app.use("*", async (req, res, next) => {
    const pageUrl = req.originalUrl;
    log(`serving ${pageUrl}`);
    let fid = null;
    try {
      const clientTemplate = path.resolve(
        __dirname,
        "..",
        "client",
        "index.html",
      );

      let template = await fs.promises.readFile(clientTemplate, "utf-8");

      taskEmitter.emit('takeScreenshot', { url: req.originalUrl });

      // Create the dynamic frame content
      const frameContent = {
        version: "next",
        imageUrl: "https://res.cloudinary.com/dnqhpn1ny/image/upload/v1739269748/screenshot_jyfjyh.jpg",
        button: {
          title: "Launch Clank Rank",
          action: {
            type: "launch_frame",
            name: "Clank Rank Demo",
            url: `https://clankrank-baseedge.replit.app${req.originalUrl}`,
            splashImageUrl: "https://picsum.photos/seed/picsum/200/300",
            splashBackgroundColor: "#f7f7f7",
          },
        },
      };
      // log(JSON.stringify(frameContent));
      // Replace the fc:frame meta tag
      template = template.replace(
        /<meta\s+name="fc:frame"[^>]*>/,
        `<meta name="fc:frame" content='${JSON.stringify(frameContent)}'>`,
      );

      // Add cache busting for main.tsx
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`,
      );

      const page = await vite.transformIndexHtml(req.originalUrl, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });
}

export function serveStatic(app: Express) {
  const distPath = path.resolve(__dirname, "public");

  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`,
    );
  }

  app.use(express.static(distPath));

  // fall through to index.html if the file doesn't exist
  app.use("*", (req, res) => {
    const currentUrl = `${req.originalUrl}`;
    log(currentUrl);
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}
