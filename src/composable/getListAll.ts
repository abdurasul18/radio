import { Ref } from 'vue'
import { AxiosPromise } from 'axios'

export function useApiServiceAll<T>(apiMethod: (query?: any, body?: any) => AxiosPromise<T>, filterParams?: Ref<any>) {
  const route = useRoute()
  const router = useRouter()
  const loading = ref(false)
  const list = ref<T[]>([])
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
    } finally {
      loading.value = false
    }
  }
  watch(() =>[search.value, params.value], () => {
    fetchData()
   }, {deep:true})
  return {
    loading,
    list,
    search,
    fetchData,
    params
  }
}
