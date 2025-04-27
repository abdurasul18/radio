import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import VueRouter from 'unplugin-vue-router/vite'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { VueUseComponentsResolver } from 'unplugin-vue-components/resolvers'
import { VueRouterAutoImports } from 'unplugin-vue-router'
import svgLoader from 'vite-svg-loader'
// https://vitejs.dev/config/
export default defineConfig({
  base: '/',
  publicDir: 'public',
  plugins: [
    vue(),
    svgLoader(),
    VueRouter({
      routesFolder: 'src/pages',
       importMode: 'async'
    }),
    AutoImport({
      dts: true,
      imports: ['vue', '@vueuse/core', VueRouterAutoImports, 'vue-i18n'],
    }),
    Components({
      resolvers: [
        VueUseComponentsResolver(),
      ],
    }),
  ],
  resolve: {
    alias: [
      {
        find: '/@src/',
        replacement: `/src/`,
      },
    ],
  },
})
