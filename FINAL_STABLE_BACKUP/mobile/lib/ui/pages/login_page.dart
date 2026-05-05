import 'dart:ui';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:go_router/go_router.dart';
import '../../core/theme/app_theme.dart';
import '../../core/providers/audio_provider.dart';

class LoginPage extends StatelessWidget {
  const LoginPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.black,
      body: Stack(
        children: [
          // 1. [CSI RESTORATION] 20:50 Vibrant Abstract Background (Image 3 Parity)
          Positioned.fill(
            child: Image.network(
              'https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=2564&auto=format&fit=crop',
              fit: BoxFit.cover,
              errorBuilder: (context, error, stackTrace) => Container(
                decoration: const BoxDecoration(
                  gradient: LinearGradient(
                    colors: [Color(0xFF1E3A8A), Color(0xFF9D174D)],
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                  ),
                ),
              ),
            ),
          ),
          
          // Dark Gradient Overlay to make the image blend perfectly but not too black
          Positioned.fill(
            child: Container(
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  begin: Alignment.topCenter,
                  end: Alignment.bottomCenter,
                  colors: [
                    Colors.black.withOpacity(0.2), // Lighter at top
                    Colors.black.withOpacity(0.4),
                    Colors.black.withOpacity(0.65), // Less dark at bottom to prevent "washed out black" look
                  ],
                ),
              ),
            ),
          ),

          // 2. Main UI Content (Zero-Crop Perfect Centering Strategy)
          SafeArea(
            child: Center(
              child: FittedBox(
                fit: BoxFit.scaleDown, // 화면이 작을 때만 전체 레이아웃을 비율 그대로 축소 (절대 잘림 없음)
                child: SizedBox(
                  width: 375, // 모바일 황금비율 기준 가로 사이즈 고정
                  child: Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 40), // 상하 40px 여백 강제 확보
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        // LOGO SECTION
                        _buildLogo(),
                        
                        const SizedBox(height: 40),

                        // LOGIN CARD
                        _buildLoginCard(context),

                        const SizedBox(height: 24),

                        // FOOTER ACTIONS
                        _buildFooter(context),

                        const SizedBox(height: 24),

                        // BGM TEST BUTTON
                        _buildBgmTestButton(context),
                      ],
                    ),
                  ),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildLogo() {
    return Column(
      children: [
        const Icon(Icons.auto_graph_rounded, color: Colors.white, size: 54)
            .animate().scale(duration: 800.ms, curve: Curves.easeOutBack),
        const SizedBox(height: 16),
        const Text(
          'THE SOVEREIGN',
          style: TextStyle(
            color: Colors.white,
            fontSize: 28,
            fontWeight: FontWeight.w900,
            letterSpacing: 4.0,
          ),
        ).animate().fadeIn(delay: 300.ms),
        const SizedBox(height: 6),
        const Text(
          'INSIGHT ENGINE',
          style: TextStyle(
            color: Colors.white70,
            fontSize: 12,
            fontWeight: FontWeight.w700,
            letterSpacing: 6.0,
          ),
        ).animate().fadeIn(delay: 500.ms),
      ],
    );
  }

  Widget _buildLoginCard(BuildContext context) {
    return ClipRRect(
      borderRadius: BorderRadius.circular(24),
      child: BackdropFilter(
        filter: ImageFilter.blur(sigmaX: 20, sigmaY: 20),
        child: Container(
          padding: const EdgeInsets.all(32), // 20픽셀 강제 압축 취소, 원래의 아름다운 비율 복구
          decoration: BoxDecoration(
            color: const Color(0xFF1A1A24).withOpacity(0.55),
            borderRadius: BorderRadius.circular(24),
            border: Border.all(color: Colors.white.withOpacity(0.1), width: 1.0),
          ),
          child: Column(
            children: [
              _buildTextField(Icons.alternate_email_rounded, '이메일 주소'),
              const SizedBox(height: 16),
              _buildTextField(Icons.lock_outline_rounded, '비밀번호', isPassword: true),
              const SizedBox(height: 32),
              
              ElevatedButton(
                onPressed: () {
                  context.read<AudioProvider>().startPlayback();
                  context.go('/dashboard');
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF3B82F6),
                  minimumSize: const Size(double.infinity, 54), // 원상복구
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                  elevation: 0,
                ),
                child: const Text(
                  '시작하기',
                  style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Colors.white),
                ),
              ),
              
              const SizedBox(height: 16),
              
              OutlinedButton(
                onPressed: () => _handleGoogleLogin(context),
                style: OutlinedButton.styleFrom(
                  minimumSize: const Size(double.infinity, 54), // 원상복구
                  side: BorderSide(color: Colors.white.withOpacity(0.15)),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                ),
                child: const Text(
                  'Google 계정으로 계속하기',
                  style: TextStyle(color: Colors.white, fontSize: 14, fontWeight: FontWeight.w500),
                ),
              ),
            ],
          ),
        ).animate().slideY(begin: 0.1, end: 0, duration: 600.ms, curve: Curves.easeOutQuart),
      ),
    );
  }

  Widget _buildTextField(IconData icon, String hint, {bool isPassword = false}) {
    return Container(
      decoration: BoxDecoration(
        color: Colors.black.withOpacity(0.4),
        borderRadius: BorderRadius.circular(12),
      ),
      child: TextField(
        obscureText: isPassword,
        style: const TextStyle(color: Colors.white, fontWeight: FontWeight.w500),
        decoration: InputDecoration(
          prefixIcon: Icon(icon, color: Colors.white54, size: 20),
          hintText: hint,
          hintStyle: const TextStyle(color: Colors.white38, fontSize: 14),
          border: InputBorder.none,
          contentPadding: const EdgeInsets.symmetric(vertical: 18), // 원상복구
        ),
      ),
    );
  }

  Widget _buildFooter(BuildContext context) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        TextButton(
          onPressed: () {},
          child: const Text('회원가입', style: TextStyle(color: Colors.white54, fontSize: 12, fontWeight: FontWeight.w500)),
        ),
        const SizedBox(width: 8),
        const Icon(Icons.fingerprint_rounded, size: 16, color: Colors.white54),
        const SizedBox(width: 4),
        TextButton(
          onPressed: () {},
          child: const Text('생체 인증', style: TextStyle(color: Colors.white54, fontSize: 12, fontWeight: FontWeight.w500)),
        ),
      ],
    );
  }

  Widget _buildBgmTestButton(BuildContext context) {
    // [CSI RESTORATION] 이틀 전 가장 찬란했던 황금빛 BGM 버튼 복구
    return Container(
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(25),
        boxShadow: [
          BoxShadow(
            color: const Color(0xFFFFD700).withOpacity(0.3),
            blurRadius: 25,
            spreadRadius: 3,
          ),
        ],
      ),
      child: ElevatedButton.icon(
        onPressed: () => context.read<AudioProvider>().startPlayback(),
        icon: const Icon(Icons.music_note_rounded, size: 20, color: Color(0xFFFFD700)),
        label: const Text(
          'BGM 재생 테스트',
          style: TextStyle(color: Color(0xFFFFD700), fontWeight: FontWeight.bold, fontSize: 14),
        ),
        style: ElevatedButton.styleFrom(
          backgroundColor: Colors.black.withOpacity(0.7),
          side: BorderSide(color: const Color(0xFFFFD700).withOpacity(0.8), width: 1.5),
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(25)),
          padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 16),
        ),
      ).animate().fadeIn(delay: 500.ms).shimmer(duration: 2000.ms, color: Colors.white30),
    );
  }

  void _handleGoogleLogin(BuildContext context) {
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (context) => Center(
        child: ClipRRect(
          borderRadius: BorderRadius.circular(20),
          child: BackdropFilter(
            filter: ImageFilter.blur(sigmaX: 10, sigmaY: 10),
            child: Container(
              padding: const EdgeInsets.all(32),
              decoration: BoxDecoration(
                color: Colors.black.withOpacity(0.4),
                border: Border.all(color: Colors.white.withOpacity(0.2)),
                borderRadius: BorderRadius.circular(20),
              ),
              child: const Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  CircularProgressIndicator(color: Color(0xFF3B82F6), strokeWidth: 3),
                  SizedBox(height: 24),
                  Text('인증 서버 연결 중...', style: TextStyle(color: Colors.white, fontSize: 14, fontWeight: FontWeight.bold)),
                ],
              ),
            ),
          ),
        ),
      ),
    );
    Future.delayed(const Duration(milliseconds: 1500), () {
      Navigator.pop(context);
      context.read<AudioProvider>().startPlayback();
      context.go('/dashboard');
    });
  }
}
