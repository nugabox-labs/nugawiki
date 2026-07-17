+++
title = "xcp-ng ISO 저장소 생성 및 갱신 방법"
date = "2021-05-06T05:01:00.000Z"
updated = "2024-04-24T07:01:00.000Z"
categories = ["OS"]
tags = ["LINUX"]

[extra]
source = "notion"
notion_id = "579faa07-d49b-4c25-b453-d6c899789e7b"
notion_url = "https://app.notion.com/p/xcp-ng-ISO-579faa07d49b4c25b453d6c899789e7b"
external_url = "https://alwaysu012.tistory.com/m/49"
+++

- ISO 이미지 사용 
  ```bash
xe sr-create name-label=<name> type=iso \
device-config:location=<where iso file exist> \
device-config:legacy_mode=true \ 
content-type=iso

# Example
/var/opt/xen/iso_import/xe sr-create name-label=windows_iso type=iso \
  device-config:location=/var/opt/xen/iso_import/ \
  device-config:legacy_mode=true content-type=iso

# Example
mkdir /ISO_Storage
xe sr-create name-label=ISO_Storage type=iso \
  device-config:location=/ISO_Storage \
  device-config:legacy_mode=true content-type=iso

4af44a1b-c5ff-363b-2acc-7b2074b067fe
  ```

  ```bash
xe sr-list name-label=windows_iso
  uuid ( RO)   : 7bdf8f9c-ba67-eeba-ff59-ec590f8f3692
  name-label ( RW): iso-file
  name-description ( RW):
  host ( RO): xen12
  type ( RO): iso
  content-type ( RO): iso
  ```
- sftp 와 같은 툴을 이용해서 ISO 파일을 /var/opt/xen/iso\_import 디렉토리에 업로드한 뒤  스캔해서 업로드된 ISO 파일을 인식시킨다. 
  ```bash
xe sr-scan uuid=7bdf8f9c-ba67-eeba-ff59-ec590f8f3692
  ```
