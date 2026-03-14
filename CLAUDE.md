# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## 저장소 구조

이 git 저장소의 루트에는 `project-board/` 디렉토리 하나만 존재합니다. 모든 프로젝트 코드, 문서, CLI, 설정 파일은 그 안에 있습니다.

```
/                          ← git 저장소 루트 (여기)
├── .gitmodules            # git submodule 설정 (project-board/.kit)
└── project-board/         # 실제 프로젝트 — 작업은 이 안에서 진행
    ├── CLAUDE.md          # 상세 작업 지침 (코딩 규칙, 워크플로우, 금지 사항)
    ├── project-board.html # 브랜딩 랜딩 페이지
    ├── docs/              # GitHub Pages 서빙 폴더 + 기획 문서
    ├── kit/cli.mjs        # Node.js CLI — 12개 워크플로우 명령어
    ├── .kit/              # git submodule (claude-code-kit 업스트림, 수정 금지)
    └── .workflow/         # 워크플로우 런타임 (config.json, state.json 등)
```

> 코딩 컨벤션, 금지 사항, PR 규칙, 워크플로우 운영 방법은 **[`project-board/CLAUDE.md`](project-board/CLAUDE.md)** 를 참조하십시오.

---

## 주요 명령어

모든 명령어는 `project-board/` 디렉토리 기준으로 실행합니다.

```bash
# 워크플로우 상태 확인
node project-board/kit/cli.mjs status
node project-board/kit/cli.mjs next

# 로컬 서버 (state.js CLI 연동 시 권장)
python -m http.server 8080 --directory project-board
```

---

## Git Submodule

`project-board/.kit/`은 `https://github.com/astudyinglady-max/claude-code-kit.git` 업스트림 submodule입니다.

```bash
# 최초 클론 후 서브모듈 초기화
git submodule update --init

# 업스트림 최신 반영
git submodule update --remote project-board/.kit
```

`.kit/` 내부 파일은 절대 직접 수정하지 않습니다 — 충돌 발생 원인이 됩니다.
