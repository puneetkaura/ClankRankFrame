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

const logWithTime = (msg: string) => {
  const time = new Date().toISOString();
  console.log(`[${time}][EventHandler] ${msg}`);
};

const instanceId = Math.random().toString(36).substring(7);
let logCounter = 0;

export function productionLog(message: string, type: 'log' | 'error' | 'info' = 'log') {
  // const counter = ++logCounter;
  const timestamp = new Date().toISOString();
  // const logMessage = `[${timestamp}][${instanceId}][${counter}] ${message}\n`;
  const logMessage = `[${timestamp}][RouteLogger]${message}\n`;
  
  // Stack trace to see where the log is being called from
  const stack = new Error().stack;
  const caller = stack?.split('\n')[2] || 'unknown';
  
  // const fullMessage = `${logMessage}Caller: ${caller}\n`;
  const fullMessage = `${logMessage}\n`;
  
  process.stdout.write(fullMessage);
}

productionLog(`Server instance starting: ${instanceId}`);


taskEmitter.on('takeScreenshot', async ({ url }: { url: string }) => {
 
    logWithTime(`Starting screenshot task for URL: ${url}`);
    // return
    let fid = null;
    try {
      const pathSegments = url.split('/');
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

      // const fidNumber = 4003; // example fid
      const fidNumber = parseInt(fid);  // example fid
      // const result = await db.query.fidMapping.findFirst({
      //   where: (table) => eq(table.fid, fidNumber)
      // });
      
      // if (result) {
      //   logWithTime(`Found record: ${result}`);        
      // } else {
      //   logWithTime(`No record found for fid ${fidNumber}`);
        
        const targetUrl = `https://clanker-ranker.replit.app/fid/${fid}/?screenshot=true`;

        // Set up options using SDK
        const options = screenshotone.TakeOptions.url(targetUrl)
            .format('jpg')
            .blockAds(true)
            .blockCookieBanners(true)
            .blockBannersByHeuristics(false)
            .blockTrackers(true)
            .delay(5)
            .timeout(60)
            .selector('#fid-container')
            .imageQuality(80)

        const screenshot_url = client.generateTakeURL(options);
        
        const check_sc_before = await db.query.fidMapping.findFirst({
          where: (table) => eq(table.fid, fidNumber)
        });

        if (check_sc_before) {
          logWithTime(`AVOIDING SCREENSHOT for fid ${fidNumber}`);        
          return;
        } 
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
          // const cloudinaryResponse = {secure_url : `testURL${fid}`};

          if (cloudinaryResponse.secure_url) {  // Cloudinary upload success
            await db.insert(fidMapping).values({
              fid: Number(fid),
              imageUrl: cloudinaryResponse.secure_url,
          });
          logWithTime(`Saved screenshot URL to database for FID:${fid}`);
        }
      
        } catch (uploadError) {
          logWithTime(`Upload to Cloudinary failed: ${uploadError}`);
        }
    
    logWithTime('Screenshot completed:');
    return url;
    } catch (error) {
      console.error('Screenshot failed:', error);
      // Handle error (retry logic if needed)
    }
});

taskEmitter.setMaxListeners(2);


export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

async function handleFidRequest(fid: string, template: string, isDev = false, vite?: any) {
  productionLog(`Processing FID: ${fid}`);

  if (isNaN(Number(fid))) {
      productionLog(`Invalid fid: ${fid}`);
      throw new Error('Invalid FID');
  }

  const result = await db.query.fidMapping.findFirst({
      where: (table) => eq(table.fid, Number(fid))
  });

  let frameUrl = null;
  if (result) {
      frameUrl = result.imageUrl;
      productionLog(`Found record, NOT GENERATING SCREENSHOT: ${frameUrl}`);
  } else {
      taskEmitter.emit('takeScreenshot', { url: `/fid/${fid}` });
  }

  const frameContent = {
      version: "next",
      imageUrl: frameUrl,
      button: {
          title: "See your Clank Rank...",
          action: {
              type: "launch_frame",
              name: "Clanker Ranker by Baseedge",
              url: `https://clanker-ranker.replit.app/fid/${fid}`,
              splashImageUrl: "https://res.cloudinary.com/dnqhpn1ny/image/upload/v1739389371/loading_ex1lqd.gif",
              splashBackgroundColor: "#10b981",
          },
      },
  };

  // Replace meta tag
  let modifiedTemplate = template.replace(
      /<meta\s+name="fc:frame"[^>]*>/,
      `<meta name="fc:frame" content='${JSON.stringify(frameContent)}'>`
  );

  if (isDev) {
      // Add development-specific modifications
      modifiedTemplate = modifiedTemplate.replace(
          `src="/src/main.tsx"`,
          `src="/src/main.tsx?v=${nanoid()}"`,
      );
      return await vite.transformIndexHtml(`/fid/${fid}`, modifiedTemplate);
  }

  return modifiedTemplate;
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

  app.use("/favicon.ico", express.static(path.join(__dirname, "public", "favicon.ico")));
  
  app.use(vite.middlewares);
  app.use("/fid/:fid", async (req, res, next) => {
    const pageUrl = req.originalUrl;
    productionLog(`serving ${pageUrl}`);
    let fid = null;
    try {
      const clientTemplate = path.resolve(
        __dirname,
        "..",
        "client",
        "index.html",
      );

      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      const page = await handleFidRequest(req.params.fid, template, true, vite);
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
      throw new Error(`Could not find the build directory: ${distPath}`);
  }

  app.use(express.static(distPath));

  app.get("/fid/:fid", async (req, res) => {
      try {
          const template = await fs.promises.readFile(
              path.resolve(distPath, "index.html"),
              "utf-8"
          );

          const page = await handleFidRequest(req.params.fid, template, false);
          res.status(200).set({ "Content-Type": "text/html" }).send(page);
      } catch (error) {
          productionLog(`Error processing FID: ${error}`, 'error');
          res.status(500).send(error.message);
      }
  });

  app.get("/", (req, res) => {
      res.sendFile(path.resolve(distPath, "index.html"));
  });
}
