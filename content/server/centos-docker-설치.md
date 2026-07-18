+++
title = "CentOS Docker 설치"
date = "2022-05-16T04:56:00.000Z"
updated = "2026-07-17T06:17:00.000Z"
categories = ["SERVER", "DEV-OPS"]
tags = ["NETWORK", "MSA"]
toc = true

[extra]
source = "notion"
notion_id = "b6fe1a56-0af2-4272-a39a-b6ec1bc15e59"
notion_url = "https://app.notion.com/p/CentOS-Docker-b6fe1a560af24272a39ab6ec1bc15e59"
+++

# Docker 설치

```bash
# Docker 저장소 설치
curl -fsSL https://get.docker.com/ | sh

# Docker 서비스 시작
sudo systemctl start docker

# Docker 서비스 작동 상태 확인
sudo systemctl status docker

# Docker 서비스를 운영체제 부팅시 자동 시작하도록 설정
sudo systemctl enable docker

# docker 명령어를 sudo 없이 사용하기 위해 계정을 docker 그룹에 소속 (계정 재접속 필요)
sudo usermod -aG docker ec2-user

# 설치된 docker 버전 확인
docker -v
Docker version 19.03.13, build 4484c46d9d

# hello-world 컨테이너 실행 확인
docker run hello-world
Hello from Docker!
This message shows that your installation appears to be working correctly.
```

### 특정 버전 설치

```bash
# Docker 레포지토리 추가
yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo

# 설치 가능한 버전 목록 보기
yum list docker-ce --showduplicates | sort -r

# 특정 버전 설치
yum install docker-ce-20.10.15-3.el7
```

# **Docker Compose 설치**

```bash
# docker-compose 설치
sudo curl -L "https://github.com/docker/compose/releases/download/v2.5.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose

# docker-compose 실행 권한 부여
sudo chmod +x /usr/local/bin/docker-compose

# 설치된 docker-compose 실행 확인
docker-compose -v
docker-compose version 2.5.0, build 40524192
```

## Trouble Shooting

### docker 설치 후 /var/run/docker.sock의 permission denied 발생하는 경우

- `/var/run/docker.sock` 파일의 권한을 666으로 변경하여 그룹 내 다른 사용자도 접근 가능하게 변경
  ```bash
sudo chmod 666 /var/run/docker.sock
  ```
- 또는 `chown` 으로 group ownership 변경
  ```bash
sudo chown root:docker /var/run/docker.sock
  ```
