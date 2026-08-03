# syntax=docker/dockerfile:1
# EVIDIQ — Next.js 15 production image (standalone output, ~150MB not 1.9GB).

# ---- Builder: install everything and build ----
FROM node:22-bookworm-slim AS builder
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
COPY package.json package-lock.json ./
# Cache the npm download store, so a lockfile change re-resolves without re-downloading.
RUN --mount=type=cache,target=/root/.npm npm ci
COPY . .
# Cache Next's incremental build cache across image builds. Without this the container
# build starts from zero every time — which is why a deploy took minutes while the same
# build locally, with .next/cache present, finishes in seconds. .dockerignore excludes
# .next, so this mount is the only way that cache survives.
RUN --mount=type=cache,target=/app/.next/cache npm run build

# ---- Runner: standalone server (no full node_modules) ----
FROM node:22-bookworm-slim AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# Standalone server (includes only traced node_modules — minimal).
COPY --from=builder /app/.next/standalone ./
# Static assets + public files (not included in standalone).
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
# serverExternalPackages are not traced — copy only those two.
COPY --from=builder /app/node_modules/@0gfoundation ./node_modules/@0gfoundation
COPY --from=builder /app/node_modules/ethers ./node_modules/ethers
# Scripts (x402 test, sync mirrors) referenced at runtime.
COPY --from=builder /app/scripts ./scripts
# next.config.mjs needed by standalone server.
COPY --from=builder /app/next.config.mjs ./next.config.mjs

# Auto-blog: bind-mount targets for generated posts/images (see deploy/run.sh).
RUN mkdir -p ./content/blog ./public/blog

EXPOSE 3000
CMD ["node", "server.js"]
