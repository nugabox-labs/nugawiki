+++
title = "Jeus 세션 무제한 설정"
date = "2022-04-14T04:36:00.000Z"
updated = "2023-09-19T08:06:00.000Z"
categories = ["SERVER"]
tags = ["WAS"]

[extra]
source = "notion"
notion_id = "1ab6ec93-fba1-43ad-b88a-c54de66fb9c3"
notion_url = "https://app.notion.com/p/Jeus-1ab6ec93fba143adb88ac54de66fb9c3"
+++

1. $JEUS\_HOME/config/호스트네임/JEUSMain.xml
   ```bash
…
<session-server>
<removal-to>-1</removal-to>
<passivation-to>-1</passivation-to>
</session-server>
…
   ```
1. $JEUS\_HOME/config/호스트네임/호스트네임\_servlet\_engine명/WEBMain.xml

   ```bash
…
<context-group>
<group-name>MyGroup</group-name>
<session-config>
<timeout>-1</timeout>
<session-config>
…
# 디폴트값 : 30분
   ```
1. application 홈/WEB-INF/web.xml
   ```bash
…
<session-config>
<session-timeout>-1</session-timeout>
</session-config>
…
   ```
