/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  serverExternalPackages: ["bcryptjs"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.cos.ap-shanghai.myqcloud.com",
      },
      {
        protocol: "https",
        hostname: "**.myqcloud.com",
      },
    ],
  },
};

export default nextConfig;
