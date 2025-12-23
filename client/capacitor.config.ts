import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.auraflow.app',
  appName: 'Aura Flow',
  webDir: 'dist',
  plugins: {
    LocalNotifications: {
      smallIcon: "ic_stat_icon_config_sample",
      iconColor: "#4F46E5",
      sound: "default.wav"
    },
    StatusBar: {
      overlaysWebView: true,
      style: 'Dark',
      backgroundColor: '#ffffffff'
    }
  }
};

export default config;
