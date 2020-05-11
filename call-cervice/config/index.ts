import path from "path";
import dotenv from "dotenv";

dotenv.config({
  path: path.join(
    __dirname,
    "../",
    `.env.${process.env.NODE_ENV || "development"}`
  ),
});

export default {
  port: process.env.PORT || 3000,
  env: process.env.NODE_ENV || "development",
  is_logging: process.env.NODE_ENV === "test",
  logs_path: path.join(__dirname, "../", "logs"),
  cors: {
    allow: process.env.NODE_ENV === "production",
    client_host: process.env.CLIENT_HOST,
  },
  secrets: {
    secret: process.env.TOKEN_SECRET || "insecure-secret",
    secret2: process.env.TOKEN_SECRET_2 || "insecure-secret2",
  },
  limit: {
    max_requests: process.env.RATE_LIMIT_MAX_REQUESTS || 33,
    interval: process.env.RATE_LIMIT_INTERVAL || 15 * 60 * 1000,
  },
};
