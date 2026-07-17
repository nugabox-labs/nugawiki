+++
title = "Tibero DB 이관"
date = "2021-05-06T01:12:00.000Z"
updated = "2024-01-09T02:54:00.000Z"
categories = ["SERVER"]
tags = ["DB", "Tibero"]

[extra]
source = "notion"
notion_id = "25c7e6c6-7b34-4a8f-98d9-dc02f0cbfa64"
notion_url = "https://app.notion.com/p/Tibero-DB-25c7e6c67b344a8f98d9dc02f0cbfa64"
+++

### USER Migration인 경우

- 사용자의 모든 오브젝트 삭제 쿼리 (아래 쿼리로 나온 결과를 추출하여 그대로 실행)
  ```sql
SELECT 'drop '
  ||object_type
  ||' '
  || object_name
  || DECODE(OBJECT_TYPE,'TABLE',' CASCADE CONSTRAINTS;',';')
FROM user_objects
  ```
- 사용자 삭제
  ```sql
DROP USER username CASCADE;
  ```
- 연결된 세션이 있어 사용자 삭제가 안 되는 경우
  ```sql
# 현재 세션 확인
SELECT * FROM V$SESSION;

# 특정 세션 강제 종료
ALTER SYSTEM KILL SESSION (SID, SERIAL#);
  ```
- 사용자 생성
  ```sql
CREATE USER username 
	IDENTIFIED BY userpassword 
	DEFAULT TABLESPACE tablespacename;
  ```
- 사용자 권한 부여
  ```sql
GRANT CONNECT, DBA, RESOURCE TO username;

GRANT CREATE DATABASE LINK, CREATE TABLE, ALTER ANY TABLE, DROP ANY TABLE, SELECT ANY TABLE,INSERT ANY TABLE, UPDATE ANY TABLE, DELETE ANY TABLE, CREATE PROCEDURE, CREATE ANY PROCEDURE, ALTER ANY PROCEDURE, DROP ANY PROCEDURE, EXECUTE ANY PROCEDURE, CREATE SESSION,LOCK ANY TABLE,COMMENT ANY TABLE, CREATE SEQUENCE, CREATE ANY SEQUENCE, ALTER ANY SEQUENCE, DROP ANY SEQUENCE,SELECT ANY SEQUENCE, CREATE TRIGGER, CREATE ANY TRIGGER, ALTER ANY TRIGGER, DROP ANY TRIGGER, CREATE VIEW, CREATE ANY VIEW,DROP ANY VIEW TO username;  

# 프로시저에서 테이블 생성 시 권한
GRANT EXECUTE ON DBMS_SQL TO username;
  ```

### TBEXPORT

- FULL, USER, TABLE 모드 중 한 가지 모드를 선택한다.
- Tablespace Name이 Import할 DB와 동일한 지 확인한다.
- 권한 문제를 예방하기 위해 sys 계정을 권장한다.

- USERNAME : export할 DB 계정
- PASSWORD : export할 DB 계정의 패스워드
- IP : export할 DB의 IP
- PORT : export할 DB의 Port
- SID : export할 DB의 SID
- FILE : export한 내용을 담을 파일 이름
- FULL : DB의 전체 내용을 export
- USER : DB의 특정 User만 export
- TABLE : DB의 특정 Table만 export

- 로컬 DB를 Export
  ```bash
# Full 모드
tbexport username=sys password=tibero port=8629 sid=tibero file=exported.dat full=y
# User 모드
tbexport username=sys password=tibero port=8629 sid=tibero file=exported.dat user=tibero
# Table 모드
tbexport username=sys password=tibero port=8629 sid=tibero file=exported.dat table=tibero.test
  ```
- 원격 DB를 Export (Export 된 데이터 파일을 원격서버에 생성)
  ```bash
# Full 모드
tbexport username=sys password=tibero ip=192.168.2.51 port=8629 sid=tibero file=exported.dat full=y
# User 모드
tbexport username=sys password=tibero ip=192.168.2.51 port=8629 sid=tibero file=exported.dat user=tibero
# Table 모드
tbexport username=sys password=tibero ip=192.168.2.51 port=8629 sid=tibero file=exported.dat table=tibero.test
  ```

### TBIMPORT

- FULL, FROMUSER, USER, TABLE 모드 중 한 가지 모드를 선택한다.
- FROMUSER를 명시하면 TOUSER도 함께 명시해야 한다.
- Tablespace Name이 Export한 DB와 동일한 지 확인한다.
- 권한 문제를 예방하기 위해 sys 계정을 권장한다.
- Import 전 Tablespace, User는 미리 생성한다.
- 로컬 DB에 Import
  ```bash
# Full 모드
tbimport username=sys password=tibero port=8629 sid=tibero file=test.dat full=y
# FromUser ToUser 모드
tbimport username=sys password=tibero port=8629 sid=tibero file=test.dat fromuser=test touser=test
# User 모드
tbimport username=sys password=tibero port=8629 sid=tibero file=test.dat user=tibero
# Table 모드
tbimport username=sys password=tibero port=8629 sid=tibero file=test.dat table=tibero.test
  ```
- 원격 DB에 Import (로컬에 있는 Export된 데이터를 원격 DB에 Import)
  ```bash
# Full 모드
tbimport username=sys password=tibero ip=192.168.2.51 port=8629 sid=tibero file=test.dat full=y
# FromUser ToUser 모드
tbimport username=sys password=tibero ip=192.168.2.51 port=8629 sid=tibero file=test.dat fromuser=test touser=test
# User 모드
tbimport username=sys password=tibero ip=192.168.2.51 port=8629 sid=tibero file=test.dat user=tibero
# Table 모드
tbimport username=sys password=tibero ip=192.168.2.51 port=8629 sid=tibero file=test.dat table=tibero.test
  ```
