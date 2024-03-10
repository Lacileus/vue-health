import './assets/base.css'

import { createApp } from 'vue'
import router from '../router/index.js'
import { autoAnimatePlugin } from '@formkit/auto-animate/vue'
import App from './App.vue'

createApp(App).use(router).use(autoAnimatePlugin).mount('#app')
