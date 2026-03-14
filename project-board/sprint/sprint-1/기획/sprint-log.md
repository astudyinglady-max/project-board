# 스프린트 로그

**프로젝트**: claude-commin-kit (AI 네이티브 개발 워크플로우 툴킷)

---

## 2026-03-13 — Sprint 1 / Phase 1: 기획

---

### 확정된 요구사항

#### MVP 범위

> "브라우저에서 `index.html`을 열면 즉시 스프린트 워크플로우를 따라갈 수 있고, 프로젝트 보드에서 작업을 관리할 수 있는 **제로 의존성 툴킷**"

**Must Have — 10개 기능 확정**

| 카테고리 | 확정 기능 |
|---------|----------|
| 워크플로우 | 6단계 Phase 진행 가이드, 프롬프트 원클릭 복사, QC 체크리스트, localStorage 상태 저장/복원, CLI↔브라우저 상태 연동 |
| 보드 | 멀티 프로젝트 관리, Phase별 작업 카드(체크/역할/메모/댓글), JSON 백업/복원 |
| 랜딩 | 프로젝트 소개 & CTA 페이지 |
| CLI | 12개 명령어(status, next, complete, uncomplete, template, sync, qc, git-start, git-finish, log, list, reset) |

**Should Have — 5개 (MVP 이후 우선 구현)**
- 다크 모드, 모바일 반응형(360px~), 드래그 앤 드롭 카드 이동, 라벨별 필터링, 토스트 알림

**Nice to Have — 4개 (선택)**
- 프로젝트 간 카드 이동, 작업 마감일 알림, 키보드 단축키, PWA 지원

**Out of Scope (명시적 제외)**
- 서버 사이드 로직/DB/API — 서버리스 정적 배포 원칙
- 사용자 로그인/회원가입 — 개인 사용 툴킷으로 불필요
- 실시간 다중 사용자 동시 편집, 모바일 네이티브 앱, JWT 인증/HTTPS 강제

**비기능 요구사항 확정**

| 항목 | 결정값 |
|------|--------|
| 첫 로드 시간 | 2초 이내 |
| 접근성 | WCAG AA (4.5:1 컬러 대비) |
| 반응형 구간 | 360px ~ 1440px |
| 외부 의존성 | 제로 |
| 배포 | GitHub Pages |
| 브라우저 지원 | Chrome / Safari / Firefox 최신 2버전 |
| 데이터 저장 | localStorage + JSON 파일 |

---

### 기술 스택 결정 이유

> 모든 기술 결정의 핵심 원칙: **"외부 의존성 없이 파일을 열면 즉시 작동한다"**

| 영역 | 선택 | 핵심 이유 |
|------|------|----------|
| UI | Pure HTML5 / CSS3 / Vanilla JS | 빌드 없이 브라우저에서 즉시 실행 |
| 스타일 | CSS Custom Properties | 런타임 테마 전환, 빌드 도구 불필요 |
| CLI | Node.js ESM (내장 모듈만) | 외부 패키지 없이 `node kit/cli.mjs` 즉시 실행 |
| 데이터 저장 | localStorage + JSON 파일 | 서버/DB 없는 영속 저장, Git 버전 관리 가능 |
| 배포 | GitHub Pages | 정적 HTML 무료 서빙, push로 자동 배포 |
| 버전관리 | Git + git submodule | 툴킷과 프로젝트 코드 독립 버전 관리 |

각 기술의 선택 이유 및 탈락 대안 전체 비교 → [`docs/기술스택.md`](../../../docs/기술스택.md)

---

### 주요 논의 사항

#### 1. 서버리스 구조에서 "백엔드"의 재정의

전통적인 프론트/백엔드/DB/인프라 구분 대신, 이 프로젝트의 실제 구성 요소인 **브라우저 UI / CLI / 데이터 저장 / 배포**로 기술 스택을 재분류했습니다. 스프린트 이슈 목록의 `백엔드` 범주는 서버가 아닌 **Node.js CLI 툴링 + GitHub Actions CI/CD**로 정의.

#### 2. `state.js` 브릿지 아키텍처

CLI(`state.json`)와 브라우저 UI 간 상태 공유 방식 논의. CLI가 `state.json`을 업데이트하면 `sync` 명령어가 브라우저용 `state.js`를 재생성하고, HTML에서 `<script src>` 태그로 로드하여 체크 상태를 자동 반영하는 방식 확정. **`state.js`는 자동 생성 파일로 직접 수정 금지**.

#### 3. `file://` 프로토콜 한계

`file://`로 직접 열면 일부 브라우저에서 `<script src>` 로드를 제한하여 `state.js` 연동이 불안정해질 수 있음. `python -m http.server` 또는 VS Code Live Server를 권장 방법으로 README에 명시 완료.

#### 4. localStorage 에러 처리 기준

localStorage 용량 초과(5~10MB) 가능성이 낮지만, `try-catch`로 `setItem`을 감싸고 실패 시 콘솔에 에러를 기록하는 안전장치를 구현 방향으로 확정.

#### 5. 차별화 포인트 도출

기존 Jira, Notion, GitHub Issues, Cursor Rules 등의 한계를 분석하여 **4가지 핵심 차별화 포인트** 도출:
1. AI 네이티브 워크플로우 — 프롬프트가 단계에 내장됨
2. 제로 의존성 — 설치도, 계정도, 인터넷도 불필요
3. CLI ↔ 브라우저 양방향 상태 동기화
4. 6단계 QC 내장 — "완성"의 정의가 도구 안에 존재

#### 6. 유저스토리 범위 확정

총 16개 유저스토리(50 스토리 포인트). Must Have(US-01~11) 32pt, Should Have(US-12~16) 18pt. Sprint 1 내 Must Have 전체 완료를 목표로 설정.

---

### 다음 단계 액션 아이템

#### Phase 2 — 디자인 (즉시 착수)

| 이슈 | 산출물 | 우선순위 |
|------|--------|---------|
| **[디자인-01]** 디자인 시스템 정의 | `docs/디자인.md` | 즉시 |
| **[디자인-02]** 컴포넌트 목록 설계 | `docs/컴포넌트목록.md` | 즉시 |
| **[디자인-03]** 페이지 & 사용자 흐름 설계 ★QA | `docs/페이지목록.md`, `docs/사용자흐름.md` | 즉시 |

#### Phase 1 후속 작업 (병행)

- [ ] `docs/폴더구조.md` 작성 — [기획-03] 이슈 요건 미완료 항목
- [ ] 스프린트 1 이슈를 GitHub Issues에 실제 등록
- [ ] GitHub Projects 보드 초기 설정 (라벨 색상, WIP 제한 설정)

#### 인프라 (언제든 착수 가능)

- [ ] **[백엔드-03]** GitHub Actions CI 설정 (HTML 유효성, ESLint)
- [ ] **[백엔드-04]** GitHub Actions 자동 배포 설정 (`main` → GitHub Pages)
- [ ] **[백엔드-05]** `kit/templates/` 폴더에 Step별 `.tmpl` 파일 작성

---

### Phase 1 QC 결과

| 체크 항목 | 결과 |
|----------|------|
| 요구사항에 누락된 핵심 기능은 없는가? | ✅ |
| 유저스토리가 실제 사용자 관점으로 작성되었는가? | ✅ |
| 기술 스택 선택 근거가 문서에 명확히 서술되었는가? | ✅ |
| 차별화.md에 기존 솔루션 대비 강점이 명시되었는가? | ✅ |
| CLAUDE.md에 코딩 규칙이 명확히 정의되었는가? | ✅ |

### Phase 1 산출물

| 산출물 | 파일 | 상태 |
|--------|------|------|
| 프로젝트 초기 설정 | `README.md`, `CLAUDE.md` | ✅ |
| 요구사항 정의서 | `docs/요구사항.md` | ✅ |
| 유저스토리 (16개) | `docs/유저스토리.md` | ✅ |
| 차별화 포인트 | `docs/차별화.md` | ✅ |
| 기술 스택 근거 | `docs/기술스택.md` | ✅ |
| 스프린트 1 이슈 목록 | `sprint/sprint-1/기획/이슈목록.md` | ✅ |
| 폴더 구조 문서 | `docs/폴더구조.md` | ✅ 보완 완료 |
| 스프린트 로그 | `sprint/sprint-1/기획/sprint-log.md` | ✅ |

---

## 2026-03-13 ~ 14 — Sprint 1 / Phase 2: 디자인

---

### 확정 산출물

| 이슈 | 산출물 | 상태 |
|------|--------|------|
| [디자인-01] 디자인 시스템 정의 | `docs/디자인.md` | ✅ 컬러·타이포·간격·컴포넌트 규칙 확정 |
| [디자인-02] 컴포넌트 목록 설계 | `docs/컴포넌트목록.md` | ✅ 상태(default/hover/focus/disabled) 정의 포함 |
| [디자인-03] 페이지 & 사용자 흐름 설계 ★QA | `docs/페이지목록.md`, `docs/사용자흐름.md` | ✅ QC 완료 |
| 부속 작업 | `style/project-board.css` | ✅ CSS 외부 파일 분리 도입 |

### 주요 결정

- **컬러 시스템**: CSS Custom Properties 기반 — `--indigo`, `--emerald`, `--gray-*` 계열 확정. Primary(인디고), 성공(에메랄드), Neutral(그레이) 3축 체계.
- **타이포그래피**: 시스템 폰트 스택 유지, h1~h4 + body + caption 스케일 정의.
- **간격 시스템**: 4px 기준 배수(4/8/12/16/24/32/48px) 확정.
- **브레이크포인트**: 360px / 768px / 1440px 3단계 반응형.
- **CSS 파일 분리**: `style/project-board.css` 생성 — `project-board.html` 전용 스타일 외부화, `<link rel="stylesheet">` 임포트 방식 확정.
- **컴포넌트 목록**: 버튼(primary/ghost/icon), 카드, 모달, 토스트, 체크박스, 진행률 바, 탭 등 공통 컴포넌트 8종 정의.

### Phase 2 QC 결과

| 체크 항목 | 결과 |
|----------|------|
| 컬러 시스템에 Primary/Status/Neutral이 모두 정의되어 있는가? | ✅ |
| 타이포그래피 스케일이 h1~caption까지 정의되어 있는가? | ✅ |
| 4px 기반 간격 시스템이 적용 예시와 함께 명시되어 있는가? | ✅ |
| 3개 페이지의 레이아웃·URL·컴포넌트가 페이지목록.md에 정의되었는가? | ✅ |
| 핵심 시나리오 3가지가 단계별로 사용자흐름.md에 서술되었는가? | ✅ |

### 다음 단계

- Phase 3 프론트엔드 구현 착수 — 랜딩(project-board.html), 보드(docs/index.html), 워크플로우(docs/workflow.html)

---

## 2026-03-14 — Sprint 1 / Phase 3: 프론트엔드

---

### 구현 완료 페이지/기능

| 항목 | 파일 | 주요 기능 |
|------|------|----------|
| 랜딩 페이지 | `project-board.html` + `style/project-board.css` | Hero 섹션, 기능 소개, CTA, 상대 경로 링크 수정 |
| 프로젝트 보드 | `docs/index.html` | 멀티 프로젝트, Phase/Step 체크, JSON 백업·복원, localStorage(`pb_state`) |
| 워크플로우 가이드 | `docs/workflow.html` | 6 Phase 진행, 프롬프트 원클릭 복사, QC 체크리스트, localStorage(`ccwf_v5`) |

### 추가 도입

- `package.json` + `package-lock.json` — Playwright·ESLint devDependencies 관리
- `playwright.config.ts` — E2E 설정 (python3 http.server 8080 자동 기동)
- `tests/e2e/` — Playwright 스펙 3개 파일

### 검증

| 스펙 | 테스트 수 | 커버 시나리오 |
|------|-----------|--------------|
| `landing.spec.ts` | 6개 | 페이지 로드, Hero, 네비 링크, 앵커 스크롤, 복사 버튼 |
| `workflow.spec.ts` | 19개 | Phase 표시, 열기·접기, 프롬프트 복사, QC 체크, 진도율, localStorage 유지, 초기화, 모바일 375px |
| `project-board.spec.ts` | 17개 | 빈 상태, 프로젝트 추가·보드 이동, Step 체크·진도율, 탭 전환, JSON 내보내기, 리로드 영속성, 모바일 |
| **합계** | **42개** | 랜딩·워크플로우·보드 전 플로우 커버 |

- 반응형: 기본 뷰포트 + 모바일(375px) 일부 시나리오 검증
- GitHub Pages 상대 경로 오류 수정 완료 (a27ea2a)
- 파비콘 404 제거 완료 (26bc511)

### Phase 3 QC 결과

| 체크 항목 | 결과 |
|----------|------|
| 3개 HTML 파일이 GitHub Pages에서 정상 접근되는가? | ✅ |
| Playwright E2E 42개 전체 통과되는가? | ✅ |
| localStorage 상태가 새로고침 후 유지되는가? | ✅ |
| 외부 라이브러리·CDN 의존성이 없는가? | ✅ |
| 브라우저 콘솔에 404/CORS 에러가 없는가? | ✅ |

### 다음 단계

- Phase 4 CI/CD 도입 — ESLint + Playwright E2E GitHub Actions 연동

---

## 2026-03-14 — Sprint 1 / Phase 4: 백엔드·CI/CD

---

### 완료 항목

| 이슈 | 산출물 | 상태 |
|------|--------|------|
| [백엔드-03] GitHub Actions CI 설정 | `.github/workflows/ci.yml` | ✅ ESLint + Playwright E2E |
| [백엔드-04] GitHub Actions 자동 배포 설정 | `.github/workflows/deploy.yml` | ✅ master/main → GitHub Pages |
| ESLint 도입 | `eslint.config.js` | ✅ 0 warnings 기준 |
| .github/ 위치 확정 | 저장소 루트(`.github/`) | ✅ 243a878 — 루트 이동으로 GitHub 인식 수정 |
| .nojekyll 추가 | 저장소 루트 | ✅ GitHub Pages Jekyll 처리 방지 |

### CI 구성 상세

**ci.yml** — PR/푸시 시 자동 실행 (트리거: `master`, `main`, `develop`)

| Job | 내용 |
|-----|------|
| `lint` | Node 20, `npm ci`, `npx eslint . --max-warnings 0` |
| `e2e` | Node 20, Playwright Chromium, python3 http.server 8080 기동, `npx playwright test` |

**deploy.yml** — `master`/`main` 푸시 시 자동 배포

| 단계 | 내용 |
|------|------|
| Upload artifact | `project-board/` 폴더를 사이트 루트로 업로드 |
| Deploy | `actions/deploy-pages@v4` → GitHub Pages 배포 |

### 검증

- CI: `master` 브랜치 push 시 ESLint + E2E 자동 실행 확인 (마지막 통과: 2026-03-14)
- 배포: `https://astudyinglady-max.github.io/project-board` 정상 접속 확인
- `.github/` 위치 문제 수정 후 Actions 탭 정상 인식 확인

### Phase 4 QC 결과

| 체크 항목 | 결과 |
|----------|------|
| PR 생성 시 CI가 자동 트리거되는가? | ✅ |
| ESLint 오류 시 워크플로우가 실패하는가? | ✅ |
| main 머지 시 GitHub Pages 자동 배포되는가? | ✅ |
| working-directory가 `project-board`로 올바르게 설정되었는가? | ✅ |

### 다음 단계

- Phase 5 스프린트 마무리 — E2E 추가 보강, 스프린트 회고 작성, 다음 스프린트 계획 수립
