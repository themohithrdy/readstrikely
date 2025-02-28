
# ReadStrike Mobile App Setup

This document provides step-by-step instructions to run ReadStrike on a mobile device.

## Prerequisites
- Node.js and npm installed
- Git installed
- Android Studio installed (for Android)
- Android SDK properly configured
- A physical Android device or emulator

## Setup Steps

### 1. Clone the repository
```bash
git clone <your-repository-url>
cd <repository-name>
```

### 2. Install dependencies
```bash
npm install
```

### 3. Build the web application
```bash
npm run build
```

### 4. Set up Capacitor
If this is your first time:
```bash
npx cap add android
```

Otherwise, just sync your changes:
```bash
npx cap sync
```

### 5. Run on Android
Either open in Android Studio:
```bash
npx cap open android
```
Then click the "Run" button in Android Studio.

Or run directly:
```bash
npx cap run android
```

## Troubleshooting

If you encounter any issues:

1. Make sure all dependencies are installed: `npm install`
2. Check that the build completed successfully: `npm run build`
3. Ensure your device is properly connected and USB debugging is enabled
4. Try running with verbose logging: `npx cap run android --verbose`
5. Check the Android Studio logs for specific errors

## Development

When making changes to the web code:
1. Make your changes
2. Rebuild: `npm run build`
3. Sync with Capacitor: `npx cap sync`
4. Run again: `npx cap run android`
