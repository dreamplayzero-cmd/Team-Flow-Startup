# 🤝 MZ 상권분석 AI - 인수인계 개발 가이드 (Developer Handover Guide)

안녕하세요, 본 문서는 **"MZ 상권분석 AI 앱"**의 유지보수 및 기능 확장을 이어받게 될 개발자분들을 위한 **최종 아키텍처 및 로직 가이드**입니다.
이 문서와 아래 "시작하기(Getting Started)" 절차만 따라오시면 10분 내로 로컬 환경에서 앱을 구동하고 코드를 분석하실 수 있습니다.

---

## 🚀 1. 설치 및 구동 방법 (Getting Started)

### 사전 준비물
- Python 3.10+
- (중요) 실제 네이버 개발자센터 API KEY, 공공데이터포털 API KEY
  - 이 프로젝트는 **환경 변수 파일(`.env`)**에 엄청난 의존성을 가집니다.
  - 보안상 `.env`는 깃허브나 압축파일에 포함되지 않으므로, 전임자에게 `.env` 파일을 별도로 넘겨받아 프로젝트 루트에 넣어야 합니다.

### 환경 구성 절차
```bash
# 1. 가상환경 생성 및 진입
python -m venv venv
.\venv\Scripts\activate  # Windows 환경 기준

# 2. 필수 라이브러리 설치
pip install -r requirements.txt

# 3. 팩토리 초기화 (데이터베이스 생성)
# -> 애플리케이션을 최초 실행하면 data/ 뼈대 및 SQLite db가 자동 생성됩니다.
python main.py
```

---

## 📂 2. 디렉토리 구조 (Folder Architecture)

전체 시스템은 PySide6(UI)와 로직(Core), DB(Data)가 완고하게 **분리(Decoupling)**된 구조입니다.

```text
pro1/
│
├── config/              # 환경변수 로더 및 지역 변수(AREA_MAP) 관리 (`settings.py`)
├── core/                # ★ 핵심 뇌(Brain), 이곳의 로직이 가장 중요합니다.
│   ├── collectors/      # 4대 데이터 수집 로직 (행안부, 상공인 API, 트렌드, 블로그)
│   │   ├── main_collector.py  # 모든 API 수집 모듈을 제어하는 오토메이션 본체
│   │   └── csv_importer.py    # [중요] 상가 CSV 수동 업로드 모듈 (API 속도 제한 우회용)
│   ├── engine/          
│   │   └── scoring_engine.py  # 수집된 데이터를 100점 만점으로 계산하는 통계학적 알고리즘
│   └── workers.py       # UI 멈춤 방지를 위한 QThread 멀티스레딩 모듈 워커
│
├── data/                # SQLite3 DB 매니저 (`db_manager.py`) 및 스키마(`schema.py`)
├── ui/                  # PySide6 모듈 구조. 로그인, 어드민, 조건입력 등 뷰(View) 단위 분리
│   ├── main_window.py   # 모든 UI 뷰의 라우터 역할 (QStackedWidget 스위칭 제어)
│   └── styles.py        # 다크 모드 통합 CSS
│
├── main.py              # 데스크톱 애플리케이션 진입점(Entry Point)
└── web_app.py           # 단 3분 만에 Streamlit으로 이식해 둔 무설치 웹 테스터 파일
```

---

## 🧠 3. 핵심 비즈니스 로직 흐름 (Data to Insight)

1. **데이터 적재 체계 (Dual-Sync Architecture)**
   - 관리자는 앱에 접속 후 `DataSyncWorker`를 이용해 **API(인구, 네이버, 블로그)** 데이터를 실시간 호출하여 SQLite에 적재합니다.
   - 단, 상가(경쟁 점포 수) 데이터는 공공기관 API의 심각한 레이트 리밋과 응답 지연을 회피하기 위해, **'수동 CSV (290MB 전국 데이터) 덮어쓰기'** 방식을 주력으로 채택하였습니다. (관리자 모드에서 CSV 업로드 버튼 사용)
2. **평가 엔진 (`ScoringEngine`)**
   - 사용자(창업자)가 자본, 형태 등을 입력하면, `calculate_area_score()`가 호출되어 DB의 4가지 파편화된 테이블의 수치를 조회합니다.
   - 이후 경쟁 역수 적용, 유동 인구 정규화 등을 거친 뒤 페널티 제어장치(레드오션일 경우 -10점 강제 차감 등)를 통과시켜 **100점 만점 수치와 리포트**를 생성합니다.

---

## 🚫 4. 차기 개발자 인계 시 주의사항 및 T/S

- **API Decoding Key 주의**: 
  `.env`에 저장되는 KEY는 반드시 디코딩된 순수 KEY여야 합니다. Requests 모듈이 자동으로 인코딩 시키기 때문에 이중 인코딩 시 `403 Forbidden`에 영원히 갇힙니다.
- **PySide6 UI Thread Freezing**: 
  1.4만 건의 CSV 적재나 30개의 상가 크롤링 등 조금이라도 무거운 반복문은 과장 없이 앱을 즉사(응답 없음) 시킵니다. 절대 UI 클래스 내부에서 `time.sleep`나 for문을 심게 두지 말고, 만들어둔 `core/workers.py`의 **QThread 신호(Signal) 체계**로 넘기십시오.
- **SQLite 동시성**:
  파이썬의 `sqlite3`은 다중 스레드 접근을 허용하지 않습니다. `DatabaseManager` 클래스는 내부적으로 `with` 문과 강제 커밋으로 락(Lock)을 억제하고 있으니 스크립트 작성 시 반드시 이를 거쳐야 합니다.

---
행운을 빕니다! 앱의 코어 엔진이 매우 정교하게 짜여 있으므로, 새로운 지역이나 추가 편의 옵션을 확장하기 수월할 것입니다.
