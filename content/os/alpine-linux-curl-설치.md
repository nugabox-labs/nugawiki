+++
title = "Alpine Linux curl 설치"
date = "2022-05-18T06:32:00.000Z"
updated = "2025-05-13T12:53:00.000Z"
categories = ["OS", "DEV-OPS"]
tags = ["LINUX", "MSA"]
toc = true

[extra]
source = "notion"
notion_id = "193433a9-42f1-4683-9b64-0359eec820ce"
notion_url = "https://app.notion.com/p/Alpine-Linux-curl-193433a942f146839b640359eec820ce"
+++

### 설치1

```bash
apk --no-cache add curl
```

### Docker image에 curl 설치 시

```bash
RUN apk --no-cache add curl
```

### Docker image에 기본으로 설치된 curl 업데이트 시

```bash
RUN apk add --update curl && \
    rm -rf /var/cache/apk/*
```
