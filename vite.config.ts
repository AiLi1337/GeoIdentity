import { defineConfig, loadEnv, type Plugin } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import { VitePWA } from 'vite-plugin-pwa'

/**
 * Clean Open-Source AdSense Injection Plugin:
 * - When VITE_ADSENSE_ID is NOT set: 100% clean, zero ads, zero script, no ads.txt in build.
 * - When VITE_ADSENSE_ID is set (e.g. in Cloudflare Pages build environment variables):
 *   Automatically injects the AdSense script tag into <head> and emits ads.txt to the build root.
 */
function adsensePlugin(adsenseId?: string): Plugin {
  return {
    name: 'vite-plugin-adsense',
    transformIndexHtml(html) {
      if (!adsenseId) return html;
      const cleanId = adsenseId.trim();
      return {
        html,
        tags: [
          {
            tag: 'script',
            attrs: {
              async: true,
              src: `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${cleanId}`,
              crossorigin: 'anonymous'
            },
            injectTo: 'head'
          }
        ]
      };
    },
    generateBundle() {
      if (!adsenseId) return;
      const pubNumber = adsenseId.trim().replace(/^(ca-)?pub-/, '');
      const adsTxtContent = `google.com, pub-${pubNumber}, DIRECT, f08c47fec0942fa0\n`;
      this.emitFile({
        type: 'asset',
        fileName: 'ads.txt',
        source: adsTxtContent
      });
    }
  };
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const adsenseId = env.VITE_ADSENSE_ID || process.env.VITE_ADSENSE_ID;

  return {
    plugins: [
      vue(),
      adsensePlugin(adsenseId),
      VitePWA({
        registerType: 'autoUpdate',
        injectRegister: 'auto',
        includeAssets: [
          'favicon.svg',
          'pwa-192x192.png',
          'pwa-512x512.png',
          'apple-touch-icon.png',
          'maskable-icon-512x512.png',
          'robots.txt'
        ],
      manifest: {
        name: 'GeoIdentity - 多地区地址样本与合成测试身份',
        short_name: 'GeoIdentity',
        description: '21 国地址样本、街道门牌插值与可回溯 OSM 建筑门牌，仅供软件测试。投递与 AVS 未核验。',
        theme_color: '#f8fafc',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait-primary',
        scope: '/',
        start_url: '/',
        lang: 'zh-CN',
        icons: [
          {
            src: '/pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: '/maskable-icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          }
        ],
        shortcuts: [
          {
            name: '生成测试地址',
            short_name: '生成地址',
            description: '生成地址样本与合成测试身份',
            url: '/?action=generate',
            icons: [{ src: '/pwa-192x192.png', sizes: '192x192' }]
          },
          {
            name: '全球地址样本概览',
            short_name: '地址库监控',
            description: '查看 21 国内置地址样本与 OSM 来源',
            url: '/?view=monitor',
            icons: [{ src: '/pwa-192x192.png', sizes: '192x192' }]
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,json,woff,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          }
        ]
      }
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
  }
})
