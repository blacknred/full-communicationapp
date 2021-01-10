import path = require("path");
import dotenv = require("dotenv");
import { Config } from "./types";

dotenv.config({
  path: path.join(__dirname, "../", `.env.${process.env.NODE_ENV || "development"}`),
});

const config: Config = {
  port: process.env.PORT || 3000,
  env: process.env.NODE_ENV || "development",
  secret: process.env.SECRET || "secret",
  clientHosts: process.env.CLIENT_HOSTS?.split(" "),
  session: {
    key: process.env.SECRET || "secret",
    maxAge: 86400000,
    overwrite: true,
    httpOnly: true,
    signed: true,
    rolling: false,
    renew: false,
    secure: true,
    sameSite: "strict",
  },
  db: {
    migrations: {
      path: path.join(__dirname, "migrations"),
      pattern: /^[\w-]+\d+\.[tj]s$/,
    },
    entities: ["src/entities/*.*"],
    clientUrl:
      process.env.NODE_ENV == "test"
        ? process.env.DATABASE_TEST_URL
        : process.env.DATABASE_URL,
    type: "postgresql",
    tsNode: true,
    debug: process.env.NODE_ENV !== "production",
    // dbName: "default",
    // forceUtcTimezone: true,
    // replicas: []
  },
  redis: {
    url: process.env.REDIS_URL,
  },
  email: {
    from: "Swoy platform <service@swoy.com>",
    url: process.env.SMTP_URL,
    logger: true,
    debug: false,
  },
  graphiql: process.env.NODE_ENV !== "production",
  graphql: {
    resolvers: [__dirname + "resolvers/*.{ts,js}"],
    skipCheck: true,
  },
  logger: {
    appenders: {
      server: { type: "stdout" },
      auth: {
        type: "file",
        filename: path.join(__dirname, "../", "logs", "auth.log"),
      },
      app: {
        type: "file",
        filename: path.join(__dirname, "../", "logs", "requests.log"),
      },
    },
    categories: {
      default: { appenders: ["out", "app"], level: "trace" },
    },
  },
  //
  cache: {
    onlineTimespan: process.env.ONLINE_TIMESPAN || 60 * 5,
  },
};

export default config;
