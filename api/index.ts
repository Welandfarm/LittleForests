import express, { type NextFunction, type Request, type Response } from "express";
import { registerRoutes } from "../server/routes";

const app = express();

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: false, limit: "10mb" }));

const ready = registerRoutes(app).then(() => {
  app.use(
    (
      err: any,
      _req: Request,
      res: Response,
      _next: NextFunction,
    ) => {
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";
      res.status(status).json({ message });
    },
  );
});

export default async function handler(req: Request, res: Response) {
  try {
    await ready;
    app(req, res);
  } catch (error) {
    console.error("Vercel API initialization failed:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}