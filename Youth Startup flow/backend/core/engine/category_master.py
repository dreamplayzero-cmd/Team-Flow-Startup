# core/engine/category_master.py

class CategoryMaster:
    """업종 데이터, 클러스터링 그룹, 시각적 DNA 매칭을 관리하는 마스터 클래스"""
    
    CATEGORIES = {
        "카페": {
            "code": "fnb_01",
            "gis_code": "CF",
            "cluster": "Social Hub",
            "dna": "Warm Wood",
            "description": "지역 소통의 중심이 되는 커뮤니티 공간"
        },
        "디저트": {
            "code": "fnb_02",
            "gis_code": "CF",
            "cluster": "Social Hub",
            "dna": "Minimal Basic",
            "description": "시각적 즐거움과 달콤함을 제공하는 공간"
        },
        "브런치": {
            "code": "fnb_03",
            "gis_code": "DN",
            "cluster": "Premium Curation",
            "dna": "Modern Chic",
            "description": "여유로운 오전의 프리미엄 식문화 공간"
        },
        "파스타": {
            "code": "fnb_04",
            "gis_code": "DN",
            "cluster": "Young Date Course",
            "dna": "Modern Chic",
            "description": "젊은 층의 데이트를 주도하는 세련된 식사 공간"
        },
        "고기집": {
            "code": "fnb_05",
            "gis_code": "DN",
            "cluster": "Traditional",
            "dna": "Warm Wood",
            "description": "전통적인 맛과 정겨운 분위기의 식사 공간"
        },
        "술집": {
            "code": "fnb_06",
            "gis_code": "DN",
            "cluster": "Night Life",
            "dna": "Industrial Vintage",
            "description": "상권의 밤을 책임지는 에너지 넘치는 공간"
        },
        "베이커리": {
            "code": "fnb_07",
            "gis_code": "CF",
            "cluster": "Social Hub",
            "dna": "Warm Wood",
            "description": "매일 구워내는 신선함과 따뜻함이 있는 공간"
        },
        "패션 편집샵": {
            "code": "ret_01",
            "gis_code": "RS",
            "cluster": "Premium Curation",
            "dna": "Modern Chic",
            "description": "브랜드의 정체성과 스타일을 제안하는 큐레이션 공간"
        },
        "라이프스타일/소품샵": {
            "code": "ret_02",
            "gis_code": "RS",
            "cluster": "Aesthetic Mood",
            "dna": "Industrial Vintage",
            "description": "공간의 분위기를 완성하는 감성적인 리테일 공간"
        },
        "셀프 사진관": {
            "code": "ret_03",
            "gis_code": "RS",
            "cluster": "Young Date Course",
            "dna": "Minimal Basic",
            "description": "MZ세대의 추억과 현재를 기록하는 레코드 공간"
        }
    }

    @classmethod
    def get_all_names(cls):
        return list(cls.CATEGORIES.keys())

    @classmethod
    def get_info(cls, name):
        return cls.CATEGORIES.get(name, {
            "code": "unknown",
            "gis_code": "XX",
            "cluster": "General",
            "dna": "None",
            "description": "정의되지 않은 업종"
        })

    @classmethod
    def get_synergy_cluster(cls, name):
        info = cls.get_info(name)
        return info["cluster"]
