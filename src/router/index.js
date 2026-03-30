import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Categories from '../views/Categories.vue'
import Tags from '../views/Tags.vue'
import Archive from '../views/Archive.vue'
import About from '../views/About.vue'
import Post from '../views/Post.vue'
import Search from '../views/Search.vue'
import NotFound from '../views/NotFound.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/categories', component: Categories },
  { path: '/tags', component: Tags },
  { path: '/archive', component: Archive },
  { path: '/about', component: About },
  { path: '/search', component: Search },
  { path: '/post/:slug', component: Post },
  { path: '/:pathMatch(.*)*', component: NotFound }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  }
})

export default router
