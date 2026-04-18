import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Categories from '../views/Categories.vue'
import Tags from '../views/Tags.vue'
import Archive from '../views/Archive.vue'
import About from '../views/About.vue'
import Post from '../views/Post.vue'
import Search from '../views/Search.vue'
import NotFound from '../views/NotFound.vue'
import { buildPageTitle, siteConfig, updateDocumentMetadata } from '../config/site-config'

const routes = [
  { path: '/', component: Home, meta: { title: siteConfig.home.pageTitle } },
  { path: '/categories', component: Categories, meta: { title: siteConfig.categories.pageTitle } },
  { path: '/tags', component: Tags, meta: { title: siteConfig.tags.pageTitle } },
  { path: '/archive', component: Archive, meta: { title: siteConfig.archive.pageTitle } },
  { path: '/about', component: About, meta: { title: siteConfig.about.pageTitle } },
  { path: '/search', component: Search, meta: { title: siteConfig.search.pageTitle } },
  { path: '/post/:slug', component: Post },
  { path: '/:pathMatch(.*)*', component: NotFound, meta: { title: siteConfig.notFound.pageTitle } }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  }
})

router.afterEach((to) => {
  const pageTitle = typeof to.meta?.title === 'string' ? to.meta.title : ''
  updateDocumentMetadata({
    title: buildPageTitle(pageTitle)
  })
})

export default router
