import express, { type Express } from "express";
import { EventEmitter } from 'events'; 
import { fidMapping } from "../db/schema";
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
import screenshotone from "screenshotone-api-sdk";
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({ 
  cloud_name: 'dnqhpn1ny', 
  api_key: '957231234939496', 
  api_secret: 'benC3Va4UeiA9xLSzioH8Cj8Uvc' 
});

const client = new screenshotone.Client("M45HffCLNzN-Kg","uynV31HftJi1Pw");


const viteLogger = createLogger();

// Create a custom event emitter for tasks
const taskEmitter = new EventEmitter();

taskEmitter.on('takeScreenshot', async ({ url }: { url: string }) => {
    const logWithTime = (msg: string) => {
      const time = new Date().toISOString();
      console.log(`[${time}][EventHandler] ${msg}`);
    };
    logWithTime(`Starting screenshot task for URL: ${url}`);
    // return
    try {
      const pathSegments = url.split('/');
      let fid = null;
      try {
          if (pathSegments[1] === "fid" && pathSegments[2]) {
              fid = pathSegments[2]; // Extract the fid from the URL
              logWithTime(`Extracted fid: ${fid}`);          
          }
        } catch (error:unknown) {            
            logWithTime(`Error processing URL: ${pathSegments.join('/')}`);
            return
      }
        // check if the fid is a number
      if (isNaN(Number(fid))) {        
          logWithTime(`Invalid fid: ${fid}`);
          return;
      }

      const fidNumber = 4003; // example fid
      const result = await db.query.fidMapping.findFirst({
        where: (table) => eq(table.fid, fidNumber)
      });
      
      if (result) {
        logWithTime(`Found record: ${result}`);        
      } else {
        logWithTime(`No record found for fid ${fidNumber}`);
        
        const targetUrl = `https://clankrank-baseedge.replit.app/fid/${fid}`;

        // Set up options using SDK
        const options = screenshotone.TakeOptions.url(targetUrl)
            .format('jpg')
            .blockAds(true)
            .blockCookieBanners(true)
            .blockBannersByHeuristics(false)
            .blockTrackers(true)
            .delay(0)
            .timeout(60)
            .selector('#fid-container')
            .imageQuality(80);

        const screenshot_url = client.generateTakeURL(options);
        console.log(screenshot_url);
        // Download the screenshot
        const imageBlob = await client.take(options);
        const buffer = Buffer.from(await imageBlob.arrayBuffer());

        // // Save the file with FID in name
        const filename = `screenshot_${fid}.jpg`;
        fs.writeFileSync(filename, buffer);
        logWithTime(`Screenshot saved as ${filename}`);

        // Upload to Cloudinary
        try {
          const filename = `screenshot_${fid}.jpg`;
          const cloudinaryResponse = await cloudinary.uploader.upload(filename);
  

          logWithTime(`Upload complete: ${cloudinaryResponse}`);
          if (cloudinaryResponse.url) {  // Cloudinary upload success
            await db.insert(fidMapping).values({
              fid: Number(fid),
              imageUrl: cloudinaryResponse.url,
          });
          logWithTime(`Saved screenshot URL to database for FID:${fid}`);
        }
      
        } catch (uploadError) {
          logWithTime(`Upload to Cloudinary failed: ${uploadError}`);
        }
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

      if (req.originalUrl.includes('fid')) {
        taskEmitter.emit('takeScreenshot', { url: req.originalUrl });
      }
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
