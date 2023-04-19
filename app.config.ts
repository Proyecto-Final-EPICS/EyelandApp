import { ExpoConfig } from "expo/config";

// In SDK 46 and lower, use the following import instead:
// import { ExpoConfig } from '@expo/config-types';

const config: ExpoConfig = {
	name: "Eyeland",
	slug: "Eyeland",
	icon: "./assets/icon.png",
	splash: {
		image: "./assets/splash.png",
		resizeMode: "contain",
		backgroundColor: "#74EFAE"
	},
	android: {
		package: "com.eyeland",
		adaptiveIcon: {
			backgroundColor: "#43FB9B",
			foregroundImage: "./assets/adaptive-icon.png"
		}
	},
	extra: {
		eas: {
			projectId: "02601ea0-08c9-4e35-ad4e-9e6778900455"
		}
	}
};

export default config;
