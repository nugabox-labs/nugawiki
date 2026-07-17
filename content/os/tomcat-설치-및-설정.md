+++
title = "Tomcat 설치 및 설정"
date = "2020-10-27T00:21:00.000Z"
updated = "2025-02-24T02:36:00.000Z"
categories = ["OS", "SERVER"]
tags = ["WAS", "LINUX"]

[extra]
source = "notion"
notion_id = "9c150547-502d-4055-b1d8-68bc7c786798"
notion_url = "https://app.notion.com/p/Tomcat-9c150547502d4055b1d868bc7c786798"
version = "Apache Tomcat 7 ~ 8"
external_url = "http://tomcat.apache.org/"
+++

- CONTENTS


![image](/notion-assets/9c150547-502d-4055-b1d8-68bc7c786798/12.png)

# 설치

---

## 패키지 설치

```bash
## java-버전-openjdk 패키지가 JRE, java-버전-openjdk-devel 패키지가 JDK
yum list java*jdk-devel
yum install java-1.8.0-openjdk-devel.x86_64
```

## 다운로드 설치

- Tomcat Archive : [http://archive.apache.org/dist/tomcat/](http://archive.apache.org/dist/tomcat/)

```bash

## Tomcat 7, 8 다운로드 후 압축해제
wget -c http://archive.apache.org/dist/tomcat/tomcat-7/v7.0.99/bin/apache-tomcat-7.0.99.tar.gz
또는 wget -c http://archive.apache.org/dist/tomcat/tomcat-8/v8.5.59/bin/apache-tomcat-8.5.59.tar.gz
tar zxvf apache-tomcat-8.5.59.tar.gz -C /usr/local
ln -s /usr/local/apache-tomcat-8.5.59 /usr/local/tomcat
```

### 

### 3. 환경설정

```bash

```

### \*\* 서비스 등록

```bash

```

### \*\* 관리자 페이지

```bash
0. 매니저 페이지를 사용하려면 conf/tomcat-users.xml에서 아래 내용 추가할 것
	(manager-gui만 해도 됨)
	<role rolename="manager-gui"/>
	<role rolename="manager-script"/>
	<role rolename="manager-status"/>
	<user username="comin" password="comin!@#$" roles="manager-gui,manager-script,manager-status"/>
	
	1. 톰캣 설치 폴더 아래에 webapps 폴더가 있음
	
	
	
	2. ROOT 폴더가 톰캣 첫페이지, manager 폴더가 관리자 페이지
	3. conf/server.xml 에서 톰캣루트/webapps 를 appBase로 하고 있는 인스턴스가 기본으로 추가되어 있음 (없으면 추가하면 됨)
	
	
	4. 위에서 설정한 커넥터 포트로 접속하면 첫 화면, 오른쪽 manager 들어가면 매니저 페이지 나옴 (localhost:8080/manager/html)
	
	5. 위에서 설정한 appBase 폴더 하위에 있는 목록이 Applications 리스트에 나옴
	6. appBase 폴더 하위에 새로 만들 폴더명을 Context Path에,
실제 소스가 있는 위치를 Directory URL에 입력하고 Deploy를 누르면
	실제 소스가 appBase 폴더 하위에 복사가 된다
	

	7. 저렇게 추가해도 되고, 심볼릭 링크를 걸어 실제 소스에 연결만 되게끔 해줄 수도 있음
	
	(manager 폴더는 꼭 있어야 관리자 페이지 볼 수 있음)
	
	8. 이 페이지는 실시간으로 반영하기 때문에 심볼릭 링크 걸어주고 바로 확인 가능
	각 애플리케이션마다 오른쪽의 Start, Stop 으로 구동 가능
	
	
     * Undeploy 버튼 누르는 순간 Deploy 되어있던 경로의 파일들 모두 날려버림
	6에서 추가한 것처럼 appBase 폴더에 복사가 된 경우면 복사된 폴더만 날리지만
	7처럼 심볼릭 링크로 걸었으면 링크된 디렉토리 모두 날려버림
	복구방법 없음, 톰캣에서도 공식적으로 버튼 비활성화 불가하다고 함
	이 관리자 페이지를 사용안하는 결정적인 이유ㅠㅠ

    ** 이 방식은 어차피 하나의 톰캣 엔진으로만 돌아가서 인스턴스별 메모리 책정이 불가능.
  *** 각각 프로세스 구동, 메모리 튜닝이 가능한 멀티 인스턴스 방식으로 변경
```

### \*\* 날짜별 로그 생성 

```bash
vim bin/catalina.sh

	(line 400 이후)
// touch 검색하여 아래 항목 주석처리
	#touch "$CATALINA_OUT"
# 기존
	>> "$CATALINA_OUT" 2>&1 "&"
// Apache 설치된 경우
	2>&1 "&" | /usr/sbin/rotatelogs "$CATALINA_OUT"-%Y-%m-%d 86400 540 &
// Apache 미설치된 경우
	>> "$CATALINA_OUT"-$(date '+%Y-%m-%d') 2>&1 "&"
```

### \*\* 메모리 튜닝

```bash
vim bin/catalina.sh

JAVA_OPTS="-Djava.awt.headless=true -Dfile.encoding=UTF-8 -server -Xms2048M -Xmx4096M -XX:NewSize=512m -XX:MaxNewSize=512m -XX:+DisableExplicitGC"
```

### \*\* HTTP 메소드 제한

```bash
vim conf/web.xml

	<security-constraint>
	    <web-resource-collection>
	    <web-resource-name>Restricted methods</web-resource-name>
	        <url-pattern>/*</url-pattern>
	        <http-method>PUT</http-method>
	        <http-method>DELETE</http-method>
	        <http-method>OPTIONS</http-method>
	        <http-method>TRACE</http-method>
	    </web-resource-collection>
	    <auth-constraint />
	</security-constraint>

## 테스트
telnet localhost 8080(포트)
TRACE / HTTP/1.0

```

### \*\* 톰캣 버전 정보 숨기기

```bash
### 톰캣 서비스 종료 후 작업

## 1. cURL에서 숨기기
vim conf/server.xml
	<Connector server="server" /> # Connector 부분에 server 추가

## 2. Web 에러페이지에서 숨기기
cd $CATALINA_HOME
cp lib/catalina.jar 
cp lib/catalina.jar 임의위치
cd 임의위치
jar xf catalina.jar
rm catalina.jar
cd org/apache/catalina/util
vim ServerInfo.properties
	server.info=server(에러페이지에 표출할 내용)
	server.number=
	server.built=
cd 임의위치
jar cvf catalina.jar .
mv catalina.jar $CATALINA_HOME/lib (기존 jar 파일 덮어쓰기)
```

[https://www.hanumoka.net/2018/04/30/centOs-20180430-centos-install-jdk/](https://www.hanumoka.net/2018/04/30/centOs-20180430-centos-install-jdk/)

[https://blog.miyam.net/83](https://blog.miyam.net/83)
