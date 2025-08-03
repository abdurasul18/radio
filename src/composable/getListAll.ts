import { Ref } from 'vue'
import { AxiosPromise } from 'axios'

export function useApiServiceAll<T>(apiMethod: (query?: any, body?: any) => AxiosPromise<{data: T, meta:any}>, filterParams?: Ref<any>, withoutRoute?: boolean) {
  const route = useRoute()
  const router = useRouter()
  const loading = ref(false)
  const list = ref<T[]>([])
  const total = ref(20)
  const search = ref(String(route.query.search || ''))
  let params = computed(() => {
    return {
      query: {
        search: search.value,
        ...filterParams?.value.query,
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
      list.value = response.data.data || [] as any
      total.value = response.data.meta?.total_count
    } finally {
      loading.value = false
    }
  }
  watch(() => [search.value, params.value], () => {
    fetchData();
    if(!withoutRoute) {
      router.replace({ query: { ...route.query, search: search.value, ...params.value.query, ...params.value.body } })
    }
  }, { deep: true })
  return {
    loading,
    list,
    search,
    fetchData,
    params,
    total
  }
}
