import "dotenv/config";
import { createClient } from "redis";

const { REDIS_HOST, REDIS_PASSWORD } = process.env;

export function getClient() {
  if (!REDIS_HOST) {
    throw new Error("Missing REDIS_HOST");
  }
  if (!REDIS_PASSWORD) {
    throw new Error("Missing REDIS_PASSWORD");
  }

  const client = createClient({
    socket: {
      host: REDIS_HOST,
      tls: true,
    },
    password: REDIS_PASSWORD,
  });

  return client;
}
