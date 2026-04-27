import 'dart:ui';
import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';

class PremiumChatBot extends StatefulWidget {
  const PremiumChatBot({super.key});

  @override
  State<PremiumChatBot> createState() => _PremiumChatBotState();
}

class _PremiumChatBotState extends State<PremiumChatBot> {
  bool _isOpened = false;

  void _toggleChat() {
    setState(() {
      _isOpened = !_isOpened;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Stack(
      children: [
        // 1. Chat Window (Opened State)
        AnimatedPositioned(
          duration: const Duration(milliseconds: 600),
          curve: Curves.fastOutSlowIn,
          bottom: _isOpened ? 100 : 80,
          right: 30,
          child: AnimatedOpacity(
            duration: const Duration(milliseconds: 400),
            opacity: _isOpened ? 1.0 : 0.0,
            child: IgnorePointer(
              ignoring: !_isOpened,
              child: _buildChatWindow(),
            ),
          ),
        ),

        // 2. Floating Orb Button
        Positioned(
          bottom: 30,
          right: 30,
          child: GestureDetector(
            onTap: _toggleChat,
            child: _buildOrbButton(),
          ),
        ),
      ],
    );
  }

  Widget _buildOrbButton() {
    return MouseRegion(
      cursor: SystemMouseCursors.click,
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.end,
        children: [
          if (!_isOpened)
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
              margin: const EdgeInsets.only(bottom: 8),
              decoration: BoxDecoration(
                color: Colors.black.withOpacity(0.4),
                borderRadius: BorderRadius.circular(10),
                border: Border.all(color: Colors.white.withOpacity(0.1)),
              ),
              child: const Text(
                'Sovereign AI Consultant',
                style: TextStyle(
                  color: Colors.white70,
                  fontSize: 10,
                  fontWeight: FontWeight.bold,
                  letterSpacing: 1.0,
                ),
              ),
            ).animate().fadeIn(delay: 1.seconds).slideY(begin: 0.5, end: 0),
          
          Container(
            width: 56,
            height: 56,
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              boxShadow: [
                BoxShadow(
                  color: const Color(0xFFFFD700).withOpacity(0.3),
                  blurRadius: 20,
                  spreadRadius: 2,
                ),
              ],
              gradient: const LinearGradient(
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
                colors: [
                  Color(0xFFFFD700), // Gold
                  Color(0xFFB8860B), // Dark Goldenrod
                ],
              ),
            ),
            child: Stack(
              alignment: Alignment.center,
              children: [
                // Abstract Orb Light Effect
                Container(
                  width: 40,
                  height: 40,
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    gradient: RadialGradient(
                      colors: [
                        Colors.white.withOpacity(0.8),
                        Colors.transparent,
                      ],
                      center: const Alignment(-0.3, -0.3),
                    ),
                  ),
                ),
                Icon(
                  _isOpened ? Icons.close_rounded : Icons.auto_awesome_rounded,
                  color: Colors.white,
                  size: 24,
                ),
              ],
            ),
          ).animate(onPlay: (controller) => controller.repeat(reverse: true))
           .scale(begin: const Offset(1.0, 1.0), end: const Offset(1.05, 1.05), duration: 2.seconds, curve: Curves.easeInOut),
        ],
      ),
    );
  }

  Widget _buildChatWindow() {
    return Container(
      width: 380,
      height: 500,
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(32),
        border: Border.all(color: Colors.white.withOpacity(0.15)),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.5),
            blurRadius: 40,
            spreadRadius: 10,
          ),
        ],
      ),
      child: ClipRRect(
        borderRadius: BorderRadius.circular(32),
        child: BackdropFilter(
          filter: ImageFilter.blur(sigmaX: 20, sigmaY: 20),
          child: Container(
            decoration: BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
                colors: [
                  Colors.white.withOpacity(0.08),
                  Colors.white.withOpacity(0.03),
                ],
              ),
            ),
            child: Column(
              children: [
                // Header
                _buildHeader(),
                
                // Chat Area
                Expanded(
                  child: ListView(
                    padding: const EdgeInsets.all(24),
                    children: [
                      _buildAiMessage(
                        "안녕하세요, 창업자의 주권을 지키는 Flow AI입니다. 모바일(9,900원)로 가볍게 보셨나요? 이곳 웹(29,000원)에서는 전문가의 깊이 있는 GIS 분석 리포트와 월 1회 1:1 컨설팅까지 밀착 케어해 드립니다. 무엇이든 물어보세요."
                      ),
                    ],
                  ),
                ),

                // Input Area
                _buildInputArea(),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildHeader() {
    return Container(
      padding: const EdgeInsets.fromLTRB(24, 32, 24, 24),
      decoration: BoxDecoration(
        border: Border(bottom: BorderSide(color: Colors.white.withOpacity(0.05))),
      ),
      child: Row(
        children: [
          Container(
            width: 44,
            height: 44,
            decoration: const BoxDecoration(
              shape: BoxShape.circle,
              gradient: LinearGradient(
                colors: [Color(0xFFFFD700), Color(0xFFDAA520)],
              ),
            ),
            child: const Icon(Icons.auto_awesome_rounded, color: Colors.white, size: 20),
          ),
          const SizedBox(width: 16),
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text(
                'Flow AI Consultant',
                style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 16),
              ),
              Row(
                children: [
                  Container(
                    width: 8,
                    height: 8,
                    decoration: const BoxDecoration(color: Colors.greenAccent, shape: BoxShape.circle),
                  ),
                  const SizedBox(width: 6),
                  const Text(
                    'Senior Class Specialist',
                    style: TextStyle(color: Colors.white38, fontSize: 11, fontWeight: FontWeight.bold),
                  ),
                ],
              ),
            ],
          ),
          const Spacer(),
          const Text(
            'THE SOVEREIGN',
            style: TextStyle(color: Colors.white24, fontSize: 10, fontWeight: FontWeight.w900, letterSpacing: 2),
          ),
        ],
      ),
    );
  }

  Widget _buildAiMessage(String text) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Container(
          padding: const EdgeInsets.all(20),
          decoration: BoxDecoration(
            color: Colors.white.withOpacity(0.05),
            borderRadius: const BorderRadius.only(
              topRight: Radius.circular(20),
              bottomLeft: Radius.circular(20),
              bottomRight: Radius.circular(20),
            ),
            border: Border.all(color: Colors.white.withOpacity(0.1)),
          ),
          child: Text(
            text,
            style: const TextStyle(color: Colors.white, fontSize: 13, height: 1.6, fontWeight: FontWeight.w500),
          ),
        ).animate().fadeIn(duration: 600.ms).slideY(begin: 0.1, end: 0),
        const SizedBox(height: 8),
        const Text(
          'Just now · Sovereign Insight Engine',
          style: TextStyle(color: Colors.white24, fontSize: 9, fontWeight: FontWeight.bold),
        ),
      ],
    );
  }

  Widget _buildInputArea() {
    return Container(
      padding: const EdgeInsets.all(20),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 4),
        decoration: BoxDecoration(
          color: Colors.black.withOpacity(0.3),
          borderRadius: BorderRadius.circular(15),
          border: Border.all(color: Colors.white.withOpacity(0.05)),
        ),
        child: Row(
          children: [
            const Expanded(
              child: TextField(
                style: TextStyle(color: Colors.white, fontSize: 13),
                decoration: InputDecoration(
                  hintText: '궁금한 내용을 입력하세요...',
                  hintStyle: TextStyle(color: Colors.white24, fontSize: 13),
                  border: InputBorder.none,
                ),
              ),
            ),
            IconButton(
              icon: const Icon(Icons.send_rounded, color: Color(0xFFFFD700), size: 20),
              onPressed: () {},
            ),
          ],
        ),
      ),
    );
  }
}
