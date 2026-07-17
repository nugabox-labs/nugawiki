+++
title = "Apache 설치 및 설정"
date = "2020-10-23T07:34:00.000Z"
updated = "2022-06-25T18:56:00.000Z"
categories = ["OS", "SERVER"]
tags = ["WEB", "LINUX"]

[extra]
source = "notion"
notion_id = "8b443d12-11c0-449f-b66d-a9d63f34d96f"
notion_url = "https://app.notion.com/p/Apache-8b443d1211c0449fb66da9d63f34d96f"
+++

- CONTENTS


# 1. 설치

![image](/notion-assets/8b443d12-11c0-449f-b66d-a9d63f34d96f/13.png)

## 패키지 설치인 경우

```bash
## Yum 설치
yum install httpd httpd-devel
systemctl enable httpd
systemctl start httpd
# nmap localhost로 80, 443 확인
```

## 컴파일 설치인 경우

### 설치 파일 다운로드 

- Apache : [https://archive.apache.org/dist/httpd/](https://archive.apache.org/dist/httpd/)
- apr, apr-util : [https://apr.apache.org/download.cgi](https://apr.apache.org/download.cgi)
- pcre : [https://sourceforge.net/projects/pcre/files/pcre/](https://sourceforge.net/projects/pcre/files/pcre/)
- 다운로드 후 모두 폴더별로 압축을 해제

### 필요한 패키지 설치

```bash
yum install gcc* make pcre-devel
```

### apr, apr-util 설치

- Apache 2.2 설치 시 : make로 직접 설치까지 해야 함
  ```bash
# 설치될 디렉토리 생성
mkdir [Apache 압축해제 폴더]/srclib/apr
mkdir [Apache 압축해제 폴더]/srclib/apr-util

# apr 설치
cd apr-1.7.0
./configure --prefix=[apr 설치될 디렉토리 위치]
make && make install

# apr-util 설치
cd apr-util-1.6.1
./configure --prefix=[apr-util 설치될 디렉토리 위치] --with-apr=[apr 설치될 디렉토리 위치]
make && make install
  ```

  - `rm: cannot remove 'libtoolT': No such file or directory` 에러 발생 시
    → 파일 복사 후 계속 진행 : `cp -arp libtool libtoolT`
  - xml/apr\_xml.c:35:19: fatal error: expat.h: No such file or directory 에러 발생 시
    → expat-devel 을 설치 : `yum install expat-devel`
- Apache 2.4 설치 시 : Apache 폴더에 포함시켜 컴파일 시 설치 가능
  ```bash
mv apr-1.7.0 [Apache 압축해제 폴더]/srclib/apr
mv apr-util-1.6.1 [Apache 압축해제 폴더]/srclib/apr-util
  ```

### pcre 설치

```bash
# 설치될 디렉토리 생성
mkdir [Apache 압축해제 폴더]/srclib/pcre

# pcre 설치
./configure --prefix=[pcre 설치될 디렉토리 위치]
make && make install
```

### Apache 설치

```bash
./configure --prefix=[Apache 설치될 위치] \
            --with-pcre=/usr/local/pcre \
						--with-included-apr \
					# apr, apr-util 직접 설치한 경우
						--with-apr=[Apache 압축해제 폴더]/srclib/apr \
						--with-apr-util=[Apache 압축해제 폴더]/srclib/apr-util \
					# mod_ssl 사용할 경우
						--enable-so \
						--enable-ssl \
						--with-ssl=[openssl 설치 위치]

make && make install
# make 오류로 실패 시 make clean
```

- 기존에 컴파일 설치된 Apache의 구성 옵션이 필요한 경우 `httpd/build/config.nice` 파일에서 확인 가능

# 2. 서비스 시작

```bash
# 서비스 자동시작 등록하기
(CentOS 6) chkconfig --add httpd
(CentOS 7) systemctl enable httpd

# 서비스 등록된 경우
(CentOS 6) service httpd start(|stop|restart|status)
(CentOS 7) systemctl start(|stop|restart|status) httpd

# 서비스 기동 / 중지 / 재시작
apachectl start(|stop|restart)
또는 httpd -k start(|stop|restart)

# 커넥션 유지한 채 데몬 재시작
apachectl graceful
```

# 3. 환경설정

### 환경설정 Sample

```bash
ServerTokens prod
ServerSignature Off

ServerName localhost
Timeout 300
User nobody
Group nobody

<Directory />
	Require all granted
</Directory>

AddType application/x-hwp .hwp .frm .hwt
```

```bash
########################################################################
## 포트 부여 시 default Chrome blocks the following ports(아래)는 가급적 피할 것
## 1, 7, 9, 11, 13, 15, 17, 19, 20, 21, 22, 23, 25, 37, 42, 43, 53, 77, 79, 87, 95, 101, 102, 103, 104, 109, 110, 111, 113, 115, 117, 123, 135, 139, 143, 179, 389, 465, 512, 513, 514, 515, 526, 530, 531, 532, 540, 556, 563, 587, 601, 636, 993, 995, 2049, 3659, 4045, 6000, 6665, 6666, 6667, 6668, 6669
## 포트 중복 시 크롬에서만 웹페이지 출력 안됨 (ERR_UNSAFE_PORT)
########################################################################

# 사이트명
Listen 80

########################################################################
#
#       사이트명
#
########################################################################
<VirtualHost *:80>
    ServerAdmin webmaster@test.com
    ServerName test.com
    ServerAlias www.test.com
    DocumentRoot "/home/test/public_html"
    DirectoryIndex index.php index.html  ### (JSP)index.jsp

    ErrorLog "|/usr/sbin/rotatelogs /etc/httpd/logs/test_error_log_%Y%m%d 86400"
    CustomLog "|/usr/sbin/rotatelogs /etc/httpd/logs/test_access_log_%Y%m%d 86400" combined env=!do_not_log

		### (JSP) mod_jk 연동 설정
		JkLogFile logs/mod_jk.log
    JkLogLevel info
    JkLogStampFormat "[%a %b %d %H:%M:%S %Y] "
    JkMount /* test

		### HTTP -> HTTPS Rewrite
		RewriteEngine on
		RewriteCond %{HTTP_HOST} !=on
		RewriteRule ^(.*)$ https://%{HTTP_HOST}$1 [R,L]
</VirtualHost>
```

```bash
## httpd -l => mod_so.c 확인
## rpm -qa | grep openssl 확인 => 없으면 yum install openssl
## rpm -qa | grep mod_ssl 확인 => 없으면 yum install mod_ssl

# 사이트명
Listen 443

# SSL 관련 설정
AddType application/x-x509-ca-cert .crt
AddType application/x-pkcs7-crl    .crl
SSLPassPhraseDialog  builtin
SSLSessionCache         shmcb:/var/cache/mod_ssl/scache(512000)
SSLSessionCacheTimeout  300
#SSLMutex default
SSLRandomSeed startup file:/dev/urandom  256
SSLRandomSeed connect builtin
SSLCryptoDevice builtin


########################################################################
#
#       사이트명
#
########################################################################
<VirtualHost  *:443>
    ServerAdmin webmaster@test.com
    ServerName test.com
    ServerAlias www.test.com
    DocumentRoot "/home/test/public_html"
    DirectoryIndex index.php index.html

    ErrorLog "|/usr/sbin/rotatelogs /etc/httpd/logs/jtmband_error_log_%Y%m%d 86400"
    CustomLog "|/usr/sbin/rotatelogs /etc/httpd/logs/jtmband_access_log_%Y%m%d 86400" combined env=!do_not_log

		### (JSP) mod_jk 연동 설정
		JkLogFile logs/mod_jk.log
    JkLogLevel info
    JkLogStampFormat "[%a %b %d %H:%M:%S %Y] "
    JkMount /* test

		## SSL 인증서 지정 (지정한 경로에 파일 존재해야 함)
    SSLEngine on
    SSLCertificateFile /etc/httpd/conf/ssl/*.test.com.cer      # 인증서
    SSLCertificateKeyFile /etc/httpd/conf/ssl/*.test.com.key   # 개인키
    SSLCACertificateFile /etc/httpd/conf/ssl/ca.cer            # 중간인증서

		## SSL 프로토콜 설정 (TLS 1.2 이상)
    SSLProtocol -all +TLSv1.2 +SSLv3
    SSLCipherSuite ECDHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-RSA-AES128-SHA:ECDHE-RSA-AES256-SHA:ECDHE-RSA-AES12-SHA256:ECDHE-RSA-AES256-SHA384
    SSLHonorCipherOrder     on
</VirtualHost>
```

### 환경설정 후 문법 검사

```bash
apachectl configtest
또는 httpd -t
=> Syntax OK
```

# 4. 추가 작업

## PHP 연동

## JSP(Tomcat) 연동

```bash
## tomcat-connector 설치
yum install autoconf libtool
cd tomcat-connector 폴더/native
which apxs (경로 확인)
./configure --with-apxs=apxs경로
make && make install
find / -name 'mod_jk.so' (확인)
```

```bash
## worker.list와 아래 worker.리스트명 맞춰줘야 함!!!!
## ㄴ 503 Service Unavailable 뜰 때 의심

#workers.tomcat_home=$CATALINA_HOME
#workers.java_home=$JAVA_HOME
#ps=/

################################################
#Definition for Ajp13 worker
################################################
worker.list=test

################################################
# Tomcat Version : 
################################################
# 사이트명
worker.test.port=18001
worker.test.host=localhost
worker.test.type=ajp13
worker.test.lbfactor=1
```

```bash
## 아래 항목 추가
LoadModule jk_module modules/mod_jk.so

<IfModule jk_module>
        JkWorkersFile "conf/workers.properties"
        JkLogFile "logs/mod_jk.log"
        JkLogLevel info
        JkShmFile run/mod_jk.shm
        #JkMountFile conf/uriworkermap.properties
        JkLogStampFormat "[%a %b %d %H:%M:%S %Y] "
        JkRequestLogFormat "%w %V %T"
</IfModule>
```

```bash
## 아래 항목 추가
    DirectoryIndex index.jsp index.html

    JkLogFile logs/mod_jk.log
    JkLogLevel info
    JkLogStampFormat "[%a %b %d %H:%M:%S %Y] "
    JkMount /* test    # workers.properties에서 지정해준 list명
```

## 일반 계정에서 실행하기

- 일반적으로 알려진 Well-Know 포트는 root 및 administrator만 실행이 가능. 일반 계정으로 Listen 포트가 80으로 설정된 아파치를 실행 할 경우 다음과 같은 에러가 발생.
  ```bash
Permission denied: make_sock: could not bind to address [::]:80
Permission denied: make_sock: could not bind to address 0.0.0.0:80
no listening sockets available, shutting down
Unable to open logs
  ```
- root가 아닌 일반 계정(testuser)으로 설정 후 실행
  1. httpd.conf 권한 설정
     ```bash
vi httpd/conf/httpd.conf
	User testuser
	Group testgroup
     ```
  1. 실행 파일 권한 수정
     ```bash
cd httpd/bin
chown root:testuser httpd
chmod +s httpd
chown testuser:testuser apachectl
./apachectl start
     ```

# Trouble Shooting

### 403 Forbidden

1. SELinux 설정
   - SELinux 끄기
     ```bash
vi /etc/sysconfig/selinux
	SELINUX=enforcing -> disabled [ 비활성화 ]

# 서버 재기동 필수
reboot
     ```
   - SELinux 켜야하는 경우
     HTTP 웹서버는 `httpd_sys_content_t` 타입만 파일과 디렉토리 읽는 것을 허용하므로 디렉터리의 기존 타입인 `user_home_dir_t` 타입을 수정

     ```bash
# 하나의 파일이나 디렉터리를 변경할 경우
chcon -t httpd_sys_content_t /var

# chmod와 같이 하위 파일이나 디렉터리를 모두 변경할 경우
chcon -R -h -t httpd_sys_content_t /var/
# -R : 하위 모든 파일과 디렉터리의 보안사항을 변경한다.
# -h : 심볼릭링크를 따르지 않도록 한다.
     ```
1. httpd.conf 권한 설정
   ```bash
vi httpd/conf/httpd.conf

# Apache 2.2 이하
<Directory "/home">
    Options Indexes FollowSymLinks
    AllowOverride None
    Order allow,deny
    Allow from all
</Directory>

# Apache 2.4 이상
<Directory "/home">
    Options Indexes FollowSymLinks
    AllowOverride None
    Require all granted
</Directory>
   ```

   - Options : 지정한 디렉토리이하에 모든 파일과 디렉토리들에 적용할 접근제어를 설정함. 즉 디렉토리를 보여줄 것인가? CGI를 허용할 것인가? SSI를 허용할 것인가? 등의 설정을 여기서 하게 된다.
     - FollowSymlinks : 심볼의 링크를 허용한다. 이 옵션을 지정하면 웹브라우저에서 링크파일의 경로까지도 확인할 수 있게 된다. 보안상 이 값은 설정하지 않는 것이 좋다.
     - Indexes : 웹서버의 디렉토리 접근시 DirectoryIndex에서 지정한 파일(index.html등)이 존재하지 않을 경우에 디렉토리내의 파일목록 리스트를 웹브라우저로 보여준다.
     - None : 모든 허용을 하지 않는다. 즉 None 설정으로 이외의 다른 설정들은 모두 무시한다
   - AllowOverride : 어떻게 접근을 허락할 것인가에 대한 설정.
     - None : AccessFileName에 지정된 파일을 엑세스 인증파일로 인식하지 않는다. 즉, AccessFileName 의 값이 대부분 .htaccess 이므로 이를 무시하게 된다는 의미가 된다. 즉 이 파일을 무시하기 때문에 새로운 접근 인증박싱을 Override하지 않는다. 대부분의 보안이나 중요한 디렉토리에서 사용할 수 있는 것으로 아주 제한적인 접근만을 허용하고자 할 때에 사용하는 값이다.
     - .htaccess 파일 : 웹서비스 디렉토리별로 설정이 달라져야 할 경우가 있다. 이때 관리자가 모든 설정을 하기는 힘들기 때문에 개별 디렉토리마다 다르게 설정하기 위해 존재하는 파일이다.
   - Require
     - Require all granted : 무조건 허용
     - Require all denied : 무조건 금지
     - Require ip 19 175.20 192.168.20 : 특정 아이피만 접근 허용. 여기서는 19으로 시작하는 아이피, 175.20으로 시작하는 아이피, 192.168.20로 시작하는 아이피 세 개를 허용
1. 디렉터리 퍼미션 (Directory Permission )
   웹루트가 /var/www/html 인경우/var, /www, /html 모두 실행권한(755 또는 711)이 있어야 함.

   ```bash
chmod 755 /var
chmod 755 /var/www
chmod 755 /var/www/html
   ```
