import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import '../../core/providers/selection_provider.dart';
import '../../core/theme/app_theme.dart';

class PersonaStepPage extends StatefulWidget {
  const PersonaStepPage({super.key});

  @override
  State<PersonaStepPage> createState() => _PersonaStepPageState();
}

class _PersonaStepPageState extends State<PersonaStepPage> {
  int _currentStep = 0;
  final PageController _pageController = PageController();

  void _nextStep() {
    final provider = context.read<SelectionProvider>();
    
    if (_currentStep == 0 && provider.persona.isEmpty) {
      _showWarning('타겟 페르소나를 선택해 주세요.');
      return;
    }
    if (_currentStep == 1 && provider.industry.isEmpty) {
      _showWarning('창업 업종을 선택해 주세요.');
      return;
    }
    if (_currentStep == 2 && provider.capital <= 0) {
      _showWarning('초기 창업 자본을 설정해 주세요.');
      return;
    }
    if (_currentStep == 3 && provider.concept.isEmpty) {
      _showWarning('브랜드 컨셉을 선택해 주세요.');
      return;
    }

    if (_currentStep < 3) {
      _pageController.nextPage(duration: 500.ms, curve: Curves.easeInOutCubic);
      setState(() => _currentStep++);
    } else {
      context.go('/map');
    }
  }

  void _showWarning(String message) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(message, style: const TextStyle(fontWeight: FontWeight.bold)),
        backgroundColor: Colors.redAccent,
        behavior: SnackBarBehavior.floating,
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.gradientStart,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.close_rounded, color: AppTheme.textPrimary),
          onPressed: () => context.pop(),
        ),
        title: const Text('분석 모델 설정', style: TextStyle(color: AppTheme.textPrimary, fontWeight: FontWeight.bold)),
      ),
      body: Column(
        children: [
          _buildProgressBar(),
          
          Expanded(
            child: PageView(
              controller: _pageController,
              physics: const NeverScrollableScrollPhysics(),
              children: [
                _buildStep1(),
                _buildStep2(),
                _buildStepCapital(),
                _buildStep3(),
              ],
            ),
          ),
          
          Padding(
            padding: const EdgeInsets.all(24.0),
            child: ElevatedButton(
              onPressed: _nextStep,
              style: ElevatedButton.styleFrom(
                backgroundColor: AppTheme.accent,
                foregroundColor: Colors.white,
                padding: const EdgeInsets.symmetric(vertical: 20),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(15)),
                elevation: 10,
                shadowColor: AppTheme.accent.withValues(alpha: 0.3),
              ),
              child: Center(
                child: Text(
                  _currentStep == 3 ? 'AI 상권 발굴 시작' : '다음 단계로',
                  style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildProgressBar() {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 40, vertical: 20),
      child: Row(
        children: List.generate(4, (index) {
          return Expanded(
            child: Container(
              height: 4,
              margin: const EdgeInsets.symmetric(horizontal: 4),
              decoration: BoxDecoration(
                color: index <= _currentStep ? AppTheme.accent : AppTheme.accent.withOpacity(0.1),
                borderRadius: BorderRadius.circular(2),
              ),
            ),
          );
        }),
      ).animate().fadeIn(),
    );
  }

  Widget _buildStep1() {
    final provider = context.watch<SelectionProvider>();
    return SingleChildScrollView(
      padding: const EdgeInsets.all(32.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text('관심 있는 타겟\n페르소나를 선택하세요.', 
            style: TextStyle(color: AppTheme.textPrimary, fontSize: 26, fontWeight: FontWeight.bold, height: 1.4)),
          const SizedBox(height: 12),
          const Text('AI가 이 페르소나의 소비 패턴을 분석합니다.', style: TextStyle(color: AppTheme.textSecondary, fontSize: 15)),
          const SizedBox(height: 32),
          _buildSelectionCard(
            Icons.person_search_rounded, 'MZ세대 트렌드세터', '20-30대 핵심 타겟, 높은 소비력, SNS 화제성 기반',
            isSelected: provider.persona == 'MZ세대',
            onTap: () => provider.setPersona('MZ세대'),
          ),
          _buildSelectionCard(
            Icons.person_outline_rounded, '20대 솔로 (Single 20s)', '트렌드에 민감한 20대 1인 가구, 가성비와 경험 중시',
            isSelected: provider.persona == '20대솔로',
            onTap: () => provider.setPersona('20대솔로'),
          ),
          _buildSelectionCard(
            Icons.person_rounded, '30대 솔로 (Single 30s)', '독립적인 경제력을 갖춘 30대 1인 가구, 품질과 취향 중시',
            isSelected: provider.persona == '30대솔로',
            onTap: () => provider.setPersona('30대솔로'),
          ),
          _buildSelectionCard(
            Icons.family_restroom_rounded, '안정적인 팸슈머', '30-40대, 거주지 중심, 자녀 동반 가족 단위 소비',
            isSelected: provider.persona == '팸슈머',
            onTap: () => provider.setPersona('팸슈머'),
          ),
        ],
      ),
    );
  }

  Widget _buildStep2() {
    final provider = context.watch<SelectionProvider>();
    return SingleChildScrollView(
      padding: const EdgeInsets.all(32.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text('어떤 비즈니스를\n계획 중이신가요?', 
            style: TextStyle(color: AppTheme.textPrimary, fontSize: 26, fontWeight: FontWeight.bold, height: 1.4)),
          const SizedBox(height: 40),
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Top Row (4 items)
              Wrap(
                spacing: 12,
                runSpacing: 12,
                children: [
                  _buildCategoryChip('술집 (Pub)', Icons.local_bar_rounded,
                    isSelected: provider.industry == '술집', onTap: () => provider.setIndustry('술집')),
                  _buildCategoryChip('카페/디저트', Icons.local_cafe_rounded,
                    isSelected: provider.industry == '카페', onTap: () => provider.setIndustry('카페')),
                  _buildCategoryChip('공유 오피스', Icons.laptop_chromebook_rounded,
                    isSelected: provider.industry == '오피스', onTap: () => provider.setIndustry('오피스')),
                  _buildCategoryChip('무인 매장', Icons.smart_toy_rounded,
                    isSelected: provider.industry == '무인매장', onTap: () => provider.setIndustry('무인매장')),
                ],
              ),
              const SizedBox(height: 12),
              // Bottom Row (3 items)
              Wrap(
                spacing: 12,
                runSpacing: 12,
                children: [
                  _buildCategoryChip('브런치&파스타', Icons.restaurant_rounded, 
                    isSelected: provider.industry == '브런치', onTap: () => provider.setIndustry('브런치')),
                  _buildCategoryChip('한식&고기집', Icons.kebab_dining_rounded,
                    isSelected: provider.industry == '한식', onTap: () => provider.setIndustry('한식')),
                  _buildCategoryChip('패션&편집샵&소품샵', Icons.shopping_bag_rounded,
                    isSelected: provider.industry == '편집샵', onTap: () => provider.setIndustry('편집샵')),
                ],
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildStep3() {
    final provider = context.watch<SelectionProvider>();
    return SingleChildScrollView(
      padding: const EdgeInsets.all(32.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text('마지막으로\n브랜드의 핵심 가치는?', 
            style: TextStyle(color: AppTheme.textPrimary, fontSize: 26, fontWeight: FontWeight.bold, height: 1.4)),
          const SizedBox(height: 40),
          _buildSelectionCard(
            Icons.auto_awesome_rounded, '럭셔리 & 프리미엄', '강남, 한남 등 하이엔드 상권 지향',
            isSelected: provider.concept == '럭셔리',
            onTap: () => provider.setConcept('럭셔리'),
          ),
          _buildSelectionCard(
            Icons.flash_on_rounded, '가성비 & 회전율', '대학가, 오피스 등 박리다매 상권 지향',
            isSelected: provider.concept == '가성비',
            onTap: () => provider.setConcept('가성비'),
          ),
        ],
      ),
    );
  }

  Widget _buildStepCapital() {
    final provider = context.watch<SelectionProvider>();
    final benchmark = provider.industryBenchmark;
    
    return SingleChildScrollView(
      padding: const EdgeInsets.all(32.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text('초기 창업 자본을\n입력해 주세요.', 
            style: TextStyle(color: AppTheme.textPrimary, fontSize: 26, fontWeight: FontWeight.bold, height: 1.4)),
          const SizedBox(height: 12),
          Text('${provider.industry.isEmpty ? "선택한" : provider.industry} 업종의 평균 창업 비용은 약 ${ (benchmark / 100000000).toStringAsFixed(1) }억 원입니다.', 
            style: const TextStyle(color: AppTheme.accent, fontSize: 14, fontWeight: FontWeight.w500)),
          const SizedBox(height: 48),
          
          Container(
            padding: const EdgeInsets.all(24),
            decoration: BoxDecoration(
              color: const Color(0xFFF8F7FF),
              borderRadius: BorderRadius.circular(24),
              border: Border.all(color: AppTheme.accent.withValues(alpha: 0.1)),
            ),
            child: Column(
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text('창업 예산', style: TextStyle(color: Color(0xFF64748B), fontSize: 16, fontWeight: FontWeight.w600)),
                    Text('₩${(provider.capital / 10000).toInt().toString().replaceAllMapped(RegExp(r'(\d{1,3})(?=(\d{3})+(?!\d))'), (Match m) => '${m[1]},')}만', 
                      style: const TextStyle(color: Color(0xFF1E1B4B), fontSize: 24, fontWeight: FontWeight.bold)),
                  ],
                ),
                const SizedBox(height: 32),
                SliderTheme(
                  data: SliderTheme.of(context).copyWith(
                    activeTrackColor: const Color(0xFF6366F1),
                    inactiveTrackColor: const Color(0xFFE2E8F0),
                    thumbColor: const Color(0xFF6366F1),
                    overlayColor: const Color(0xFF6366F1).withOpacity(0.12),
                    trackHeight: 4,
                  ),
                  child: Slider(
                    value: provider.capital,
                    min: 10000000,
                    max: 1000000000,
                    divisions: 99,
                    onChanged: (value) => provider.setCapital(value),
                  ),
                ),
                const SizedBox(height: 16),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: const [
                    Text('시드 (1천만)', style: TextStyle(color: Color(0xFF94A3B8), fontSize: 10, fontWeight: FontWeight.w500)),
                    Text('스케일업 (5억)', style: TextStyle(color: Color(0xFF94A3B8), fontSize: 10, fontWeight: FontWeight.w500)),
                    Text('확장 (10억)', style: TextStyle(color: Color(0xFF94A3B8), fontSize: 10, fontWeight: FontWeight.w500)),
                  ],
                ),
              ],
            ),
          ).animate().fadeIn().scale(),
          
          const SizedBox(height: 32),
          Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              color: AppTheme.accent.withValues(alpha: 0.05),
              borderRadius: BorderRadius.circular(15),
              border: Border.all(color: AppTheme.accent.withValues(alpha: 0.1)),
            ),
            child: Row(
              children: [
                const Icon(Icons.info_outline_rounded, color: AppTheme.accent, size: 20),
                const SizedBox(width: 12),
                Expanded(
                  child: Text(
                    provider.capital >= benchmark 
                      ? '선택하신 예산은 업종 평균보다 여유롭습니다. 프리미엄 입지 분석을 강화합니다.'
                      : '평균보다 타이트한 예산입니다. 가성비 중심의 전략적 요충지를 우선 추천합니다.',
                    style: const TextStyle(color: AppTheme.accent, fontSize: 12, height: 1.5),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSelectionCard(IconData icon, String title, String desc, {required bool isSelected, required VoidCallback onTap}) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        margin: const EdgeInsets.only(bottom: 16),
        padding: const EdgeInsets.all(20),
        decoration: BoxDecoration(
          color: isSelected ? AppTheme.accent.withOpacity(0.08) : Colors.white,
          borderRadius: BorderRadius.circular(20),
          border: Border.all(color: isSelected ? AppTheme.accent : AppTheme.accent.withValues(alpha: 0.1)),
        ),
        child: Row(
          children: [
            Icon(icon, color: isSelected ? AppTheme.accent : const Color(0xFF94A3B8), size: 32),
            const SizedBox(width: 20),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(title, style: TextStyle(color: isSelected ? AppTheme.accent : const Color(0xFF334155), fontWeight: FontWeight.bold, fontSize: 16)),
                  const SizedBox(height: 4),
                  Text(desc, style: TextStyle(color: isSelected ? AppTheme.accent.withOpacity(0.7) : const Color(0xFF64748B), fontSize: 12, fontWeight: FontWeight.w500)),
                ],
              ),
            ),
            Icon(
              isSelected ? Icons.check_circle_rounded : Icons.radio_button_off_rounded, 
              color: isSelected ? AppTheme.accent : const Color(0xFFCBD5E1),
            ),
          ],
        ),
      ),
    ).animate().fadeIn(duration: 400.ms).slideX(begin: 0.1, end: 0);
  }

  Widget _buildCategoryChip(String label, IconData icon, {required bool isSelected, required VoidCallback onTap}) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
        decoration: BoxDecoration(
          color: isSelected ? AppTheme.accent : Colors.white.withOpacity(0.5),
          borderRadius: BorderRadius.circular(15),
          border: Border.all(color: isSelected ? AppTheme.accent : AppTheme.accent.withOpacity(0.1)),
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(icon, color: isSelected ? Colors.white : AppTheme.accent, size: 20),
            const SizedBox(width: 10),
            Text(label, style: TextStyle(color: isSelected ? Colors.white : AppTheme.textPrimary, fontWeight: isSelected ? FontWeight.bold : FontWeight.normal)),
          ],
        ),
      ),
    ).animate().scale(delay: 100.ms);
  }
}
