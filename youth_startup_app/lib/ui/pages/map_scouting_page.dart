import 'dart:ui' as ui;
import 'package:flutter/material.dart';
import 'package:flutter/foundation.dart' show kIsWeb;
import 'package:flutter_animate/flutter_animate.dart';
import 'package:go_router/go_router.dart';
import 'package:mapbox_maps_flutter/mapbox_maps_flutter.dart';
import 'package:provider/provider.dart';
import '../../core/providers/selection_provider.dart';

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
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.black,
      body: Stack(
        children: [
          // 1. 3D 지도 영역 (Web인 경우 고해상도 시뮬레이션 UI, Mobile인 경우 실지제 지도)
          kIsWeb ? _buildWebSimulatedView() : _buildRealMapView(),

          // 2. 상단 오버레이 (브랜딩 및 네비게이션)
          _buildTopOverlay(),

          // 3. 우측 컨트롤 버튼 (맵 도구)
          _buildSideControls(),

          // 4. 하단 분석 요약 패널 (유동적 정보 표시)
          _buildBottomSummary(),
          
          // 5. 웹 전용 안내 배너 (선택 사항)
          if (kIsWeb) _buildWebStatusIndicator(),
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
          Future.delayed(1.seconds, () {
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
              duration: _isMovingForward ? 1.seconds : 500.ms,
              curve: _isMovingForward ? Curves.easeOutCubic : Curves.linear,
              transform: Matrix4.identity()
                ..setEntry(3, 2, 0.001)
                ..rotateY(0.0) // 0.0으로 고정하여 회전 방지
                ..scale(_zoomScale),
              alignment: Alignment.center,
              child: Image.network(
                'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?q=80&w=2670&auto=format&fit=crop',
                fit: BoxFit.cover,
                width: double.infinity,
                height: double.infinity,
              ),
            ),
            
            // 2. 디지털 스캔 오버레이 (3D 버튼 클릭 시 활성화)
            if (_isScanning)
              Container(
                decoration: BoxDecoration(
                  color: Colors.blueAccent.withValues(alpha: 0.1),
                ),
                child: CustomPaint(
                  size: ui.Size.infinite,
                  painter: _ScannerPainter(),
                ),
              ).animate().fadeIn().fadeOut(delay: 2.seconds),

            // 3. 입체적인 GIS 데이터 클러스터
            _buildInteractiveClusters(),
            
            // 4. 조작 안내 가이드
            Positioned(
              bottom: 320, left: 0, right: 0,
              child: Center(
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                  decoration: BoxDecoration(color: Colors.black45, borderRadius: BorderRadius.circular(20)),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: const [
                      Icon(Icons.touch_app_rounded, color: Colors.white70, size: 14),
                      SizedBox(width: 8),
                      Text('더블 탭으로 전진 | 고정 뷰 모드', style: TextStyle(color: Colors.white70, fontSize: 10)),
                    ],
                  ),
                ),
              ),
            ).animate().fadeIn(delay: 2.seconds),
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
          duration: 100.ms,
          left: xBase, // _panOffset 제거하여 위치 고정
          top: yBase,
          child: Column(
            children: [
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                decoration: BoxDecoration(color: Colors.blueAccent, borderRadius: BorderRadius.circular(10)),
                child: const Text('92.4%', style: TextStyle(color: Colors.white, fontSize: 10, fontWeight: FontWeight.bold)),
              ).animate(onPlay: (c) => c.repeat(reverse: true)).slideY(begin: 0.1, end: -0.1),
              const Icon(Icons.location_on_rounded, color: Colors.blueAccent, size: 30),
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
              Icon(Icons.web_rounded, color: Colors.amberAccent, size: 14),
              SizedBox(width: 8),
              Text('Web Preview: 정밀 3D 렌더링은 모바일 앱에서 최적화됩니다.', 
                style: TextStyle(color: Colors.amberAccent, fontSize: 10, fontWeight: FontWeight.bold)),
            ],
          ),
        ),
      ).animate().fadeIn(delay: 1.seconds),
    );
  }

  Widget _buildTopOverlay() {
    return Positioned(
      top: MediaQuery.of(context).padding.top + 10,
      left: 20,
      right: 20,
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 16),
        height: 56,
        decoration: BoxDecoration(
          color: const Color(0xFF1E293B).withValues(alpha: 0.9),
          borderRadius: BorderRadius.circular(15),
          border: Border.all(color: Colors.white.withValues(alpha: 0.1)),
          boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: 0.3), blurRadius: 20)],
        ),
        child: Row(
          children: [
            IconButton(
              icon: const Icon(Icons.arrow_back_ios_new_rounded, color: Colors.white, size: 20),
              onPressed: () => context.pop(),
            ),
            const SizedBox(width: 4),
            const Expanded(
              child: Text(
                '성수동 연무장길 분석 구역',
                style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 16),
              ),
            ),
            const Icon(Icons.share_location_rounded, color: Color(0xFF3B82F6)),
          ],
        ),
      ).animate().fadeIn().slideY(begin: -0.2, end: 0),
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
      ).animate().fadeIn(delay: 500.ms),
    );
  }

  Widget _buildMapActionButton(IconData icon, {bool active = false}) {
    return InkWell(
      onTap: () {
        if (icon == Icons.view_in_ar_rounded) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: const Text('🛰️ 고해상도 3D 스캔 데이터 연결 중...', style: TextStyle(fontWeight: FontWeight.bold)),
              backgroundColor: const Color(0xFF3B82F6),
              duration: 1.seconds,
              behavior: SnackBarBehavior.floating,
            ),
          );
          setState(() {
            _isScanning = true;
          });
          Future.delayed(2.seconds, () => setState(() => _isScanning = false));
        }
      },
      child: Container(
        width: 52,
        height: 52,
        decoration: BoxDecoration(
          color: active ? const Color(0xFF3B82F6) : const Color(0xFF1E293B),
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: Colors.white.withValues(alpha: 0.05)),
          boxShadow: [const BoxShadow(color: Colors.black45, blurRadius: 15)],
        ),
        child: Icon(icon, color: Colors.white, size: 22),
      ),
    );
  }

  bool _isPanelMinimized = false;

  Widget _buildBottomSummary() {
    final provider = context.watch<SelectionProvider>();
    
    return Positioned(
      left: 0,
      right: 0,
      bottom: 0,
      child: AnimatedContainer(
        duration: 400.ms,
        transform: Matrix4.translationValues(0, _isPanelMinimized ? 220 : 0, 0),
        padding: const EdgeInsets.fromLTRB(24, 20, 24, 48),
        decoration: BoxDecoration(
          color: const Color(0xFF0F172A),
          borderRadius: const BorderRadius.vertical(top: Radius.circular(32)),
          border: Border.all(color: const Color(0xFF3B82F6).withValues(alpha: 0.2)),
          boxShadow: [const BoxShadow(color: Colors.black, blurRadius: 50)],
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
                decoration: BoxDecoration(color: Colors.white10, borderRadius: BorderRadius.circular(2)),
              ),
            ),
            Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: const Color(0xFF3B82F6).withValues(alpha: 0.1),
                    borderRadius: BorderRadius.circular(15),
                  ),
                  child: const Icon(Icons.auto_graph_rounded, color: Color(0xFF3B82F6)),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('${provider.persona} 추천 상권', style: const TextStyle(color: Colors.white54, fontSize: 11, letterSpacing: 1)),
                      Text(
                        '${provider.industry} 입지 분석 완료',
                        style: const TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold),
                      ),
                    ],
                  ),
                ),
                IconButton(
                  icon: Icon(_isPanelMinimized ? Icons.keyboard_arrow_up_rounded : Icons.keyboard_arrow_down_rounded, color: Colors.white70),
                  onPressed: () => setState(() => _isPanelMinimized = !_isPanelMinimized),
                ),
              ],
            ),
            const SizedBox(height: 28),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                _buildSimpleStat('AI 매칭률', '92.4%', const Color(0xFF3B82F6)),
                _buildSimpleStat('젠트리피케이션', '안정', Colors.greenAccent),
                _buildSimpleStat('미래 가치', 'A+', Colors.amberAccent),
              ],
            ),
            const SizedBox(height: 32),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: () => context.push('/report'),
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF3B82F6),
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
  }

  Widget _buildSimpleStat(String label, String value, Color color) {
    return Column(
      children: [
        Text(label, style: const TextStyle(color: Colors.white30, fontSize: 10, fontWeight: FontWeight.w500)),
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
      ..color = Colors.blueAccent.withValues(alpha: 0.3)
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
