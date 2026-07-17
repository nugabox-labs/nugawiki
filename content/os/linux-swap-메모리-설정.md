+++
title = "Linux Swap 메모리 설정"
date = "2024-01-15T05:47:00.000Z"
updated = "2024-01-15T06:08:00.000Z"
categories = ["OS"]
tags = ["LINUX"]

[extra]
source = "notion"
notion_id = "aac85d4f-12ce-4b80-9d30-b4a3bdfa4caf"
notion_url = "https://app.notion.com/p/Linux-Swap-aac85d4f12ce4b809d30b4a3bdfa4caf"
+++

### Swap Memory 권장 용량

출처 : [RedHat Documents](https://access.redhat.com/documentation/ko-kr/red_hat_enterprise_linux/7/html/storage_administration_guide/ch-swapspace)

| 물리 RAM 용량 | 권장 SWAP 용량 |
| --- | --- |
| 2GB 이하 | RAM 용량의 2배 |
| 2GB ~ 8GB | RAM 용량과 동일 |
| 8GB ~ 64GB | 최소 4GB |
| 64GB 이상 | 최소 4GB |

### Swap Memory 확인

```bash
free -m
swapon -s
```

### Swap Memory 파일 추가

```bash
fallocate -l 4G /swapfile

or

dd if=/dev/zero of=/swapfile bs=1M count=4096
```

### Swap Memory 파일 권한 설정

```bash
chmod 600 /swapfile
```

### Swap Memory 파일 포맷 설정

```bash
mkswap /swapfile
```

### Swap Memory 활성화

```bash
swapon /swapfile
```

### Swap Memory 시스템 자동 등록 추가

```bash
echo '/swapfile none swap sw 0 0' | tee -a /etc/fstab
```

### Swap Memeory 파일 삭제

```bash
swapoff swapfile
rm /swapfile
# /etc/fstab에도 추가되어 있으면 삭제
```
