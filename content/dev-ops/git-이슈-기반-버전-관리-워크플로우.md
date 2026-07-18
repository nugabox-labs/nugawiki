+++
title = "Git 이슈 기반 버전 관리 워크플로우"
date = "2021-08-10T14:39:00.000Z"
updated = "2024-01-29T08:40:00.000Z"
categories = ["DEV-OPS"]
tags = ["GIT/SVN"]
toc = true

[extra]
source = "notion"
notion_id = "492cd10c-509a-4183-88d7-76f723405600"
notion_url = "https://app.notion.com/p/Git-492cd10c509a418388d776f723405600"
external_url = "https://www.huskyhoochu.com/issue-based-version-control-201"
+++

> Github 이슈 트래커 사용하기
> : 이슈 페이지마다 작업 내역을 타임라인 형식으로 묶어내는 것이 이슈 기반 버전 관리의 핵심

## Github

### Repository

- New Repository (새 레포지토리 생성)
- `master` 브랜치 (default) 생성

### Projects

- New Project (새 프로젝트 생성)
- `To Do` / `In Progress` / `Done` 컬럼 생성 (자동 매칭 옵션 켬)

### Issues

- Labels 생성 : 개발 / 결함 / 지원 등
- Milestones 생성 : 릴리스 목표(기한) 생성
- New Issue (새 이슈 열기)
  - Assignees 지정 : 혼자이면 assign-yourself
  - Labels, Projects, Milestones 등 지정
  - 생성 후 Issue 번호 확인

## Local

1. 작업 폴더 Git 초기화
   ```bash
git init
   ```
1. 원격 저장소 연결
   ```bash
git remote add origin [url]
   ```
1. 작업할 새 브랜치 생성 및 이동
   ```bash
git checkout -b [이슈번호-이슈내용]
   ```
1. 새 작업 브랜치를 원격 저장소로 푸시
   ```bash
git push --set-upstream origin [이슈번호-이슈내용]
   ```
1. 이슈별 작업
1. 커밋과 푸시
   ```bash
git add .
git commit
	[#이슈번호] 이슈 제목
	설명
	Resolves #이슈번호 등을 입력
git push
   ```
1. 메인 브랜치에 병합
   ```bash
git rebase master
git checkout master
git pull --rebase=preserve
git merge [이슈번호-이슈내용]
   ```
1. Github 이슈 닫기
1. 완료한 작업 브랜치 삭제
   ```bash
# 원격 브랜치 삭제
git push origin -d [이슈번호-이슈내용]

# 로컬 브랜치 삭제
git branch -d [이슈번호-이슈내용]
   ```
