+++
title = "시놀로지 DNS Server 설정"
date = "2021-01-14T14:15:00.000Z"
updated = "2022-06-25T18:56:00.000Z"
categories = ["OS", "SERVER"]
tags = ["SYNOLOGY", "NETWORK"]

[extra]
source = "notion"
notion_id = "23303d5a-5fe6-49f8-8e85-effabc81f8f8"
notion_url = "https://app.notion.com/p/DNS-Server-23303d5a5fe649f88e85effabc81f8f8"
version = "DSM6"
external_url = "https://www.youtube.com/watch?v=oMQSTtHGEBs"
+++

## Synology DNS Server

1. 패키지 센터에서 DNS Server 설치 및 실행
1. 영역 > 생성 > Master 영역
   ![image](/notion-assets/23303d5a-5fe6-49f8-8e85-effabc81f8f8/10.png)
1. 생성된 해당 영역 더블 클릭 시 '리소스 레코드 편집' 윈도우 열림
1. 네임서버가 자동으로 등록되어 있음. 2차 네임서버를 사용한다면 아래와 같이 기본으로 세팅한다.
('이름' 란을 비우면 도메인 그대로를 가리킴)
   - 도메인 → A:IP 주소 // 이 도메인의 IP 주소는 여기다
   - 도메인 → NS:ns1.도메인 // 이 도메인의 네임서버는 여기다
   - ns1.도메인 → A:IP 주소 // 이 네임서버의 IP 주소는 여기다

   ![image](/notion-assets/23303d5a-5fe6-49f8-8e85-effabc81f8f8/11.png)
1. 기타 등록할 레코드를 생성 버튼을 클릭하여 등록한다.
- CNAME Type : 이 서브 도메인을 '도메인'으로 연결한다. (정식 이름 : 자기 도메인 입력) 
- A Type : 이 서브 도메인을 'IP'로 연결한다.

## 공유기

- 시놀로지 IP에 대하여 53번 Port(DNS) 포트포워딩 적용
  (외부 포트 : 53, 해당 IP : 시놀로지 내부 IP, 내부 포트 : 53)

## 도메인 구매 사이트

1. 해당 도메인에 '호스트 등록'에서 네임서버로 사용할 호스트를 추가한다.
   - 대부분 '호스팅 관리' 메뉴에서 네임서버를 등록 후 변경할 수 있으며, 적용되는 데에 시간이 소요된다.

   ![image](/notion-assets/23303d5a-5fe6-49f8-8e85-effabc81f8f8/11.png)
1. 해당 도메인의 '네임서버 변경'에서 네임서버 정보를 입력한다.
   - 호스트 등록이 완료되기까지 시간이 소요되며, 정상적으로 등록된 경우 IP가 자동으로 체크된 후 네임서버가 변경된다. 네임서버 변경 시에도 업체에 따라 일정 시간이 소요된다.

   ![image](/notion-assets/23303d5a-5fe6-49f8-8e85-effabc81f8f8/11.png)

여러 도메인 사용할 경우 도메인 별로 네임서버 만들어서 사용해야함

순서 : dns server에 도메인 등록(정/역방향) → ns 등록 → 호스팅 사이트에서 호스트 등록 → 네임서버 변경

→ dns server에서 도메인에 대한 호스트 등록(2차도메인) → 역방향 프록시에서 80 연결하여 사용

ssl 설정 시

역방향 프록시에서 443으로 연결 → 보안-인증서에서 새 인증서 추가 → Let's Encrypt에서 인증서 얻기 → 도메인 이름, 이메일, 주제 대체 이름(사용할 2차 도메인 전부 입력, 연결 가능해야 함. 404 뜨면 발급안됨) → 적용하면 새로 발급됨 → 해당 인증서 선택 후 구성 클릭 → 역방향 프록시에서 443으로 연결한 사이트가 추가 되어 있으면 해당 인증서로 변경 및 적용
