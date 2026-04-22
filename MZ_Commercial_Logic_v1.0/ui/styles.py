# ui/styles.py

MAIN_STYLE = """
QMainWindow {
    background-color: #0F172A;
}

QWidget {
    color: #F8FAFC;
    font-family: 'Inter', 'Segoe UI', sans-serif;
}

/* GroupBox as Card */
QGroupBox {
    background-color: #1E293B;
    border: 1px solid #334155;
    border-radius: 12px;
    margin-top: 20px;
    padding-top: 20px;
}
QGroupBox::title {
    subcontrol-origin: margin;
    subcontrol-position: top left;
    left: 15px;
    padding: 0 5px;
    color: #38BDF8;
    font-weight: bold;
}

/* Input Fields */
QLineEdit, QComboBox, QTextEdit {
    background-color: #0F172A;
    border: 1px solid #334155;
    border-radius: 8px;
    padding: 10px;
    color: #F1F5F9;
}
QLineEdit:focus, QComboBox:focus {
    border: 2px solid #38BDF8;
}

/* Buttons */
QPushButton {
    background-color: #38BDF8;
    color: #0F172A;
    border: none;
    border-radius: 8px;
    padding: 12px 24px;
    font-weight: bold;
    font-size: 14px;
}
QPushButton:hover {
    background-color: #7DD3FC;
}
QPushButton:pressed {
    background-color: #0EA5E9;
}

/* Result Labels */
QLabel#ScoreLabel {
    font-size: 48px;
    color: #38BDF8;
    font-weight: 900;
}

QLabel#ReportLabel {
    font-size: 16px;
    line-height: 1.5;
    background-color: #1E293B;
    border-left: 4px solid #38BDF8;
    padding: 15px;
    border-radius: 4px;
}
"""
