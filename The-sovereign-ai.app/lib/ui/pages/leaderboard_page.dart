import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:go_router/go_router.dart';
import '../../core/theme/app_theme.dart';

class LeaderboardPage extends StatelessWidget {
  const LeaderboardPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.gradientStart,
      body: CustomScrollView(
        slivers: [
          // 1. 역동적인 헤더 섹션
          SliverAppBar(
            expandedHeight: 180.0,
            pinned: true,
            backgroundColor: AppTheme.gradientStart,
            flexibleSpace: FlexibleSpaceBar(
              centerTitle: false,
              titlePadding: const EdgeInsets.only(left: 20, bottom: 16),
              title: const Text(
                'AI 상권 리더보드',
                style: TextStyle(color: AppTheme.textPrimary, fontWeight: FontWeight.bold, fontSize: 22),
              ),
              background: Container(
                decoration: const BoxDecoration(
                  gradient: LinearGradient(
                    begin: Alignment.bottomRight,
                    colors: [AppTheme.gradientStart, AppTheme.gradientEnd],
                  ),
                ),
                child: Opacity(
                  opacity: 0.1,
                  child: Icon(Icons.leaderboard_rounded, size: 200, color: AppTheme.accent.withOpacity(0.5)),
                ),
              ),
            ),
          ),

          // 2. 검색 및 필터 칩 섹션
          SliverToBoxAdapter(
            child: SingleChildScrollView(
              scrollDirection: Axis.horizontal,
              padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
              child: Row(
                children: [
                  _buildFilterChip('전체 상권', isSelected: true),
                  _buildFilterChip('브런치&파스타 🍝'),
                  _buildFilterChip('한식&고기집 🥩'),
                  _buildFilterChip('패션&편집샵&소품샵 🛍️'),
                  _buildFilterChip('술집 (Pub) 🍺'),
                ],
              ),
            ),
          ),

          const SliverFillRemaining(
            child: Center(
              child: Text('새로운 분석 데이터가 대기 중입니다.', 
                style: TextStyle(color: AppTheme.textSecondary, fontSize: 14, letterSpacing: 0.5)),
            ),
          ),
          
          const SliverPadding(padding: EdgeInsets.only(bottom: 40)),
        ],
      ),
    );
  }

  Widget _buildFilterChip(String label, {bool isSelected = false}) {
    return Container(
      margin: const EdgeInsets.only(right: 8),
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      decoration: BoxDecoration(
        color: isSelected ? AppTheme.accent : Colors.white.withOpacity(0.5),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: isSelected ? Colors.transparent : AppTheme.accent.withOpacity(0.1)),
      ),
      child: Text(
        label,
        style: TextStyle(color: isSelected ? Colors.white : AppTheme.textPrimary, fontSize: 13, fontWeight: isSelected ? FontWeight.bold : FontWeight.normal),
      ),
    ).animate().fadeIn(delay: Duration(milliseconds: 200));
  }

  Widget _buildRankCard(BuildContext context, int index) {
    bool isTopThree = index < 3;
    final List<String> locations = ['성동구 성수동 2가', '강남구 신사동', '용산구 한남동', '마포구 서교동', '송파구 방이동'];
    final List<String> titles = ['연무장길 메인 클러스터', '도산공원 테라스 카페존', '한남 오거리 미식 상권', '홍대 서교동 패션 거리', '올림픽공원 브런치 골목'];
    final List<double> scores = [94.5, 92.1, 88.7, 85.2, 82.0, 79.5, 75.0, 72.3, 68.9, 65.4];

    return InkWell(
      onTap: () => context.push('/report'),
      child: Container(
        margin: const EdgeInsets.only(bottom: 16),
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: Colors.white.withOpacity(0.8),
          borderRadius: BorderRadius.circular(20),
          border: Border.all(
            color: isTopThree ? AppTheme.accent.withOpacity(0.3) : AppTheme.accent.withOpacity(0.05),
            width: isTopThree ? 1.5 : 1,
          ),
          boxShadow: isTopThree ? [BoxShadow(color: AppTheme.accent.withOpacity(0.05), blurRadius: 10)] : null,
        ),
        child: Row(
          children: [
            // 순위 숫자
            Container(
              width: 40,
              alignment: Alignment.center,
              child: Text(
                '${index + 1}',
                style: TextStyle(
                  color: isTopThree ? AppTheme.accent : AppTheme.textSecondary,
                  fontSize: 22,
                  fontWeight: FontWeight.bold,
                  fontStyle: FontStyle.italic,
                ),
              ),
            ),
            const SizedBox(width: 12),
            // 상권 정보
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    locations[index % 5],
                    style: const TextStyle(color: AppTheme.textSecondary, fontSize: 11),
                  ),
                  const SizedBox(height: 2),
                  Text(
                    titles[index % 5],
                    style: const TextStyle(color: AppTheme.textPrimary, fontWeight: FontWeight.bold, fontSize: 16),
                  ),
                  const SizedBox(height: 6),
                  Row(
                    children: [
                      _buildMiniTag('Hot', Colors.orangeAccent),
                      const SizedBox(width: 4),
                      _buildMiniTag('S급', Colors.amberAccent),
                    ],
                  ),
                ],
              ),
            ),
            // 점수 영역
            Column(
              crossAxisAlignment: CrossAxisAlignment.end,
              children: [
                Text(
                  '${scores[index]}',
                  style: const TextStyle(color: AppTheme.accent, fontSize: 20, fontWeight: FontWeight.bold),
                ),
                const Text('pts', style: TextStyle(color: AppTheme.textSecondary, fontSize: 10)),
              ],
            ),
          ],
        ),
      ).animate().fadeIn(delay: (400 + (index * 100)).ms).slideX(begin: 0.05, end: 0),
    );
  }

  Widget _buildMiniTag(String label, Color color) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
      decoration: BoxDecoration(
        color: color.withOpacity(0.1),
        borderRadius: BorderRadius.circular(6),
        border: Border.all(color: color.withOpacity(0.3)),
      ),
      child: Text(
        label,
        style: TextStyle(color: color, fontSize: 9, fontWeight: FontWeight.bold),
      ),
    );
  }
}
