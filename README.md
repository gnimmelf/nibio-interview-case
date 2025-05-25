# Interview Case: NIBIO 📋

## Usage 🚀

Set up `./.env`:

```
FRONTEND_HOST=http://localhost
BACKEND_HOST=http://localhost
FRONTEND_PORT=5173
BACKEND_PORT=3001
SECRET_KEY=super-secret-key
```

Env vars propagate to Client via `vite.config::define` and Server via `app.ts`.
For containers, `docker compose` auto-loads `.env`, passing it to Dockerfile and container at build and runtime.

## Run in Containers (Prod) 🐳

Run `docker-compose up` from project root.

## Local Install (Dev) 💻

### Server ⚙️

In `./server/`:

1. Install `bun` globally: [bun.sh/docs/installation](https://bun.sh/docs/installation)
2. Install deps: `bun install`
3. Run server:
   - Dev: `bun run dev`
   - Prod: `bun run start`

### Client 🌐

**⚠️ Use `pnpm`, not `npm`!**

In `./client/`:

1. Install `pnpm` globally:
  - Using npm: `npm install -g pnpm`
  - Alternatives: https://pnpm.io/installation
2. Install deps: `pnpm i`
2. Run client:
   - Dev: `pnpm run dev`
   - Prod: `pnpm run start`
