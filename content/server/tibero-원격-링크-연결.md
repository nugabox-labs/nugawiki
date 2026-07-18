+++
title = "Tibero 원격 링크 연결"
date = "2021-03-22T01:02:00.000Z"
updated = "2024-01-09T02:54:00.000Z"
categories = ["SERVER"]
tags = ["DB", "Tibero"]
toc = true

[extra]
source = "notion"
notion_id = "4a480ca7-45c8-45a9-b3e9-edc25718648c"
notion_url = "https://app.notion.com/p/Tibero-4a480ca745c845a9b3e9edc25718648c"
+++

1. TBDNS 설정파일 수정 : `$ vim TB_HOME/client/config/tbdsn.tbr` 아래 코드 추가
   ```bash
[ALIAS명] = (
	(INSTANCE =
		(HOST = [원격 호스트])
		(PORT = [원격 포트])
		(DB_NAME = [원격 DB명])
	)
)

# Example
TPDB_REAL = (
	(INSTANCE=
		(HOST=112.187.64.53)
		(PORT=8629)
		(DB_NAME=mportal)
	)
)
   ```
1. 티베로 해당 계정에 권한 부여
   ```sql
GRANT CREATE DATABASE LINK TO 'USER명';
   ```
1. 티베로 해당 계정에서 DB Link 생성
   ```sql
CREATE DATABASE LINK 'LINK명'
	CONNECT TO '원격USER명' IDENTIFIED BY '원격USER패스워드'
	USING 'TBDNS에 설정한 ALIAS';
   ```
1. 확인
   ```sql
SELECT * FROM ST_SITE@'LINK명';
   ```
1. 삭제
   ```sql
DROP DATABASE LINK 'LINK명';
   ```
