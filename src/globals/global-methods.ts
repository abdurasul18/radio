import { Ref } from 'vue'
const locale = useStorage('locale', 'lt') as Ref<'lt' | 'uz' | 'eng' | 'ru'>
const Util = {
    withBaseUrl(url?: string) {
        if (url?.startsWith('/')) {
            url = url.substring(1)
        }
        return `${import.meta.env. VITE_API_IMG_URL}${url}`
    },
    paginate(index: number, page: number, limit: number) {
        return index + 1 + (page - 1) * limit
    },
    enc(id: string) {
        let payload = 'did$tAid$z'
        try {
            let params = window.btoa(payload)
            let idencoded = window.btoa(params + id)
            return idencoded
        } catch (error) {
            return null
        }
    },
    dec(args: string) {
        let payload = 'did$tAid$z'
        try {
            let params = window.atob(args)
            let givenVal = window.btoa(payload)
            let arr = params.split(givenVal)
            return parseInt(arr[1])
        } catch (error) {
            return null
        }
    },
    replaceData(date: string) {
        return new Date(date.replace(/(\d{2})-(\d{2})-(\d{4})/, '$2/$1/$3'))
    },
    DDMMYYYY(replacedData: Date) {
        let month = new Date(0, replacedData.getMonth() + 1, 0).toLocaleDateString('en', {
            month: '2-digit',
        })
        let day = replacedData.getDate()
        let year = replacedData.getFullYear()
        let digitDay = day.toString().length === 1 ? '0' + day : day
        return digitDay + '.' + month + '.' + year
    },
    toDMY(date: Date) {
        const yyyy = date.getFullYear()
        let mm: number | string = date.getMonth() + 1 // Months start at 0!
        let dd: number | string = date.getDate()

        if (dd < 10) dd = '0' + dd
        if (mm < 10) mm = '0' + mm

        return dd + '-' + mm + '-' + yyyy
    },
    YYYYMMDD(replacedData: Date) {
        let month = new Date(0, replacedData.getMonth() + 1, 0).toLocaleDateString('en', {
            month: '2-digit',
        })
        let day = replacedData.getDate()
        let year = replacedData.getFullYear()
        let digitDay = day.toString().length === 1 ? '0' + day : day
        return year + '-' + month + '-' + digitDay
    },
}
export default Util
