/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // ビルド時にESLintを無効化
    ignoreDuringBuilds: true,
  },
  typescript: {
    // TypeScriptエラーを無視（オプション）
    ignoreBuildErrors: false,
  },
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  }
}

module.exports = nextConfig
