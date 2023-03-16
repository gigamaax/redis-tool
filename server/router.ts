import { inferAsyncReturnType, initTRPC } from "@trpc/server";
import { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import { z } from "zod";

import { getClient } from "./redis";

export const createContext = ({
  req,
  res,
}: CreateExpressContextOptions) => ({});
type Context = inferAsyncReturnType<typeof createContext>;

const t = initTRPC.context<Context>().create();

const redis = getClient();
await redis.connect();

export const router = t.router({
  keys: t.procedure.input(z.string()).query(async (req) => {
    return await redis.keys(req.input);
  }),
  get: t.procedure.input(z.string()).query(async (req) => {
    return (await redis.get(req.input)) || "";
  }),
  delete: t.procedure.input(z.string()).mutation(async (req) => {
    return await redis.del(req.input);
  }),
  flushAll: t.procedure.mutation(async (_) => {
    return await redis.flushAll();
  }),
});

export type RouterType = typeof router;
