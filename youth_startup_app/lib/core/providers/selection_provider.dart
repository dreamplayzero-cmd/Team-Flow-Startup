import 'package:flutter/material.dart';

class SelectionProvider with ChangeNotifier {
  String _persona = '';
  String _industry = '';
  String _concept = '';
  double _capital = 150000000; // 초기 자본 (기본 1.5억)

  String get persona => _persona;
  String get industry => _industry;
  String get concept => _concept;
  double get capital => _capital;

  // 업종별 창업 비용 기준 데이터 (단위: 원)
  static const Map<String, double> industryBenchmarks = {
    'F&B (식음료)': 120000000,
    '패션/리테일': 80000000,
    '문화/예술': 60000000,
    '서비스/테크': 50000000,
  };

  double get industryBenchmark => industryBenchmarks[_industry] ?? 100000000;

  void setPersona(String value) {
    _persona = value;
    notifyListeners();
  }

  void setIndustry(String value) {
    _industry = value;
    notifyListeners();
  }

  void setConcept(String value) {
    _concept = value;
    notifyListeners();
  }

  void setCapital(double value) {
    _capital = value;
    notifyListeners();
  }

  bool get isComplete => _persona.isNotEmpty && _industry.isNotEmpty && _concept.isNotEmpty;
}
