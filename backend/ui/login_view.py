# ui/login_view.py
from PySide6.QtWidgets import (QWidget, QVBoxLayout, QPushButton, QLabel, 
                               QFrame, QMessageBox, QInputDialog, QLineEdit)
from PySide6.QtCore import Qt, Signal

class LoginView(QWidget):
    user_login = Signal()
    admin_login = Signal()

    def __init__(self):
        super().__init__()
        layout = QVBoxLayout(self)
        layout.setAlignment(Qt.AlignCenter)
        
        # 진입 화면 카드 디자인
        card = QFrame()
        card.setStyleSheet("background-color: #1E293B; border-radius: 20px;")
        card.setFixedSize(500, 450)
        
        card_layout = QVBoxLayout(card)
        card_layout.setAlignment(Qt.AlignCenter)
        card_layout.setContentsMargins(40, 40, 40, 40)
        card_layout.setSpacing(20)
        
        # 아이콘 & 타이틀
        icon_label = QLabel("📊")
        icon_label.setStyleSheet("font-size: 60px;")
        card_layout.addWidget(icon_label, alignment=Qt.AlignCenter)
        
        title_label = QLabel("MZ 상권분석 AI")
        title_label.setStyleSheet("font-size: 32px; font-weight: 900; color: #38BDF8; margin-top: 10px;")
        card_layout.addWidget(title_label, alignment=Qt.AlignCenter)
        
        subtitle = QLabel("데이터 오븐에서 갓 구운 가장 정확한 창업 예측 시스템")
        subtitle.setStyleSheet("font-size: 14px; color: #94A3B8; margin-bottom: 20px;")
        card_layout.addWidget(subtitle, alignment=Qt.AlignCenter)
        
        # 유저 버튼 (창업자)
        self.btn_user = QPushButton("🧑‍💼 창업자 모드로 분석 시작하기")
        self.btn_user.setCursor(Qt.PointingHandCursor)
        self.btn_user.setFixedHeight(60)
        self.btn_user.setStyleSheet("""
            QPushButton {
                background-color: #0EA5E9; color: white; 
                font-size: 18px; font-weight: bold; border-radius: 10px;
            }
            QPushButton:hover { background-color: #0284C7; }
        """)
        self.btn_user.clicked.connect(self.user_login.emit)
        card_layout.addWidget(self.btn_user)
        
        # 관리자 버튼
        self.btn_admin = QPushButton("🛡️ 시스템 관리자 패널 접속")
        self.btn_admin.setCursor(Qt.PointingHandCursor)
        self.btn_admin.setFixedHeight(50)
        self.btn_admin.setStyleSheet("""
            QPushButton {
                background-color: transparent; color: #94A3B8; 
                font-size: 15px; font-weight: bold; 
                border-radius: 10px; border: 1px solid #475569;
            }
            QPushButton:hover { background-color: #334155; color: white; }
        """)
        self.btn_admin.clicked.connect(self._request_admin_auth)
        card_layout.addWidget(self.btn_admin)
        
        layout.addWidget(card, alignment=Qt.AlignCenter)

    def _request_admin_auth(self):
        pwd, ok = QInputDialog.getText(self, '관리자 보안 인증', '시스템 관리자 PIN 코드를 입력하세요:', QLineEdit.Password)
        if ok and pwd == '0000':
            self.admin_login.emit()
        elif ok:
            QMessageBox.warning(self, "인증 실패", "권한이 없습니다. PIN 코드를 확인하세요.")
