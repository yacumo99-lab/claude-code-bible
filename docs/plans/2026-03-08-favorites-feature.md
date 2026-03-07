# 즐겨찾기 기능 구현 계획

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 자주 쓰는 명령어를 ⭐ 버튼으로 저장하고 상단 고정 패널에서 빠르게 복사/관리할 수 있게 한다.

**Architecture:** 단일 HTML 파일에 CSS + HTML 패널 + JS 함수 추가. `.cmd` 요소가 159개라 HTML을 하나씩 수정하지 않고, JS 로드 시 동적으로 ⭐ 버튼을 주입한다. localStorage로 영구 저장. 보안: innerHTML 대신 DOM 메서드로 패널 렌더링.

**Tech Stack:** Vanilla HTML/CSS/JS, localStorage

---

## Task 1: CSS — 즐겨찾기 패널 및 버튼 스타일

**Files:**
- Modify: `claude-code-bible.html:89` (`.cpb:active` 스타일 바로 뒤에 추가)

**Step 1: `.cpb:active` 위치 확인**

`claude-code-bible.html` lines 84~95 읽기

**Step 2: `.cpb:active` 다음 줄에 아래 CSS 삽입**

```css
/* FAVORITES */
.fav-wrap{padding:0 12px;margin-bottom:4px;}
.fav-panel{background:rgba(255,190,11,.06);border:1px solid rgba(255,190,11,.2);border-radius:12px;overflow:hidden;}
.fav-hdr{display:flex;align-items:center;justify-content:space-between;padding:8px 12px;cursor:pointer;user-select:none;-webkit-user-select:none;}
.fav-hdr .fav-title{font-size:.78rem;font-weight:700;color:#ffbe0b;}
.fav-toggle-icon{font-size:.7rem;color:var(--muted);}
.fav-body{padding:4px 10px 8px;}
.fav-item{display:flex;align-items:center;gap:6px;padding:5px 0;border-bottom:1px solid rgba(255,255,255,.05);}
.fav-item:last-child{border-bottom:none;}
.fav-cmd{font-family:'Menlo','Monaco','Courier New',monospace;font-size:.72rem;color:#c8f7e4;flex:1;word-break:break-all;}
.fav-cpb{background:rgba(108,92,231,.25);border:1px solid rgba(108,92,231,.4);border-radius:6px;color:#c5b0ff;font-size:.63rem;padding:2px 8px;cursor:pointer;font-family:inherit;flex-shrink:0;transition:all .2s;}
.fav-cpb:hover{background:rgba(108,92,231,.5);color:#fff;}
.fav-rm{background:rgba(255,77,141,.12);border:1px solid rgba(255,77,141,.28);border-radius:6px;color:#ff8ab5;font-size:.63rem;padding:2px 7px;cursor:pointer;font-family:inherit;flex-shrink:0;transition:all .2s;}
.fav-rm:hover{background:rgba(255,77,141,.35);color:#fff;}
.favb{background:transparent;border:none;font-size:.85rem;cursor:pointer;padding:0 2px;line-height:1;opacity:.4;transition:opacity .2s,transform .15s;flex-shrink:0;}
.favb:hover{opacity:1;}
.favb.on{opacity:1;transform:scale(1.15);}
```

**Step 3: 커밋하지 않음** (Task 2와 묶어서 커밋)

---

## Task 2: HTML — 즐겨찾기 패널 div 추가

**Files:**
- Modify: `claude-code-bible.html` (`.tabs-wrap` 닫히는 `</div></div>` 바로 뒤)

**Step 1: 탭바 닫는 위치 확인**

lines 205~232 읽기 → `</div></div>` 로 끝나는 `.tabs-wrap` 위치 파악

**Step 2: `.tabs-wrap` 닫는 태그 바로 뒤에 삽입**

```html

<!-- FAVORITES PANEL -->
<div class="fav-wrap" id="fav-wrap" style="display:none">
  <div class="fav-panel">
    <div class="fav-hdr" onclick="toggleFavPanel()">
      <span class="fav-title">⭐ 즐겨찾기</span>
      <span class="fav-toggle-icon" id="fav-toggle-icon">▲</span>
    </div>
    <div class="fav-body" id="fav-body"></div>
  </div>
</div>
```

**Step 3: 커밋**

```bash
cd "/Users/kimbyungkil/클로드/클로드명령어"
git add claude-code-bible.html
git commit -m "feat: 즐겨찾기 CSS 및 패널 HTML 추가"
```

---

## Task 3: JS — 즐겨찾기 함수 추가 및 페이지 로드 연결

**Files:**
- Modify: `claude-code-bible.html` (script 블록, `function showTab` 바로 위)

**Step 1: `function showTab` 위치 확인**

lines 2520~2540 읽기

**Step 2: `function showTab` 바로 위에 아래 JS 블록 삽입**

보안 주의: `renderFavPanel`은 innerHTML 대신 DOM 메서드로 구현함 (XSS 방지)

```javascript
// ── FAVORITES ──────────────────────────────
const FAV_KEY='bible-favs';
let _favOpen=true;

function _getFavs(){try{return JSON.parse(localStorage.getItem(FAV_KEY)||'[]');}catch(e){return[];}}
function _saveFavs(a){localStorage.setItem(FAV_KEY,JSON.stringify(a));}

function loadFavs(){
  document.querySelectorAll('.cmd').forEach(div=>{
    const cpb=div.querySelector('[data-cmd]');
    if(!cpb||div.querySelector('.favb'))return;
    const cmd=cpb.dataset.cmd;
    const b=document.createElement('button');
    b.className='favb';
    b.dataset.cmd=cmd;
    b.textContent='⭐';
    b.setAttribute('aria-label','즐겨찾기');
    b.addEventListener('click',()=>toggleFav(b));
    div.appendChild(b);
  });
  renderFavPanel();
}

function toggleFav(btn){
  const cmd=btn.dataset.cmd;
  const favs=_getFavs();
  const idx=favs.indexOf(cmd);
  if(idx===-1){favs.push(cmd);}else{favs.splice(idx,1);}
  _saveFavs(favs);
  renderFavPanel();
  _syncFavBtns();
}

function removeFav(cmd){
  _saveFavs(_getFavs().filter(c=>c!==cmd));
  renderFavPanel();
  _syncFavBtns();
}

function _syncFavBtns(){
  const favs=_getFavs();
  document.querySelectorAll('.favb').forEach(b=>{
    const on=favs.includes(b.dataset.cmd);
    b.textContent=on?'★':'⭐';
    b.classList.toggle('on',on);
  });
}

function renderFavPanel(){
  const favs=_getFavs();
  const wrap=document.getElementById('fav-wrap');
  const body=document.getElementById('fav-body');
  if(!wrap||!body)return;
  wrap.style.display=favs.length?'':'none';
  // DOM 메서드로 안전하게 렌더 (XSS 방지)
  body.textContent='';
  favs.forEach(cmd=>{
    const row=document.createElement('div');
    row.className='fav-item';

    const label=document.createElement('span');
    label.className='fav-cmd';
    label.textContent=cmd;

    const cpBtn=document.createElement('button');
    cpBtn.className='fav-cpb';
    cpBtn.textContent='복사';
    cpBtn.addEventListener('click',()=>cpFav(cmd));

    const rmBtn=document.createElement('button');
    rmBtn.className='fav-rm';
    rmBtn.textContent='✕';
    rmBtn.addEventListener('click',()=>removeFav(cmd));

    row.appendChild(label);
    row.appendChild(cpBtn);
    row.appendChild(rmBtn);
    body.appendChild(row);
  });
  _syncFavBtns();
}

function cpFav(txt){
  if(navigator.clipboard&&window.isSecureContext){
    navigator.clipboard.writeText(txt).catch(()=>_cpFavFallback(txt));
  }else{_cpFavFallback(txt);}
}
function _cpFavFallback(txt){
  const t=document.createElement('textarea');
  t.value=txt;t.style.cssText='position:fixed;opacity:0';
  document.body.appendChild(t);t.focus();t.select();
  let ok=false;try{ok=document.execCommand('copy');}catch(e){}
  document.body.removeChild(t);
  return ok;
}

function toggleFavPanel(){
  _favOpen=!_favOpen;
  const body=document.getElementById('fav-body');
  const icon=document.getElementById('fav-toggle-icon');
  if(body)body.style.display=_favOpen?'':'none';
  if(icon)icon.textContent=_favOpen?'▲':'▼';
}
// ───────────────────────────────────────────
```

**Step 3: `window.addEventListener('load', loadFavs)` 추가**

script 블록 맨 끝 (`</script>` 바로 위)에 추가:

```javascript
window.addEventListener('load', loadFavs);
```

**Step 4: 동작 확인**

1. 임의 명령어 줄 오른쪽에 ⭐ 버튼 보이는지
2. ⭐ 클릭 → ★로 변하고 상단 패널에 항목 추가되는지
3. 패널의 ✕ 클릭 → 제거되고 원본 ★가 ⭐로 돌아가는지
4. 패널 헤더 클릭 → 접기/펼치기 동작하는지
5. 페이지 새로고침 후 즐겨찾기 유지되는지

**Step 5: 커밋**

```bash
git add claude-code-bible.html
git commit -m "feat: 즐겨찾기 JS 추가 (⭐ 버튼 동적 주입, localStorage 저장)"
```

---

## Task 4: index.html 동기화 및 최종 푸시

**Step 1: 동기화**

```bash
cd "/Users/kimbyungkil/클로드/클로드명령어"
cp claude-code-bible.html index.html
```

**Step 2: diff 확인**

```bash
diff claude-code-bible.html index.html
# 출력 없으면 동일 (정상)
```

**Step 3: 커밋 및 푸시**

```bash
git add index.html
git commit -m "chore: index.html 동기화 (즐겨찾기 기능 반영)"
git push
```

---

## 구현 완료 기준

- [ ] 모든 `.cmd` 줄 오른쪽에 ⭐ 버튼 표시
- [ ] ⭐ 클릭 → ★ 변환 + 패널에 추가
- [ ] ★ 클릭 → ⭐ 복귀 + 패널에서 제거
- [ ] 패널의 [복사] 버튼 → 클립보드 복사 동작
- [ ] 패널의 [✕] 버튼 → 즐겨찾기 제거 + 원본 버튼 동기화
- [ ] 패널 헤더 클릭으로 접기/펼치기
- [ ] 페이지 새로고침 후 즐겨찾기 유지 (localStorage)
- [ ] 즐겨찾기 없을 때 패널 숨김
