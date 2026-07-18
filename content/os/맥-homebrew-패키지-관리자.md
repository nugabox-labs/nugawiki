+++
title = "맥 Homebrew 패키지 관리자"
date = "2021-04-06T07:32:00.000Z"
updated = "2024-01-19T07:47:00.000Z"
categories = ["OS"]
tags = ["MACOS"]
toc = true

[extra]
source = "notion"
notion_id = "4efd3b62-9988-4589-9b36-3dc8ae51645c"
notion_url = "https://app.notion.com/p/Homebrew-4efd3b62998845899b363dc8ae51645c"
external_url = "https://brew.sh/index_ko"
+++

[https://brew.sh/index_ko](https://brew.sh/index_ko)

# 설치

---

### 1. Xcode Command line tools 설치

```bash
xcode-select --install
```

### 2. Homebrew 설치

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

### 3. 설치 후 버전 확인

```bash
brew -v
```

### 4. cask 설치

```bash
brew install cask
```

# 명령어

---

### Homebrew 관련

- 버전 확인 : `brew -v`
- 설치 관련 진단 : `brew doctor``(정상 실행 메시지 : Your system is ready to brew)`
- Homebrew 삭제 : `/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/uninstall.sh)"`

### 패키지 관련

- 패키지 검색하기 : `brew search rbenv`
- 패키지 설치하기 : `brew install rbenv`
- cask로 패키지 설치하기 : `brew install --cask rbenv`
- 버전업된 패키지 확인하기 : `brew outdated`
- 패키지 업그레이드 : `brew upgrade rbenv`
- 모든 패키지 업그레이드하기 : `brew upgrade`
- 최신 버전의 해당 패키지만 남겨두기 : `brew cleanup rbenv`
- 패키지 삭제하기 : `brew uninstall rbenv`
- 설치된 패키지 목록 보기 : `brew list`
- 패키지 정보 보기 : `brew info rbenv`

# Trouble Shooting

---

- OpenSSL 구버전에 Dependency가 설정되어 있는 프로그램들 실행 시 오류 발생
- 구버전 설치 방법

```bash
brew tap-new $USER/old-openssl
brew extract --version=1.0.2t openssl $USER/old-openssl
brew install openssl@1.0.2t
```

- 설치 후 라이브러리 폴더 링크 변경

```bash
cd /usr/local/opt
mv openssl openssl_bak
ln -s ../Cellar/openssl@1.0.2t/1.0.2t openssl
```
