<template>
  <div class="page-archive">
    <header class="page-header">
      <h1 class="page-title">{{ siteConfig.archive.title }}</h1>
      <p class="page-desc">{{ formatTemplate(siteConfig.archive.descriptionTemplate, { count: visiblePosts.length }) }}</p>
    </header>
    
    <div class="archive-container">
      <aside class="archive-nav">
        <ul class="year-list">
          <li v-for="[year, count] in yearCounts" :key="year" :class="{ active: currentYear === year }" @click="scrollToYear(year)">
            {{ year }} <span>({{ count }})</span>
          </li>
        </ul>
      </aside>
      
      <div class="archive-content">
        <div class="timeline" v-for="(months, year) in groupedPage" :key="year" :id="`year-${year}`">
          <div class="timeline-year">{{ year }}</div>
          
          <div class="timeline-month" v-for="(posts, month) in months" :key="month">
            <h3 class="month-title">{{ month }}月</h3>
            <ul class="month-posts">
              <li v-for="post in posts" :key="post.slug" @click="$router.push(`/post/${post.slug}`)">
                <span class="post-date">{{ post.date.slice(5) }}</span>
                <span class="post-title">{{ post.title }}</span>
              </li>
            </ul>
          </div>
        </div>

        <AppPagination v-model:current="page" :total-pages="totalPages" @update:current="onPageChange" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import postsData from '../data/posts.json'
import AppPagination from '../components/AppPagination.vue'
import { formatTemplate, siteConfig } from '../config/site-config'

const PAGE_SIZE = 15

const visiblePosts = computed(() => postsData.filter(p => !p.draft))
const page = ref(1)
const totalPages = computed(() => Math.ceil(visiblePosts.value.length / PAGE_SIZE))

const pagedPosts = computed(() => {
  const start = (page.value - 1) * PAGE_SIZE
  return visiblePosts.value.slice(start, start + PAGE_SIZE)
})

const groupedPage = computed(() => {
  const groups = {}
  pagedPosts.value.forEach(post => {
    if (!post.date) return
    const [y, m] = post.date.split('-')
    if (!groups[y]) groups[y] = {}
    if (!groups[y][m]) groups[y][m] = []
    groups[y][m].push(post)
  })
  const sortedYears = Object.keys(groups).sort((a, b) => b - a)
  const result = {}
  sortedYears.forEach(y => {
    const sortedMonths = Object.keys(groups[y]).sort((a, b) => b - a)
    result[y] = {}
    sortedMonths.forEach(m => { result[y][m] = groups[y][m] })
  })
  return result
})

const yearCounts = computed(() => {
  const counts = {}
  visiblePosts.value.forEach(p => {
    if (!p.date) return
    const y = p.date.split('-')[0]
    counts[y] = (counts[y] || 0) + 1
  })
  return Object.entries(counts).sort((a, b) => b[0] - a[0])
})

const currentYear = ref(yearCounts.value.length ? yearCounts.value[0][0] : '')

function scrollToYear(year) {
  currentYear.value = year
  const idx = visiblePosts.value.findIndex(p => p.date && p.date.startsWith(year))
  if (idx >= 0) {
    page.value = Math.floor(idx / PAGE_SIZE) + 1
  }
  setTimeout(() => {
    const el = document.getElementById(`year-${year}`)
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 100
      window.scrollTo({ top: y, behavior: 'smooth' })
    }
  }, 50)
}

function onPageChange() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<style scoped>
.page-archive {
  position: relative;
  z-index: 1;
  max-width: 1000px;
  margin: 0 auto;
  padding: 60px 24px;
}

.page-header {
  position: relative;
  z-index: 1;
  text-align: center;
  margin-bottom: 60px;
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
  margin: 0 0 16px 0;
}

.page-desc {
  color: var(--text-muted);
  font-size: 1.1rem;
}

.archive-container {
  display: grid;
  grid-template-columns: 200px 1fr;
  gap: 60px;
}

.year-list {
  list-style: none;
  padding: 0;
  margin: 0;
  position: sticky;
  top: 100px;
}

.year-list li {
  font-size: 1.2rem;
  color: var(--text-muted);
  padding: 12px 16px;
  cursor: pointer;
  border-left: 2px solid transparent;
  transition: all 0.2s;
  display: flex;
  justify-content: space-between;
}

.year-list li:hover {
  color: var(--primary);
  background: rgba(92, 122, 58, 0.05);
}

.year-list li.active {
  color: var(--primary-dark);
  font-weight: 600;
  border-left-color: var(--primary);
  background: var(--bg-secondary);
}

.year-list li span {
  font-size: 0.9rem;
  opacity: 0.6;
}

.timeline {
  position: relative;
  padding-left: 24px;
  border-left: 1px dashed var(--glass-border);
}

.timeline-year {
  font-size: 2rem;
  font-weight: 600;
  color: var(--primary-dark);
  margin-bottom: 32px;
  position: relative;
}

.timeline-year::before {
  content: '';
  position: absolute;
  left: -32px;
  top: 50%;
  transform: translateY(-50%);
  width: 15px;
  height: 15px;
  background: var(--bg-color);
  border: 4px solid var(--primary);
  border-radius: 50%;
}

.timeline-month {
  margin-bottom: 40px;
}

.month-title {
  font-size: 1.4rem;
  color: var(--text-color);
  margin: 0 0 20px 0;
  position: relative;
}

.month-title::before {
  content: '';
  position: absolute;
  left: -29px;
  top: 50%;
  transform: translateY(-50%);
  width: 9px;
  height: 9px;
  background: var(--accent);
  border-radius: 50%;
}

.month-posts {
  list-style: none;
  padding: 0;
  margin: 0;
}

.month-posts li {
  padding: 12px 0;
  display: flex;
  align-items: center;
  gap: 20px;
  border-bottom: 1px dashed var(--glass-border);
  cursor: pointer;
}

.month-posts li:hover .post-title {
  color: var(--primary);
  transform: translateX(4px);
}

.post-date {
  font-family: monospace;
  color: var(--text-muted);
  font-size: 1rem;
}

.post-title {
  font-size: 1.1rem;
  color: var(--text-color);
  transition: all 0.2s;
}

@media (max-width: 768px) {
  .page-archive {
    padding: 40px 16px;
  }

  .page-header {
    margin-bottom: 24px;
    padding: 20px 16px;
  }

  .page-title {
    font-size: 1.8rem;
  }

  .archive-container {
    grid-template-columns: 1fr;
    gap: 24px;
  }
  .year-list {
    display: flex;
    position: static;
    overflow-x: auto;
    border-bottom: 1px solid var(--glass-border);
    padding-bottom: 16px;
  }
  .year-list li {
    border-left: none;
    border-bottom: 2px solid transparent;
  }
  .year-list li.active {
    border-left: none;
    border-bottom-color: var(--primary);
  }

  .month-posts li {
    align-items: flex-start;
    gap: 10px;
  }
}

@media (max-width: 480px) {
  .month-posts li {
    flex-direction: column;
  }

  .timeline {
    padding-left: 18px;
  }

  .timeline-year::before {
    left: -25px;
  }

  .month-title::before {
    left: -22px;
  }
}
</style>
