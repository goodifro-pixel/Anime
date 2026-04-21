/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "cdn.myanimelist.net" },
      { protocol: "https", hostname: "myanimelist.net" },
      { protocol: "https", hostname: "api.jikan.moe" },
      { protocol: "https", hostname: "cdn.anihub.in.ua" },
      { protocol: "https", hostname: "i.ytimg.com" },
      { protocol: "https", hostname: "img.youtube.com" },
      { protocol: "https", hostname: "www.animenewsnetwork.com" },
    ],
  },
  async rewrites() {
    return [];
  },
};

export default nextConfig;
