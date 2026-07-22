#!/bin/sh
# 개발 컨테이너 진입점: hwaro serve(라이브 리로드) 포그라운드 실행.
# notion-sync는 운영(builder) 컨테이너에서만 수행하므로 개발 구동 시에는 건너뛰고 기존 content/로 서버만 띄운다.
set -e

PORT="${PORT:-1729}"

echo "[dev-entrypoint] hwaro serve 시작 (http://localhost:${PORT})"
exec hwaro serve -b 0.0.0.0 -p "$PORT" --base-url "http://localhost:${PORT}" --access-log
