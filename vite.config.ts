import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      includeAssets: [
        'favicon.svg',
        'pwa-192x192.png',
        'pwa-512x512.png',
        'apple-touch-icon.png',
        'maskable-icon-512x512.png',
        'robots.txt',
        'ads.txt'
      ],
      manifest: {
        name: 'GeoIdentity - 全球真实地址与本土化测试身份生成器',
        short_name: 'GeoIdentity',
        description: '专业级全球真实物理地址检索、美国免税州真实门牌与本土化虚拟测试身份生成系统。100%纯前端离线运行，安全防送中。',
        theme_color: '#0d9488',
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
            name: '立即生成真实地址',
            short_name: '生成地址',
            description: '快速生成真实物理地址与合成身份档案',
            url: '/?action=generate',
            icons: [{ src: '/pwa-192x192.png', sizes: '192x192' }]
          },
          {
            name: '全球地址库雷达监控',
            short_name: '地址库监控',
            description: '查看全球21国真实地址库收录明细与大盘',
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
})
