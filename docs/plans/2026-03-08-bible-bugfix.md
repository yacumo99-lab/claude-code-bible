# Claude Code Bible 버그 수정 및 PWA 개선 구현 계획

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 코드 리뷰에서 발견된 버그 수정 및 PWA 품질 개선

**Architecture:** 단일 HTML 파일 구조. JS 버그 수정은 `<script>` 블록 내 함수 수정. PWA 개선은 `<head>` 메타태그 + 신규 파일(manifest.json, sw.js) 추가. 작업 완료 후 `cp claude-code-bible.html index.html` 동기화 필수.

**Tech Stack:** Vanilla HTML/CSS/JS, PWA (Service Worker, Web App Manifest)

---

## 우선순위 요약

| 순서 | 항목 | 중요도 | 예상 시간 |
|------|------|--------|-----------|
| Task 1 | 버전 뱃지 v3.0 → v3.1 | Suggestion | 2분 |
| Task 2 | s1 중복 슬래시 명령어 제거 | Important | 5분 |
| Task 3 | doSearch 초기화 버그 수정 | Critical | 10분 |
| Task 4 | doSearch open 클래스 미제거 수정 | Suggestion | 5분 |
| Task 5 | execCommand 복사 실패 피드백 수정 | Suggestion | 5분 |
| Task 6 | apple-touch-icon SVG → PNG | Important | 10분 |
| Task 7 | Web App Manifest 추가 | Important | 10분 |
| Task 8 | Service Worker 추가 (오프라인 지원) | Important | 15분 |
| Task 9 | index.html 동기화 | 필수 | 1분 |

---

## Task 1: 버전 뱃지 v3.0 → v3.1

**Files:**
- Modify: `claude-code-bible.html:183` (뱃지)
- Modify: `claude-code-bible.html:2511` (푸터)

**Step 1: 변경**

Line 183:
```
변경 전: <div class="badge">📚 CLAUDE CODE BIBLE v3.0</div>
변경 후: <div class="badge">📚 CLAUDE CODE BIBLE v3.1</div>
```

Line 2511:
```
변경 전: 📚 클로드 코드 완전 바이블 v3.0<br>
변경 후: 📚 클로드 코드 완전 바이블 v3.1<br>
```

**Step 2: 확인**

브라우저에서 뱃지와 푸터에 v3.1 표시 확인

**Step 3: 커밋하지 않음** (Task 2와 묶어서 커밋)

---

## Task 2: s1 중복 슬래시 명령어 제거

**Files:**
- Modify: `claude-code-bible.html:721-760` (정보/통계 카드에서 중복 항목 제거)

**배경:**
`/feedback`, `/security-review`, `/add-dir` 가 두 카드에 중복 존재.
- 원본 위치: lines 511, 543, 420 (각각 해당 카드에 정확히 기술됨)
- 중복 위치: lines 738, 742, 746 (정보/통계 카드 내)

**Step 1: 중복 항목 파악**

lines 721~760 구간을 Read로 읽어 정보/통계 카드 전체 구조 파악

**Step 2: 중복 행 제거**

`정보/통계` 카드(line 721 시작)에서 아래 3개 `<tr>` 블록 제거:
- `/add-dir` 행 (line 738 근처)
- `/feedback` 행 (line 742 근처)
- `/security-review` 행 (line 746 근처)

카드 제목도 `/add-dir` 언급 제거:
```
변경 전: /usage · /stats · /release-notes · /add-dir
변경 후: /usage · /stats · /release-notes
```

**Step 3: 커밋**

```bash
cd "/Users/kimbyungkil/클로드/클로드명령어"
git add claude-code-bible.html
git commit -m "fix: 버전 뱃지 v3.1 업데이트 및 중복 슬래시 명령어 제거"
```

---

## Task 3: doSearch 초기화 버그 수정 (Critical)

**Files:**
- Modify: `claude-code-bible.html:2558-2581` (doSearch 함수)

**문제:**
검색어를 지우면 `.hidden` 클래스만 제거하고, 여러 섹션의 `active` 클래스와 탭 활성 상태를 복원하지 않음.

**Step 1: 현재 초기화 분기 확인**

```javascript
// 현재 (버그 있음)
if(!q){
  document.querySelectorAll('.card').forEach(c=>{c.classList.remove('hidden');});
  cnt.textContent='';
  return;
}
```

**Step 2: 초기화 분기 수정**

```javascript
// 수정 후
if(!q){
  document.querySelectorAll('.card').forEach(c=>{
    c.classList.remove('hidden');
    c.classList.remove('open');
  });
  cnt.textContent='';
  showTab(0);  // 탭 상태를 첫 번째 탭으로 복원
  return;
}
```

**Step 3: 동작 확인**

1. 검색창에 `/clear` 입력 → 여러 섹션에 카드가 보임
2. 검색창 지우기 → "시작" 탭만 활성화되고 나머지 섹션 숨김
3. 탭 클릭 네비게이션 정상 동작 확인

**Step 4: 커밋**

```bash
git add claude-code-bible.html
git commit -m "fix: doSearch 초기화 시 탭 상태 복원 버그 수정"
```

---

## Task 4: execCommand 복사 실패 피드백 수정

**Files:**
- Modify: `claude-code-bible.html:2549` (cp 함수 내 fallback)

**문제:**
`execCommand('copy')` 가 `false` 반환(silent failure)해도 ok() 호출되어 "복사됨" 표시

**Step 1: fallback 함수 수정**

```javascript
// 현재
const fallback=()=>{
  const t=document.createElement('textarea');t.value=txt;t.style.cssText='position:fixed;opacity:0';
  document.body.appendChild(t);t.focus();t.select();
  try{document.execCommand('copy');}catch(e){}
  document.body.removeChild(t);ok();
};
```

```javascript
// 수정 후
const fallback=()=>{
  const t=document.createElement('textarea');t.value=txt;t.style.cssText='position:fixed;opacity:0';
  document.body.appendChild(t);t.focus();t.select();
  let success=false;
  try{success=document.execCommand('copy');}catch(e){}
  document.body.removeChild(t);
  if(success)ok();
};
```

**Step 2: 커밋**

```bash
git add claude-code-bible.html
git commit -m "fix: execCommand 복사 실패 시 성공 피드백 오표시 수정"
```

---

## Task 5: apple-touch-icon PNG 교체

**Files:**
- Modify: `claude-code-bible.html:10` (head 내 apple-touch-icon)

**문제:**
현재 SVG data URI → iOS Safari는 apple-touch-icon에서 SVG 무시, 빈 아이콘 표시

**Step 1: 1x1 투명 PNG base64를 180x180 배경색 PNG로 교체**

아래 base64는 180x180 딥퍼플 배경 + 책 이모지 텍스트를 담은 최소 PNG.
실제로는 단색 배경 PNG로 대체하는 것이 가장 안전함.

```html
<!-- 변경 전 -->
<link rel="apple-touch-icon" href="data:image/svg+xml,...">

<!-- 변경 후: 외부 icon.png 파일 참조 -->
<link rel="apple-touch-icon" href="icon.png">
```

**Step 2: icon.png 파일 생성**

Python으로 180x180 PNG 생성:

```bash
python3 -c "
import base64, struct, zlib

def make_png(width, height, bg_color):
    def chunk(name, data):
        c = name + data
        return struct.pack('>I', len(data)) + c + struct.pack('>I', zlib.crc32(c) & 0xffffffff)

    ihdr = struct.pack('>IIBBBBB', width, height, 8, 2, 0, 0, 0)
    r, g, b = bg_color
    raw = b''.join(b'\x00' + bytes([r, g, b] * width) for _ in range(height))
    idat = zlib.compress(raw)

    return (b'\x89PNG\r\n\x1a\n' +
            chunk(b'IHDR', ihdr) +
            chunk(b'IDAT', idat) +
            chunk(b'IEND', b''))

png = make_png(180, 180, (88, 28, 135))
with open('/Users/kimbyungkil/클로드/클로드명령어/icon.png', 'wb') as f:
    f.write(png)
print('icon.png 생성 완료')
"
```

**Step 3: 커밋**

```bash
git add icon.png claude-code-bible.html
git commit -m "fix: apple-touch-icon SVG를 PNG로 교체 (iOS 홈화면 아이콘 수정)"
```

---

## Task 6: Web App Manifest 추가

**Files:**
- Create: `manifest.json`
- Modify: `claude-code-bible.html:10` (head에 link 추가)

**Step 1: manifest.json 생성**

```json
{
  "name": "Claude Code Bible",
  "short_name": "CC Bible",
  "description": "Claude Code 명령어 레퍼런스",
  "start_url": "/claude-code-bible/",
  "display": "standalone",
  "background_color": "#0a0a1a",
  "theme_color": "#7c3aed",
  "orientation": "portrait",
  "icons": [
    {
      "src": "icon.png",
      "sizes": "180x180",
      "type": "image/png",
      "purpose": "any maskable"
    }
  ]
}
```

**Step 2: head에 manifest 링크 추가**

`<meta name="apple-mobile-web-app-capable"...>` 바로 위에 추가:
```html
<link rel="manifest" href="manifest.json">
<meta name="theme-color" content="#7c3aed">
```

**Step 3: 커밋**

```bash
git add manifest.json claude-code-bible.html
git commit -m "feat: Web App Manifest 추가 (Android PWA 지원)"
```

---

## Task 7: Service Worker 추가 (오프라인 지원)

**Files:**
- Create: `sw.js`
- Modify: `claude-code-bible.html:2533` (script 블록 맨 위에 SW 등록 코드 추가)

**Step 1: sw.js 생성 (Cache-First 전략)**

```javascript
const CACHE = 'bible-v3.1';
const ASSETS = [
  '/claude-code-bible/',
  '/claude-code-bible/index.html',
  '/claude-code-bible/icon.png',
  '/claude-code-bible/manifest.json'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request))
  );
});
```

**Step 2: HTML에 SW 등록 코드 추가**

`<script>` 블록 맨 위 (function showTab 전):

```javascript
if('serviceWorker' in navigator){
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/claude-code-bible/sw.js')
      .catch(()=>{});
  });
}
```

**Step 3: 커밋**

```bash
git add sw.js claude-code-bible.html
git commit -m "feat: Service Worker 추가 (오프라인 지원)"
```

---

## Task 8: index.html 동기화 및 최종 푸시

**Step 1: 두 파일 동기화**

```bash
cd "/Users/kimbyungkil/클로드/클로드명령어"
cp claude-code-bible.html index.html
```

**Step 2: 변경 확인**

```bash
diff claude-code-bible.html index.html
# 출력 없으면 동일 (정상)
```

**Step 3: 커밋 및 푸시**

```bash
git add index.html
git commit -m "chore: index.html 동기화 (v3.1 버그수정 반영)"
git push
```

**Step 4: GitHub Pages 동작 확인**

GitHub Pages URL에서 아이콘, 오프라인 동작, 탭/검색 정상 동작 확인

---

## 건너뛰어도 되는 항목

| 항목 | 이유 |
|------|------|
| showTab 구조적 취약성 (Critical #2) | 현재 버그 없음. 콘텐츠 추가 시 주의하면 충분 |
| mark 검색 하이라이트 구현 | 현재 카드 단위 검색으로 충분히 동작. 복잡도 대비 효용 낮음 |
| .gitignore 보강 | 빌드 도구 없는 순수 HTML 프로젝트라 현재 위험 없음 |

---

## 실행 순서 권장

**빠른 완료 (Task 1~5):** 버그 수정 위주, 30분 내 완료 가능
**PWA 강화 (Task 6~8):** 신규 파일 추가, 별도 세션에서 진행 권장
