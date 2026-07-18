+++
title = "Portainer 설치 (Web GUI)"
date = "2022-05-19T02:06:00.000Z"
updated = "2024-10-08T01:43:00.000Z"
categories = ["SERVER", "DEV-OPS"]
tags = ["NETWORK", "MSA"]
toc = true

[extra]
source = "notion"
notion_id = "6404e631-8799-4a5b-826a-90b32f0b924e"
notion_url = "https://app.notion.com/p/Portainer-Web-GUI-6404e63187994a5b826a90b32f0b924e"
+++

## 이미지 설치

```docker
docker pull portainer/portainer-ce
docker run -d -p 9000:9000 --name portainer --restart always -v /var/run/docker.sock:/var/run/docker.sock -v /usr/local/docker/portainer:/data portainer/portainer-ce:latest
```

### Portainer 이미지 다운로드

- poratiner-ce : 경량버전

```bash
docker pull portainer/portainer-ce
```

### **Portainer 에서 사용할 Volume 을 생성**

```bash
docker volume create portainer_data
```

### **Portainer 컨테이너 이미지 다운로드 및 실행**

```bash
docker run -d -p 9000:9000 --name portainer -v /var/run/docker.sock:/var/run/docker.sock -v portainer_data:/data --restart=always portainer/portainer-ce
```
