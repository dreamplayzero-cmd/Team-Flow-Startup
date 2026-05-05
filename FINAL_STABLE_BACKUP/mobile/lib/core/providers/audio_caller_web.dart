import 'dart:js' as js;

void playBGM(String url, {double volume = 0.5, String layer = 'base'}) {
  try {
    js.context.callMethod('playBGM', [url, volume, layer]);
  } catch (e) {
    print("JS Call Error (playBGM): $e");
  }
}

void stopBGM({String layer = 'base'}) {
  try {
    js.context.callMethod('stopBGM', [layer]);
  } catch (e) {
    print("JS Call Error (stopBGM): $e");
  }
}

void setVolume(double volume, {String layer = 'base'}) {
  try {
    js.context.callMethod('setVolume', [volume, layer]);
  } catch (e) {
    print("JS Call Error (setVolume): $e");
  }
}
