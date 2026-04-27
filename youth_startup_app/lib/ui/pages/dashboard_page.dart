import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:go_router/go_router.dart';
import 'package:fl_chart/fl_chart.dart';

class DashboardPage extends StatelessWidget {
  const DashboardPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF0F172A),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () => context.push('/persona-step'),
        backgroundColor: const Color(0xFF3B82F6),
        icon: const Icon(Icons.add_chart_rounded, color: Colors.white),
        label: const Text('새 상권 분석', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
      ).animate().scale(delay: 500.ms, curve: Curves.easeOutBack),
      body: CustomScrollView(
        slivers: [
          SliverAppBar(
            expandedHeight: 120.0,
            floating: false,
            pinned: true,
            backgroundColor: const Color(0xFF0F172A),
            flexibleSpace: FlexibleSpaceBar(
              titlePadding: const EdgeInsets.only(left: 20, bottom: 16),
              title: const Text('Insight Engine',
                style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, letterSpacing: 1.2, fontSize: 18)),
              background: Container(
                decoration: const BoxDecoration(
                  gradient: LinearGradient(
                    begin: Alignment.topRight,
                    colors: [Color(0xFF1E293B), Color(0xFF0F172A)],
                  ),
                ),
              ),
            ),
            actions: [
              IconButton(
                icon: const Icon(Icons.history_rounded, color: Colors.white70),
                onPressed: () => _showHistoryBottomSheet(context),
              ),
              const Padding(
                padding: EdgeInsets.only(right: 16.0),
                child: CircleAvatar(
                  radius: 16,
                  backgroundImage: NetworkImage('https://i.pravatar.cc/150?u=user123'),
                ),
              ),
            ],
          ),
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.all(20.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text('오늘의 상권 브리핑', style: TextStyle(color: Colors.white70, fontSize: 14)).animate().fadeIn(),
                  const SizedBox(height: 8),
                  const Text('2030 청년 소상공인\n맞춤형 분석이 준비되었습니다.',
                    style: TextStyle(color: Colors.white, fontSize: 22, fontWeight: FontWeight.bold, height: 1.3)),
                ],
              ),
            ),
          ),
          SliverToBoxAdapter(
            child: SizedBox(
              height: 220,
              child: ListView.builder(
                padding: const EdgeInsets.symmetric(horizontal: 16),
                scrollDirection: Axis.horizontal,
                itemCount: 3,
                itemBuilder: (context, index) => _buildFeaturedCard(context, index),
              ),
            ),
          ),
          
          // [NEW] Trend Analysis Section
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.all(24.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text('실시간 유동인구 트렌드', style: TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold)),
                  const SizedBox(height: 4),
                  const Text('서울 주요 상권별 시간대별 유동인구 변화', style: TextStyle(color: Colors.white38, fontSize: 12)),
                  const SizedBox(height: 24),
                  Container(
                    height: 200,
                    padding: const EdgeInsets.only(right: 20, top: 10, bottom: 10),
                    decoration: BoxDecoration(
                      color: const Color(0xFF1E293B).withOpacity(0.5),
                      borderRadius: BorderRadius.circular(24),
                      border: Border.all(color: Colors.white.withOpacity(0.05)),
                    ),
                    child: LineChart(
                      LineChartData(
                        gridData: FlGridData(show: false),
                        titlesData: FlTitlesData(
                          rightTitles: AxisTitles(sideTitles: SideTitles(showTitles: false)),
                          topTitles: AxisTitles(sideTitles: SideTitles(showTitles: false)),
                          bottomTitles: AxisTitles(
                            sideTitles: SideTitles(
                              showTitles: true,
                              getTitlesWidget: (value, meta) {
                                const labels = ['10시', '13시', '16시', '19시', '22시'];
                                if (value % 4 == 0 && value ~/ 4 < labels.length) {
                                  return Text(labels[value ~/ 4], style: const TextStyle(color: Colors.white30, fontSize: 10));
                                }
                                return const SizedBox();
                              },
                            ),
                          ),
                          leftTitles: AxisTitles(sideTitles: SideTitles(showTitles: false)),
                        ),
                        borderData: FlBorderData(show: false),
                        lineBarsData: [
                          LineChartBarData(
                            spots: [
                              const FlSpot(0, 3),
                              const FlSpot(4, 4),
                              const FlSpot(8, 3.5),
                              const FlSpot(12, 5),
                              const FlSpot(16, 4.5),
                            ],
                            isCurved: true,
                            color: const Color(0xFF3B82F6),
                            barWidth: 4,
                            isStrokeCapRound: true,
                            dotData: FlDotData(show: false),
                            belowBarData: BarAreaData(
                              show: true,
                              color: const Color(0xFF3B82F6).withOpacity(0.1),
                            ),
                          ),
                          LineChartBarData(
                            spots: [
                              const FlSpot(0, 2),
                              const FlSpot(4, 3),
                              const FlSpot(8, 2.8),
                              const FlSpot(12, 4),
                              const FlSpot(16, 3.2),
                            ],
                            isCurved: true,
                            color: const Color(0xFF10B981),
                            barWidth: 4,
                            isStrokeCapRound: true,
                            dotData: FlDotData(show: false),
                          ),
                        ],
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),

          // [NEW] Gentrification Risk Index
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 24),
              child: Container(
                padding: const EdgeInsets.all(24),
                decoration: BoxDecoration(
                  gradient: const LinearGradient(
                    colors: [Color(0xFF3B82F6), Color(0xFF1E40AF)],
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                  ),
                  borderRadius: BorderRadius.circular(30),
                  boxShadow: [
                    BoxShadow(color: const Color(0xFF3B82F6).withOpacity(0.3), blurRadius: 20, offset: const Offset(0, 10)),
                  ],
                ),
                child: Column(
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text('젠트리피케이션 리스크', style: TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.bold)),
                            Text('현재 성수동 연무장길 기준', style: TextStyle(color: Colors.white60, fontSize: 11)),
                          ],
                        ),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                          decoration: BoxDecoration(color: Colors.black26, borderRadius: BorderRadius.circular(12)),
                          child: const Text('LOW', style: TextStyle(color: Color(0xFF10B981), fontWeight: FontWeight.w900, fontSize: 12)),
                        ),
                      ],
                    ),
                    const SizedBox(height: 24),
                    Row(
                      children: [
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              const Text('42%', style: TextStyle(color: Colors.white, fontSize: 32, fontWeight: FontWeight.w900)),
                              const Text('리스크 지수', style: TextStyle(color: Colors.white60, fontSize: 10, fontWeight: FontWeight.bold)),
                              const SizedBox(height: 8),
                              LinearProgressIndicator(
                                value: 0.42,
                                backgroundColor: Colors.white10,
                                color: Colors.white,
                                minHeight: 6,
                                borderRadius: BorderRadius.circular(3),
                              ),
                            ],
                          ),
                        ),
                        const SizedBox(width: 40),
                        const Icon(Icons.shield_moon_rounded, color: Colors.white, size: 64),
                      ],
                    ),
                  ],
                ),
              ),
            ),
          ),
          
          const SliverPadding(padding: EdgeInsets.only(bottom: 120)),
        ],
      ),
    );
  }

  void _showHistoryBottomSheet(BuildContext context) {
    showModalBottomSheet(
      context: context,
      backgroundColor: const Color(0xFF0F172A),
      shape: const RoundedRectangleBorder(borderRadius: BorderRadius.vertical(top: Radius.circular(30))),
      builder: (context) => Container(
        padding: const EdgeInsets.all(24),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text('분석 히스토리', style: TextStyle(color: Colors.white, fontSize: 20, fontWeight: FontWeight.bold)),
            const SizedBox(height: 20),
            Expanded(
              child: ListView.builder(
                itemCount: 5,
                itemBuilder: (context, index) => _buildHistoryItem(context, index),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildFeaturedCard(BuildContext context, int index) {
    final titles = ['성수동 연무장길', '한남동 카페거리', '도산공원 테라스'];
    final scores = [84.5, 78.2, 92.0];
    final images = [
      'https://images.unsplash.com/photo-1514933651103-005eec06c04b?q=80&w=2674&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1559925393-8be0ec4767c8?q=80&w=2671&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=2647&auto=format&fit=crop',
    ];

    return AspectRatio(
      aspectRatio: 16 / 10,
      child: InkWell(
        onTap: () => context.push('/report'),
        child: Container(
          width: 300,
          margin: const EdgeInsets.only(right: 16),
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(24),
            image: DecorationImage(
              image: NetworkImage(images[index]),
              fit: BoxFit.cover,
              colorFilter: ColorFilter.mode(Colors.black.withOpacity(0.4), BlendMode.darken),
            ),
          ),
          child: Padding(
            padding: const EdgeInsets.all(20.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisAlignment: MainAxisAlignment.end,
              children: [
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                  decoration: BoxDecoration(color: const Color(0xFF3B82F6), borderRadius: BorderRadius.circular(20)),
                  child: const Text('PREMIUM', style: TextStyle(color: Colors.white, fontSize: 10, fontWeight: FontWeight.bold)),
                ),
                const SizedBox(height: 12),
                Text(titles[index], style: const TextStyle(color: Colors.white, fontSize: 20, fontWeight: FontWeight.bold)),
                const SizedBox(height: 4),
                Row(
                  children: [
                    const Icon(Icons.bolt_rounded, color: Colors.amber, size: 16),
                    const SizedBox(width: 4),
                    Text('AI Score: ${scores[index]} pts', style: const TextStyle(color: Colors.white70, fontSize: 14)),
                  ],
                ),
              ],
            ),
          ),
        ),
      ).animate().fadeIn(delay: (200 * index).ms).scale(begin: const Offset(0.9, 0.9)),
    );
  }

  Widget _buildHistoryItem(BuildContext context, int index) {
    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: const Color(0xFF1E293B),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: Colors.white.withOpacity(0.05)),
      ),
      child: Row(
        children: [
          Container(
            width: 48, height: 48,
            decoration: BoxDecoration(color: const Color(0xFF3B82F6).withOpacity(0.1), borderRadius: BorderRadius.circular(12)),
            child: const Icon(Icons.analytics_outlined, color: Color(0xFF3B82F6)),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('창업 페르소나 분석 #${5 - index}', style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
                Text('2026.04.24 · 분석 완료', style: TextStyle(color: Colors.white.withOpacity(0.5), fontSize: 12)),
              ],
            ),
          ),
          const Icon(Icons.chevron_right_rounded, color: Colors.white30),
        ],
      ),
    );
  }
}
