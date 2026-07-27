# syntax=docker/dockerfile:1
# EVIDIQ — Next.js 15 production image for Coolify/Traefik on hackaton-do.

# ---- Builder: install everything and build ----
FROM node:22-bookworm-slim AS builder
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
COPY package.json package-lock.json ./
# Cache the npm download store across builds: a dependency change then re-links
# instead of re-downloading the whole tree.
RUN --mount=type=cache,target=/root/.npm npm ci
COPY . .
# Reuse Next's compiler cache across builds. Without this every deploy recompiled
# all 22 routes from scratch, which is what made a one-line edit a long wait.
RUN --mount=type=cache,target=/app/.next/cache npm run build

# ---- Runner: lean production deps + built output ----
FROM node:22-bookworm-slim AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# Only production dependencies (keeps @0gfoundation/0g-ts-sdk, ethers, viem, mcp).
COPY package.json package-lock.json ./
RUN --mount=type=cache,target=/root/.npm npm ci --omit=dev

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.mjs ./next.config.mjs
COPY --from=builder /app/scripts ./scripts

# Auto-blog: bind-mount targets for generated posts/images (see deploy/run.sh).
# Created here so the mount points exist even before the first `docker run -v`.
RUN mkdir -p ./content/blog ./public/blog

EXPOSE 3000
CMD ["npm", "run", "start"]
