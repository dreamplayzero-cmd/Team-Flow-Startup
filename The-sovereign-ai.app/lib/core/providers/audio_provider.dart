import 'package:flutter/material.dart';
import 'package:flutter/foundation.dart' show kIsWeb;
import 'audio_caller_mobile.dart'
    if (dart.library.html) 'audio_caller_web.dart'
    as caller;

class AudioProvider with ChangeNotifier {
  bool _isBasePlaying = false;
  String? _activeLayer;

  bool get isBasePlaying => _isBasePlaying;
  String? get activeLayer => _activeLayer;

  AudioProvider();

  /// Starts the persistent base theme (FIXED volume 0.2)
  /// ONLY called via user interaction (Start button)
  Future<void> startPlayback() async {
    if (_isBasePlaying) return;

    try {
      if (kIsWeb) {
        // [CSI FINAL 13s MASTER BGM] Using the most stable 13s loop
        // [CSI FIX] Multi-path fallback logic is handled in JS; here we just trigger the call
        final String assetUrl = 'assets/bgm/The_Sovereign_AI_Main_12s.mp3?v=final_13s_master';

        caller.playBGM(assetUrl, 0.2, 'base');
        _isBasePlaying = true;
        debugPrint("Base BGM (0.2) restored via 13s Master Path");
      }
    } catch (e) {
      debugPrint("startPlayback error: $e");
    }
    notifyListeners();
  }

  /// Layers a region-specific BGM over the base theme (volume 0.2)
  void playRegionLayer(String fileName) {
    if (!kIsWeb) return;

    try {
      // [CSI FIX] Use the same final master timestamp for consistency
      final String url = 'assets/bgm/$fileName?v=final_13s_master';

      // Stop existing layer before playing new one
      stopRegionLayer();

      _activeLayer = fileName;
      notifyListeners();

      caller.playBGM(url, 0.2, 'layer');
      debugPrint("Region BGM Layer ($fileName) triggered at 0.2");
    } catch (e) {
      debugPrint("playRegionLayer error: $e");
    }
    notifyListeners();
  }

  /// Stops only the regional overlay layer
  void stopRegionLayer() {
    if (kIsWeb) {
      caller.stopBGM('layer');
      _activeLayer = null;
      debugPrint("Region BGM Layer stopped");
    }
    notifyListeners();
  }

  @override
  void dispose() {
    if (kIsWeb) {
      caller.stopBGM('base');
      caller.stopBGM('layer');
    }
    super.dispose();
  }
}
