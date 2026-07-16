# AGENTS.md - AI Agent Instructions for Hwaro Site

This document provides instructions for AI agents working on this Hwaro-generated website.

## Project Overview

This is a static website built with [Hwaro](https://github.com/hahwul/hwaro), a fast and lightweight static site generator written in Crystal.

## Essential Commands

| Command | Description |
|---------|-------------|
| `hwaro build` | Build the site to `public/` directory |
| `hwaro serve` | Start development server with live reload |
| `hwaro new <path>` | Create new content from archetype |
| `hwaro deploy` | Deploy the site (requires configuration) |
| `hwaro build --drafts` | Include draft content |
| `hwaro serve -p 8080` | Serve on custom port (default: 3000) |
| `hwaro build --base-url "https://example.com"` | Set base URL for production |

## Directory Structure

```
.
├── config.toml          # Site configuration
├── content/             # Markdown content files
│   ├── index.md         # Homepage (single file, no underscore)
│   ├── about.md         # Standalone page
│   └── <section>/       # Section directory (posts/, guide/, chapter-1/, …)
│       ├── _index.md    # Section landing page (underscore-prefixed)
│       └── *.md         # Pages within the section
├── templates/           # Jinja2 templates (Crinja)
│   ├── header.html      # Shared <head> + <body> open
│   ├── footer.html      # Shared <body>/<html> close
│   ├── page.html        # Page template
│   ├── section.html     # Section listing template
│   ├── 404.html         # Not-found page
│   ├── partials/        # Reusable fragments (nav, search, sidebar)
│   └── shortcodes/      # Shortcode templates
├── static/              # Static assets (copied as-is)
└── archetypes/          # Content templates for `hwaro new`
```

## Notes for AI Agents

1. **Front matter** can be TOML (`+++`), YAML (`---`), or JSON (`{...}` at file start). Pick one per file and keep delimiters matched.
2. **Rendered content** is `{{ content }}` in templates (already-safe HTML — no extra `| safe` needed).
3. **Custom metadata** is `page.extra.field`, not `page.params.field`.
4. **Always preview** with `hwaro serve` before committing.
5. **Validate front matter syntax** (TOML, YAML, or JSON) and `config.toml` after edits.
6. **Use `{{ base_url }}` prefix** for URLs in templates.
7. **Escape user content** with `{{ value | e }}` (or `| escape`) in templates.

## Full Reference

For detailed documentation on content, templates, configuration, and more:

- [Hwaro Documentation](https://hwaro.hahwul.com)
- [Configuration Guide](https://hwaro.hahwul.com/start/config/)
- [Full LLM Reference](https://hwaro.hahwul.com/llms-full.txt) — comprehensive reference optimized for AI agents

To generate the full embedded AGENTS.md locally, run:
```
hwaro tool agents-md --local --write
```

## Site-Specific Instructions

### 버전 관리
- SemVer, `v0.1.0`부터 시작.
- 기능 하나가 구현될 때마다 minor 버전업 (0.1.0 → 0.2.0 → 0.3.0 …).
- 버그 수정은 patch 버전업.
- 모든 버전업은 `CHANGELOG.md`에도 기록한다.

### 커밋 규칙
- [Conventional Commits](https://www.conventionalcommits.org/) 형식을 따른다.
- 기능 단위로 작게 커밋한다.

### 커밋·푸시 타이밍
- 기능 하나가 끝날 때마다 즉시 커밋 + push한다. 작업을 누적하지 않는다.

### 변경 보고 (필수)
- 코드를 수정한 뒤에는 매번 한국어로 무엇을 왜 바꿨는지 간략히 보고한다.
- 예: "notion-sync 스크립트에 reconciliation 로직 추가함 — 배포 체크 해제 시 기존 md 파일 삭제되도록 함."
- 보고 없이 조용히 다음 작업으로 넘어가지 않는다.

### Docker Compose 원칙
- 운영/개발 모드를 별도 브랜치나 분기 로직 없이 compose 파일 두 개(`docker-compose.yml`, `docker-compose.dev.yml`) + `compose.sh` 하나로 통일한다.
- `./compose.sh up` / `down` = 운영(prod). 빌드된 이미지 기반이며, 변경 사항을 반영하려면 재빌드가 필요하다.
- `./compose.sh --dev up` / `down` = 개발(dev). 바인드 마운트 + 라이브 리로드로 즉시 반영된다.
- 개발 모드에서도 실수로 운영 데이터/도메인에 영향을 주지 않도록 포트·네트워크를 분리한다.

### 동기화 원칙
- Notion이 유일한 원본(source of truth)이다.
- `source = "notion"` 마커가 있는 문서는 직접 수정하지 않는다. 재동기화로만 갱신한다.
- `배포` 체크박스가 사이트 노출 여부를 결정하는 단일 기준이다.

### 비밀정보
- `.env`는 절대 커밋하지 않는다 (`.gitignore`에 등록되어 있음).
- 빌드 인자로 넘긴 `NOTION_TOKEN`/`NOTION_DB_ID`가 최종 이미지 레이어에 남지 않도록 멀티스테이지 빌드로 격리한다.

### 불확실성 처리
- Hwaro/Notion 라이브러리의 API·플래그가 불확실하면 지어내지 말고 공식 문서(https://hwaro.hahwul.com , https://github.com/hahwul/hwaro , https://github.com/makenotion/notion-sdk-js)를 확인하거나 사용자에게 질문한다.