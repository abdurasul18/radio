import { createApp } from 'vue'
import naive from 'naive-ui'
import './scss/index.scss'
import router from './router'
import { i18n } from './plugins/i18n'
import App from './App.vue'
import globalMethods from './globals/index'
import registerDirectives from './plugins/directives'
import { createPinia } from 'pinia'
import { useAuthStore } from './store/auth'
import ApiService from './services/api'
import "vue-toast-notification/dist/theme-sugar.css";
import Maska from 'maska'

const pinia = createPinia()

const app = createApp(App)
globalMethods(app)
registerDirectives(app)
app
    .use(router)
    .use(naive)
    .use(i18n)
    .use(pinia)
    .use(Maska)
    .mount('#app')
const { isAuthenticated } = useAuthStore()
ApiService.init(import.meta.env.VITE_API_API_SERVICE, router)
ApiService.mount401Interceptor()
if (isAuthenticated) {
    ApiService.setHeader()
}