import {createRouter, createWebHashHistory} from "vue-router";
import BaseRoutes from '../router/base-routes'

const router = createRouter({
    history: createWebHashHistory(),
    routes: BaseRoutes
})

export default router