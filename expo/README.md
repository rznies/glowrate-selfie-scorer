# GlowRate Selfie Scorer

GlowRate is a sophisticated cross-platform mobile application designed to analyze and score selfies using advanced AI technology. Built with the modern React Native ecosystem, it helps users understand and improve their selfie game through detailed analytics and historical tracking.

## 🚀 Features

- **📸 Smart Camera Integration**: Seamless camera interface optimized for taking high-quality selfies.
- **🤖 AI-Powered Scoring**: Advanced algorithms that analyze various facial features, lighting, and composition to provide a comprehensive "Glow Score".
- **📊 Detailed Analytics**: Get granular feedback on different aspects of your photos.
- **📜 History Tracking**: Keep a record of your past scans to monitor improvements over time.
- **💎 Premium Insights**: Unlock deeper analysis and exclusive features to maximize your potential.
- **🌗 Dark/Light Mode**: Fully thematic UI that adapts to your system preferences.

## 🛠️ Tech Stack

This project leverages the latest technologies in mobile development:

- **Framework**: [Expo](https://expo.dev) & [React Native](https://reactnative.dev)
- **Routing**: [Expo Router](https://docs.expo.dev/router/introduction/) (File-based routing)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Backend/API**: [Hono](https://hono.dev/) & [tRPC](https://trpc.io/)
- **State Management**: React Query & Context API
- **Styling**: Custom UI components with Lucide React Native icons

## 🏃‍♂️ Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (LTS recommended)
- [Bun](https://bun.sh/) (Package manager)
- [Expo Go](https://expo.dev/client) app installed on your iOS or Android device.

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/rznies/glowrate-selfie-scorer.git
   cd glowrate-selfie-scorer
   ```

2. **Install dependencies:**
   ```bash
   bun install
   ```

### Running the App

Start the development server:

```bash
bun start
```

- **Scan the QR code** with your phone using the Expo Go app.
- Press `w` to run in the web browser.
- Press `i` to run in the iOS Simulator (macOS only).
- Press `a` to run in the Android Emulator.

## 📂 Project Structure

```
/
├── app/                  # Application screens & routes
│   ├── (tabs)/           # Main tab navigation (Home, History, Profile)
│   ├── camera.tsx        # Camera capture screen
│   ├── processing.tsx    # AI analysis loading screen
│   ├── results.tsx       # Score display screen
│   └── premium.tsx       # Premium subscription screen
├── backend/              # Hono server & tRPC router
├── components/           # Reusable UI components
├── contexts/             # Global state (GlowContext, ThemeContext)
├── lib/                  # Utilities (AI scoring, image processing)
└── assets/               # Images and icons
```

## 📱 Permissions

The app requires the following permissions to function correctly:
- **Camera**: To capture selfies for analysis.
- **Photo Library**: To select existing photos for scoring.
- **Microphone**: (Optional) For video-based features if applicable.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source.