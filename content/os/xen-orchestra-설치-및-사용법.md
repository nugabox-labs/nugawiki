+++
title = "Xen Orchestra 설치 및 사용법"
date = "2025-01-11T09:39:00.000Z"
updated = "2025-05-19T00:28:00.000Z"
categories = ["OS"]
tags = ["LINUX"]

[extra]
source = "notion"
notion_id = "178aac4e-32a5-809d-a1d6-ea7dd9249a95"
notion_url = "https://app.notion.com/p/Xen-Orchestra-178aac4e32a5809da1d6ea7dd9249a95"
+++

> Xen Orchestra(XO)는 Xen Server 또는 XCP-ng 관리를 웹으로 하기 위한 소프트웨어로 클라우드 버전은 유료로 제공되지만 특정 기능만 블록되어있는 Community Edition이 있음.

> **공식 문서 : **[**https://docs.xen-orchestra.com/**](https://docs.xen-orchestra.com/)

# 공식 홈페이지를 통한 자동 설치

[https://vates.tech/deploy/](https://vates.tech/deploy/)

![호스트 IP, 계정 입력](/notion-assets/178aac4e-32a5-809d-a1d6-ea7dd9249a95/1.png)

![XOA가 설치될 환경 정보 입력 (저장소, 네트워크)](/notion-assets/178aac4e-32a5-809d-a1d6-ea7dd9249a95/2.png)

![설치될 XOA의 관리자 계정 및 SSH 계정을 입력하여 생성](/notion-assets/178aac4e-32a5-809d-a1d6-ea7dd9249a95/2.png)

![설치 완료](/notion-assets/178aac4e-32a5-809d-a1d6-ea7dd9249a95/2.png)

![정상적으로 Home 화면 진입](/notion-assets/178aac4e-32a5-809d-a1d6-ea7dd9249a95/2.png)

> [!WARNING]
> 설치 후 xcp-ng에서 reboot 테스트 반드시 진행할 것

# 수동 설치

## 1. Xen Orchestra 설치

1. 인터넷이 가능한 Xen Server (이하 XCP-ng와 동일)의 커맨드라인 또는 SSH에 접속
1. 아래 스크립트 설치

```bash
curl https://raw.githubusercontent.com/Jarli01/xenorchestra_installer/master/xo_install.sh | sudo bash
```

1. 설치가 완료되면 아래 내용 확인
   ![image](/notion-assets/178aac4e-32a5-809d-a1d6-ea7dd9249a95/2.png)
1. 출력된 내용대로 웹브라우저에서 해당 Xen Server의 IP로 접속
1. 화면에서 “Quick Deploy” 클릭
   ![image](/notion-assets/178aac4e-32a5-809d-a1d6-ea7dd9249a95/2.png)
1. 관리자 정보 입력
   - Host Username : root
   - Host Password : `xen server 설치 시 관리자 비밀번호`
1. 스토리지 및 네트워크 정보 입력
   > **DHCP인 경우 정보 입력 칸 비운 채로 NEXT**

   ![image](/notion-assets/178aac4e-32a5-809d-a1d6-ea7dd9249a95/2.png)
1. 계정 정보 입력
   > 첫번째 섹션은 로컬 접속 계정 (admin@admin.net / admin)
   > 두번째 섹션은 [xen-orchestra.com](http://xen-orchestra.com/) 접속 계정 (이메일/비밀번호)
   > 세번째 섹션은 로컬 SSH 계정 (비밀번호 미입력 시 계정 비활성화)

   ![image](/notion-assets/178aac4e-32a5-809d-a1d6-ea7dd9249a95/2.png)
1. Deploy로 진행하면 해당 내용으로 Xen Orchestra가 설정되고, 새로운 IP 주소(DHCP)로 Xen Orchestra 화면 열림
   > 기본 주소가 https라서 보안 경고 나올 수 있음

   ![image](/notion-assets/178aac4e-32a5-809d-a1d6-ea7dd9249a95/2.png)
1. 위에서 설정한 계정으로 로그인
   > [admin@admin.net](mailto:admin@admin.net) / admin

## 2. ISO Storage 추가

### 2.1. Local ISO Storage

1. 메뉴 중 New > Storage
1. 상단의 pool을 해당 Xen Server로 선택하고, 아래 정보 추가
   ![image](/notion-assets/178aac4e-32a5-809d-a1d6-ea7dd9249a95/2.png)
1. Create가 완료되면, 메뉴 중 Import > Disk
1. 생성한 ISO Storage를 선택하고 ISO 업로드 또는 From URL을 클릭하여 업로드
   ![image](/notion-assets/178aac4e-32a5-809d-a1d6-ea7dd9249a95/2.png)
1. 업로드가 완료되면 해당 Storage의 Disk에서 확인 가능
   ![image](/notion-assets/178aac4e-32a5-809d-a1d6-ea7dd9249a95/2.png)

### 2.2. SMB ISO

Select storage type을 `SMB ISO`로 설정하고 서버 정보를 아래와 같이 입력한다.

![image](/notion-assets/178aac4e-32a5-809d-a1d6-ea7dd9249a95/2.png)

## 3. VM 추가

1. 메뉴 중 New > VM
1. 상단의 pool을 해당 Xen Server로 선택하고, 아래 정보 추가
   > vCPU나 RAM의 최대값은 Home > Pool 에서 확인
   > Topology는 1 socket with N cores 가 일반적으로 적합함
   > ISO 파일은 위에서 생성한 ISO Storage에 미리 업로드하여 선택

   ![image](/notion-assets/178aac4e-32a5-809d-a1d6-ea7dd9249a95/2.png)

   ![image](/notion-assets/178aac4e-32a5-809d-a1d6-ea7dd9249a95/2.png)
1. Create되면 해당 VM이 생성됨
메뉴 Home > VM > Console 로 가서 콘솔 화면 보고 설치 진행 가능
   ![image](/notion-assets/178aac4e-32a5-809d-a1d6-ea7dd9249a95/2.png)
