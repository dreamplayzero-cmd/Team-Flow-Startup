import 'dart:ui';
import 'package:flutter/material.dart';
import 'package:flutter/foundation.dart' show kIsWeb;
import 'package:provider/provider.dart';
import 'core/router/app_router.dart';
import 'core/providers/selection_provider.dart';

void main() {
  runApp(
    MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => SelectionProvider()),
      ],
      child: const YouthStartupApp(),
    ),
  );
}

class YouthStartupApp extends StatelessWidget {
  const YouthStartupApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp.router(
      title: 'Youth Startup Flow',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        useMaterial3: true,
        colorSchemeSeed: const Color(0xFF3B82F6),
        brightness: Brightness.dark,
        fontFamily: 'Pretendard',
      ),
      routerConfig: AppRouter.router,
      // MaterialApp 내부에서 에뮬레이터를 실행하여 Context 에러 방지
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
          backgroundColor: const Color(0xFF0F172A),
          body: Stack(
            children: [
              // 1. 외곽 배경 공간: 프리미엄 대리석 텍스처
              Positioned.fill(
                child: Image.network(
                  'https://images.unsplash.com/photo-1533158326339-7f3cf2404354?q=80&w=2668&auto=format&fit=crop',
                  fit: BoxFit.cover,
                ),
              ),
              Positioned.fill(
                child: Container(
                  color: Colors.black.withOpacity(0.65),
                  child: BackdropFilter(
                    filter: ImageFilter.blur(sigmaX: 12, sigmaY: 12),
                    child: Container(color: Colors.transparent),
                  ),
                ),
              ),

              // 2. 중앙 가상 모바일 뷰포트
              Center(
                child: Container(
                  width: targetWidth,
                  height: targetHeight,
                  decoration: BoxDecoration(
                    color: Colors.black,
                    borderRadius: BorderRadius.circular(48),
                    border: Border.all(color: Colors.white.withOpacity(0.1), width: 10),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withOpacity(0.5),
                        blurRadius: 100,
                        spreadRadius: 20,
                      ),
                    ],
                  ),
                  child: ClipRRect(
                    borderRadius: BorderRadius.circular(38),
                    child: child,
                  ),
                ),
              ),
              
              // 3. 브랜딩 가이드
              Positioned(
                top: 60,
                left: 60,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: const [
                    Text('THE SOVEREIGN', style: TextStyle(color: Colors.white, fontSize: 24, fontWeight: FontWeight.bold, letterSpacing: 5)),
                    Text('INSIGHT ENGINE MOBILE PREVIEW', style: TextStyle(color: Colors.white38, fontSize: 10, letterSpacing: 2)),
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
