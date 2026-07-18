+++
title = "Windows 11 설치 조건 미충족 우회"
date = "2025-06-27T01:05:00.000Z"
updated = "2025-06-27T01:10:00.000Z"
categories = ["OS"]
tags = ["WINDOWS"]
toc = true

[extra]
source = "notion"
notion_id = "21faac4e-32a5-80db-a682-db7aaa825f97"
notion_url = "https://app.notion.com/p/Windows-11-21faac4e32a580dba682db7aaa825f97"
+++

- 레지스트리 편집기 (regedit) 실행
  - `HKEY_LOCAL_MACHINE\SYSTEM\Setup\MoSetup` 로 이동
  - 마우스 오른쪽 > `새로 만들기` > `DWORD(32비트) 값` 클릭
  - `AllowUpgradesWithUnsupportedTPMOrCPU` Key 입력
  - 더블 클릭(수정)하여 값 데이터 `0`을 `1`로 입력 > 확인
    ![image](/notion-assets/21faac4e-32a5-80db-a682-db7aaa825f97/0.png)
- Windows 11 설치 ISO를 더블 클릭하여 탑재하고 `setup.exe` 실행
  - 다운로드 : [https://www.microsoft.com/ko-kr/software-download/windows11](https://www.microsoft.com/ko-kr/software-download/windows11)
  - Windows11 Installation Assistant 사용 X
  - ISO 다운로드하여 설치
    ![image](/notion-assets/21faac4e-32a5-80db-a682-db7aaa825f97/1.png)
