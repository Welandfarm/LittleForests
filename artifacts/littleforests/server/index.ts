import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";

const app = express();
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: false, limit: '10mb' }));

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
} else if (!process.env.VERCEL) {
  // On Vercel, static assets are served directly by the platform per
  // vercel.json's outputDirectory/rewrites — the serverless function only
  // needs to handle /api/*. Skipping this here avoids a hard crash if
  // dist/public isn't present inside this function's own bundle.
  serveStatic(app);
}

// Vercel runs this file as a serverless function (see vercel.json) and
// calls the exported `app` directly per-request — it never calls listen()
// and manages its own port/host. Only bind a persistent port when NOT
// running on Vercel (e.g. Replit, or any other always-on host). Because
// this is top-level await in an ESM module ("type": "module" in
// package.json), `export default app` below only becomes visible to an
// importer once everything above has finished — so Vercel can never see a
// half-initialized app on cold start.
if (!process.env.VERCEL) {
  // Use the managed preview port when running in Replit, with 5000 as a
  // local fallback for running the uploaded project outside the workspace.
  const port = Number(process.env.PORT || 5000);

  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`serving on port ${port}`);
  });
}

export default app;