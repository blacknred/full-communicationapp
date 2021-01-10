import "reflect-metadata";
import Koa = require("koa");
import * as log4js from "log4js";
import cors = require("koa-cors");
import helmet = require("koa-helmet");
import session = require("koa-session");
import bodyParser = require("koa-body");
import * as nodemailer from "nodemailer";
import graphqlHTTP = require("koa-graphql");
import { MikroORM } from "@mikro-orm/core";
import { checkAuth, checkCors, schemaBuilder } from "./middleware";
import { Redis, RedisSession } from "./redis";
import { Config } from "./types";

/** set all up */

export default async (conf: Config) => {
  /** init logger */

  log4js.configure(conf.logger);
  const logger = log4js.getLogger("server");

  /** db connection */

  conf.db.logger = logger.info;
  const orm = await MikroORM.init(conf.db);

  /** redis instance */

  const redis = new Redis(conf.redis);

  /** smtp instance */

  const smtp = nodemailer.createTransport(conf.email);

  /** shutdown */

  const shutdown = async (err?: Error) => {
    logger.fatal(err);
    // By default PM2 will wait 1600ms before sending a final SIGKILL signal.
    await orm.close(true);
    smtp.close(); // has also idle event to queue unsent emails in redis
    log4js.shutdown();
    redis.quit((err) => {
      process.exit(err ? 1 : 0);
    });
  };

  try {
    if (!(await orm.isConnected())) throw new Error("db is not connected");

    if (!redis.connected) throw new Error("redis is not connected");

    if (!(await smtp.verify())) throw new Error("smtp is not connected");

    /** handle db migrations */

    const migrator = orm.getMigrator();
    await migrator.createMigration();
    await migrator.up();

    /** application */

    const app = new Koa();
    app.use(helmet());
    app.use(cors(checkCors(conf)));
    conf.session.store = new RedisSession(redis);
    app.use(session(conf.session, app));
    app.use(checkAuth(conf));
    app.use(bodyParser());
    app.use(graphqlHTTP(schemaBuilder(conf, orm.em, smtp)));

    /** handle uncaughtException */

    process.on("uncaughtException", shutdown);

    /** handle shutdown signal */

    process.on("SIGINT", shutdown);

    /** listen */

    await app.listen(conf.port);

    logger.info(`🚀 at http://127.0.0.1:${conf.port}`);
  } catch (err) {
    shutdown(err);
  }
};
