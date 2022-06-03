import {defineStore} from 'pinia'
import {getToken, removeToken, setToken} from "../utils/token";
import http from "../utils/http";


export const useUserStore = defineStore({
    id: 'user',
    state: () => {
        return {
            token: getToken(),
            userInfo: {},
            permission: []
        }
    },
    actions: {
        getUserInfo(){
            return new Promise((resolve, reject) => {
                http.get("/profile/getInfo",{}).then(res => {
                    this.userInfo = res.data.userInfo
                    this.permissions = res.data.permissions
                    resolve(res.data)
                }).catch(err => {
                    reject(err)
                })
            })
        },
        login(loginForm){
            return new Promise((resolve, reject) => {
                http.post("/auth/token", loginForm).then(res => {
                    setToken(res.data.access_token)
                    resolve()
                }).catch(err => {
                    reject(err)
                })
            })
        },
        logout(){
            removeToken()
            http.get("/logout",{}).then(res => {

            })
        }
    }
})