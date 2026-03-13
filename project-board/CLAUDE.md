# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## 주요 명령어

### CLI (워크플로우 상태 관리)

```bash
node kit/cli.mjs status          # 전체 진행 상태 확인
node kit/cli.mjs next            # 다음 할 일 + 프롬프트 힌트 출력
node kit/cli.mjs list            # 전체 Step 목록
node kit/cli.mjs complete p1s1   # Step 완료 처리 (예: Phase 1 Step 1)
node kit/cli.mjs uncomplete p1s1 # 완료 취소
node kit/cli.mjs template p1s1   # .workflow/templates/ 에서 문서 초안 생성
node kit/cli.mjs sync            # state.js, status.md 재생성 (설정 변경 후 필수)
node kit/cli.mjs qc 1            # Phase 1 QC 체크리스트 출력
node kit/cli.mjs log 1           # sprint-log 기록 프롬프트 출력
node kit/cli.mjs git-start 1     # feature 브랜치 생성
node kit/cli.mjs git-finish 1    # commit + push
node kit/cli.mjs reset           # 전체 초기화
```

### 로컬 서버 (state.js CLI 연동 사용 시 권장)

```bash
python -m http.server 8080   # http://localhost:8080 접속
```

> `file://` 프로토콜에서는 일부 브라우저가 `<script src>` 로드를 제한하여 `state.js` 연동이 불안정할 수 있습니다. 빌드/테스트 명령은 없습니다 — 이 프로젝트는 빌드 단계가 없는 정적 파일 기반입니다.

---

## 1. 프로젝트 개요 및 목적

**claude-commin-kit**은 AI(Claude)와 함께 스프린트 단위로 개발하는 솔로 개발자를 위한 **브라우저 전용 워크플로우 관리 툴킷**이자, 해당 툴킷을 소개하는 **브랜딩 랜딩 페이지**입니다.

### 해결하는 문제
AI와 대화형으로 개발할 때 새 세션을 시작하면 이전 컨텍스트가 사라집니다. 개발자는 매번 "지금 어디까지 했는지", "다음엔 어떤 프롬프트를 써야 하는지"를 직접 기억하고 타이핑해야 합니다. 이 툴킷은 그 인지 부하를 없앱니다.

### 구성 파일 역할
| 파일 | 역할 |
|------|------|
| `project-board.html` | 브랜딩 랜딩 페이지 (정적, 소개 + CTA) |
| `docs/index.html` | 인터랙티브 프로젝트 보드 (칸반, 멀티 프로젝트) |
| `docs/workflow.html` | 6단계 워크플로우 가이드 (프롬프트 복사, QC 체크) |
| `kit/cli.mjs` | Node.js CLI — 워크플로우 상태 관리 12개 명령어 |
| `.kit/` | git submodule — claude-commin-kit 업스트림 |
| `.workflow/config.json` | 워크플로우 정의 (Phase/Step/프롬프트/QC) |
| `.workflow/state.json` | 진행 상태 (Single Source of Truth) |
| `.workflow/state.js` | HTML 대시보드용 상태 브릿지 (자동 생성) |
| `.workflow/status.md` | 사람이 읽는 진행 상태 (자동 생성) |

---

## 2. 사용 기술 스택

이 프로젝트는 **제로 의존성**이 핵심 원칙입니다. 외부 라이브러리, 번들러, 빌드 도구를 사용하지 않습니다.

| 영역 | 기술 | 비고 |
|------|------|------|
| UI | Pure HTML5 / CSS3 / Vanilla JS | 프레임워크 없음 |
| 스타일 | CSS Custom Properties | `--var` 기반 테마 관리 |
| 상태 저장 | `localStorage` | 서버 없이 브라우저 내 영속성 |
| CLI | Node.js ESM (`node:fs`, `node:path`, `node:child_process`) | 외부 패키지 없음 |
| 배포 | GitHub Pages | 정적 파일 서빙 |
| 버전관리 | Git + git submodule | `.kit/` 로 업스트림 관리 |

> **패키지 설치 금지.** `npm install`, `yarn add` 등으로 외부 의존성을 추가하지 않습니다.

---

## 3. 폴더 구조 설명

전체 구조 및 각 폴더 역할 상세 설명 → [`docs/폴더구조.md`](docs/폴더구조.md)

```
project-board/
│
├── project-board.html       # 브랜딩 랜딩 페이지 (루트 진입점)
├── README.md                # 프로젝트 소개 및 실행 가이드
├── CLAUDE.md                # 이 파일 — Claude Code 작업 지침
│
├── docs/                    # GitHub Pages 서빙 폴더 + 기획 문서
│   ├── index.html           # 프로젝트 보드 (칸반 UI)
│   ├── workflow.html        # 워크플로우 가이드 UI
│   ├── 요구사항.md           # Must Have / Should Have / Nice to Have
│   ├── 유저스토리.md          # 유저스토리 16개 + 수용 기준 + Sprint 배정
│   ├── 차별화.md             # 문제 정의, 기존 솔루션 한계, 경쟁 우위 매트릭스
│   ├── 기술스택.md           # 기술 선택 이유 및 대안 비교
│   ├── 폴더구조.md           # 디렉토리 구조 및 폴더 역할
│   └── 브랜치전략.md         # Git 브랜치 전략 및 PR 규칙
│
├── kit/                     # 로컬 CLI (프로젝트별 커스터마이징 가능)
│   └── cli.mjs              # Node.js CLI 진입점
│
├── .kit/                    # git submodule — 업스트림 원본 (수정 금지)
│
├── .workflow/               # 워크플로우 런타임 파일
│   ├── config.json          # 워크플로우 정의 (수동 편집 가능)
│   ├── state.json           # 진행 상태 ← CLI로만 수정
│   ├── state.js             # 자동 생성 ← 직접 수정 금지
│   ├── status.md            # 자동 생성 ← 직접 수정 금지
│   └── templates/           # Step별 문서 템플릿 (.tmpl)
│
├── agents/                  # Claude Code 에이전트 정의
├── skills/                  # Claude Code 슬래시 커맨드 스킬
└── sprint/                  # 스프린트별 로그 및 이슈 목록
    └── sprint-1/기획/        # Phase별 하위 폴더 구조
```

---

## 4. 코딩 컨벤션

### HTML / CSS

```
클래스 네이밍: BEM 스타일이 아닌 단축형 kebab-case 사용
  ✅ .phase-head, .step-body, .btn-primary
  ❌ .phase__head--active, .StepBody

CSS 변수: :root에 선언, --색상명 패턴 사용
  ✅ --indigo, --gray-800, --emerald
  ❌ --primaryColor, --GRAY_800

인라인 스타일: 절대 사용 금지 — CSS 클래스로 처리
```

### JavaScript

```
변수 선언: const 우선, 재할당 필요 시에만 let, var 금지
함수: 화살표 함수(=>) 우선, 이름 있는 함수는 function 선언식
이벤트 바인딩: addEventListener 사용, onclick 인라인 속성 금지
DOM 선택: querySelector / querySelectorAll 사용, id 선택자 지양
상태 저장: localStorage.setItem / getItem — JSON.stringify/parse 필수
에러 처리: try-catch로 감싸고 콘솔에 에러 기록
```

### 파일 네이밍

```
HTML 파일:   kebab-case.html         (예: project-board.html)
문서 파일:   한글 그대로.md           (예: 요구사항.md, 유저스토리.md)
JS 파일:     camelCase.mjs           (예: cli.mjs)
템플릿 파일: 한글파일명.md.tmpl       (예: 요구사항.md.tmpl)
```

### localStorage 키 컨벤션

| 키 | 파일 | 설명 |
|----|------|------|
| `pb_state` | `docs/index.html` | 프로젝트 보드 전체 상태 |
| `ccwf_v5` | `docs/workflow.html` | 워크플로우 진행 상태 |

> 새 localStorage 키를 추가할 때는 이 표에 반드시 기록합니다.

### HTML 파일 내 구조 순서

```html
1. <style>   — 모든 CSS를 <head> 내 <style> 태그에 집중
2. <body>    — 마크업
3. <script>  — </body> 직전에 JS 위치, 모듈 스크립트 사용 금지 (type="module" 지양)
```

---

## 5. 절대 하면 안 되는 것 (금지 사항)

### 파일 조작 금지

| 금지 행위 | 이유 |
|----------|------|
| `.workflow/state.json` 직접 수정 | CLI 명령어만 사용 — `node kit/cli.mjs complete <id>` |
| `.workflow/status.md` 직접 수정 | 자동 생성 파일 — sync 시 덮어써짐 |
| `.workflow/state.js` 직접 수정 | 자동 생성 파일 — sync 시 덮어써짐 |
| `.kit/` 내부 파일 수정 | git submodule 업스트림 — 수정 시 충돌 발생 |

### 코드 작성 금지

| 금지 행위 | 대안 |
|----------|------|
| 외부 라이브러리 import/require | 제로 의존성 원칙 — Vanilla JS로 구현 |
| CDN `<script src>` 추가 | 오프라인 동작 불가, 제로 의존성 위반 |
| 인라인 `style=""` 속성 | CSS 클래스 사용 |
| `var` 선언 | `const` / `let` 사용 |
| `onclick=""` 인라인 이벤트 | `addEventListener` 사용 |
| `document.write()` | DOM API 사용 |
| `eval()` | 보안 취약점 |
| 하드코딩된 경로 (`/Users/...`, `C:\...`) | 상대 경로 또는 `process.cwd()` 사용 |

### 워크플로우 금지

| 금지 행위 | 이유 |
|----------|------|
| Step 순서 건너뛰기 | 각 Step은 이전 Step 산출물에 의존 |
| ★QA Step을 QC 없이 complete 처리 | 품질 검증 단계 누락 |
| Phase 완료 전 다음 Phase 시작 | 검증되지 않은 기반 위에 작업하게 됨 |

---

## 6. PR / 커밋 규칙

### 브랜치 전략

```
main       ← 배포용 (직접 push 금지, PR로만 머지)
develop    ← 통합 브랜치 (기능 브랜치의 머지 대상)
feat/기획-스프린트1
feat/디자인-스프린트1
feat/프론트-스프린트1
feat/백엔드-스프린트1
```

브랜치 생성은 CLI 명령어를 사용합니다:
```bash
node kit/cli.mjs git-start <phase-id>   # 브랜치 생성
node kit/cli.mjs git-finish <phase-id>  # commit + push
```

### 커밋 메시지 컨벤션

```
<타입>: <한 줄 요약> (50자 이내)

[선택] 본문 — 변경 이유, 결정 배경 (72자 줄바꿈)
```

| 타입 | 사용 상황 |
|------|----------|
| `feat` | 새 기능 추가 |
| `fix` | 버그 수정 |
| `docs` | 문서 추가/수정 (`.md` 파일) |
| `style` | CSS, 레이아웃 변경 (기능 변경 없음) |
| `refactor` | 기능 변경 없이 코드 구조 개선 |
| `chore` | 빌드, 설정, CLI 관련 변경 |
| `test` | 테스트 추가/수정 |

**예시:**
```
docs: 요구사항, 유저스토리, 차별화 문서 추가 (p1s1)
feat: 프로젝트 보드 JSON 백업/복원 기능 추가
fix: workflow.html 상태 저장 누락 버그 수정
style: 랜딩 페이지 hero 섹션 모바일 반응형 적용
chore: .workflow/config.json 프로젝트명 업데이트
```

### PR 규칙

- **제목**: 커밋 타입과 동일한 prefix 사용, 50자 이내
- **본문**: 변경 내용 요약 (bullet), 테스트 방법, 스크린샷 (UI 변경 시)
- **머지 대상**: feature → `develop`, sprint 완료 후 `develop` → `main`
- **직접 push 금지**: `main` 브랜치에는 PR 없이 직접 push하지 않음
- **QC 통과 후 머지**: ★QA Step이 포함된 Phase는 QC 체크리스트 완료 후 머지

---

## 7. 워크플로우 시스템 운영 규칙

작업 전 반드시 현재 상태를 확인합니다:

```bash
node kit/cli.mjs status    # 전체 진행 상태 확인
node kit/cli.mjs next      # 다음 할 일 확인
```

### 상태 흐름

```
CLI command → .workflow/state.json 업데이트
                       ↓
         .workflow/status.md 재생성 (사람이 읽는 뷰)
         .workflow/state.js  재생성 (HTML 브릿지)
                       ↓
         docs/workflow.html, docs/index.html 열면
         state.js 로드 → 체크 상태 자동 반영
```

### 각 Step 작업 순서

1. `node kit/cli.mjs next` — 다음 step 확인
2. `node kit/cli.mjs template <step-id>` — 템플릿 생성 (있는 경우)
3. 프롬프트를 Claude Code에 입력해서 파일 작성
4. ★QA step은 반드시 QC 수행
5. `node kit/cli.mjs complete <step-id>` — 완료 처리

### Phase 완료 시

```bash
node kit/cli.mjs qc <phase-id>          # QC 체크리스트 확인
node kit/cli.mjs log <phase-id>         # sprint-log.md 기록
node kit/cli.mjs git-start <phase-id>   # feature 브랜치 생성
# ... 코드 작업 ...
node kit/cli.mjs git-finish <phase-id>  # commit + push
```

### 워크플로우 단계

| Phase | 이름 | 주요 산출물 |
|-------|------|------------|
| 0 | Git & 스프린트 초기화 | .gitignore, PR 템플릿, 브랜치 전략 |
| 1 | 기획 | README, 요구사항, 유저스토리, 기술스택, 차별화 |
| 2 | 디자인 | 디자인 시스템, 컴포넌트 목록, 페이지 목록, 사용자 흐름 |
| 3 | 프론트엔드 | 컴포넌트, 페이지, API 연동, 단위 테스트 |
| 4 | 백엔드 | API, DB, 인증, CI/CD |
| 5 | 스프린트 마무리 | E2E 테스트, 회고, 다음 계획 |
