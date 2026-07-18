+++
title = "CentOS 초기 설정"
date = "2020-10-23T05:29:00.000Z"
updated = "2024-09-26T06:10:00.000Z"
categories = ["OS"]
tags = ["LINUX"]
toc = true

[extra]
source = "notion"
notion_id = "d69770b8-d16d-4bb7-ab31-d560da6eb8ee"
notion_url = "https://app.notion.com/p/CentOS-d69770b8d16d4bb7ab31d560da6eb8ee"
version = "CentOS 6.x / CentOS 7.x"
external_url = "https://wiki.centos.org/kr/Download"
+++

---

## ↗︎ [시스템 정보 확인](/4ecdbaeac3c5451089130c15a677fcf2#b24e41fbaa644a528d9b529f384d80d8)

# 필수 서비스 설치

Yum 패키지 관리자를 통해 필수 서비스 및 패키지를 설치한다.

---

### Yum 관련 내용

### 네트워크 유틸

```bash
yum -y install net-tools bind-utils wget elinks nmap psmisc telnet
```

### 시스템 유틸

```bash
yum -y install vim yum-utils sysstat psmisc pstree
```

### 개발환경

```bash
yum -y install gcc gcc-c++
```

### 보안 서비스

```bash
yum -y install system-config-firewall-tui policycoreutils-python setroubleshoot setroubleshoot-server setroubleshoot-doc setroubleshoot-plugins setools-console
```

### 매뉴얼

```bash
yum -y install man man-pages kernel-doc
```

### 저장소 설치

```bash
yum -y install epel-release
```

# 필수 설정

---

### Timezone 설정

- UTC → KST (OS 설치할 때 설정 따라 바뀜)
  ```bash
ln -sf /usr/share/zoneinfo/Asia/Seoul /etc/localtime
또는
timedatectl set-timezone Asia/Seoul
  ```

### 시간 동기화

- rdate, ntp 설치
  ```bash
yum -y install rdate ntp
  ```
- 시간 동기화
  ```bash
rdate -s time.bora.net
  ```
- ntp 활성화
  ```bash
# CentOS 6
vi /etc/ntp.conf
	#server 0.centos.pool.ntp.org
  #server 1.centos.pool.ntp.org
  #server 2.centos.pool.ntp.org
  server kr.pool.ntp.org
  server time.bora.net
  server time.kornet.net
chkconfig ntpd on
/etc/init.d/ntpd start

# CentOS 7
timedatectl set-ntp y
  ```
- 동기화된 시간 확인
  ```bash
date
  ```

- chrony 데몬 동기화
  ```bash
vim /etc/chrony.conf
	# 기존 내용 주석처리
	#pool 2.rhel.pool.ntp.org iburst

	# 아래 내용 추가
	server time.bora.net iburst
	server send.mx.cdnetworks.com iburst
  ```
- 데몬 재시작
  ```bash
systemctl restart chrony
  ```
- 변경되었는지 확인
  ```bash
timedatectl
  ```
- HW 장비 시간 동기화 (메인보드 시간과 동기화)
  ```bash
hwclock -w
hwclock -v
  ```
- 변경된 시간 확인
  ```bash
date
  ```

### Profile 설정

사용자의 History에 날짜와 시간 표현

```bash
sed -i "/HISTSIZE=1000/a\HISTTIMEFORMAT='%F %T ---'" /etc/profile
```

### 네트워크 설정

인터넷 환경이 고정 IP일 때 설정한다. ONBOOT 설정 확인 필수! (재시작 시 자동 인터넷 연결)

- 현재 네트워크 설정 및 상태 확인
  ```bash
ifconfig

eth0      Link encap:Ethernet  HWaddr A0:8C:FD:DC:0F:90  
          inet addr:192.168.1.203  Bcast:192.168.1.255  Mask:255.255.255.0
          inet6 addr: fe80::a28c:fdff:fedc:f90/64 Scope:Link
          UP BROADCAST RUNNING MULTICAST  MTU:1500  Metric:1
          RX packets:1208300569 errors:0 dropped:0 overruns:0 frame:0
          TX packets:1220137358 errors:0 dropped:0 overruns:0 carrier:0
          collisions:0 txqueuelen:1000 
          RX bytes:109710700477 (102.1 GiB)  TX bytes:1781122806279 (1.6 TiB)
  ```
- `ifconfig`로 네트워크명 확인 후 (예 : eth0인 경우)
  ```bash
vim /etc/sysconfig/network-scripts/ifcfg-eth0
	ONBOOT= yes
	IPADDR= 설정할 IP
	PREFIX= 서브넷마스크 # 24 = 255.255.255.0
	GATEWAY= 라우터 IP
	DNS1= DNS 서버 IP
	DNS2= DNS 서버 IP
  ```
- 네트워크 재시작
  ```bash
# CentOS 6
service network restart

# CentOS 7
systemctl restart network
  ```

### ulimit 수정

OS 레벨의 제한 설정을 수정한다. 

- `limits.conf` 파일을 열어 전체 사용자의 nofile 옵션을 추가하고 저장한다.
  ```bash
vim /etc/security/limits.conf
root              soft    nofile          65535
root              hard    nofile          65535
	*               soft    nofile          65535
	*               hard    nofile          65535
  ```
- 재시작 후 적용된 내용 확인
  ```bash
# 재시작
reboot

# soft ulimit 확인
ulimit -a
		open files               (-n) 65535

# hard ulimit 확인
ulimit -aH
		open files               (-n) 65535
  ```

### Hostname 변경

실서버로 사용하거나 여러 대의 서버를 관리할 경우 Hostname은 필수로 지정한다.

- CentOS 6
  ```bash
vim /etc/sysconfig/network
	HOSTNAME=호스트명
reboot
  ```
- CentOS 7
  ```bash
hostnamectl set-hostname 호스트명 --static
cat /etc/hostname
reboot
  ```

### SELinux 설정

SELinux(Security Enhanced Linux)는 리눅스의 보안을 강화시켜주는 보안 커널이지만 강력한 보안 정책 때문에 실 서비스에 장애를 주는 현상이 많으므로 적절히 수정하거나 해제한다.

- SELinux 상태 확인
  ```bash
sestatus
	SELINUX=enable
  ```
- SELinux 해제
  ```bash
## 임시 중지 (재시작 후 다시 켜짐)
setenforce 0

## 영구 중지 (재시작 필요함)
vim /etc/selinux/config
	SELINUX=disabled
reboot

## 간단 명령어
sed -i 's/SELINUX=enforcing/SELINUX=disabled/g' /etc/selinux/config
reboot
  ```

### 계정 추가 및 삭제

서비스 사용에 필요한 계정 및 그룹을 설정한다.

**↗︎ **[**사용자 관련 명령어**](/4ecdbaeac3c5451089130c15a677fcf2#9bcc2e650fae4f9196771e33106cd88f)

**↗︎ **[**그룹 관련 명령어**](/4ecdbaeac3c5451089130c15a677fcf2#545b09fcfdbd457a91e916d0566e6d26)

- 현재 시스템에 생성되어 있는 계정 및 그룹 확인
  ```bash
cat /etc/passwd
cat /etc/group

# 특정 계정 확인
grep 계정명 /etc/passwd
  ```
- 그룹 추가
  ```bash
groupadd 그룹명
  ```
- 사용자 추가 (홈 디렉토리 default : `/home/사용자명`)
  ```bash
useradd 사용자명

# 그룹을 설정하는 경우
useradd -g 그룹명 사용자명

# 홈 디렉토리를 임의 설정하는 경우 : 폴더는 미리 생성해야 한다
useradd -m -d 설정할경로 사용자명

# 기존 사용자의 홈 디렉토리를 변경하는 경우
usermod -d 변경할경로 사용자명
  ```
- 사용자 비밀번호 설정 (비밀번호 생성 : 숫자, 문자, 특수문자 포함, 9자 이상)
  ```bash
passwd 사용자명
  ```
- 불필요한 계정 삭제
  ```bash
grep -e lp -e uucp -e nuucp /etc/passwd
userdel lp && userdel uucp && userdel nuucp
  ```

# 보안 설정

---

### 필수 보안 설정

### 방화벽 서비스 설정

↗︎ [Firewalld 설정](/adb57d7c03c6411eb83f9469486a272d#769a6db7f6ca4731a3360642d47be52e)

↗︎ [iptables 설정](/adb57d7c03c6411eb83f9469486a272d#a021fc5a54e44403b9c89e5517cda81c)

### SSH 포트 변경

```bash
vim /etc/ssh/sshd_config
	Port 22 # 주석해제 후 다른 포트번호 입력
service sshd restart
# 또는
systemctl restart sshd
```

### 가상 인터페이스(virbr) 삭제

```bash
systemctl stop libvirtd
systemctl disable libvirtd
brctl show
ip link set virbr0 down
brctl delbr virbr0 (ip link delete virbr0)
brctl show
```

# 기타 설정

---

### 스크립트

### 스케줄 (크론탭) 설정

```bash
# 크론탭 참조 경로 : /var/spool/cron
# crontab 사용하고자 하는 user로 로그인 후
crontab -e
	## 분 시 일 월 요일 경로 로깅
	0 2 * * * /Backup/bin/daily.sh 1>/dev/null 2>/dev/null
	50 23 * * * crontab -l > /home/bak/crontab_bak.txt

```

### 원격 데스크탑 설정

유지보수를 위한 원격 데스크탑 설정이 필요시 RDP 프로토콜을 사용하기 위해 xrdp와 tigervnc-server를 설치해야 함

```bash
# EPEL Repository 및 xrdp, tigervnc-server 설치
yum install epel-release
yum install xrdp tigervnc-server

# 자동 실행 등록
chkconfig xrdp on
chkconfig vncserver on
-
systemctl enable xrdp
systemctl enable vncserver

# 방화벽 포트 등록(3389) 및 재시작
iptables -A INPUT -p tcp –dport 3389 -j ACCEPT
service iptables restart
-
firewall-cmd --permanent --zone=public --add-port=3389/tcp
firewall-cmd --reload

# 서비스 시작
service xrdp start
-
systemctl start xrdp
```
