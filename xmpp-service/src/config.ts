import path = require("path");
import dotenv = require("dotenv");
import { Config } from "./types";

dotenv.config({
  path: path.join(__dirname, "../", `.env.${process.env.NODE_ENV || "development"}`),
});

const config: Config = {
  port: process.env.PORT || 4000,
  env: process.env.NODE_ENV || "development",
  secret: process.env.SECRET || "secret",
};

export default config;
