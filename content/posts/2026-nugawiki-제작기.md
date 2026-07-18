+++
title = "2026 NUGAWIKI 제작기"
date = "2026-07-18T09:00:00.000+09:00"
updated = "2026-07-17T23:51:00.000Z"
categories = ["posts"]
tags = []
toc = true

[extra]
source = "notion"
notion_id = "3a0aac4e-32a5-8155-a8ba-ee8f3e95300e"
notion_url = "https://app.notion.com/p/2026-NUGAWIKI-3a0aac4e32a58155a8baee8f3e95300e"
+++

> Be Classy Developer

# 갈라진 기록

2022년 봄, '기록과 정리'라는 습관에 이끌려 정착 기준을 세운 적이 있다. 스크랩 후 빠른 정리는 Notion으로, 기술 공유와 매뉴얼 작성은 GitHub Pages(jekyll/Chirpy)로 나누는 방식이었다. 마크다운을 지원하고, 스크랩이 쉽고, 배포용은 수익화까지 가능해야 한다는 기준으로 고른 조합이었고, 실제로 4년 가까이 잘 굴러갔다.

다만 시간이 지나며 이 분리 구조의 이음매가 점점 거슬리기 시작했다. Notion 쪽은 어느 순간부터 Cloudflare Worker로 페이지 하나를 그대로 렌더링해 `wiki.nugabox.io`라는 이름을 붙여 서비스하고 있었다. 스크랩과 기록은 편했지만, 결국 Notion 페이지 하나를 정적으로 흉내 낸 것이라 카테고리 구조도, 목록 페이지도, 검색도 없었다. 반대로 GitHub Pages 쪽(nugalog)은 jekyll Chirpy 테마 위에서 제대로 된 블로그 형태를 갖췄지만, 이미 Notion에 기록해둔 내용을 다시 마크다운으로 옮겨 적어야 글이 됐다. 같은 지식을 두 번 쓰는 셈이었고, 결국 어느 순간부터 nugalog 쪽 갱신은 뜸해졌다.

# 통합의 기준

두 서비스를 오가며 쌓인 불편은 명확했다.

> 1. 기록은 Notion 한 곳에서만 하고, 다시 옮겨 적는 과정이 없어야 한다.

> 2. 사이트는 카테고리·태그로 제대로 분류되고, 검색이 가능해야 한다.

> 3. `배포` 체크박스 하나로 노출 여부가 결정되는, 단일한 원본(source of truth)이 있어야 한다.

> 4. 직접 서버를 운영하더라도 배포 파이프라인은 최대한 단순해야 한다.

# NUGAWIKI

이 기준을 따라 만든 것이 지금의 **NUGAWIKI**다. 구조는 단순하다.

```javascript
Notion(DEV-WIKI) --notion-sync.mjs--> content/*.md --hwaro build--> public/ --nginx--> wiki.nugabox.com
```

Notion의 `DEV-WIKI` 데이터베이스를 유일한 원본으로 삼고, `notion-sync.mjs` 스크립트가 `@notionhq/client`로 Notion 블록을 직접 마크다운으로 변환한다. 별도의 변환 라이브러리 없이 문단·목록·코드블록·표·콜아웃까지 직접 파싱하도록 짰다. 이름/카테고리/태그/PublishDate 같은 속성은 프론트매터로 매핑되고, `배포` 체크박스가 true인 페이지만 사이트에 노출된다. Notion에 올린 이미지는 서명 URL이라 언젠가 만료되므로, 동기화 시점에 `static/notion-assets/`로 내려받아 고정 경로로 바꿔둔다.

정적 사이트 생성기로는 [Hwaro](https://hwaro.hahwul.com/)를 골랐다. Crystal로 짜인 가볍고 빠른 SSG인데, 공식 예제 스캐폴드(alder)를 그대로 가져와 CSS·JS·페이지 뼈대는 그대로 쓰고, 사이드바·홈·목록 로직만 Notion 기반 카테고리/태그 모델에 맞게 새로 짰다. 카테고리는 태그 하나하나를 다시 고민하지 않도록 OS/SERVER/BACK-END/FRONT-END/DEV-OPS/TECH 여섯 개로 고정해두고, 태그를 이 여섯 개로 매핑하는 규칙만 스크립트에 두었다.

배포는 Docker Compose로 자체 호스팅한다. `builder` 컨테이너가 `notion-sync` → `hwaro build`를 주기적으로 반복해 공유 볼륨에 쓰고, `wiki`(nginx) 컨테이너는 그 볼륨을 그대로 서빙한다. Notion에서 `배포`를 체크하면 이미지를 다시 빌드하지 않아도 다음 주기 안에 자동으로 사이트에 반영된다. 반면 템플릿이나 스크립트처럼 코드에 해당하는 부분은 여전히 이미지 재빌드가 필요하다 — 이 경계를 명확히 나눠둔 덕에 콘텐츠 갱신과 코드 배포를 서로 신경 쓰지 않고 다룰 수 있게 됐다.

# 두 개를 하나로

[wiki.nugabox.io](http://wiki.nugabox.io/)와 nugalog는 이제 이 프로젝트 하나로 합쳐졌다. 기록은 여전히 Notion 한 곳에서 하지만, 그 결과물은 카테고리와 태그로 제대로 정리된 하나의 위키 겸 블로그로 나온다. 지금 읽고 있는 이 글도 그 결과물 중 하나다 — 예전 nugalog에 남겨뒀던 글들처럼 '기록과 정리'를 남기는 성격의 글은 여섯 개의 기술 카테고리와는 결이 다르다고 판단해, 이번에 `POST`라는 대분류를 따로 두고 `~/post` 메뉴로 묶었다.

# 마무리

2022년의 정착기에서 이미 예상했던 대로, 짧은 기록들이 모이고 정리되면 그 자체로 가치가 생긴다. 이번 통합은 그 기록을 다시 한 곳으로 모으는 작업이었을 뿐, 원칙은 그대로다 — 기록되지 않은 것은 기억되지 않는다.
