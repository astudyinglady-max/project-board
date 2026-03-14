---
name: add-component
description: '프로젝트 컨벤션에 맞는 HTML/CSS/JS UI 블록을 생성합니다'
argument-hint: "<컴포넌트명> [파일명]"
allowed-tools:
  [
    'Read',
    'Write',
    'Edit',
    'Glob',
    'Grep',
  ]
---

# Claude 명령어: Add Component

프로젝트 컨벤션(Pure HTML/CSS/Vanilla JS)에 맞는 UI 블록을 생성하거나 기존 파일에 추가합니다.

## 사용법

```
/add-component <컴포넌트명>              # HTML 스니펫 출력
/add-component <컴포넌트명> [파일명]     # 지정 파일에 직접 추가
```

**예시:**
```
/add-component 카드
/add-component 모달 docs/index.html
/add-component 토스트 docs/workflow.html
/add-component 드롭다운
```

## 프로세스

### 1단계: 컨텍스트 파악

대상 파일이 지정된 경우 `Read`로 파일을 읽어 기존 CSS 변수, 클래스 패턴, JS 구조를 파악합니다.

### 2단계: HTML 마크업 생성

**클래스 네이밍:** kebab-case 단축형
```html
<!-- ✅ -->
<div class="card-wrap">
  <div class="card-head">...</div>
  <div class="card-body">...</div>
</div>

<!-- ❌ -->
<div class="card__wrap--active">  <!-- BEM 금지 -->
<div style="padding: 16px">      <!-- 인라인 스타일 금지 -->
```

### 3단계: CSS 생성

`:root`에 선언된 CSS 변수 활용:
```css
.card-wrap {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: var(--spacing-md);
}
```

- 새 CSS는 해당 파일의 `<style>` 태그 또는 `style/<파일명>.css`에 추가
- CSS 변수 없으면 기존 파일에서 패턴 참고 후 일관성 유지

### 4단계: JS 생성 (인터랙션 있을 때만)

```js
// ✅
const btn = document.querySelector('.btn-primary');
btn.addEventListener('click', () => { /* ... */ });

// ❌ 금지
document.write();
eval();
onclick="";        // 인라인 이벤트
var x = 1;        // var 금지
```

- 상태 저장 필요 시 `localStorage` + `JSON.stringify/parse`
- `<script>` 태그는 `</body>` 직전에 위치

### 5단계: 결과 출력

파일 지정 없으면: HTML/CSS/JS 스니펫을 코드 블록으로 출력
파일 지정 있으면: `Edit`으로 해당 파일의 적절한 위치에 삽입

## 프로젝트 컨벤션 요약

| 항목 | 규칙 |
|------|------|
| 마크업 | Pure HTML5, 시맨틱 태그 우선 |
| 클래스명 | kebab-case 단축형 (`.card-head`, `.btn-primary`) |
| 스타일 | CSS Custom Properties (`--var` 기반), 인라인 스타일 금지 |
| JS 변수 | `const` 우선, 재할당 필요 시 `let`, `var` 금지 |
| 이벤트 | `addEventListener` 사용, `onclick=""` 금지 |
| DOM | `querySelector` / `querySelectorAll` |
| 외부 라이브러리 | 추가 금지 (제로 의존성 원칙) |
| CDN | 추가 금지 |

## 참고 파일

- `project-board.html` — 랜딩 페이지 마크업 패턴
- `style/project-board.css` — CSS 변수 및 스타일 패턴
- `docs/index.html` — 프로젝트 보드 UI 패턴
- `docs/workflow.html` — 워크플로우 UI 패턴
