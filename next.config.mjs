/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    experimental: {
        missingSuspenseWithCSRBailout: false,
    },
    async rewrites() {
        return [
            {
                source: '/backend/:path*',
                destination: 'https://metrointernational.net' || 'http://3.111.33.229:8080/backend/:path*',
            
            },
        ];
    },
};

export default nextConfig;
