import 'dart:ui';
import 'package:flutter/material.dart';
import 'package:flutter/foundation.dart' show kIsWeb;
import 'package:provider/provider.dart';
import 'core/router/app_router.dart';
import 'core/theme/app_theme.dart';
import 'core/providers/selection_provider.dart';
import 'core/providers/audio_provider.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(
    MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => SelectionProvider()),
        ChangeNotifierProvider(create: (_) => AudioProvider()),
      ],
      child: const SovereignApp(),
    ),
  );
}


class SovereignApp extends StatefulWidget {
  const SovereignApp({super.key});

  @override
  State<SovereignApp> createState() => _SovereignAppState();
}

class _SovereignAppState extends State<SovereignApp> {
  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    // [CSI SPEED OPTIMIZATION] Precache the main login background image
    precacheImage(
      const NetworkImage('https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=100&w=3000&auto=format&fit=crop'),
      context,
    );
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp.router(
      title: 'Sovereign AI',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.lightTheme,
      routerConfig: AppRouter.createRouter(context),
      builder: (context, child) {
        return MobileEmulatorWrapper(child: child!);
      },
    );
  }
}

/// [MobileEmulatorWrapper]
/// 웹 환경에서 모바일 뷰포트(375x812)를 에뮬레이션하고 
/// 외곽을 브랜드 배경으로 채우는 위젯
class MobileEmulatorWrapper extends StatelessWidget {
  final Widget child;
  const MobileEmulatorWrapper({super.key, required this.child});

  @override
  Widget build(BuildContext context) {
    // 웹이 아니거나 실제 모바일 기기 크기라면 에뮬레이션 없이 원본 표시
    if (!kIsWeb) return child;

    return LayoutBuilder(
      builder: (context, constraints) {
        const double targetWidth = 375.0;
        const double targetHeight = 812.0;
        
        if (constraints.maxWidth <= targetWidth + 50) {
          return child;
        }

        return Scaffold(
          backgroundColor: const Color(0xFF6B6B6D), // 연한 회색 배경 (가독성 향상)
          body: Stack(
            children: [
              // 1. 외곽 배경 공간
              Positioned.fill(
                child: Container(color: const Color(0xFF6B6B6D)),
              ),

              // 2. 중앙 가상 모바일 뷰포트 (FittedBox로 자동 축소/확대 적용하여 잘림 방지)
              Center(
                child: Padding(
                  padding: const EdgeInsets.symmetric(vertical: 40.0), // 여백 추가
                  child: FittedBox(
                    fit: BoxFit.contain,
                    child: Container(
                      width: targetWidth,
                      height: targetHeight,
                      decoration: BoxDecoration(
                        color: Colors.black,
                        borderRadius: BorderRadius.circular(48),
                        border: Border.all(color: Colors.white.withOpacity(0.1), width: 10),
                        boxShadow: [
                          BoxShadow(
                            color: Colors.black.withOpacity(0.4),
                            blurRadius: 80,
                            spreadRadius: 10,
                          ),
                        ],
                      ),
                      child: ClipRRect(
                        borderRadius: BorderRadius.circular(38),
                        child: child,
                      ),
                    ),
                  ),
                ),
              ),
              
              // 3. 브랜딩 가이드 (가독성 극대화: 더 크고 더 진한 3D 블랙 텍스트)
              Positioned(
                top: 60,
                left: 60,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'THE SOVEREIGN',
                      style: TextStyle(
                        color: Colors.black, // 완전한 블랙
                        fontSize: 32, // 크기 증가
                        fontWeight: FontWeight.w900, // 초강력 볼드
                        letterSpacing: 6,
                        shadows: [
                          Shadow(
                            offset: const Offset(3.0, 3.0),
                            blurRadius: 5.0,
                            color: Colors.black.withOpacity(0.6), // 한층 깊은 그림자
                          ),
                          Shadow(
                            offset: const Offset(-1.0, -1.0),
                            blurRadius: 2.0,
                            color: Colors.white.withOpacity(0.3), // 밝은 엠보싱 하이라이트
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 12),
                    const Text(
                      'INSIGHT ENGINE MOBILE PREVIEW', 
                      style: TextStyle(
                        color: Colors.black87, // 서브텍스트도 진하게
                        fontSize: 14, // 크기 증가
                        letterSpacing: 4, 
                        fontWeight: FontWeight.w900, // 가장 진한 굵기
                        shadows: [
                          Shadow(
                            offset: Offset(1.0, 1.0),
                            blurRadius: 2.0,
                            color: Colors.black26,
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        );
      },
    );
  }
}
