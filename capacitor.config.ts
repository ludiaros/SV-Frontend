import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'SVRosal',
  webDir: 'www',
  server: {
    cleartext: true,
    androidScheme: "http"
  },
  android: {
    allowMixedContent: true
  }
};

export default config;
