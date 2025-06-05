import { AxiosResponse } from "axios";
import ApiService from "./api"
export const RoleType = {
  100 : "ADMIN",
  200 : "RECTOR",
  300 : "SUB_RECTOR",
  400 : "DEKAN",
  500 : "TEACHER",
} as any
const AuthService = {
  /**
   * Login the user and store the access token to TokenService.
   *
   * @returns access_token
   * @throws AuthenticationError
   **/
  login: async function (userData: any) {
    return ApiService.post(`/admin/login`, userData)
  },

}

export { AuthService }
