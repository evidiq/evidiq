#!/usr/bin/env bash
# Deploy EVIDIQ as a Docker container behind the existing Coolify Traefik proxy.
# Traefik (coolify-proxy) routes by container labels on the `coolify` network,
# with the `letsencrypt` cert resolver (HTTP-01). Secrets come from an env file,
# never baked into the image.
set -euo pipefail

IMAGE="${IMAGE:-evidiq:latest}"
NAME="${NAME:-evidiq}"
NETWORK="${NETWORK:-coolify}"
ENV_FILE="${ENV_FILE:-/root/evidiq.env}"

docker rm -f "$NAME" >/dev/null 2>&1 || true

docker run -d \
  --name "$NAME" \
  --restart unless-stopped \
  --network "$NETWORK" \
  --env-file "$ENV_FILE" \
  --label 'traefik.enable=true' \
  --label 'traefik.http.routers.evidiq-http.entrypoints=http' \
  --label 'traefik.http.routers.evidiq-http.rule=Host(`evidiq.dev`) || Host(`www.evidiq.dev`)' \
  --label 'traefik.http.routers.evidiq-http.middlewares=evidiq-redirect' \
  --label 'traefik.http.routers.evidiq-http.service=evidiq' \
  --label 'traefik.http.middlewares.evidiq-redirect.redirectscheme.scheme=https' \
  --label 'traefik.http.middlewares.evidiq-redirect.redirectscheme.permanent=true' \
  --label 'traefik.http.routers.evidiq-https.entrypoints=https' \
  --label 'traefik.http.routers.evidiq-https.rule=Host(`evidiq.dev`) || Host(`www.evidiq.dev`)' \
  --label 'traefik.http.routers.evidiq-https.tls=true' \
  --label 'traefik.http.routers.evidiq-https.tls.certresolver=letsencrypt' \
  --label 'traefik.http.routers.evidiq-https.service=evidiq' \
  --label 'traefik.http.services.evidiq.loadbalancer.server.port=3000' \
  "$IMAGE"

echo "started:"
docker ps --filter "name=^/${NAME}$" --format '{{.Names}}  {{.Status}}'
