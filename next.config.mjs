/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static export: `npm run build` writes a plain HTML/CSS/JS site to /out.
  // It can be hosted anywhere (Vercel, Netlify, GitHub Pages) with no server.
  output: 'export',
  images: { unoptimized: true },
  trailingSlash: true,
  reactStrictMode: true,
};

export default nextConfig;
