/** @type {import('next').NextConfig} */
const nextConfig = {
  // TypeScriptのエラーがあってもビルドを続行する
  typescript: {
    ignoreBuildErrors: true,
  },
  // ESLintのエラーがあってもビルドを続行する
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;