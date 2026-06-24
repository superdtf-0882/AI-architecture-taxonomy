import { createClient } from "redis";

// Reuse a single connected client across invocations (and across HMR reloads
// in dev) instead of opening a new TCP connection per request.
let clientPromise;

export function getRedisClient() {
  if (!clientPromise) {
    const client = createClient({ url: process.env.REDIS_URL });
    clientPromise = client.connect().then(() => client);
  }
  return clientPromise;
}
