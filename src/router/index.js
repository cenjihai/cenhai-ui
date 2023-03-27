import {createRouter,createMemoryHistory} from "vue-router";
import BaseRoutes from '../router/base-routes'

const router = createRouter({
    history: createMemoryHistory(),
    routes: BaseRoutes
})

export default router