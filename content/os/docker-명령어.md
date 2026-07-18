+++
title = "Docker 명령어"
date = "2022-03-23T07:42:00.000Z"
updated = "2026-07-17T06:17:00.000Z"
categories = ["OS", "DEV-OPS"]
tags = ["LINUX", "MSA"]
toc = true

[extra]
source = "notion"
notion_id = "a0d5f1d3-477f-427e-aad0-dbe72aed390b"
notion_url = "https://app.notion.com/p/Docker-a0d5f1d3477f427eaad0dbe72aed390b"
+++

## 컨테이너

- 동작 중인 컨테이너 확인
  ```bash
docker ps
  ```
- 정지된 컨테이너 확인
  ```bash
docker ps -a
  ```
- 컨테이너 삭제
  ```bash
docker rm [컨테이너id]
  ```
- 복수개 삭제도 가능
  ```bash
docker rm [컨테이너id], [컨테이너id]
  ```
- 컨테이너 모두 삭제
  ```bash
docker rm [컨테이너id], [컨테이너id]
  ```

## 이미지

- 현재 이미지 확인
  ```bash
docker images
  ```
- 이미지 삭제
  ```bash
docker rmi [이미지id]
  ```
- 컨테이너를 삭제하기 전에 이미지를 삭제할 경우
  ```bash
# f 옵션을 붙이면 컨테이너도 강제삭제
docker rmi -f [이미지id]
  ```
