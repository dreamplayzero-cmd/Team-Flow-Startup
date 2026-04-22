# MZ 상권분석 앱 (MZ-Generation Commercial Area Analysis)

MZ세대를 타겟으로 한 창업자들을 위한 상권 분석 및 의사결정 지원 도구입니다.

## 🎯 주요 목표 및 비즈니스 로직
- 상권 분석 앱의 상세 로직과 성공 가능성 산출 방식은 [MZ_APP_MASTER_PLAN.md](./MZ_APP_MASTER_PLAN.md)를 참조하십시오.
- 안티그래비티는 항상 위 마스터 플랜을 기반으로 설계 및 코딩을 진행합니다.

## 🛠 Tech Stack
- **Language**: Python 3.10+
- **UI Framework**: PySide6
- **Database**: SQLite3
- **Data Source**: 행안부(인구), 소상공인(상가), 네이버 API, 블로그 크롤링

## 🏗 Architecture
- `core/collectors/`: 각 소스별 데이터 수집기 (Pop, Store, Blog, Naver)
- `core/engine/`: 상권 분석 및 점수 산출 엔진
- `data/`: 데이터베이스 관리 및 DAO
- `ui/`: PySide6 기반 사용자 인터페이스
- `utils/`: 공통 유틸리티 (로깅, 크롤러, API 클라이언트)
- `config/`: 환경 설정 및 API Key 관리

## 📋 규칙 및 가이드라인
- **데이터 관리**: 모든 DB 접근은 컨텍스트 매니저를 통해 자동 관리함.
- **보안**: Parameterized Query를 사용하여 SQL Injection 방지.
- **로깅**: `[LEVEL] [MODULE] [ACTION] - message` 형식 준수.

## 🚀 시작하기
1. `venv` 생성 및 활성화
2. `pip install -r requirements.txt`
3. `main.py` 실행 (예정)
