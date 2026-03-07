import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* 画像を外部URL（Cloudinaryや外部ストレージ）から
     読み込む際に必要になる設定です 
  */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  
  /* 今回のように Windows 環境でパスの問題が起きやすい場合、
     厳密な React Strict Mode を一旦 true（標準）にして
     エラーを検出しやすくしておきます 
  */
  reactStrictMode: true,
};

export default nextConfig;    