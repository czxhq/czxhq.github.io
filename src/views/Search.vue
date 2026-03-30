<template>
  <div class="page-search">
    <header class="page-header glass-card">
      <h1 class="page-title">{{ siteConfig.search.title }}</h1>
      <p class="page-desc">{{ siteConfig.search.description }}</p>

      <form class="search-bar" @submit.prevent="submitSearch">
        <input
          ref="inputRef"
          v-model.trim="keyword"
          class="search-input"
          type="search"
          :placeholder="siteConfig.search.placeholder"
        />
        <button class="search-submit" type="submit">{{ siteConfig.search.submitLabel }}</button>
      </form>
    </header>

    <section class="search-state glass-card" v-if="!normalizedKeyword">
      <h2 class="state-title">{{ siteConfig.search.startTitle }}</h2>
      <p class="state-desc">{{ siteConfig.search.startDescription }}</p>
    </section>

    <section class="search-results" v-else>
      <div class="result-summary">
        <h2 class="result-title">{{ formatTemplate(siteConfig.search.resultTitleTemplate, { keyword: normalizedKeyword }) }}</h2>
        <span class="result-count">{{ formatTemplate(siteConfig.search.resultCountTemplate, { count: filteredPosts.length }) }}</span>
      </div>

      <div class="empty-result glass-card" v-if="filteredPosts.length === 0">
        <h3 class="state-title">{{ siteConfig.search.emptyTitle }}</h3>
        <p class="state-desc">{{ siteConfig.search.emptyDescription }}</p>
      </div>

      <div class="result-list" v-else>
        <router-link
          v-for="post in pagedPosts"
          :key="post.slug"
          :to="`/post/${post.slug}`"
          class="result-card glass-card"
        >
          <div class="result-meta">
            <span class="result-category">{{ post.category || siteConfig.search.uncategorizedLabel }}</span>
            <span class="result-date">{{ post.date || siteConfig.search.undatedLabel }}</span>
          </div>
          <h3 class="result-card-title">{{ post.title }}</h3>
          <p class="result-snippet">{{ buildSnippet(post) }}</p>
          <div class="result-tags" v-if="post.tags && post.tags.length">
            <span class="tag" v-for="tag in post.tags.slice(0, 5)" :key="tag">{{ tag }}</span>
          </div>
        </router-link>
      </div>

      <AppPagination
        v-if="filteredPosts.length > pageSize"
        v-model:current="page"
        :total-pages="totalPages"
        @update:current="page = $event"
      />
    </section>
  </div>
</template>

<script setup>
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppPagination from '../components/AppPagination.vue'
import postsData from '../data/posts.json'
import { formatTemplate, siteConfig } from '../config/site-config'

const route = useRoute()
const router = useRouter()
const inputRef = ref(null)
const keyword = ref(typeof route.query.q === 'string' ? route.query.q : '')
const page = ref(1)
const pageSize = 10

const visiblePosts = computed(() => postsData.filter((post) => !post.draft))
const normalizedKeyword = computed(() => keyword.value.trim().toLowerCase())

const filteredPosts = computed(() => {
  if (!normalizedKeyword.value) return []

  return visiblePosts.value.filter((post) => {
    const haystack = [
      post.title,
      post.category,
      ...(post.tags || []),
      post.summary,
      post.searchText
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase()

    return haystack.includes(normalizedKeyword.value)
  })
})

const totalPages = computed(() => Math.max(1, Math.ceil(filteredPosts.value.length / pageSize)))

const pagedPosts = computed(() => {
  const start = (page.value - 1) * pageSize
  return filteredPosts.value.slice(start, start + pageSize)
})

function submitSearch() {
  const query = keyword.value.trim()
  page.value = 1
  router.replace({
    path: '/search',
    query: query ? { q: query } : {}
  })
}

function buildSnippet(post) {
  const source = String(post.searchText || post.summary || '').replace(/\s+/g, ' ').trim()
  if (!source) return siteConfig.search.noSummaryLabel

  const lower = source.toLowerCase()
  const query = normalizedKeyword.value
  if (!query) {
    return source.slice(0, 120)
  }

  const index = lower.indexOf(query)
  if (index < 0) {
    return source.slice(0, 120)
  }

  const start = Math.max(0, index - 36)
  const end = Math.min(source.length, index + query.length + 72)
  const prefix = start > 0 ? '...' : ''
  const suffix = end < source.length ? '...' : ''
  return `${prefix}${source.slice(start, end)}${suffix}`
}

watch(
  () => route.query.q,
  async (value) => {
    keyword.value = typeof value === 'string' ? value : ''
    page.value = 1
    await nextTick()
    if (inputRef.value && !keyword.value) {
      inputRef.value.focus()
    }
  }
)

onMounted(async () => {
  await nextTick()
  if (inputRef.value) {
    inputRef.value.focus()
  }
})
</script>

<style scoped>
.page-search {
  max-width: 980px;
  margin: 0 auto;
  padding: 60px 24px;
  position: relative;
  z-index: 1;
}

.page-header {
  padding: 32px;
  margin-bottom: 32px;
}

.page-title {
  margin: 0 0 10px;
  font-size: 2.1rem;
  color: var(--primary-dark);
}

.page-desc {
  margin: 0 0 24px;
  color: var(--text-muted);
}

.search-bar {
  display: flex;
  gap: 12px;
}

.search-input {
  flex: 1;
  min-width: 0;
  height: 48px;
  padding: 0 16px;
  border: 1px solid var(--glass-border);
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.65);
  color: var(--text-color);
  font: inherit;
  outline: none;
}

.search-input:focus {
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(92, 122, 58, 0.12);
}

.search-submit {
  height: 48px;
  padding: 0 20px;
  border: 1px solid var(--primary);
  border-radius: 10px;
  background: var(--primary);
  color: #fff;
  font: inherit;
}

.search-state,
.empty-result {
  padding: 32px;
}

.state-title {
  margin: 0 0 10px;
  font-size: 1.4rem;
  color: var(--primary-dark);
}

.state-desc {
  margin: 0;
  color: var(--text-muted);
  line-height: 1.7;
}

.result-summary {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  align-items: center;
  margin-bottom: 20px;
}

.result-title {
  margin: 0;
  font-size: 1.35rem;
  color: var(--text-color);
}

.result-count {
  color: var(--text-muted);
  font-size: 0.95rem;
}

.result-list {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.result-card {
  display: block;
  padding: 22px 24px;
  text-decoration: none;
}

.result-meta {
  display: flex;
  gap: 12px;
  margin-bottom: 12px;
  color: var(--text-muted);
  font-size: 0.88rem;
}

.result-category {
  color: var(--accent);
}

.result-card-title {
  margin: 0 0 10px;
  color: var(--text-color);
  font-size: 1.2rem;
}

.result-card:hover .result-card-title {
  color: var(--primary);
}

.result-snippet {
  margin: 0 0 14px;
  color: var(--text-muted);
  line-height: 1.7;
}

.result-tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.tag {
  display: inline-flex;
  align-items: center;
  padding: 4px 10px;
  border-radius: 999px;
  background: var(--bg-secondary);
  color: var(--text-muted);
  font-size: 0.82rem;
}

@media (max-width: 720px) {
  .page-search {
    padding: 40px 16px;
  }

  .page-header,
  .search-state,
  .empty-result,
  .result-card {
    padding: 20px 16px;
  }

  .page-title {
    font-size: 1.8rem;
  }

  .search-bar {
    flex-direction: column;
  }

  .result-summary {
    flex-direction: column;
    align-items: flex-start;
  }
}

@media (max-width: 480px) {
  .result-meta {
    flex-direction: column;
    gap: 6px;
  }
}
</style>
