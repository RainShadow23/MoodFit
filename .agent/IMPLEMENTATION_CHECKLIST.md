# MoodFit 구현 체크리스트

> **기준 버전**: v6.4 | **최종 업데이트**: 2026-02-18

---

## Phase 1: 핵심 기능 (완료 ✅)

### 기반 구조

- [x] React 18 + TypeScript + Vite 프로젝트 설정
- [x] Tailwind CSS 다크모드 설정
- [x] `types.ts` 데이터 모델 정의 (UserProfile, RecommendationResult 등)
- [x] `i18n.ts` 다국어 지원 (KO/EN)
- [x] `vite.config.ts` API 키 빌드 타임 주입 설정

### 화면 구현

- [x] `screens/Dashboard.tsx` - 홈 대시보드
- [x] `screens/DietRecipe.tsx` - 식단 & 레시피
- [x] `screens/StyleWorkout.tsx` - 스타일 & 운동
- [x] `screens/ProfileSetup.tsx` - 프로필 설정
- [x] `components/BottomNav.tsx` - 하단 내비게이션

### AI 서비스

- [x] `services/engine.ts` - 로컬 태그 기반 추천 엔진
- [x] `services/geminiService.ts` - Gemini/OpenAI 듀얼 프로바이더
- [x] 냉장고 파먹기 (`generateFridgeRecipe`)
- [x] 메인 AI 추천 (`fetchAIRecommendations`) - Split-Brain 구조
- [x] 이미지 압축 및 LocalStorage 저장 최적화

---

## Phase 2: 미구현 기능 (예정 🚧)

### 🔴 긴급 (보안)

- [ ] **API 키 보안 처리**: `geminiService.ts`와 `vite.config.ts`의 하드코딩된 OpenAI 키를 `.env.local`로 이동
  - 대상 파일: `services/geminiService.ts` (L10), `vite.config.ts` (L16)
  - `.gitignore`에 `.env.local` 포함 여부 확인

### 🟡 기능 개발

- [ ] **칼로리 트래커**
  - 먹은 음식 기록 UI (DietRecipe.tsx)
  - 일일 목표 칼로리 대비 잔여량 계산 로직
  - LocalStorage 기반 일별 기록 저장
- [ ] **운동 타이머**
  - 운동별 카운트다운 타이머 컴포넌트
  - 세트/휴식 시간 구분 로직

### 🟢 품질 개선

- [ ] **Mock 데이터 확장** (`constants.ts`)
  - 레시피 데이터 다양화 (현재 수량 파악 필요)
  - 운동 데이터 다양화
  - 코디 데이터 다양화
- [ ] **에러 처리 개선**: `alert()` 대신 토스트 알림 UI 적용
- [ ] **로딩 UX 개선**: 스켈레톤 UI 적용 (현재 단순 로딩 스피너)

---

## 기술 부채 (Tech Debt)

| 우선순위 | 항목 | 위치 | 설명 |
|:---:|:---|:---:|:---|
| 🔴 높음 | API 키 하드코딩 | `geminiService.ts`, `vite.config.ts` | 보안 취약점. 즉시 처리 필요 |
| 🟡 중간 | `alert()` 사용 | `App.tsx` | 사용자 경험 저하. 토스트 UI로 교체 필요 |
| 🟡 중간 | `constants.ts` 미문서화 | `constants.ts` | Mock 데이터 구조 및 태그 시스템 문서화 필요 |
| 🟢 낮음 | `@google/genai` 버전 | `package.json` | v0.1.0 (매우 낮음). 최신 버전 확인 필요 |
