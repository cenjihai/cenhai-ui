import {createRouter, createWebHistory} from "vue-router";
import BaseRoutes from '../router/base-routes'

const router = createRouter({
    history: createWebHistory(),
    routes: BaseRoutes
})

export default router