import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:go_router/go_router.dart';
import 'dart:ui';

class LoginPage extends StatelessWidget {
  const LoginPage({super.key});

  @override
  Widget build(BuildContext context) {
    // 화면 너비에 따른 컨테이너 최대 너비 설정 (더 컴팩트하게)
    final double screenWidth = MediaQuery.of(context).size.width;
    final double containerWidth = screenWidth > 400 ? 320 : screenWidth * 0.80;

    return Scaffold(
      backgroundColor: Colors.black,
      body: Stack(
        children: [
          // 1. 배경 마블 이미지 (배율 유지 최적화)
          Positioned.fill(
            child: Image.network(
              'https://images.unsplash.com/photo-1533158326339-7f3cf2404354?q=80&w=2668&auto=format&fit=crop',
              fit: BoxFit.cover,
              alignment: Alignment.center,
              errorBuilder: (context, error, stackTrace) => Container(color: Colors.black),
            ).animate().fadeIn(duration: 1000.ms),
          ),
          
          Positioned.fill(
            child: Container(
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  begin: Alignment.topCenter,
                  end: Alignment.bottomCenter,
                  colors: [
                    Colors.black.withOpacity(0.4),
                    Colors.black.withOpacity(0.9),
                  ],
                ),
              ),
            ),
          ),

          SafeArea(
            child: Center(
              child: SingleChildScrollView(
                child: Container(
                  width: containerWidth,
                  padding: const EdgeInsets.symmetric(vertical: 20),
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    crossAxisAlignment: CrossAxisAlignment.stretch,
                    children: [
                      // 로고 섹션 (크기 축소)
                      Column(
                        children: [
                          const Icon(Icons.auto_graph_rounded, color: Colors.white, size: 44)
                              .animate().scale(duration: 600.ms, curve: Curves.easeOutBack),
                          const SizedBox(height: 8),
                          Text(
                            'THE SOVEREIGN',
                            style: Theme.of(context).textTheme.displayLarge?.copyWith(
                              color: Colors.white,
                              letterSpacing: 3,
                              fontSize: 18,
                              fontWeight: FontWeight.bold,
                            ),
                          ).animate().fadeIn(delay: 300.ms).moveY(begin: 10, end: 0),
                          const Text(
                            'INSIGHT ENGINE',
                            style: TextStyle(color: Colors.white60, letterSpacing: 4, fontSize: 8),
                          ).animate().fadeIn(delay: 500.ms),
                        ],
                      ),
                      
                      const SizedBox(height: 32),

                      // 로그인 폼 섹션 (글래스모피즘 - 더 슬림하게)
                      ClipRRect(
                        borderRadius: BorderRadius.circular(20),
                        child: BackdropFilter(
                          filter: ImageFilter.blur(sigmaX: 15, sigmaY: 15),
                          child: Container(
                            padding: const EdgeInsets.all(20),
                            decoration: BoxDecoration(
                              color: Colors.white.withOpacity(0.06),
                              borderRadius: BorderRadius.circular(20),
                              border: Border.all(color: Colors.white.withOpacity(0.1)),
                            ),
                            child: Column(
                              children: [
                                _buildInputField(Icons.alternate_email_rounded, '이메일 주소'),
                                const SizedBox(height: 10),
                                _buildInputField(Icons.lock_outline_rounded, '비밀번호', isPassword: true),
                                const SizedBox(height: 20),
                                
                                ElevatedButton(
                                  onPressed: () => context.go('/dashboard'),
                                  style: ElevatedButton.styleFrom(
                                    backgroundColor: const Color(0xFF3B82F6),
                                    foregroundColor: Colors.white,
                                    padding: const EdgeInsets.symmetric(vertical: 14),
                                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                                    elevation: 0,
                                  ),
                                  child: const Center(
                                    child: Text('시작하기', 
                                      style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
                                  ),
                                ).animate().shimmer(delay: 1000.ms, duration: 1500.ms),
                                
                                const SizedBox(height: 16),
                                
                                // 구글 로그인 버튼 (추가됨)
                                OutlinedButton(
                                  onPressed: () => context.go('/dashboard'),
                                  style: OutlinedButton.styleFrom(
                                    backgroundColor: Colors.white.withOpacity(0.05),
                                    foregroundColor: Colors.white,
                                    side: BorderSide(color: Colors.white.withOpacity(0.1)),
                                    padding: const EdgeInsets.symmetric(vertical: 14),
                                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                                  ),
                                  child: Row(
                                    mainAxisAlignment: MainAxisAlignment.center,
                                    children: [
                                      Image.network(
                                        'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_Color_Icon.svg/1200px-Google_Color_Icon.svg.png',
                                        height: 18,
                                      ),
                                      const SizedBox(width: 12),
                                      const Text('Google 계정으로 계속하기', 
                                        style: TextStyle(fontSize: 13, fontWeight: FontWeight.w500)),
                                    ],
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ),
                      ).animate().slideY(begin: 0.1, end: 0, duration: 600.ms),
                      
                      const SizedBox(height: 24),
                      
                      // 하단 옵션 (더 작고 세밀하게)
                      Column(
                        children: [
                          TextButton(
                            onPressed: () {},
                            child: const Text('회원가입', 
                              style: TextStyle(color: Colors.white38, fontSize: 11)),
                          ),
                          const SizedBox(height: 4),
                          Row(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: const [
                              Icon(Icons.fingerprint_rounded, color: Colors.white24, size: 16),
                              SizedBox(width: 6),
                              Text('생체 인증', style: TextStyle(color: Colors.white24, fontSize: 11)),
                            ],
                          ),
                        ],
                      ).animate().fadeIn(delay: 1000.ms),
                    ],
                  ),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildInputField(IconData icon, String hint, {bool isPassword = false}) {
    return Container(
      height: 48, // 높이 고정으로 더 슬림하게
      decoration: BoxDecoration(
        color: Colors.black.withOpacity(0.5),
        borderRadius: BorderRadius.circular(10),
        border: Border.all(color: Colors.white.withOpacity(0.05)),
      ),
      child: TextField(
        obscureText: isPassword,
        style: const TextStyle(color: Colors.white, fontSize: 13),
        decoration: InputDecoration(
          hintText: hint,
          hintStyle: const TextStyle(color: Colors.white24, fontSize: 13),
          prefixIcon: Icon(icon, color: Colors.white38, size: 18),
          border: InputBorder.none,
          contentPadding: const EdgeInsets.symmetric(vertical: 12),
        ),
      ),
    );
  }
}
