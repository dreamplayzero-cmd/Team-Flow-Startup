import 'dart:ui' as ui;
import 'package:flutter/material.dart';
import 'package:flutter/foundation.dart' show kIsWeb;
import 'package:flutter_animate/flutter_animate.dart';
import 'package:go_router/go_router.dart';
import 'package:mapbox_maps_flutter/mapbox_maps_flutter.dart';
import 'package:provider/provider.dart';
import '../../core/providers/selection_provider.dart';
import '../../core/theme/app_theme.dart';

class MapScoutingPage extends StatefulWidget {
  const MapScoutingPage({super.key});

  @override
  State<MapScoutingPage> createState() => _MapScoutingPageState();
}

class _MapScoutingPageState extends State<MapScoutingPage> {
  bool _isPanelVisible = true;
  MapboxMap? _mapboxMap;

  // 성수동 연무장길 좌표 (Seongsu-dong, Seoul)
  final double _targetLat = 37.5448;
  final double _targetLng = 127.0536;

  @override
  void initState() {
    super.initState();
    debugPrint("All 9 Pages Ready for Presentation");
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.gradientStart,
      body: Stack(
        children: [
          // 1. 3D 지도 영역 (Web인 경우 고해상도 시뮬레이션 UI, Mobile인 경우 실지제 지도)
          kIsWeb ? _buildWebSimulatedView() : _buildRealMapView(),

          // 2. 상단 오버레이 (브랜딩 및 네비게이션)
          _buildTopOverlay(),
          
          // 1. Emotional Background (Version 3)
          if (kIsWeb) Positioned.fill(
            child: IgnorePointer(
              child: Container(
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                    colors: [AppTheme.gradientStart.withOpacity(0.5), AppTheme.gradientEnd.withOpacity(0.5)],
                  ),
                ),
              ),
            ),
          ),

          // 3. 우측 컨트롤 버튼 (맵 도구)
          _buildSideControls(),

          // 4. 하단 분석 요약 패널 (유동적 정보 표시)
          _buildBottomSummary(),
          
          // 5. 웹 전용 안내 배너 (선택 사항)
          if (kIsWeb) _buildWebStatusIndicator(),

          // 6. 출처 레이블 추가
          _buildMapSourceLabel(),
        ],
      ),
    );
  }

  Widget _buildRealMapView() {
    return Positioned.fill(
      child: MapWidget(
        key: const ValueKey("mapbox_map"),
        cameraOptions: CameraOptions(
          center: Point(coordinates: Position(_targetLng, _targetLat)),
          zoom: 16.0,
          pitch: 65.0,
          bearing: -15.0,
        ),
        onMapCreated: (controller) {
          _mapboxMap = controller;
        },
      ),
    );
  }

  double _panOffset = 0.0;
  double _zoomScale = 1.0;
  bool _isMovingForward = false;
  bool _isScanning = false;

  Widget _buildWebSimulatedView() {
    return Positioned.fill(
      child: GestureDetector(
        onHorizontalDragUpdate: null, // 좌우 회전 기능을 비활성화하여 이미지 고정
        onDoubleTap: () {
          setState(() {
            _isMovingForward = true;
            _zoomScale = 1.5;
          });
          Future.delayed(Duration(seconds: 1), () {
            setState(() {
              _isMovingForward = false;
              _zoomScale = 1.0;
            });
          });
        },
        child: Stack(
          children: [
            // 1. 고해상도 360도 도시 배경 (Interactive 3D-like parallax)
            AnimatedContainer(
              duration: _isMovingForward ? Duration(seconds: 1) : Duration(milliseconds: 500),
              curve: _isMovingForward ? Curves.easeOutCubic : Curves.linear,
              transform: Matrix4.identity()
                ..setEntry(3, 2, 0.001)
                ..rotateY(0.0) // 0.0으로 고정하여 회전 방지
                ..scale(_zoomScale),
              alignment: Alignment.center,
              child: Image.asset(
                'assets/images/map_fallback.png',
                fit: BoxFit.cover,
                width: double.infinity,
                height: double.infinity,
                errorBuilder: (context, error, stackTrace) => Container(color: AppTheme.gradientStart),
              ),
            ),
            
            // 2. 디지털 스캔 오버레이 (3D 버튼 클릭 시 활성화)
            if (_isScanning)
              Container(
                decoration: BoxDecoration(
                  color: AppTheme.accent.withValues(alpha: 0.1),
                ),
                child: CustomPaint(
                  size: ui.Size.infinite,
                  painter: _ScannerPainter(),
                ),
              ).animate().fadeIn().fadeOut(delay: Duration(seconds: 2)),

            // 3. 입체적인 GIS 데이터 클러스터
            _buildInteractiveClusters(),
            
            // 4. 조작 안내 가이드
            Positioned(
              bottom: 320, left: 0, right: 0,
              child: Center(
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                  decoration: BoxDecoration(color: Colors.white.withOpacity(0.5), borderRadius: BorderRadius.circular(20)),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: const [
                      Icon(Icons.touch_app_rounded, color: AppTheme.textSecondary, size: 14),
                      SizedBox(width: 8),
                      Text('더블 탭으로 전진 | 고정 뷰 모드', style: TextStyle(color: AppTheme.textSecondary, fontSize: 10)),
                    ],
                  ),
                ),
              ),
            ).animate().fadeIn(delay: Duration(seconds: 2)),
          ],
        ),
      ),
    );
  }

  Widget _buildInteractiveClusters() {
    return Stack(
      children: List.generate(8, (index) {
        // 회전에 따라 위치가 변하는 것처럼 보이게 함
        double xBase = 100.0 + (index * 80);
        double yBase = 200.0 + (index % 3 * 60);
        
        return AnimatedPositioned(
          duration: Duration(milliseconds: 100),
          left: xBase, // _panOffset 제거하여 위치 고정
          top: yBase,
          child: Column(
            children: [
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                decoration: BoxDecoration(color: AppTheme.accent, borderRadius: BorderRadius.circular(10)),
                child: const Text('92.4%', style: TextStyle(color: Colors.white, fontSize: 10, fontWeight: FontWeight.bold)),
              ).animate(onPlay: (c) => c.repeat(reverse: true)).slideY(begin: 0.1, end: -0.1),
              const Icon(Icons.location_on_rounded, color: AppTheme.accent, size: 30),
            ],
          ),
        );
      }),
    );
  }

  Widget _buildWebStatusIndicator() {
    return Positioned(
      top: 100,
      left: 0,
      right: 0,
      child: Center(
        child: Container(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
          decoration: BoxDecoration(
            color: Colors.amberAccent.withValues(alpha: 0.1),
            borderRadius: BorderRadius.circular(20),
            border: Border.all(color: Colors.amberAccent.withValues(alpha: 0.2)),
          ),
          child: Row(
            mainAxisSize: MainAxisSize.min,
            children: const [
              Icon(Icons.insights_rounded, color: Colors.amberAccent, size: 14),
              SizedBox(width: 8),
              Text('AI Insight: 현재 업종이 어디에 가장 많이 밀집해 있는지 분석한 지도입니다.', 
                style: TextStyle(color: Colors.amberAccent, fontSize: 10, fontWeight: FontWeight.bold)),
            ],
          ),
        ),
      ).animate().fadeIn(delay: Duration(seconds: 1)),
    );
  }

  Widget _buildMapSourceLabel() {
    return Positioned(
      bottom: 24,
      right: 32,
      child: Opacity(
        opacity: 0.3,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.end,
          children: const [
            Text(
              'SOURCE: 서울시 공공데이터 광장',
              style: TextStyle(color: Colors.white, fontSize: 8, fontWeight: FontWeight.w900, letterSpacing: 1.2),
            ),
            SizedBox(height: 2),
            Text(
              '위치 정보 분석 엔진 V 2.0',
              style: TextStyle(color: Colors.white, fontSize: 8, fontWeight: FontWeight.w900, letterSpacing: 1.2),
            ),
            SizedBox(height: 2),
            Text(
              'SOURCE: 서울 상권 분석 / 업종 밀집도 분석 엔진',
              style: TextStyle(color: Colors.white, fontSize: 8, fontWeight: FontWeight.w900, letterSpacing: 1.2),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildTopOverlay() {
    return Consumer<SelectionProvider>(
      builder: (context, selection, _) {
        String district = '성수동';
        if (selection.persona.contains('20') && (selection.industry.contains('패션') || selection.industry.contains('편집샵'))) {
          district = '한남동';
        } else if (selection.persona.contains('30') && selection.industry == '술집') {
          district = '연남동';
        } else if (selection.persona.contains('30') && (selection.industry.contains('식당') || selection.industry.contains('한식'))) {
          district = '이태원동';
        }
            
        return Positioned(
          top: MediaQuery.of(context).padding.top + 10,
          left: 20,
          right: 20,
          child: Container(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            height: 56,
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(15),
              border: Border.all(color: AppTheme.accent.withValues(alpha: 0.1)),
              boxShadow: [BoxShadow(color: AppTheme.accent.withValues(alpha: 0.1), blurRadius: 20)],
            ),
            child: Row(
              children: [
                IconButton(
                  icon: const Icon(Icons.arrow_back_ios_new_rounded, color: AppTheme.textPrimary, size: 20),
                  onPressed: () => context.pop(),
                ),
                const SizedBox(width: 4),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Text(
                        district == '연남동' ? '연남동' : 
                        (district == '한남동' ? '한남동' : 
                        (district == '이태원동' ? '이태원동' : '성수동')),
                        style: const TextStyle(color: Colors.black, fontWeight: FontWeight.bold, fontSize: 16),
                      ),
                      const Text(
                        'REAL-TIME 업종 밀집도 분석',
                        style: TextStyle(color: AppTheme.accent, fontWeight: FontWeight.w900, fontSize: 9, letterSpacing: 1.2),
                      ),
                    ],
                  ),
                ),
                const Icon(Icons.share_location_rounded, color: AppTheme.accent),
              ],
            ),
          ).animate().fadeIn().slideY(begin: -0.2, end: 0),
        );
      },
    );
  }

  Widget _buildSideControls() {
    return Positioned(
      right: 20,
      bottom: 280,
      child: Column(
        children: [
          _buildMapActionButton(Icons.layers_rounded),
          const SizedBox(height: 12),
          _buildMapActionButton(Icons.view_in_ar_rounded, active: true),
          const SizedBox(height: 12),
          _buildMapActionButton(Icons.analytics_rounded),
        ],
      ).animate().fadeIn(delay: Duration(milliseconds: 500)),
    );
  }

  Widget _buildMapActionButton(IconData icon, {bool active = false}) {
    return InkWell(
      onTap: () {
        if (icon == Icons.view_in_ar_rounded) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: const Text('🛰️ 고해상도 3D 스캔 데이터 연결 중...', style: TextStyle(fontWeight: FontWeight.bold)),
              backgroundColor: AppTheme.accent,
              duration: Duration(seconds: 1),
              behavior: SnackBarBehavior.floating,
            ),
          );
          setState(() {
            _isScanning = true;
          });
          Future.delayed(Duration(seconds: 2), () => setState(() => _isScanning = false));
        }
      },
      child: Container(
        width: 52,
        height: 52,
        decoration: BoxDecoration(
          color: active ? AppTheme.accent : Colors.white.withOpacity(0.8),
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: AppTheme.accent.withValues(alpha: 0.1)),
          boxShadow: [BoxShadow(color: AppTheme.accent.withOpacity(0.1), blurRadius: 15)],
        ),
        child: Icon(icon, color: active ? Colors.white : AppTheme.accent, size: 22),
      ),
    );
  }

  bool _isPanelMinimized = false;

  Widget _buildBottomSummary() {
    return Selector<SelectionProvider, (String, String)>(
      selector: (_, p) => (p.persona, p.industry),
      builder: (context, data, child) {
        final persona = data.$1;
        final industry = data.$2;
        
        return Positioned(
          left: 0,
          right: 0,
          bottom: 0,
          child: AnimatedContainer(
            duration: Duration(milliseconds: 400),
            transform: Matrix4.translationValues(0, _isPanelMinimized ? 220 : 0, 0),
            padding: const EdgeInsets.fromLTRB(24, 20, 24, 48),
            decoration: BoxDecoration(
              color: AppTheme.gradientEnd.withOpacity(0.95),
              borderRadius: const BorderRadius.vertical(top: Radius.circular(32)),
              border: Border.all(color: AppTheme.accent.withValues(alpha: 0.2)),
              boxShadow: [BoxShadow(color: AppTheme.accent.withOpacity(0.1), blurRadius: 50)],
            ),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                // 패널 핸들 & 최소화 버튼
                GestureDetector(
                  onTap: () => setState(() => _isPanelMinimized = !_isPanelMinimized),
                  child: Container(
                    width: 40, height: 4,
                    margin: const EdgeInsets.only(bottom: 20),
                    decoration: BoxDecoration(color: AppTheme.accent.withOpacity(0.2), borderRadius: BorderRadius.circular(2)),
                  ),
                ),
                Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        color: AppTheme.accent.withValues(alpha: 0.1),
                        borderRadius: BorderRadius.circular(15),
                      ),
                      child: const Icon(Icons.auto_graph_rounded, color: AppTheme.accent),
                    ),
                    const SizedBox(width: 16),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text('$persona 추천 상권', style: const TextStyle(color: AppTheme.textSecondary, fontSize: 11, letterSpacing: 1)),
                          Text(
                            '$industry 입지 분석 완료',
                            style: const TextStyle(color: AppTheme.textPrimary, fontSize: 18, fontWeight: FontWeight.bold),
                          ),
                        ],
                      ),
                    ),
                    IconButton(
                      icon: Icon(_isPanelMinimized ? Icons.keyboard_arrow_up_rounded : Icons.keyboard_arrow_down_rounded, color: AppTheme.textSecondary),
                      onPressed: () => setState(() => _isPanelMinimized = !_isPanelMinimized),
                    ),
                  ],
                ),
                const SizedBox(height: 28),
                Row(
                  children: [
                    Expanded(child: _buildSimpleStat('AI 매칭률', '92.4%', AppTheme.accent)),
                    Expanded(child: _buildSimpleStat('젠트리피케이션', '안정', Colors.green)),
                    Expanded(child: _buildSimpleStat('미래 가치', 'A+', Colors.orangeAccent)),
                  ],
                ),
                const SizedBox(height: 32),
                SizedBox(
                  width: double.infinity,
                  child: ElevatedButton(
                    onPressed: () {
                      final provider = context.read<SelectionProvider>();
                      String recommended = '성수동';
                      
                      // [CSI TOP LOGIC] Dynamic Routing based on Persona & Industry
                      if (provider.persona.contains('20') && (provider.industry.contains('패션') || provider.industry.contains('편집샵'))) {
                        recommended = '한남동'; // 20s Fashion/Edit Shop -> Hannam
                      } else if (provider.persona.contains('30') && provider.industry == '술집') {
                        recommended = '연남동';
                      } else if (provider.persona.contains('30') && provider.industry.contains('편집샵')) {
                        recommended = '성수동'; // 30s Edit Shop -> Seongsu
                      } else if (provider.persona.contains('20')) {
                        recommended = provider.industry.contains('카페') ? '성수동' : '한남동';
                      } else if (provider.persona.contains('30')) {
                        recommended = (provider.industry.contains('식당') || provider.industry.contains('한식')) ? '이태원' : '연남동';
                      }
                      
                      provider.setSelectedDistrict(recommended);
                      context.push('/report');
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppTheme.accent,
                      foregroundColor: Colors.white,
                      padding: const EdgeInsets.symmetric(vertical: 20),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(18)),
                      elevation: 0,
                    ),
                    child: const Text('최종 분석 결과 확인', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16, letterSpacing: 0.5)),
                  ),
                ),
              ],
            ),
          ).animate().slideY(begin: 1, end: 0, curve: Curves.easeOutQuart),
        );
      },
    );
  }

  Widget _buildSimpleStat(String label, String value, Color color) {
    return Column(
      children: [
        Text(label, style: const TextStyle(color: AppTheme.textSecondary, fontSize: 10, fontWeight: FontWeight.w500)),
        const SizedBox(height: 6),
        Text(value, style: TextStyle(color: color, fontSize: 22, fontWeight: FontWeight.bold, letterSpacing: -0.5)),
      ],
    );
  }
}

class _ScannerPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, ui.Size size) {
    final paint = Paint()
      ..color = AppTheme.accent.withValues(alpha: 0.3)
      ..style = PaintingStyle.stroke
      ..strokeWidth = 0.5;

    // 그리드 그리기
    for (double i = 0; i < size.width; i += 40) {
      canvas.drawLine(Offset(i, 0), Offset(i, size.height), paint);
    }
    for (double i = 0; i < size.height; i += 40) {
      canvas.drawLine(Offset(0, i), Offset(size.width, i), paint);
    }
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}
