+++
title = "Tomcat 버전 정보 노출 숨김"
date = "2021-03-18T02:07:00.000Z"
updated = "2023-11-22T01:19:00.000Z"
categories = ["SERVER"]
tags = ["WAS"]
toc = true

[extra]
source = "notion"
notion_id = "e5eee143-8ba1-476b-bbf9-e94767735f95"
notion_url = "https://app.notion.com/p/Tomcat-e5eee1438ba1476bbbf9e94767735f95"
+++

1. 톰캣 설정 파일 수정 `$CATALINA_HOME/conf/server.xml`
   ```bash
# Connector에 추가
<Connector ... server="Server" />

# Host 아래에 추가
<Valve className="org.apache.catalina.valves.ErrorReportValve" showReport="false" showServerInfo="false"/>
   ```
1. 톰캣 라이브러리의 jar 파일 압축 해제하여 수정하고 다시 압축 (톰캣 종료 후)
   ```bash
cd $CATALINA_HOME/lib
cp catalina.jar catalina.jar_org
jar xvf catalina.jar
vim org/apache/catalina/util/ServerInfo.properties
	Server.info=Apache Tomcat
	Server.number=
jar cvf catalina.jar META-INF org
   ```

![image](/notion-assets/e5eee143-8ba1-476b-bbf9-e94767735f95/7.png)
