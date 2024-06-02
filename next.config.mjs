/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    BASE_URL: 'https://export-genius-backend.onrender.com/api',
    SOCKET_URL: 'https://export-genius-backend.onrender.com',
  },
};

export default nextConfig;
