# Glassmorphism UI Redesign — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** claude-code-bible.html의 CSS를 전면 교체하여 Aurora 배경 + Glassmorphism 카드/탭 테마로 리디자인한다.

**Architecture:** 단일 HTML 파일. `<style>` 블록의 CSS를 통째로 새것으로 교체하고, `<script>` 블록 상단에 Aurora Orb 애니메이션 JS를 추가한다. HTML 구조와 JS 기능 코드는 건드리지 않는다.

**Tech Stack:** Pure HTML/CSS/JS, 외부 의존성 없음

**Design Reference:** `docs/plans/2026-03-02-glassmorphism-ui-design.md`

---

## Color Palette

| 변수 | 값 | 용도 |
|------|-----|------|
| `--bg` | `#080814` | 최하단 배경 |
| `--card` | `rgba(255,255,255,0.06)` | 카드 배경 (glass) |
| `--card2` | `rgba(255,255,255,0.04)` | 카드 보조 배경 |
| `--border` | `rgba(255,255,255,0.10)` | 테두리 |
| `--accent` | `#6c5ce7` / `#a05cf7` | 보라 강조 |
| `--cyan` | `#00d4ff` | 청록 강조 |
| `--text` | `#e8e8f8` | 본문 |
| `--muted` | `#8888aa` | 보조 텍스트 |

---

### Task 1: CSS Variables & Body Background 교체

**Files:**
- Modify: `claude-code-bible.html:8-14` (`:root` 변수와 `body` 스타일)

**Step 1: `:root` 변수 교체**

현재 (line 8-12):
```css
:root{
  --bg:#07070f;--card:#0f0f1e;--card2:#161628;
  --a1:#ff6b35;--a2:#00d4aa;--a3:#7c5cfc;--a4:#ffbe0b;--a5:#ff4d8d;--a6:#4dabf7;
  --text:#e8e8f2;--muted:#6e6e90;--border:#1e1e38;
}
```

교체 후:
```css
:root{
  --bg:#080814;--card:rgba(255,255,255,.06);--card2:rgba(255,255,255,.04);
  --a1:#ff6b35;--a2:#00d4aa;--a3:#a05cf7;--a4:#ffbe0b;--a5:#ff4d8d;--a6:#4dabf7;
  --text:#e8e8f8;--muted:#8888aa;--border:rgba(255,255,255,.10);
  --glass-blur:20px;--accent:#6c5ce7;--cyan:#00d4ff;
}
```

**Step 2: `body` 배경 교체**

현재 (line 14):
```css
body{background:var(--bg);color:var(--text);font-family:...;padding-bottom:60px;}
```

교체 후:
```css
body{background:linear-gradient(135deg,#080814 0%,#12052a 40%,#051228 70%,#080814 100%);background-attachment:fixed;color:var(--text);font-family:-apple-system,'Apple SD Gothic Neo','Malgun Gothic','맑은 고딕',sans-serif;padding-bottom:60px;}
```

**Step 3: 브라우저에서 배경색 변화 확인**

```bash
open -a "Google Chrome" /Users/kimbyungkil/클로드/클로드명령어/claude-code-bible.html
```
예상: 딥 인디고-퍼플 그라디언트 배경

**Step 4: Commit**

```bash
cd /Users/kimbyungkil/클로드/클로드명령어
git add claude-code-bible.html
git commit -m "style: CSS 변수 및 body 배경 글라스모피즘 기반으로 교체"
```

---

### Task 2: 카드 Glassmorphism 스타일

**Files:**
- Modify: `claude-code-bible.html:58-72` (`.card` 블록)

**Step 1: `.card` 기본 스타일 교체**

현재 (line 58):
```css
.card{background:var(--card);border-radius:12px;margin-bottom:8px;border:1px solid var(--border);overflow:hidden;}
```

교체 후:
```css
.card{background:var(--card);backdrop-filter:blur(var(--glass-blur));-webkit-backdrop-filter:blur(var(--glass-blur));border-radius:16px;margin-bottom:10px;border:1px solid var(--border);overflow:hidden;transition:transform .2s ease,box-shadow .2s ease,border-color .2s ease;box-shadow:0 8px 32px rgba(0,0,0,.35);}
```

**Step 2: 카드 호버 효과 추가**

`.card.open .ca{transform:rotate(180deg);}` 다음 줄 (line 70 이후) 에 추가:
```css
@media(hover:hover){.card:hover{transform:translateY(-2px);box-shadow:0 12px 40px rgba(0,0,0,.5),0 0 20px rgba(108,92,231,.12);border-color:rgba(160,92,247,.35);}}
```

**Step 3: `.cb` 카드 본문 border 조정**

현재 (line 71):
```css
.cb{display:none;padding:0 13px 13px;border-top:1px solid var(--border);}
```

교체 후:
```css
.cb{display:none;padding:0 13px 13px;border-top:1px solid rgba(255,255,255,.07);}
```

**Step 4: `.card2` 사용 요소 (`fi`, `fn`) 유리체화**

현재 (line 98-100):
```css
.fi{border:1px solid var(--border);border-radius:9px;margin-bottom:7px;overflow:hidden;}
.fn{background:var(--card2);padding:7px 11px;font-family:'Menlo','Monaco','Courier New',monospace;font-size:.77rem;color:var(--a4);font-weight:600;}
```

교체 후:
```css
.fi{border:1px solid var(--border);border-radius:12px;margin-bottom:8px;overflow:hidden;background:rgba(255,255,255,.03);}
.fn{background:rgba(0,0,0,.25);padding:7px 11px;font-family:'Menlo','Monaco','Courier New',monospace;font-size:.77rem;color:var(--a4);font-weight:600;}
```

**Step 5: 브라우저 확인**
카드가 반투명 유리처럼 보이는지 확인.

**Step 6: Commit**
```bash
git add claude-code-bible.html
git commit -m "style: 카드 Glassmorphism 스타일 적용"
```

---

### Task 3: 탭 네비게이션 Frosted Glass

**Files:**
- Modify: `claude-code-bible.html:34-39` (`.tabs-wrap`, `.tab`, `.tab.active`)

**Step 1: `.tabs-wrap` sticky 바 유리체화**

현재 (line 35):
```css
.tabs-wrap{padding:10px 14px 0;position:sticky;top:0;background:var(--bg);z-index:100;border-bottom:1px solid var(--border);padding-bottom:10px;}
```

교체 후:
```css
.tabs-wrap{padding:10px 14px 0;position:sticky;top:0;background:rgba(8,8,20,.75);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);z-index:100;border-bottom:1px solid rgba(255,255,255,.08);padding-bottom:10px;}
```

**Step 2: `.tab` 스타일 교체**

현재 (line 38):
```css
.tab{flex-shrink:0;padding:6px 11px;border-radius:18px;font-size:.72rem;font-weight:700;cursor:pointer;border:1.5px solid var(--border);background:var(--card);color:var(--muted);transition:all .2s;white-space:nowrap;}
```

교체 후:
```css
.tab{flex-shrink:0;padding:6px 11px;border-radius:18px;font-size:.72rem;font-weight:700;cursor:pointer;border:1px solid rgba(255,255,255,.08);background:rgba(255,255,255,.04);color:var(--muted);transition:all .2s;white-space:nowrap;}
```

**Step 3: `.tab.active` 그라디언트 텍스트**

현재 (line 39):
```css
.tab.active{border-color:var(--a3);color:#fff;background:rgba(124,92,252,.2);}
```

교체 후:
```css
.tab.active{border-color:rgba(160,92,247,.5);background:rgba(108,92,231,.2);color:#fff;text-shadow:0 0 12px rgba(160,92,247,.5);}
```

**Step 4: 브라우저 확인**
스크롤 시 탭이 frosted glass 효과로 floating하는지 확인.

**Step 5: Commit**
```bash
git add claude-code-bible.html
git commit -m "style: 탭 네비게이션 Frosted Glass 효과 적용"
```

---

### Task 4: 헤더 글라스 & 그라디언트 텍스트

**Files:**
- Modify: `claude-code-bible.html:17-25` (`.hdr` 블록)

**Step 1: `.hdr` 배경 교체**

현재 (line 17):
```css
.hdr{background:linear-gradient(160deg,#0c0c22,#07070f);border-bottom:1px solid var(--border);padding:26px 16px 18px;text-align:center;position:relative;overflow:hidden;}
```

교체 후:
```css
.hdr{background:linear-gradient(160deg,rgba(18,5,42,.9),rgba(5,18,40,.9));backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);border-bottom:1px solid rgba(255,255,255,.08);padding:26px 16px 18px;text-align:center;position:relative;overflow:hidden;}
```

**Step 2: `.hdr::after` 오브 강화**

현재 (line 18):
```css
.hdr::after{content:'';position:absolute;top:-80px;left:50%;transform:translateX(-50%);width:320px;height:240px;background:radial-gradient(ellipse,rgba(124,92,252,.16) 0%,transparent 70%);pointer-events:none;}
```

교체 후:
```css
.hdr::after{content:'';position:absolute;top:-80px;left:50%;transform:translateX(-50%);width:500px;height:300px;background:radial-gradient(ellipse,rgba(160,92,247,.22) 0%,rgba(0,212,255,.08) 50%,transparent 70%);pointer-events:none;}
```

**Step 3: `.hdr .badge` 유리체화**

현재 (line 19):
```css
.hdr .badge{display:inline-block;background:rgba(124,92,252,.16);border:1px solid rgba(124,92,252,.4);border-radius:20px;font-size:.68rem;font-weight:700;color:#b39dff;padding:3px 12px;margin-bottom:10px;letter-spacing:1px;}
```

교체 후:
```css
.hdr .badge{display:inline-block;background:rgba(108,92,231,.2);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);border:1px solid rgba(160,92,247,.45);border-radius:20px;font-size:.68rem;font-weight:700;color:#c5b0ff;padding:3px 14px;margin-bottom:10px;letter-spacing:1px;box-shadow:0 0 16px rgba(108,92,231,.25);}
```

**Step 4: `.stat .n` 그라디언트 숫자**

현재 (line 24):
```css
.stat .n{font-size:1.1rem;font-weight:900;color:var(--a3);}
```

교체 후:
```css
.stat .n{font-size:1.1rem;font-weight:900;background:linear-gradient(135deg,#a05cf7,#00d4ff);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;}
```

**Step 5: 브라우저 확인**
헤더 뱃지가 발광하고 숫자에 그라디언트가 적용되는지 확인.

**Step 6: Commit**
```bash
git add claude-code-bible.html
git commit -m "style: 헤더 글라스 뱃지 및 그라디언트 숫자 적용"
```

---

### Task 5: 복사 버튼 Glow Effect

**Files:**
- Modify: `claude-code-bible.html:80-82` (`.cpb` 블록)

**Step 1: `.cpb` 유리체 버튼으로 교체**

현재 (line 80-82):
```css
.cpb{position:absolute;top:5px;right:5px;background:var(--border);border:none;border-radius:4px;color:var(--muted);font-size:.63rem;padding:2px 6px;cursor:pointer;font-family:'Noto Sans KR',sans-serif;transition:all .15s;}
.cpb:active{background:var(--a2);color:#000;}
.cpb{font-family:inherit;}
```

교체 후:
```css
.cpb{position:absolute;top:5px;right:5px;background:rgba(108,92,231,.25);border:1px solid rgba(108,92,231,.4);border-radius:6px;color:#c5b0ff;font-size:.63rem;padding:2px 8px;cursor:pointer;font-family:inherit;transition:all .2s;backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);}
.cpb:hover{background:rgba(108,92,231,.5);box-shadow:0 0 12px rgba(108,92,231,.45);color:#fff;}
.cpb:active{background:rgba(0,200,120,.35);border-color:rgba(0,200,120,.55);box-shadow:0 0 14px rgba(0,200,120,.4);color:#7effc4;}
```

**Step 2: 복사 성공 feedback 스타일 추가 (JS에서 이미 사용 중이면 확인)**

현재 복사 성공 시 "✓" 텍스트 변경만 있는지 script에서 확인:
```bash
grep -n "cpb\|✓\|copied" /Users/kimbyungkil/클로드/클로드명령어/claude-code-bible.html | head -20
```

**Step 3: 브라우저 확인**
CMD 블록의 복사 버튼에 마우스 올렸을 때 보라 발광 확인.

**Step 4: Commit**
```bash
git add claude-code-bible.html
git commit -m "style: 복사 버튼 Glassmorphism Glow 적용"
```

---

### Task 6: 검색 인풋 Glass Effect

**Files:**
- Modify: `claude-code-bible.html:28-32` (`.srch-box` 블록)

**Step 1: `.srch-box` 유리체화**

현재 (line 29):
```css
.srch-box{display:flex;align-items:center;gap:8px;background:var(--card);border:1px solid var(--border);border-radius:12px;padding:10px 14px;}
```

교체 후:
```css
.srch-box{display:flex;align-items:center;gap:8px;background:rgba(255,255,255,.06);backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);border:1px solid rgba(255,255,255,.12);border-radius:14px;padding:10px 14px;transition:border-color .2s,box-shadow .2s;}
.srch-box:focus-within{border-color:rgba(160,92,247,.55);box-shadow:0 0 0 3px rgba(108,92,231,.18);}
```

**Step 2: 브라우저 확인**
검색창 클릭 시 보라 glow ring 확인.

**Step 3: Commit**
```bash
git add claude-code-bible.html
git commit -m "style: 검색 인풋 Glass Focus 효과 적용"
```

---

### Task 7: CMD 블록 & 코드 스타일 다크 Glass

**Files:**
- Modify: `claude-code-bible.html:75-78` (`.cmd` 블록)
- Modify: `claude-code-bible.html:95` (`.sk`)
- Modify: `claude-code-bible.html:136-138` (`.fb`, `.fb-name`, `.fb-code`)
- Modify: `claude-code-bible.html:123-124` (`.pb`)

**Step 1: `.cmd` 블록 교체**

현재 (line 75):
```css
.cmd{background:#06060e;border:1px solid #1a1a30;border-radius:9px;padding:8px 36px 8px 11px;margin:7px 0 3px;position:relative;display:flex;align-items:flex-start;gap:6px;}
```

교체 후:
```css
.cmd{background:rgba(0,0,0,.45);border:1px solid rgba(255,255,255,.07);border-radius:10px;padding:8px 36px 8px 11px;margin:7px 0 3px;position:relative;display:flex;align-items:flex-start;gap:6px;backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);}
```

**Step 2: `.sk` (단축키 뱃지) 교체**

현재 (line 95):
```css
.sk{font-family:'Menlo','Monaco','Courier New',monospace;font-size:.7rem;background:#131326;border:1px solid #232342;border-radius:4px;padding:2px 6px;color:var(--a4);white-space:nowrap;display:inline-block;}
```

교체 후:
```css
.sk{font-family:'Menlo','Monaco','Courier New',monospace;font-size:.7rem;background:rgba(0,0,0,.4);border:1px solid rgba(255,255,255,.1);border-radius:5px;padding:2px 7px;color:var(--a4);white-space:nowrap;display:inline-block;box-shadow:0 2px 6px rgba(0,0,0,.3);}
```

**Step 3: `.fb` (파일 블록) 교체**

현재 (lines 136-138):
```css
.fb{background:#06060e;border:1px solid #1a1a30;border-radius:9px;margin:7px 0;}
.fb-name{padding:5px 11px;background:#101020;border-bottom:1px solid #1a1a30;font-family:...;}
```

교체 후:
```css
.fb{background:rgba(0,0,0,.4);border:1px solid rgba(255,255,255,.07);border-radius:12px;margin:7px 0;}
.fb-name{padding:5px 11px;background:rgba(0,0,0,.3);border-bottom:1px solid rgba(255,255,255,.06);font-family:'Menlo','Monaco','Courier New',monospace;font-size:.69rem;color:var(--muted);border-radius:12px 12px 0 0;}
```

**Step 4: `.pb` (프롬프트 블록) 교체**

현재 (line 123):
```css
.pb{background:#06060e;border:1px solid rgba(124,92,252,.22);border-radius:9px;padding:9px 11px;margin:7px 0;font-size:.79rem;line-height:1.65;color:#d4c5ff;}
```

교체 후:
```css
.pb{background:rgba(0,0,0,.4);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);border:1px solid rgba(160,92,247,.25);border-radius:12px;padding:9px 11px;margin:7px 0;font-size:.79rem;line-height:1.65;color:#d4c5ff;}
```

**Step 5: Commit**
```bash
git add claude-code-bible.html
git commit -m "style: CMD/코드/파일 블록 다크 Glass 스타일 적용"
```

---

### Task 8: Aurora Orb 배경 애니메이션 (JS)

**Files:**
- Modify: `claude-code-bible.html` — `<script>` 태그 시작 직후에 추가

**Step 1: `<script>` 태그 위치 확인**

```bash
grep -n "<script>" /Users/kimbyungkil/클로드/클로드명령어/claude-code-bible.html
```

**Step 2: `<style>` 블록 내에 keyframe 애니메이션 추가**

기존 `</style>` 바로 위 (line 159 `.footer` 뒤, `</style>` 앞)에 추가:
```css
/* AURORA ORBS */
@keyframes orbFloat1{0%{transform:translate(0,0) scale(1);}33%{transform:translate(80px,-60px) scale(1.1);}66%{transform:translate(-40px,80px) scale(.95);}100%{transform:translate(0,0) scale(1);}}
@keyframes orbFloat2{0%{transform:translate(0,0) scale(1);}33%{transform:translate(-90px,50px) scale(1.05);}66%{transform:translate(60px,-80px) scale(1.1);}100%{transform:translate(0,0) scale(1);}}
@keyframes orbFloat3{0%{transform:translate(0,0) scale(1);}50%{transform:translate(-50px,-50px) scale(1.08);}100%{transform:translate(0,0) scale(1);}}
.orb{position:fixed;border-radius:50%;pointer-events:none;z-index:0;mix-blend-mode:screen;}
@media(prefers-reduced-motion:reduce){.orb{animation:none!important;}}
```

**Step 3: `<script>` 블록 시작부에 Aurora Orb 삽입 JS 추가**

`<script>` 태그 바로 다음 줄 (현재 JS 코드 시작 전)에 아래 코드 삽입:
```javascript
// Aurora background orbs
(function(){
  var orbs=[
    {w:500,h:500,top:'5%',left:'10%',bg:'rgba(108,92,231,.32)',filter:'blur(90px)',anim:'orbFloat1 22s ease-in-out infinite'},
    {w:400,h:400,top:'40%',left:'60%',bg:'rgba(0,212,255,.2)',filter:'blur(80px)',anim:'orbFloat2 30s ease-in-out infinite'},
    {w:350,h:350,top:'70%',left:'30%',bg:'rgba(162,89,255,.18)',filter:'blur(70px)',anim:'orbFloat3 38s ease-in-out infinite'}
  ];
  orbs.forEach(function(o){
    var el=document.createElement('div');
    el.className='orb';
    el.style.cssText='width:'+o.w+'px;height:'+o.h+'px;top:'+o.top+';left:'+o.left+';background:'+o.bg+';filter:'+o.filter+';animation:'+o.anim+';';
    document.body.appendChild(el);
  });
})();
```

**Step 4: 모든 콘텐츠가 오브 위에 표시되는지 확인**

`body > *`에 `position:relative;z-index:1` 이 필요한지 확인:
- `.hdr`, `.srch`, `.tabs-wrap`, `.section`, `.footer` 에 `position:relative;z-index:1` 추가가 필요한 경우:
```css
.hdr,.srch,.tabs-wrap,.section,.footer{position:relative;z-index:1;}
```
이를 CSS 블록 끝 (`</style>` 앞)에 추가.

**Step 5: 브라우저 확인**
- 3개 오브가 천천히 움직이는지 확인
- 콘텐츠(탭, 카드 등)가 오브 위에 정상 표시되는지 확인

**Step 6: VS Code 진단 오류 0개 확인**
```bash
# VS Code에서 문제 패널 열어 확인 (Cmd+Shift+M)
# 목표: 0개 오류
```

**Step 7: Commit**
```bash
git add claude-code-bible.html
git commit -m "style: Aurora Orb 배경 애니메이션 추가"
```

---

### Task 9: Section Header & 기타 Polish

**Files:**
- Modify: `claude-code-bible.html:46-55` (`.sh` 섹션 헤더)
- Modify: `claude-code-bible.html:159` (`.footer`)

**Step 1: `.sh` 섹션 헤더 유리체화**

현재 (lines 47-52):
```css
.sh.c1{background:rgba(255,107,53,.09);border-left:4px solid var(--a1);}
.sh.c2{background:rgba(0,212,170,.09);border-left:4px solid var(--a2);}
...
```

`backdrop-filter` 추가 (각 `.sh.cN` 에 공통 적용):
`.sh` 기본 스타일 (line 46) 교체:
```css
.sh{display:flex;align-items:center;gap:10px;padding:12px 14px;border-radius:14px;margin-bottom:10px;backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);}
```

**Step 2: `.footer` 유리체화**

현재 (line 159):
```css
.footer{text-align:center;margin:28px 14px 0;color:var(--muted);font-size:.7rem;line-height:2;border-top:1px solid var(--border);padding-top:18px;}
```

교체 후:
```css
.footer{text-align:center;margin:28px 14px 0;color:var(--muted);font-size:.7rem;line-height:2;border-top:1px solid rgba(255,255,255,.07);padding-top:18px;position:relative;z-index:1;}
```

**Step 3: 전체 브라우저 최종 확인 체크리스트**

- [ ] Aurora 오브 3개 천천히 움직임
- [ ] 카드 backdrop-filter blur 적용됨 (카드 뒤로 오브가 흐릿하게 비침)
- [ ] 탭 sticky 스크롤 시 frosted glass
- [ ] 복사 버튼 호버 시 보라 glow
- [ ] 검색창 포커스 시 보라 ring
- [ ] 탭 전환 정상 동작
- [ ] 카드 아코디언 열기/닫기 정상
- [ ] 검색 기능 정상 (텍스트 하이라이트 등)
- [ ] 복사 버튼 클릭 후 "✓" 피드백 정상

**Step 4: 최종 Commit & Push**

```bash
git add claude-code-bible.html
git commit -m "style: Section 헤더/Footer 마무리 polish"
git push
```

---

## Summary

| Task | 변경 내용 | 예상 소요 |
|------|-----------|-----------|
| 1 | CSS 변수 + body 배경 | 5분 |
| 2 | 카드 Glassmorphism | 5분 |
| 3 | 탭 Frosted Glass | 5분 |
| 4 | 헤더 glass + 그라디언트 | 5분 |
| 5 | 복사 버튼 glow | 3분 |
| 6 | 검색 glass | 3분 |
| 7 | CMD/코드 블록 dark glass | 5분 |
| 8 | Aurora Orb JS | 8분 |
| 9 | 섹션 헤더 + Footer polish | 5분 |

총 변경 파일: `claude-code-bible.html` 1개
