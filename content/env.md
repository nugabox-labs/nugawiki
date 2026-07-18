+++
title = ".env"
description = "브라우저에 저장되는 설정입니다"

[extra]
source = "manual"
title_cursor = true
topic_path = "env"
+++

<div class="env-settings">
  <div class="env-setting-row">
    <div class="env-setting-label">
      <span class="env-setting-title">코드블럭 줄바꿈</span>
      <span class="env-setting-desc">코드 블록의 긴 줄을 자동으로 접어서 보여줍니다.</span>
    </div>
    <button type="button" class="env-toggle" id="env-toggle-wrap" role="switch" aria-checked="true">
      <span class="env-toggle-track"><span class="env-toggle-thumb"></span></span>
    </button>
  </div>
  <div class="env-setting-row">
    <div class="env-setting-label">
      <span class="env-setting-title">코드블럭 줄번호</span>
      <span class="env-setting-desc">코드 블록 왼쪽에 줄 번호를 표시합니다.</span>
    </div>
    <button type="button" class="env-toggle" id="env-toggle-linenumbers" role="switch" aria-checked="false">
      <span class="env-toggle-track"><span class="env-toggle-thumb"></span></span>
    </button>
  </div>
</div>
