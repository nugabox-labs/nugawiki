+++
title = "Git 서브모듈, 서브트리"
date = "2025-01-07T07:38:00.000Z"
updated = "2025-01-07T07:48:00.000Z"
categories = ["DEV-OPS"]
tags = ["GIT/SVN"]

[extra]
source = "notion"
notion_id = "174aac4e-32a5-80b5-bdc0-cd270c3eaf58"
notion_url = "https://app.notion.com/p/Git-174aac4e32a580b5bdc0cd270c3eaf58"
+++

# 서브모듈 설정

### 1. 원격 레포지토리를 서브모듈로 추가

```shell
git submodule add https://github.com/nugaBox/search.git pg/search
```

### 2. 상위 레포지토리에 변경사항 커밋

```shell
git add .gitmodules pg/search
git commit -m "Add search as a submodule"
```

### 3. **서브모듈 추가 후 초기화 및 업데이트**

```bash
git submodule update --init --recursive
```

### 4. **서브모듈 변경사항 반영**

pg/search 폴더에서 작업한 후, **서브모듈 변경사항을 커밋하고 푸시**합니다.

```bash
cd pg/search
git add .
git commit -m "Update search functionality"
git push origin main
```

상위 레포지토리로 돌아와 서브모듈 업데이트 상태를 반영합니다.

```bash
cd ../../
git add pg/search
git commit -m "Update search submodule"
git push origin main
```

# 서브트리 설정

### 1. 원격 레포지토리를 서브트리로 추가

```shell
git subtree add --prefix=pg/search https://github.com/nugaBox/search.git main --squash
```

### 2. 서브트리 레포지토리 commit & push

해당 레포지토리 위치에서 변경사항 이력을 저장하고 반영함.

```shell
git add .
git commit -m "변경사항 이력"
git push origin main
```

### 3. 상위 레포지토리 업데이트 (필요 시)

서브트리 레포지토리에 변경 사항이 생기면 상위 레포지토리에서도 업데이트해야 함.

```shell
git subtree pull --prefix=pg/search <search_레포지토리_URL> main --squash
```

### \* 커밋할 파일이 있는 경우

커밋되지 않은 작업이 중요한 경우 별도의 브랜치에 임시 커밋을 한 후 서브트리를 추가하고 다시 병합할 수도 있음

```shell
git checkout -b temp-save
git add .
git commit -m "Temporary save"
git checkout main
git subtree add --prefix=pg/search <search_레포지토리_URL> main --squash
git merge temp-save
```

## 서브트리 삭제 후 서브모듈 설정

|  |  |
| --- | --- |
| **단계** | **명령어** |
| 서브트리 삭제	 | `git rm -r pg/search` |
| 서브모듈 추가	 | `git submodule add <search_레포지토리_URL> pg/search` |
| 서브모듈 초기화 및 업데이트 | `git submodule update --init --recursive` |
