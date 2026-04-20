# 아쿠아브릿지 배포 가이드

## 📁 최종 파일 구조

```
aquabridge/
├── index.html          ← 전체 사이트 (CSS + JS 인라인 포함, 이것 하나로 완결)
├── README.md           ← 프로젝트 설명
└── .nojekyll           ← GitHub Pages 빌드 오류 방지 (빈 파일)
```

> CSS와 JS가 모두 `index.html` 안에 인라인으로 포함되어 있습니다.
> 외부 의존성은 XLSX 라이브러리 CDN 1개뿐입니다.

---

## 🚀 배포 방법 3가지

### 방법 1 — GitHub Pages (무료, 권장)

```bash
# 1. 폴더 생성 및 파일 저장
mkdir aquabridge
cd aquabridge

# index.html 파일을 아티팩트에서 복사하여 저장

# 2. Git 초기화
git init
git add .
git commit -m "first commit"

# 3. GitHub에 올리기
git remote add origin https://github.com/계정명/aquabridge.git
git push -u origin main

# 4. GitHub 저장소 → Settings → Pages
#    Source: Deploy from a branch → main → / (root) → Save
#
# 접속 주소: https://계정명.github.io/aquabridge
```

`.nojekyll` 파일 생성 (빈 파일, 필수):
```bash
touch .nojekyll
git add .nojekyll
git commit -m "add nojekyll"
git push
```

---

### 방법 2 — Netlify Drop (가장 빠름, 30초 배포)

1. [netlify.com/drop](https://app.netlify.com/drop) 접속
2. `index.html` 파일을 드래그 앤 드롭
3. 즉시 `https://random-name.netlify.app` 주소 발급
4. (선택) Site settings → Change site name 으로 도메인 변경

---

### 방법 3 — Vercel (무료)

```bash
npm i -g vercel
cd aquabridge
vercel

# 설정 물음에 모두 Enter (기본값)
# 배포 완료 후 주소 제공됨
```

---

## 📋 배포 전 체크리스트

| 항목 | 확인 |
|------|------|
| `index.html` 저장 완료 | ☐ |
| 아티팩트에서 전체 코드 복사 | ☐ |
| `.nojekyll` 파일 생성 (GitHub Pages만) | ☐ |
| XLSX CDN 인터넷 연결 필요 확인 | ☐ |
| Anthropic API 키 필요 여부 확인 | ☐ |

---

## ⚠️ API 키 관련 중요 사항

현재 코드는 **Anthropic API를 브라우저에서 직접 호출**합니다.
실제 서비스 배포 시에는 반드시 **백엔드 프록시** 구성이 필요합니다.

```
현재 구조 (개발용):
브라우저 → Anthropic API 직접 호출 (API 키 노출 위험)

권장 구조 (실서비스):
브라우저 → 내 서버(Node.js/Python) → Anthropic API
```

### 임시 해결 (개인/데모용):
현재 claude.ai 아티팩트 내에서만 실행 시 API 키가 자동 처리됩니다.
독립 배포 시 AI 기능(문장 생성, 글쓰기 도우미)은 별도 백엔드 없이는 동작하지 않습니다.

---

## 📦 README.md 내용 예시

```markdown
# 아쿠아브릿지 (AquaBridge)

청각장애인과 청인을 연결하는 AI 기반 디지털 플랫폼

## 주요 기능
- AI 문장 생성 서비스
- 글쓰기 도우미 (가독성 향상 검토기)
- 비영리단체 회계 검토 프로그램
- 수어 커뮤니티 플랫폼

## 배포
GitHub Pages / Netlify / Vercel 정적 호스팅

## 기술 스택
- HTML5 / CSS3 / Vanilla JavaScript
- SheetJS (XLSX 처리)
- Anthropic Claude API (AI 기능)
```

---

## 🔧 도메인 연결 (선택)

### GitHub Pages에 커스텀 도메인 연결:
1. 도메인 구매 (가비아, 후이즈 등)
2. DNS A 레코드 설정:
   ```
   185.199.108.153
   185.199.109.153
   185.199.110.153
   185.199.111.153
   ```
3. GitHub 저장소 → Settings → Pages → Custom domain 입력
4. `CNAME` 파일 생성 (루트에):
   ```
   aquabridge.kr
   ```

---

## 📱 모바일 성능 최적화 (현재 적용됨)

- SVG 파티클 애니메이션 제거 ✅
- 인트로 CSS transform 제거 (opacity만 사용) ✅  
- 외부 리소스: XLSX CDN 1개만 ✅
- 인트로 시간 2.8초로 단축 ✅
