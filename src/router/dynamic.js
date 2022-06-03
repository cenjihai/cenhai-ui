import router from "./index"
import BaseLayout from "@/layouts/BaseLayout.vue"
import {useMenuStore} from "../store/menu";
import {getToken} from "../utils/token";

const modules = import.meta.glob('/src/views/*/*/*.vue');


router.beforeEach((to, from, next) => {

    const menuStore = useMenuStore();
    if (getToken()){
        if (menuStore.$state.menuState === false){
            menuStore.getRoutes().then(data => {
                setComponent(data)
                data.forEach((item) => {
                    item.component = BaseLayout;
                    item.path = "/" + item.path;
                    router.addRoute(item);
                })
                menuStore.$state.menuState = true;
                if (to.path === '/404' && to.redirectedFrom !== undefined){
                    next({path:to.redirectedFrom?.fullPath,replace:true})
                }else {
                    next({...to,replace:true})

                }
            }).catch(err => {
                next()
            })
        }else {
            next()
        }

    }else {
        if (to.path  === '/login'){
            next()
        }else {
            next("/login")
        }
    }
})

function setComponent(list) {
    list.forEach((item) => {
        if (item.children.length > 0){
            setComponent(item.children)
        }else {
            item.component = modules['/src/views/'+item.component + '.vue']
        }
    })
}

