import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Lock the Turbopack workspace root to this project. Without this, Next may
  // pick a parent directory that has its own package-lock.json (e.g. $HOME),
  // then resolve a broken `src` symlink there and crash with a symlink loop.
  turbopack: {
    root: __dirname,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
