+++
title = "맥 zsh + Oh My Zsh + iTerm2 세팅"
date = "2021-01-22T01:57:00.000Z"
updated = "2022-06-25T18:56:00.000Z"
categories = ["OS"]
tags = ["MACOS"]
toc = true

[extra]
source = "notion"
notion_id = "f13af713-e413-484a-8605-d3f11f769605"
notion_url = "https://app.notion.com/p/zsh-Oh-My-Zsh-iTerm2-f13af713e413484a8605d3f11f769605"
+++

⎋ 참고 링크

[https://medium.com/harrythegreat/oh-my-zsh-iterm2%EB%A1%9C-%ED%84%B0%EB%AF%B8%EB%84%90%EC%9D%84-%EB%8D%94-%EA%B0%95%EB%A0%A5%ED%95%98%EA%B2%8C-a105f2c01bec](https://medium.com/harrythegreat/oh-my-zsh-iterm2%EB%A1%9C-%ED%84%B0%EB%AF%B8%EB%84%90%EC%9D%84-%EB%8D%94-%EA%B0%95%EB%A0%A5%ED%95%98%EA%B2%8C-a105f2c01bec)

### Homebrew로 설치

```bash
# zsh 설치
brew install zsh

# 설치경로 확인
which zsh
#=> /usr/bin/zsh

# 기본 sh 변경
chsh -s $(which zsh)

# git wget curl 설치 확인
brew install curl

# oh-my-zsh 설치
sh -c "$(curl -fsSL https://raw.githubusercontent.com/robbyrussell/oh-my-zsh/master/tools/install.sh)"

# iterm2 설치
brew install --cask iterm2

# zshrc 설정
vim ~/.zshrc
	# 테마 변경 (agnoster테마는 현재 디렉토리에서 Git의 상태를 알려줌)
	ZSH_THEME=”agnoster” 
	# 맨 하단에 추가 (맥 hostname 가리기)
	prompt_context() {
	  if [[ "$USER" != "$DEFAULT_USER" || -n "$SSH_CLIENT" ]]; then
	    prompt_segment black default "%(!.%{%F{yellow}%}.)$USER"
	  fi
	}
source ~/.zshrc
```

### D2코딩 폰트 설치

### iterm2 테마 설치

`Cmd + ,` (설정) → Profile → Text에서 D2코딩 폰트 적용
→ Colors → Color Presets → Import로 스키마 추가 후 적용
