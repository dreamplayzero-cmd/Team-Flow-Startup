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
      child: const YouthStartupApp(),
    ),
  );
}

class YouthStartupApp extends StatelessWidget {
  const YouthStartupApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp.router(
      title: 'The Sovereign AI',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.darkTheme,
      routerConfig: AppRouter.router,
      builder: (context, child) {
        return MobileEmulatorWrapper(child: child!);
      },
    );
  }
}

class MobileEmulatorWrapper extends StatelessWidget {
  final Widget child;
  const MobileEmulatorWrapper({super.key, required this.child});

  @override
  Widget build(BuildContext context) {
    if (!kIsWeb) return child;

    return LayoutBuilder(
      builder: (context, constraints) {
        const double targetWidth = 375.0;
        const double targetHeight = 812.0;
        
        if (constraints.maxWidth <= targetWidth + 50) {
          return child;
        }

        return Scaffold(
          backgroundColor: const Color(0xFF6B6B6D),
          body: Stack(
            children: [
              Positioned.fill(child: Container(color: const Color(0xFF6B6B6D))),
              Center(
                child: Padding(
                  padding: const EdgeInsets.symmetric(vertical: 40.0),
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
              Positioned(
                top: 60,
                left: 60,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'THE SOVEREIGN',
                      style: TextStyle(
                        color: Colors.black,
                        fontSize: 32,
                        fontWeight: FontWeight.w900,
                        letterSpacing: 6,
                        shadows: [
                          Shadow(offset: const Offset(3.0, 3.0), blurRadius: 5.0, color: Colors.black.withOpacity(0.6)),
                        ],
                      ),
                    ),
                    const Text('INSIGHT ENGINE MOBILE PREVIEW', style: TextStyle(color: Colors.black87, fontSize: 14, fontWeight: FontWeight.w900, letterSpacing: 4)),
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

