+++
title = "URL Redirect 리다이렉트"
date = "2021-04-14T07:28:00.000Z"
updated = "2022-06-25T18:56:00.000Z"
categories = ["FRONT-END"]
tags = ["HTML", "JS"]

[extra]
source = "notion"
notion_id = "0591c339-b0ec-4737-88a1-2343b3fd8345"
notion_url = "https://app.notion.com/p/URL-Redirect-0591c339b0ec473788a12343b3fd8345"
external_url = "https://blog.miyam.net/112"
+++

### HTML Meta 태그

```html
<html>
    <meta http-equiv="refresh" content="0; url=https://blog.miyam.net"></meta>
</html>
```

### JavaScript

```javascript
window.location.href = 'http://www.abc.com/';
```

- 주소 비교 후 이동

```javascript
if ( window.location == 'http://www.abc.com/' ) {
  window.location.href='http://www.codingfactory.net/';
}
```
