# Changelog

모든 주목할 만한 변경사항을 이 파일에 기록한다. [Semantic Versioning](https://semver.org/lang/ko/)을 따른다.

## v0.17.3 - 2026-07-21

### Fixed
- Google Search Console 인증 파일이 배포 직후 404로 나오던 문제. `build-loop`에서 notion-sync 전에 hwaro build를 먼저 실행하고, nginx에 인증 파일을 직접 마운트하며, 재빌드 배포 시 즉시 hwaro build를 한 번 더 실행한다.

## v0.17.2 - 2026-07-21

### Fixed
- 홈 `SINCE`/`TODAY`/`TOTAL`이 세로로 깨지던 문제 — `doc-meta-row`로 다시 한 줄 정렬.
- Abacus 조회수 키가 한글 경로·슬래시를 포함해 CORS(308)로 실패하던 문제. Notion ID 또는 pathname SHA 해시(`^[A-Za-z0-9_\-.]{3,64}$`)만 사용.
- about 본문 영문을 홈과 동일한 JetBrains Mono(`--font-display`)로 표시.

## v0.17.1 - 2026-07-21

### Changed
- about·env 페이지에서는 Giscus 댓글을 표시하지 않음(섹션 문서에만 표시).

## v0.17.0 - 2026-07-21

### Added
- 문서 메타에 Abacus 기반 포스트별 조회수 표시(`생성일`/`업데이트` 뒤 `조회수 N`). pathname을 키로 사용한다.

### Changed
- 문서 메타에서 읽기 시간(`N분 소요`) 제거, 카테고리·태그는 날짜/조회수 다음 줄로 분리.
- 카테고리 섹션(os, server 등) 문서의 topic path를 `./os` → `./categories/os` 형식으로 변경. `posts`·about·env는 기존 표기 유지.
- `posts` 섹션/문서 topic path를 `./posts`로 명시.
- 홈 칩 라벨에서 `./` 제거 (`about` / `posts` / `tags`).
- about 본문에 홈과 동일한 Inter 웹폰트 적용.

## v0.16.1 - 2026-07-21

### Fixed
- Giscus Discussion 카테고리를 `Announcements`(관리자만 생성 가능)에서 `General`로 변경. 첫 댓글 시 Discussion 자동 생성이 막히던 문제를 해소한다.

## v0.16.0 - 2026-07-21

### Added
- 문서 페이지(`page.html`) 하단에 [Giscus](https://giscus.app) 댓글 연동. GitHub Discussions(`Announcements` 카테고리)에 저장되며, 다크 테마(`transparent_dark`)·한국어·pathname 매핑·lazy loading을 사용한다.

## v0.15.1 - 2026-07-21

### Fixed
- notion-sync가 삭제된 child_page/공유되지 않은 하위 블록(`object_not_found`)에서 전체 동기화를 중단하던 문제 수정. 해당 블록·페이지는 경고 후 건너뛰고 나머지를 계속 처리한다. (운영 builder 주기 갱신이 이 때문에 사실상 멈춰 있었음)

## v0.15.0 - 2026-07-18

### Added
- 홈 화면 `SINCE 2019` 옆에 구분점(&middot;)과 함께 `TODAY`/`TOTAL` 조회수 표시 추가. 무료 카운터 API([Abacus](https://abacus.jasoncameron.dev/))를 클라이언트에서 호출해 오늘 방문 수와 누적 방문 수를 집계.

## v0.14.1 - 2026-07-18

### Fixed
- GitHub 저장소 이름을 `wiki`에서 `nugawiki`로 변경한 것에 맞춰, 로컬 작업 폴더명도 `nugawiki`로 리네임하고 git remote URL, 배포 워크플로우의 `DEPLOY_DIR`(`/volume1/Develop/Sites/nugawiki`), README 디렉터리 구조 표기를 함께 갱신.

## v0.14.0 - 2026-07-18

### Added
- 512x512 앱 아이콘(`static/app-icon-512.png`, 헤더 브랜드 마크를 검정 배경에 확대) 추가.
- 소셜 공유용 메타 이미지(`static/nugawiki_meta.jpg`, 1200x630)를 `[og] default_image`로 등록.

### Changed
- 홈(`/`) 브라우저 탭 타이틀을 `Hello, nugawiki! :: NUGAWIKI` 대신 `NUGAWIKI`만 표시하도록 변경.
- 홈 화면 하단 여백 축소 — 사이드바가 `100vh` 고정 높이를 강제해 카테고리 카드 아래로 큰 공백이 생기던 것을, 홈에서만 사이드바/레이아웃이 콘텐츠 길이에 맞게 줄어들도록 수정(다른 페이지의 스티키 사이드바/푸터 동작은 그대로 유지).

## v0.13.0 - 2026-07-18

### Added
- 사이드바 메뉴를 `~/main`, `~/about`, `~/posts`, `./categories`, `browse --tags`, `~/.env`로 재구성.
- `about` 페이지 신규 작성(사진 로컬 서빙, INTJ 소개, 소셜 링크 — 전부 새 탭으로 열림).
- 홈 화면을 "Hello, nugawiki!" 타이틀 + Posts 미리보기(최신 2~3개, 카테고리 그리드와 다른 레이아웃) + 카테고리 카드로 재구성. 카드에 문서 수(N posts) 표시.
- `~/.env` 설정 페이지 추가: 코드블럭 줄바꿈(기본 on)/줄번호(기본 off) 토글을 `localStorage`에 저장하고 전 페이지에 반영.
- 문서 본문에 목차(TOC) 렌더링, 소제목 옆 링크 복사 버튼, 코드블럭 우측 상단 복사 버튼과 줄번호 거터를 추가.
- 카테고리 목록 페이지에 태그 필터 칩(클릭 시 즉시 필터링) 추가.
- 페이지 타이틀에 헤더 브랜드와 동일한 깜빡이는 커서 효과 추가(main/about/posts/카테고리/tags).

### Fixed
- `html`/`body`에 중복 설정된 `overflow-x: hidden`이 `position: sticky`(목차 사이드바)를 깨뜨리던 문제 수정.
- 코드블럭 배경이 highlight.js 테마와 이중 박스로 보이던 문제 수정.
- 코드 줄번호가 줄바꿈된 긴 줄과 어긋나던 문제 수정 — 줄마다 번호+내용을 한 행으로 묶어 렌더링. highlight.js가 `DOMContentLoaded`에서 한 번 더 재하이라이트하며 이 구조를 지우던 경쟁 조건도 함께 수정(`setTimeout`으로 지연 실행).
- 정적 자산(css/js) 캐시 무효화를 위해 `?v=` 쿼리스트링 추가.

## v0.12.0 - 2026-07-18

### Added
- 고정 카테고리 순서를 OS, SERVER, BACK-END, FRONT-END, DEV-OPS, TECH로 재조정.
- Notion "카테고리" 속성 값이 `Post`인 페이지를 위한 별도 대분류 `posts`를 추가. 사이드바 "./categories" 목록에는 노출되지 않고 `~/posts` 메뉴로만 접근한다.
- 모든 동기화 문서 front matter에 `toc = true`를 추가해 본문 목차(table of contents)가 생성되도록 함.

### Changed
- `content/*.md`를 최신 Notion 상태로 재동기화(카테고리 재배치, posts 신규 3건 반영).

## v0.11.4 - 2026-07-17

### Fixed
- `builder`가 공유 볼륨에 쓴 정적 자산(css/js/svg)을 `wiki`(nginx, non-root) 컨테이너가 403 Permission Denied로 못 읽던 문제 수정. `build-loop.sh`가 `hwaro build` 직후 `chmod -R a+rX /site/public`으로 world-readable을 명시적으로 보장한다.

### Verified
- 로컬에서 `/`, `/css/style.css`, `/js/site.js`, `/js/search.js`, `/favicon.svg` 전부 200 확인.

## v0.11.3 - 2026-07-17

### Fixed
- 운영 접속 포트 기본값을 1731에서 **1729로 통일**(개발/운영 동일). 리버스 프록시가 1729를 바라보고 있었는데 컨테이너가 1731에 떠서 wiki.nugabox.com이 502를 반환하던 문제를 해결.

### CI/CD
- self-hosted 러너(marrifin과 동일한 `nugacloud`) 기반 배포 워크플로우(`.github/workflows/deploy.yml`)를 추가하고 실제 push로 검증. 이 과정에서 두 가지 버그를 실전에서 발견·수정: (1) Debian `apt nodejs/npm`이 수천 개의 무관한 패키지를 끌어와 저사양 호스트에서 사실상 멈춘 것처럼 보이던 문제, (2) 첫 배포 시 불필요한 nginx reload 시도가 pid 파일 부재로 실패해 배포 전체가 실패 처리되던 문제.

## v0.11.2 - 2026-07-17

### Fixed
- `Dockerfile.dev`/`Dockerfile.builder`에서 `apt-get install nodejs npm`을 제거. Debian trixie에서 이 패키지들이 eslint/webpack 등 수천 개의 무관한 `node-*` 패키지를 함께 끌어와 저사양 호스트(NAS 등)에서 빌드가 사실상 멈춘 것처럼 보일 만큼 느려지는 문제가 있었다. 대신 공식 `node:20-slim`(Debian 기반, glibc 호환) 이미지에서 `node`/`npm` 바이너리만 멀티스테이지 `COPY`로 가져온다.

### Verified
- 로컬에서 `Dockerfile.builder` 재빌드 시간이 극적으로 단축됨을 확인(수십 초 내), node/npm/hwaro 바이너리 정상 동작, 전체 `./compose.sh up` 사이클(46건 동기화 + build)도 정상 완료 확인.

## v0.11.1 - 2026-07-17

### Changed
- 홈 화면 타이틀 위 `./about` 브레드크럼 제거.
- 푸터를 `$ whoami - Nuga Jang` + GitHub 아이콘(https://github.com/nugaBox 링크)으로 변경.
- 저작권 줄을 `© <연도> NUGABOX`(nugabox.io 링크) · built with Hwaro로 변경. 연도는 Hwaro의 `current_year` 대신 `static/js/site.js`에서 `new Date().getFullYear()`로 클라이언트에서 채운다.

## v0.11.0 - 2026-07-17

### Added
- 운영 모드에 콘텐츠 자동 갱신 도입: `builder` 컨테이너(`Dockerfile.builder` + `scripts/build-loop.sh`)가 notion-sync + hwaro build를 `SYNC_INTERVAL_SECONDS`(기본 900초) 주기로 반복 실행해 공유 볼륨(`public_data`)에 쓴다.
- `wiki`(nginx) 컨테이너는 그 볼륨을 읽기 전용으로 마운트해 서빙만 한다 — Docker 소켓을 마운트하는 방식 대신 공유 볼륨 방식을 택해 컨테이너에 호스트 제어권을 주지 않는다.
- Notion에서 `배포`를 체크하면 이미지 재빌드 없이 다음 주기 안에 자동 반영된다. templates/static/config.toml/scripts 변경은 기존처럼 `./compose.sh down && up` 재빌드가 필요(원칙 유지).
- `NOTION_TOKEN`/`NOTION_DB_ID`는 `builder`의 런타임 환경변수로만 존재하고 이미지 레이어에 전혀 기록되지 않으며, `wiki` 컨테이너에는 전달되지 않는다.

### Removed
- 단일 빌드 시점 동기화만 지원하던 기존 `Dockerfile`을 제거(`Dockerfile.builder`로 대체).

### Verified
- 실제 `.env`로 `./compose.sh up` 실행, builder 첫 주기에서 46건 동기화 + hwaro build + nginx 200 확인. `SYNC_INTERVAL_SECONDS=20`으로 재실행해 두 번째 주기까지 정상 반복(reconciliation 0건, 에러 없음)되는 것도 확인.

## v0.10.1 - 2026-07-17

### Changed
- 홈 화면 타이틀을 "NUGAWIKI"(전체 대문자)에서 "About nugawiki"(alder의 상세 페이지 타이틀 스타일)로 변경, `hero-title--home`으로 크기를 살짝 축소.
- 홈 화면에 `./about` 브레드크럼과 "SINCE 2019 · N개 카테고리 · N개 문서" 메타 정보 줄을 추가(카테고리/문서 수는 `sum(attribute="pages_count")`로 동적 계산).

## v0.10.0 - 2026-07-17

### Changed
- 카테고리 분류를 Notion의 "카테고리" 속성 대신 고정된 6개 카테고리(OS/SERVER/BACK-END/FRONT-END/DEV-OPS/TECH)와 태그→카테고리 매핑으로 결정하도록 변경. Notion 스키마는 건드리지 않고 `scripts/notion-sync.mjs`의 `TAG_TO_CATEGORY` 테이블로만 처리한다.
- 매칭되는 태그가 없는 페이지는 TECH로 폴백.
- notion-sync가 매 실행마다 6개 고정 카테고리의 `_index.md`를 갱신해, 문서가 아직 없는 카테고리도 항상 사이드바/홈에 노출되도록 함(`extra.source = "fixed-category"`).
- `site.sections` 정렬 기준을 `title`에서 Section의 `weight`로 변경해 카테고리 노출 순서를 고정(OS→SERVER→BACK-END→TECH→DEV-OPS→FRONT-END).
- 사용하지 않던 `getCheckbox` 헬퍼 제거.

### Notion
- DEV-WIKI에서 "정리 완료"가 체크된 47개 페이지의 "배포"를 MCP로 일괄 체크(스키마 변경 없음).

### Verified
- 실제 `.env`로 `--dev up` 재실행, 46개 문서가 고정 카테고리로 정확히 분류되어 동기화됨(OS 23 · SERVER 12 · BACK-END 1 · TECH 2 · DEV-OPS 4 · FRONT-END 4). Notion 이미지 다운로드(20개, 3.1MB), 다중 카테고리 배지, 태그, TOC까지 실제 문서로 확인.

## v0.9.0 - 2026-07-17

### Changed
- alder 스타일을 손으로 재도색하는 대신, Hwaro 공식 원격 스캐폴드 기능(`hwaro init --scaffold github:hahwul/hwaro-examples/examples/alder`)으로 실제 alder CSS/JS/페이지 셸을 임포트했다.
- alder 원본은 홈랩 랙(노드/스위치/CPU·RAM 스펙) 전용 데모라, `home.html`/`page.html`/`section.html`/`taxonomy*.html`/`404.html`의 콘텐츠 로직을 Notion 기반 카테고리/태그 데이터 모델에 맞게 새로 작성했다(디자인 토큰·컴포넌트 CSS·검색 팔레트·JS는 원본 그대로).
- 사용하지 않는 `spec-strip`(CPU/RAM) CSS를 제거하고, notion-sync 콜아웃 매핑에 맞는 `.admonition` 스타일과 AdSense `.ad-slot` 스타일을 추가했다.
- 기존 docs 스캐폴드 잔재(`templates/partials/nav|search|sidebar.html`, `templates/shortcodes/alert.html`)를 제거했다.
- `page.taxonomies.categories`로 카테고리 배지 접근자를 수정했다(`page.categories`는 렌더링되지 않는 버그였음).
- 로컬 접속 포트를 사용자 요청에 맞춰 개발=1729, 운영=1731로 재배치했다.

### Verified
- 실제 `.env` 자격증명으로 `--dev up`/`up` 모두 재빌드해 홈(카테고리 카드), 상세(콜아웃/표/코드/카테고리·태그 배지/원문 링크), 섹션·태그·카테고리 목록, Ctrl+K 검색 팔레트(fuse.js 실 인덱스)까지 전부 직접 확인.

## v0.8.0 - 2026-07-17

### Added
- README.md: 아키텍처 다이어그램, 디렉터리 구조, 로컬 실행법(.env 설정 + compose.sh 사용법), 배포 방법, 참고 문서 링크 작성.
- `.env.example`에 `DEV_PORT`/`PROD_PORT` 항목 추가.

## v0.7.0 - 2026-07-17

### Added
- `compose.sh`: `[--dev] up|down` 인자 파싱(순서 무관), 잘못된 조합/중복 액션은 사용법 출력 후 종료. `.env` 부재 시 경고, `docker` 미설치 시 안내.
- 운영은 `docker-compose.yml`, 개발은 `docker-compose.dev.yml`을 각각 `up -d --build`/`down`으로 제어.

### Verified
- 실제 `.env`(NOTION_TOKEN/NOTION_DB_ID)로 네 가지 시나리오를 모두 실행 확인:
  - `--dev up`: 실제 Notion 데이터소스 인증·조회 성공(현재 배포 체크된 페이지 0건), `hwaro serve` 정상 기동.
  - `--dev down`: 컨테이너·네트워크 정리 확인.
  - `up`: notion-sync -> hwaro build -> nginx 3-스테이지 빌드 성공, `curl localhost:1729` 200 확인.
  - `down`: 컨테이너·네트워크 정리 확인.
  - 인자 오류(없음/미지정 조합/알 수 없는 인자)는 모두 exit 1과 사용법 안내로 처리됨을 확인.

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
