+++
title = "Tomcat 캐쉬 메모리 부족 로그"
date = "2021-04-28T01:08:00.000Z"
updated = "2022-06-25T18:56:00.000Z"
categories = ["SERVER"]
tags = ["WAS"]
toc = true

[extra]
source = "notion"
notion_id = "6572ce8f-e762-4004-8aa6-029217ab5c7a"
notion_url = "https://app.notion.com/p/Tomcat-6572ce8fe76240048aa6029217ab5c7a"
+++

- 캐쉬 메모리 부족 관련 로그 확인
  ```
정보: 백그라운드 캐시 퇴거 (cache eviction) 프로세스가, 컨텍스트 []을(를) 위한 캐시의 [10] 퍼센트를 해제시킬 수
 없었습니다. 캐시의 최대 크기를 증가시킬 것을 고려해 보십시오. 캐시 퇴거 작업 이후, 대략 [9,405] KB의 데이터가 캐시에 남아 있습니다.

경고: []에 위치한 리소스를 웹 애플리케이션 []을(를) 위한 캐시에 추가할 수 없습니다. 왜냐하면 만료된 캐시 엔트리들을 없애버린 이후에도 여유 공간이 충분하지 않기 때문입니다. 캐시의 최대 크기를 증가시키는 것을 고려해 보십시오.
  ```
- `conf/context.xml`에  아래 내용을 추가한다.
  ```xml
<Resources cachingAllowed="true" cacheMaxSize="100000"/>
  ```
