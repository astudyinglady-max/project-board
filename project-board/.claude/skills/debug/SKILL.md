---
name: debug
description: '에러 메시지를 분석하고 원인을 찾아 수정 방법을 제안합니다'
argument-hint: <에러 메시지 또는 증상>
allowed-tools:
  [
    'Bash(git diff:*)',
    'Bash(git log:*)',
    'Read',
    'Grep',
    'Glob',
  ]
---

# Claude 명령어: Debug

에러 메시지나 증상을 입력받아 원인을 분석하고 수정 방법을 제안합니다.

## 사용법

```
/debug TypeError: Cannot read properties of undefined
/debug 로그인 후 리다이렉트가 동작하지 않음
/debug npm run build 실패
/debug hydration error
```

## 프로세스

### 1단계: 에러 분류

`$ARGUMENTS`로 입력된 에러를 다음으로 분류합니다:

| 에러 유형 | 예시 |
|----------|------|
| **런타임 에러** | TypeError, ReferenceError, Cannot read properties |
| **빌드 에러** | Module not found, Type error, SyntaxError |
| **Next.js 특이 에러** | Hydration, CORS, 404/500 |
| **React 에러** | Hook rules, Key props, Invalid element |
| **동작 이상** | 클릭 무반응, 값 반영 안됨, 무한 루프 |

### 2단계: 관련 코드 탐색

에러 메시지 키워드로 코드베이스 검색:

```
- 에러 발생 파일명/컴포넌트명
- 관련 훅, 유틸, API 라우트
- 최근 변경사항 (git diff)
```

### 3단계: 원인 분석

발견한 코드와 에러를 연결하여 근본 원인 파악:

- **직접 원인**: 에러를 발생시킨 코드 위치
- **근본 원인**: 그 코드가 잘못된 이유
- **영향 범위**: 해당 문제가 영향을 주는 다른 코드

### 4단계: 수정 제안

#### 출력 형식
```
## 디버그 결과

### 에러 분석
**에러 유형**: [분류]
**발생 위치**: [파일명:줄번호]
**원인**: [근본 원인 설명]

### 문제 코드
\`\`\`typescript
// 문제가 있는 코드
\`\`\`

### 수정 방법
\`\`\`typescript
// 수정된 코드
\`\`\`

### 설명
[왜 이렇게 수정하는지 설명]

### 재발 방지
[같은 실수를 피하는 방법]
```

## 일반적인 에러 패턴 (빠른 참조)

### Next.js / React
- **Hydration error** → 서버/클라이언트 렌더링 불일치 → `useEffect` 또는 `dynamic`으로 클라이언트 전용 처리
- **Cannot read properties of undefined** → 비동기 데이터 접근 전 로딩 체크 누락
- **Too many re-renders** → `useEffect` 의존성 배열 또는 상태 업데이트 루프 확인
- **Module not found** → import 경로 오타 또는 패키지 미설치

### TypeScript
- **Type 'X' is not assignable to type 'Y'** → 타입 정의 불일치, 타입 가드 필요
- **Object is possibly null/undefined** → 옵셔널 체이닝(`?.`) 또는 null 체크 추가

### 빌드
- **ENOENT / Module not found** → 파일 경로 확인, `tsconfig.json` paths 설정 확인
- **Unexpected token** → 문법 오류, Babel/SWC 설정 확인

## 참고사항

- `$ARGUMENTS`가 비어 있으면 최근 에러 로그 또는 현재 git diff를 기반으로 추론
- 에러 스택 트레이스를 붙여넣으면 더 정확한 분석 가능
- 해결 방법이 여러 가지일 경우 우선순위를 매겨서 제안
