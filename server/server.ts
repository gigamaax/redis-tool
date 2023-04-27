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

const port = process.env.PORT || 5555;
app.listen(port, () => {
  console.log("Server listening on port", port);
});
