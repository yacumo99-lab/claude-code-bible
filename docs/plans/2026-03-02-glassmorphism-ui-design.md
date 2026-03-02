# Claude Code Bible — Glassmorphism UI Redesign

**Date**: 2026-03-02
**File**: `claude-code-bible.html`
**Style**: Glassmorphism + Deep Gradient Aurora Background
**Scope**: Full Redesign (CSS + JS, HTML structure preserved)

---

## Goals

- 현재 단순 다크 테마 → 화려한 Glassmorphism 테마로 전면 교체
- HTML 구조 및 기능(탭, 아코디언, 검색, 복사 버튼)은 그대로 유지
- 외부 의존성 없이 순수 CSS + 인라인 JS로 구현

---

## Design Decisions

### Background System

1. **Base layer** — 정적 딥 그라디언트:
   ```css
   background: linear-gradient(135deg, #080814 0%, #12052a 40%, #051228 70%, #080814 100%);
   ```
2. **Aurora orbs** — JS로 삽입하는 3개의 움직이는 광원(fixed position):
   - Orb 1: 보라 `rgba(108,92,231,0.35)`, 20s 루프
   - Orb 2: 청록 `rgba(0,212,255,0.2)`, 28s 루프
   - Orb 3: 인디고 `rgba(162,89,255,0.18)`, 35s 루프
   - 각 오브: `blur(80px)`, `border-radius: 50%`, CSS keyframe 애니메이션

### Cards (`.card`)

```css
background: rgba(255,255,255,0.06);
backdrop-filter: blur(20px);
-webkit-backdrop-filter: blur(20px);
border: 1px solid rgba(255,255,255,0.10);
border-radius: 16px;
box-shadow: 0 8px 32px rgba(0,0,0,0.4);
transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s;
```

Hover:
```css
border-top-color: rgba(108,92,231,0.6);
transform: translateY(-2px);
box-shadow: 0 12px 40px rgba(0,0,0,0.5), 0 0 20px rgba(108,92,231,0.15);
```

### Tab Navigation (`.tabs`)

```css
backdrop-filter: blur(16px);
background: rgba(255,255,255,0.04);
border-bottom: 1px solid rgba(255,255,255,0.08);
```

Active tab (`.tab.active`):
```css
background: linear-gradient(90deg, #a05cf7, #00d4ff);
-webkit-background-clip: text;
-webkit-text-fill-color: transparent;
border-bottom: 2px solid #a05cf7;
```

### Header

- `.badge` 뱃지: 유리체 알약 스타일 (`rgba(108,92,231,0.2)`, blur, rounded)
- 타이틀: 보라-청록 그라디언트 텍스트 + glow `text-shadow`
- `.n` 숫자 강조: 그라디언트 색상

### Copy Buttons (`.cpb`)

```css
background: rgba(108,92,231,0.25);
border: 1px solid rgba(108,92,231,0.45);
backdrop-filter: blur(8px);
border-radius: 8px;
```

Hover:
```css
background: rgba(108,92,231,0.55);
box-shadow: 0 0 14px rgba(108,92,231,0.5);
```

Success state (after copy):
```css
background: rgba(0,200,120,0.3);
border-color: rgba(0,200,120,0.6);
box-shadow: 0 0 14px rgba(0,200,120,0.4);
```

### Search Input (`#search`)

```css
background: rgba(255,255,255,0.06);
border: 1px solid rgba(255,255,255,0.12);
backdrop-filter: blur(12px);
border-radius: 12px;
color: #e0e0f0;
```

Focus:
```css
border-color: rgba(108,92,231,0.6);
box-shadow: 0 0 0 3px rgba(108,92,231,0.2);
```

### Code Blocks (`code`, `pre`)

```css
background: rgba(0,0,0,0.4);
border: 1px solid rgba(255,255,255,0.08);
border-radius: 8px;
color: #c8b8ff;
```

---

## Color Palette

| Token | Value | Usage |
|-------|-------|-------|
| `--bg-base` | `#080814` | 최하단 배경 |
| `--accent-purple` | `#6c5ce7` / `#a05cf7` | 주 강조색 |
| `--accent-cyan` | `#00d4ff` | 보조 강조색 |
| `--glass-bg` | `rgba(255,255,255,0.06)` | 카드 배경 |
| `--glass-border` | `rgba(255,255,255,0.10)` | 카드 테두리 |
| `--text-primary` | `#e8e8f8` | 본문 텍스트 |
| `--text-muted` | `#8888aa` | 보조 텍스트 |

---

## Implementation Notes

- `backdrop-filter` 미지원 브라우저용 fallback: `background: rgba(20,10,40,0.85)`
- 오브 애니메이션은 `@media (prefers-reduced-motion: reduce)` 시 비활성화
- 기존 CSS `<style>` 블록을 통째로 교체 (구조 그대로)
- 오브 JS는 기존 `<script>` 블록 상단에 추가
- 총 변경 파일: `claude-code-bible.html` 1개만

---

## Success Criteria

1. 브라우저에서 열었을 때 Aurora 오브가 천천히 움직임
2. 카드에 backdrop-filter blur 적용 확인
3. 탭 활성 상태에 그라디언트 텍스트 적용 확인
4. 복사 버튼 호버 glow 확인
5. 기존 검색/탭 전환/복사 기능 정상 동작 확인
6. 0개 VS Code 오류 유지
