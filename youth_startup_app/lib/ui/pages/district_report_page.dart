import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:go_router/go_router.dart';

class DistrictReportPage extends StatefulWidget {
  const DistrictReportPage({super.key});

  @override
  State<DistrictReportPage> createState() => _DistrictReportPageState();
}

class _DistrictReportPageState extends State<DistrictReportPage> {
  final PageController _reportController = PageController();
  int _currentPage = 0;
  String _selectedHorizon = '현재';

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF0F172A),
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new_rounded, color: Colors.white),
          onPressed: () => context.pop(),
        ),
        title: Text('분석 결과 리포트 (${_currentPage + 1}/2)', 
          style: const TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.bold)),
        centerTitle: true,
      ),
      body: PageView(
        controller: _reportController,
        onPageChanged: (index) => setState(() => _currentPage = index),
        children: [
          _buildSummaryPage(),
          _buildFuturePage(),
        ],
      ),
      bottomNavigationBar: Container(
        padding: const EdgeInsets.fromLTRB(24, 0, 24, 32),
        child: Row(
          children: [
            if (_currentPage == 1)
              Expanded(
                child: OutlinedButton(
                  onPressed: () => _reportController.previousPage(duration: 500.ms, curve: Curves.easeInOut),
                  style: OutlinedButton.styleFrom(
                    foregroundColor: Colors.white,
                    side: BorderSide(color: Colors.white.withValues(alpha: 0.2)),
                    padding: const EdgeInsets.symmetric(vertical: 18),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(15)),
                  ),
                  child: const Text('이전 페이지'),
                ),
              ),
            if (_currentPage == 1) const SizedBox(width: 12),
            Expanded(
              child: ElevatedButton(
                onPressed: () {
                  if (_currentPage == 0) {
                    _reportController.nextPage(duration: 500.ms, curve: Curves.easeInOut);
                  } else {
                    context.go('/dashboard');
                  }
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.white,
                  foregroundColor: Colors.black,
                  padding: const EdgeInsets.symmetric(vertical: 18),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(15)),
                ),
                child: Text(_currentPage == 0 ? '다음 페이지 (미래 전망)' : '분석 완료 및 홈으로', 
                  style: const TextStyle(fontWeight: FontWeight.bold)),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildSummaryPage() {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(24),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            height: 200,
            width: double.infinity,
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(24),
              image: const DecorationImage(
                image: NetworkImage('https://images.unsplash.com/photo-1514933651103-005eec06c04b?q=80&w=2674&auto=format&fit=crop'),
                fit: BoxFit.cover,
              ),
            ),
          ).animate().fadeIn().scale(),
          const SizedBox(height: 32),
          const Text('브랜드 가치 분석 결과', style: TextStyle(color: Colors.blueAccent, fontWeight: FontWeight.bold, letterSpacing: 1.2)),
          const Text('AI 상권 평가지수', style: TextStyle(color: Colors.white, fontSize: 28, fontWeight: FontWeight.bold)),
          const SizedBox(height: 24),
          _buildEvaluationBar('입지 적합도', 0.95),
          _buildEvaluationBar('유동인구 지수', 0.88),
          _buildEvaluationBar('MZ 타겟 집중도', 0.92),
          _buildEvaluationBar('SNS 활용지수 📱', 0.86),
          _buildEvaluationBar('평균 매출 잠재력', 0.84),
          _buildEvaluationBar('재방문 의사', 0.78),
          const SizedBox(height: 32),
          _buildIndicatorSection(),
        ],
      ),
    );
  }

  Widget _buildEvaluationBar(String label, double value) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(label, style: const TextStyle(color: Colors.white70, fontSize: 14)),
              Text('${(value * 100).toInt()}%', style: const TextStyle(color: Colors.blueAccent, fontWeight: FontWeight.bold)),
            ],
          ),
          const SizedBox(height: 8),
          LinearProgressIndicator(
            value: value,
            backgroundColor: Colors.white10,
            valueColor: AlwaysStoppedAnimation<Color>(label.contains('SNS') ? Colors.purpleAccent : const Color(0xFF3B82F6)),
            minHeight: 6,
            borderRadius: BorderRadius.circular(3),
          ),
        ],
      ),
    ).animate().fadeIn(delay: 200.ms).slideX(begin: 0.1, end: 0);
  }

  Widget _buildIndicatorSection() {
    return Row(
      children: [
        Expanded(
          child: _buildIndicatorBox('긍정적 지표', [
            '화제성 집중 상권',
            '목적형 방문객 위주',
            '브랜드 팬덤 형성 유리',
          ], Colors.greenAccent),
        ),
        const SizedBox(width: 16),
        Expanded(
          child: _buildIndicatorBox('리스크 요인', [
            '높은 임대료 부담',
            '과잉 경쟁 우려',
            '계절적 수요 변동',
          ], Colors.redAccent),
        ),
      ],
    );
  }

  Widget _buildIndicatorBox(String title, List<String> items, Color color) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: const Color(0xFF1E293B),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: color.withValues(alpha: 0.2)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(title, style: TextStyle(color: color, fontWeight: FontWeight.bold, fontSize: 14)),
          const SizedBox(height: 12),
          ...items.map((item) => Padding(
            padding: const EdgeInsets.only(bottom: 6),
            child: Row(
              children: [
                Icon(Icons.check_circle_outline_rounded, color: color, size: 12),
                const SizedBox(width: 6),
                Expanded(child: Text(item, style: const TextStyle(color: Colors.white54, fontSize: 11))),
              ],
            ),
          )),
        ],
      ),
    );
  }

  Widget _buildFuturePage() {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(24),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text('빅데이터 위치 정밀 분석', style: TextStyle(color: Colors.blueAccent, fontWeight: FontWeight.bold)),
          const Text('주변 업종 분포 및 그룹 분석', style: TextStyle(color: Colors.white, fontSize: 26, fontWeight: FontWeight.bold)),
          const SizedBox(height: 24),
          const Text('추천 입지 매장 이미지 (GIS 데이터)', style: TextStyle(color: Colors.white70, fontSize: 14)),
          const SizedBox(height: 16),
          SizedBox(
            height: 150,
            child: ListView(
              scrollDirection: Axis.horizontal,
              children: [
                _buildGisStoreCard('https://images.unsplash.com/photo-1559925393-8be0ec4767c8?q=80&w=2671&auto=format&fit=crop'),
                _buildGisStoreCard('https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=2647&auto=format&fit=crop'),
                _buildGisStoreCard('https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2669&auto=format&fit=crop'),
              ],
            ),
          ),
          const SizedBox(height: 32),
          // 시점별 예측 모델 탭
          Center(
            child: Container(
              padding: const EdgeInsets.all(4),
              decoration: BoxDecoration(color: const Color(0xFF1E293B), borderRadius: BorderRadius.circular(12)),
              child: Row(
                mainAxisSize: MainAxisSize.min,
                children: ['현재', '1년 뒤', '3년 뒤'].map((period) {
                  bool isSelected = _selectedHorizon == period;
                  return GestureDetector(
                    onTap: () => setState(() => _selectedHorizon = period),
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                      decoration: BoxDecoration(
                        color: isSelected ? const Color(0xFF3B82F6) : Colors.transparent,
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: Text(period, style: TextStyle(color: isSelected ? Colors.white : Colors.white38, fontSize: 12, fontWeight: FontWeight.bold)),
                    ),
                  );
                }).toList(),
              ),
            ),
          ),
          const SizedBox(height: 24),
          Text('상권 주력 업종의 변화 (AI 예측)', style: const TextStyle(color: Colors.white70, fontSize: 14)),
          const SizedBox(height: 16),
          Container(
            height: 280,
            width: double.infinity,
            decoration: BoxDecoration(
              color: const Color(0xFF1E293B),
              borderRadius: BorderRadius.circular(24),
              border: Border.all(color: Colors.white.withOpacity(0.05)),
            ),
            child: ClipRRect(
              borderRadius: BorderRadius.circular(24),
              child: Stack(
                children: [
                  // 1. Seoul Map Background (Static for all terms)
                  Positioned.fill(
                    child: Image.network(
                      'https://images.unsplash.com/photo-1510333300282-f84807a93946?q=80&w=2669&auto=format&fit=crop',
                      fit: BoxFit.cover,
                      color: Colors.black.withOpacity(0.4),
                      colorBlendMode: BlendMode.darken,
                    ),
                  ),
                  
                  // 2. Static Clustering Dots (Varies by horizon)
                  ..._buildStaticClusterDots(),

                  // 3. Info Overlay
                  Positioned(
                    right: 16,
                    bottom: 16,
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.end,
                      children: [
                        Text('예측 시점: $_selectedHorizon', style: const TextStyle(color: Colors.white70, fontSize: 8)),
                        const Text('위치: 성수동 연무장길 일대', style: TextStyle(color: Colors.white70, fontSize: 8)),
                        const Text('데이터: 공공데이터포털, GIS 상권분석 시스템', style: TextStyle(color: Colors.white70, fontSize: 8)),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),
          // 범례 (Legend) 섹션
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: Colors.black.withOpacity(0.2),
              borderRadius: const BorderRadius.vertical(bottom: Radius.circular(24)),
            ),
            child: Wrap(
              spacing: 12,
              runSpacing: 8,
              children: [
                _buildLegendItem('F&B (식음료)', Colors.orangeAccent),
                _buildLegendItem('패션/리테일', Colors.tealAccent),
                _buildLegendItem('문화/예술', Colors.purpleAccent),
                _buildLegendItem('서비스/테크', Colors.blueAccent),
              ],
            ),
          ),
          const SizedBox(height: 20),
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: Colors.blueAccent.withOpacity(0.05),
              borderRadius: BorderRadius.circular(15),
              border: Border.all(color: Colors.blueAccent.withOpacity(0.1)),
            ),
            child: Text(
              _selectedHorizon == '현재'
                ? '💡 점의 의미: 지도 위의 점은 특정 업종이 모인 구역입니다. 현재 성수동은 음식점(주황)과 패션(민트)이 6:4 비율로 섞여 있어 가장 활발한 복합 상권입니다.'
                : _selectedHorizon == '1년 뒤'
                  ? '💡 전망 분석: 1년 뒤에는 성수역 인근 직장인 유입이 늘며 점심 시간대 음식점(주황색 점)의 밀도가 15% 더 높아질 것으로 보입니다.'
                  : '💡 장기 예측: 3년 뒤에는 문화 공간(보라색 점)이 넓게 퍼지며, 주말뿐만 아니라 평일에도 관광객이 붐비는 대형 상권으로 성장할 것입니다.',
              style: const TextStyle(color: Colors.blueAccent, fontSize: 12, height: 1.5),
            ),
          ),
          const SizedBox(height: 32),
          const Text('최종 분석 리포트 결론', style: TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold)),
          const SizedBox(height: 16),
          const Text(
            '귀하의 브랜드 가치는 본 상권의 주 소비층인 MZ세대의 니즈와 95% 일치합니다. 특히 SNS 활용지수가 매우 높게 나타나 디지털 마케팅 전략이 핵심 성공 요인입니다. GIS 분석 결과, 연무장길 서측 클러스터가 가장 유망한 입지로 분석됩니다.',
            style: TextStyle(color: Colors.white70, fontSize: 14, height: 1.6),
          ),
        ],
      ),
    ).animate().fadeIn();
  }

  Widget _buildLegendItem(String label, Color color) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        Container(width: 8, height: 8, decoration: BoxDecoration(color: color, shape: BoxShape.circle)),
        const SizedBox(width: 6),
        Text(label, style: const TextStyle(color: Colors.white70, fontSize: 10)),
      ],
    );
  }

  Widget _buildGisStoreCard(String imgUrl) {
    return Container(
      width: 200,
      margin: const EdgeInsets.only(right: 16),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(20),
        image: DecorationImage(image: NetworkImage(imgUrl), fit: BoxFit.cover),
      ),
    );
  }

  Widget _buildStatRow(String label, String value, Color color) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(label, style: const TextStyle(color: Colors.white54, fontSize: 16)),
          Text(value, style: TextStyle(color: color, fontSize: 18, fontWeight: FontWeight.bold)),
        ],
      ),
    );
  }

  Widget _buildFutureCard(String title, String desc, String imgUrl) {
    return Container(
      height: 140,
      width: double.infinity,
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(20),
        image: DecorationImage(image: NetworkImage(imgUrl), fit: BoxFit.cover, colorFilter: ColorFilter.mode(Colors.black.withOpacity(0.5), BlendMode.darken)),
      ),
      padding: const EdgeInsets.all(20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisAlignment: MainAxisAlignment.end,
        children: [
          Text(title, style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 18)),
          Text(desc, style: const TextStyle(color: Colors.white70, fontSize: 13)),
        ],
      ),
    );
  }

  Widget _buildStrategyItem(String text) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: Row(
        children: [
          const Icon(Icons.check_circle_outline_rounded, color: Colors.blueAccent, size: 20),
          const SizedBox(width: 12),
          Expanded(child: Text(text, style: const TextStyle(color: Colors.white70, fontSize: 14))),
        ],
      ),
    );
  }

  List<Widget> _buildStaticClusterDots() {
    switch (_selectedHorizon) {
      case '1년 뒤':
        return [
          _buildStaticDot(0.35, 0.40, Colors.orangeAccent),
          _buildStaticDot(0.55, 0.30, Colors.tealAccent),
          _buildStaticDot(0.45, 0.60, Colors.deepPurpleAccent),
        ];
      case '3년 뒤':
        return [
          _buildStaticDot(0.32, 0.38, Colors.orangeAccent),
          _buildStaticDot(0.38, 0.42, Colors.orangeAccent),
          _buildStaticDot(0.58, 0.28, Colors.tealAccent),
          _buildStaticDot(0.52, 0.32, Colors.tealAccent),
          _buildStaticDot(0.48, 0.65, Colors.deepPurpleAccent),
          _buildStaticDot(0.65, 0.50, Colors.blueAccent),
        ];
      default: // 현재
        return [
          _buildStaticDot(0.40, 0.45, Colors.orangeAccent),
          _buildStaticDot(0.50, 0.35, Colors.tealAccent),
        ];
    }
  }

  Widget _buildStaticDot(double x, double y, Color color) {
    return Align(
      alignment: Alignment(x * 2 - 1, y * 2 - 1),
      child: Container(
        width: 12,
        height: 12,
        decoration: BoxDecoration(
          color: color,
          shape: BoxShape.circle,
          border: Border.all(color: Colors.white, width: 2),
          boxShadow: [BoxShadow(color: color.withOpacity(0.5), blurRadius: 10)],
        ),
      ),
    );
  }
}
