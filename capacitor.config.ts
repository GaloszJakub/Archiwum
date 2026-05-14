import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'archiwum.app',
  appName: 'Archiwum',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    // Enable native HTTP for all requests (bypasses CORS)
    allowNavigation: ['*'],
  },
  android: {
    backgroundColor: '#0a0a0c',
  },
  plugins: {
    FirebaseAuthentication: {
      skipNativeAuth: false,
      providers: ['google.com'],
    },
  },
};

export default config;
