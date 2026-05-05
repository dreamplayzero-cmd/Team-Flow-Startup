# ui/input_view.py
from PySide6.QtWidgets import (QWidget, QVBoxLayout, QHBoxLayout, QLabel, 
                               QLineEdit, QComboBox, QPushButton, QGroupBox, QGridLayout,
                               QCheckBox, QMessageBox)
from PySide6.QtCore import Signal, Qt
from config.settings import AREA_MAP
from core.engine.category_master import CategoryMaster

class InputView(QWidget):
    # 분석 시작 시그널 (데이터와 함께 전송)
    start_analysis = Signal(dict)

    def __init__(self):
        super().__init__()
        layout = QVBoxLayout(self)
        layout.setContentsMargins(40, 30, 40, 30)
        layout.setSpacing(15)

        title = QLabel("창업자 프로파일링 & 조건 입력")
        title.setStyleSheet("font-size: 24px; font-weight: bold; margin-bottom: 5px;")
        layout.addWidget(title)
        
        desc = QLabel("정확한 상권 분석 파이프라인 가동을 위해 아래 정보를 최대한 상세히 입력해 주세요.")
        desc.setStyleSheet("color: #94A3B8; margin-bottom: 15px;")
        layout.addWidget(desc)

        # ---- 1. 창업자 프로필 그룹 ----
        profile_group = QGroupBox("👤 창업자 기본 정보")
        grid1 = QGridLayout(profile_group)
        grid1.setSpacing(10)

        grid1.addWidget(QLabel("창업자 나이"), 0, 0)
        self.age_input = QLineEdit()
        self.age_input.setPlaceholderText("예: 28")
        grid1.addWidget(self.age_input, 0, 1)

        grid1.addWidget(QLabel("성별"), 0, 2)
        self.gender_combo = QComboBox()
        self.gender_combo.addItems(["선택 안함", "남성", "여성"])
        grid1.addWidget(self.gender_combo, 0, 3)

        grid1.addWidget(QLabel("관련업계 경력(년)"), 1, 0)
        self.exp_input = QLineEdit()
        self.exp_input.setPlaceholderText("예: 3 (초보면 0)")
        grid1.addWidget(self.exp_input, 1, 1)

        grid1.addWidget(QLabel("창업 자본금(만원)"), 1, 2)
        self.capital_input = QLineEdit()
        self.capital_input.setPlaceholderText("예: 10000")
        grid1.addWidget(self.capital_input, 1, 3)
        layout.addWidget(profile_group)

        # ---- 2. 비즈니스 플랜 그룹 ----
        biz_group = QGroupBox("💼 비즈니스 플랜")
        grid2 = QGridLayout(biz_group)
        grid2.setSpacing(10)

        grid2.addWidget(QLabel("업종 선택"), 0, 0)
        self.industry_combo = QComboBox()
        self.industry_combo.addItems(CategoryMaster.get_all_names())
        grid2.addWidget(self.industry_combo, 0, 1)

        grid2.addWidget(QLabel("주요 타겟층"), 0, 2)
        self.target_combo = QComboBox()
        self.target_combo.addItems(["상관없음", "1020 학생", "2030 MZ", "3040 직장인", "가족단위"])
        grid2.addWidget(self.target_combo, 0, 3)

        grid2.addWidget(QLabel("운영 형태"), 1, 0)
        self.op_type_combo = QComboBox()
        self.op_type_combo.addItems(["홀 중심", "배달 중심", "테이크아웃 중점", "홀+배달 복합"])
        grid2.addWidget(self.op_type_combo, 1, 1)

        grid2.addWidget(QLabel("주요 영업시간"), 1, 2)
        self.op_time_combo = QComboBox()
        self.op_time_combo.addItems(["올데이", "점심 위주", "저녁/주류 위주", "심야 영업"])
        grid2.addWidget(self.op_time_combo, 1, 3)
        layout.addWidget(biz_group)

        # ---- 3. 타겟 상권 (최대 4개) ----
        area_group = QGroupBox("📍 타겟 상권 선택 (비교 분석용, 최대 4개)")
        area_layout = QHBoxLayout(area_group)
        self.area_checkboxes = []
        areas = list(AREA_MAP.keys())  # WHY: settings.py AREA_MAP 단일 진실 공급원에서 동적 로드
        
        for area in areas:
            cb = QCheckBox(area)
            cb.stateChanged.connect(self._check_area_limit)
            self.area_checkboxes.append(cb)
            area_layout.addWidget(cb)
            
        layout.addWidget(area_group)

        # Analysis Button
        self.btn_analyze = QPushButton("🚀 다중 상권 정밀 분석 시작")
        self.btn_analyze.setFixedHeight(45)
        self.btn_analyze.setStyleSheet("background-color: #0284C7; color: white; border-radius: 5px; font-weight: bold; font-size: 15px;")
        self.btn_analyze.setCursor(Qt.PointingHandCursor)
        self.btn_analyze.clicked.connect(self._on_analyze_clicked)
        layout.addWidget(self.btn_analyze)
        
        layout.addStretch()

    def _check_area_limit(self):
        """지역 선택이 4개를 초과하지 않도록 제한"""
        checked_count = sum(1 for cb in self.area_checkboxes if cb.isChecked())
        if checked_count > 4:
            sender = self.sender()
            sender.setChecked(False)
            QMessageBox.warning(self, "선택 제한", "비교 분석은 최대 4개 상권까지만 가능합니다.")

    def _on_analyze_clicked(self):
        selected_areas = [cb.text() for cb in self.area_checkboxes if cb.isChecked()]
        if not selected_areas:
            QMessageBox.warning(self, "필수 입력", "최소 1개 이상의 상권을 선택해 주세요.")
            return

        # [입력값 검증] 나이/자본금 숫자 여부 확인
        # WHY: 문자 입력 시 엔진에서 조용히 0으로 처리되어 사용자가 오류를 모르는 문제 방지
        age_text = self.age_input.text() or "0"
        capital_text = self.capital_input.text() or "0"
        exp_text = self.exp_input.text() or "0"

        if not age_text.isdigit():
            QMessageBox.warning(self, "입력 오류", "나이는 숫자만 입력 가능합니다. (예: 28)")
            return
        if not capital_text.isdigit():
            QMessageBox.warning(self, "입력 오류", "자본금은 숫자만 입력 가능합니다. (예: 10000)")
            return
        if not exp_text.isdigit():
            QMessageBox.warning(self, "입력 오류", "경력은 숫자만 입력 가능합니다. (예: 3)")
            return

        data = {
            "age": age_text,
            "gender": self.gender_combo.currentText(),
            "experience": exp_text,
            "capital": capital_text,
            "industry": self.industry_combo.currentText(),
            "target": self.target_combo.currentText(),
            "op_type": self.op_type_combo.currentText(),
            "op_time": self.op_time_combo.currentText(),
            "areas": selected_areas
        }
        self.start_analysis.emit(data)

