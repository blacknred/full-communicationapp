import {
  Options,
  Connection,
  EntityManager,
  IDatabaseDriver,
} from "@mikro-orm/core";
import SMTPTransport = require("nodemailer/lib/smtp-transport");
import { BuildSchemaOptions } from "type-graphql";
import { Transporter } from "nodemailer";
import { Configuration } from "log4js";
import { opts } from "koa-session";
import { ClientOpts } from "redis";
import { Context } from "koa";

export type AppCtx = {
  em: EntityManager<any> & EntityManager<IDatabaseDriver<Connection>>;
  smtp: Transporter;
  ctx: Context;
  ts?: number;
};

export type Config = {
  port: string | number;
  env: string;
  secret: string;
  clientHosts: Array<string> | undefined; // TODO: temp, use redis and nginx
  session: Partial<opts>;
  db: Options<IDatabaseDriver<Connection>>;
  redis: ClientOpts;
  graphiql: boolean;
  graphql: BuildSchemaOptions;
  email: SMTPTransport.Options;
  logger: Configuration;
  //
  cache: cacheConfig;
};

export type cacheConfig = {
  onlineTimespan: string | number;
};
