+++
title = "MariaDB/MySQL root 패스워드 분실 재설정"
date = "2023-02-21T02:29:00.000Z"
updated = "2024-01-09T02:20:00.000Z"
categories = ["SERVER"]
tags = ["DB", "MySQL"]

[extra]
source = "notion"
notion_id = "edf47ff3-7f13-423b-8b9d-8b57dda99904"
notion_url = "https://app.notion.com/p/MariaDB-MySQL-root-edf47ff37f13423b8b9d8b57dda99904"
external_url = "https://yjshin.tistory.com/entry/CentOS-root-%ED%8C%A8%EC%8A%A4%EC%9B%8C%EB%93%9C-%EB%B6%84%EC%8B%A4-%EC%9E%AC%EC%84%A4%EC%A0%95"
+++

### 1. 서비스 정지

```bash
systemctl stop mariadb
```

### 2. mysql 안전모드 실행

```bash
sudo /usr/bin/mysqld_safe --skip-grant &
[1] 7845
170801 18:02:09 mysqld_safe Logging to '/var/log/mariadb/mysql-error.log'.
170801 18:02:09 mysqld_safe Starting mysqld daemon with databases from /var/lib/mysql
[1]+  Done          sudo /usr/bin/mysqld_safe --skip-grant

또는 

mysqld -uroot --skip-grant-tables &
```

### 3. 패스워드 변경

```sql
mysql -uroot mysql

flush privileges;

-- MYSQL 5.x
update user set password=password('변경할비밀번호') where user='root';
-- MYSQL 8.x
alter user 'root'@'localhost' identified with mysql_native_password by '변경 비밀번호';

flush privileges;
exit;
```

### 4. 접속 테스트

```bash
mysql -uroot -p

-- 성공 시
shutdown;
```

### 5. 서비스 재시작

```bash
## 기존에 사용했던 사용자 계정에서 시작해야 함
systemctl start mariadb

## 권한 관련 오류 발생 시 (Error 13)
chown -R mysql.mysql /var/lib/mysql
```
