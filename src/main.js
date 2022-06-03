import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import Router from './router'
import Store from './store'
import 'element-plus/dist/index.css'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import App from './App.vue'

import './router/dynamic'


createApp(App)
    .use(ElementPlus)
    .use(Store)
    .use(Router)
    .component('font-awesome-icon', FontAwesomeIcon)
    .mount('#app')
