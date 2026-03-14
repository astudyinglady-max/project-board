---
name: git-pr
description: 'GitHub Pull Request를 생성하고 관리합니다'
argument-hint: "[PR 제목]"
allowed-tools:
  [
    'Bash(gh pr:*)',
    'Bash(gh api:*)',
    'Bash(gh repo:*)',
    'Bash(git push:*)',
    'Bash(git status:*)',
    'Bash(git log:*)',
    'Bash(git diff:*)',
    'Bash(git branch:*)',
    'Bash(git fetch:*)',
  ]
---

# Claude 명령어: Pull Request

GitHub Pull Request를 생성하고 관리합니다.

## 사용법

```
/git-pr              # 대화형 PR 생성
/git-pr "PR 제목"    # 제목 지정하여 생성
/git-pr --draft      # Draft PR 생성
```

## 프로세스

1. `git status` / `git log master...HEAD` 로 현재 브랜치 변경사항 확인
2. uncommitted 변경사항 있으면 경고 (커밋 먼저 권장)
3. 원격 브랜치 push 여부 확인 — 미푸시 시 `git push -u origin <브랜치명>` 실행
4. 커밋 히스토리 기반으로 PR 제목/설명 자동 생성
5. `gh pr create` 로 PR 생성 후 URL 출력

## PR 제목 규칙

브랜치명 기반으로 자동 생성:
```
feature/칸반보드-ui  → ✨ feat: 칸반보드 UI 구현
fix/로그인-버그      → 🐛 fix: 로그인 버그 수정
docs/README         → 📝 docs: README 업데이트
```

## PR 본문 템플릿

```markdown
## 변경사항 요약
- [커밋 히스토리 기반 자동 생성]

## 체크리스트
- [ ] 코드 스타일 가이드 준수 (kebab-case, const/let, addEventListener)
- [ ] 인라인 스타일 없음 (CSS 클래스 사용)
- [ ] 외부 라이브러리 추가 없음 (제로 의존성 원칙)
- [ ] 로컬에서 동작 확인

## 테스트 방법
python -m http.server 8080 → http://localhost:8080 에서 확인
```

## 머지 대상

```
feature/* → develop (기능 개발 완료 시)
develop   → master  (스프린트 완료 시, QC 통과 후)
```

## 참고사항

- `master`에 직접 push 금지 — PR로만 머지
- ★QA Step 포함 Phase는 QC 체크리스트 완료 후 PR 생성
- `gh auth login` 미완료 시 GitHub CLI 인증 먼저 안내
