
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.ea205dd0902a45698934da9ba8795829',
  appName: 'ReadStrike',
  webDir: 'dist',
  server: {
    url: 'https://ea205dd0-902a-4569-8934-da9ba8795829.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  // This setting helps with debugging
  loggingBehavior: 'debug'
};

export default config;
