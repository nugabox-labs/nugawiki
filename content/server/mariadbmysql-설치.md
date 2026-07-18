+++
title = "MariaDB/MySQL 설치"
date = "2020-10-27T00:47:00.000Z"
updated = "2025-02-24T02:45:00.000Z"
categories = ["SERVER"]
tags = ["DB", "MySQL"]
toc = true

[extra]
source = "notion"
notion_id = "8acac988-28d8-4cf5-919e-4895d77b5da5"
notion_url = "https://app.notion.com/p/MariaDB-MySQL-8acac98828d84cf5919e4895d77b5da5"
+++

![image](/notion-assets/8acac988-28d8-4cf5-919e-4895d77b5da5/11.png)

> 테스트 OS : CentOS 6.x / 7.x
> DB Ver : MariaDB 10.0, 10.2 / MySQL 5.1, 5.7, 8.0

# OS 설정

---

## 1. ulimit 수정

- 현재 시스템 확인
  ```bash
vim /etc/security/limits.conf
  ```
- 전체 사용자의 nofile 옵션을 추가
  ```bash
root            soft    nofile          65535
root            hard    nofile          65535
*               soft    nofile          65535
*               hard    nofile          65535
  ```

## 2. Hostname 변경

여러 대의 DB를 관리해야 하거나, 마스터-슬레이브 구조로 관리해야 될 때는 각 서버가 Hostname을 갖고 있는 것이 유리하다.

- CentOS 6.x
  ```bash
vim /etc/sysconfig/network
	HOSTNAME=호스트네임
  ```
- CentOS 7.x
  ```bash
hostnamectl set-hostname 호스트네임 --static
cat /etc/hostname
reboot
  ```

## 3. 서버 시간 설정

- 서버의 시간이 UTC로 설정된 경우 KST로 변경한다. (UTC는 KST보다 -9시간)
  ```bash
rm /etc/localtime
ln -s /usr/share/zoneinfo/Asia/Seoul /etc/localtime
  ```
- 확인 및 재부팅
  ```bash
date
	2021. 04. 28. (수) 10:29:51 KST
reboot
  ```

# 설치

---

## 패키지 설치

- MariaDB 버전별 RPM 다운로드
  [https://downloads.mariadb.org/mariadb/repositories/#mirror=yongbok](https://downloads.mariadb.org/mariadb/repositories/#mirror=yongbok)
- MariaDB 버전별 OS 호환성 비교
[https://mariadb.com/docs/deploy/os-compatibility/#mariadb-community-server](https://mariadb.com/docs/deploy/os-compatibility/#mariadb-community-server)
- MariaDB Archive
  [https://archive.mariadb.org/](https://archive.mariadb.org/)

### 1. \[MariaDB\] 저장소 추가

CentOS 6.x 이하 또는 원하는 버전의 MariaDB를 설치해야 하는 경우 저장소 정보를 등록해야 한다.

- 저장소 정보 파일을 열거나 생성한다.
  ```bash
vim /etc/yum.repos.d/MariaDB.repo
  ```
- 아래 내용을 추가한다.
  ```bash
## MariaDB 10.2

# MariaDB 10.2 CentOS repository list - created 2018-01-11 07:40 UTC
# http://downloads.mariadb.org/mariadb/repositories/
[mariadb]
name = MariaDB
baseurl = http://yum.mariadb.org/10.2/centos7-amd64
gpgkey=https://yum.mariadb.org/RPM-GPG-KEY-MariaDB
gpgcheck=1
  ```

  - baseurl : 본인이 원하는 스펙의 URL
    - 10.2 : 설치할 MariaDB의 버전
    - centos7-amd64 : 현재 리눅스 서버 스펙
- yum 저장소 정보를 갱신하고 확인한다.
  ```bash
yum clean all
yum repolist
	mariadb                                        | 2.9 kB     00:00
	mariadb/primary_db                             |  45 kB     00:02
	mariadb             MariaDB                                    49
  ```

### 2. 패키지 설치

- yum으로 설치하는 경우
  ```bash
yum install MariaDB-server MariaDB-client
또는
yum install mysql-server mysql-client
  ```
- 다운로드 받은 rpm 파일로 설치하는 경우
  ```bash
rpm -Uvh MySQL-server-5.x.x-0.i386.rpm
rpm -Uvh MySQL-client-5.x.x-0.i386.rpm

# 이미 설치된 다른 패키지로 인해 충돌이 날 경우 force option 적용
rpm -Uvh MySQL-server-5.x.x-0.i386.rpm --force
rpm -Uvh MySQL-client-5.x.x-0.i386.rpm --force
  ```
- 설치 확인
  ```bash
rpm -qa | grep MariaDB
또는 
rpm -qa | grep mysql
  ```
- 기본 데이터 경로 : `/var/lib/mysql`
- 기본 로그 파일 경로 : `/var/log/mysqld.log`
- 환경설정 파일 경로 : `/etc/my.cnf` 또는 `/etc/my.cnf.d/*.cnf`
- 프로세스 파일 경로 : `/var/run/mysqld/mysqld.pid`, `/var/run/mysqld/mysqld.sock`

### 3. 서비스 실행

[**→ 서비스 데몬 구동**](/8acac98828d84cf5919e4895d77b5da5#bf4b13ecd55847fc9c9b0395195066c7)

## 컴파일 설치

### 컴파일 설치를 위한 패키지 설치

yum 사용이 가능한 경우 컴파일 설치를 위한 기본적인 패키지를 설치한다.

```bash
yum install gcc gcc-c++ libtermcap-devel gdbm-devel zlib* libxml* freetype* libpng* libjpeg* iconv flex gmp ncurses-devel cmake.x86_64 libaio gnutls-devel
```

- MySQL 8.0 이상인 경우 cmake 3 이상, gcc 5.3 이상이 필요함.

### 1. 소스 파일 다운로드

- MariaDB 다운로드 아카이브
  [https://downloads.mariadb.org/mariadb/+releases/](https://downloads.mariadb.org/mariadb/+releases/)
- MySQL 다운로드 아카이브
  [https://downloads.mysql.com/archives/community/](https://downloads.mysql.com/archives/community/)
- 다운로드 아카이브에서 원하는 버전의 `Source` 파일을 서버에 업로드 또는 [`wget`](/4ecdbaeac3c5451089130c15a677fcf2#a2d781fd02834ec1b3d4229919e487a9)으로 다운로드 받는다.
  ```bash
cd /usr/local/src
wget https://downloads.mysql.com/archives/get/file/mysql-5.7.20.tar.gz
  ```

### 2. 압축 해제 및 빌드 디렉토리 생성

```bash
tar zxvf mysql-5.7.20.tar.gz
mkdir build-mysql
cd build-mysql
```

### 3. 사용자 생성

```bash
groupadd mysql
useradd -g mysql mysql
```

### 4. 컴파일 옵션 설정

- 컴파일 옵션 변경 시 컴파일 옵션에 `-D`를 붙이고 값을 입력한다.
- **한 서버에 2개 이상의 MySQL/MariaDB 설치 시 꼭 다르게 설정해야 할 옵션**
  - 설치 베이스 경로 (CMAKE\_INSTALL\_PREFIX)
  - 데이터 경로 (MYSQL\_DATADIR)
  - Sock 파일 위치 (MYSQL\_UNIX\_ADDR)
  - 포트 (MYSQL\_TCP\_PORT)
  - my.cnf (INSTALL\_SYSCONFDIR) : 설치 후 각각 다른 위치에 생성하여 사용한다.
- 버전별 테스트한 옵션은 아래와 같다.
  ```bash
cmake ../mariadb-10.0.31 \
    -DWITH_READLINE=1 \
    -DWITH_READLINE=1 \
    -DWITH_SSL=bundled \
    -DWITH_ZLIB=system \
    -DDEFAULT_CHARSET=utf8 \
    -DDEFAULT_COLLATION=utf8_general_ci \
    -DENABLED_LOCAL_INFILE=1 \
    -DWITH_EXTRA_CHARSETS=all \
    -DWITH_ARIA_STORAGE_ENGINE=1 \
    -DWITH_XTRADB_STORAGE_ENGINE=1 \
    -DWITH_ARCHIVE_STORAGE_ENGINE=1 \
    -DWITH_INNOBASE_STORAGE_ENGINE=1 \
    -DWITH_PARTITION_STORAGE_ENGINE=1 \
    -DWITH_BLACKHOLE_STORAGE_ENGINE=1 \
    -DWITH_FEDERATEDX_STORAGE_ENGINE=1 \
    -DWITH_PERFSCHEMA_STORAGE_ENGINE=1 \
    -DINSTALL_SYSCONFDIR=/usr/local/mariadb-10.0.31/etc \
    -DINSTALL_SYSCONF2DIR=/usr/local/mariadb-10.0.31/etc/my.cnf.d \
    -DMYSQL_TCP_PORT=3307 \
    -DCMAKE_INSTALL_PREFIX=/usr/local/mariadb-10.0.31 \
    -DMYSQL_DATADIR=/usr/local/mariadb-10.0.31/data \
    -DMYSQL_UNIX_ADDR=/usr/local/mariadb-10.0.31/socket/mysql.socket
  ```

  ```bash
cmake \
	-DCMAKE_INSTALL_PREFIX=/usr/local/mariadb-10.2.19 \
	-DWITH_EXTRA_CHARSETS=all \
	-DMYSQL_DATADIR=/usr/local/mariadb-10.2.19/data \
	-DENABLED_LOCAL_INFILE=1 \
	-DDOWNLOAD_BOOST=1 \
	-DWITH_BOOST=../boost_1_59_0 \
	-DWITH_INNOBASE_STORAGE_ENGINE=1 \
	-DWITH_PARTITION_STORAGE_ENGINE=1 \
	-DWITH_FEDERATED_STORAGE_ENGINE=1 \
	-DWITH_BLACKHOLE_STORAGE_ENGINE=1 \
	-DWITH_MYISAM_STORAGE_ENGINE=1 \
	-DENABLED_LOCAL_INFILE=1 \
	-DMYSQL_UNIX_ADDR=/tmp/mariadb.sock \
	-DSYSCONFDIR=/etc \
	-DDEFAULT_CHARSET=utf8 \
	-DDEFAULT_COLLATION=utf8_general_ci \
	-DMYSQL_USER=mariadb \
	-DMYSQL_TCP_PORT=3307 \
	-DWITH_EXTRA_CHARSETS=all
  ```

  ```bash
cmake \
		-DCMAKE_INSTALL_PREFIX=/usr/local/mysql-5.7.29 \
		-DWITH_EXTRA_CHARSETS=all \
		-DMYSQL_DATADIR=/usr/local/mysql-5.7.29/data \
		-DENABLED_LOCAL_INFILE=1 \
		-DDOWNLOAD_BOOST=1 \
		-DWITH_BOOST=../boost_1_59_0 \
		-DWITH_INNOBASE_STORAGE_ENGINE=1 \
		-DWITH_PARTITION_STORAGE_ENGINE=1 \
		-DWITH_FEDERATED_STORAGE_ENGINE=1 \
		-DWITH_BLACKHOLE_STORAGE_ENGINE=1 \
		-DWITH_MYISAM_STORAGE_ENGINE=1 \
		-DENABLED_LOCAL_INFILE=1 \
		-DMYSQL_UNIX_ADDR=/tmp/mysql.sock \
		-DSYSCONFDIR=/etc \
		-DDEFAULT_CHARSET=utf8 \
		-DDEFAULT_COLLATION=utf8_general_ci \
		-DMYSQL_USER=mysql \
		-DMYSQL_TCP_PORT=3306 \
		-DWITH_EXTRA_CHARSETS=all
  ```

  ```bash
cmake3 \
		-DCMAKE_INSTALL_PREFIX=/usr/local/mysql-8.0 \
		-DMYSQL_DATADIR=/usr/local/mysql-8.0/data \
		-DSYSCONFDIR=/usr/local/mysql-8.0\
		-DMYSQL_USER=mysql \
		-DWITH_MYISAM_STORAGE_ENGINE=1 \
		-DWITH_INNOBASE_STORAGE_ENGINE=1 \
		-DWITH_PARTITION_STORAGE_ENGINE=1 \
		-DWITH_FEDERATED_STORAGE_ENGINE=1 \
		-DWITH_BLACKHOLE_STORAGE_ENGINE=1 \
		-DWITH_MEMORY_STORAGE_ENGINE=1 \
		-DWITH_READLINE=1 \
		-DMYSQL_UNIX_ADDR=/tmp/mysql.sock \
		-DMYSOL_TCP_PORT=3306 \
		-DENABLED_LOCAL_INFILE=1 \
		-DENABLE_DOWNLOADS=1 
		-DWITH_EXTRA_CHARSETS=all \
		-DDEFAULT_CHARSET=utf8 \
		-DDEFAULT_COLLATION=utf8_general_ci \
		-DWITH_DEBUG=0 \
		-DMYSQL_MAINTAINER_MODE=0 \
		-DDOWNLOAD_BOOST=1 \
		-DWITH_BOOST=/usr/include \
  ```
- 컴파일 옵션 확인
  ```bash
./cmake -LH
  ```
- 컴파일 실패 시 CMakeCache.txt 파일 삭제
  ```bash
rm -rf CmakeCashe.txt
  ```

### 5. 컴파일된 파일 설치

```bash
make && make install
```

### 6. 심볼릭 링크 생성 (선택)

```bash
cd /usr/local/mysql-5.7.20
ln -s mysql-5.7.20 mysql
ln -s /usr/local/mysql/bin/mysql /usr/bin
```

### 7. 별도 디렉토리 생성 (선택)

- 용량 혹은 관리상의 문제로 Data 및 Log 등의 파일을 저장할 별도의 디렉토리가 필요한 경우, 아래와 같이 구성한다.

![image](/notion-assets/8acac988-28d8-4cf5-919e-4895d77b5da5/12.png)

- logs : 로그 파일
- mysql-data : 데이터 폴더
- mysql-ibdata : Innodb 데이터 폴더
- tmp : 임시 폴더

```bash
mkdir /data/mariadb
cd /data/mariadb
mkdir logs mysql-data mysql-ibdata tmp
## 이미 초기 DB를 생성한 경우
cp /var/lib/mysql/* mysql-data
chown -R mysql.mysql /data/mariadb
```

### 8. 환경설정 파일 수정 (선택)

- 기본 파일 복사 (복사할 `my-*.cnf` 파일은 MySQL 메모리에 따라 결정된다.)
  - my-huge.cnf : 1-2GB일 경우
  - my-large.cnf : 512MB 이상일 경우
  - my-medium.cnf : 32-64MB 사이일 경우
  - my-small.cnf : 64MB 이하일 경우

  ```bash
cp /usr/local/mysql/support-files/my-huge.cnf /etc/my.cnf
  ```
- 기본 디렉토리에 초기 DB 생성 후 환경설정을 수정하고 관련 파일들을 이동하거나, 환경설정을 먼저 수정하고나서 초기 DB를 생성해도 상관없다.
- MariaDB/MySQL의 환경설정은 `/etc/my.cnf`와 `[basedir]/my.cnf`를 순서대로 탐색하므로,
두 개 이상의 DB를 설치할 경우 `/etc/my.cnf`를 삭제하고, 각 디렉토리 안에 `my.cnf`를 복사한다.

```bash
[client]
port    = 3306
socket     = /tmp/mysql.sock

[mysqld]
server-id    = 1
user    = mysql
port    = 3306
socket     = /tmp/mysql.sock
default-time-zone='+9:00'

init_connect    = 'SET NAMES utf8;'

basedir    = /data/mariadb/mysql-data
datadir    = /data/mariadb/mysql-data
tmpdir     = /data/mariadb/tmp
#character-set-server = utf8
#collation-server = utf8_general_ci
character-set-server = utf8mb4
collation-server = utf8mb4_unicode_ci
skip-character-set-client-handshake
skip-host-cache
skip-name-resolve
skip-external-locking
sysdate-is-now
event_scheduler    = ON
sql_mode     = NO_ENGINE_SUBSTITUTION,STRICT_TRANS_TABLES
log_output      = FILE
general-log     = OFF
general-log-file       = /data/mariadb/logs/general.log
slow-query-log     = ON
slow-query-log-file    = /data/mariadb/logs/slowquery.log
long_query_time    = 2
log-queries-not-using-indexes      = OFF
log-bin    = /data/mariadb/logs/mysql_bin
expire_logs_days = 30
log-error    = /data/mariadb/logs/error.log
sync_binlog     = 0
back_log     = 1024
max_connections    = 1000
max_connect_errors     = 999999
table_open_cache       = 15000
max_allowed_packet     = 64M
max_heap_table_size    = 128M
tmp_table_size     = 128M
read_rnd_buffer_size    = 2M
read_buffer_size       = 512K
sort_buffer_size       = 512K
join_buffer_size       = 512K
thread_cache_size      = 2048
#query_cache_type       = DEMAND
#query_cache_size       = 64M
#query_cache_limit      = 512K
thread_stack    = 512K
ft_min_word_len    = 4
wait_timeout    = 300
interactive_timeout    = 28800
connect_timeout    = 300
net_read_timeout       = 172800
net_write_timeout      = 172800
lower_case_table_names      = 1
binlog_cache_size      = 2M
binlog_format      = MIXED
binlog_row_image       = MINIMAL
transaction_isolation       = READ-COMMITTED
max_binlog_size    = 100M
log_bin_trust_function_creators    = 1
open-files-limit       = 65535
default-storage-engine      = INNODB
innodb_data_home_dir    = /data/mariadb/mysql-ibdata
innodb_log_group_home_dir     = /data/mariadb/logs
innodb_buffer_pool_size     = 20G
innodb-buffer-pool-instances    = 8
innodb_data_file_path       = ibdata1:500M:autoextend:max:10000M
innodb_temp_data_file_path = ibtmp1:500M:autoextend:max:10000M
innodb_file_per_table       = 1
innodb_write_io_threads     = 8
innodb_read_io_threads      = 8
innodb_force_recovery       = 0
innodb_thread_concurrency     = 16
innodb_flush_log_at_trx_commit     = 2
innodb_log_buffer_size      = 16M
innodb_log_file_size    = 200M
innodb_log_files_in_group     = 5
innodb_max_dirty_pages_pct    = 90
innodb_flush_method    = O_DIRECT
innodb_lock_wait_timeout    = 120
innodb_doublewrite     = ON
innodb_status_file     = 1
innodb_adaptive_flushing    = 1
innodb_use_native_aio       = 1
innodb-purge-threads    = 1
innodb_fast_shutdown    = 0
innodb_stats_auto_recalc    = OFF
innodb_stats_persistent     = OFF
innodb_sort_buffer_size     = 2M
innodb_print_all_deadlocks    = ON
innodb_io_capacity     = 2000
innodb_io_capacity_max      = 10000
skip-innodb_adaptive_hash_index
performance_schema     = ON
#skip-federated
key_buffer_size    = 256M
bulk_insert_buffer_size     = 64M
myisam_sort_buffer_size     = 128M
myisam_max_sort_file_size     = 10G
myisam_repair_threads       = 1
myisam-recover-options

[mysqldump]
quick
max_allowed_packet     = 64M

[mysql]
no-auto-rehash
prompt     = '[\h] (\d) > '

[myisamchk]
key_buffer_size    = 64M
sort_buffer_size       = 256M
read_buffer     = 16M
write_buffer    = 16M

[mysqlhotcopy]
interactive-timeout

[mysqld_safe]
open-files-limit       = 65535
```

### 9. 초기 DB 생성 및 권한 설정

- 생성된 MySQL 설치 폴더의 권한을 설정해 준다.
  ```bash
chown -R mysql.mysql /usr/local/mysql
chmod -R 755 /usr/local/mysql
  ```
- 초기 DB 생성 스크립트를 실행한다.
  ```bash
cd /usr/local/mysql-5.7.20/scripts
./mysql_install_db --user=mysql --basedir=/usr/local/mysql --datadir=[데이터폴더위치]

## 7. 별도 디렉토리 생성을 DB 생성 이후에 했다면 모두 복사해준다.
cp -R [현재 데이터 폴더 위치]/* [별도 데이터 폴더 위치]
# 예) cp -R /usr/local/mysql/data /data/mariadb/mysql-data/
  ```
- 초기 DB 생성 후 설치 폴더 및 데이터 폴더에 다시 권한을 설정한다.
  ```bash
chown -R mysql.mysql /usr/local/mysql
chmod -R 755 /usr/local/mysql
chown -R mysql.mysql [데이터폴더위치]
chmod -R 755 [데이터폴더위치]
  ```

### 10. 서비스 데몬 구동

- `mysqld_safe`을 실행한다.
  ```bash
# 컴파일 설치한 경우 bin 폴더 아래에 있는 데몬 실행
cd /usr/local/mysql/bin
./mysqld_safe &

# 패키지 설치한 경우
mysqld_safe &
  ```
- 2대 이상의 MySQL을 설치했거나, 별도의 디렉토리로 지정한 경우 옵션을 넣어 실행할 수 있다. 
  ```bash
./mysqld_safe & \
--user=[사용자] \
--basedir=[설치위치] \
--datadir=[데이터폴더위치] \
--log-error=[에러로그위치] \
--pid-file=[pid파일위치] \
--socket=[socket파일위치] \
--port=[포트]
  ```
- 프로세스 확인
  ```bash
ps -ef | grep mysql
  ```
- 프로세스 종료
  ```bash
mysqladmin -uroot (-p) shutdown
  ```
- 정상적으로 구동되지 않을 시 로그를 확인한다.
  ```bash
cat /var/log/mysqld.log
  ```
- mysql 콘솔에 접속
  ```bash
# 초기 비밀번호가 설정되지 않은 경우 -p 옵션을 붙이지 않는다.
mysql -uroot

	Welcome to the MySQL monitor.  Commands end with ; or \g.
	Your MySQL connection id is 1
	Server version: 5.x.x-community-log MySQL Community Edition (GPL)

	Type 'help;' or '\h' for help. Type '\c' to clear the buffer.

	mysql>
  ```

### 11. root 계정 설정

- mysqladmin 이용
  ```bash
mysqladmin -u root password '1234'
  ```
- MySQL 5.x
  ```sql
update user set password=password('1234') where user='root';
또는
update user set authentication_string=password('1234') where user='root';
  ```
- MySQL 5.7 이상
  ```sql
alter user 'root'@'localhost' identified with mysql_native_password by '1234;
flush privileges;
  ```

### 12. 시스템 서비스 등록

- 컴파일 설치의 경우 시스템 서비스에 직접 등록해야 사용할 수 있다.
- CentOS 6.x : `support-file/mysql.server` 파일을 시스템 서비스 폴더에 복사한다.
  ```bash
cp /usr/local/mysql/support-file/mysql.server /etc/init.d

# 확인
service mysql status
  ```
- CentOS 7.x : 아래 내용의 `/usr/lib/systemd/system/mysql.service` 파일을 저장한다.
  ```bash
vim /usr/lib/systemd/system/mysql.service

	[Unit]
	Description=MySQL Community Server
	After=network.target
	After=syslog.target
	
	[Install]
	WantedBy=multi-user.target
	Alias=mysql.service
	
	[Service]
	user=mysql
	group=mysql
	
	# Start main service
	ExecStart=/usr/local/mysql/bin/mysqld_safe --user=mysql
	
	# Give up if ping don't get an answer
	TimeoutSec=300
	PrivateTmp=false
  ```

  ```bash
# 시스템 서비스 데몬 Reload
systemctl daemon-reload
  ```

### TroubleShooting

- 사용자 관련 : root 계정으로 에러 발생 시 권한을 부여한 사용자로 재시도
- 권한 관련 : socket 파일(보통 `/tmp/mysql.sock` 또는 `/var/run/mysql.sock`)에 권한 부여
- Socket 지정 : `-S` 옵션으로 지정
- my.cnf 지정 : `--defaults-data=[my.cnf위치] ` 옵션으로 지정

# 서비스 구동

---

- 서비스 시작 (서비스 네임 `mysql` 또는 `mysqld` 확인)
  ```bash
# CentOS 6.x
service mysql start

# CentOS 7.x
systemctl start mysql
  ```
- 부팅시 자동 재시작
  ```bash
# CentOS 6.x
chkconfig mysql on
chkconfig --list mysql

# CentOS 7.x
systemctl enable mysql
systemctl status mysql (Loaded 맨 마지막에 enabled 확인)
  ```
- 포트 확인
  ```bash
netstat -anp | grep mysql | grep "LISTEN "
	tcp     0      0 :::3306       :::*         LISTEN      9999/mysqld
  ```
- 버전 확인
  ```bash
mysql --version
  ```
- 콘솔 접속
  ```bash
mysql -uroot -p
  ```
- 보안 설정 (선택)
  ```bash
mysql_secure_installation
  ```
- 현재 계정 확인
  ```bash
use mysql;
// mysql 5.x 는 "password" 또는 "authentication_string"로 확인합니다.
mysql> select host, user, password from user;
mysql> select host, user, authentication_string from user;

// mysql 8.x
mysql> select host, user, authentication_string from user;
  ```
