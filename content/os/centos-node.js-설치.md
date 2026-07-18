+++
title = "CentOS Node.js 설치"
date = "2022-05-11T07:03:00.000Z"
updated = "2022-06-25T18:56:00.000Z"
categories = ["OS", "BACK-END"]
tags = ["LINUX", "Node.js"]
toc = true

[extra]
source = "notion"
notion_id = "f7680f46-ac80-4287-83b3-3e13c9e63375"
notion_url = "https://app.notion.com/p/CentOS-Node-js-f7680f46ac80428783b33e13c9e63375"
external_url = "https://lucidmaj7.tistory.com/282"
+++

# 패키지 설치

yum 패키지 매니저를 통해 간편하게 설치합니다.

## 1. 저장소 추가

epel 저장소를 확인하고 설치를 진행합니다.

```bash
yum install epel-release
yum repolist
```

## 2. Node.js 설치

```bash
yum -y install nodejs
```

## 3. 설치 확인

```bash
node -v
npm -v
```

## yum으로 특정 버전 설치

```bash
yum install -y gcc-c++ make

# 8점대 버전을 다운 받으려는 경우
curl -sL https://rpm.nodesource.com/setup_8.x | sudo -E bash -

# 9점대 버전을 다운 받으려는 경우
curl -sL https://rpm.nodesource.com/setup_9.x | sudo -E bash -

# 12점대 버전을 다운 받으려는 경우
curl -sL https://rpm.nodesource.com/setup_12.x | sudo -E bash -

yum install nodejs
```

# 바이너리 설치

Node.js의 최신 버전 또는 특정 버전을 간편하게 설치합니다.

## 1. 바이너리 아카이브 다운로드

![image](/notion-assets/f7680f46-ac80-4287-83b3-3e13c9e63375/3.png)

- 홈페이지 다운로드 : [https://nodejs.org/en/download/](https://nodejs.org/en/download/)
- 다운로드 링크를 복사하여 `wget`으로 간편하게 다운로드 받거나 서버에 직접 파일을 업로드합니다.

## 2. 압축 풀기

tar 명령으로 다운로드 받은 바이너리를 적절한 경로에 풀어줍니다.

```bash
tar xf [node-v14.15.3-linux-x64.tar.xz]
```

압축 해제한 디렉토리를 이동합니다.

```bash
mv ./[node-v14.15.3-linux-x64] /usr/local/lib/node
```

## 3. 환경 변수 설정

다음 환경 변수를 bash 프로필에 추가해줍니다.

- 모든 계정에 추가 : `/etc/bashrc`
- 특정 계정에 추가 : `~/.bashrc`

```bash
vim /etc/bashrc
	export NODEJS_HOME=/usr/local/lib/node
	export PATH=$NODEJS_HOME/bin:$PATH
```

다음 환경변수를 새로고침 해줍니다.

```bash
source /etc/bashrc
또는
source ~/.bashrc
```

## 4. 설치 확인

```bash
node -v
npm version
```

# n 패키지로 설치

좀 더 명확하게 자신이 원하는 버전을 설치할 수 있습니다. 다양한 버전을 설치하고 필요한 버전으로 변경하며 사용할 수도 있습니다.

### 1. n 패키지로 node.js 설치

```bash
# npm 캐시 삭제
npm cache clean --force
npm install -g n

# ex) 특정 버전 설치
n 8.1.2
n 6.17.2
n 5.4.3

# 설치되어있는 nodejs 버전 중 하나를 선택
n

# 링크 수정
ln -sf /usr/local/n/versions/node/[설치한 버전]/bin/node /usr/bin/node

# nodejs 버전 확인
node --version
```

### 2. n 패키지 기타 명령어

```bash
# 최신 버전 설치
n latest

# Stable 버전 설치
n stable

# LTS 버전 설치
n lts

# 설치된 nodejs 중 특정 버전 삭제
n rm [버전]

# 현재 버전을 제외한 나머지 모든 버전 삭제
n prune
```
