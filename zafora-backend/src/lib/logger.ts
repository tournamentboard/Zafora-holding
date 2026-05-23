import pino from "pino";
import { ENVS_VARIABLES } from "./ENVS.js";


export const logger = pino({
  level: ENVS_VARIABLES.LOG_LEVEL ?? "info",
  redact: [
    "req.headers.authorization",
    "req.headers.cookie",
    "res.headers['set-cookie']",
  ],
  ...(ENVS_VARIABLES.NODE_ENV === "production"
    ? {}
    : {
        transport: {
          target: "pino-pretty",
          options: { colorize: true },
        },
      }),
});
