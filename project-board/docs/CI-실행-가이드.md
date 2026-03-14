# CI 실행 가이드

CI(ESLint + Playwright E2E)를 실행하는 방법입니다.

---

## 1. GitHub에서 CI 실행 (실제 워크플로우)

CI는 **다음 경우에 자동으로** 실행됩니다.

| 트리거 | 조건 |
|--------|------|
| **Push** | `main`, `master`, `develop` 브랜치에 push 했을 때 |
| **Pull Request** | `main` / `master` / `develop` **대상**으로 PR을 열었을 때 |

### 실행 절차

1. **현재 브랜치 확인**
   ```bash
   git branch
   ```

2. **방법 A: PR로 실행 (권장)**
   - 기능 브랜치에서 작업한 뒤, 해당 브랜치를 원격에 push
   - GitHub에서 **Pull Request** 생성 → base: `main`(또는 `develop`)
   - PR이 생성되면 CI가 자동으로 돌고, PR 화면에 체크/엑스 표시로 결과 표시

   ```bash
   git add .
   git commit -m "docs: CI 실행 가이드 추가"
   git push origin <현재-브랜치명>
   ```
   그 다음 GitHub 웹에서 "Compare & pull request"로 PR 생성.

3. **방법 B: main/develop에 직접 push**
   - `main` 또는 `develop`에 push하면 같은 CI가 실행됩니다.
   - (main에 push하면 배포 워크플로우도 함께 실행됩니다.)

### 결과 확인

- **저장소 → Actions** 탭에서 워크플로우 목록 및 로그 확인
- **PR 화면**에서 "All checks have passed" 또는 실패 시 "Details"로 상세 로그 확인

---

## 2. 로컬에서 CI와 동일한 검사 실행 (push 전 확인용)

push/PR 없이, 로컬에서 CI가 하는 것과 **같은 단계**만 실행할 수 있습니다.

**위치: `project-board/` 디렉토리** (저장소 루트가 아니라 프로젝트 폴더)

```bash
cd project-board   # 또는 저장소가 project-board 하나만 있다면 그 루트

# 1) 의존성 설치
npm ci

# 2) ESLint (CI와 동일)
npx eslint . --max-warnings 0

# 3) E2E 테스트 (로컬은 자동으로 http.server 8080 기동)
npx playwright test
```

한 번에 돌리려면:

```bash
cd project-board
npm ci && npx eslint . --max-warnings 0 && npx playwright test
```

- **ESLint만** 확인: `npm run lint` (또는 `npx eslint . --max-warnings 0`)
- **E2E만** 확인: `npm run test` (또는 `npx playwright test`)

로컬 E2E는 `playwright.config.ts` 설정대로 **필요 시 `python3 -m http.server 8080`을 자동으로 띄운 뒤** 테스트합니다. 별도로 서버를 켤 필요는 없습니다.

---

## 3. CI가 실패할 때

- **Actions** 탭에서 실패한 Run 클릭 → 실패한 Job(ESLint 또는 E2E) → 로그 확인
- **ESLint 실패**: 로그에 나온 파일·라인에 맞춰 수정 후 다시 push 또는 로컬에서 `npx eslint . --max-warnings 0` 재실행
- **E2E 실패**: 로그에 나온 스펙·에러 메시지 확인. 로컬에서 `npx playwright test`로 재현 후 수정

저장소 구조가 **루트에 `.github`와 `project-board/`가 같이 있는 경우**, 워크플로우의 `working-directory: project-board`가 이미 그 구조를 전제로 하므로 수정할 필요 없습니다. 루트에 `package.json`만 있고 `project-board` 폴더가 없다면 `ci.yml`의 `working-directory`를 제거하거나 경로를 맞춰야 합니다.
