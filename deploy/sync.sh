#!/usr/bin/env bash
# One command to put the local site on the host: sync, build, restart, verify.
#
# Run from the repo root:  bash deploy/sync.sh
#
# Why this exists: the deploy was three separate round trips (rsync, docker build,
# run.sh), each waited on separately. It is one now, and it reports timings so a slow
# step is visible instead of guessed at.
#
# Deliberate choices:
#   * rsync WITHOUT --delete. The blog lives in bind-mounted host directories outside
#     this tree, but --delete has burned this project before, so removals are explicit:
#     pass a path as $1 to delete it on the host after syncing.
#   * The Next build cache is a BuildKit cache mount in the Dockerfile, so repeat builds
#     are incremental rather than starting from zero.
#   * Verification is not optional. A passing build has coexisted with a broken deploy
#     here, so the live endpoint is probed before this script claims success.

set -euo pipefail

HOST="${HOST:-evidiq-vps}"
SRC="${SRC:-/root/evidiq-src}"
REMOVE_PATH="${1:-}"

t0=$(date +%s)

echo "== sync =="
rsync -az --info=stats1 \
  --exclude node_modules --exclude .next --exclude dist --exclude .git \
  --exclude '.env' --exclude '.env.*' \
  ./ "$HOST:$SRC/" | grep -E 'Number of regular files transferred|Total transferred' || true
t1=$(date +%s); echo "   sync $((t1-t0))s"

if [ -n "$REMOVE_PATH" ]; then
  echo "== remove on host: $REMOVE_PATH =="
  ssh "$HOST" "rm -rf '$SRC/$REMOVE_PATH' && echo '   removed'"
fi

echo "== build + restart =="
ssh "$HOST" "DOCKER_BUILDKIT=1 docker build -q -t evidiq:latest $SRC >/dev/null && bash $SRC/deploy/run.sh >/dev/null && docker ps --filter name=^/evidiq\$ --format '   {{.Names}} {{.Status}}'"
t2=$(date +%s); echo "   build+restart $((t2-t1))s"

echo "== verify =="
for i in $(seq 1 20); do
  code=$(curl -s -o /dev/null -w '%{http_code}' --max-time 10 https://evidiq.dev/ || true)
  [ "$code" = "200" ] && break
  sleep 2
done
printf '   apex=%s' "$(curl -s -o /dev/null -w '%{http_code}' --max-time 15 https://evidiq.dev/)"
printf ' blog=%s' "$(curl -s --max-time 20 https://evidiq.dev/blog | grep -oE '/blog/[a-z0-9][a-z0-9-]{8,}' | sort -u | wc -l | tr -d ' ')posts"
printf ' docs=%s' "$(curl -s -o /dev/null -w '%{http_code}' --max-time 15 https://evidiq.dev/docs/evidiq)"
printf ' x402=%s' "$(curl -s --max-time 15 https://evidiq.dev/x402 | grep -oE '"amount": *"[0-9]+"' | grep -oE '[0-9]+')"
printf ' mcp=%stools\n' "$(curl -s -H 'accept: application/json, text/event-stream' -H 'content-type: application/json' -d '{"jsonrpc":"2.0","id":1,"method":"tools/list"}' --max-time 20 https://evidiq.dev/mcp | tr ',' '\n' | grep -c '"name":"' | tr -d ' ')"

t3=$(date +%s)
echo "== total $((t3-t0))s =="
