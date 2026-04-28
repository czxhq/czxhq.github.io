import { createApp } from 'vue'
import './style.css'
import './assets/markdown-style.css'
import 'katex/dist/katex.min.css'
import App from './App.vue'
import router from './router'
import { MotionPlugin } from '@vueuse/motion'
import { updateDocumentMetadata } from './config/site-config'

const app = createApp(App)
app.use(router)
app.use(MotionPlugin)

updateDocumentMetadata()
app.mount('#app')
