function isUpper(word: string) {
  return (
    word &&
    word.split('').every((el) => el == el.toUpperCase()) &&
    word.toLowerCase() !== word.toUpperCase()
  )
}
function toLatin(text: string): string {
  if (typeof text !== 'string') {
    return ''
  }
  let words = text.split(' ')
  return words
    .map((el) => {
      return toLatinWord(el)
    })
    .join(' ')
}
function toLatinWord(word: string): string {
  if (typeof word !== 'string') {
    return ''
  }

  if (isUpper(word)) {
    return toLatinWord(word.toLowerCase()).toUpperCase()
  }
  let chars = {
    ['А']: 'A',
    ['а']: 'a',
    ['Б']: 'B',
    ['б']: 'b',
    ['В']: 'V',
    ['в']: 'v',
    ['Г']: 'G',
    ['г']: 'g',
    ['Д']: 'D',
    ['д']: 'd',
    ['Е']: 'Ye',
    ['е']: 'e',
    ['Ё']: 'Yо',
    ['ё']: 'yo',
    ['Ж']: 'J',
    ['ж']: 'j',
    ['З']: 'Z',
    ['з']: 'z',
    ['И']: 'I',
    ['и']: 'i',
    ['Ы']: 'I',
    ['ы']: 'i',
    ['Й']: 'Y',
    ['й']: 'y',
    ['К']: 'K',
    ['к']: 'k',
    ['Л']: 'L',
    ['л']: 'l',
    ['М']: 'M',
    ['м']: 'm',
    ['Н']: 'N',
    ['н']: 'n',
    ['О']: 'O',
    ['о']: 'o',
    ['П']: 'P',
    ['п']: 'p',
    ['Р']: 'R',
    ['р']: 'r',
    ['С']: 'S',
    ['с']: 's',
    ['Т']: 'T',
    ['т']: 't',
    ['У']: 'U',
    ['у']: 'u',
    ['Ф']: 'F',
    ['ф']: 'f',
    ['Х']: 'X',
    ['х']: 'x',
    ['Ц']: 'TS',
    ['ц']: 'ts',
    ['Ч']: 'Ch',
    ['ч']: 'ch',
    ['Ш']: 'Sh',
    ['ш']: 'sh',
    ['Ъ']: 'ʼ',
    ['ъ']: 'ʼ',
    ['Ь']: '',
    ['ь']: '',
    ['Э']: 'E',
    ['э']: 'e',
    ['Ю']: 'Yu',
    ['ю']: 'yu',
    ['Я']: 'Ya',
    ['я']: 'ya',
    ['Ў']: 'Oʻ',
    ['ў']: 'oʻ',
    ['Қ']: 'Q',
    ['қ']: 'q',
    ['Ғ']: 'Gʼ',
    ['ғ']: 'gʼ',
    ['Ҳ']: 'H',
    ['ҳ']: 'h',
  }
  let answer = ''
  let textChars = word.split('') as (keyof typeof chars)[]
  textChars.forEach((el, index) => {
    if(el=='е' && index==0){
      answer += 'ye'
    }
    else if(el=='Е' && index==0){
      answer += 'Ye'
    }
   else if  (chars[el]) {
      answer += chars[el]
    } else {
      answer += el
    }
  })
  return answer
}
function toCyrill(text: string): string {
  if (typeof text !== 'string') {
    return ''
  }
  let words = text.split(' ')
  return words
    .map((el) => {
      return toCyrillWord(el)
    })
    .join(' ')
}
function toCyrillWord(word: string): string {
  if (typeof word !== 'string') {
    return ''
  }
  if (isUpper(word)) {
    return toCyrillWord(word.toLowerCase()).toUpperCase()
  }
  let chars = {
    A: 'А',
    a: 'а',
    B: 'Б',
    b: 'б',
    D: 'Д',
    d: 'д',
    E: 'Е',
    e: 'е',
    F: 'Ф',
    f: 'ф',
    G: 'Г',
    g: 'г',
    H: 'Ҳ',
    h: 'ҳ',
    I: 'И',
    i: 'и',
    J: 'Ж',
    j: 'ж',
    K: 'К',
    k: 'к',
    L: 'Л',
    l: 'л',
    M: 'М',
    m: 'м',
    N: 'Н',
    n: 'н',
    O: 'О',
    o: 'о',
    P: 'П',
    p: 'п',
    Q: 'Қ',
    q: 'қ',
    R: 'Р',
    r: 'р',
    S: 'С',
    s: 'с',
    T: 'Т',
    t: 'т',
    U: 'У',
    u: 'у',
    V: 'В',
    v: 'в',
    X: 'Х',
    x: 'х',
    Y: 'Й',
    y: 'й',
    Z: 'З',
    z: 'з',
    ch: 'ч',
    Ch: 'Ч',
    CH: 'Ч',
    '’': 'ъ',
    gʼ: 'ғ',
    "g'": 'ғ',
    'g`': 'ғ',
    'g‘': 'ғ',
    gʻ: 'ғ',
    'G`': 'Ғ',
    'G‘': 'Ғ',
    Gʻ: 'Ғ',
    "G'": 'Ғ',
    'O‘': 'Ў',
    "O'": 'Ў',
    Оʻ: 'Ў',
    Oʻ: 'Ў',
    oʻ: 'ў',
    'o‘': 'ў',
    "o'": 'ў',
    'о`': 'ў',
    'O`': 'Ў',
    SH: 'Ш',
    Sh: 'Ш',
    sh: 'ш',
    YE: 'Е',
    Ye: 'Е',
    ye: 'е',
    YO: 'Ё',
    yo: 'ё',
    TS: 'Ц',
    ts: 'ц',
    Ya: 'Я',
    YA: 'Я',
    ya: 'я',
    Yu: 'Ю',
    yu: 'ю',
  }
  type ObjectKeys<T> = T extends object ? keyof T : never
  let exceptions: ObjectKeys<typeof chars>[] = [
    'ch',
    'Ch',
    'CH',
    "g'",
    'g`',
    'gʼ',
    'g‘',
    'gʻ',
    'G`',
    'G‘',
    'Gʻ',
    "G'",
    'O‘',
    "O'",
    'Оʻ',
    'Oʻ',
    'oʻ',
    'o‘',
    "o'",
    'о`',
    'O`',
    'SH',
    'Sh',
    'sh',
    'YE',
    'Ye',
    'ye',
    'YO',
    'yo',
    'TS',
    'ts',
    'Ya',
    'YA',
    'ya',
    'Yu',
    'yu',
  ]
  let charsArr = word.split('')
  let answer = ''
  let vowels = ['I', 'i', 'E', 'e', 'A', 'a', 'O', 'o', 'U', 'u']
  let stopSigns = ['ʻ', '’', "'", '`', 'ʼ']
  for (let index = 0; index < charsArr.length; index++) {
    const prevEl = charsArr[index - 1] as ObjectKeys<typeof chars>
    const element = charsArr[index] as ObjectKeys<typeof chars>
    const nextEl = charsArr[index + 1] as ObjectKeys<typeof chars>
    const twoChar = (element + nextEl) as ObjectKeys<typeof chars>
    if (exceptions.includes(twoChar)) {
      answer += chars[twoChar]
      index++
    } else if (element == 'e' && index == 0) {
      answer += 'э'
    } else if (element == 'E' && index == 0) {
      answer += 'Э'
    } else if (stopSigns.includes(element)) {
      if (nextEl == nextEl.toUpperCase()) {
        answer += 'ъ'.toUpperCase()
      } else {
        answer += 'ъ'
      }
    } else if (chars[element]) {
      answer += chars[element]
    } else {
      answer += element
    }
  }
  if (answer.split('').indexOf('Э') > 0) {
    if (answer[answer.split('').indexOf('Э')]) {
      answer.slice()
    }
  }
  return answer
}
export { toLatin, toCyrill }
