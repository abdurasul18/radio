import { defineStore } from 'pinia'
import { EmployeeService, IEmployee } from '../services/employee'
import { AuthService } from '../services/auth'
import ApiService from '../services/api'
import { IconName } from '../components/ui/CIcon.vue'
import { UserService } from '../services/user'
import { jwtDecode } from "jwt-decode";
interface IUser {
  token: string;
  exp: string
  first_name: string
  iat: string
  id: string
  last_name: string
  username: string
}
export const useAuthStore = defineStore('auth', () => {
  const user = useStorage<Partial<IUser>>('user', {})
  const token = useStorage("access_token", "")
  const employee = useStorage<IEmployee>("employee", null)
  const isAuthenticated = computed(() => !!token.value)
  const login = (data: any) => {
    user.value = jwtDecode(data.token)
    token.value = data.token
  }
  const logout = () => {
    user.value = undefined
    token.value = ""
    ApiService.removeHeader()
  }
  async function getCurrentUser() {
    try {
      let { data } = await UserService.getCurrentUser()
      user.value = data?.data || {}
      token.value = data?.data?.access_token || ""
    }
    finally {

    }
  }
  // 
  const routes: {
    name: string;
    icon: IconName;
    text: string;
    to: string;
    roles?: number[];
    children?: {
      name: string;
      icon: IconName;
      text: string;
      to: string;
      roles?: number[];
    }[];
  }[] = [
      {
        name: "notification",
        icon: "notification",
        text: "Bildirishnomalar",
        to: "/notification",
      },
      {
        name: "contact",
        icon: "users",
        text: "Kontaktlar",
        to: "/contact",
      },
       {
        name: "category",
        icon: "category",
        text: "Kategoriyalar",
        to: "/category",
      },
      //  {
      //   name: "service",
      //   icon: "geometric",
      //   text: "Xizmat turlari",
      //   to: "/service",
      // },
      //  {
      //   name: "organization",
      //   icon: "department",
      //   text: "Xizmatlar",
      //   to: "/organization",
      // },
      {
        name: "region",
        icon: "location",
        text: "Shtatlar",
        to: "/region",
      },
    ];

  return {
    user,
    token,
    isAuthenticated,
    login,
    logout,
    getCurrentUser,
    employee,
    routes

  }
})
