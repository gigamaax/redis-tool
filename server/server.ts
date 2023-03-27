import "dotenv/config";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import cors from "cors";
import express from "express";

import { router, createContext } from "./router";

const app = express();

app.use(cors());

app.use(
  "/trpc",
  createExpressMiddleware({
    router,
    createContext,
  })
);

app.listen(process.env.PORT || 5555);
