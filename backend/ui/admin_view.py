# ui/admin_view.py
from PySide6.QtWidgets import (QWidget, QVBoxLayout, QHBoxLayout, QPushButton, 
                               QLabel, QFrame, QScrollArea, QFileDialog, QMessageBox)
from PySide6.QtCore import Qt, Signal

class AdminView(QWidget):
    go_back = Signal()
    trigger_sync = Signal()
    trigger_csv_upload = Signal(str) # CSV 경로를 전달하는 시그널

    def __init__(self):
        super().__init__()
        layout = QVBoxLayout(self)
        layout.setContentsMargins(40, 40, 40, 40)
        layout.setSpacing(20)

        # 헤더
        header_layout = QHBoxLayout()
        title = QLabel("🛡️ 시스템 관리자 대시보드")
        title.setStyleSheet("font-size: 24px; font-weight: bold; color: #F1F5F9;")
        
        self.btn_back = QPushButton("로그아웃")
        self.btn_back.setCursor(Qt.PointingHandCursor)
        self.btn_back.setStyleSheet("background-color: #EF4444; color: white; padding: 10px 20px; border-radius: 5px; font-weight: bold;")
        self.btn_back.clicked.connect(self.go_back.emit)
        
        header_layout.addWidget(title)
        header_layout.addStretch()
        header_layout.addWidget(self.btn_back)
        layout.addLayout(header_layout)

        # --- 패널 1: 자동 수집 동기화 ---
        control_panel = QFrame()
        control_panel.setStyleSheet("background-color: #1E293B; border-radius: 10px; padding: 20px;")
        control_layout = QVBoxLayout(control_panel)
        
        db_title = QLabel("공공데이터 & 스크래핑 강제 자동 동기화")
        db_title.setStyleSheet("font-size: 18px; color: #38BDF8; font-weight: bold;")
        control_layout.addWidget(db_title)
        
        desc = QLabel("네이버 블로그, 트렌드, 인구, 상가(API/Fallback) 4종 데이터를 백그라운드에서 자동 즉각 최신화합니다.\n디폴트로 4가지가 자동 등록되며, 상가 정보 강제 정밀 최신화가 필요할 때만 아래 수동 CSV를 이용하세요.")
        desc.setStyleSheet("color: #94A3B8; font-size: 14px; margin-bottom: 20px;")
        control_layout.addWidget(desc)
        
        self.sync_status_label = QLabel("서버 상태: 양호 (대기 중)")
        self.sync_status_label.setStyleSheet("color: #22C55E; font-size: 14px; font-weight: bold;")
        control_layout.addWidget(self.sync_status_label)
        
        self.btn_sync = QPushButton("🔄 4대 데이터 자동 수집 시작 (기본 동기화)")
        self.btn_sync.setCursor(Qt.PointingHandCursor)
        self.btn_sync.setFixedHeight(50)
        self.btn_sync.setStyleSheet("background-color: #0EA5E9; color: white; border-radius: 5px; font-size: 16px; font-weight: bold;")
        self.btn_sync.clicked.connect(self._start_sync)
        control_layout.addWidget(self.btn_sync)
        
        layout.addWidget(control_panel)

        # --- 패널 2: 수동 상가 CSV 업로드 ---
        csv_panel = QFrame()
        csv_panel.setStyleSheet("background-color: #1E293B; border-radius: 10px; padding: 20px;")
        csv_layout = QVBoxLayout(csv_panel)
        
        csv_title = QLabel("📁 단절 모드: 상가 데이터 수동 업로드")
        csv_title.setStyleSheet("font-size: 18px; color: #F59E0B; font-weight: bold;")
        csv_layout.addWidget(csv_title)
        
        csv_desc = QLabel("상가 데이터 API 제한에 대비해 소상공인시장진흥공단의 CSV 파일을 수동으로 밀어넣습니다.\n파일 선택 시 자동으로 타겟 지역(마스터 매핑)의 점포만 추출하여 저장됩니다.")
        csv_desc.setStyleSheet("color: #94A3B8; font-size: 14px; margin-bottom: 20px;")
        csv_layout.addWidget(csv_desc)
        
        self.csv_status_label = QLabel("CSV 상태: 업로드 대기 중")
        self.csv_status_label.setStyleSheet("color: #94A3B8; font-size: 14px; font-weight: bold;")
        csv_layout.addWidget(self.csv_status_label)
        
        self.btn_csv_upload = QPushButton("📂 전국 상가 CSV 파일 선택 및 수동 적재")
        self.btn_csv_upload.setCursor(Qt.PointingHandCursor)
        self.btn_csv_upload.setFixedHeight(50)
        self.btn_csv_upload.setStyleSheet("background-color: #F59E0B; color: white; border-radius: 5px; font-size: 16px; font-weight: bold;")
        self.btn_csv_upload.clicked.connect(self._open_file_dialog)
        csv_layout.addWidget(self.btn_csv_upload)
        
        layout.addWidget(csv_panel)
        layout.addStretch()

    def _open_file_dialog(self):
        file_path, _ = QFileDialog.getOpenFileName(self, "공공데이터 상가 CSV 파일 선택", "", "CSV Files (*.csv)")
        if file_path:
            self.btn_csv_upload.setEnabled(False)
            self.csv_status_label.setText(f"선택된 파일: {file_path.split('/')[-1]} (적재 준비 중...)")
            self.csv_status_label.setStyleSheet("color: #F59E0B;")
            self.trigger_csv_upload.emit(file_path)

    def _start_sync(self):
        self.btn_sync.setEnabled(False)
        self.sync_status_label.setText("서버 상태: 데이터 수집 중... (백그라운드 스레드 동작)")
        self.sync_status_label.setStyleSheet("color: #F59E0B;")
        self.trigger_sync.emit()

    def sync_completed(self, success):
        self.btn_sync.setEnabled(True)
        if success:
            self.sync_status_label.setText("서버 상태: 데이터 최신화 완료")
            self.sync_status_label.setStyleSheet("color: #22C55E;")
        else:
            self.sync_status_label.setText("서버 상태: 수집 중 오류 발생 (로그 확인 요망)")
            self.sync_status_label.setStyleSheet("color: #EF4444;")

    def csv_upload_completed(self, success, inserted_count, error_msg):
        self.btn_csv_upload.setEnabled(True)
        if success:
            self.csv_status_label.setText(f"완료! 성공적으로 {inserted_count:,}건의 상가 데이터를 적재했습니다.")
            self.csv_status_label.setStyleSheet("color: #22C55E;")
            QMessageBox.information(self, "업로드 완료", f"총 {inserted_count:,}건의 타겟 지역 상가 데이터가 DB에 저장되었습니다!")
        else:
            self.csv_status_label.setText("CSV 상태: 오류 발생")
            self.csv_status_label.setStyleSheet("color: #EF4444;")
            QMessageBox.critical(self, "업로드 오류", f"수동 적재 중 오류가 발생했습니다:\n{error_msg}")
