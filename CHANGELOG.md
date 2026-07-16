# Changelog

모든 주목할 만한 변경사항을 이 파일에 기록한다. [Semantic Versioning](https://semver.org/lang/ko/)을 따른다.

## v0.6.0 - 2026-07-17

### Added
- `Dockerfile.dev`: `ghcr.io/hahwul/hwaro:latest` 기반에 apt로 Node.js/npm을 설치하고, `scripts/dev-entrypoint.sh`가 notion-sync 1회 실행 후 `hwaro serve`를 포그라운드로 실행.
- `docker-compose.dev.yml`: `content/templates/static/config.toml/scripts`를 바인드 마운트, `DEV_PORT`(기본 1730)로 매핑.
- dev 서버는 `--base-url http://localhost:<port>`로 실행해 로컬 미리보기에서 nav 링크가 운영 도메인이 아닌 localhost를 가리키도록 함.
- notion-sync 실패는 dev 모드에서는 경고만 남기고 기존 `content/`로 서버를 계속 띄움(로컬 템플릿 작업이 Notion 장애에 막히지 않도록).

### Verified
- 컨테이너를 직접 빌드·실행해 (1) 토큰 미설정 시 sync 건너뛰기, (2) base_url 오버라이드로 nav 링크가 `http://localhost:1730/...`로 렌더링됨, (3) 컨테이너 재시작 없이 `content/index.md` 수정이 즉시 반영되는 라이브 리로드를 모두 확인.

## v0.5.0 - 2026-07-17

### Added
- `Dockerfile`(prod): 3-스테이지 빌드 — `node:20-alpine`(notion-sync) → `ghcr.io/hahwul/hwaro:latest`(hwaro build --minify, 공식 문서의 멀티스테이지 예시 기반) → `nginx:alpine`(정적 서빙).
- `NOTION_TOKEN`/`NOTION_DB_ID`는 sync 스테이지에서만 ARG/ENV로 존재하고 이후 스테이지엔 `content/` 결과물만 전달되어 최종 이미지 레이어에 남지 않음.
- `nginx.conf`: gzip, 정적 자산 장기 캐싱, HTML no-cache, 404 처리.
- `docker-compose.yml`: `PROD_PORT`(기본 1729)로 호스트 포트 매핑, `.env`의 Notion 시크릿을 빌드 인자로 주입.
- `.dockerignore` 추가.

### Verified
- `hwaro build --minify` + nginx 서빙을 실제 컨테이너로 빌드·실행해 홈페이지 200, CSS 캐시 헤더, 커스텀 404를 직접 확인.

## v0.4.0 - 2026-07-17

### Added
- `<head>`와 `templates/partials/ad-slot.html`에 AdSense 자리 마련(주석 처리, 기본 비활성).
- `section.html`: `section.pages`를 직접 순회해 날짜·카테고리·태그 배지가 붙은 카드 목록으로 교체.
- `taxonomy.html`/`taxonomy_term.html`: `get_taxonomy()`로 태그 클라우드/문서 카드 목록을 직접 구성하고 한국어 라벨 적용.
- `page.html`: 날짜/업데이트/카테고리/태그 메타 라인과 `extra.external_url`(원문 링크) 노출 추가.
- Notion 콜아웃과 매핑되는 GitHub 스타일 admonition(`> [!TIP]` 등) CSS 추가.

## v0.3.0 - 2026-07-17

### Added
- `scripts/notion-sync.mjs`: `@notionhq/client` v5(`dataSources.query`, Notion-Version 2025-09-03 데이터소스 모델)로 DEV-WIKI를 동기화.
- `배포` 체크박스 == true인 페이지만 조회, `이름/카테고리/태그/PublishDate/ModifyDate/버전 정보/관련 URL`을 front matter(title/categories/tags/date/updated/extra.version/extra.external_url)로 매핑.
- 직접 작성한 Notion 블록 → Markdown 컨버터(문단, H1-3, 리스트/할일, 코드, 인용, 콜아웃→admonition, 이미지, 구분선, 표, 북마크). Notion 호스팅 이미지(만료되는 서명 URL)는 `static/notion-assets/`로 다운로드해 고정 경로로 치환.
- reconciliation: `extra.source = "notion"` 마커가 있는 기존 산출물 중 더 이상 대상이 아니거나 경로가 바뀐 파일/에셋을 삭제. 마커 없는 수기 문서는 보존.
- 카테고리 디렉터리에 `_index.md`가 없으면 최소 섹션 인덱스를 자동 생성.
- 환경변수 누락/Notion 인증 실패 시 명확한 한국어 오류 메시지와 함께 non-zero exit.

## v0.2.0 - 2026-07-17

### Added
- `hwaro init --scaffold docs` (Hwaro v0.17.1, `ghcr.io/hahwul/hwaro:latest`)로 사이트 스캐폴딩.
- `config.toml`: 사이트명 NUGAWIKI, 태그라인 "기록되지 않은 것은 기억되지 않는다", `categories`/`tags` taxonomy.
- alder 예시([hwaro-examples](https://github.com/hahwul/hwaro-examples))를 참고해 accent 컬러를 그린 계열로, 헤딩 폰트를 JetBrains Mono로 재구성한 다크/라이트 테마.
- 홈페이지, 내비게이션, favicon을 NUGAWIKI에 맞게 교체.

## v0.1.0 - 2026-07-17

### Added
- 저장소 초기화: README, .gitignore, package.json, AGENTS.md.
