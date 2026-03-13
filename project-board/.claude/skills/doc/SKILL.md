---
name: doc
description: '지정한 파일의 함수/컴포넌트에 JSDoc/TSDoc 주석을 자동 생성합니다'
argument-hint: <파일 경로>
allowed-tools:
  [
    'Read',
    'Edit',
    'Glob',
    'Grep',
  ]
---

# Claude 명령어: Doc

파일 경로를 입력받아 해당 파일의 함수, 컴포넌트, 클래스, 타입에 JSDoc/TSDoc 주석을 자동으로 생성합니다.

## 사용법

```
/doc src/components/Button.tsx
/doc src/utils/formatDate.ts
/doc src/app/api/users/route.ts
```

## 프로세스

### 1. 파일 확인

`$ARGUMENTS`로 전달된 파일 경로를 읽습니다.
- 파일이 없으면 유사한 파일 목록을 제안
- `.ts`, `.tsx`, `.js`, `.jsx` 파일만 처리

### 2. 주석 생성 대상

다음 항목에 JSDoc/TSDoc 주석을 생성합니다:

- **함수** (일반 함수, 화살표 함수)
- **React 컴포넌트** (함수형 컴포넌트)
- **커스텀 훅** (`use`로 시작하는 함수)
- **클래스 및 메서드**
- **타입/인터페이스** (복잡한 경우)
- **상수** (export된 중요 상수)

### 3. 주석 포맷

#### 함수/컴포넌트 기본 포맷
```typescript
/**
 * [함수의 역할을 한 줄로 설명]
 *
 * @param paramName - 파라미터 설명
 * @returns 반환값 설명
 * @example
 * ```ts
 * functionName(arg1, arg2)
 * ```
 */
```

#### React 컴포넌트 포맷
```typescript
/**
 * [컴포넌트 역할 설명]
 *
 * @param props.propName - prop 설명
 * @example
 * ```tsx
 * <ComponentName propName="value" />
 * ```
 */
```

#### 커스텀 훅 포맷
```typescript
/**
 * [훅의 역할 설명]
 *
 * @param paramName - 파라미터 설명
 * @returns [반환 객체/값 설명]
 * @example
 * ```ts
 * const { data, isLoading } = useHookName()
 * ```
 */
```

### 4. 규칙

- **이미 주석이 있는 항목은 건드리지 않음** (덮어쓰기 금지)
- 주석은 **한국어**로 작성 (프로젝트 언어 기준)
- 타입 정보는 TypeScript 타입에서 자동 추론 → `@param {type}`은 생략
- 자명한 함수(`getX`, `setX` 등)는 최소한의 주석만 추가
- 한 줄 함수는 `/** 설명 */` 형식 사용

## 참고사항

- `$ARGUMENTS`가 비어 있으면 현재 디렉토리의 파일 목록을 보여주고 선택 요청
- 변경사항 적용 전 미리보기 제공
- 여러 파일 동시 처리 가능: `/doc src/utils/`
