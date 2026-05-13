import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'archiwum.app',
  appName: 'Archiwum',
  webDir: 'dist',
  server: {
    // Uncomment for live reload during development:
    // url: 'http://192.168.x.x:5173',
    // cleartext: true,
    androidScheme: 'https',
  },
  android: {
    backgroundColor: '#0a0a0c',
  },
};

export default config;
