import express, { type Express } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import pinoHttp from "pino-http";
import swaggerUi from "swagger-ui-express";
import router from "./routes/index.js";
import { logger } from "./shared/lib/logger.js";
import { errorHandler } from "./shared/middleware/error-handler.js";
import swaggerSpec from "./shared/lib/swagger.js";

const app: Express = express();

const allowedOrigins = (process.env["ALLOWED_ORIGINS"] ?? "http://localhost:3000").split(",").map((o) => o.trim());

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS: origin ${origin} not allowed`));
      }
    },
    credentials: true,
  }),
);

app.use(cookieParser());

app.use(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (pinoHttp as any)({
    logger,
    serializers: {
      req(req: any) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res: any) {
        return { statusCode: res.statusCode };
      },
    },
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger UI — available at /api-docs
app.use(
  "/docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    customSiteTitle: "Zafora API Docs",
    swaggerOptions: {
      persistAuthorization: true,
      withCredentials: true,
      tryItOutEnabled: true,
    },
  }),
);

// Expose raw spec as JSON for Postman / programmatic use
app.get("/docs.json", (_req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerSpec);
});

app.use("/api", router);

app.use(errorHandler);

export default app;
