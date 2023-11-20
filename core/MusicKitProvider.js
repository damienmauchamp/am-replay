// import 'dotenv/config'
// import dotenv from 'dotenv'; 
// dotenv.config();

export default class MusicProvider {

    static sharedProvider() {
        if(!MusicProvider.instance) {
            MusicProvider.instance = new MusicProvider();
        }
        return MusicProvider.instance;
    }

    configure() {
		console.log({
			APP_NAME: process.env.APP_NAME,
			APP_BUILD: process.env.APP_BUILD,
			DEVELOPER_TOKEN: process.env.DEVELOPER_TOKEN,
		})
        window.MusicKit.configure({
            developerToken: process.env.DEVELOPER_TOKEN,
            app: {
                name: process.env.APP_NAME,
                build: process.env.APP_BUILD
            },
            // storefrontId: '143442'// process.env.APP_STOREFRONT
            // storefrontId: 'fr'// process.env.APP_STOREFRONT
        });
    }

    getMusicInstance() {
		console.log('Getting MusicKit instance')
        return window.MusicKit.getInstance();
    }
}