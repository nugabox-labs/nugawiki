#!/bin/sh
# 운영 빌더 루프: notion-sync -> hwaro build를 주기적으로 반복해
# public/ 볼륨을 갱신한다. nginx는 이 볼륨을 그대로 서빙하므로
# Notion에서 콘텐츠를 바꾸면 이미지 재빌드 없이 다음 주기에 반영된다.
# (템플릿/코드 변경은 이 이미지 자체를 다시 빌드해야 반영됨 — 기존
# "운영은 재빌드 필요" 원칙은 코드에 대해서는 그대로 유지된다.)
set -u

INTERVAL="${SYNC_INTERVAL_SECONDS:-900}"

run_cycle() {
  if [ -n "${NOTION_TOKEN:-}" ] && [ -n "${NOTION_DB_ID:-}" ]; then
    echo "[build-loop] notion-sync 실행..."
    if ! npm run sync; then
      echo "[build-loop] notion-sync 실패 - 기존 content/로 계속 진행합니다." >&2
    fi
  else
    echo "[build-loop] NOTION_TOKEN/NOTION_DB_ID 미설정 - notion-sync 건너뜀." >&2
  fi
  echo "[build-loop] hwaro build 실행..."
  hwaro build --minify -o /site/public

  # wiki(nginx) 컨테이너는 이 볼륨을 non-root로 읽으므로, builder가
  # 쓴 파일의 소유권/umask와 무관하게 world-readable을 보장한다.
  chmod -R a+rX /site/public
}

while true; do
  if run_cycle; then
    echo "[build-loop] 완료. ${INTERVAL}초 후 재실행."
  else
    echo "[build-loop] 이번 주기 실패, ${INTERVAL}초 후 재시도합니다." >&2
  fi
  sleep "$INTERVAL"
done
