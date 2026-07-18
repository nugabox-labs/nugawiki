+++
title = "Burp Suite 사용법"
date = "2021-03-18T01:55:00.000Z"
updated = "2022-06-25T18:56:00.000Z"
categories = ["SERVER"]
tags = ["NETWORK"]
toc = true

[extra]
source = "notion"
notion_id = "b4d497db-5d54-4f2f-90f1-adbc8210017b"
notion_url = "https://app.notion.com/p/Burp-Suite-b4d497db5d544f2f90f1adbc8210017b"
+++

Proxy → Option → Proxy Listeners에 127.0.0.1:포트를 추가해준다

시스템 환경설정 → 네트워크 → 현재 사용 중인 네트워크 선택 → 고급 → 프록시 → 웹 프록시(HTTP)/보안 웹 프록시(HTTPS) 에 각각 127.0.0.1:지정해준포트 를 추가하고 확인 → 적용한다

Proxy → Intercept → Intercept is on 하여 스캔 가능

Intercept 탭에서 보낸 Request를 복붙하여 Repeater 탭의 Request에 복사

우측 상단 Target을 지정 후 Request 내용을 수정하여 Send 클릭 → 수정된 Request에 대한 Response 값이 출력된다

예) GET /setStats.do?siteId=www → OPTIONS /setStats.do?siteId=www 

Send → HTTP/1.1 403 403 Error

![image](/notion-assets/b4d497db-5d54-4f2f-90f1-adbc8210017b/8.png)

![image](/notion-assets/b4d497db-5d54-4f2f-90f1-adbc8210017b/9.png)
