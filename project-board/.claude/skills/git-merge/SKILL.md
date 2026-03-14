---
name: git-merge
description: '브랜치를 안전하게 병합하고 충돌을 해결합니다'
argument-hint: "<병합할 브랜치명>"
allowed-tools:
  [
    'Bash(git merge:*)',
    'Bash(git status:*)',
    'Bash(git diff:*)',
    'Bash(git log:*)',
    'Bash(git branch:*)',
    'Bash(git fetch:*)',
    'Bash(git pull:*)',
    'Bash(git reset:*)',
    'Bash(git checkout:*)',
    'Bash(git stash:*)',
  ]
---

# Claude 명령어: Merge

브랜치를 안전하게 병합하고 충돌을 해결합니다.

## 사용법

```
/git-merge <병합할 브랜치명>    # 지정 브랜치를 현재 브랜치에 병합
/git-merge                    # 대화형 메뉴
```

## 프로세스

1. `git status`로 현재 상태 확인 — uncommitted 변경사항 있으면 중단 (stash 권장)
2. 대상 브랜치 존재 여부 확인
3. `git merge --no-ff <브랜치명>` 실행 (브랜치 히스토리 보존)
4. 충돌 발생 시: 충돌 파일 목록 출력 → 파일별 해결 방법 안내
5. 충돌 해결 후 `git merge --continue`
6. 병합 완료 확인 및 결과 요약 출력

## 병합 전략

| 전략 | 명령어 | 사용 상황 |
|------|--------|----------|
| No-fast-forward (기본) | `--no-ff` | feature → develop (브랜치 히스토리 보존) |
| Fast-forward | 기본값 | 선형 히스토리 유지할 때 |
| Squash | `--squash` | 여러 커밋을 하나로 압축할 때 |

## 충돌 해결

충돌 발생 시 선택지를 제시합니다:
- `ours` — 현재 브랜치 내용 유지
- `theirs` — 병합 브랜치 내용 채택
- `manual` — 직접 편집 후 `git add <파일>`

병합 취소: `git merge --abort`

## 안전 규칙

- uncommitted 변경사항 있으면 병합 시작 안 함
- `master`에 직접 병합 금지 — PR로만 처리
- ★QA Step 포함 Phase는 QC 체크리스트 통과 후 병합

## 참고사항

- `$ARGUMENTS`가 비어 있으면 브랜치 목록 보여주고 선택 요청
- 병합 완료 후 feature 브랜치 삭제 여부 확인
