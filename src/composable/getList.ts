import { IResponse, IResponseAxios } from '/@src/services/types'
import { Ref } from 'vue'
import { watchPagination } from '/@src/composable/useWatch'

export function useApiService<T>(apiMethod: (query?: any, body?: any) => IResponseAxios<T[]>, filterParams?: Ref<any>, withRoute = true) {
  const route = useRoute()
  const router = useRouter()
  const loading = ref(false)
  const total = ref(0)
  const list: Ref<T[]> = ref([])
  const search = ref(String(route.query.search || ''))
  const page = ref(Number(route.query.page || 1))
  const per_page = ref(Number(route.query.per_page || 20))
  const limits = ref([10, 20, 30, 40, 50])
  let params = computed(() => {
    return {
      query: {
        search: search.value,
        ...filterParams?.value.query,
        page: page.value,
        per_page: per_page.value,
      },
      body: {

        ...filterParams?.value.body,
      }
    }
  })
  const fetchData = async () => {
    loading.value = true
    try {
      const response = await apiMethod(params.value.query, params.value.body)
      total.value = response.data.meta.totalCount
      list.value = response.data.data
    } finally {
      loading.value = false
    }
  }
  watchPagination(params, page, () => {
    fetchData()
    if (withRoute) {
      router.replace({ query: { ...route.query, page: page.value, per_page: per_page.value, search: search.value, ...(filterParams?.value?.query || {}), ...(filterParams?.value?.body || {}) } })
    }

  })
  return {
    loading,
    total,
    list,
    page,
    search,
    per_page,
    limits,
    fetchData,
    params
  }
}
