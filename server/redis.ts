import "dotenv/config";
import { createClient } from "redis";

const { REDIS_HOST, REDIS_PASSWORD, REDIS_PORT } = process.env;

export function getClient() {
  if (!REDIS_HOST) {
    throw new Error("Missing REDIS_HOST");
  }
  if (!REDIS_PASSWORD) {
    throw new Error("Missing REDIS_PASSWORD");
  }
  if (!REDIS_PORT) {
    throw new Error("Missing REDIS_PORT");
  }

  const client = createClient({
    socket: {
      host: REDIS_HOST,
      tls: false,
      // ¯\_(ツ)_/¯
      port: REDIS_PORT as unknown as number,
    },
    password: REDIS_PASSWORD,
  });

  return client;
}
