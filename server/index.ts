import express, { type Request, Response, NextFunction } from "express";
import 'dotenv/config'; // Initialize dotenv to load environment variables
import session from 'express-session';
import cors from "cors";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { seedAdminUser } from "./seed";
import { connectToMongoDB } from "../shared/db";
import MongoStore from 'connect-mongo';
import path from "path";
import { fileURLToPath } from "url";

const app = express();

// defining __dirname and __filename for use in static file serving
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Force HTTPS in production
app.use((req, res, next) => {
  if (
    process.env.NODE_ENV === 'production' &&
    req.headers['x-forwarded-proto'] !== 'https'
  ) {
    return res.redirect('https://' + req.headers.host + req.url);
  }
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cors({
  origin: [
    "https://amirandrivingcollege.co.ke",
    "https://www.amirandrivingcollege.co.ke"
  ],
  credentials: true
}));

app.use((req: Request, res: Response, next: NextFunction) => {
  if (process.env.PAUSED === 'true') {
    return res.status(503).json({ message: "🚫 Service unavailable" });
  }
  next();
});

app.set('trust proxy', 1); //trusting render proxy for secure cookies
app.use(session({
  name: "auth_session",
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI }),
  cookie: {
    secure: process.env.NODE_ENV === 'production', // true in production, false otherwise
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', // not recommended though
    httpOnly: true,   // helps prevent XSS
    domain: process.env.NODE_ENV === 'production' ? '.amirandrivingcollege.co.ke' : undefined // <--- add this line
  }
}));

// Serve uploads folder statically
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  try {
    // Initialize MongoDB connection
    await connectToMongoDB();
    log('MongoDB connected successfully');
    
    // Seed default admin user
    await seedAdminUser();
    
    const server = await registerRoutes(app);

    app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";

      res.status(status).json({ message });
      throw err;
    });

    // importantly only setup vite in development and after
    // setting up all the other routes so the catch-all route
    // doesn't interfere with the other routes
    if (app.get("env") === "development") {
      await setupVite(app, server);
    } else {
      serveStatic(app);
    }

    // ALWAYS serve the app on port 5000
    // this serves both the API and the client.
    // It is the only port that is not firewalled.
    const port = process.env.PORT || 5000;
    server.listen({
      port: Number(port),
      host: '0.0.0.0',
      reusePort: true,
    }, () => {
      log(`serving on port ${port}`);
    });
  } catch (error) {
    log(`Error starting server: ${error}`);
  }
})();
