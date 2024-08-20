/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    experimental: {
        missingSuspenseWithCSRBailout: false,
    },
    async rewrites() {
        return [
            {
                source: '/api/:path*',
                destination: 'https://metrointernational.net' || 'http://3.111.33.229:8080/api/:path*',
            
            },
        ];
    },
};

export default nextConfig;
