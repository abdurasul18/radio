import { defineStore } from 'pinia'
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
  const employee = useStorage<any>("employee", null)
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
        name: "education",
        icon: "education",
        text: "Ta'lim",
        to: "/education",
      },
      {
        name: "region",
        icon: "location",
        text: "Shtatlar",
        to: "/region",
      },
    ];
  // 
  const educations = [
    {
      name: "DMV practice test",
      code: "1",
      img: "/img/1.png",
    },
    {
      name: "CDL permite test",
      code: "2",
      img: "/img/2.png",
    },
    {
      name: "Traffic signs for truck drivers",
      code: "3",
      img: "/img/3.png",
    },
    {
      name: "Easy english",
      code: "4",
      img: "/img/4.png",
    },
  ];

  // 
  const testTypes = [
    {
      name: "Belgilar orqali test ishlash",
      code: "1",
      img: "/img/t1.png",
    },
    {
      name: "Savollar orqali test ishlash",
      code: "2",
      img: "/img/t2.png",
    },
    {
      name: "Savol-javob orqali test ishlash",
      code: "3",
      img: "/img/t3.png",
    },
  ]
  return {
    user,
    token,
    isAuthenticated,
    login,
    logout,
    educations,
    testTypes,
    getCurrentUser,
    employee,
    routes

  }
})
