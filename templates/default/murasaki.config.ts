import { defineConfig } from 'murasaki'

export default defineConfig({
  // Display name for the bundled app. Defaults to package.json name.
  // name: 'My App',

  // Reverse-DNS bundle identifier — used by .app, .msi, etc.
  // bundleId: 'com.example.myapp',

  // Path to an icon, relative to this file.
  //   .icns for macOS, .ico for Windows, .png for Linux
  // icon: 'assets/icon.icns',

  // macOS App Store category. Common values:
  //   public.app-category.productivity
  //   public.app-category.developer-tools
  //   public.app-category.utilities (default)
  // category: 'public.app-category.productivity',

  // Default cross-compile targets when no --target flag is passed.
  // targets: ['darwin-arm64', 'win-x64', 'linux-x64'],
})
