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
        // [CSI RESTORATION] Restore the perfectly clean 13-second loop version from 2 days ago (No crackle)
        final String assetUrl =
            'assets/assets/bgm/Sovereign_Main_Theme.mp3?v=${DateTime.now().millisecondsSinceEpoch}';

        caller.playBGM(assetUrl, volume: 0.2, layer: 'base');
        _isBasePlaying = true;
        debugPrint("Base BGM (0.2) triggered via User Interaction");
      }
    } catch (e) {
      debugPrint("startPlayback error: $e");
    }
    notifyListeners();
  }

  /// Layers a region-specific BGM over the base theme (volume 0.5)
  void playRegionLayer(String fileName) {
    if (!kIsWeb) return;

    try {
      final timestamp = DateTime.now().millisecondsSinceEpoch;
      // Flutter web requires assets/assets/ prefix
      final String url = 'assets/assets/bgm/$fileName?v=$timestamp';

      // Stop existing layer before playing new one
      stopRegionLayer();

      _activeLayer = fileName;
      notifyListeners();

      // Fixed volume for layers can be 0.5 or 0.2?
      // Prompt says "모든 JS 오디오 객체의 volume 속성은... 고정값 0.2를 사용한다"
      caller.playBGM(url, volume: 0.2, layer: 'layer');
      debugPrint("Region BGM Layer ($fileName) triggered at 0.2");
    } catch (e) {
      debugPrint("playRegionLayer error: $e");
    }
    notifyListeners();
  }

  /// Stops only the regional overlay layer
  void stopRegionLayer() {
    if (kIsWeb) {
      caller.stopBGM(layer: 'layer');
      _activeLayer = null;
      debugPrint("Region BGM Layer stopped");
    }
    notifyListeners();
  }

  @override
  void dispose() {
    if (kIsWeb) {
      caller.stopBGM(layer: 'base');
      caller.stopBGM(layer: 'layer');
    }
    super.dispose();
  }
}
