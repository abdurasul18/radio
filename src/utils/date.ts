import moment from 'moment'
const months = [
  'yanvar',
  'fevral',
  'mart',
  'aprel',
  'may',
  'iyun',
  'iyul',
  'avgust',
  'sentabr',
  'oktabr',
  'noyabr',
  'dekabr',
]
const monthsUz = [
  'январ',
  'феврал',
  'март',
  'апрел',
  'май',
  'июн',
  'июл',
  'август',
  'сентабр',
  'октабр',
  'ноябр',
  'декабр',
]
export const monthsRu = [
  'январь',
  'февраль',
  'март',
  'апрель',
  'май',
  'июнь',
  'июль',
  'август',
  'сентябрь',
  'октябрь',
  'ноябрь',
  'декабрь',
]
export const monthsEng = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]
const shortMonth = [
  'yan.',
  'fev.',
  'mart',
  'apr.',
  'may',
  'iyun',
  'iyul',
  'avg.',
  'sent.',
  'okt.',
  'noy.',
  'dek.',
]
// DATE PROTOTYPES
export function ddmmyyyy(date: Date) {
  if(!date) return ''
  var yyyy = date.getFullYear().toString()
  var mm = (date.getMonth() + 1).toString() // getMonth() is zero-based
  var dd = date.getDate().toString()
  return (dd[1] ? dd : '0' + dd[0]) + '.' + (mm[1] ? mm : '0' + mm[0]) + '.' + yyyy // padding
}
export function daym_shortyyyy(date: Date) {
  var yyyy = date.getFullYear().toString()
  var mm = date.toLocaleString('uz-Cyrl', { month: 'short' }) // getMonth() is zero-based
  var dd = date.getDate().toString()
  return (dd[1] ? dd : '0' + dd[0]) + ' ' + mm + ' ' + yyyy // padding
}

//DD-MM-YYYY, HH:mm:ss FORMAT
export function ddmmyyyyhhmmss(date: Date) {
  var yyyy = date.getFullYear().toString()
  var mm = (date.getMonth() + 1).toString() // getMonth() is zero-based
  var dd = date.getDate().toString()
  var hh = date.getHours().toString()
  var min = date.getMinutes().toString()
  var ss = date.getSeconds().toString()
  return (
    (dd[1] ? dd : '0' + dd[0]) +
    '.' +
    (mm[1] ? mm : '0' + mm[0]) +
    '.' +
    yyyy +
    ' ' +
    (hh[1] ? hh : '0' + hh) +
    ':' +
    (min[1] ? min : '0' + min) +
    ':' +
    (ss[1] ? ss : '0' + ss)
  ) // padding
}

//DAY SHORT MONTH NAME YEAR, HH:mm FORMAT
export function daym_shortyyyy_hm(date: Date) {
  var yyyy = date.getFullYear().toString()
  var mm = date.toLocaleString('uz-Cyrl', { month: 'short' })
  var dd = date.getDate().toString()
  var hh = date.getHours().toString()
  var min = date.getMinutes().toString()
  return (
    (dd[1] ? dd : '0' + dd[0]) +
    '-' +
    mm +
    '-' +
    yyyy +
    ' ' +
    (hh[1] ? hh : '0' + hh) +
    ':' +
    (min[1] ? min : '0' + min)
  ) // padding
}
export function hhmm(date: Date) {
  var hh = date.getHours().toString()
  var min = date.getMinutes().toString()
  return (hh[1] ? hh : '0' + hh) + ':' + (min[1] ? min : '0' + min) // padding
}
export function hhmmss(date: Date) {
  var hh = date.getHours().toString()
  var min = date.getMinutes().toString()
  var ss = date.getSeconds().toString()
  return (
    (hh[1] ? hh : '0' + hh) +
    ':' +
    (min[1] ? min : '0' + min) +
    ':' +
    (ss[1] ? ss : '0' + ss)
  ) // padding
}
export function mm(date: Date) {
  var mm = (date.getMonth() + 1).toString()
  return mm[1] ? mm : '0' + mm[0] // padding
}
export function dd(date: Date) {
  var dd = date.getDate().toString()
  return dd[1] ? dd : '0' + dd[0] // padding
}

export function yyyy(date: Date) {
  var yyyy = date.getFullYear().toString()
  return yyyy
}

export function monthNameUz() {
  let date = new Date()
  return months[date.getMonth()]
}
export function dateUzString(ddmmyyyy: string) {
  if (!ddmmyyyy) return ''
  let dateArr = ddmmyyyy.split('-')
  let monthNameUz = months[+dateArr[1] - 1]
  let day = +dateArr[0]
  return `${dateArr[2]}-yil ${day}-${monthNameUz}`
}

export function dateUzSt(dateVal: Date, withoutYear = false) {
  if (!dateVal) return ''
  let date = new Date(dateVal)
  let month = date.getMonth()
  let days = date.getDate()
  let year = date.getFullYear()
  if (withoutYear) {
    return `${days}-${months[month]}`
  }
  return `${year}-yil ${days}-${months[month]}`
}
export function dateCrSt(dateVal: Date, withoutYear = false) {
  if (!dateVal) return ''
  let date = new Date(dateVal)
  let month = date.getMonth()
  let days = date.getDate()
  let year = date.getFullYear()
  if (withoutYear) {
    return `${days}-${monthsUz[month]}`
  }
  return `${year}-йил ${days}-${monthsUz[month]}`
}

export function dmyToDate(dateSt: string) {
  return moment(dateSt, 'DD-MM-YYYY HH:mm').format('MM.DD.YYYY HH:mm')
}
export function stringToDate(dateSt: string) {
  return new Date(moment(dateSt, 'DD.MM.YYYY HH:mm').format('MM.DD.YYYY HH:mm'))
}
export function dmyToYMD(dateSt: string) {
  return moment(dateSt, 'DD.MM.YYYY HH:mm').format('YYYY.MM.DD HH:mm')
}

export function shortDateUz(dateSt: string) {
  if (!dateSt) {
    return ''
  }
  let date = new Date(moment(dateSt, 'DD-MM-YYYY HH:mm').format('YYYY-MM-DD HH:mm'))
  if (!date || typeof date != 'object') {
    return ''
  }
  let days = date.getDate()
  let month = date.getMonth()
  let year = date.getFullYear()
  let hours = date.getHours()
  let minutes = date.getMinutes()
  let currentDate = new Date()
  return `${days}-${shortMonth[month]} ${hours}:${minutes < 10 ? `0` + minutes : minutes}`
}
export function addDay(date: Date, day: number) {
  date.setDate(date.getDate() + day)
  return date
}
export function dateStLocale(dateVal: Date, locale: 'uz' | 'lt' | 'ru' | 'eng') {
  if (!dateVal) return ''
  let date = new Date(dateVal)
  let month = date.getMonth()
  let days = date.getDate()
  let year = date.getFullYear()
  const monthsNames = locale === 'uz' ? monthsUz : locale === 'lt' ? months : locale === 'eng' ? monthsEng : monthsRu
  if(locale=='eng'){
    return `${monthsNames[month]} ${days}, ${year}`
  }
  return `${days} ${monthsNames[month]}, ${year}`
}
export function dateStLocale2(ddmmyyyy: string, locale: 'uz' | 'lt' | 'ru' | 'eng' |any) {
  if (!ddmmyyyy) return ''
  let date = new Date(moment(ddmmyyyy, 'DD-MM-YYYY').format('YYYY-MM-DD'))
  let month = date.getMonth()
  let days = date.getDate()
  let year = date.getFullYear()
  const monthsNames = locale === 'uz' ? monthsUz : locale === 'lt' ? months : locale === 'eng' ? monthsEng : monthsRu
  if(locale=='eng'){
    return `${monthsNames[month]} ${days}, ${year}`
  }
  return `${days} ${monthsNames[month]}, ${year}`

}

export function calculateDaysBetweenDates(date1: string, date2: string): number {
  if (!date1 || !date2) {
    return 0;
  }
  // Parse dates from dd.mm.yyyy format
  const parseDate = (date: string): Date => {
    const [day, month, year] = date.split('.').map(Number);
    return new Date(year, month - 1, day); // month is 0-indexed
  };

  const startDate = parseDate(date1);
  const endDate = parseDate(date2);

  // Calculate the difference in milliseconds
  const diffInMs = endDate.getTime() - startDate.getTime();

  // Convert milliseconds to days
  return Math.ceil(diffInMs / (1000 * 60 * 60 * 24)) + 1;
}

export function formatDate(date:Date) {
  return new Intl.DateTimeFormat('en-CA', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
  }).format(date).replace(',', '');
}
export function dateToYMD(date: Date) {
  return moment(date).format('YYYY-MM-DD')
}