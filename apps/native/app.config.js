export default {
  expo: {
    name: "Crafter Ecommerce",
    scheme: "crafter",
    slug: "crafter-ecom",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/appIcons/app_launcher.png",
    userInterfaceStyle: "light",
    splash: {
      image: "./assets/appIcons/splash1.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },
    assetBundlePatterns: ["**/*"],
    ios: {
      infoPlist: {
        NSAppTransportSecurity: {
          allowsArbitraryLoads: true,
        },
      },
      supportsTablet: true,
      userInterfaceStyle: "light",
      config: {
        googleMapsApiKey: "AIzaSyAVBtu9gFRzmHnlMnZl_sqZGY3mXRPV3so",
        usesNonExemptEncryption: false,
        usesCleartextTraffic: true,
      },
      googleServicesFile: process.env.GOOGLE_SERVICES_JSON_IOS,
      bundleIdentifier: "com.crafter.shop",
    },
    android: {
      versionCode: 1,
      versionName: "1.0.0",
      googleServicesFile: process.env.GOOGLE_SERVICES_JSON,
      // googleServicesFile: "./google-services-file/google-services.json",
      adaptiveIcon: {
        foregroundImage: "./assets/appIcons/app_launcher.png",
        backgroundColor: "#ffffff",
      },
      userInterfaceStyle: "light",
      permissions: [
        "INTERNET",
        "ACCESS_NETWORK_STATE",
        "android.permission.ACCESS_COARSE_LOCATION",
        "android.permission.ACCESS_FINE_LOCATION",
      ],
      package: "com.crafter.shop",
      config: {
        googleMaps: {
          apiKey: "AIzaSyAVBtu9gFRzmHnlMnZl_sqZGY3mXRPV3so",
        },
        networkSecurityConfig: "./network_security_config.xml",
      },
    },
    extra: {
      eas: {
        projectId: "bfa69ad1-d936-4837-a430-8e28f68682ef",
      },
      router: {
        origin: false,
      },
    },
    web: {
      favicon: "./assets/appIcons/favicon.png",
      bundler: "metro",
    },
    plugins: [
      "expo-router",
      "expo-secure-store",
      "./plugins/withDisableForcedDarkModeAndroid.js",
      [
        "expo-location",
        {
          locationAlwaysAndWhenInUsePermission:
            "Allow $(PRODUCT_NAME) to use your location.",
        },
      ],
      "@react-native-firebase/app",
      "@react-native-firebase/crashlytics",
      "@react-native-firebase/messaging",
      [
        "expo-build-properties",
        {
          android: {
            enableProguardInReleaseBuilds: true,
            proguardRules: "./proguard-rules.pro",
            enableHermes: true,
            splits: {
              abi: true,
            },
          },
          ios: {
            useFrameworks: "static",
          },
        },
      ],
    ],
    owner: "nishalbarman",
  },
};
