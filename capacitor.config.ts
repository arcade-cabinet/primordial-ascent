import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.arcadecabinet.primordialascent",
  appName: "Primordial Ascent",
  webDir: "dist",
  server: {
    androidScheme: "https",
  },
  plugins: {
    SplashScreen: {
      launchAutoHide: false,
      backgroundColor: "#120907",
      showSpinner: false,
    },
    StatusBar: {
      style: "DARK",
      backgroundColor: "#120907",
      overlaysWebView: true,
    },
    ScreenOrientation: {
      lock: "portrait",
    },
  },
};

export default config;
