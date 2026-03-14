---
name: git-branch
description: '브랜치 생성, 전환, 삭제 등 브랜치 관리 작업을 수행합니다'
argument-hint: "[브랜치명]"
allowed-tools:
  [
    'Bash(git branch:*)',
    'Bash(git checkout:*)',
    'Bash(git switch:*)',
    'Bash(git status:*)',
    'Bash(git stash:*)',
    'Bash(git log:*)',
    'Bash(git fetch:*)',
  ]
---

# Claude 명령어: Branch

브랜치 생성, 전환, 삭제 등 Git 브랜치 관리를 수행합니다.

## 사용법

```
/git-branch [브랜치명]    # 새 브랜치 생성 및 전환
/git-branch              # 대화형 메뉴
```

## 프로세스

1. `git status`로 현재 상태 확인
2. uncommitted 변경사항 있으면 stash 처리 (메시지에 현재 브랜치명 포함)
3. 브랜치명 없으면 작업 선택 요청 (생성 / 전환 / 삭제 / 목록)
4. 브랜치명 있으면 `git checkout -b <브랜치명>` 으로 생성 및 전환
5. 완료 후 현재 브랜치 상태 출력

## 브랜치 네이밍 규칙

```
feature/   - 기능 개발
fix/       - 버그 수정
hotfix/    - 긴급 수정
docs/      - 문서 작업
chore/     - 설정/유지보수
refactor/  - 리팩토링
```

**패턴:** `<prefix>/<kebab-case-설명>`
- ✅ `feature/칸반보드-ui`, `fix/로그인-버그`
- ❌ 공백, 대문자, 슬래시 없는 이름

## 안전 규칙

- 브랜치 전환 전 항상 uncommitted 변경사항 stash
- `master` 직접 push 금지 — PR로만 머지
- 병합된 브랜치 삭제 시 병합 여부 먼저 확인

## 참고사항

- `$ARGUMENTS`가 비어 있으면 대화형 메뉴 실행
- stash 후 생성하면 완료 후 `git stash pop` 안내
