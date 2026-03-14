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

**claude-code-kit**은 AI(Claude)와 함께 스프린트 단위로 개발하는 솔로 개발자를 위한 **브라우저 전용 워크플로우 관리 툴킷**이자, 해당 툴킷을 소개하는 **브랜딩 랜딩 페이지**입니다.

### 해결하는 문제
AI와 대화형으로 개발할 때 새 세션을 시작하면 이전 컨텍스트가 사라집니다. 개발자는 매번 "지금 어디까지 했는지", "다음엔 어떤 프롬프트를 써야 하는지"를 직접 기억하고 타이핑해야 합니다. 이 툴킷은 그 인지 부하를 없앱니다.

### 구성 파일 역할
| 파일 | 역할 |
|------|------|
| `project-board.html` | 브랜딩 랜딩 페이지 (정적, 소개 + CTA) |
| `docs/index.html` | 인터랙티브 프로젝트 보드 (칸반, 멀티 프로젝트) |
| `docs/workflow.html` | 6단계 워크플로우 가이드 (프롬프트 복사, QC 체크) |
| `kit/cli.mjs` | Node.js CLI — 워크플로우 상태 관리 12개 명령어 |
| `.kit/` | git submodule — claude-code-kit 업스트림 |
| `.workflow/config.json` | 워크플로우 정의 (Phase/Step/프롬프트/QC) |
| `.workflow/state.json` | 진행 상태 (Single Source of Truth) |
| `.workflow/state.js` | HTML 대시보드용 상태 브릿지 (자동 생성) |
| `.workflow/status.md` | 사람이 읽는 진행 상태 (자동 생성) |

---

## 2. 사용 기술 스택

| 영역 | 기술 | 비고 |
|------|------|------|
| UI | Pure HTML5 / CSS3 / Vanilla JS | 프레임워크 없음 |
| 스타일 | CSS Custom Properties | `--var` 기반 테마 관리 |
| 상태 저장 | `localStorage` | 서버 없이 브라우저 내 영속성 |
| CLI | Node.js ESM (`node:fs`, `node:path`, `node:child_process`) | 외부 패키지 없음 |
| E2E 테스트 | Playwright | `tests/e2e/` — 로컬/CI 공통 |
| 배포 | GitHub Pages | 정적 파일 서빙 |
| 버전관리 | Git + git submodule | `.kit/` 로 업스트림 관리 |

> UI 코드(HTML/CSS/JS)는 제로 의존성 원칙을 유지합니다. 테스트 도구(`devDependencies`)는 예외입니다.

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
├── docs/                    # GitHub Pages 서빙 폴더 + 기획·운영 문서
│   ├── index.html           # 프로젝트 보드 (칸반 UI)
│   ├── workflow.html        # 워크플로우 가이드 UI
│   ├── 요구사항.md           # Must Have / Should Have / Nice to Have
│   ├── 유저스토리.md          # 유저스토리 16개 + 수용 기준 + Sprint 배정
│   ├── 차별화.md             # 문제 정의, 기존 솔루션 한계, 경쟁 우위·구현 현황
│   ├── 기술스택.md           # 기술 선택 이유 및 대안 비교, 검증 현황
│   ├── 폴더구조.md           # 디렉토리 구조, 폴더 역할, CI/CD 파이프라인
│   ├── 브랜치전략.md         # Git 브랜치 전략 및 PR 규칙
│   ├── 디자인.md             # 디자인 시스템 (컬러, 타이포, 간격, 컴포넌트)
│   ├── 컴포넌트목록.md       # 공통 컴포넌트 목록·상태·사용 예시
│   ├── 페이지목록.md         # 3개 페이지 레이아웃·URL·필요 컴포넌트
│   ├── 사용자흐름.md         # 핵심 시나리오 3가지 단계별 흐름
│   ├── GitHub-Projects-설정.md # GitHub Projects 보드 설정 가이드
│   ├── 접근성-체크리스트.md   # WCAG AA 검증 항목 (컬러 대비, 포커스, 키보드)
│   └── CI-실행-가이드.md     # CI GitHub 트리거·로컬 동일 검사 실행 방법
│
├── kit/                     # 로컬 CLI (프로젝트별 커스터마이징 가능)
│   ├── cli.mjs              # Node.js CLI 진입점 (12개 명령어)
│   └── state-utils.mjs      # 순수 함수 유틸 (진행률 계산 등, 단위 테스트 대상)
│
├── .kit/                    # git submodule — claude-code-kit 업스트림 (수정 금지)
│
├── .workflow/               # 워크플로우 런타임 파일
│   ├── config.json          # 워크플로우 정의 (수동 편집 가능)
│   ├── state.json           # 진행 상태 ← CLI로만 수정
│   ├── state.js             # 자동 생성 ← 직접 수정 금지
│   ├── status.md            # 자동 생성 ← 직접 수정 금지
│   └── templates/           # Step별 문서 템플릿 (.tmpl)
│
├── style/                   # 외부 CSS 파일
│   └── project-board.css    # project-board.html 전용 스타일시트
├── agents/                  # Claude Code 에이전트 정의
├── skills/                  # Claude Code 슬래시 커맨드 스킬
├── tests/                   # E2E(Playwright) + 단위(Node node:test)
│   ├── e2e/                 # 42개 E2E 스펙
│   └── unit/                # 핵심 JS 단위 테스트 (state-utils 등)
└── sprint/                  # 스프린트별 로그 및 이슈 목록
    ├── sprint-1/기획/        # Phase 1 스프린트 로그, 이슈목록, 회고
    ├── sprint-2/             # 스프린트 2 계획, 회고
    └── sprint-3/             # 스프린트 3 계획
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

### CSS 파일 분리 규칙

`style/` 디렉토리에 파일명을 맞춰 CSS를 관리합니다:

| HTML 파일 | CSS 파일 | 임포트 방식 |
|-----------|----------|------------|
| `project-board.html` | `style/project-board.css` | `<link rel="stylesheet" href="style/project-board.css">` |
| `docs/index.html` | `style/index.css` (필요 시) | `<link rel="stylesheet" href="../style/index.css">` |
| `docs/workflow.html` | `style/workflow.css` (필요 시) | `<link rel="stylesheet" href="../style/workflow.css">` |

> `docs/` 하위 파일은 `../style/` 상대 경로를 사용합니다.
> 단발성 오버라이드가 필요한 경우에만 `<style>` 태그를 `<head>` 안에 추가로 허용합니다.

### HTML 파일 내 구조 순서

```html
1. <link rel="stylesheet">  — <head> 안에 외부 CSS 임포트
2. <style>                  — 해당 페이지 전용 오버라이드만 (선택, 최소화)
3. <body>                   — 마크업
4. <script>                 — </body> 직전에 JS 위치, 모듈 스크립트 사용 금지 (type="module" 지양)
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
| UI 코드에 외부 라이브러리 import | Vanilla JS로 구현 (테스트 코드는 예외) |
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

### Claude Code 스킬 명령어

Git 작업은 아래 스킬 명령어를 우선 사용합니다:

| 스킬 | 명령어 | 용도 |
|------|--------|------|
| 브랜치 생성/관리 | `/git:branch` | 브랜치 생성, 전환, 삭제 |
| 커밋 생성 | `/git-commit` | 이모지 컨벤셔널 커밋 자동 생성 |
| PR 생성 | `/git:pr` | Pull Request 자동 생성 |
| PR 코드 리뷰 | `/review-pr` | 변경사항 코드 리뷰 |
| 브랜치 병합 | `/git:merge` | 안전한 브랜치 병합 |

> Phase 단위 브랜치 관리는 워크플로우 CLI(`node kit/cli.mjs git-start/finish`)를 함께 사용할 수 있습니다.

### 브랜치 전략

```
main       ← 배포용 (직접 push 금지, PR로만 머지)
develop    ← 통합 브랜치 (기능 브랜치의 머지 대상)
feat/기획-스프린트1
feat/디자인-스프린트1
feat/프론트-스프린트1
feat/백엔드-스프린트1
```

브랜치 생성 방법 (두 방법 모두 사용 가능):
```bash
# 스킬 사용 (권장 — 안전 점검 + stash 자동 처리)
/git:branch feat/기획-스프린트1

# 워크플로우 CLI 사용 (Phase 연동 시)
node kit/cli.mjs git-start <phase-id>
```

### 커밋 메시지 컨벤션

```
<이모지> <타입>: <한 줄 요약> (72자 이내)

[선택] 본문 — 변경 이유, 결정 배경 (72자 줄바꿈)
```

| 타입 | 이모지 | 사용 상황 |
|------|--------|----------|
| `feat` | ✨ | 새 기능 추가 |
| `fix` | 🐛 | 버그 수정 |
| `docs` | 📝 | 문서 추가/수정 (`.md` 파일) |
| `style` | 💄 | CSS, 레이아웃 변경 (기능 변경 없음) |
| `refactor` | ♻️ | 기능 변경 없이 코드 구조 개선 |
| `chore` | 🔧 | 빌드, 설정, CLI 관련 변경 |
| `test` | ✅ | 테스트 추가/수정 |

**예시:**
```
📝 docs: 요구사항, 유저스토리, 차별화 문서 추가 (p1s1)
✨ feat: 프로젝트 보드 JSON 백업/복원 기능 추가
🐛 fix: workflow.html 상태 저장 누락 버그 수정
💄 style: 랜딩 페이지 hero 섹션 모바일 반응형 적용
🔧 chore: .workflow/config.json 프로젝트명 업데이트
```

> `/git-commit` 스킬이 diff를 분석해 이모지와 메시지를 자동 생성합니다. 직접 작성 시 위 형식을 따릅니다.

### PR 규칙

- **생성**: `/git:pr` 스킬 사용 — 커밋 히스토리 기반으로 제목/설명 자동 생성
- **리뷰**: `/review-pr` 스킬 사용 — 버그·보안·성능·코드 품질 4가지 관점으로 검토
- **제목**: 커밋 타입과 동일한 prefix 사용, 72자 이내
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

**이 프로젝트에서의 대응** (서버리스 툴킷이라 Phase 3·4는 전통적 API/DB 없음):

| Phase | 실제 산출물 |
|-------|-------------|
| 0 | `.gitignore`, `.github/PULL_REQUEST_TEMPLATE.md`, `docs/브랜치전략.md` |
| 1 | `README.md`, `docs/요구사항.md`, `docs/유저스토리.md`, `docs/기술스택.md`, `docs/차별화.md` + 이슈목록, sprint-log |
| 2 | `docs/디자인.md`, `docs/컴포넌트목록.md`, `docs/페이지목록.md`, `docs/사용자흐름.md` |
| 3 | 3개 페이지(`project-board.html`, `docs/index.html`, `docs/workflow.html`), CLI↔state.js 연동, `tests/unit/`(핵심 JS) |
| 4 | CI/CD(`.github/workflows/ci.yml`, `deploy.yml`) — API/DB/인증은 Out of Scope |
| 5 | `tests/e2e/`(42개), `sprint/sprint-1/스프린트1-회고.md`, `sprint/sprint-2/스프린트2-계획.md`, `sprint/sprint-2/스프린트2-회고.md`, `sprint/sprint-3/스프린트3-계획.md` |

그 외 참고 문서: `docs/폴더구조.md`, `docs/접근성-체크리스트.md`, `docs/89점-달성-로드맵.md`, `docs/CI-실행-가이드.md`, `sprint/sprint-1/phase-log-가이드.md` 등은 워크플로우 표에 없는 보조 산출물이다.
