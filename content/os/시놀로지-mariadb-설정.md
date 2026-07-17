+++
title = "시놀로지 MariaDB 설정"
date = "2021-04-08T07:42:00.000Z"
updated = "2024-01-09T02:20:00.000Z"
categories = ["OS", "SERVER"]
tags = ["SYNOLOGY", "DB", "MySQL"]

[extra]
source = "notion"
notion_id = "4f64d963-16ca-4a37-9742-4e2cf62afe55"
notion_url = "https://app.notion.com/p/MariaDB-4f64d96316ca4a3797424e2cf62afe55"
+++

1. DSM 패키지 센터에서 설치
1. root 비밀번호와 port 설정
1. DSM 방화벽에서 열기
1. 공유기 포트포워딩에서 열기
1. Synology SSH 접속
   ```bash
sudo su -
cd /usr/local/mariadb10/bin
./mysql -uroot -p
   ```
1. 외부접속 가능한 사용자 등록 및 권한 생성
   ```sql
create user 'root'@'%' identified by '비밀번호';
flush privileges;
grant all privileges on *.* to 'root'@'%';
flush privileges;
   ```
1. 외부접속 테스트
- 환경설정 My.cnf
  ```bash
cd /var/packages/MariaDB10/etc
vim my.cnf (없으면 새로 작성해도 됨)
/usr/syno/bin/synopkg restart MariaDB10
> package MariaDB10 restart successfully
  ```
