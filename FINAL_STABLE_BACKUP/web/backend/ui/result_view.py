# ui/result_view.py
from PySide6.QtWidgets import (QWidget, QVBoxLayout, QHBoxLayout, QLabel, 
                               QPushButton, QFrame, QScrollArea)
from PySide6.QtCore import Qt, Signal
from PySide6.QtGui import QPixmap
import os
from config import settings

class ResultView(QWidget):
    back_to_main = Signal()

    def __init__(self, multi_reports):
        super().__init__()
        self.reports = sorted(multi_reports, key=lambda x: x['final_score'], reverse=True)
        self.current_report = self.reports[0]  # 가장 높은 점수(기본값)
        
        main_layout = QVBoxLayout(self)
        main_layout.setContentsMargins(40, 20, 40, 20)
        main_layout.setSpacing(20)

        # Header with back button
        header_layout = QHBoxLayout()
        self.btn_back = QPushButton("← 다시 입력")
        self.btn_back.setFixedWidth(120)
        self.btn_back.setStyleSheet("background-color: #334155; color: white; border-radius: 5px; padding: 8px; font-weight: bold;")
        self.btn_back.clicked.connect(self.back_to_main.emit)
        header_layout.addWidget(self.btn_back)
        header_layout.addStretch()
        main_layout.addLayout(header_layout)

        # --- 상권 선택 탭 (동적 생성) ---
        tab_layout = QHBoxLayout()
        tab_layout.setSpacing(10)
        self.tab_buttons = []
        
        for idx, rep in enumerate(self.reports):
            # 1위는 🏆 아이콘 달기
            btn_title = f"🏆 {rep['area_name']}" if idx == 0 else rep['area_name']
            btn = QPushButton(btn_title)
            btn.setFixedHeight(40)
            btn.setCursor(Qt.PointingHandCursor)
            # 클릭 이벤트 바인딩
            btn.clicked.connect(lambda checked=False, r=rep: self._switch_report(r))
            tab_layout.addWidget(btn)
            self.tab_buttons.append(btn)
            
        tab_layout.addStretch()
        main_layout.addLayout(tab_layout)

        # ====== 스크롤 영역 내부에 컨텐츠 삽입 ======
        self.scroll_area = QScrollArea()
        self.scroll_area.setWidgetResizable(True)
        self.scroll_area.setStyleSheet("QScrollArea { border: none; background-color: transparent; }")
        
        scroll_content_widget = QWidget()
        scroll_content_widget.setStyleSheet("background-color: transparent;")
        scroll_layout = QVBoxLayout(scroll_content_widget)
        scroll_layout.setContentsMargins(0, 0, 0, 0)
        scroll_layout.setSpacing(20)

        # --- [NEW] Visual DNA Image 영역 ---
        self.dna_image_container = QFrame()
        self.dna_image_container.setFixedHeight(300)
        self.dna_image_container.setStyleSheet("background-color: #0f172a; border-radius: 15px; border: 1px solid #334155;")
        dna_img_layout = QVBoxLayout(self.dna_image_container)
        dna_img_layout.setContentsMargins(0, 0, 0, 0)
        
        self.dna_image_label = QLabel("DNA 이미지를 불러오는 중...")
        self.dna_image_label.setAlignment(Qt.AlignCenter)
        self.dna_image_label.setStyleSheet("color: #64748b; font-size: 14px;")
        # [FIX] setScaledContents(True)는 배율을 무시하고 라벨에 꽉 채우므로 비활성화
        self.dna_image_label.setScaledContents(False) 
        dna_img_layout.addWidget(self.dna_image_label)
        
        scroll_layout.addWidget(self.dna_image_container)

        # --- 메인 코어 정보 영역 ---
        self.score_card = QFrame()
        self.score_card.setStyleSheet("background-color: #1E293B; border-radius: 15px; padding: 20px;")
        score_layout = QVBoxLayout(self.score_card)
        score_layout.setAlignment(Qt.AlignCenter)

        self.title_label = QLabel()
        self.title_label.setStyleSheet("font-size: 22px; color: #94A3B8; font-weight:bold;")
        score_layout.addWidget(self.title_label, alignment=Qt.AlignCenter)

        self.score_label = QLabel()
        self.score_label.setStyleSheet("font-size: 50px; color: #F8FAFC; font-weight: 900; margin: 10px 0px;")
        score_layout.addWidget(self.score_label, alignment=Qt.AlignCenter)

        self.prob_label = QLabel()
        self.prob_label.setStyleSheet("font-size: 20px; color: #38BDF8; font-weight: bold;")
        score_layout.addWidget(self.prob_label, alignment=Qt.AlignCenter)

        scroll_layout.addWidget(self.score_card)

        # Recommendation Text
        self.report_label = QLabel()
        self.report_label.setWordWrap(True)
        self.report_label.setTextFormat(Qt.RichText) # HTML 적용 강제
        self.report_label.setStyleSheet("font-size: 16px; color: #F1F5F9; line-height: 1.5; padding: 10px;")
        scroll_layout.addWidget(self.report_label)

        # --- 장/단점 박스 ---
        self.detail_layout = QHBoxLayout()
        self.pros_box = QFrame()
        self.pros_layout = QVBoxLayout(self.pros_box)
        self.pros_title = QLabel("✅ 강점 및 보너스")
        self.pros_title.setStyleSheet("color: #22C55E; font-weight: bold; font-size: 16px; margin-bottom: 5px;")
        self.pros_content = QLabel()
        self.pros_content.setWordWrap(True)
        self.pros_content.setTextFormat(Qt.RichText) # HTML 적용 강제
        self.pros_content.setStyleSheet("color: #F8FAFC; font-size: 14px; line-height: 1.5;")
        self.pros_layout.addWidget(self.pros_title)
        self.pros_layout.addWidget(self.pros_content)
        self.pros_layout.addStretch()
        self.pros_box.setStyleSheet("background-color: #0F172A; border: 1px solid #334155; border-radius: 10px; padding: 15px;")

        self.cons_box = QFrame()
        self.cons_layout = QVBoxLayout(self.cons_box)
        self.cons_title = QLabel("🚨 주의 및 페널티")
        self.cons_title.setStyleSheet("color: #EF4444; font-weight: bold; font-size: 16px; margin-bottom: 5px;")
        self.cons_content = QLabel()
        self.cons_content.setWordWrap(True)
        self.cons_content.setTextFormat(Qt.RichText) # HTML 적용 강제
        self.cons_content.setStyleSheet("color: #F8FAFC; font-size: 14px; line-height: 1.5;")
        self.cons_layout.addWidget(self.cons_title)
        self.cons_layout.addWidget(self.cons_content)
        self.cons_layout.addStretch()
        self.cons_box.setStyleSheet("background-color: #0F172A; border: 1px solid #334155; border-radius: 10px; padding: 15px;")

        self.detail_layout.addWidget(self.pros_box)
        self.detail_layout.addWidget(self.cons_box)
        scroll_layout.addLayout(self.detail_layout)
        scroll_layout.addStretch()

        self.scroll_area.setWidget(scroll_content_widget)
        main_layout.addWidget(self.scroll_area)
        
        # 최초 1위 데이터 렌더링
        self._switch_report(self.current_report)

    def _switch_report(self, report):
        """특정 상권의 리포트 데이터를 뷰에 반영하고 탭 색상 변경"""
        # 버튼 색상 업데이트
        for btn in self.tab_buttons:
            if report['area_name'] in btn.text():
                btn.setStyleSheet("background-color: #0ea5e9; color: white; font-weight:bold; border-radius: 5px; padding: 5px 15px;")
            else:
                btn.setStyleSheet("background-color: #334155; color: #94a3b8; border-radius: 5px; padding: 5px 15px;")

        # 내용 갱신
        self.title_label.setText(f"📍 {report['area_name']} 분석 결과")
        self.score_label.setText(f"{report['final_score']} 점")
        self.prob_label.setText(f"성공 가능성 {report['probability']}%")
        self.report_label.setText(report['comment'])
        self.pros_content.setText(report['pros'])
        self.cons_content.setText(report['cons'])

        # [NEW] DNA 이미지 로드
        dna_res = report.get('dna_result', {})
        img_path = dna_res.get('image_path', '')
        
        if img_path:
            # [FIX] EXE 내부 번들 경로 또는 로컬 경로 결합
            full_path = os.path.join(settings.BUNDLE_DIR, img_path)
            
            if os.path.exists(full_path):
                pixmap = QPixmap(full_path)
                # [FIX] 고정 높이 300에 맞춰 aspect ratio(배율)를 유지하며 스케일링
                # scaledToHeight는 이미지의 가로세로 비율을 보존합니다.
                scaled_pixmap = pixmap.scaledToHeight(300, Qt.SmoothTransformation)
                self.dna_image_label.setPixmap(scaled_pixmap)
                self.dna_image_label.setText("") # 텍스트 제거
        else:
            self.dna_image_label.setPixmap(QPixmap()) 
            self.dna_image_label.setText(f"🎨 [Visual DNA: {dna_res.get('dna_tone', 'Unknown')}]\n이미지 준비 중 (ID: {dna_res.get('dna_id', 'N/A')})")
