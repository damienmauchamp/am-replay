// import 'dotenv/config'
// import dotenv from 'dotenv';
// dotenv.config();

export default class MusicProvider {
	static instance: any
	static sharedProvider() {
		if (!MusicProvider.instance) {
			MusicProvider.instance = new MusicProvider()
		}
		return MusicProvider.instance
	}

	configure() {
		window.MusicKit.configure({
			developerToken: process.env.DEVELOPER_TOKEN,
			app: {
				name: process.env.APP_NAME,
				build: process.env.APP_BUILD,
			},
			// storefrontId: '143442'// process.env.APP_STOREFRONT
			// storefrontId: 'fr'// process.env.APP_STOREFRONT
		})
	}

	getMusicInstance(): MusicKit.MusicKitInstance {
		return window.MusicKit.getInstance()
	}
}
