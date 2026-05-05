import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class AppTheme {
  // --- 핵심 배경 그라데이션 (Premium Dark Background Gradient) ---
  static const Color gradientStart = Color(0xFF0F0C29); // Dark Midnight
  static const Color gradientEnd = Color(0xFF302B63); // Deep Indigo

  // --- 포인트 강조 색상 (Accent Color) ---
  static const Color accent = Color(0xFF3B82F6); // Sovereign Blue

  // --- 텍스트 및 기본 요소 색상 (Typography & Basic Elements) ---
  static const Color textPrimary = Colors.white; // White
  static const Color textSecondary = Colors.white70; // Light Gray
  static const Color cardBackground = Color(0xFF1E293B); // Dark Card Background

  static ThemeData get lightTheme {
    return ThemeData(
      useMaterial3: true,
      brightness: Brightness.dark,
      primaryColor: accent,
      scaffoldBackgroundColor: gradientStart, 
      // 폰트 설정
      textTheme: GoogleFonts.interTextTheme(ThemeData.dark().textTheme)
          .copyWith(
            displayLarge: GoogleFonts.inter(
              fontSize: 32,
              fontWeight: FontWeight.bold,
              color: textPrimary,
              letterSpacing: -0.5,
            ),
            displayMedium: GoogleFonts.inter(
              fontSize: 24,
              fontWeight: FontWeight.bold,
              color: textPrimary,
            ),
            bodyLarge: GoogleFonts.inter(fontSize: 16, color: textPrimary),
            bodyMedium: GoogleFonts.inter(fontSize: 14, color: textSecondary),
          ),

      // 카드 디자인 스타일
      cardTheme: CardThemeData(
        color: cardBackground.withOpacity(0.6),
        elevation: 0,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(24),
          side: BorderSide(color: Colors.white.withOpacity(0.1)),
        ),
      ),

      // 앱바 스타일
      appBarTheme: const AppBarTheme(
        backgroundColor: Colors.transparent,
        elevation: 0,
        centerTitle: true,
        iconTheme: IconThemeData(color: textPrimary),
        titleTextStyle: TextStyle(
          fontSize: 18,
          fontWeight: FontWeight.bold,
          color: textPrimary,
        ),
      ),

      // 컬러 스킴 설정
      colorScheme: ColorScheme.fromSeed(
        seedColor: accent,
        brightness: Brightness.dark,
        primary: accent,
        onPrimary: Colors.white,
        surface: cardBackground.withOpacity(0.6),
        onSurface: textPrimary,
      ),
    );
  }
}
