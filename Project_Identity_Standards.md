# 🛡️ Project Identity & UI Standards

본 문서는 'Team Flow - Youth Startup Flow' 프로젝트의 두 가지 핵심 서비스 브랜드와 UI 가이드라인을 정의합니다. 프로젝트의 정체성을 유지하기 위해 반드시 준수해야 합니다.

---

## 1. 📱 Sovereign AI (솔버린 AI)
**정체성**: 프리미엄 전략 분석 모바일 서비스
- **플랫폼**: Flutter (Mobile App)
- **위치**: `/The_Sovereign_ai _app`
- **핵심 브랜드명**: `THE SOVEREIGN`, `INSIGHT ENGINE`
- **디자인 컨셉**:
    - **Luxury Dark**: 블랙 및 다크 네이비 배경 (#0F172A, #000000)
    - **Accent**: 화이트, 골드, 블루 (#3B82F6)
    - **UX**: 글래스모피즘, 정교한 애니메이션, 전문가용 분석 툴 느낌
- **주요 파일**:
    - `lib/ui/pages/login_page.dart` (Sovereign AI 로고 및 다크 테마)
    - `lib/ui/pages/dashboard_page.dart` (Insight Engine 타이틀)

## 2. 🌐 Youth Startup Flow (유스 스타트업)
**정체성**: 청년 창업자를 위한 트렌디한 웹 대시보드
- **플랫폼**: React/Vite (Web App)
- **위치**: `/Youth startup flow (web)`
- **핵심 브랜드명**: `Youth Startup Flow`, `StarterMap`
- **디자인 컨셉**:
    - **Marble Aesthetic**: 화이트 대리석 텍스처 배경
    - **Light & Fresh**: 밝고 깨끗한 화이트/실버 톤
    - **UX**: 직관적인 카드 레이아웃, 넓은 여백, 밝은 컬러 포인트
- **주요 파일**:
    - `frontend/src/ui/pages/LoginPage.tsx` (Youth Startup Flow 로고)
    - `frontend/src/ui/pages/DashboardPage.tsx` (CORE OPERATIONS)

---

## 3. ⚠️ 주의 사항 (Critical Rules)
- **브랜드 혼용 금지**: 모바일 앱에 유스 스타트업 로고를 넣거나, 웹에 솔버린 AI의 다크 테마를 강제로 적용하지 마세요.
- **로그인 시스템**:
    - **Kakao Login**: 테스트용 버전으로, 최종 디버깅 단계에서 삭제 예정.
    - **Google Login**: 공식 지원 로그인 수단.
- **자산 경로**:
    - Flutter Web 빌드 시 `assets/assets/bgm/` 경로 특이성을 인지하고 관리하세요.

---
*이 가이드는 프로젝트의 일관성을 유지하고 혼선을 방지하기 위한 최종 지침입니다.*
