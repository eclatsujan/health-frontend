import { initOpenNextCloudflareForDev } from '@opennextjs/cloudflare';
import type { NextConfig } from 'next';

const apiProxy = process.env.API_PROXY_ORIGIN?.replace(/\/$/, '');

const nextConfig: NextConfig = {
  /** When set (e.g. `http://127.0.0.1:8000`), `/api/v1/*` is proxied to Laravel so dev SSR + client fetch are not 404. */
  async rewrites() {
    if (!apiProxy) return [];
    return [
      {
        source: '/api/v1/:path*',
        destination: `${apiProxy}/api/v1/:path*`,
      },
    ];
  },
};

export default nextConfig;

void initOpenNextCloudflareForDev();
