# Project Status: Fit & Mood (MoodFit)

> **최종 업데이트**: 2026-02-18 | **현재 버전**: v6.4

---

## 1. Feature Status Table

| 상태 | 기능명 | 관련 파일 | 개발 의도 (Rationale) |
|:---:|:---|:---:|:---|
| ✅ | **대시보드 (홈)** | `screens/Dashboard.tsx` | 사용자의 기분, 날씨, MBTI를 기반으로 한 직관적인 요약 화면 제공 |
| ✅ | **기분 선택기** | `screens/Dashboard.tsx` | 사용자의 감정 상태를 입력받아 추천 알고리즘의 변수로 활용 |
| ✅ | **개인화 진행률** | `screens/Dashboard.tsx` | 프로필 완성 유도를 위한 게이미피케이션 요소 |
| ✅ | **추천 엔진 (하이브리드)** | `services/engine.ts` | 로컬 데이터 우선 사용 후, 필요시 Gemini API로 확장하는 비용 효율적 구조 |
| ✅ | **식단 상세 (Diet)** | `screens/DietRecipe.tsx` | 레시피 정보, 영양 성분, 조리 순서 제공. (AI 냉장고 파먹기 진입점 포함) |
| ✅ | **스타일/운동 상세** | `screens/StyleWorkout.tsx` | 체형별 코디 제안 및 타겟 부위 운동 가이드 제공 |
| ✅ | **프로필 설정 v4.6** | `screens/ProfileSetup.tsx` | 사용자 검증 이미지로 고정된 신체/성향 정보 입력 화면 |
| ✅ | **하단 내비게이션** | `components/BottomNav.tsx` | 주요 탭(홈, 옷장, 식단, 프로필) 간의 빠른 이동 지원 |
| ✅ | **다국어 지원** | `i18n.ts`, `constants.ts` | 한국어/영어 전환 기능 및 데이터 분리, AI 프롬프트 제어 |
| ✅ | **리포트 다운로드 v5.1** | `screens/StyleWorkout.tsx` | 고화질 원본 이미지가 포함된 분석 리포트를 `.html` 파일로 다운로드 |
| ✅ | **AI 저장소 최적화 v5.1** | `services/geminiService.ts`, `App.tsx` | RAM/Disk 분리: 화면엔 고화질 유지, 저장소엔 압축본 저장 |
| ✅ | **AI 냉장고 파먹기 v5.2** | `screens/DietRecipe.tsx`, `App.tsx` | 재료 입력 모달 및 단일 레시피 생성 AI 파이프라인 구축 |
| ✅ | **API 초기화 수정 v5.3** | `services/geminiService.ts` | 함수 호출 시점에 API 키를 로드하도록 변경하여 '빈 키 요청' 문제 해결 |
| ✅ | **AI UX/UI 수정 v5.4** | `App.tsx`, `screens/DietRecipe.tsx` | AI 기본값 True, 냉장고 파먹기 배너 상시 노출 |
| ✅ | **리포트 핫픽스 v5.5** | `screens/StyleWorkout.tsx` | 다운로드 리포트에 조리 순서(Preparation Steps) 섹션 추가 |
| ✅ | **이미지 품질 상향 v5.6** | `services/geminiService.ts`, `constants.ts` | 저장용 압축 로직을 600px → 1024px로 상향 |
| ✅ | **이미지 비율 최적화 v5.8** | `services/geminiService.ts` | 코디: 3:4(세로), 음식: 1:1(정사각형) 적용 |
| ✅ | **보정된 현실성 v5.9** | `services/geminiService.ts` | 체형별 긍정적 시각 묘사를 프롬프트에 자동 적용 |
| ✅ | **API 할당량 보호 v6.0** | `services/geminiService.ts` | 이미지 생성 순차 실행 + 1초 지연으로 429 오류 방지 |
| ✅ | **AI 호출 최적화 v6.1** | `services/engine.ts`, `App.tsx` | Refresh 버튼 누를 때만 API 호출 (자동 호출 차단) |
| ✅ | **OpenAI Split-Brain v6.2** | `services/geminiService.ts` | 식단/운동/명언: `gpt-4o-mini`, 의상: `gpt-4o` 분리 호출 |
| ✅ | **Foundry Image Spec v6.3** | `services/geminiService.ts` | `gpt-image-1-mini` 모델 사양 준수 (`response_format` 제거, `quality: medium`) |
| ✅ | **Foundry Image Size Fix v6.4** | `services/geminiService.ts` | Portrait를 `1024x1536`으로 변경하여 400 에러 해결 |
| 🚧 | **칼로리 트래커** | `screens/DietRecipe.tsx` | 현재 정적 데이터 표시. 실제 기록 기능 연동 필요 |
| 🚧 | **운동 타이머** | `screens/StyleWorkout.tsx` | 운동 가이드 화면에 카운트다운 타이머 기능 추가 필요 |

---

## 2. Tech Stack & Rules

### 기술 스택

| 분류 | 기술 | 버전/상세 |
|:---:|:---|:---|
| **Core** | React (Hooks 기반 함수형 컴포넌트) | 18.3.1 |
| **Language** | TypeScript | 5.5.3 |
| **Build** | Vite (ESM) | 5.4.1 |
| **Styling** | Tailwind CSS (다크모드 지원) | - |
| **AI (Google)** | `@google/genai` SDK | 0.1.0 |
| **AI (OpenAI)** | `openai` SDK | 4.28.0 |
| **Storage** | LocalStorage (Key: `luvitt_latest_ai_data`) | 압축 저장 |
| **Icons** | Material Icons Round, Material Symbols Outlined | CDN |
| **Localization** | Custom Dictionary Pattern (`i18n.ts`) | KO / EN |

### AI 모델 구성

| 용도 | 프로바이더 | 모델 |
|:---:|:---:|:---|
| 텍스트 (일반) | Google | `gemini-3-flash-preview` |
| 이미지 | Google | `gemini-2.5-flash-image` |
| 텍스트 (일반) | OpenAI | `gpt-4o-mini` |
| 텍스트 (스타일) | OpenAI | `gpt-4o` |
| 이미지 | OpenAI | `gpt-image-1-mini` (Microsoft Foundry Spec) |

> **OpenAI `gpt-image-1-mini` 제약사항**: `response_format` 파라미터 없음, `quality`: `low`/`medium`/`high`, `size`: `1024x1024`, `1024x1536`, `1536x1024` (DALL-E 3 규격 미지원)

### 코딩 규칙

- **SSOT**: 상태 관리는 가능한 상위(`App.tsx`)에서 수행하고 Props로 전달
- **Fail-safe**: AI 응답 실패 시 반드시 로컬 Mock 데이터를 폴백으로 사용
- **Performance**: 이미지 로딩 시 `aspect-ratio`나 고정 높이로 레이아웃 시프트 방지
- **Aesthetics**: 모바일 퍼스트 디자인, 여백과 타이포그래피 계층 구조 준수

---

## 3. Current Todo

### 🔴 긴급 (보안)

- [ ] **API 키 하드코딩 제거**: `services/geminiService.ts`와 `vite.config.ts`에 OpenAI API 키가 평문으로 하드코딩되어 있음. `.env.local` 파일로 이동 필요. *(현재 키가 Git에 노출될 위험)*

### 🟡 기능 개발

- [ ] **칼로리 트래커 구현**: 현재 정적인 데이터로 표시되는 '잔여 칼로리' 등을 실제 기록 기능과 연동
- [ ] **운동 타이머**: 운동 가이드 화면에 실제 카운트다운 타이머 기능 추가

### 🟢 정비

- [ ] **`constants.ts` 분석**: Mock 데이터 구조 및 태그 시스템 문서화
- [ ] **`.agent/` 디렉토리 구조 정비**: 체크리스트 및 워크플로우 파일 생성

---

## 4. Change Log

| 날짜 | 변경 내용 | 이유 (Why) | 변경 파일 | 승인 |
|:---:|:---|:---|:---:|:---:|
| 2026-02-18 | **문서 전면 정비** | 타 환경에서 이전한 프로젝트 정리. `Master_GDD.md` 마크다운 형식 개선, `PROJECT_STATUS.md` 구조 개선 및 보안 이슈 기록 | `Master_GDD.md`, `PROJECT_STATUS.md` | ✅ |
| 2024-05-22 | **Foundry Image Size Fix v6.4** | `gpt-image-1-mini` 모델 해상도 400 에러 수정. DALL-E 3 규격(`1024x1792`)을 Foundry 규격(`1024x1536`)으로 변경 | `services/geminiService.ts` | ✅ |
