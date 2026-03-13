# GitHub Projects 칸반 보드 구성 가이드

이 문서는 `project-board` 프로젝트의 GitHub Projects 칸반 보드 설정 방법을 안내합니다.

---

## 1. 보드 생성 방법

1. GitHub 리포지토리 페이지에서 **Projects** 탭 클릭
2. **New project** 버튼 클릭
3. 템플릿에서 **Board** 선택
4. 프로젝트명 입력: `project-board Sprint Board`
5. **Create project** 클릭

---

## 2. 컬럼 구성 (5개)

| 컬럼 | 용도 | 진입 조건 | 이동 조건 |
|------|------|-----------|-----------|
| **Backlog** | 아직 시작하지 않은 모든 이슈/태스크 | 이슈 생성 시 기본 배치 | 스프린트 계획 시 담당자 배정 후 In Progress로 |
| **In Progress** | 현재 개발 진행 중인 이슈 | 담당자가 작업 시작 | PR 생성 시 In Review로 |
| **In Review** | PR이 생성되어 코드 리뷰 대기 중 | PR 오픈 | 리뷰 승인 시 QC로 |
| **QC** | 품질 검증(QA/테스트) 단계 | 코드 리뷰 통과 | 테스트 통과 + 머지 시 Done으로 |
| **Done** | 모든 검증 완료, 머지 완료 | PR 머지 완료 | — |

### 컬럼 추가 방법

1. 보드 우측의 **+ Add column** 버튼 클릭
2. 컬럼명 입력 후 저장
3. 위 표의 순서대로 5개 컬럼 생성: `Backlog` → `In Progress` → `In Review` → `QC` → `Done`

---

## 3. 라벨 체계

### Phase별 분류 라벨

| 라벨 | 색상 (권장) | 설명 |
|------|------------|------|
| `기획` | `#0075ca` | Phase 1 — 기획 관련 이슈 |
| `디자인` | `#e4e669` | Phase 2 — 디자인 관련 이슈 |
| `프론트` | `#d93f0b` | Phase 3 — 프론트엔드 관련 이슈 |
| `백엔드` | `#0e8a16` | Phase 4 — 백엔드 관련 이슈 |

### 작업 유형 라벨

| 라벨 | 설명 |
|------|------|
| `bug` | 버그 수정 |
| `enhancement` | 기능 개선 |
| `docs` | 문서 작업 |

### 라벨 생성 방법

리포지토리 → **Issues** → **Labels** → **New label**

---

## 4. 자동화 설정 (Built-in Workflows)

GitHub Projects의 내장 자동화를 활용해 수동 이동을 최소화합니다.

1. 프로젝트 보드 우측 상단 **⋯** 메뉴 → **Workflows** 클릭
2. 아래 3가지 자동화 활성화:

| 트리거 | 액션 | 설명 |
|--------|------|------|
| **Item added to project** | Status → `Backlog` | 이슈/PR 추가 시 자동으로 Backlog 배치 |
| **Pull request merged** | Status → `Done` | PR 머지 시 자동으로 Done 이동 |
| **Item closed** | Status → `Done` | 이슈/PR 닫힘 시 자동으로 Done 이동 |

---

## 5. 스프린트 운영 가이드

### 스프린트 시작

1. Backlog에서 이번 스프린트에 처리할 이슈 선택
2. 담당자 배정 후 **In Progress**로 이동
3. WIP(Work In Progress) 제한 권장: **In Progress 최대 3개**

### 일일 운영 흐름

```
이슈 생성 → Backlog
         → (스프린트 계획) → In Progress
                           → (PR 생성) → In Review
                                       → (리뷰 승인) → QC
                                                     → (테스트 통과 + 머지) → Done
```

### WIP 제한 이유

- In Progress가 너무 많으면 컨텍스트 스위칭 비용 증가
- 한 번에 집중할 작업을 3개 이하로 제한해 완료 속도 향상

---

## 참고

- [GitHub Projects 공식 문서](https://docs.github.com/en/issues/planning-and-tracking-with-projects)
- [GitHub Projects 자동화 가이드](https://docs.github.com/en/issues/planning-and-tracking-with-projects/automating-your-project)
