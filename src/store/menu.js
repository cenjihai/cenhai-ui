import {defineStore} from "pinia";
import http from "../utils/http";

export const useMenuStore = defineStore({
    id: 'menu',
    state: () => {
        return {
            menuState: false,
            menus: ""
        }
    },
    actions: {
        getRoutes() {
            return new Promise((resolve, reject) => {
                http.get("/listVueRoute",{}).then(res => {
                    const data = res.data;
                    this.menus = JSON.stringify(data);
                    resolve(data);
                }).catch(err => {
                    reject(err)
                })
            })
        }
    }
})