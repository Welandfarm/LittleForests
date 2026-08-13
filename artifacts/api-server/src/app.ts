import express, { type Express } from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import router from "./routes";
import { logger } from "./lib/logger";

const app: Express = express();

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// The imported LittleForests app owns its domain-specific API routes. Keep
// the shared API service as the public `/api` entrypoint, while forwarding
// those requests to the LittleForests web service behind the proxy.
app.use("/api", async (req, res, next) => {
  if (req.path === "/healthz") {
    return next();
  }

  const targetPort = process.env["LITTLEFORESTS_PORT"] ?? "23858";
  const targetUrl = `http://127.0.0.1:${targetPort}${req.originalUrl}`;

  try {
    const requestHeaders = new Headers();
    for (const [key, value] of Object.entries(req.headers)) {
      if (
        value !== undefined &&
        key !== "host" &&
        key !== "content-length" &&
        key !== "connection"
      ) {
        requestHeaders.set(key, Array.isArray(value) ? value.join(", ") : value);
      }
    }

    const hasBody = req.method !== "GET" && req.method !== "HEAD";
    const response = await fetch(targetUrl, {
      method: req.method,
      headers: requestHeaders,
      body: hasBody ? JSON.stringify(req.body ?? {}) : undefined,
    });

    const responseBuffer = Buffer.from(await response.arrayBuffer());
    res.status(response.status);
    response.headers.forEach((value, key) => {
      if (
        key !== "content-length" &&
        key !== "content-encoding" &&
        key !== "transfer-encoding" &&
        key !== "connection"
      ) {
        res.setHeader(key, value);
      }
    });
    return res.send(responseBuffer);
  } catch (error) {
    req.log.error({ err: error, targetUrl }, "Failed to proxy LittleForests API request");
    return res.status(502).json({ error: "LittleForests API unavailable" });
  }
});

app.use("/api", router);

export default app;
