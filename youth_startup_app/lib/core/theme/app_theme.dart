import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class AppTheme {
  // --- 핵심 컬러 팔레트 (Premium Dark) ---
  static const Color background = Color(0xFF0F172A); // 딥 네이비 블랙
  static const Color surface = Color(0xFF1E293B);    // 카드 및 표면 색상
  static const Color primary = Color(0xFF3B82F6);    // 메인 블루
  static const Color accent = Color(0xFF6366F1);     // 포인트 인디고
  static const Color textPrimary = Color(0xFFF8FAFC); // 밝은 회색 텍스트
  static const Color textSecondary = Color(0xFF94A3B8); // 보조 텍스트
  
  static const Color gradientStart = Color(0xFF0F172A);
  static const Color gradientEnd = Color(0xFF1E293B);
  static const Color cardBackground = Color(0xFF1E293B);

  static ThemeData get darkTheme {
    return ThemeData(
      brightness: Brightness.dark,
      scaffoldBackgroundColor: background,
      primaryColor: primary,
      
      // 폰트 설정 (Outfit 서체: 모던하고 고급스러움)
      textTheme: GoogleFonts.outfitTextTheme(ThemeData.dark().textTheme).copyWith(
        displayLarge: GoogleFonts.outfit(
          fontSize: 32,
          fontWeight: FontWeight.bold,
          color: textPrimary,
        ),
        bodyLarge: GoogleFonts.inter(
          fontSize: 16,
          color: textPrimary,
        ),
        bodyMedium: GoogleFonts.inter(
          fontSize: 14,
          color: textSecondary,
        ),
      ),

      // 카드 디자인 스타일
      cardTheme: CardThemeData(
        color: surface,
        elevation: 0,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(16),
          side: BorderSide(color: Colors.white.withOpacity(0.05)),
        ),
      ),

      // 내비게이션 바 스타일
      bottomNavigationBarTheme: const BottomNavigationBarThemeData(
        backgroundColor: background,
        selectedItemColor: primary,
        unselectedItemColor: textSecondary,
        type: BottomNavigationBarType.fixed,
        elevation: 10,
      ),

      // 앱바 스타일
      appBarTheme: const AppBarTheme(
        backgroundColor: background,
        elevation: 0,
        centerTitle: true,
        titleTextStyle: TextStyle(
          fontSize: 18,
          fontWeight: FontWeight.bold,
          color: textPrimary,
        ),
      ),
    );
  }
}
