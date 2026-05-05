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
    
    // [CSI SPEED OPTIMIZATION] Precache key images for instant, flicker-free display
    WidgetsBinding.instance.addPostFrameCallback((_) {
      final audio = context.read<AudioProvider>();
      final selection = context.read<SelectionProvider>();
      
      // Pre-loading heavy assets into memory for MZ-standard speed
      precacheImage(const AssetImage('assets/images/recommendation_present.png'), context);
      precacheImage(const AssetImage('assets/images/recommendation_1yr.png'), context);
      
      String district = selection.selectedDistrict.isNotEmpty ? selection.selectedDistrict : '한남';
      
      // Mapping district to its respective BGM file
      String bgmFile = 'hannam.mp3'; // Default
      if (district.contains('성수')) bgmFile = 'seongsu.mp3';
      else if (district.contains('이태원')) bgmFile = 'itaewon.mp3';
      else if (district.contains('연남')) bgmFile = 'yeonnam.mp3';
      else if (district.contains('가로수')) bgmFile = 'garosu.mp3';
      else if (district.contains('샤로수')) bgmFile = 'sharosu.mp3';
      else if (district.contains('망원')) bgmFile = 'mangwon.mp3';
      
      audio.playRegionLayer(bgmFile);
      debugPrint("CSI AUTO BGM: Triggered $bgmFile for $district");
    });
  }

  @override
  Widget build(BuildContext context) {
    final selection = context.watch<SelectionProvider>();

    // [CSI DYNAMIC CONTEXT] Compute display properties based on the current page index
    List<Map<String, dynamic>> districtConfigs = [
      {'name': '성수동', 'color': const Color(0xFF3B82F6), 'prefix': '트렌디 팝업의 성지', 'conclusion': 'MZ세대의 팝업 스토어 성지로서 브랜드 인지도 확산에 최적화된 상권입니다.'},
      {'name': '한남동', 'color': Colors.amber, 'prefix': '하이엔드 & 프리미엄', 'conclusion': 'MZ세대 럭셔리 소비층이 밀집한 구역으로 하이엔드 브랜드 전개에 최적입니다.'},
      {'name': '이태원동', 'color': Colors.deepPurpleAccent, 'prefix': '글로벌 펍 & 다이닝', 'conclusion': '30대 1인 가구의 야간 소비가 활발한 구역으로 개성 있는 주류 브랜드에 추천됩니다.'},
      {'name': '연남동', 'color': const Color(0xFFF472B6), 'prefix': 'MZ 감성 골목', 'conclusion': '연트럴파크를 중심으로 20대 유동인구가 압도적인 상권으로 SNS 핫플레이스 전략에 유리합니다.'},
      {'name': '가로수길', 'color': Colors.green, 'prefix': '패션 & 트렌드 메카', 'conclusion': '가로수길은 글로벌 브랜드 플래그십 스토어의 각축장으로 글로벌 진출의 교두보입니다.'},
      {'name': '샤로수길', 'color': Colors.orange, 'prefix': 'MZ 가성비 핫플', 'conclusion': '서울대입구역 인근의 샤로수길은 MZ세대의 가성비 소비가 뚜렷한 골목 상권입니다.'},
      {'name': '망원동', 'color': Colors.teal, 'prefix': '전통 & 힙의 조화', 'conclusion': '망리단길을 중심으로 한 망원동은 전통시장과 힙한 카페가 공존하는 독특한 상권입니다.'},
    ];

    // [CSI FIX] Always use selection.selectedDistrict for all report pages
    String currentDistrictName = selection.selectedDistrict.isNotEmpty ? selection.selectedDistrict : '한남동';
    if (!currentDistrictName.contains('동') && !currentDistrictName.contains('길')) currentDistrictName += '동';

    // Map theme properties based on name
    var match = districtConfigs.firstWhere((e) => currentDistrictName.contains(e['name'].substring(0, 2)), orElse: () => districtConfigs[1]); // Default to Hannam
    Color themeColor = match['color'];
    String titlePrefix = match['prefix'];
    String conclusionText = match['conclusion'];

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
                      ],
                    ),
                    PageView(
                      controller: _reportController,
                      onPageChanged: (index) =>
                          setState(() => _currentPage = index),
                      children: [
                        // [CSI REPORT 1] Page 0: District Visual Summary & Data Bars
                        _buildSummaryPage(currentDistrictName, themeColor, titlePrefix, selection, currentDistrictName),
                        
                        // [CSI REPORT 2] Page 1: Future Prediction & Scenario (Synced with Web)
                        _buildFuturePage(
                          currentDistrictName,
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
        if (_currentPage > 0)
          Expanded(
            child: OutlinedButton(
              onPressed: () => _reportController.previousPage(
                duration: const Duration(milliseconds: 350), // [CSI SPEED FIX] 500ms -> 350ms
                curve: Curves.easeOutCubic, // [CSI SPEED FIX] Snappier curve
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
        if (_currentPage > 0) const SizedBox(width: 12),
        Expanded(
          child: ElevatedButton(
            onPressed: () {
              if (_currentPage < 1) {
                _reportController.nextPage(
                  duration: const Duration(milliseconds: 350), // [CSI SPEED FIX] 500ms -> 350ms
                  curve: Curves.easeOutCubic,
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
              _currentPage == 0 ? '미래 예측 시나리오' : '분석 완료 및 홈으로',
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
                    final selection = context.read<SelectionProvider>();
                    if (isActive) {
                      audio.stopRegionLayer();
                    } else {
                      audio.playRegionLayer(region['file']!);
                      // [CSI FIX] Update selection without jumping pages to maintain the 3-page flow
                      selection.setSelectedDistrict(region['name']! + (region['name'] == '가로수' || region['name'] == '샤로수' ? '길' : '동'));
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

  Widget _buildSummaryPage(String district, Color themeColor, String prefix, SelectionProvider selection, String districtName) {
    return SingleChildScrollView(
      padding: const EdgeInsets.fromLTRB(24, 60, 24, 40),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          ClipRRect(
            borderRadius: BorderRadius.circular(30),
            child: Stack(
              children: [
                _getDynamicImage('summary', selection, districtName),
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
          _buildEvaluationSection(selection),
          const SizedBox(height: 32),
          _buildIndicatorSection(),
          const SizedBox(height: 40),
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

  Widget _buildExpertPage(String district, Color themeColor, String prefix, SelectionProvider selection, String conclusion) {
    return SingleChildScrollView(
      padding: const EdgeInsets.fromLTRB(24, 60, 24, 40),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'DEEP INSIGHT REPORT',
            style: TextStyle(
              color: AppTheme.accent,
              fontWeight: FontWeight.bold,
              letterSpacing: 2.0,
              fontSize: 10,
            ),
          ),
          const SizedBox(height: 8),
          Text(
            prefix,
            style: const TextStyle(
              color: AppTheme.textPrimary,
              fontSize: 24,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 32),
          Container(
            padding: const EdgeInsets.all(24),
            decoration: BoxDecoration(
              color: AppTheme.cardBackground.withOpacity(0.8),
              borderRadius: BorderRadius.circular(30),
              border: Border.all(color: AppTheme.accent.withOpacity(0.3)),
              boxShadow: [
                BoxShadow(
                  color: AppTheme.accent.withOpacity(0.1),
                  blurRadius: 20,
                  spreadRadius: 5,
                ),
              ],
            ),
            child: Column(
              children: [
                Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.all(10),
                      decoration: BoxDecoration(
                        color: AppTheme.accent.withOpacity(0.2),
                        shape: BoxShape.circle,
                      ),
                      child: const Icon(Icons.psychology, color: AppTheme.accent, size: 30),
                    ),
                    const SizedBox(width: 16),
                    const Expanded(
                      child: Text(
                        'Sovereign AI Expert Review',
                        style: TextStyle(
                          color: AppTheme.textPrimary,
                          fontWeight: FontWeight.bold,
                          fontSize: 16,
                        ),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 24),
                Text(
                  '본 상권($district)은 타겟 MZ세대의 소비 패턴과 업종 적합도 면에서 최상위 수준의 조화를 보이고 있습니다. \n\n특히 $conclusion 데이터 분석 결과, 향후 3년 내 브랜드 가치 상승 여력이 충분한 "High-Potential" 구역으로 분류되었습니다.',
                  style: const TextStyle(
                    color: AppTheme.textPrimary,
                    fontSize: 15,
                    height: 1.8,
                  ),
                ),
                const SizedBox(height: 24),
                Divider(color: Colors.white.withOpacity(0.1)),
                const SizedBox(height: 24),
                _buildInsightTag('브랜드 인지도 확산 최적지', Colors.blueAccent),
                const SizedBox(height: 12),
                _buildInsightTag('프리미엄 소비층 밀집 구역', Colors.amberAccent),
              ],
            ),
          ),
          const SizedBox(height: 40),
        ],
      ),
    );
  }

  Widget _buildInsightTag(String text, Color color) {
    return Row(
      children: [
        Icon(Icons.stars_rounded, color: color, size: 18),
        const SizedBox(width: 12),
        Text(
          text,
          style: TextStyle(color: color.withOpacity(0.9), fontWeight: FontWeight.bold, fontSize: 13),
        ),
      ],
    );
  }

  Widget _getDynamicImage(String type, SelectionProvider selection, [String? overrideDistrict]) {
    String district = overrideDistrict ?? selection.selectedDistrict;
    if (district.isEmpty) district = '성수동';

    String industry = selection.industry;
    
    bool isPub = industry.contains('술집');
    bool isCafe = industry.contains('카페');
    bool isFashion = industry.contains('편집샵');
    bool isDining = industry.contains('브런치') || industry.contains('한식');

    String imageUrl = 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&q=80&w=800';

    if (type == 'summary') {
      if (district.contains('한남')) {
        imageUrl = 'https://images.unsplash.com/photo-1541604193435-22287d32c2c2?q=80&w=1000';
      } else if (district.contains('이태원')) {
        imageUrl = 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?q=80&w=1000';
      } else if (district.contains('연남')) {
        imageUrl = 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=1000';
      } else {
        imageUrl = 'https://images.unsplash.com/photo-1559925373-2f8218b5f54c?q=80&w=1000';
      }

      if (isFashion || industry.contains('패션')) {
        return Container(
          height: 180,
          width: double.infinity,
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(24),
            image: const DecorationImage(
              image: AssetImage('assets/images/fashion_art.png'),
              fit: BoxFit.cover,
            ),
          ),
        );
      }
    } else if (type == 'gis') {
      switch (_selectedHorizon) {
        case '현재':
          // [CSI FIX] Image 2 (Sample Image Folder - 2nd File)
          return Container(
            height: 200,
            width: double.infinity,
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(24),
              image: const DecorationImage(
                image: AssetImage('assets/images/recommendation_present.png'),
                fit: BoxFit.cover,
              ),
            ),
          );
        case '1년 뒤':
          // [CSI FIX] Image 4 (Sample Image Folder - 4th File)
          return Container(
            height: 200,
            width: double.infinity,
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(24),
              image: const DecorationImage(
                image: AssetImage('assets/images/recommendation_1yr.png'),
                fit: BoxFit.cover,
              ),
            ),
          );
        case '3년 뒤':
          // [CSI SYNC] Synchronized with youth-startup-flow.web.app final page image
          imageUrl = 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1200'; 
          break;
        default:
          imageUrl = 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&q=80&w=1200';
          break;
      }

      ColorFilter? filter;
      if (_selectedHorizon == '1년 뒤') {
        filter = ColorFilter.mode(Colors.blue.withValues(alpha: 0.1), BlendMode.color);
      } else if (_selectedHorizon == '3년 뒤') {
        filter = ColorFilter.mode(Colors.cyan.withValues(alpha: 0.2), BlendMode.plus);
      }

      return Container(
        height: 200,
        width: double.infinity,
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(24),
          image: DecorationImage(
            image: NetworkImage(imageUrl),
            fit: BoxFit.cover,
            colorFilter: filter,
          ),
        ),
      );
    } else {
      String artPath = 'assets/images/future_scenario.png';
      
      if (isPub) artPath = 'assets/images/pub_art.png';
      else if (isCafe) artPath = 'assets/images/coffee_art.png';
      else if (isFashion) artPath = 'assets/images/fashion_art.png';
      else if (isDining) artPath = 'assets/images/dining_art.png';

      ColorFilter? filter;
      if (_selectedHorizon == '1년 뒤') {
        filter = ColorFilter.mode(Colors.blue.withValues(alpha: 0.1), BlendMode.softLight);
      } else if (_selectedHorizon == '3년 뒤') {
        filter = ColorFilter.mode(Colors.purple.withValues(alpha: 0.2), BlendMode.colorBurn);
      }

      return Container(
        height: 220,
        width: double.infinity,
        decoration: BoxDecoration(
          color: AppTheme.cardBackground,
          borderRadius: BorderRadius.circular(24),
          image: DecorationImage(
            image: AssetImage(artPath),
            fit: BoxFit.cover,
            colorFilter: filter,
            onError: (e, s) => debugPrint("CSI Image Load Error: $e"),
          ),
        ),
      );
    }

    return Container(
      height: type == 'summary' ? 140 : 180,
      width: double.infinity,
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(24),
        image: DecorationImage(
          image: NetworkImage(imageUrl),
          fit: BoxFit.cover,
        ),
      ),
    );
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
      default:
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
                Positioned(
                  bottom: 12,
                  right: 12,
                  child: Opacity(
                    opacity: 0.4,
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.end,
                      children: const [
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
    ).animate().fadeIn(duration: const Duration(milliseconds: 500));
  }

  Widget _buildEvaluationSection(SelectionProvider selection) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          '브랜드 가치 분석 결과',
          style: TextStyle(color: AppTheme.accent, fontSize: 14, fontWeight: FontWeight.bold),
        ),
        const SizedBox(height: 8),
        const Text(
          'AI 상권 평가지수',
          style: TextStyle(color: AppTheme.textPrimary, fontSize: 32, fontWeight: FontWeight.bold),
        ),
        const SizedBox(height: 32),
        _buildEvaluationRow('입지 적합도', 0.95, Colors.blue),
        _buildEvaluationRow('유동인구 지수', 0.88, Colors.blue),
        _buildEvaluationRow('MZ 타겟 집중도', 0.92, Colors.blue),
        _buildEvaluationRow('SNS 활용지수 🤳', 0.86, Colors.pinkAccent),
        _buildEvaluationRow('평균 매출 잠재력', 0.84, Colors.blue),
        _buildEvaluationRow('상권 종합평가 지수', 0.98, Colors.cyanAccent),
      ],
    );
  }

  Widget _buildEvaluationRow(String label, double value, Color color) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 24),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(label, style: const TextStyle(color: AppTheme.textPrimary, fontSize: 15)),
              Text('${(value * 100).toInt()}%',
                  style: TextStyle(color: color, fontWeight: FontWeight.bold, fontSize: 15)),
            ],
          ),
          const SizedBox(height: 12),
          ClipRRect(
            borderRadius: BorderRadius.circular(10),
            child: LinearProgressIndicator(
              value: value,
              minHeight: 8,
              backgroundColor: Colors.white.withOpacity(0.05),
              valueColor: AlwaysStoppedAnimation<Color>(color),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildIndicatorSection() {
    return Container(
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: Colors.white.withOpacity(0.03),
        borderRadius: BorderRadius.circular(24),
        border: Border.all(color: Colors.white.withOpacity(0.05)),
      ),
      child: Column(
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceAround,
            children: [
              _buildSimpleIndicator('신규 진입', '매우 높음'),
              _buildSimpleIndicator('임대료 수준', '상위 15%'),
              _buildSimpleIndicator('경쟁 강도', '보통'),
            ],
          ),
          const SizedBox(height: 24),
          const Divider(color: Colors.white10),
          const SizedBox(height: 16),
          Row(
            children: [
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                decoration: BoxDecoration(
                  color: AppTheme.accent.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(20),
                ),
                child: const Text(
                  'AI 권고: MZ 핫플레이스 전략',
                  style: TextStyle(color: AppTheme.accent, fontSize: 11, fontWeight: FontWeight.bold),
                ),
              ),
              const SizedBox(width: 8),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                decoration: BoxDecoration(
                  color: Colors.pinkAccent.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(20),
                ),
                child: const Text(
                  'Match 98%',
                  style: TextStyle(color: Colors.pinkAccent, fontSize: 11, fontWeight: FontWeight.bold),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildSimpleIndicator(String label, String value) {
    return Column(
      children: [
        Text(label, style: TextStyle(color: AppTheme.textSecondary, fontSize: 12)),
        const SizedBox(height: 8),
        Text(value, style: const TextStyle(color: AppTheme.textPrimary, fontWeight: FontWeight.bold, fontSize: 15)),
      ],
    );
  }
}
