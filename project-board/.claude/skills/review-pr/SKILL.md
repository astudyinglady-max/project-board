---
name: review-pr
description: '현재 브랜치의 PR 변경사항을 코드 리뷰합니다'
allowed-tools:
  [
    'Bash(git diff:*)',
    'Bash(git log:*)',
    'Bash(git status:*)',
    'Bash(git branch:*)',
    'Bash(gh pr:*)',
    'Read',
    'Grep',
    'Glob',
  ]
---

# Claude 명령어: Review PR

현재 브랜치의 변경사항을 분석하고 코드 리뷰를 제공합니다.

## 사용법

```
/review-pr
```

## 프로세스

### 1. 변경사항 수집

```bash
git diff main...HEAD
git log main...HEAD --oneline
git status
```

### 2. 리뷰 항목 (4가지)

#### 🐛 버그 & 안전성
- null/undefined 처리 누락
- 배열 경계 초과 접근
- 비동기 에러 처리 누락 (try-catch, .catch())
- 경쟁 상태(race condition) 가능성
- 타입 불일치 및 암묵적 형 변환

#### 🔒 보안
- 하드코딩된 시크릿, API 키, 비밀번호
- XSS 취약점 (dangerouslySetInnerHTML, innerHTML 등)
- SQL 인젝션 가능성
- 민감한 데이터 로깅
- 입력값 검증 누락

#### ⚡ 성능
- 불필요한 리렌더링 (React useEffect 의존성 배열)
- N+1 쿼리 패턴
- 메모이제이션 미적용 (useMemo, useCallback)
- 대용량 데이터 처리 시 페이지네이션 누락
- 번들 사이즈에 영향 주는 임포트

#### 🎨 코드 품질
- 함수/변수 네이밍 명확성
- 단일 책임 원칙 위반
- 중복 코드 (DRY 원칙)
- 복잡한 로직에 주석 누락
- 타입 정의 완성도 (TypeScript)

### 3. 출력 형식

```
## 코드 리뷰 결과

### 변경 요약
- 파일 N개 변경 (+추가, -삭제)
- 주요 변경: [요약]

### 🔴 심각 (즉시 수정 필요)
- [파일명:줄번호] 문제 설명

### 🟡 경고 (수정 권장)
- [파일명:줄번호] 문제 설명

### 🟢 제안 (선택적 개선)
- [파일명:줄번호] 개선 아이디어

### ✅ 잘된 점
- [긍정적인 패턴이나 구현]
```

## 참고사항

- 변경사항이 없으면 "리뷰할 변경사항이 없습니다" 안내
- `main` 브랜치 기준으로 diff 실행 (없으면 `master` 시도)
- 파일이 너무 많으면 핵심 변경사항에 집중
