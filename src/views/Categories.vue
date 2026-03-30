<template>
  <div class="page-categories">
    <header class="page-header">
      <h1 class="page-title">{{ siteConfig.categories.title }}</h1>
      <p class="page-desc">{{ formatTemplate(siteConfig.categories.descriptionTemplate, { count: visiblePosts.length }) }}</p>
    </header>
    
    <div class="categories-layout">
      <aside class="sidebar-tree">
        <div class="tree-container glass-card">
          <CategoryNode 
            v-for="rootNode in categoryTree" 
            :key="rootNode.path"
            :node="rootNode"
            :activeCategory="activeCategory"
            @select="activeCategory = $event"
          />
        </div>
      </aside>

      <main class="main-posts">
        <div class="post-result" v-if="activeCategory">
          <div class="result-header">
            <h2 class="result-title">
              <span class="cat-indicator"></span> {{ activeCategory.replace(/\//g, ' / ') }}
            </h2>
            <span class="result-count">{{ filteredPosts.length }} 篇文章</span>
            <button class="clear-btn" @click="activeCategory = null">{{ siteConfig.categories.clearLabel }}</button>
          </div>

          <div class="post-list">
            <div class="post-item" v-for="post in pagedPosts" :key="post.slug">
              <span class="post-date">{{ post.date }}</span>
              <router-link :to="`/post/${post.slug}`" class="post-title">{{ post.title }}</router-link>
            </div>
          </div>
          
          <AppPagination v-model:current="page" :total-pages="totalPages" @update:current="page = $event" />
        </div>
        
        <div v-else class="empty-state glass-card">
          <div class="empty-icon">
            <svg viewBox="0 0 24 24" width="64" height="64" stroke="currentColor" stroke-width="1" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>
          </div>
          <h3 class="empty-title">{{ siteConfig.categories.emptyTitle }}</h3>
          <p class="empty-desc">{{ siteConfig.categories.emptyDescription }}</p>
          
          <div class="top-categories" v-if="categoryTree.length > 0">
            <button class="top-cat-card" v-for="cat in categoryTree.slice(0, 6)" :key="cat.path" @click="activeCategory = cat.path">
              <span class="top-cat-name">{{ cat.name }}</span>
              <span class="top-cat-count">{{ cat.totalCount }} 篇</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import postsData from '../data/posts.json'
import CategoryNode from '../components/CategoryNode.vue'
import AppPagination from '../components/AppPagination.vue'
import { formatTemplate, siteConfig } from '../config/site-config'

const PAGE_SIZE = 15
const visiblePosts = computed(() => postsData.filter(p => !p.draft))
const activeCategory = ref(null)
const page = ref(1)

const categoryTree = computed(() => {
  const root = { path: '', name: 'root', count: 0, children: [], posts: [] }
  visiblePosts.value.forEach(p => {
    if (!p.category) return
    const parts = p.category.split('/').map(s => s.trim())
    let current = root
    let pathAcc = []
    
    parts.forEach((part, i) => {
      pathAcc.push(part)
      const currentPath = pathAcc.join('/')
      let child = current.children.find(c => c.name === part)
      if (!child) {
        child = { name: part, path: currentPath, count: 0, totalCount: 0, children: [], posts: [] }
        current.children.push(child)
      }
      if (i === parts.length - 1) {
        child.posts.push(p)
        child.count++
      }
      current = child
    })
  })
  
  function calcTotal(node) {
    node.totalCount = node.count
    node.children.forEach(c => {
      node.totalCount += calcTotal(c)
    })
    return node.totalCount
  }
  
  root.children.forEach(calcTotal)
  return root.children.sort((a, b) => b.totalCount - a.totalCount)
})

const filteredPosts = computed(() => {
  if (!activeCategory.value) return []
  return visiblePosts.value
    .filter(p => p.category && (p.category === activeCategory.value || p.category.startsWith(activeCategory.value + '/')))
    .sort((a, b) => new Date(b.date) - new Date(a.date))
})

const totalPages = computed(() => Math.ceil(filteredPosts.value.length / PAGE_SIZE))

const pagedPosts = computed(() => {
  const start = (page.value - 1) * PAGE_SIZE
  return filteredPosts.value.slice(start, start + PAGE_SIZE)
})

watch(activeCategory, () => {
  page.value = 1
})
</script>

<style scoped>
.page-categories {
  position: relative;
  z-index: 1;
  max-width: 1100px;
  margin: 0 auto;
  padding: 60px 24px;
}

.page-header {
  position: relative;
  z-index: 1;
  text-align: center;
  margin-bottom: 48px;
  padding: 28px 24px;
  background: rgba(250, 247, 240, 0.72);
  border: 1px solid var(--glass-border);
  border-radius: 16px;
  box-shadow: var(--shadow-sm);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
}

.page-title {
  font-size: 2.2rem;
  color: var(--primary-dark);
  margin: 0 0 12px 0;
}

.page-desc {
  color: var(--text-muted);
  font-size: 1rem;
}

.categories-layout {
  display: flex;
  gap: 40px;
  align-items: flex-start;
}

.sidebar-tree {
  width: 280px;
  flex-shrink: 0;
  position: sticky;
  top: 100px;
}

.tree-container {
  padding: 20px 16px;
}

.main-posts {
  flex: 1;
  min-width: 0;
}

.empty-state {
  padding: 80px 40px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.empty-icon {
  color: var(--primary);
  opacity: 0.5;
  margin-bottom: 24px;
}

.empty-title {
  font-size: 1.5rem;
  color: var(--primary-dark);
  margin: 0 0 12px 0;
}

.empty-desc {
  color: var(--text-muted);
  font-size: 1rem;
  margin: 0 0 40px 0;
}

.top-categories {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  justify-content: center;
  max-width: 500px;
}

.top-cat-card {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: var(--bg-secondary);
  border: 1px dashed var(--glass-border);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  color: var(--text-color);
  font-family: inherit;
  font-size: 0.95rem;
}

.top-cat-card:hover {
  border-color: var(--primary);
  color: var(--primary);
  transform: translateY(-2px);
  background: color-mix(in srgb, var(--primary) 5%, var(--bg-secondary));
}

.top-cat-count {
  font-size: 0.85em;
  color: var(--text-muted);
  background: var(--bg-color);
  padding: 2px 8px;
  border-radius: 12px;
}

.post-result {
  background: var(--card-bg);
  border: 1px solid var(--glass-border);
  border-radius: 8px;
  overflow: hidden;
}

.result-header {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px 28px;
  border-bottom: 1px solid var(--glass-border);
  background: var(--bg-secondary);
  flex-wrap: wrap;
}

.result-title {
  margin: 0;
  font-size: 1.2rem;
  color: var(--primary-dark);
  flex: 1;
}

.cat-indicator {
  display: inline-block;
  width: 12px;
  height: 12px;
  background: var(--accent);
  border-radius: 50%;
  margin-right: 8px;
}

.result-count {
  color: var(--text-muted);
  font-size: 0.9rem;
}

.clear-btn {
  background: transparent;
  border: 1px solid var(--glass-border);
  color: var(--text-muted);
  border-radius: 4px;
  padding: 4px 12px;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s;
}

.clear-btn:hover {
  border-color: var(--primary);
  color: var(--primary);
}

.post-list {
  padding: 12px 0;
}

.post-item {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 14px 28px;
  border-bottom: 1px dashed var(--glass-border);
  transition: background 0.15s;
}

.post-item:last-child {
  border-bottom: none;
}

.post-item:hover {
  background: var(--bg-secondary);
}

.post-date {
  font-size: 0.85rem;
  color: var(--text-muted);
  font-variant-numeric: tabular-nums;
  flex-shrink: 0;
}

.post-title {
  flex: 1;
  text-decoration: none;
  color: var(--text-color);
  font-size: 1rem;
  transition: color 0.2s;
}

.post-title:hover {
  color: var(--primary);
}

@media (max-width: 768px) {
  .page-categories {
    padding: 40px 16px;
  }

  .page-header {
    margin-bottom: 24px;
    padding: 20px 16px;
  }

  .page-title {
    font-size: 1.8rem;
  }

  .categories-layout {
    flex-direction: column;
    gap: 24px;
  }
  .sidebar-tree {
    width: 100%;
    position: static;
  }

  .tree-container,
  .empty-state {
    padding: 18px 16px;
  }

  .result-header,
  .post-item {
    padding-left: 16px;
    padding-right: 16px;
  }

  .post-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
}
</style>
