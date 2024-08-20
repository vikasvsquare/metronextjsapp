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
                destination: 'http://http://3.111.33.229:8080//api/:path*', // Replace with your actual API URL
            },
        ];
    },
};

export default nextConfig;
