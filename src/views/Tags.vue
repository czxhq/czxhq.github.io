<template>
  <div class="page-tags">
    <header class="page-header">
      <h1 class="page-title">{{ siteConfig.tags.title }}</h1>
      <p class="page-desc">{{ formatTemplate(siteConfig.tags.descriptionTemplate, { tagCount: tagCloud.length, postCount: visiblePosts.length }) }}</p>
    </header>

    <div class="glass-card tag-cloud" v-if="tagCloud.length > 0">
      <button
        v-for="tag in tagCloud"
        :key="tag.name"
        class="tag"
        :class="[tag.sizeClass, { active: activeTag === tag.name }]"
        @click="selectTag(tag.name)"
      >
        {{ tag.name }}<span class="tag-count">{{ tag.count }}</span>
      </button>
    </div>

    <transition name="expand">
      <div class="post-result" v-if="activeTag">
        <div class="result-header">
          <h2 class="result-title">
            <span class="tag-indicator">#</span> {{ activeTag }}
          </h2>
          <span class="result-count">{{ filteredPosts.length }} 篇文章</span>
          <button class="clear-btn" @click="activeTag = null">{{ siteConfig.tags.clearLabel }}</button>
        </div>

        <div class="post-list">
          <div class="post-item" v-for="post in pagedPosts" :key="post.slug">
            <span class="post-date">{{ post.date }}</span>
            <router-link :to="`/post/${post.slug}`" class="post-title">{{ post.title }}</router-link>
            <span class="post-category">{{ post.category }}</span>
          </div>
        </div>
        <AppPagination v-model:current="tagPage" :total-pages="tagTotalPages" @update:current="tagPage = $event" />
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import AppPagination from '../components/AppPagination.vue'
import postsData from '../data/posts.json'
import { formatTemplate, siteConfig } from '../config/site-config'

const TAG_PAGE_SIZE = 15
const visiblePosts = computed(() => postsData.filter(p => !p.draft))
const activeTag = ref(null)
const tagPage = ref(1)

const tagCloud = computed(() => {
  const counts = {}
  let max = 0
  visiblePosts.value.forEach(p => {
    if (!p.tags) return
    p.tags.forEach(t => {
      counts[t] = (counts[t] || 0) + 1
      if (counts[t] > max) max = counts[t]
    })
  })
  return Object.entries(counts).map(([name, count]) => {
    let sizeClass = 'tag-small'
    if (count === max || count >= 5) sizeClass = 'tag-large'
    else if (count >= 2) sizeClass = 'tag-medium'
    return { name, count, sizeClass }
  }).sort((a, b) => b.count - a.count)
})

const filteredPosts = computed(() => {
  if (!activeTag.value) return []
  return visiblePosts.value
    .filter(p => p.tags && p.tags.includes(activeTag.value))
    .sort((a, b) => new Date(b.date) - new Date(a.date))
})

const tagTotalPages = computed(() => Math.ceil(filteredPosts.value.length / TAG_PAGE_SIZE))

const pagedPosts = computed(() => {
  const start = (tagPage.value - 1) * TAG_PAGE_SIZE
  return filteredPosts.value.slice(start, start + TAG_PAGE_SIZE)
})

function selectTag(name) {
  activeTag.value = activeTag.value === name ? null : name
  tagPage.value = 1
}

watch(activeTag, () => { tagPage.value = 1 })
</script>

<style scoped>
.page-tags {
  position: relative;
  z-index: 1;
  max-width: 900px;
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

.tag-cloud {
  padding: 36px 40px;
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  justify-content: center;
  align-items: center;
  margin-bottom: 40px;
}

.tag {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: var(--text-muted);
  cursor: pointer;
  transition: all 0.2s;
  padding: 6px 16px;
  border: 1px dashed transparent;
  border-radius: 4px;
  background: transparent;
  font-family: inherit;
}

.tag:hover {
  color: var(--primary);
  border-color: var(--glass-border);
  background: var(--bg-color);
}

.tag.active {
  color: var(--primary-dark);
  border-color: var(--primary);
  background: color-mix(in srgb, var(--primary) 8%, transparent);
  font-weight: 600;
}

.tag-count {
  font-size: 0.75em;
  background: var(--bg-secondary);
  color: var(--text-muted);
  border-radius: 10px;
  padding: 1px 7px;
  min-width: 18px;
  text-align: center;
}

.tag.active .tag-count {
  background: color-mix(in srgb, var(--primary) 15%, transparent);
  color: var(--primary-dark);
}

.tag-large  { font-size: 1.35rem; color: var(--primary-dark); }
.tag-medium { font-size: 1.05rem; }
.tag-small  { font-size: 0.9rem; opacity: 0.8; }

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

.tag-indicator {
  color: var(--accent);
  margin-right: 4px;
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
  white-space: nowrap;
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

.post-category {
  font-size: 0.82rem;
  color: var(--accent);
  white-space: nowrap;
  flex-shrink: 0;
}

.expand-enter-active,
.expand-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}

.expand-enter-from,
.expand-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

@media (max-width: 768px) {
  .page-tags {
    padding: 40px 16px;
  }

  .page-header {
    margin-bottom: 24px;
    padding: 20px 16px;
  }

  .page-title {
    font-size: 1.8rem;
  }

  .tag-cloud {
    padding: 20px 16px;
    gap: 10px;
    margin-bottom: 24px;
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
