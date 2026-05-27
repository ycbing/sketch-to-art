/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  allowedDevOrigins: ["111.229.169.22", "http://111.229.169.22:3004", "http://localhost:3004"],
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
