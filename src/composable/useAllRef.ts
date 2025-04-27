import { references, RefNameType } from '/@src/services/config'
import { createRefService } from '/@src/services/references'
let defualtParams = {
  search: '',
  params: {
    page: 0,
    limit: 20,
  },
}

export const useAllRef = function <T>(refName: RefNameType) {
  let config = references.find((el) => el.name == refName) as any

  const Service = createRefService<T>(config?.name)
  let loading = ref(false)
  let total = ref(0)
  let list = ref<T[]>([])
  async function getList(params = defualtParams) {
    try {
      loading.value = true
      let res = await Service.getList(params)
      total.value = res.data.total
      list.value = res.data.list
    } finally {
      loading.value = false
    }
  }
  return {
    getList,
    loading,
    total,
    list,
  }
}
