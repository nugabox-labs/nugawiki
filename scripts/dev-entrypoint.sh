#!/bin/sh
# 개발 컨테이너 진입점: notion-sync 1회 실행 후 hwaro serve(라이브 리로드) 포그라운드 실행.
set -e

PORT="${PORT:-1729}"

if [ -n "$NOTION_TOKEN" ] && [ -n "$NOTION_DB_ID" ]; then
  echo "[dev-entrypoint] notion-sync 실행..."
  if ! npm run sync; then
    echo "[dev-entrypoint] notion-sync 실패 - 기존 content/ 상태로 계속 진행합니다." >&2
  fi
else
  echo "[dev-entrypoint] NOTION_TOKEN/NOTION_DB_ID 미설정 - notion-sync 건너뜀." >&2
fi

echo "[dev-entrypoint] hwaro serve 시작 (http://localhost:${PORT})"
exec hwaro serve -b 0.0.0.0 -p "$PORT" --base-url "http://localhost:${PORT}" --access-log
