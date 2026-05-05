import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import '../../core/providers/audio_provider.dart';
import '../../core/providers/selection_provider.dart';
import '../../core/theme/app_theme.dart';

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
  void initState() {
    super.initState();
    debugPrint("All 9 Pages Ready for Presentation");
  }

  @override
  Widget build(BuildContext context) {
    final selection = context.watch<SelectionProvider>();

    // [DYNAMIC ROUTING FOR PRESENTATION]
    String district = selection.selectedDistrict.isNotEmpty
        ? selection.selectedDistrict
        : '성수동';
    if (!district.contains('동') && !district.contains('공원')) district += '동';

    Color themeColor = const Color(0xFF3B82F6);
    String titlePrefix = '트렌디 팝업의 성지';
    String conclusionText = 'MZ세대의 팝업 스토어 성지로서 브랜드 인지도 확산에 최적화된 상권입니다.';

    // 지역별 테마 설정
    if (district.contains('한남')) {
      district = '한남동';
      themeColor = Colors.amber;
      titlePrefix = '하이엔드 & 프리미엄';
      conclusionText = 'MZ세대 럭셔리 소비층이 밀집한 구역으로 하이엔드 브랜드 전개에 최적입니다.';
    } else if (district.contains('이태원')) {
      district = '이태원동';
      themeColor = Colors.deepPurpleAccent;
      titlePrefix = '글로벌 펍 & 다이닝';
      conclusionText = '30대 1인 가구의 야간 소비가 활발한 구역으로 개성 있는 주류 브랜드에 추천됩니다.';
    } else if (district.contains('연남')) {
      district = '연남동';
      themeColor = const Color(0xFFF472B6);
      titlePrefix = 'MZ 감성 골목';
      conclusionText = '연트럴파크를 중심으로 20대 유동인구가 압도적인 상권으로 SNS 핫플레이스 전략에 유리합니다.';
    } else {
      district = '성수동';
      themeColor = const Color(0xFF3B82F6);
      titlePrefix = '트렌디 팝업의 성지';
      conclusionText = 'MZ세대의 팝업 스토어 성지로서 브랜드 인지도 확산에 최적화된 상권입니다.';
    }

    return Center(
      child: FittedBox(
        fit: BoxFit.contain,
        child: SizedBox(
          width: 375,
          height: 812,
          child: SafeArea(
            top: false,
            child: PopScope(
              canPop: true,
              onPopInvoked: (didPop) {
                context.read<AudioProvider>().stopRegionLayer();
              },
              child: Scaffold(
                backgroundColor: AppTheme.gradientStart,
                body: Stack(
                  children: [
                    // Premium Background (Version 3)
                    Stack(
                      children: [
                        Positioned.fill(
                          child: Container(
                            decoration: const BoxDecoration(
                              gradient: LinearGradient(
                                begin: Alignment.topLeft,
                                end: Alignment.bottomRight,
                                colors: [
                                  AppTheme.gradientStart,
                                  AppTheme.gradientEnd,
                                ],
                              ),
                            ),
                          ),
                        ),
                        Positioned.fill(
                          child: Container(
                            decoration: BoxDecoration(
                              gradient: LinearGradient(
                                begin: Alignment.topCenter,
                                end: Alignment.bottomCenter,
                                colors: [
                                  Colors.black.withOpacity(0.3),
                                  AppTheme.gradientEnd.withOpacity(0.1),
                                ],
                              ),
                            ),
                          ),
                        ),
                      ],
                    ),
                    PageView(
                      controller: _reportController,
                      onPageChanged: (index) =>
                          setState(() => _currentPage = index),
                      children: [
                        _buildSummaryPage(district, themeColor, titlePrefix, selection),
                        _buildFuturePage(
                          district,
                          themeColor,
                          titlePrefix,
                          conclusionText,
                          selection,
                        ),
                      ],
                    ),
                  ],
                ),
                bottomNavigationBar: Container(
                  padding: const EdgeInsets.fromLTRB(24, 16, 24, 32),
                  decoration: BoxDecoration(
                    color: AppTheme.cardBackground.withOpacity(0.9),
                    border: Border(
                      top: BorderSide(color: Colors.white.withOpacity(0.1)),
                    ),
                  ),
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      _buildRegionalBgmSelector(),
                      const SizedBox(height: 16),
                      _buildNavigationButtons(conclusionText),
                    ],
                  ),
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildNavigationButtons(String conclusionText) {
    return Row(
      children: [
        if (_currentPage == 1)
          Expanded(
            child: OutlinedButton(
              onPressed: () => _reportController.previousPage(
                duration: 500.ms,
                curve: Curves.easeInOut,
              ),
              style: OutlinedButton.styleFrom(
                foregroundColor: AppTheme.textPrimary,
                side: BorderSide(color: AppTheme.accent.withOpacity(0.2)),
                padding: const EdgeInsets.symmetric(vertical: 18),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(15),
                ),
              ),
              child: const Text('이전 페이지'),
            ),
          ),
        if (_currentPage == 1) const SizedBox(width: 12),
        Expanded(
          child: ElevatedButton(
            onPressed: () {
              if (_currentPage == 0) {
                _reportController.nextPage(
                  duration: 500.ms,
                  curve: Curves.easeInOut,
                );
              } else {
                context.read<AudioProvider>().stopRegionLayer();
                context.go('/dashboard');
              }
            },
            style: ElevatedButton.styleFrom(
              backgroundColor: AppTheme.accent,
              foregroundColor: Colors.white,
              padding: const EdgeInsets.symmetric(vertical: 18),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(15),
              ),
            ),
            child: Text(
              _currentPage == 0 ? '다음 페이지 (미래 전망)' : '분석 완료 및 홈으로',
              style: const TextStyle(fontWeight: FontWeight.bold),
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildRegionalBgmSelector() {
    return Consumer<AudioProvider>(
      builder: (context, audio, _) {
        final regions = [
          {'name': '성수', 'file': 'seongsu.mp3'},
          {'name': '한남', 'file': 'hannam.mp3'},
          {'name': '이태원', 'file': 'itaewon.mp3'},
          {'name': '연남', 'file': 'yeonnam.mp3'},
          {'name': '가로수', 'file': 'garosu.mp3'},
          {'name': '샤로수', 'file': 'sharosu.mp3'},
          {'name': '망원', 'file': 'mangwon.mp3'},
        ];

        return Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          mainAxisSize: MainAxisSize.min,
          children: [
            const Padding(
              padding: EdgeInsets.only(left: 4, bottom: 12),
              child: Text(
                '상권 현장 사운드 레이어 (BGM)',
                style: TextStyle(
                  color: AppTheme.textSecondary,
                  fontSize: 10,
                  fontWeight: FontWeight.bold,
                  letterSpacing: 1.5,
                ),
              ),
            ),
            Wrap(
              spacing: 8,
              runSpacing: 10,
              children: regions.map((region) {
                final bool isActive = audio.activeLayer == region['file'];
                return ActionChip(
                  label: Text(
                    region['name']!,
                    style: TextStyle(
                      color: isActive ? Colors.white : AppTheme.textSecondary,
                      fontSize: 12,
                      fontWeight: isActive
                          ? FontWeight.bold
                          : FontWeight.normal,
                    ),
                  ),
                  backgroundColor: isActive
                      ? AppTheme.accent
                      : Colors.white.withOpacity(0.5),
                  onPressed: () {
                    if (isActive) {
                      audio.stopRegionLayer();
                    } else {
                      audio.playRegionLayer(region['file']!);
                    }
                  },
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(10),
                  ),
                  side: BorderSide(
                    color: isActive
                        ? AppTheme.accent
                        : AppTheme.accent.withOpacity(0.1),
                  ),
                );
              }).toList(),
            ),
          ],
        );
      },
    );
  }

  Widget _buildSummaryPage(String district, Color themeColor, String prefix, SelectionProvider selection) {
    return SingleChildScrollView(
      padding: const EdgeInsets.fromLTRB(24, 60, 24, 40),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          ClipRRect(
            borderRadius: BorderRadius.circular(30),
            child: Stack(
              children: [
                _getDynamicImage('summary', selection),
                Container(
                  height: 140,
                  decoration: BoxDecoration(
                    gradient: LinearGradient(
                      begin: Alignment.topCenter,
                      end: Alignment.bottomCenter,
                      colors: [
                        Colors.transparent,
                        Colors.black.withOpacity(0.4),
                      ],
                    ),
                  ),
                ),
                Positioned(
                  bottom: 12,
                  right: 12,
                  child: Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 8,
                      vertical: 4,
                    ),
                    decoration: BoxDecoration(
                      color: Colors.black54,
                      borderRadius: BorderRadius.circular(6),
                    ),
                    child: const Text(
                      '출처: Sovereign Insight Data Engine',
                      style: TextStyle(color: Colors.white, fontSize: 9),
                    ),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 12),
          Text(
            district,
            style: const TextStyle(
              color: AppTheme.textPrimary,
              fontSize: 28,
              fontWeight: FontWeight.bold,
            ),
          ),
          Text(
            prefix,
            style: TextStyle(color: AppTheme.textSecondary, fontSize: 14),
          ),
          const SizedBox(height: 40),
          Text(
            '$district 리포트',
            style: const TextStyle(
              color: AppTheme.accent,
              fontWeight: FontWeight.bold,
              letterSpacing: 1.2,
            ),
          ),
          const Text(
            'AI 상권 평가지수',
            style: TextStyle(
              color: AppTheme.textPrimary,
              fontSize: 24,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 32),
          _buildEvaluationBar('입지 적합도', 0.95, AppTheme.accent),
          _buildEvaluationBar('유동인구 지수', 0.88, AppTheme.accent),
          _buildEvaluationBar('MZ 타겟 집중도', 0.92, AppTheme.accent),
          _buildEvaluationBar('SNS 활용지수', 0.86, AppTheme.accent),
          _buildEvaluationBar('평균 매출 잠재력', 0.84, AppTheme.accent),
          const SizedBox(height: 24),
          _buildIndicatorSection(),
          const SizedBox(height: 32),
          _buildNavigationButtons('MZ세대의 팝업 스토어 성지로서 브랜드 인지도 확산에 최적화된 상권입니다.'),
        ],
      ),
    );
  }

  Widget _buildEvaluationBar(String label, double value, Color color) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                label,
                style: const TextStyle(
                  color: AppTheme.textSecondary,
                  fontSize: 14,
                ),
              ),
              Text(
                '${(value * 100).toInt()}%',
                style: TextStyle(color: color, fontWeight: FontWeight.bold),
              ),
            ],
          ),
          const SizedBox(height: 10),
          LinearProgressIndicator(
            value: value,
            backgroundColor: AppTheme.accent.withOpacity(0.1),
            valueColor: AlwaysStoppedAnimation<Color>(color),
            minHeight: 6,
            borderRadius: BorderRadius.circular(3),
          ),
        ],
      ),
    );
  }

  Widget _buildIndicatorSection() {
    return Row(
      children: [
        Expanded(
          child: _buildIndicatorBox('긍정적 지표', [
            '화제성 집중 상권',
            '목적형 방문객',
            '팬덤 형성 유리',
          ], Colors.greenAccent),
        ),
        const SizedBox(width: 16),
        Expanded(
          child: _buildIndicatorBox('리스크 요인', [
            '높은 임대료',
            '과잉 경쟁',
            '수요 변동성',
          ], Colors.redAccent),
        ),
      ],
    );
  }

  Widget _buildIndicatorBox(String title, List<String> items, Color color) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: AppTheme.cardBackground.withOpacity(0.6),
        borderRadius: BorderRadius.circular(24),
        border: Border.all(color: color.withOpacity(0.3)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            title,
            style: TextStyle(
              color: color,
              fontWeight: FontWeight.bold,
              fontSize: 14,
            ),
          ),
          const SizedBox(height: 16),
          ...items.map(
            (item) => Padding(
              padding: const EdgeInsets.only(bottom: 8),
              child: Row(
                children: [
                  Icon(Icons.check_circle_rounded, color: color, size: 12),
                  const SizedBox(width: 8),
                  Expanded(
                    child: Text(
                      item,
                      style: const TextStyle(
                        color: AppTheme.textPrimary,
                        fontSize: 11,
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _getDynamicImage(String type, SelectionProvider selection) {
    String district = selection.selectedDistrict;
    if (district.isEmpty) district = '성수동';

    String industry = selection.industry;
    String concept = selection.concept;
    
    // [CSI FIX] Enhanced Mapping for Local Optimized Assets
    bool isPub = industry.contains('술집');
    bool isCafe = industry.contains('카페');
    bool isFashion = industry.contains('편집샵');
    bool isDining = industry.contains('브런치') || industry.contains('한식');

    String areaCode = district.contains('한남') ? 'HN' : 'SS';
    String styleCode = concept == '럭셔리' ? 'MC' : 'ID'; // MC: Modern Chic, ID: Industrial Vintage
    String areaName = areaCode == 'HN' ? 'Hannam' : 'Seongsu';
    String styleName = styleCode == 'MC' ? 'ModernChic' : 'IndustrialVintage';

    if (type == 'summary') {
      // Main Page Image - Precise Local Mapping
      String localPath = 'assets/images/map_fallback.png';
      
      if (isCafe) {
        localPath = 'assets/images/${areaCode}_${styleCode}_02_${areaName}_Cafe_${styleName}.jpg';
      } else if (isDining) {
        localPath = 'assets/images/${areaCode}_${styleCode}_01_${areaName}_Dining_${styleName}.jpg';
      } else if (isFashion) {
        localPath = areaCode == 'SS' 
            ? 'assets/images/SS_MC_01_Seongsu_EditShop_ModernChic.jpg'
            : 'assets/images/HN_MN_01_Hannam_EditShop_MinimalBasic.jpg';
      }

      return Container(
        height: 180,
        width: double.infinity,
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(24),
          image: DecorationImage(
            image: AssetImage(localPath),
            fit: BoxFit.cover,
            onError: (e, s) => const AssetImage('assets/images/map_fallback.png'),
          ),
        ),
      );
    } else if (type == 'gis') {
      // Page 8 GIS/Future Scenario
      String imageUrl = 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&q=80&w=800';
      switch (_selectedHorizon) {
        case '1년 뒤':
          imageUrl = 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&q=80&w=800';
          break;
        case '3년 뒤':
          imageUrl = 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800';
          break;
      }

      return Container(
        height: 200,
        width: double.infinity,
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(24),
          image: DecorationImage(
            image: NetworkImage(imageUrl),
            fit: BoxFit.cover,
          ),
        ),
      );
    } else {
      // Page 9 Clustering / Industrial Art
      String artPath = 'assets/images/future_scenario.png';
      if (isPub) artPath = 'assets/images/pub_art.png';
      else if (isCafe) artPath = 'assets/images/coffee_art.png';
      else if (isFashion) artPath = 'assets/images/fashion_art.png';
      else if (isDining) artPath = 'assets/images/dining_art.png';

      return Container(
        height: 220,
        width: double.infinity,
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(24),
          image: DecorationImage(
            image: AssetImage(artPath),
            fit: BoxFit.cover,
            onError: (e, s) => const AssetImage('assets/images/future_scenario.png'),
          ),
        ),
      );
    }
  }


  Widget _buildClusteringText() {
    String title = '';
    String subtitle = '';

    switch (_selectedHorizon) {
      case '1년 뒤':
        title = '1년 뒤 상권 변화 예측';
        subtitle = '새롭게 떠오르는 핫플레이스 골목과 확장되는 업종';
        break;
      case '3년 뒤':
        title = '3년 뒤 상권의 미래 모습';
        subtitle = '대형 브랜드의 진입과 상권의 최종 진화 단계';
        break;
      default: // 현재
        title = '현재 상권 핵심 구역 분석';
        subtitle = '가장 유동인구가 많고 소비가 활발한 메인 거리';
        break;
    }

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          title,
          style: const TextStyle(
            color: Colors.white,
            fontSize: 16,
            fontWeight: FontWeight.bold,
          ),
        ),
        const SizedBox(height: 4),
        Text(
          subtitle,
          style: const TextStyle(color: Colors.white70, fontSize: 11),
        ),
      ],
    );
  }

  Widget _buildFuturePage(
    String district,
    Color themeColor,
    String titlePrefix,
    String conclusionText,
    SelectionProvider selection,
  ) {
    return SingleChildScrollView(
      padding: const EdgeInsets.fromLTRB(24, 60, 24, 40),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            '빅데이터 위치 정밀 분석',
            style: TextStyle(
              color: AppTheme.accent,
              fontWeight: FontWeight.bold,
            ),
          ),
          Text(
            '$district 상권 분포 및 예측',
            style: const TextStyle(
              color: AppTheme.textPrimary,
              fontSize: 22,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 32),

          // Timeline Tabs (현재, 1년 뒤, 3년 뒤)
          Center(
            child: Container(
              padding: const EdgeInsets.all(4),
              decoration: BoxDecoration(
                color: AppTheme.cardBackground.withOpacity(0.5),
                borderRadius: BorderRadius.circular(15),
              ),
              child: Row(
                mainAxisSize: MainAxisSize.min,
                children: ['현재', '1년 뒤', '3년 뒤'].map((period) {
                  bool isSelected = _selectedHorizon == period;
                  return GestureDetector(
                    onTap: () => setState(() => _selectedHorizon = period),
                    child: Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 20,
                        vertical: 10,
                      ),
                      decoration: BoxDecoration(
                        color: isSelected
                            ? AppTheme.accent
                            : Colors.transparent,
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Text(
                        period,
                        style: TextStyle(
                          color: isSelected
                              ? Colors.white
                              : AppTheme.textSecondary,
                          fontSize: 13,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                  );
                }).toList(),
              ),
            ),
          ),
          const SizedBox(height: 32),

          Text(
            '추천 입지 매장 이미지 ($_selectedHorizon)',
            style: const TextStyle(color: AppTheme.textSecondary, fontSize: 14),
          ),
          const SizedBox(height: 16),
          ClipRRect(
            borderRadius: BorderRadius.circular(24),
            child: Stack(
              children: [
                _getDynamicImage('gis', selection),
                Positioned(
                  bottom: 12,
                  right: 12,
                  child: Opacity(
                    opacity: 0.4,
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.end,
                      children: const [
                        Text(
                          'SOURCE: 서울시 공공데이터 광장',
                          style: TextStyle(color: Colors.white, fontSize: 7, fontWeight: FontWeight.w900, letterSpacing: 1.0),
                        ),
                        Text(
                          '위치 정보 분석 엔진 V 2.0',
                          style: TextStyle(color: Colors.white, fontSize: 7, fontWeight: FontWeight.w900, letterSpacing: 1.0),
                        ),
                        Text(
                          'SOURCE: Sovereign Insight Data Engine',
                          style: TextStyle(color: Colors.white, fontSize: 7, fontWeight: FontWeight.w900, letterSpacing: 1.0),
                        ),
                      ],
                    ),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 40),

          const Text(
            '상권 주력 업종 변화 분석',
            style: TextStyle(color: AppTheme.textSecondary, fontSize: 14),
          ),
          const SizedBox(height: 16),
          ClipRRect(
            borderRadius: BorderRadius.circular(24),
            child: Stack(
              children: [
                _getDynamicImage('clustering', selection),
                // [CSI CLEANUP] Removed bottom-left text overlays to show customized industry art clearly
                Positioned(
                  bottom: 12,
                  right: 12,
                  child: Opacity(
                    opacity: 0.4,
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.end,
                      children: const [
                        Text(
                          'SOURCE: 서울시 공공데이터 광장',
                          style: TextStyle(color: Colors.white, fontSize: 7, fontWeight: FontWeight.w900, letterSpacing: 1.0),
                        ),
                        Text(
                          '위치 정보 분석 엔진 V 2.0',
                          style: TextStyle(color: Colors.white, fontSize: 7, fontWeight: FontWeight.w900, letterSpacing: 1.0),
                        ),
                        Text(
                          'SOURCE: Sovereign Insight Data Engine',
                          style: TextStyle(color: Colors.white, fontSize: 7, fontWeight: FontWeight.w900, letterSpacing: 1.0),
                        ),
                      ],
                    ),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 40),

          const Text(
            '최종 분석 리포트 결론',
            style: TextStyle(
              color: AppTheme.textPrimary,
              fontSize: 20,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 16),
          Text(
            '귀하의 브랜드 가치는 본 상권의 핵심 가치인 $titlePrefix와 95% 일치합니다. $conclusionText 특히 데이터 분석 결과, $district 중심부 클러스터가 가장 유망한 입지로 분석됩니다. 시점 분석 결과, $district 상권은 $_selectedHorizon 시점에 최적의 투자 수익률(ROI)을 달성할 것으로 예측됩니다.',
            style: const TextStyle(
              color: AppTheme.textPrimary,
              fontSize: 15,
              height: 1.8,
            ),
          ),
        ],
      ),
    ).animate().fadeIn();
  }
}
