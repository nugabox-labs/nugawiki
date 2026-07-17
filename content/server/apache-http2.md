+++
title = "Apache HTTP/2"
date = "2021-07-07T01:04:00.000Z"
updated = "2022-06-25T18:56:00.000Z"
categories = ["SERVER"]
tags = ["WEB"]

[extra]
source = "notion"
notion_id = "1085819d-c709-45cf-a212-c9897da7ed2c"
notion_url = "https://app.notion.com/p/Apache-HTTP-2-1085819dc70945cfa212c9897da7ed2c"
+++

### HTTP/2

HTTP 1.1과 호환성을 유지하면서도 웹브라우저 페이지 로딩 속도를 개선한 HTTP 프로토콜입니다. 클라이언트와 서버간에 데이터 프레임이 지정되는 방식과 데이터가 전송되는 방식을 수정하여 속도를 개선하여 페이지 로드 시간을 50%정도 줄였다고 합니다.

### Apache **mod\_http2 모듈**

아파치에서는 2.4.17버전부터 지원되는 mod\_http2 모듈을 이용하여 구현이 가능합니다. mod\_http2는 libngttp2 라이브러리를 사용하며, OpenSSL 1.0.2 이상을 필요로 합니다. 또한 Prefork 모드를 지원하지 않기 때문에 컴파일시 주의하여야 합니다.

### Issues

safari cannot parse response nsurlerrordomain code=-1017 오류
: 개발서버의 특정 https 사이트에 접속 시 Safari 브라우저 엔진을 사용하는 mac, iOS에서 위와 같은 오류 발생

### Trouble Shooting

[https://talk.plesk.com/threads/ios-mac-devices-could-not-open-website.358985/](https://talk.plesk.com/threads/ios-mac-devices-could-not-open-website.358985/)

- Apache에 HTTP/2가 설정된 경우인지 브라우저에서 체크 **→ HTTP/2 사용중임을 확인**

![image](/notion-assets/1085819d-c709-45cf-a212-c9897da7ed2c/4.png)

- Apache에서 해당 모듈이 켜져있는지 `conf/httpd.conf` 또는 `conf.modules.d/10-h2.conf` 확인
  **→ mod\_http2 모듈 사용중임을 확인**

  ```bash
LoadModule http2_module modules/mod_http2.so

<IfModule http2_module>
ProtocolsHonorOrder On
Protocols h2 h2c http/1.1
</IfModule>
  ```
- 위 모듈 사용 부분을 주석 처리하고 Apache 재시작하여 정상적으로 접속 확인
