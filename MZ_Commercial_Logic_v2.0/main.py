# main.py
import sys
from PySide6.QtWidgets import QApplication
from ui.main_window import MainWindow
from ui.login_view import LoginView
from ui.admin_view import AdminView
from ui.input_view import InputView
from ui.result_view import ResultView
from core.engine.scoring_engine import ScoringEngine
from config.settings import AREA_MAP

class MZApp:
    def __init__(self):
        self.app = QApplication(sys.argv)
        self.window = MainWindow()
        self.engine = ScoringEngine()

        # 뷰 생성
        self.login_view = LoginView()
        self.input_view = InputView()
        self.admin_view = AdminView()
        
        # 뷰 라우팅 및 연동
        self.window.set_views(self.login_view, self.input_view, self.admin_view)
        
        # 시그널 연결
        self.login_view.user_login.connect(self.window.show_user_dashboard)
        self.login_view.admin_login.connect(self.window.show_admin_dashboard)
        self.admin_view.go_back.connect(self.window.show_login_view)
        self.admin_view.trigger_sync.connect(self.window.run_manual_sync)
        
        self.input_view.start_analysis.connect(self.run_analysis)
        
        # 최초 앱 시작 시 로그인 화면 띄우기
        self.window.show_login_view()
        self.window.show()

    def run_analysis(self, data):
        """사용자 입력을 받아 분석을 수행하고 결과를 표시"""
        # area name -> area code 매핑 (WHY: settings.py AREA_MAP 단일 진실 공급원에서 동적 빌드)
        area_mapping = {name: info['code'] for name, info in AREA_MAP.items()}
        
        # 0. 검색 기록 저장
        try: primary_code = area_mapping.get(data['areas'][0], "1120067000")
        except: primary_code = "1120067000"
        self.engine.save_founder_input(primary_code, data)
        
        # 1. & 2. 다중 상권 점수 계산 및 리포트 생성
        multi_reports = []
        best_report = None
        highest_score = -1
        
        for area_name in data['areas']:
            area_code = area_mapping.get(area_name, "1120067000")
            data['current_area_name'] = area_name
            
            # data 자체를 통째로 넘겨서 동적 가중치(op_type 등)를 받도록 수정
            scores = self.engine.calculate_area_score(area_code, data)
            report = self.engine.get_success_probability(scores, data)
            
            report['area_name'] = area_name
            report['final_score'] = scores['final_score']
            
            multi_reports.append(report)
            
            # 최고 점수 상권 찾기
            if scores['final_score'] > highest_score:
                highest_score = scores['final_score']
                best_report = report
                
        # 3. 결과 뷰로 전환 (전체 리스트 전달)
        if multi_reports:
            # 베스트 상권 코멘트 하이라이팅
            best_report['comment'] = f"🏆 **최적의 상권: {best_report['area_name']}**\n\n" + best_report['comment']
            
            self.result_view = ResultView(multi_reports)
            self.result_view.back_to_main.connect(self.window.show_user_dashboard)
            self.window.show_result_view(self.result_view)



    def run(self):
        sys.exit(self.app.exec())

if __name__ == "__main__":
    app = MZApp()
    app.run()
