# claude-commin-kit

[![CI](https://github.com/astudyinglady-max/project-board/actions/workflows/ci.yml/badge.svg)](https://github.com/astudyinglady-max/project-board/actions/workflows/ci.yml)

> AI(Claude)와 함께 스프린트 단위로 개발하는 솔로 개발자를 위한 **브라우저 전용 워크플로우 툴킷**

설치도, 계정도, 빌드도 필요 없습니다. HTML 파일을 브라우저로 열면 즉시 작동합니다.

🔗 **[라이브 데모 보기](https://astudyinglady-max.github.io/project-board)**

---

## 프로젝트 개요

AI 코딩 어시스턴트(Claude)와 협업할 때 가장 큰 문제는 **워크플로우 상태 관리**입니다. 새 대화를 시작하면 이전 컨텍스트가 사라지고, "지금 어디까지 했는지" "다음엔 어떤 프롬프트를 써야 하는지"를 매번 직접 기억해야 합니다.

claude-commin-kit은 그 인지 부하를 없애는 **제로 의존성 브라우저 툴킷**입니다.

```
project-board.html     ← 브랜딩 랜딩 페이지
docs/
  index.html           ← 프로젝트 보드 (칸반 + 작업 관리)
  workflow.html        ← 6단계 워크플로우 가이드 (프롬프트 내장)
kit/
  cli.mjs              ← Node.js CLI (12개 명령어)
.kit/                  ← git submodule (claude-commin-kit 업스트림)
.workflow/
  config.json          ← 워크플로우 정의 (Phase / Step / 프롬프트 / QC)
  state.json           ← 진행 상태 (Single Source of Truth)
  state.js             ← HTML 대시보드용 상태 브릿지 (자동 생성)
  status.md            ← 사람이 읽는 진행 상태 (자동 생성)
```

---

## 주요 기능

### 워크플로우 가이드 (`docs/workflow.html`)

| 기능 | 설명 |
|------|------|
| 6단계 Phase 가이드 | Git 초기화 → 기획 → 디자인 → 프론트 → 백엔드 → 마무리 |
| 프롬프트 원클릭 복사 | 각 Step의 Claude 프롬프트를 버튼 한 번으로 클립보드에 복사 |
| QC 체크리스트 | Phase 완료 전 품질 검증 항목 강제 확인 |
| 진행 상태 저장 | localStorage 기반 — 새로고침 후에도 상태 유지 |
| CLI 상태 자동 연동 | `node kit/cli.mjs sync` 실행 시 브라우저 화면에 즉시 반영 |

### 프로젝트 보드 (`docs/index.html`)

| 기능 | 설명 |
|------|------|
| 멀티 프로젝트 관리 | 여러 프로젝트 생성 / 전환 / 삭제 |
| Phase별 작업 카드 | 체크, 담당자 역할 배정, 메모, 댓글 |
| JSON 백업 / 복원 | 데이터 내보내기 및 불러오기 |
| localStorage 저장 | 서버 없이 브라우저 내 영속성 |

### CLI (`kit/cli.mjs`)

```bash
node kit/cli.mjs status          # 전체 진행 상태 확인
node kit/cli.mjs next            # 다음 할 일 + 프롬프트 힌트 출력
node kit/cli.mjs complete p1s1   # Step 완료 처리
node kit/cli.mjs uncomplete p1s1 # 완료 취소
node kit/cli.mjs template p1s1   # 템플릿 파일 생성
node kit/cli.mjs sync            # state.js, status.md 재생성
node kit/cli.mjs qc 1            # Phase 1 QC 체크리스트 출력
node kit/cli.mjs git-start 1     # feature 브랜치 생성
node kit/cli.mjs git-finish 1    # commit + push
node kit/cli.mjs log 1           # sprint-log 기록 프롬프트 출력
node kit/cli.mjs list            # 전체 Step 목록
node kit/cli.mjs reset           # 전체 초기화
```

---

## 기술 스택

| 영역 | 기술 | 선택 이유 |
|------|------|----------|
| UI | Pure HTML5 / CSS3 / Vanilla JS | 제로 의존성 — 빌드 도구 없이 브라우저에서 직접 실행 |
| 스타일 | CSS Custom Properties | 번들러 없이 테마 / 변수 관리 |
| 상태 저장 | localStorage | 서버 없이 브라우저 내 영속성 확보 |
| CLI | Node.js ESM (`node:fs`, `node:path`) | 별도 패키지 설치 없이 Node.js만으로 동작 |
| 배포 | GitHub Pages | 정적 파일 서빙 — 서버 / DB 불필요 |
| 버전관리 | Git submodule (`.kit/`) | 툴킷 업스트림과 프로젝트를 독립적으로 관리 |

---

## 로컬 실행 방법

### 방법 1 — 파일 직접 열기 (가장 간단)

```bash
# 저장소 클론 (서브모듈 포함)
git clone --recurse-submodules <repo-url>
cd project-board

# 브라우저에서 열기
open project-board.html        # macOS
start project-board.html       # Windows
xdg-open project-board.html    # Linux
```

`docs/index.html`, `docs/workflow.html`도 동일하게 브라우저에서 바로 열 수 있습니다.

### 방법 2 — 로컬 서버 실행 (권장)

`file://` 프로토콜에서는 일부 브라우저가 `<script src>` 로드를 제한할 수 있습니다.
`state.js` CLI 연동을 안정적으로 사용하려면 로컬 서버를 권장합니다.

```bash
# Python 3
python -m http.server 8080

# Node.js (설치 불필요)
npx serve .

# VS Code — Live Server 익스텐션
# 파일 우클릭 → "Open with Live Server"
```

`http://localhost:8080` 접속.

### CLI 초기화

이미 클론된 저장소에 서브모듈이 없다면:

```bash
git submodule update --init

# 워크플로우 상태 초기화
node kit/cli.mjs init

# 현재 상태 확인
node kit/cli.mjs status
```

---

## 환경변수

이 프로젝트는 **서버리스 정적 파일**로 동작하므로 `.env` 파일이나 런타임 환경변수가 없습니다.

설정은 `.workflow/config.json`에서 관리합니다.

### `.workflow/config.json` 주요 설정

| 필드 | 기본값 | 설명 |
|------|--------|------|
| `project.name` | `"project-board"` | 프로젝트 이름 (브랜치명, 문서 제목에 사용) |
| `project.description` | `"프로젝트 관리 보드"` | 프로젝트 한 줄 설명 |
| `project.sprint` | `1` | 현재 스프린트 번호 |
| `project.branchStrategy.featurePattern` | `"feat/{phase}-스프린트{sprint}"` | feature 브랜치 네이밍 패턴 |

설정 변경 후 반드시 실행:

```bash
node kit/cli.mjs sync
```

### 브라우저 localStorage 키

| 키 | 저장 위치 | 설명 |
|----|----------|------|
| `pb_state` | `docs/index.html` | 프로젝트 보드 전체 상태 (프로젝트, 카드, 댓글) |
| `ccwf_v5` | `docs/workflow.html` | 워크플로우 진행 상태 및 QC 체크리스트 |

> 브라우저 개발자 도구 → Application → Local Storage에서 직접 확인하거나 초기화할 수 있습니다.

---

## 테스트 전략

| 구분 | 내용 |
|------|------|
| **E2E** | Playwright — `tests/e2e/` (landing 6, workflow 19, project-board 17 = **42개**). 모바일 375px 시나리오 포함. |
| **단위 테스트** | Node 내장 `node:test` — `tests/unit/`에서 **핵심 JS 모듈**만 대상. 현재 `kit/state-utils.mjs`(진행률 계산) 1곳, 4개 케이스. |
| **실행** | E2E: `npm test` (로컬 서버 자동 기동) / CI에서 PR·푸시 시 자동 실행. 단위: `npm run test:unit`. |
| **범위** | E2E는 핵심 사용자 플로우 전부. 단위는 파일 시스템·DOM에 의존하지 않는 순수 함수 위주로 점진 확대. |
| **커버리지** | E2E는 시나리오 커버리지(랜딩·워크플로우·보드). 단위·E2E 수치 리포트는 미도입. |

```bash
npm test              # E2E 전체 실행
npm run test:unit     # 단위 테스트 (state-utils 등)
npm run test:ui       # E2E UI 모드
npm run test:report   # E2E HTML 리포트 확인
```

---

## CI/CD 및 자동화

워크플로우는 **저장소 루트** `.github/workflows/` 에 있습니다 (이 프로젝트는 루트에 `project-board/` 폴더가 있는 구조).

> **PR 머지 전 CI 통과 필수** — Pull Request는 ESLint + Playwright E2E가 모두 통과한 뒤에만 머지합니다.

| 파일 | 트리거 | 내용 |
|------|--------|------|
| **ci.yml** | PR/푸시 (master, main, develop) | ESLint + Playwright E2E. `project-board/` 기준 실행. |
| **deploy.yml** | 푸시 (master, main) | GitHub Pages 자동 배포 (upload-pages-artifact → deploy-pages). |

- **ESLint**: `npm run lint` — CI의 lint job에서 `--max-warnings 0`으로 실행.
- **배포**: Settings → Pages → Source를 **GitHub Actions**로 두면 푸시 시 자동 배포.

---

## GitHub Pages 배포

1. GitHub 저장소 **Settings → Pages** 이동
2. **Source**: **GitHub Actions** (권장 — `deploy.yml` 사용)
3. 또는 **Deploy from a branch** → Branch: `main` / `/ (root)` → Save
4. `https://<username>.github.io/project-board` 에서 접근 가능

`project-board.html`이 루트에 있으므로 별도 빌드 없이 즉시 서빙됩니다.

---

## 문서

| 문서 | 설명 |
|------|------|
| [요구사항](./docs/요구사항.md) | Must Have / Should Have / Nice to Have 분류 |
| [유저스토리](./docs/유저스토리.md) | 16개 유저스토리 + 수용 기준 |
| [차별화](./docs/차별화.md) | 문제 정의, 기존 솔루션 한계, 핵심 강점 |
| [접근성 체크리스트](./docs/접근성-체크리스트.md) | WCAG AA 검증 항목 (컬러 대비, 포커스, 키보드, 대체 텍스트) |
| [워크플로우 상태](./.workflow/status.md) | 자동 생성 — 현재 진행 상태 |

---

## 라이선스

MIT

---

Sprint 1 | Updated: 2026-03-13
