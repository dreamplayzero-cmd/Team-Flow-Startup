# 🚀 MZ 상권분석 앱: 개발자 핸드오버 가이드 (v1.0)

본 문서는 **MZ세대 대상 상권 분석 및 의사결정 지원 시스템**의 지속적인 개발과 유지보수를 위해 작성되었습니다. 이 프로젝트는 데이터 과학 기반의 상권 분석 로직과 사용자 친화적인 PySide6 UI가 결합된 통합 솔루션입니다.

---

## 📂 프로젝트 구조 (Architecture)

프로젝트는 유지보수와 확장을 고려하여 모듈화된 계층으로 설계되었습니다.

```text
pro1/
├── core/                   # 핵심 로직 레이어
│   ├── collectors/         # 데이터 수집기 (Pop, Store, Blog, Naver)
│   ├── engine/             # 분석 및 점수 산출 엔진 (핵심!!)
│   └── workers.py          # 백그라운드 작업 관리
├── data/                   # 데이터 레이어
│   ├── mz_commercial_analysis.db  # SQLite 데이터베이스 (전달 포함)
│   ├── db_manager.py       # DB 접근 및 컨텍스트 매니저
│   └── schema.py           # 테이블 정의 및 초기화
├── ui/                     # 프리젠테이션 레이어 (PySide6)
│   ├── main_window.py      # 메인 앱 창
│   ├── input_view.py       # 조건 입력 화면
│   └── result_view.py      # 분석 결과 리포트 화면
├── config/                 # 설정 정보
│   ├── area_attributes.json # 지역 속성 마스터 파일
│   └── settings.py         # 환경 설정 및 API 키 관리
├── utils/                  # 공통 유틸리티
└── docs/                   # 프로젝트 문서화
```

---

## 🧠 핵심 엔진 및 알고리즘 설명

### 1. 지역 점수 산출 로직 (`core/engine/scoring_engine.py`)
이 앱의 핵심은 4가지 정량적 지표를 결합한 종합 상권 점수입니다.

- **수요 점수 (Demand Score)**: 인구 밀도와 네이버 검색 트렌드(성장률)를 결합하여 산출합니다.
- **경쟁 점수 (Competition Score)**: 단순히 매장 수가 적은 곳이 아닌, '최적 밀도 시너지 곡선'을 기반으로 포화도와 시너지 가능성을 동시에 분석합니다.
- **트렌드 점수 (Trend Score)**: 소셜(블로그) 긍정도 분석 및 검색 키워드의 점유율을 반영합니다.
- **수익성 점수 (Profitability Score)**: 예상 매출액 대비 해당 지역의 Real-world 임대료 데이터를 기반으로 손익분기점(BEP)을 계산합니다.

### 2. 창업자 맞춤 가중치 시스템
창업자가 입력한 조건(안정성 중시, 트렌드 중시 등)에 따라 위 4개 지표의 가중치가 실시간으로 조정됩니다.

---

## 💾 데이터베이스 가이드

본 패키지에는 현재까지의 분석 데이터가 포함된 `data/mz_commercial_analysis.db` 파일이 동봉되어 있습니다.

- **데이터 수집 완료**: 현재 주요 7개 행정동(신사동, 역삼동 등)에 대한 인구, 상가, 트렌드 기초 데이터가 적재되어 있습니다.
- **DB 접근**: `data.db_manager.DatabaseManager` 클래스를 사용하십시오. 모든 쿼리는 SQL Injection 방지를 위해 파라미터화되어 있습니다.

---

## 🚀 빠른 시작 (Quick Start)

가상환경 설정 및 필수 패키지 설치가 필요합니다.

1. **Python 버전**: 3.10 이상 권장
2. **환경 구축**:
   ```bash
   python -m venv venv
   source venv/Scripts/activate  # Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```
3. **앱 실행**:
   ```bash
   python main.py
   ```
   또는 루트에 포함된 `run_app.bat`을 실행하십시오.

---

## ⚠️ 개발 시 주의사항

1. **API 키 설정**: `.env` 파일에 네이버 API 등 필수 키가 설정되어 있어야 합니다. (기존 키 만료 주의)
2. **UI 스레드 차단 금지**: 데이터 수집이나 분석 엔진 실행 시 UI가 멈추지 않도록 반드시 `core/workers.py`를 통한 멀티스레딩 구조를 유지하십시오.
3. **코드 규칙**: 
   - 파일은 300줄 이하, 함수는 50줄 이하 유지를 권장합니다.
   - 모든 DB 접근은 `with` 구문을 사용하십시오.

---

## 💡 향후 과제 (Backlog)

1. **데이터 확장**: 현재 7개 동에서 서울 전역 및 전국 단위로 확장.
2. **Web 연동**: 현재 PySide6 UI를 Web 기반(Stitch 디자인 시스템)으로 전환하는 설계가 검토 중입니다.
3. **AI 고도화**: LLM(Gemma 등)을 활용한 정성적 비즈니스 인사이트 생성 로직 강화.

---
**기획 및 초기 개발**: JINI (Tech Lead)
**문의**: jini0107 (Repository Admin)
