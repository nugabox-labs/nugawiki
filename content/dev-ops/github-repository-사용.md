+++
title = "GitHub Repository 사용"
date = "2022-06-25T17:45:00.000Z"
updated = "2023-03-11T13:18:00.000Z"
categories = ["DEV-OPS"]
tags = ["GIT/SVN"]

[extra]
source = "notion"
notion_id = "1b99c9ef-672c-4657-8ad2-dc57d19ee300"
notion_url = "https://app.notion.com/p/GitHub-Repository-1b99c9ef672c46578ad2dc57d19ee300"
+++

# 환경 세팅

## 1. Config

### 초기화

```bash
git config --global init.defaultBranch main
git config --global user.name "가민정보시스템 개발팀"
git config --global user.email "comindevelop@gmail.com"
```

### 추가 옵션

```bash
git config --global color.ui auto
git config --global alias.st status
```

### 설정 내용 보기

```bash
git config -l
```

## 2. Repository 연결 및 Pull/Push

### 원격 저장소에 아무 것도 없는 경우

```bash
echo "# Test" >> README.md
git init
git add README.md
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/comin-inc/Test.git
git push -u origin main
# git push -u 옵션 사용 후에는 git push만 입력해도 됨
```

### 원격 저장소에 README.md만 생성된 경우

```bash
git init
git remote add origin <주소>
git branch -M main
git pull origin main (README.md 다운로드)
git add .
git commit -m "Initial commit"
git push -u origin main
```

### 이미 생성된 디렉토리에 원격 저장소를 다운로드할 때

```bash
git clone <주소>
# 또는
git remote add origin <주소>
git branch -M main
git pull origin main
```

### 현재 연결되어 있는 원격 저장소 확인

```bash
git remote -v
	origin  https://github.com/IfUwanna/Tool.git (fetch)
	origin  https://github.com/IfUwanna/Tool.git (push)
```

### 해당 원격 저장소의 연결을 제거

```bash
git remote remove <name>
git remote remove origin
```

### 특정 branch에서 클론

```bash
git clone -b <branch> --single-branch <주소>
```

## Trouble Shooting

- 403 Forbidden Error
  - 접근 권한이 없으므로 주소를 수정 (아이디@주소)
    - `https://comindevelop@github.com/comin-inc/Framework-cmd-center.git`
- Password 자동 입력 (저장)
  - `git config credential.helper store`
  - .git/config에 있는 remote.origin.url의 주소에 token을 설정한다 (아이디:token@주소)
    - `https://comindevelop:ghp_adoasdfadfasasdfYYc7vxFL1Ro2f3Dmc@github.com/comin-inc/Framework-cmd-center.git`

# Branch

## 로컬 저장소

### 신규 Branch 생성

```bash
git branch dev
git chechout dev
	Switched to branch 'dev'
```

### 신규 브랜치 생성과 동시에 체크아웃

```bash
git checkout -b dev
	Switched to branch 'dev'
```

## 원격 저장소

### 신규 Branch 생성

`remote add` 명령어를 사용해 원격저장소를 지정해 준 뒤 `git push origin <브랜치명>` 명령어를 사용하여 PUSH

```bash
git remote add origin https://github.com/nugabox/branchTest
git push origin dev
	Total 0 (delta 0), reused 0 (delta 0)
	remote:
	remote: Create a pull request for 'dev' on GitHub by visiting:
	remote: https://github.com/nugabox/branchTest/pull/new/dev
	remote: To https://github.com/nugabox/branchTest
```

### Branch 목록 조회

```bash
git branch      // 로컬 브랜치 목록 조회
git branch -r   // 원격 브랜치 목록 조회
git branch -a   // 모든 브랜치 목록 조회

git branch 
* master
  newbranch
  dev

git branch -r
  origin/master
  origin/dev

git branch -a
* master
  newbranch
  dev
  origin/master
  origin/dev
```

# 사용 명령어

### 저장소에서 파일 및 폴더 삭제

```bash
# 삭제 전 테스트 (삭제될 파일 리스트 보기)
git rm --dry-run 파일명

# 원격 저장소에 있는 파일 삭제
git rm --cached -r 파일명

# 모든 폴더의 특정 파일 삭제 (예) .DS_Store
git rm --cached -r */.DS_Store
```
