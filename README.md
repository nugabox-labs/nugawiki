# NUGAWIKI

기록되지 않은 것은 기억되지 않는다.

Notion(`DEV-WIKI` 데이터베이스)을 유일한 원본으로 하는 기술 위키 겸 기술 블로그입니다. 동기화 스크립트가 Notion API로 콘텐츠를 가져와 Markdown으로 변환하면, [Hwaro](https://hwaro.hahwul.com)(Crystal로 작성된 정적 사이트 생성기)가 정적 사이트로 빌드합니다. 전체 스택은 Docker Compose로 자체 호스팅하며, `wiki.nugabox.com`에 배포합니다.

## 아키텍처

```
Notion(DEV-WIKI) --notion-sync.mjs--> content/*.md --hwaro build--> public/ --nginx--> wiki.nugabox.com
```

- **콘텐츠 원본**: Notion `DEV-WIKI` 데이터베이스. `배포` 체크박스가 true인 페이지만 사이트에 노출됩니다.
- **동기화**: [scripts/notion-sync.mjs](scripts/notion-sync.mjs) — `@notionhq/client`로 Notion 블록을 직접 Markdown으로 변환합니다(별도 변환 라이브러리 미사용). `이름/카테고리/태그/PublishDate/ModifyDate/버전 정보/관련 URL`을 front matter(`title`/`categories`/`tags`/`date`/`updated`/`extra.version`/`extra.external_url`)로 매핑하고, `extra.source = "notion"` 마커를 기준으로 더 이상 대상이 아닌 기존 산출물을 정리(reconciliation)합니다. 마커가 없는 수기 문서는 건드리지 않습니다. Notion에 업로드된 이미지(만료되는 서명 URL)는 `static/notion-assets/`로 다운로드해 고정 경로로 대체합니다.
- **사이트 생성**: `hwaro init --scaffold github:hahwul/hwaro-examples/examples/alder`(Hwaro 공식 원격 스캐폴드 기능)로 [alder 예시](https://examples.hwaro.hahwul.com/alder/)의 CSS/JS/페이지 셸을 그대로 임포트했습니다. alder 원본은 홈랩 랙(노드/스위치) 인벤토리에 특화된 데모라, 사이드바·홈·목록 템플릿의 콘텐츠 로직만 Notion 기반 카테고리/태그 데이터 모델에 맞게 새로 짰습니다(디자인 토큰·컴포넌트 CSS는 그대로).
- **배포**: 운영은 빌드된 정적 파일만 서빙하는 nginx 컨테이너, 개발은 소스를 바인드 마운트한 `hwaro serve` 라이브 리로드 컨테이너로 분리되어 있습니다.

## 디렉터리 구조

```
wiki/
├── scripts/notion-sync.mjs   # Notion -> content/*.md 동기화
├── scripts/dev-entrypoint.sh # 개발 컨테이너 진입점(sync 1회 + hwaro serve)
├── content/                  # 동기화 산출물 + 수기 문서
├── templates/                # Hwaro 템플릿(alder 임포트 + 카테고리/태그 대응, AdSense 자리 포함)
├── static/                   # CSS/JS/favicon + notion-assets(동기화된 이미지)
├── config.toml                # Hwaro 사이트 설정
├── Dockerfile                 # 운영: notion-sync -> hwaro build -> nginx
├── Dockerfile.dev              # 개발: hwaro serve 라이브 리로드
├── docker-compose.yml          # 운영
├── docker-compose.dev.yml      # 개발(바인드 마운트)
├── compose.sh                  # 운영/개발 기동·정지 스크립트
├── nginx.conf                  # 운영 정적 서빙 설정
├── .env.example                 # NOTION_TOKEN, NOTION_DB_ID
├── AGENTS.md                    # 프로젝트 규칙(버전관리/커밋/동기화 원칙 등)
└── CHANGELOG.md
```

## 로컬 실행

### 1. 환경변수 설정

```bash
cp .env.example .env
# .env에 NOTION_TOKEN(Notion Internal Integration Secret), NOTION_DB_ID(DEV-WIKI 데이터베이스 ID) 입력
```

`.env`는 절대 커밋하지 않습니다(`.gitignore`에 등록됨).

### 2. 개발 모드 (라이브 리로드)

```bash
./compose.sh --dev up      # 빌드 + 기동, http://localhost:1729
./compose.sh --dev down    # 정지 + 제거
```

`content/`, `templates/`, `static/`, `config.toml`, `scripts/`가 컨테이너에 바인드 마운트되어 저장 즉시 반영됩니다(재시작 불필요). 컨테이너 시작 시 `notion-sync`가 1회 실행된 뒤 `hwaro serve`가 포그라운드로 뜹니다. `NOTION_TOKEN`/`NOTION_DB_ID`가 없으면 sync는 건너뛰고 기존 `content/`로 서버만 뜹니다.

### 3. 운영 모드

```bash
./compose.sh up      # 빌드 + 기동, http://localhost:1731
./compose.sh down    # 정지 + 제거
```

이미지 빌드 시점에 `notion-sync` → `hwaro build --minify`가 실행되고, 컨테이너는 완성된 정적 파일만 nginx로 서빙합니다. **코드/콘텐츠를 변경한 뒤에는 반드시 재빌드**해야 반영됩니다(`./compose.sh down && ./compose.sh up`). `NOTION_TOKEN`/`NOTION_DB_ID`는 빌드 인자로만 전달되며, notion-sync를 실행하는 중간 스테이지에서만 존재하고 최종 nginx 이미지 레이어에는 남지 않습니다.

포트는 `.env`의 `DEV_PORT`(기본 1729), `PROD_PORT`(기본 1731)로 조정할 수 있습니다.

## 배포

운영 서버에서는 위 "운영 모드"로 컨테이너를 띄운 뒤, 서버의 리버스 프록시(nginx)가 `wiki.nugabox.com` → `127.0.0.1:${PROD_PORT:-1731}`로 연결합니다. `config.toml`의 `base_url`이 `https://wiki.nugabox.com`으로 고정되어 있으므로, 로컬에서 운영 이미지를 직접 열어보면 정적 자산 링크가 실제 도메인을 가리켜 그대로는 동작하지 않습니다(개발 확인은 `--dev up`을 사용하세요).

## 참고 문서

- [Hwaro 공식 문서](https://hwaro.hahwul.com)
- [Hwaro GitHub](https://github.com/hahwul/hwaro)
- [Hwaro Examples (alder)](https://github.com/hahwul/hwaro-examples/tree/main/examples/alder)
- [Notion SDK for JavaScript](https://github.com/makenotion/notion-sdk-js)
- 프로젝트 운영 규칙: [AGENTS.md](AGENTS.md)
- 변경 이력: [CHANGELOG.md](CHANGELOG.md)
