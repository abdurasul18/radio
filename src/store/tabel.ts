import { acceptHMRUpdate, defineStore } from 'pinia'
import { ref, computed, Ref } from 'vue'
import { useStorage } from '@vueuse/core'

export const useTabel = defineStore('tabel', () => {
  let statusList = ref([
    { text: 'явка', value: 'Я', isHour: true },
    { text: 'военные сборы', value: 'ВС' },
    { text: 'отпуск', value: 'ОТ' },
    { text: 'отпуск без сохранения заработной платы', value: 'ДО' },
    { text: 'больничный', value: 'Б' },
    { text: 'ночь', value: 'Н', isHour: true },
    {
      text: 'сверхурочные',
      value: 'С',
      isHour: true,
    },
    { text: 'простой по вине работодателя', value: 'РВ' },
    { text: 'работа в праздничные дни', value: 'РП' },
    {
      text: 'Учебный отпуск',
      value: 'У',
    },
    { text: 'Отгул', value: 'О' },
    { text: 'Командировка', value: 'К' },
    { text: 'Прогул', value: 'ПР' },
  ])

  return {
    statusList,
  }
})

/**
 * Pinia supports Hot Module replacement so you can edit your stores and
 * interact with them directly in your app without reloading the page.
 *
 * @see https://pinia.esm.dev/cookbook/hot-module-replacement.html
 * @see https://vitejs.dev/guide/api-hmr.html
 */
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useTabel as any, import.meta.hot))
}
