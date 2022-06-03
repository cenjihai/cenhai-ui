import BaseLayout from "@/layouts/BaseLayout.vue";


const BaseRoutes = [
    {
        path: '/',
        name: 'home',
        component: BaseLayout,
        redirect: 'index',
        meta: { title: '主页',icon:'faHome'},
        children: [
            {
                path: 'index',
                name: 'index',
                component: () => import("@/views/index.vue"),
                meta: {title: "控制台",icon:'faDashboard'}
            },
            {
                path: 'profile',
                name: 'profile',
                component: () => import("@/views/profile/index.vue"),
                hidden: true,
                meta: {title: '个人信息', icon: 'faHome'}
            }
        ]
    },
    {
        path: "/login",
        component: () => import("@/views/login.vue"),
        hidden: true,
        meta: {title:"登录",icon: ""}
    },
    {
        path: '/404',
        component: () => import('@/views/error/404.vue'),
        hidden: true
    },
    {
        path: '/500',
        component: () => import('@/views/error/500.vue'),
        hidden: true
    },
    {
        path: '/:W+',
        component: BaseLayout,
        redirect: '/404',
        hidden: true
    }
]

export default BaseRoutes