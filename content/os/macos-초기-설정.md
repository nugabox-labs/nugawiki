+++
title = "macOS 초기 설정"
date = "2021-01-21T15:59:00.000Z"
updated = "2025-06-12T02:03:00.000Z"
categories = ["OS"]
tags = ["MACOS"]

[extra]
source = "notion"
notion_id = "5b1cc5e5-5b46-4245-b992-55d8b380def4"
notion_url = "https://app.notion.com/p/macOS-5b1cc5e55b464245b99255d8b380def4"
+++

> [!TIP]
> Inital Draft : 2019.10.24
Last Modified : 2025.03.17
Reference : macOS Sonoma (버전 14.2)

# 시스템 환경설정

---

- iCloud 로그인 및 설정
- 손쉬운 사용 - 포인터 제어기 - 트랙패드 옵션 - 드래그 활성화 - 세 손가락으로 드래그하기
- 키보드 - 단축키
- 사운드 - 음량이 변경되면 피드백 재생
- Safari - 스타일시트 추가 등
- (실리콘) 로제타 설치
  ```bash
/usr/sbin/softwareupdate --install-rosetta --agree-to-license
  ```

# **키보드 단축키**

---

> [!NOTE]
> ⌘ : Cmd(커맨드) / ⌃ : Ctrl(컨트롤) / ⌥ : Opt(옵션=알트) /
⇧ : Shift(쉬프트) / ⇪ : Caps Lock(캡스락) / Escape(ESC) / Return(Enter)

- Spotlight 검색 : Cmd + Space
- 복사/붙여넣기 : Cmd + C / Cmd + V
- 되돌리기 : Cmd + Z
- 저장 : Cmd + S
- **앱 종료 : Cmd + Q**
- **창 닫기 : Cmd + W**
- 앱 설정 : Cmd + ,
- 강제 종료 : Cmd + Opt + Esc
- **화면 잠금 : Ctrl + Cmd + Q**
- 프로그램 전환 : Cmd + Tab
- 스크린샷 영역 : Cmd + Shift + 4 (스페이스 : 특정 창)
- 스크린샷 전체 : Cmd + Shift + 3
- 데스크톱 전환 : Control + ← 또는 →

# **필수 어플리케이션**

---

### nugaBox 제공 필수 패키지 설치

아래 명령어를 복사해서 터미널에서 실행하세요

```bash
bash <(curl -s https://raw.githubusercontent.com/nugaBox/essential/main/mac/essential.sh)
```

### 앱스토어\_ 무료

- Keynote / [`앱스토어`](https://apps.apple.com/kr/app/keynote/id409183694?mt=12)
- Pages / [`앱스토어`](https://apps.apple.com/kr/app/pages/id409201541?mt=12)
- Numbers / [`앱스토어`](https://apps.apple.com/kr/app/numbers/id409203825?mt=12)
- Microsoft Office / [`앱스토어`](https://apps.apple.com/kr/app-bundle/microsoft-365/id1450038993?mt=12)
- 한컴오피스 뷰어 / [`앱스토어`](https://apps.apple.com/kr/app/%ED%95%9C%EC%BB%B4%EC%98%A4%ED%94%BC%EC%8A%A4-%ED%95%9C%EA%B8%80-2014-vp-%EB%B7%B0%EC%96%B4/id416746898?mt=12)
- 카카오톡 / [`앱스토어`](https://apps.apple.com/kr/app/%EC%B9%B4%EC%B9%B4%EC%98%A4%ED%86%A1/id869223134?mt=12)
- Windows App (기존 원격 데스크탑) /  [`앱스토어`](https://apps.apple.com/kr/app/windows-app/id1295203466?mt=12)
- iBar (메뉴바 정리) / [`앱스토어`](https://apps.apple.com/kr/app/ibar-menubar-icon-control-tool/id6443843900?mt=12)

### 앱스토어\_ 유료

- Keka / [`앱스토어`](https://apps.apple.com/kr/app/keka/id470158793?mt=12)
- PopClip / [`앱스토어`](https://apps.apple.com/kr/app/popclip/id445189367?mt=12)

### 다운로드\_ 무료

- **Homebrew** (홈브루 : 패키지 관리자) / [`설치`](/4efd3b62998845899b363dc8ae51645c#5f0fdfc50d3a4707a803487d017b5f26)
  ```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Home&& brew/install/HEAD/install.sh)"
  ```
- **구글 크롬 브라우저** / [`다운로드`](https://www.google.com/intl/ko/chrome/) / `brew install --cask google-chrome`
- 네이버 웨일 브라우저 / [`다운로드`](https://whale.naver.com/ko/download) / `brew install --cask naver-whale`
- 엣지 브라우저 / [`다운로드`](https://www.microsoft.com/ko-kr/edge) / `brew install --cask microsoft-edge`
- Notion / [`다운로드`](https://www.notion.so/desktop/mac-universal/download) / `brew install --cask notion`
- Rectangle (윈도우 창 유틸리티) / [`다운로드`](https://rectangleapp.com/) / `brew install --cask rectangle`
- AppCleaner (앱 삭제 툴) / [`다운로드`](https://freemacsoft.net/appcleaner/) /`brew install --cask appcleaner`
- Itsycal (미니 캘린더) / [`다운로드`](https://www.mowglii.com/itsycal/) / `brew install --cask itsycal`
- 한글자모변환(Contact) / [`다운로드`](https://namocom.tistory.com/907) 
- Adobe Creative Cloud / [`다운로드`](https://www.adobe.com/creativecloud.html) / `brew install --cask adobe-creative-cloud`
- 유튜브 뮤직 (비공식) / [`다운로드`](https://ytmusic.app/) / `brew install --cask yt-music`
- 카카오워크 / [`다운로드`](https://www.kakaowork.com/download)
- 브루클린 스크린세이버 / [`다운로드`](https://github.com/pedrommcarrasco/Brooklyn/releases/tag/2.1.0)
- Raycast / [`다운로드`](https://www.raycast.com/) / `brew install --cask raycast`

```bash
brew install --cask google-chrome \
&& brew install --cask notion \
&& brew install --cask tiles \
&& brew install --cask itsycal \
&& brew install --cask visual-studio-code \
&& brew install --cask naver-whale \
&& brew install --cask 1password \
&& brew install --cask iterm2 \
&& brew install --cask appcleaner \
&& brew install --cask movist-pro \
&& brew install --cask synology-drive \
&& brew install --cask postman \
&& brew install --cask teamviewer \
&& brew install --cask open-in-code \
&& brew install --cask discord \
&& brew install --cask karabiner-elements \
&& brew install --cask intellij-idea \
&& brew install --cask datagrip \
&& brew install --cask cleanmymac \
&& brew install --cask transmission \
&& brew install --cask bartender
```

### 다운로드\_ 유료

- Bartender (메뉴바 유틸리티) / 구독형 / [`다운로드`](https://www.macbartender.com/) / `brew install --cask bartender`
- Alfred (명령어 런처) / [`홈페이지`](https://www.alfredapp.com/) / `crack` 
- CleanMyMac (시스템 최적화 유틸리티) / [`홈페이지`](https://cleanmymac.com/ko) / `crack` 

# Windows 사용 환경

---

### Windows ISO 다운로드

- Microsoft Windows 10 / [`다운로드`](https://www.microsoft.com/ko-kr/software-download/windows10ISO)
- Microsoft Windows 11 / [`다운로드`](https://www.microsoft.com/ko-kr/software-download/windows11)

### BootCamp를 통한 설치 (Intel Mac)

- 공식 매뉴얼 : ↗︎ [https://support.apple.com/ko-kr/HT201468](https://support.apple.com/ko-kr/HT201468)
- 익스트림 매뉴얼 : ↗︎ [https://extrememanual.net/12760](https://extrememanual.net/12760)

### 가상머신 어플리케이션

- 패러렐즈 오류 관련 조치
  - 네트워크 초기화 오류
    1. 페러럴즈 종료
    1. 터미널에서 명령어 실행 (관리자 권한 필요)
       `sudo nano /Library/Preferences/Parallels/network.desktop.xml`
    1. 네 번째 줄에 있는  <UseKextless>-1</UseKextless>  을  <UseKextless>0</UseKextless> 로 수정 (없으면 새로 추가)
    1. `^ + x` → `y` → `Enter`를 눌러 변경사항 저장 및 종료
    1. 패러렐즈 실행 및 인터넷 확인
    1. 이더넷 언플러그인 경우 옵션 - 하드웨어 - 네트워크에서 공유 네트워크(권장) 되어있는지 확인
  - USB 장치 인식 오류
    1. 페러럴즈 종료
    1. 터미널에서 명령어 실행 (관리자 권한 필요)
       `sudo nano /Library/Preferences/Parallels/dispatcher.desktop.xml`
    1. `^ + w` → <Usb>0</Usb> 항목을 찾아서  <Usb>1</Usb> 로 수정
    1. `^ + x` → `y` → `Enter`를 눌러 변경사항 저장 및 종료
    1. 패러렐즈 실행 및 USB 장치 연결 확인

- ‘[DOWNLOAD FUSION OR WORKSTATION](https://support.broadcom.com/group/ecx/downloads)’ 클릭하여 Broadcom 회원가입 / 로그인
- My Downloads에서 “Free Software Downloads available HERE” 클릭
  ![image](/notion-assets/5b1cc5e5-5b46-4245-b992-55d8b380def4/9.png)
- ‘VMware Fusion’ 클릭 후 원하는 버전 클릭하여 다운로드

- Oracle VM Virtual Box (무료) /  [`다운로드`](https://download.virtualbox.org/virtualbox/6.1.18/VirtualBox-6.1.18-142142-OSX.dmg)  / `brew install --cask virtualbox`

# 개발 환경 구축

macOS용 패키지 관리자인 [🍺  Homebrew 설치](/4efd3b62998845899b363dc8ae51645c#5f0fdfc50d3a4707a803487d017b5f26) 후 진행할 것을 권장

---

## Editor & IDE

- Visual Studio Code / [`다운로드`](https://code.visualstudio.com/download) / `brew install --cask visual-studio-code`
- Open in Code (Finder) / [`다운로드`](https://github.com/sozercan/OpenInCode) / `brew install --cask open-in-code`
- Atom / [`다운로드`](https://atom.io/) / `brew install --cask visual-studio-code`
- Brackets / [`다운로드`](https://github.com/adobe/brackets) / `brew install --cask visual-studio-code`
- Xcode / [`앱스토어`](https://apps.apple.com/kr/app/xcode/id497799835?mt=12)

### SQL Tools

- DBeaver Community / [`다운로드`](https://dbeaver.io/download/) / `brew install --cask dbeaver-community`
- MySQL Workbench / [`다운로드`](https://dev.mysql.com/downloads/workbench/) / `brew install --cask mysqlworkbench`
- SQL Developer / [`다운로드`](https://www.oracle.com/tools/downloads/sqldev-downloads.html)

### SSH/SFTP Tools

- Termius / [`다운로드`](https://termius.com/mac-os) / [`앱스토어`](https://apps.apple.com/kr/app/termius-ssh-client/id1176074088?mt=12) / `brew install --cask termius`
- FileZilla / [`다운로드(실리콘)`](https://filezilla-project.org/download.php?platform=macos-arm64) / [`다운로드(인텔)`](https://filezilla-project.org/download.php?type=client)

# 기타 세팅

- SIP(무결성 보호) 해제 : 인터넷에서 다운로드 받은 앱 설치 시 필요
  - 현재 SIP 상태 확인 : 터미널에서
    ```bash
csrutil status
    ```
  - 복구 모드 진입 (재부팅하자마자 Cmd + R)
  - 유틸리티 > 터미널
    ```bash
# 비활성화(해제)
csrutil disable

# 활성화(원복)
csrutil enable

# 재부팅
reboot
    ```
- 아이콘 변경
  [https://macosicons.com](https://macosicons.com)
- Ventura 이후 ssh 연결 불가 시
  - `sudo vim /etc/ssh/ssh_config`
    ```bash
# 제거
Ciphers aes128-ctr,aes192-ctr,aes256-ctr,aes128-cbc,3des-cbc
MACs hmac-md5,hmac-sha1,umac-64@openssh.com

# 마지막 라인에 값 추가
    HostkeyAlgorithms ssh-dss,ssh-rsa
    KexAlgorithms +diffie-hellman-group1-sha1
    ```
  - 적용 안 되면 `~/.ssh/known_hosts` 파일제거

- 텍스트 편집기 메모장처럼 바로 열기
  ```bash
defaults write -g NSShowAppCentricOpenPanelInsteadOfUntitledFile -bool false
  ```
