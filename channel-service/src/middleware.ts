import { Request, Response, Context, Next } from "koa";
import { buildSchema } from "type-graphql";
import { AppCtx, Config } from "./types";

/** check auth */

export const checkAuth = (conf: Pick<Config, "cache">) => async (
  ctx: Context,
  next: Next
) => {
  console.log(ctx.session, conf);
  await next();
};

/** dynamic cors policy */

export const checkCors = (conf: Pick<Config, "clientHosts">) => {
  if (!conf.clientHosts) return;
  return {
    origin: (req: Request) =>
      conf.clientHosts?.find((h) => h === req.get("Origin")) || "",
  };
};

/** build http graphql middleware */

export const schemaBuilder = (
  conf: Pick<Config, "graphql" | "graphiql">,
  em: AppCtx["em"],
  smtp: AppCtx["smtp"]
) => async (_: Request, __: Response, ctx: Context) => ({
  graphiql: conf.graphiql,
  schema: await buildSchema(conf.graphql),
  context: { ctx, ts: Date.now(), em, smtp },
  extensions: (opt: any) => ({ runtime: Date.now() - opt.context.ts }),
});
