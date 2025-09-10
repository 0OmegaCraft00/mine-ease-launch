import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.c64bfbd0950848bda17f43d14e246ff0',
  appName: 'mine-ease-launch',
  webDir: 'dist',
  server: {
    url: "https://c64bfbd0-9508-48bd-a17f-43d14e246ff0.lovableproject.com?forceHideBadge=true",
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 3000,
      backgroundColor: "#1a1a2e"
    }
  }
};

export default config;