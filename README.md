# Redis Tool

A web interface for interacting with Redis (in a very limited capacity).

## Setup

Define your redis credentials in a server .env file:

```sh
# server/.env
REDIS_HOST="your-redis-host"
REDIS_PASSWORD="your-redis-password"
```

Start the client and server from the project root:

```sh
pnpm start
```

## Ports

The client runs on `4444`, server on `5555`.
These are hardcoded for no good reason.

## Operations

This utility only supports `get`, `keys`, `del`, and `flushall`.
