+++
title = "AWS-EC2 + 그누보드5 세팅"
date = "2023-04-16T15:20:00.000Z"
updated = "2023-04-16T15:22:00.000Z"
categories = ["OS", "BACK-END"]
tags = ["LINUX", "PHP"]
toc = true

[extra]
source = "notion"
notion_id = "a04a336d-b99c-45b9-9bf5-7d8a38c7371a"
notion_url = "https://app.notion.com/p/AWS-EC2-5-a04a336db99c45b99bf57d8a38c7371a"
+++

---

---

## 1. AWS 인스턴스 생성

> [!NOTE]
> **프리 티어**
AWS 가입 첫 해에는 월별 프리 티어 AMI에 대한 t2.micro(또는 t2.micro를 사용할 수 없는 리전의 t3.micro) 인스턴스 사용량 750시간, EBS 스토리지 30GiB, IO 2백만 개, 스냅샷 1GB, 인터넷 대역폭 100GB가 포함됩니다.

**Tip**
프리 티어 사양의 인스턴스 생성 시 750시간 (대략 24시간 X 31일) 동안 무료로 사용 가능한 인스턴스가 생성되므로, 프리 티어를 최대한 사용하여 구축 후 사용량에 맞게 인스턴스 유형 및 스토리지 구성을 변경하면 될 것 같습니다.

1. `콘솔 홈 > EC2` → `EC2 대시보드`에서 인스턴트 시작
1. 인스턴트 생성 정보 입력
   1. OS 이미지 선택
   1. 인스턴스 유형 : 추후 변경 가능
      - 최소 : t2.micro (vCPU 1개 / RAM 1GB) `프리 티어`
      - 권장 : t2.large (vCPU 2개 / RAM 8GB)

      ![image](/notion-assets/a04a336d-b99c-45b9-9bf5-7d8a38c7371a/2.png)
   1. 키 페어 생성
      - 새 키 페어 생성 (.pem)
      - **키 페어 다운로드 (한 번 다운로드 받으면 다시 받을 수 없음)**
   1. 네트워크 설정
      - 네트워크 / 서브넷 / 퍼블릭 IP 자동 할당 : 기본
      - SSH 트래픽 허용 : IP 제한 관련 (없는 경우 위치 무관)
   1. 스토리지 구성
      - 최소 : 30GB / 범용SSD(gp2) `프리 티어`
1. 요약 확인 후 시작 하면 인스턴트 생성됨

## 2. AWS 인스턴스 접속

1. 대시보드 `인스턴스 > 인스턴스`에서 생성된 인스턴스 확인
1. 퍼블릭 IPv4 주소 확인
1. 다운로드 받은 키 페어 파일(.pem) 준비
1. SSH 프로그램에 키 페어 파일 등록하여 접속
   1. Putty
      1. Putty 다운로드 및 설치
         - Putty 다운로드 : [https://www.chiark.greenend.org.uk/~sgtatham/putty/latest.html](https://www.chiark.greenend.org.uk/~sgtatham/putty/latest.html)
           - Package files로 다운받아 설치하면 PuttyGen 포함되어 있음
         - PuttyGen 다운로드 : [https://www.puttygen.com/](https://www.puttygen.com/)
      1. PuttyGen.exe 실행
      1. Load > 다운로드 받은 .pem 파일 선택
      1. Save private key > Yes > File Name 입력 → .ppk 파일 생성 확인
      1. Putty.exe 실행
      1. Putty Configuration 창의 Connection > SSH > Auth > 맨 아래 Browse → .ppk 파일 선택
      1. Putty Configuration 창의 Session으로 돌아와서 Host Name에 IP 주소 입력하고 Save
   1. 접속 ID : ec2-user
   1. 접속 성공 시 화면
      ![image](/notion-assets/a04a336d-b99c-45b9-9bf5-7d8a38c7371a/3.png)

## 3. XAMPP 설치

1. 대시보드 `인스턴스 > 인스턴스`에서 해당 인스턴스 클릭
1. 보안 탭의 해당 보안그룹 클릭
1. 인바운드 규칙 탭의 인바운드 규칙 편집 클릭
1. 인바운드 규칙 추가
   1. 유형 : 사용자 지정 TCP
   1. 포트 범위 : 80, 443
   1. 소스 : IP 사용자 지정하거나 Anywhere-IPv4 (= 위치 무관)
1. XAMPP 다운로드
   > [!NOTE]
   > 그누보드5의 권장 설치 환경이 PHP 7.2 이상, MySQL 5.0 이상의 MariaDB 이므로
XAMPP 7 버전 대의 최신 버전으로 설치하겠습니다.

   - 최신 다운로드 링크 : [https://www.apachefriends.org/download.html](https://www.apachefriends.org/download.html)
   - 이전 버전 아카이브 : [https://sourceforge.net/projects/xampp/files/XAMPP Linux/](https://sourceforge.net/projects/xampp/files/XAMPP%20Linux/)
   - (2023.2.3. 현재) 7.4.33 버전 다운로드 : [https://sourceforge.net/projects/xampp/files/XAMPP Linux/7.4.33/xampp-linux-x64-7.4.33-0-installer.run/download](https://sourceforge.net/projects/xampp/files/XAMPP%20Linux/7.4.33/xampp-linux-x64-7.4.33-0-installer.run/download)
1. 서버에 XAMPP 설치 파일 업로드
1. XAMPP 설치
   ```bash
# 실행 권한 부여 후 관리자 권한으로 실행
chmod +x xampp-linux-x64-7.4.33-0-installer.run
sudo ./xampp-linux-x64-7.4.33-0-installer.run

XAMPP Developer Files [Y/n] :n

Is the selection above correct? [Y/n]: y

----------------------------------------------------------------------------
Installation Directory

XAMPP will be installed to /opt/lampp
Press [Enter] to continue:

----------------------------------------------------------------------------
Setup is now ready to begin installing XAMPP on your computer.

Do you want to continue? [Y/n]: y
----------------------------------------------------------------------------
Please wait while Setup installs XAMPP on your computer.

 Installing
 0% ______________ 50% ______________ 100%
 #########################################

----------------------------------------------------------------------------
Setup has finished installing XAMPP on your computer.

## 성공 시 설치 디렉토리 : /opt/lampp
   ```
1. XAMPP 기동
   ```bash
cd /opt/lampp
sudo ./xampp start

Starting XAMPP for Linux 7.4.33-0...
XAMPP: Starting Apache...already running.
XAMPP: Starting MySQL...ok.
XAMPP: Starting ProFTPD...ok.
   ```
1. 프로세스 포트 확인
   ```bash
netstat -anp | grep "LISTEN "
tcp6       0      0 :::80                   :::*                    LISTEN       -                   
tcp6       0      0 :::443                  :::*                    LISTEN      -                   
tcp6       0      0 :::3306                 :::*                    LISTEN     -                   
   ```
1. 80 포트 접속 확인
   - 웹 브라우저에서 해당 IP:80 으로 접속 확인
     ![image](/notion-assets/a04a336d-b99c-45b9-9bf5-7d8a38c7371a/3.png)
   1. 환경변수 Path 설정
      ```bash
vim ~/.bash_profile

# xampp path 추가 후 저장
PATH=$PATH:$HOME/.local/bin:$HOME/bin:/opt/lampp/bin

source ~/.bash_profile
      ```
   1. MariaDB 설정
      ```bash
# MariaDB 접속
mysql -uroot mysql

# 빈 계정 삭제
MariaDB [mysql]> select user, host from user;
+------+-----------+
| user | host      |
+------+-----------+
| root | 127.0.0.1 |
| root | ::1       |
|      | localhost |
| pma  | localhost |
| root | localhost |
+------+-----------+

MariaDB [mysql]> delete from user where user='';
MariaDB [mysql]> flush privileges;
      ```

## 4. 그누보드5 설치

### DB 설정

1. MariaDB 접속
   ```bash
mysql -uroot mysql
   ```
1. DB 생성 (캐릭터셋 : utf8mb4)
   ```sql
create database g5db character set utf8mb4 collate utf8mb4_general_ci;
   ```
1. 사용자 생성 및 권한 부여
   ```sql
create user 'g5user'@'localhost' identified by 'g5p@ssw0rd';
grant all privileges on g5db.* to 'g5user'@'localhost';
flush privileges;
   ```
1. 사용자 접속 및 DB 생성 확인
   ```bash
mysql -ug5user -p 
Enter password: 

MariaDB [(none)]> show databases;
+--------------------+
| Database           |
+--------------------+
| g5db               |
| information_schema |
| test               |
+--------------------+
   ```

### 그누보드5 설치

1. 그누보드5 다운로드 (최신 버전 다운로드)
   - 최신 버전 다운로드(tar) : [https://github.com/gnuboard/gnuboard5/tarball/master](https://github.com/gnuboard/gnuboard5/tarball/master)
   - 버전 내역 페이지 : [https://sir.kr/g5\_pds](https://sir.kr/g5_pds)
1. 설치 파일 업로드
1. XAMPP 기존 파일 백업 및 디렉토리 생성
   ```bash
cd /opt/lampp
sudo mv htdocs htdocs_org
sudo mkdir htdocs
sudo chown ec2-user.ec2-user htdocs
   ```
1. 설치 파일 압축 해제
   ```bash
tar zxvf gnuboard5.5.8.2.7.tar.gz -C /opt/lampp/htdocs
   ```
1. 설치 전 캐릭터셋 기본값 설정 (utf8 → utf8mb4)
   ```bash
cd /opt/lampp/htdocs
vim config.php

## 42 line
define('G5_DB_CHARSET', 'utf8mb4');
   ```
1. 설치 화면 접속
   1. 웹 브라우저에서 해당 IP:80 으로 접속 확인
      ![image](/notion-assets/a04a336d-b99c-45b9-9bf5-7d8a38c7371a/3.png)
   1. data 디렉토리 생성
      ```bash
cd /opt/lampp/htdocs
mkdir data
chmod 707 data
      ```
   1. 새로고침 후 라이센스 동의
   1. MySQL 정보, 최고관리자 정보 입력
      ![image](/notion-assets/a04a336d-b99c-45b9-9bf5-7d8a38c7371a/3.png)
   1. 설치 완료 후 `새로운 그누보드5로 이동` 클릭
   1. 로그인 및 관리자 페이지 테스트
