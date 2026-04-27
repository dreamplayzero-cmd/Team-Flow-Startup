import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../ui/pages/login_page.dart';
import '../../ui/pages/dashboard_page.dart';
import '../../ui/pages/persona_step_page.dart';
import '../../ui/pages/map_scouting_page.dart';
import '../../ui/pages/leaderboard_page.dart';
import '../../ui/pages/district_report_page.dart';

class AppRouter {
  static final GlobalKey<NavigatorState> _rootNavigatorKey = GlobalKey<NavigatorState>();

  static final GoRouter router = GoRouter(
    initialLocation: '/login',
    navigatorKey: _rootNavigatorKey,
    routes: [
      // 1. 로그인 화면
      GoRoute(
        path: '/login',
        builder: (context, state) => const LoginPage(),
      ),

      // 메인 탭 구조 (Shell Route)
      StatefulShellRoute.indexedStack(
        builder: (context, state, navigationShell) {
          return ScaffoldWithNavBar(navigationShell: navigationShell);
        },
        branches: [
          StatefulShellBranch(
            routes: [
              GoRoute(
                path: '/dashboard',
                builder: (context, state) => const DashboardPage(),
              ),
            ],
          ),
          StatefulShellBranch(
            routes: [
              GoRoute(
                path: '/map',
                builder: (context, state) => const MapScoutingPage(),
              ),
            ],
          ),
          StatefulShellBranch(
            routes: [
              GoRoute(
                path: '/leaderboard',
                builder: (context, state) => const LeaderboardPage(),
              ),
            ],
          ),
        ],
      ),

      // 기타 페이지
      GoRoute(
        path: '/persona-step',
        builder: (context, state) => const PersonaStepPage(),
      ),
      GoRoute(
        path: '/report',
        builder: (context, state) => const DistrictReportPage(),
      ),
    ],
  );
}

class ScaffoldWithNavBar extends StatelessWidget {
  // StatefulShellNavigationShell -> StatefulNavigationShell 로 변경 (버전 호환성)
  const ScaffoldWithNavBar({required this.navigationShell, Key? key}) 
      : super(key: key ?? const ValueKey('ScaffoldWithNavBar'));

  final StatefulNavigationShell navigationShell;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: navigationShell,
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: navigationShell.currentIndex,
        items: const [
          BottomNavigationBarItem(icon: Icon(Icons.dashboard_rounded), label: '홈'),
          BottomNavigationBarItem(icon: Icon(Icons.map_rounded), label: '3D 맵'),
          BottomNavigationBarItem(icon: Icon(Icons.leaderboard_rounded), label: '리더보드'),
        ],
        onTap: (index) => navigationShell.goBranch(index),
      ),
    );
  }
}
