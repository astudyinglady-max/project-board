---
name: add-component
description: '프로젝트 컨벤션에 맞는 React 컴포넌트를 자동으로 생성합니다'
argument-hint: <컴포넌트명> [레이어] [--client]
allowed-tools:
  [
    'Read',
    'Write',
    'Glob',
    'Grep',
  ]
---

# Claude 명령어: Add Component

Atomic Design 구조와 프로젝트 컨벤션에 맞는 React 컴포넌트를 자동 생성합니다.

## 사용법

```
/add-component <컴포넌트명> [레이어] [--client]
```

**예시:**
```
/add-component Badge
/add-component DropdownMenu molecule
/add-component UserProfile organism --client
/add-component DashboardLayout template
/add-component search-bar molecule
```

- `컴포넌트명`: 필수. PascalCase 또는 kebab-case 모두 허용
- `레이어`: 선택. `ui` | `molecule` | `organism` | `template`
- `--client`: 강제로 `"use client"` 추가. 생략 시 레이어 기준 자동 판단

## 프로세스

### 1단계: 입력 파싱

`$ARGUMENTS`를 파싱하여 다음을 결정합니다:

**이름 변환:**
- PascalCase → 컴포넌트 함수명 (예: `SearchBar`)
- kebab-case → 파일명 (예: `search-bar.tsx`)
- 입력이 kebab-case이면 PascalCase로, PascalCase이면 kebab-case로 변환

**레이어 결정 (명시적 레이어가 없을 때):**

| 키워드 | 레이어 |
|--------|--------|
| `Layout`, `Page`, `Screen`, `View` | `template/` |
| `Header`, `Footer`, `Sidebar`, `Form`, `Table`, `Dialog`, `Drawer`, `Accordion`, `Tabs` | `organism/` |
| `Card`, `Select`, `Tooltip`, `Toast`, `Breadcrumb`, `Pagination`, `SearchBar`, `FormField` | `molecule/` |
| 그 외 단순 UI 요소 | `ui/` |

명시적 레이어가 전달되면 해당 레이어를 우선 사용합니다.

**`"use client"` 판단:**
- `--client` 플래그가 있으면 강제 추가
- `organism/`은 기본적으로 추가 (상태/이벤트 사용 패턴)
- `ui/`는 기본 추가 안 함 (Server Component)
- `molecule/`, `template/`은 기본 추가 안 함

### 2단계: 중복 확인

Glob 툴로 `components/<layer>/<kebab-name>.tsx` 경로를 확인합니다:
- **이미 존재하면**: 경고를 출력하고 중단합니다
- **비슷한 이름이 있으면**: 알림 후 계속 진행합니다

### 3단계: 컴포넌트 생성

레이어에 따라 아래 템플릿을 사용합니다.

---

#### `ui/` (Atom) 템플릿

단순 UI 원자 컴포넌트. CVA variants + data-slot + cn() 사용.

```tsx
// "use client" ← --client 플래그 있을 때만

import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const <Name>Variants = cva(
  // 기본 클래스 (Tailwind)
  "",
  {
    variants: {
      variant: {
        default: "",
        // 필요한 variant 추가
      },
      size: {
        default: "",
        sm: "",
        lg: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

interface <Name>Props
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof <Name>Variants> {}

function <Name>({ className, variant, size, ...props }: <Name>Props) {
  return (
    <div
      data-slot="<kebab-name>"
      className={cn(<Name>Variants({ variant, size, className }))}
      {...props}
    />
  )
}

export { <Name>, <Name>Variants }
export type { <Name>Props }
```

**참고:** variants가 불필요한 경우(단순 레이아웃용) CVA를 제거하고 아래처럼 단순화:

```tsx
import { cn } from "@/lib/utils"

function <Name>({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="<kebab-name>"
      className={cn("", className)}
      {...props}
    />
  )
}

export { <Name> }
```

---

#### `molecule/` 템플릿

복합 컴포넌트 (compound component) 패턴. 하위 컴포넌트를 함께 export.

```tsx
import { cn } from "@/lib/utils"

// 루트 컴포넌트
function <Name>({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="<kebab-name>"
      className={cn(
        "rounded-none border border-border bg-card text-card-foreground",
        className
      )}
      {...props}
    />
  )
}

// 헤더 서브컴포넌트
function <Name>Header({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="<kebab-name>-header"
      className={cn("flex flex-col gap-1 p-4 pb-0", className)}
      {...props}
    />
  )
}

// 컨텐츠 서브컴포넌트
function <Name>Content({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="<kebab-name>-content"
      className={cn("p-4", className)}
      {...props}
    />
  )
}

// 푸터 서브컴포넌트
function <Name>Footer({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="<kebab-name>-footer"
      className={cn("flex items-center p-4 pt-0", className)}
      {...props}
    />
  )
}

export { <Name>, <Name>Header, <Name>Content, <Name>Footer }
```

---

#### `organism/` 템플릿

비즈니스 로직을 포함하는 복잡한 컴포넌트. 기본적으로 `"use client"`.

```tsx
"use client"

import { cn } from "@/lib/utils"

// <Name> 컴포넌트 props 정의
interface <Name>Props {
  className?: string
  children?: React.ReactNode
  // 필요한 props 추가
}

// <Name>: [컴포넌트 역할 설명]
function <Name>({ className, children }: <Name>Props) {
  return (
    <section
      data-slot="<kebab-name>"
      className={cn(
        "flex flex-col gap-4",
        className
      )}
    >
      {children}
    </section>
  )
}

export { <Name> }
export type { <Name>Props }
```

---

#### `template/` 템플릿

페이지 레이아웃 컴포넌트. 기본적으로 Server Component (async).

```tsx
import { cn } from "@/lib/utils"

// <Name> 레이아웃 props 정의
interface <Name>Props {
  children: React.ReactNode
  className?: string
}

// <Name>: [레이아웃 역할 설명]
async function <Name>({ children, className }: <Name>Props) {
  return (
    <div
      data-slot="<kebab-name>"
      className={cn("flex min-h-svh flex-col", className)}
    >
      {children}
    </div>
  )
}

export { <Name> }
```

---

### 4단계: 파일 생성

Write 툴로 `components/<layer>/<kebab-name>.tsx` 파일을 생성합니다.

실제 기존 컴포넌트 패턴에 맞게 템플릿을 조정합니다:
- `badge.tsx`의 CVA 패턴 참고 (ui 레이어)
- `card.tsx`의 compound component 패턴 참고 (molecule 레이어)
- `sidebar.tsx`의 organism 패턴 참고

### 5단계: 결과 출력

```
✅ 컴포넌트 생성 완료

파일: components/<layer>/<kebab-name>.tsx
레이어: <layer> (<atomic-level>)
클라이언트: Yes / No (Server Component)

다음 단계:
- components/<layer>/<kebab-name>.tsx 에서 스타일 커스터마이징
- import { <Name> } from "@/components/<layer>/<kebab-name>"
```

## 프로젝트 컨벤션 요약

| 항목 | 규칙 |
|------|------|
| 디렉토리 | `components/ui/` `components/molecule/` `components/organism/` `components/template/` |
| 파일명 | kebab-case (예: `search-bar.tsx`) |
| 컴포넌트명 | PascalCase |
| 스타일 | Tailwind CSS 4 + CVA (variants 있을 때) + `cn()` from `@/lib/utils` |
| Headless | `@base-ui/react` primitives (필요 시) |
| 아이콘 | `@phosphor-icons/react` |
| 식별자 | `data-slot="component-name"` (모든 컴포넌트 필수) |
| 클라이언트 | 상태/이벤트 있으면 `"use client"`, 없으면 Server Component |
| 주석 | 한국어 |

## 참고 파일

- `components/ui/badge.tsx` — CVA + data-slot 패턴 (ui 레이어 기준)
- `components/ui/button.tsx` — base-ui + CVA 패턴
- `components/molecule/card.tsx` — compound component 패턴
- `components/organism/sidebar.tsx` — organism + "use client" 패턴
- `components/template/dashboard-layout.tsx` — template + async 패턴
- `lib/utils.ts` — `cn()` 유틸
