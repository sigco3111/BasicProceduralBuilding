# 🏢 BasicProceduralBuilding — 절차적 빌딩 컨피규레이터

**Three.js + TypeScript** 기반의 **절차적 빌딩 컨피규레이터** 입니다. Blender의 Geometry Nodes 그래프에서 포팅된 배치 로직이 동일한 시드로 인스턴스 단위까지 동일한 결과를 보장하며, 스타일라이즈드 디오라마 환경과 풀 날씨 시스템(눈/비)을 포함합니다.

---

## 🔗 링크

| 항목 | URL |
|---|---|
| 🌐 **라이브 데모** | **<https://sigco3111.github.io/BasicProceduralBuilding>** |
| 📦 **이 저장소 (한국어 fork)** | <https://github.com/sigco3111/BasicProceduralBuilding> |
| ⭐ **원본 저장소 (출처)** | <https://github.com/achrefelouafi/BasicProceduralBuilding> |

> 본 저장소는 [achrefelouafi/BasicProceduralBuilding](https://github.com/achrefelouafi/BasicProceduralBuilding) 의 **한국어 fork** 입니다. 원본의 모든 핵심 코드(Geometry Nodes 포팅, 디오라마, 눈/비 셰이더)와 라이선스(MIT)를 그대로 보존하면서 사용자 인터페이스만 한글로 번역·개선했습니다.

---

## ✨ 라이브 데모 둘러보기

브라우저에서 **<https://sigco3111.github.io/BasicProceduralBuilding>** 을 열면 즉시 절차적 빌딩을 만날 수 있습니다.

**조작 방법**

- 🖱️ **드래그** — 카메라 궤도 회전
- 🖲️ **스크롤** — 줌 인/아웃
- 🌐 **자동 궤도 회전** — 환경 폴더에서 켜기/속도 조절
- 🎛️ **우측 상단 GUI** — 빌딩 / 환경 / 시네마틱 / 눈 / 비 50개 이상 매개변수 실시간 조절

**5가지 핵심 기능**

| 기능 | 설명 |
|---|---|
| 🏢 **절차적 빌딩** | 너비/길이/높이/창문 시드/1층 스타일 슬라이더로 즉시 재구성 |
| 🌅 **3가지 시간대** | 황혼 시간 / 낮 / 밤 — 하늘·태양·안개·창문 발광·노출 한 번에 전환 |
| ❄️ **풀 눈 시스템** | 내리는 눈 (밀도/속도/크기/흔들림/바람) + 쌓인 눈 (범위/패치/반짝임) |
| 🌧️ **풀 비 시스템** | 내리는 비 + 젖음 효과 (웅덩이/물방울/물결/표면 어둠) |
| 🎬 **시네마틱 후처리** | 블룸 / 비네트 / 필름 그레인 / 색수차 / 채도 / 대비 |

---

## 📑 목차

1. [한국어판 추가 사항](#-한국어판-추가-사항)
2. [주요 기능 (Features)](#-주요-기능-features)
3. [빠른 시작 (Run)](#-빠른-시작-run)
4. [조작 방법 (Controls)](#-조작-방법-controls)
5. [렌더링 / 프로젝트 구조](#-렌더링--프로젝트-구조)
6. [한국어화 작업 노트](#-한국어화-작업-노트)
7. [Blender 툴링 (선택 사항)](#-blender-툴링-선택-사항)
8. [포트 검증 방법](#-포트-검증-방법)
9. [요구 사항 (Requirements)](#-요구-사항-requirements)
10. [원본 저장소 및 크레딧](#-원본-저장소-및-크레딧)
11. [라이선스](#-라이선스)

---

## 🎌 한국어판 추가 사항

> sigco3111 본 fork에서만 제공하는 한국어 사용자를 위한 개선 사항입니다.

- **🈶 완전 한글 GUI** — 우측 상단 lil-gui 패널의 폴더 9개, 컨트롤 50+, 3가지 시간대 프리셋 모두 자연스러운 한국어로 번역
- **🈶 한글 부트 화면** — `<html lang="ko">`, "에셋 키트 로딩 중…" 표시
- **🔄 이중 언어 지원** — `src/i18n.ts` 모듈로 한국어 / 영어 토글 가능 (`setLanguage('en')` 호출)
- **🛡️ 식별자 침투 0건** — 함수명 / 변수명 / TypeScript 타입 / 셰이더 유니폼은 원본 그대로 보존 (예: `PresetName` 유니온 타입, `groundStyle` 타입, `uTime`, `getWorldPosition` 등 망가짐 없음)
- **✅ TypeScript 빌드 통과** — `tsc --noEmit` 타입 체크 + `vite build` 둘 다 통과, 725KB / 186KB gzip
- **🚀 Vercel 프로덕션 배포** — `<https://sigco3111.github.io/BasicProceduralBuilding>` (CDN, 자동 HTTPS)

### 한국어화 번역 매핑 예시

| 원본 (영문) | 한국어판 |
|---|---|
| building configurator | 빌딩 컨피규레이터 |
| building | 빌딩 |
| environment | 환경 |
| cinematic | 시네마틱 |
| snow | 눈 |
| snowfall | 내리는 눈 |
| accumulation | 쌓인 눈 |
| rain | 비 |
| rainfall | 내리는 비 |
| wetness | 젖음 |
| width / length / height | 너비 / 길이 / 높이 |
| window seed | 창문 시드 |
| ground floor | 1층 스타일 |
| time of day | 시간대 |
| auto orbit | 자동 회전 |
| orbit speed | 회전 속도 |
| bloom / vignette / film grain | 블룸 / 비네트 / 필름 그레인 |
| chromatic aberration | 색수차 |
| golden hour | 황혼 시간 |
| day | 낮 |
| night | 밤 |
| 🎲 randomize seed | 🎲 시드 무작위화 |

---

## 🏗️ 주요 기능 (Features)

### 🏢 절차적 빌딩 (Building)

`Procedural Building.blend` 의 **"Geometry Nodes.002"** 그래프에서 TypeScript 로 포팅된 **인스턴스 단위 정확성** 보장:

- **5가지 슬라이더** — 너비 (2-30), 길이 (2-30), 높이 (2-30), 창문 시드 (0-100), 1층 스타일
- **3가지 1층 스타일** — 교차 (alternate, 기본), 문 (doors), 상점 창문 (shop windows)
- **`window1` / `window2` 선택** — Blender의 Random Value INT 노드와 비트-정확 일치하는 `BLI_hash_int_2d` 재구현 ([src/rng.ts](src/rng.ts))
- **자동 그리드 배치** — 외관은 1×1 셀 그리드: 최상단 행 → 지붕 림 (코너 피스), 마지막 열 → 코너 필러, 1층 행 → 교차하는 문/상점 창문, 나머지 → `window1`/`window2`

### 🌅 환경 (Environment)

스타일라이즈드 토이 디오라마 환경 — 텍스처나 외부 에셋 없이 전부 절차적으로 생성:

- **떠있는 베벨 페디스털** — 흙 측면 + 잔디 상단, 빌딩 크기에 맞춰 리사이즈, 푸른 광장 슬랩 + 연석
- **저폴리 소품** — 트리 (녹색 + 분홍 꽃), 부시, 청록색 가로등 (따뜻한 전구 포함)
- **그라데이션 하늘 돔** — 지평선/천정 mix + 태양 글로우 + 밤 별
- **3가지 시간대 프리셋** — 황혼 시간 (기본) / 낮 / 밤 — 각각 하늘, 안개, 태양/필/앰비언트, 떠다니는 구름, 가로등 글로우, 창문 발광 (밤에만 켜짐), 노출, 후처리 그레이드를 한 번에 전환

### ❄️ 눈 (Snow)

상호 배타적인 마스터 토글 + 두 개의 서브폴더:

- **내리는 눈 (snowfall)** — 밀도, 낙하 속도, 눈송이 크기, 흔들림, 불투명도, 색상, 낙하 높이, 바람 강도/방향
- **쌓인 눈 (accumulation)** — 범위, 패치 크기/부드러움, 높이 변화, 시드 X/Y, 평평함, 색상, 거칠기, 기복 강도/크기, 반짝임/반짝임 밀도, 🎲 시드 무작위화
- **셸 패스** — 빌딩의 지오메트리 + 인스턴스 버퍼를 공유 (추가 메모리 0) — 위쪽 면에만 표시

### 🌧️ 비 (Rain)

- **내리는 비 (rainfall)** — 밀도, 낙하 속도, 줄기 길이/너비, 불투명도, 색상, 낙하 높이, 바람 강도/방향
- **젖음 (wetness)** — 범위, 마스크 크기/부드러움, 높이 변화, 시드, 표면 젖음, 젖은 어둠, 반사 거칠기, 물방울 맺힘/밀도, 위쪽 웅덩이, 평평함, 물결 강도/크기/속도/밀도
- **인플레이스 주입** — `onBeforeCompile` 으로 모든 빌딩 + 지면 머티리얼에 젖음 셰이더 주입 (추가 지오메트리 0) — 월드 업 기준
- **디오라마도 풀 타깃** — 비는 광장과 잔디에 광택 웅덩이를 남김

### 🎬 시네마틱 후처리

`[src/postfx.ts](src/postfx.ts)` — 블룸 → 톤매핑 → 필름 그레이드 (비네트, 애니메이션 그레인, 색수차, 채도/대비) — 모두 환경 ▸ 시네마틱 폴더에서 조절

---

## 🚀 빠른 시작 (Run)

### 필요 환경

- **Node.js** 18 이상
- **pnpm** (권장) 또는 npm

### 설치 + 개발 서버

```bash
# 의존성 설치
pnpm install

# 개발 서버 (http://localhost:5173)
pnpm dev
```

### 프로덕션 빌드

```bash
pnpm build      # tsc --noEmit && vite build → dist/
pnpm preview    # dist/ 로컬 미리보기
```

### 빌드 결과

```
dist/index.html                  1.04 kB │ gzip:   0.63 kB
dist/assets/index-8CAmEy3_.js  725.04 kB │ gzip: 185.77 kB
✓ built in 131ms
```

---

## 🎮 조작 방법 (Controls)

| 조작 | 동작 |
|---|---|
| 🖱️ **드래그** | 카메라 궤도 회전 |
| 🖲️ **스크롤** | 줌 인/아웃 |
| 🖱️ **우클릭 드래그 / 두 손가락 드래그** | 팬 |
| 🌐 **자동 궤도 회전** | 환경 폴더 토글 |
| 🎛️ **우측 상단 GUI** | 빌딩/환경/시네마틱/눈/비 50개+ 매개변수 실시간 조절 |

---

## 🏛️ 렌더링 / 프로젝트 구조

```
index.html            부트 화면, 캔버스
public/
  assets/kit.glb      Blender에서 익스포트된 파트 메시 (문, 창문, 필러, 지붕 등)
src/
  main.ts             렌더러, 카메라, 컨트롤, GUI, 빌드 재생성 로직
  i18n.ts             🆕 한국어 / 영어 이중 언어 모듈 (sigco3111 fork)
  environment.ts      스타일라이즈드 디오라마 + 시간대 프리셋
  generator.ts        Blender Z-up 행렬 방출, 1×1 셀 그리드 배치
  kit.ts              파트 메시 인스턴싱 (InstancedMesh per mesh/material)
  params.ts           빌딩 매개변수 타입 + 기본값
  postfx.ts           시네마틱 후처리 (블룸 → 톤매핑 → 그레이드)
  rng.ts              BLI_hash_int_2d 비트-정확 재구현
  snow.ts             떨어지는 눈송이 (월드 스페이스)
  snowAccum.ts        셸 패스 — 빌딩 지오메트리 위에 눈 누적
  rain.ts             떨어지는 빗줄기 (월드 스페이스)
  wet.ts              인플레이스 젖음 셰이더 (onBeforeCompile)
tools/
  export_kit.py       Blender에서 kit.glb 재익스포트
  dump_blend.py       노드 그래프를 JSON 으로 덤프
  dump_instances.py   특정 W/L/H 의 evaluated 인스턴스 덤프 (ground truth)
  verify_placements.mjs   빌드 산출물이 Blender depsgraph 와 일치하는지 검증
  screenshot.mjs      Playwright 스크린샷
```

---

## 🈂️ 한국어화 작업 노트

> sigco3111 본 fork 에서 진행한 한국어화의 디자인 결정과 안전 검증.

### 1️⃣ 이중 언어 모듈 (`src/i18n.ts`)

- **66개 키** — GUI 폴더 9개 + 컨트롤 50+ + 부트 + 프리셋 3종 + 1층 옵션 3종
- `KO` 객체 (한국어) + `EN` 객체 (영어 미러) + `setLanguage()` 함수 (TypeScript 타입 안전)
- 기본값은 한국어 (`current = KO`) — 한국 사용자가 즉시 한글로 시작
- `t(key)` 가 안전한 폴백 제공 — 키가 없으면 EN → 마지막으로 키 자체 반환

### 2️⃣ TypeScript 유니온 타입은 그대로 보존

가장 까다로운 부분: `PresetName = "golden hour" | "day" | "night"` 와 `groundStyle: "alternate" | "doors" | "shop windows"` 같은 **TypeScript 유니온 타입** 은 함수 시그니처와 타입 좁히기에서 사용되므로 변경하면 빌드가 깨집니다. 따라서 **내부 키는 그대로 보존** 하고 **GUI 표시 이름만** `t()` 로 분리:

```typescript
// ✅ 안전한 패턴 — 내부 키 + 표시 이름 분리
fEnv.add(envState, "preset", ["golden hour", "day", "night"] as PresetName[])
   .name(t("timeOfDay"));   // ← "시간대"
```

### 3️⃣ 식별자 침투 0건 — 안전 검증

자동 영→한 매핑이 식별자 내부에 침투하는 위험을 방지하기 위해:

- `i18n.ts` 의 KO 값은 **문자열 리터럴에만** 위치
- 함수/변수/유니폼/속성 이름 + **TypeScript 타입 리터럴**은 **원본 그대로 보존**
- 검증 방법: 빌드된 bundle 에서 `\b[a-zA-Z_$]+[가-힣]+...` 패턴 매치 → **0건**

### 4️⃣ `noUnusedLocals` 회피

TypeScript `tsconfig` 의 `noUnusedLocals: true` 때문에 import만 하고 사용 안 하면 빌드 실패. `setLanguage` 를 직접 호출 안 하면 unused 가 되어 제거:

```typescript
// ✅ 안전
import { t } from "./i18n";

// ❌ 빌드 실패 (noUnusedLocals)
// import { t, setLanguage } from "./i18n";
```

### 5️⃣ 정적 HTML 한글로 선박힘

`<html lang="ko">`, 부트 로딩 문구를 빌드 전 `index.html` 에 직접 한글 박음 — Three.js 로딩 1~3초 동안 사용자에게 빈 페이지가 보이지 않도록.

### 6️⃣ Vercel 자동 도메인 사용

CLI 가 준 첫 URL (`basicproceduralbuilding-cml7z29zd-...`) 은 Production Deployment Protection SSO 가드가 걸려 302 → 로그인 리다이렉트. **자동 할당된 production 도메인** (`sigco3111.github.io/BasicProceduralBuilding`) 은 보호 없음 — 일반 사용자 접근용.

---

## 🛠 Blender 툴링 (선택 사항)

> 다음 명령은 Blender Python 스크립트로 원본 .blend 파일을 조작합니다. 한국어 fork 의 빌드/배포에는 필요하지 않습니다 — 원작자가 원본 저장소에 함께 배포한 디버깅 도구입니다.

모든 명령은 프로젝트 루트에서 실행 (Windows PowerShell 또는 cmd). Blender 경로는 설치된 버전에 맞춰 조정하세요.

```powershell
# 파트 메시를 .blend 에서 수정한 후 에셋 키트 재익스포트
& "C:\Program Files\Blender Foundation\Blender 5.0\blender.exe" --background "Procedural Building.blend" --python tools\export_kit.py -- public\assets\kit.glb

# 노드 그래프를 JSON 으로 덤프 (그래프 변경 사항 점검용)
& "C:\Program Files\Blender Foundation\Blender 5.0\blender.exe" --background "Procedural Building.blend" --python tools\dump_blend.py -- dump.json

# 특정 너비/길이/높이의 evaluated 인스턴스 덤프 (ground truth)
& "C:\Program Files\Blender Foundation\Blender 5.0\blender.exe" --background "Procedural Building.blend" --python tools\dump_instances.py -- inst.json 5 7 6
```

cmd.exe 에서는 선행 `&` 를 제거 (PowerShell 호출 연산자).

---

## ✅ 포트 검증 방법

재익스포트 또는 제너레이터 변경 후, 앱이 여전히 Blender 와 인스턴스 단위로 일치하는지 확인 (Chrome 필요):

```powershell
pnpm build
pnpm preview        # http://localhost:4173 에서 서빙, 유지
# 두 번째 터미널에서:
node tools\verify_placements.mjs http://localhost:4173 inst.json 5 7 6
```

`PLACEMENTS MATCH` 가 출력되면 모든 인스턴스의 위치, 회전, 창문 변형이 Blender 의 evaluated depsgraph 와 동일합니다.

---

## 💻 요구 사항 (Requirements)

- **WebGL2 지원 브라우저** (Chrome, Edge, Firefox, Safari 최신)
- 데스크톱 GPU 권장 (특히 볼류메트릭 셰이더 + PBR 라이팅)
- 저사양 하드웨어에서는 GUI 의 **눈 / 비 토글을 끄거나** Vite 빌드 시 `vite.config.js` 에서 `chunkSizeWarningLimit` 조정

---

## 🙏 원본 저장소 및 크레딧

> 본 프로젝트는 다음 원본 저장소의 한국어 fork 입니다. 모든 핵심 코드와 알고리즘은 원작자의 업적입니다.

- **원본 저장소**: <https://github.com/achrefelouafi/BasicProceduralBuilding>
- **원작자**: [@achrefelouafi](https://github.com/achrefelouafi)
- **원본 별점**: 20 ⭐
- **원본 라이선스**: MIT
- **원본 기술**: Blender Geometry Nodes 그래프 (`.blend` 파일) + Three.js + TypeScript 포팅

### 원본의 기술적 핵심 (참고)

> The following technical achievements are entirely the original author's work. The Korean fork only translates the user interface and deploys it to Vercel — every placement, every hash function, every shader is from the original codebase.

- **인스턴스 정확성** — 동일 시드에 대해 Blender depsgraph 와 인스턴스 단위 일치
- **`BLI_hash_int_2d` 비트-정확 재구현** — TypeScript 로 포팅한 Random Value INT
- **InstancedMesh per mesh/material** — 파트 메시 효율적 렌더링
- **스타일라이즈드 디오라마** — 텍스처 없는 절차적 페디스털 + 소품 + 하늘 돔 + 구름
- **눈 시스템** — 떨어지는 눈송이 + 셸 패스 누적 셰이더
- **비 시스템** — 떨어지는 빗줄기 + `onBeforeCompile` 인플레이스 젖음 셰이더
- **시네마틱 후처리** — 블룸 + 톤매핑 + 필름 그레이드
- **3가지 시간대 프리셋** — 황혼 시간 / 낮 / 밤
- **Playwright 검증 도구** — Chrome 으로 포트가 Blender depsgraph 와 일치하는지 자동 검증

---

## 📜 라이선스

본 저장소는 원본과 동일한 **MIT License** 하에 배포됩니다.

```
MIT License

Copyright (c) achrefelouafi (원본)
Copyright (c) sigco3111 (한국어 fork)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 🌐 한국어 fork 정보

| 항목 | 값 |
|---|---|
| **포크 시작일** | 2026-08-12 |
| **원본 HEAD** | (원본 저장소 마지막 커밋) |
| **한국어 fork HEAD** | `ae88054` (feat: 한글화 + i18n.ts) |
| **배포 플랫폼** | Vercel |
| **라이브 도메인** | <https://sigco3111.github.io/BasicProceduralBuilding> |

🏢 **즐거운 빌딩 컨피규레이션 되세요!**
