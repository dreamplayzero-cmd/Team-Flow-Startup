# ui/main_window.py
import sys
from PySide6.QtWidgets import (QMainWindow, QWidget, QVBoxLayout, QHBoxLayout, 
                               QLabel, QStackedWidget, QFrame, QPushButton)
from PySide6.QtCore import Qt
from ui.styles import MAIN_STYLE

class MainWindow(QMainWindow):
    def __init__(self):
        super().__init__()
        self.setWindowTitle("MZ 상권분석 AI - 창업 의사결정 지원")
        self.resize(1100, 800)
        self.setStyleSheet(MAIN_STYLE)

        # Central Widget & Main Layout
        central_widget = QWidget()
        self.setCentralWidget(central_widget)
        self.main_layout = QVBoxLayout(central_widget)
        self.main_layout.setContentsMargins(0, 0, 0, 0)
        self.main_layout.setSpacing(0)

        # Header
        self.header = self._create_header()
        self.main_layout.addWidget(self.header)

        # Content Stack (Switching between Input and Result)
        self.stack = QStackedWidget()
        self.main_layout.addWidget(self.stack)

    def _create_header(self):
        header = QFrame()
        header.setFixedHeight(70)
        header.setStyleSheet("background-color: #1E293B; border-bottom: 1px solid #334155;")
        
        layout = QHBoxLayout(header)
        layout.setContentsMargins(30, 0, 30, 0)
        
        title = QLabel("MZ 상권분석 AI 프로")
        title.setStyleSheet("font-size: 20px; font-weight: bold; color: #38BDF8;")
        
        subtitle = QLabel("Data-Driven Startup Support System")
        subtitle.setStyleSheet("font-size: 13px; color: #94A3B8; margin-left: 15px;")
        
        layout.addWidget(title)
        layout.addWidget(subtitle)
        layout.addStretch()
        
        # Logout Button (User/Admin 모드에서 뒤로 가기)
        self.btn_logout = QPushButton("나가기")
        self.btn_logout.setStyleSheet("background-color: transparent; color: #EF4444; font-weight: bold;")
        self.btn_logout.setCursor(Qt.PointingHandCursor)
        self.btn_logout.setVisible(False)
        layout.addWidget(self.btn_logout)
        
        # 자동 수동 스케줄러 (QTimer) 설정: 12시간마다 백그라운드 확인
        from PySide6.QtCore import QTimer
        self.auto_sync_timer = QTimer(self)
        self.auto_sync_timer.timeout.connect(self._run_auto_sync)
        self.auto_sync_timer.start(12 * 60 * 60 * 1000) # 12시간 (ms)
        
        return header

    def _run_auto_sync(self):
        self._start_worker("auto")

    def run_manual_sync(self):
        self._start_worker("manual")

    def _start_worker(self, mode):
        from core.workers import DataSyncWorker
        self.worker = DataSyncWorker(mode=mode)
        # WHY: finished/status 시그널을 AdminView와 연결하여 실시간 진행상태와 완료 피드백 제공
        if hasattr(self, 'admin_view'):
            self.worker.status.connect(
                lambda msg: self.admin_view.sync_status_label.setText(f"서버 상태: {msg}")
            )
            self.worker.finished.connect(self.admin_view.sync_completed)
        self.worker.start()

    def _start_csv_worker(self, csv_path):
        from core.workers import CsvImportWorker
        self.csv_worker = CsvImportWorker(csv_path)
        if hasattr(self, 'admin_view'):
            self.csv_worker.status.connect(
                lambda msg: self.admin_view.csv_status_label.setText(f"CSV 상태: {msg}")
            )
            self.csv_worker.finished.connect(self.admin_view.csv_upload_completed)
        self.csv_worker.start()

    # --- 라우팅 관리 ---
    def set_views(self, login_view, input_view, admin_view):
        self.login_view = login_view
        self.input_view = input_view
        self.admin_view = admin_view
        
        self.stack.addWidget(self.login_view)
        self.stack.addWidget(self.input_view)
        self.stack.addWidget(self.admin_view)
        
        # 나가기 버튼
        self.btn_logout.clicked.connect(self.show_login_view)
        
        # 추가: CSV 업로드 시그널 연결
        self.admin_view.trigger_csv_upload.connect(self._start_csv_worker)
        
    def show_login_view(self):
        self.btn_logout.setVisible(False)
        self.stack.setCurrentWidget(self.login_view)

    def show_user_dashboard(self):
        self.btn_logout.setVisible(True)
        self.stack.setCurrentWidget(self.input_view)
        
    def show_admin_dashboard(self):
        self.btn_logout.setVisible(True)
        self.stack.setCurrentWidget(self.admin_view)

    def show_result_view(self, result_view_widget):
        self.btn_logout.setVisible(True)
        self.stack.addWidget(result_view_widget)
        self.stack.setCurrentWidget(result_view_widget)
