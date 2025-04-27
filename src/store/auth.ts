import { defineStore } from 'pinia'
import { EmployeeService, IEmployee } from '../services/employee'
import { AuthService } from '../services/auth'
import ApiService from '../services/api'
import { IconName } from '../components/ui/CIcon.vue'
import { UserService } from '../services/user'

interface IUser {
    access_token:string
    address:string
    avatar:string
    bio:string
    birthday:string
    created_at:string
    degree_id:string
    direction_id:string
    email:string
    first_name:string
    id:string
    last_name:string
    passport:string
    phone:string
    position_id:string
    role:100 | 200 | 300 | 400 | 500
    status:string
    updated_at:string
    username:string
    processing_lesson_count:number
    processing_task_count:number
    confirm_lesson_count:number
    total_lesson_count:number
}
export const useAuthStore = defineStore('auth', () => {
    const user = useStorage<Partial<IUser>>('user', {})
    const token = useStorage("access_token", "")
    const employee = useStorage<IEmployee>("employee", null)
    const isAuthenticated = computed(() => !!token.value)
    const login = (newUser: IUser) => {
        user.value = newUser
        token.value = newUser.access_token
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
          name: "home",
          icon: "home",
          text: "Bosh sahifa",
          to: "/",
        },
        {
          name: "faculty",
          icon: "department",
          text: "Fakultet",
          to: "/faculty",
          roles:[100]
        },
        {
          name: "direction",
          icon: "book",
          text: "Kafedralar",
          to: "/direction",
          roles:[100]
      
        },
        {
          name: "user",
          icon: "user",
          text: "O'qituvchilar",
          to: "/user",
          roles:[100, 200, 300, 400]
      
        },
        {
          name: "time-table",
          icon: "calendar",
          text: "Dars jadvali",
          to: "/time-table",
          roles:[100]
      
        },
        {
          name: "task",
          icon: "task2",
          text: "Yuklamalar",
          to: "/task",
          roles:[100, 200, 300]
      
        },
        {
          name: "criterion",
          icon: "info",
          text: "Mezonlar",
          to: "/criterion",
          roles:[100, 200, 300, 400]
        },
        {
          name: "rating",
          icon: "chart",
          text: "Reytinglar",
          to: "/rating",
          children: [
            {
              name: "rating-faculty",
              icon: "chart",
              text: "Fakultet bo'yicha",
              to: "/rating/faculty",
            },
            {
              name: "rating-direction",
              icon: "chart",
              text: "Kafedra bo'yicha",
              to: "/rating/direction",
            },
            {
              name: "rating-teacher",
              icon: "chart",
              text: "O'qituvchilar bo'yicha",
              to: "/rating/teacher",
            },
          ],
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
