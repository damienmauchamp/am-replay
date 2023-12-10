/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	// output: 'export',
	eslint: {
		ignoreDuringBuilds: true,
	},
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: '**',
				// hostname: '**.mzstatic.com',
				// hostname: 'is1-ssl.mzstatic.com',
				// hostname: 'is2-ssl.mzstatic.com',
				// hostname: 'is3-ssl.mzstatic.com',
			},
		],
	},
	env: {
		APP_NAME: process.env.APP_NAME,
		APP_BUILD: process.env.APP_BUILD,
		DEVELOPER_TOKEN: process.env.DEVELOPER_TOKEN,
	},
}

module.exports = nextConfig
