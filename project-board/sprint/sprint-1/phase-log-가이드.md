# Phase 2~4 진행 로그 가이드

**목적**: 개발 진행 기록 점수 보강 — Phase별 "무엇을 완료했는지" 짧게 기록해 두면 평가 시 구현 단계별 로그로 인정받기 좋습니다.

---

## 기록 위치 (택 1)

1. **이 파일과 같은 폴더에 Phase별 파일 추가**  
   - `sprint-1/디자인/sprint-log-phase2.md`  
   - `sprint-1/프론트/sprint-log-phase3.md`  
   - `sprint-1/백엔드/sprint-log-phase4.md`
2. **기존 `sprint-log.md` 하단에 섹션 추가**  
   - `## 20XX-XX-XX — Sprint 1 / Phase 2: 디자인` 형태로 이어 붙이기.

---

## Phase 2 (디자인) 로그 템플릿

```markdown
## Phase 2 — 디자인

**완료일**: (예: 2026-03-XX)

### 확정 산출물
| 이슈 | 산출물 | 상태 |
|------|--------|------|
| [디자인-01] | docs/디자인.md | ✅ 검증·보완 |
| [디자인-02] | docs/컴포넌트목록.md | ✅ |
| [디자인-03] | docs/페이지목록.md, docs/사용자흐름.md | ✅ |

### 주요 결정
- (예: 컬러 시스템, 브레이크포인트 360/768/1440 확정)

### 다음 단계
- Phase 3 프론트 구현 착수
```

---

## Phase 3 (프론트) 로그 템플릿

```markdown
## Phase 3 — 프론트엔드

**완료일**: (예: 2026-03-XX)

### 구현 완료 페이지/기능
| 항목 | 파일/기능 | 비고 |
|------|------------|------|
| 랜딩 | project-board.html | |
| 프로젝트 보드 | docs/index.html | 멀티 프로젝트, JSON 백업 등 |
| 워크플로우 | docs/workflow.html | Phase/Step, 프롬프트 복사, QC, localStorage |

### 검증
- E2E: landing 6, workflow 19, project-board 17 (총 42)
- 반응형: 375px 일부 시나리오

### 다음 단계
- Phase 4 CI/CD·백엔드(CLI) 연동
```

---

## Phase 4 (백엔드/CI/CD) 로그 템플릿

```markdown
## Phase 4 — 백엔드·CI/CD

**완료일**: (예: 2026-03-XX)

### 완료 항목
| 이슈 | 산출물 | 상태 |
|------|--------|------|
| [백엔드-03] | .github/workflows/ci.yml | ✅ ESLint + Playwright E2E |
| [백엔드-04] | .github/workflows/deploy.yml | ✅ main → GitHub Pages |

### 검증
- CI: PR/푸시 시 lint + E2E 실행 확인 (예: 마지막 통과 일자)
- 배포: https://(org).github.io/(repo) 동작 확인
```

---

## 한 줄 요약 (평가 시 참고)

- **Phase 2**: 디자인 시스템·컴포넌트·페이지·사용자 흐름 문서 확정.
- **Phase 3**: 랜딩·보드·워크플로우 3개 HTML 구현, E2E 42개.
- **Phase 4**: CI(ESLint + E2E), GitHub Pages 자동 배포 도입.

위 내용을 실제 완료 시점에 맞춰 채워 두면 "구현 단계별 로그"로 개발 진행 기록 점수에 반영할 수 있습니다.
