+++
title = "Linux 윈도우 공유폴더 마운트"
date = "2021-02-01T01:58:00.000Z"
updated = "2022-06-25T18:56:00.000Z"
categories = ["OS"]
tags = ["LINUX"]

[extra]
source = "notion"
notion_id = "10cd90d0-36c0-4b47-a989-55eae41fc960"
notion_url = "https://app.notion.com/p/Linux-10cd90d036c04b47a98955eae41fc960"
+++

### 바로 연결

- 마운트
  ```bash
mount -t cifs -o vers=2.0 //[호스트주소]/[폴더] /backup -o
username=[아이디],password=[비밀번호]
  ```
- 확인
  ```bash
df -h
  ```

### 재부팅 시 자동 연결 (재부팅 시 시간이 오래 걸리므로 비추천)

- 설정 파일에 해당 줄 추가
  ```bash
vim /etc/fstab
	mount -t cifs -o vers=2.0 //[호스트주소]/[폴더] /backup -o
	username=[아이디],password=[비밀번호]
  ```
- 마운트
  ```bash
mount /backup
  ```
- 확인
  ```bash
df -h
  ```

### 마운트 해제

```bash
umount /backup
```

- Target is busy 뜨면
`fuser -ck /backup` (사용하고 있는 User의 프로세스 kill) 또는 `umount -l /backup`
