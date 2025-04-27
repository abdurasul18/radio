import { Ref } from "vue";

export function watchPagination(params: Ref<{
    body: { [key: string]: any },
    query: { [key: string]: any }
}>, page: Ref<number>, callback: any, immediate = false) {
    watch(() => params.value, (newVal, oldVal) => {

        let data1 = JSON.stringify({ ...newVal, query: { ...newVal.query, page: 1 } })
        let data2 = JSON.stringify({ ...(oldVal || {}), query: { ...oldVal?.query || {}, page: 1 } })
        if (params.value.query.page !== 1 && data1 !== data2) {
            page.value = 2
        }
        else {
            callback(params.value)
        }
    }, { deep: true, immediate })
}