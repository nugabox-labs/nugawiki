+++
title = "SSL 발급 및 갱신 (acme.sh)"
date = "2021-06-28T05:49:00.000Z"
updated = "2025-05-31T11:58:00.000Z"
categories = ["OS", "SERVER"]
tags = ["SYNOLOGY", "WEB"]
toc = true

[extra]
source = "notion"
notion_id = "227de564-cdb8-404a-a744-d79b1aae40b8"
notion_url = "https://app.notion.com/p/SSL-acme-sh-227de564cdb8404aa744d79b1aae40b8"
+++

- **해외에서 인증하므로 인증서 관련 작업 중에는 방화벽을 비활성화한다. (작업 후 다시 활성화)**
- 1차 도메인(xxx.com), 2차 도메인(yyy.xxx.com), 와일드카드 도메인(\*.xxx.com) 모두 발급 가능하다.
  여기서는 와일드카드 도메인(\*.nugabox.com)으로 발급하는 절차를 설명한다.

> [!WARNING]
> Synology https 설정은 아래 페이지를 참고
↗︎ [시놀로지 도메인 - https 설정](/8ce126f35c0949e980ad867c31541a66#39f43b5eb25d4f79a4974a3812289af5)

### SSH 접속

- SSH 접속 (root로 바로 접속 안됨)

```bash
ssh ngjang@cloud.nugabox.com -p202
```

- 관리자 계정으로 전환

```bash
sudo su -
# 안 될 때는 sudo -i
```

- 이후 설치 및 발급 과정은 동일하다.

 

# acme.sh 설치

```bash
curl https://get.acme.sh | sh
# acme.sh가 ~/.acme.sh/ 디렉토리에 설치된 후 다시 로드됨
source ~/.bashrc

cd /root
# 스크립트 파일에 소유자 root, 실행 권한 부여
chown root.root acme.sh
chmod +x acme.sh
```

# 인증서 발급 및 갱신

---

- `acme.sh` 파일을 아래와 같이 실행한다. (적용할 도메인 입력)

```bash
cd /root
./acme.sh --issue --force -d *.nugabox.com --dns --yes-I-know-dns-manual-mode-enough-go-ahead-please
```

- 스크립트 실행 결과 중 TXT value의 내용을 복사한다.

```bash
Add the following TXT record:
Domain: '_acme-challenge.nugabox.com'
TXT value: 'znvosKIiY1dNhAXOSjjPleF41Tu3HVc4B2Mx12GL5-0'
```

- 소유한 도메인이 설정된 네임서버에 TXT 레코드를 등록하고 내용을 넣어준다. (예 : Synology DNS 서버)

![image](/notion-assets/227de564-cdb8-404a-a744-d79b1aae40b8/5.png)

- TXT 레코드가 잘 등록되었는지 터미널에서 테스트한다.

```bash
nslookup
> set type=txt
> _acme-challenge.nugabox.com

Server:		164.124.101.2
Address:	164.124.101.2#53

Non-authoritative answer:
_acme-challenge.nugabox.com	text = "iR2P4oq-ehyKXihp5cETEHM4SZ4fSLneXGlNzEQi0VQ"
```

- acme.sh 파일을 다시 실행한다. (**issue → renew**)

```bash
./acme.sh --renew --force -d *.nugabox.com --dns --yes-I-know-dns-manual-mode-enough-go-ahead-please
```

- 정상적으로 발급되었다는 내용이 출력된 후 생성된 인증서 파일을 다운로드 받을 수 있는 위치로 복사한다.

```bash
cp "/root/.acme.sh/*.nugabox.com/*.nugabox.com.key" /volume1/web/
cp "/root/.acme.sh/*.nugabox.com/*.nugabox.com.cer" /volume1/web/
cp "/root/.acme.sh/*.nugabox.com/ca.cer" /volume1/web/
```

- 복사한 파일들을 다운로드 후 서버 내 인증서 파일은 삭제한다.

# 인증서 적용

---

### Apache

- 환경설정 폴더 아래에 SSL 관련 설정이 있는 `ssl.conf` 파일을 연다.
- 해당 파일들의 경로를 업데이트 또는 파일 자체를 갱신하고 웹 서버를 다시 시작한다.
  ```bash
## SSL 인증서 지정
  SSLEngine on
  SSLCertificateFile /etc/httpd/conf/ssl/nugabox.com.cer
  SSLCertificateKeyFile /etc/httpd/conf/ssl/nugabox.com.key
  SSLCertificateChainFile /etc/httpd/conf/ssl/ca.cer
  ```

### Synology DSM

- **`DSM - 제어판 - 보안 – 인증서 - 추가 - 기존 인증서 교체 - 인증서 가져오기`**
  - 개인키 : nugabox.com.key
  - 인증서 : nugabox.com.cer
  - 중간 인증서 : ca.cer
- 정상적으로 적용 시 '웹 서버 다시 시작' (자동)
- 적용 후 방화벽 정책을 원복한다.

### nugabox.com / newpeoplech.com 갱신 스크립트
