// vite.config.ts
import { defineConfig } from "file:///D:/DataPrizma/SAAS/virtual-docflow/node_modules/vite/dist/node/index.js";
import vue from "file:///D:/DataPrizma/SAAS/virtual-docflow/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import VueRouter from "file:///D:/DataPrizma/SAAS/virtual-docflow/node_modules/unplugin-vue-router/dist/vite.js";
import AutoImport from "file:///D:/DataPrizma/SAAS/virtual-docflow/node_modules/unplugin-auto-import/dist/vite.js";
import Components from "file:///D:/DataPrizma/SAAS/virtual-docflow/node_modules/unplugin-vue-components/dist/vite.js";
import { VueUseComponentsResolver } from "file:///D:/DataPrizma/SAAS/virtual-docflow/node_modules/unplugin-vue-components/dist/resolvers.js";
import { VueRouterAutoImports } from "file:///D:/DataPrizma/SAAS/virtual-docflow/node_modules/unplugin-vue-router/dist/index.js";
import svgLoader from "file:///D:/DataPrizma/SAAS/virtual-docflow/node_modules/vite-svg-loader/index.js";
var vite_config_default = defineConfig({
  plugins: [
    vue(),
    svgLoader(),
    VueRouter({
      routesFolder: "src/pages"
    }),
    AutoImport({
      dts: true,
      imports: ["vue", "@vueuse/core", VueRouterAutoImports, "vue-i18n"]
    }),
    Components({
      resolvers: [
        VueUseComponentsResolver()
      ]
    })
  ],
  resolve: {
    alias: [
      {
        find: "/@src/",
        replacement: `/src/`
      }
    ]
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxEYXRhUHJpem1hXFxcXFNBQVNcXFxcdmlydHVhbC1kb2NmbG93XCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJEOlxcXFxEYXRhUHJpem1hXFxcXFNBQVNcXFxcdmlydHVhbC1kb2NmbG93XFxcXHZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9EOi9EYXRhUHJpem1hL1NBQVMvdmlydHVhbC1kb2NmbG93L3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSdcbmltcG9ydCB2dWUgZnJvbSAnQHZpdGVqcy9wbHVnaW4tdnVlJ1xuaW1wb3J0IFZ1ZVJvdXRlciBmcm9tICd1bnBsdWdpbi12dWUtcm91dGVyL3ZpdGUnXG5pbXBvcnQgQXV0b0ltcG9ydCBmcm9tICd1bnBsdWdpbi1hdXRvLWltcG9ydC92aXRlJ1xuaW1wb3J0IENvbXBvbmVudHMgZnJvbSAndW5wbHVnaW4tdnVlLWNvbXBvbmVudHMvdml0ZSdcbmltcG9ydCB7IFZ1ZVVzZUNvbXBvbmVudHNSZXNvbHZlciB9IGZyb20gJ3VucGx1Z2luLXZ1ZS1jb21wb25lbnRzL3Jlc29sdmVycydcbmltcG9ydCB7IFZ1ZVJvdXRlckF1dG9JbXBvcnRzIH0gZnJvbSAndW5wbHVnaW4tdnVlLXJvdXRlcidcbmltcG9ydCBzdmdMb2FkZXIgZnJvbSAndml0ZS1zdmctbG9hZGVyJ1xuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG4gIHBsdWdpbnM6IFtcbiAgICB2dWUoKSxcbiAgICBzdmdMb2FkZXIoKSxcbiAgICBWdWVSb3V0ZXIoe1xuICAgICAgcm91dGVzRm9sZGVyOiAnc3JjL3BhZ2VzJyxcbiAgICB9KSxcbiAgICBBdXRvSW1wb3J0KHtcbiAgICAgIGR0czogdHJ1ZSxcbiAgICAgIGltcG9ydHM6IFsndnVlJywgJ0B2dWV1c2UvY29yZScsIFZ1ZVJvdXRlckF1dG9JbXBvcnRzLCAndnVlLWkxOG4nXSxcbiAgICB9KSxcbiAgICBDb21wb25lbnRzKHtcbiAgICAgIHJlc29sdmVyczogW1xuICAgICAgICBWdWVVc2VDb21wb25lbnRzUmVzb2x2ZXIoKSxcbiAgICAgIF0sXG4gICAgfSksXG4gIF0sXG4gIHJlc29sdmU6IHtcbiAgICBhbGlhczogW1xuICAgICAge1xuICAgICAgICBmaW5kOiAnL0BzcmMvJyxcbiAgICAgICAgcmVwbGFjZW1lbnQ6IGAvc3JjL2AsXG4gICAgICB9LFxuICAgIF0sXG4gIH0sXG59KVxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUFnUyxTQUFTLG9CQUFvQjtBQUM3VCxPQUFPLFNBQVM7QUFDaEIsT0FBTyxlQUFlO0FBQ3RCLE9BQU8sZ0JBQWdCO0FBQ3ZCLE9BQU8sZ0JBQWdCO0FBQ3ZCLFNBQVMsZ0NBQWdDO0FBQ3pDLFNBQVMsNEJBQTRCO0FBQ3JDLE9BQU8sZUFBZTtBQUV0QixJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixTQUFTO0FBQUEsSUFDUCxJQUFJO0FBQUEsSUFDSixVQUFVO0FBQUEsSUFDVixVQUFVO0FBQUEsTUFDUixjQUFjO0FBQUEsSUFDaEIsQ0FBQztBQUFBLElBQ0QsV0FBVztBQUFBLE1BQ1QsS0FBSztBQUFBLE1BQ0wsU0FBUyxDQUFDLE9BQU8sZ0JBQWdCLHNCQUFzQixVQUFVO0FBQUEsSUFDbkUsQ0FBQztBQUFBLElBQ0QsV0FBVztBQUFBLE1BQ1QsV0FBVztBQUFBLFFBQ1QseUJBQXlCO0FBQUEsTUFDM0I7QUFBQSxJQUNGLENBQUM7QUFBQSxFQUNIO0FBQUEsRUFDQSxTQUFTO0FBQUEsSUFDUCxPQUFPO0FBQUEsTUFDTDtBQUFBLFFBQ0UsTUFBTTtBQUFBLFFBQ04sYUFBYTtBQUFBLE1BQ2Y7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
