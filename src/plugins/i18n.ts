import { createI18n } from 'vue-i18n'
import en from '/@src/locales/en.ts'
import ru from '/@src/locales/ru.ts'
import uz from '/@src/locales/uz.ts'
import lt from '/@src/locales/lt.ts'
const defaultLocale = useStorage('locale', 'lt')
export const i18n = createI18n({
  locale: defaultLocale.value,
  messages: {
    en,
    ru,
    uz,
    lt
  },
  fallbackLocale: 'uz',
  legacy: false,
})

