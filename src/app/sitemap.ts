import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://anihub-clone.vercel.app";
  const now = new Date();
  return [
    { url: `${base}/`, lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: `${base}/anime`, lastModified: now, changeFrequency: "daily" },
    { url: `${base}/genres`, lastModified: now, changeFrequency: "weekly" },
    { url: `${base}/ongoing`, lastModified: now, changeFrequency: "daily" },
    { url: `${base}/top-rated`, lastModified: now, changeFrequency: "weekly" },
  ];
}
