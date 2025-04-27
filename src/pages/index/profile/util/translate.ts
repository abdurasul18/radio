import { Ref } from 'vue'
export const monthNames = [
  'Yanvar',
  'Fevral',
  'Mart',
  'Aprel',
  'May',
  'Iyun',
  'Iyul',
  'Avgust',
  'Sentabr',
  'Oktabr',
  'Noyabr',
  'Dekabr',
]

export const dayNameLt = [
  'Yakshanba',
  'Dushanba',
  'Seshanba',
  'Chorshanba',
  'Payshanba',
  'Juma',
  'Shanba',
]
export const dayNameCr = [
  'Якшанба',
  'Душанба',
  'Сешанба',
  'Чоршанба',
  'Пайшанба',
  'Жума',
  'Шанба',
]
export const dayNameRu = [
  'Воскресенье',
  'Понедельник',
  'Вторник',
  'Среда',
  'Четверг',
  'Пятница',
  'Суббота',
]
export const dayNameEn = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday'

]
let locale = useStorage('locale', 'lt') as Ref<'uz' | 'lt' | 'ru'>
export const localeUz = {
  code: 'uzb',
  buttonText: {
    today: locale.value == 'lt' ? 'Bugun' : 'Бугун',
    month: locale.value == 'lt' ? 'Oy' : 'Ой',
    week: locale.value == 'lt' ? 'Hafta' : 'Хафта',
    day: locale.value == 'lt' ? 'Kun' : 'Кун',
    list: locale.value == 'lt' ? 'kun tartibi' : 'Кун тартиби',
  },
  monthNames: monthNames,
  dayNames: dayNameCr,
  allDayText: locale.value == 'lt' ? 'Kun bo`yi' : 'Кун бўйи',
  moreLinkText(n: any) {
    return locale.value == 'lt' ? '+yana' + n : '+ яна ' + n
  },
  noEventsText:
    locale.value == 'lt'
      ? 'Ko`rsatish uchun voqealar yo`q'
      : 'Кўрсатиш учун воқеалар йўқ',
}
