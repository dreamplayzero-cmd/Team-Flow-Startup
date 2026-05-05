import streamlit as st
import sys
import os

sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from core.engine.scoring_engine import ScoringEngine
from config.settings import AREA_MAP, BUNDLE_DIR
from core.engine.category_master import CategoryMaster

# 페이지 설정
st.set_page_config(page_title="MZ 상권분석 AI 테스터", page_icon="🏆", layout="wide")

@st.cache_resource
def get_engine():
    return ScoringEngine()

engine = get_engine()

st.title("🏆 MZ 상권분석 AI (Web Tester)")
st.markdown("본 페이지는 <b>데스크톱 상권분석 모델</b>의 로직을 웹으로 테스트하기 위해 구축된 프리뷰 페이지입니다.", unsafe_allow_html=True)

# 왼쪽 사이드바 (조건 입력)
with st.sidebar:
    st.header("👤 창업자 조건 입력")
    age = st.number_input("나이(만)", min_value=15, max_value=80, value=30)
    gender = st.selectbox("성별", ["남성", "여성", "무관"])
    exp = st.number_input("관련업계 경력(년)", min_value=0, max_value=50, value=0)
    capital = st.number_input("창업 자본금(만 원)", min_value=0, max_value=100000, step=1000, value=5000)
    
    st.divider()
    
    st.header("💼 비즈니스 플랜")
    industry = st.selectbox("업종 선택", CategoryMaster.get_all_names())
    target = st.selectbox("주요 타겟층", ["상관없음", "1020 학생", "2030 MZ", "3040 직장인", "가족단위"])
    op_type = st.selectbox("운영 형태", ["홀 중심", "배달 중심", "테이크아웃 중점", "홀+배달 복합"])
    op_time = st.selectbox("예상 타겟 시간", ["상관없음", "런치 타임 (직장인)", "디너 타임", "심야 영업"])
    
    st.divider()
    
    st.header("📍 비교 분석할 지역")
    area_names = list(AREA_MAP.keys())  # WHY: settings.py AREA_MAP 단일 진실 공급원에서 동적 로드
    areas = st.multiselect("최대 4개 지역 선택", area_names, default=["성수동", "이태원"])
    
    analyze_btn = st.button("🚀 분석 시작", type="primary", use_container_width=True)

# 메인 결과 출력 화면
if analyze_btn:
    if not areas:
        st.warning("상권을 하나 이상 선택해주세요.")
    else:
        # 데이터 조합
        data = {
            "age": age, "gender": gender, "experience": exp, "capital": capital,
            "industry": industry, "target": target, "op_type": op_type, "op_time": op_time,
            "areas": areas
        }
        
        area_mapping = {name: info['code'] for name, info in AREA_MAP.items()}
        
        # 엔진 회전
        with st.spinner('상권 빅데이터와 예측 AI 모델을 돌리는 중...'):
            multi_reports = []
            for area_name in areas:
                area_code = area_mapping.get(area_name, "1120067000")
                data['current_area_name'] = area_name
                
                scores = engine.calculate_area_score(area_code, data)
                report = engine.get_success_probability(scores, data)
                
                report['area_name'] = area_name
                report['final_score'] = scores['final_score']
                multi_reports.append(report)
                
            multi_reports = sorted(multi_reports, key=lambda x: x['final_score'], reverse=True)
            
        st.subheader(f"💯 가장 추천하는 지역: {multi_reports[0]['area_name']}")
        
        # 탭으로 구역 분리
        tabs = st.tabs([rep['area_name'] for rep in multi_reports])
        
        for i, rep in enumerate(multi_reports):
            with tabs[i]:
                # [NEW] Visual DNA Image 노출
                dna_res = rep.get('dna_result', {})
                img_path = dna_res.get('image_path', '')
                if img_path:
                    # [FIX] EXE 내부 번들 경로 또는 로컬 경로 결합
                    full_path = os.path.join(BUNDLE_DIR, img_path)
                    if os.path.exists(full_path):
                        st.image(full_path, caption=f"🧬 Visual DNA: {dna_res.get('dna_id')} ({dna_res.get('dna_tone')})Index: {i}", use_container_width=True)
                    else:
                        st.info(f"🎨 [Visual DNA: {dna_res.get('dna_tone')}] 이미지 준비 중 (ID: {dna_res.get('dna_id')})")

                # 종합 코멘트 박스 (HTML 지원을 위해 markdown으로 변경)
                st.markdown(
                    f"<div style='background-color:#F0F9FF; color:#0F172A; padding:20px; border-radius:10px; border-left: 5px solid #0EA5E9; font-size: 16px; font-weight: 500;'>"
                    f"{rep['comment']}</div>",
                    unsafe_allow_html=True
                )
                
                # 장단점 박스
                col1, col2 = st.columns(2)
                with col1:
                    st.success("✅ 강점 및 보너스")
                    st.markdown(rep['pros'], unsafe_allow_html=True)
                with col2:
                    st.error("🚨 주의 및 페널티")
                    st.markdown(rep['cons'], unsafe_allow_html=True)
