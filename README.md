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
- **배포**: 운영은 `builder`(notion-sync + hwaro build를 주기적으로 반복해 공유 볼륨에 쓰는 컨테이너) + `wiki`(그 볼륨을 그대로 서빙하는 nginx 컨테이너) 2개 서비스로 구성됩니다. Notion 콘텐츠는 이미지 재빌드 없이 다음 주기(기본 15분)에 자동 반영되고, 템플릿/코드 변경은 여전히 `./compose.sh down && up` 재빌드가 필요합니다. 개발은 소스를 바인드 마운트한 `hwaro serve` 라이브 리로드 컨테이너입니다.

## 디렉터리 구조

```
nugawiki/
├── scripts/notion-sync.mjs   # Notion -> content/*.md 동기화
├── scripts/dev-entrypoint.sh # 개발 컨테이너 진입점(hwaro serve, sync 없음)
├── scripts/build-loop.sh     # 운영 builder 진입점(sync + build 반복)
├── content/                  # 동기화 산출물 + 수기 문서
├── templates/                # Hwaro 템플릿(alder 임포트 + 카테고리/태그 대응, AdSense 자리 포함)
├── static/                   # CSS/JS/favicon + notion-assets(동기화된 이미지)
├── config.toml                # Hwaro 사이트 설정
├── Dockerfile.builder           # 운영 builder: notion-sync -> hwaro build 반복
├── Dockerfile.dev               # 개발: hwaro serve 라이브 리로드
├── docker-compose.yml          # 운영(builder + nginx, 공유 볼륨)
├── docker-compose.dev.yml      # 개발(바인드 마운트)
├── compose.sh                  # 운영/개발 기동·정지 스크립트
├── nginx.conf                  # 운영 정적 서빙 설정
├── .env.example                 # NOTION_TOKEN, NOTION_DB_ID, SYNC_INTERVAL_SECONDS
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

`content/`, `templates/`, `static/`, `config.toml`, `scripts/`가 컨테이너에 바인드 마운트되어 저장 즉시 반영됩니다(재시작 불필요). 컨테이너 시작 시 sync 없이 기존 `content/`로 `hwaro serve`가 바로 포그라운드로 뜹니다. Notion 동기화는 운영(builder) 컨테이너에서만 수행됩니다.

### 3. 운영 모드

```bash
./compose.sh up      # 빌드 + 기동, http://localhost:1729
./compose.sh down    # 정지 + 제거
```

`builder` 컨테이너가 `notion-sync` → `hwaro build --minify`를 **기본 15분마다 반복 실행**해 결과물을 공유 볼륨(`public_data`)에 쓰고, `wiki`(nginx) 컨테이너는 그 볼륨을 그대로 서빙합니다. 즉 Notion에서 `배포`를 체크하면 이미지 재빌드 없이 다음 주기 안에 자동으로 사이트에 반영됩니다. 반면 **템플릿/코드(templates, static, config.toml, scripts)를 바꾼 뒤에는 여전히 재빌드가 필요**합니다(`./compose.sh down && ./compose.sh up`) — `builder` 이미지 자체에 그 파일들이 빌드 시점에 고정되기 때문입니다. `NOTION_TOKEN`/`NOTION_DB_ID`는 `builder` 컨테이너의 런타임 환경변수로만 존재하고 어떤 이미지 레이어에도 기록되지 않으며, `wiki`(nginx) 컨테이너에는 아예 전달되지 않습니다.

동기화 주기는 `.env`의 `SYNC_INTERVAL_SECONDS`(기본 900초 = 15분)로 조정합니다. 접속 포트는 개발/운영 상관없이 **1729로 통일**되어 있습니다(`.env`의 `DEV_PORT`/`PROD_PORT`로 조정 가능하지만, 같은 머신에서 개발·운영을 동시에 띄우면 포트가 충돌하니 하나씩만 띄우세요).

## 배포

운영 서버에서는 위 "운영 모드"로 컨테이너를 띄운 뒤, 서버의 리버스 프록시(nginx)가 `wiki.nugabox.com` → `127.0.0.1:${PROD_PORT:-1729}`로 연결합니다. `config.toml`의 `base_url`이 `https://wiki.nugabox.com`으로 고정되어 있으므로, 로컬에서 운영 이미지를 직접 열어보면 정적 자산 링크가 실제 도메인을 가리켜 그대로는 동작하지 않습니다(개발 확인은 `--dev up`을 사용하세요).

## 참고 문서

- [Hwaro 공식 문서](https://hwaro.hahwul.com)
- [Hwaro GitHub](https://github.com/hahwul/hwaro)
- [Hwaro Examples (alder)](https://github.com/hahwul/hwaro-examples/tree/main/examples/alder)
- [Notion SDK for JavaScript](https://github.com/makenotion/notion-sdk-js)
- 프로젝트 운영 규칙: [AGENTS.md](AGENTS.md)
- 변경 이력: [CHANGELOG.md](CHANGELOG.md)
