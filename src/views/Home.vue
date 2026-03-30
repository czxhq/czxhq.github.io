<template>
  <div class="page-home">
    <section class="hero-section">
      <div class="hero-content">
        <h1 class="hero-title">{{ siteConfig.home.hero.title }}</h1>
        <p class="hero-subtitle">{{ siteConfig.home.hero.subtitle }}</p>
        <div class="hero-actions">
          <router-link
            v-for="action in siteConfig.home.hero.actions"
            :key="action.to"
            :to="action.to"
            :class="action.variant === 'secondary' ? 'btn-secondary' : 'btn-primary'"
          >
            {{ action.label }}
          </router-link>
        </div>
      </div>
    </section>

    <div class="home-container">
      <div class="main-content">
        <section class="featured-posts" v-if="featuredPosts.length > 0">
          <h2 class="section-title">{{ siteConfig.home.featuredTitle }}</h2>
          <div class="post-cards">
            <router-link :to="`/post/${post.slug}`" class="glass-card post-card" v-for="post in featuredPosts" :key="post.slug">
              <div class="post-meta">
                <span class="post-category">{{ post.category }}</span>
                <span class="post-date">{{ post.date }}</span>
              </div>
              <h3 class="post-title">{{ post.title }}</h3>
              <p class="post-summary">{{ post.summary }}</p>
            </router-link>
          </div>
        </section>

        <section class="latest-posts" v-if="latestPosts.length > 0">
          <h2 class="section-title">{{ siteConfig.home.latestTitle }}</h2>
          <div class="post-list">
            <router-link :to="`/post/${post.slug}`" class="post-list-item tag-route" v-for="post in latestPosts" :key="post.slug">
              <h3 class="post-list-title">{{ post.title }}</h3>
              <div class="post-list-meta">{{ post.date }} · {{ post.category }}</div>
            </router-link>
          </div>
        </section>
      </div>

      <aside class="sidebar">
        <div class="glass-card sidebar-widget author-widget">
          <img v-if="siteConfig.author.avatar" :src="siteConfig.author.avatar" :alt="siteConfig.author.name" class="author-avatar author-avatar-image" />
          <div v-else class="author-avatar"></div>
          <h3 class="author-name">{{ siteConfig.home.authorCardTitle || siteConfig.author.name }}</h3>
          <p class="author-bio">{{ siteConfig.author.bio }}</p>
        </div>

        <div class="glass-card sidebar-widget continue-reading" v-if="lastRead">
          <h3 class="widget-title">{{ siteConfig.home.continueReadingTitle }}</h3>
          <router-link :to="`/post/${lastRead.slug}`" class="last-read-link">
            <span class="last-read-title">{{ lastRead.title }}</span>
            <span class="last-read-icon">→</span>
          </router-link>
        </div>

        <div class="glass-card sidebar-widget" v-if="categoryCounts.length">
          <h3 class="widget-title">{{ siteConfig.home.categoriesTitle }}</h3>
          <ul class="widget-list">
            <li v-for="[cat, count] in categoryCounts" :key="cat" @click="$router.push('/categories')">
              <span>{{ cat }}</span> <span>({{ count }})</span>
            </li>
          </ul>
        </div>
        
        <div class="glass-card sidebar-widget" v-if="tagCounts.length">
          <h3 class="widget-title">{{ siteConfig.home.tagsTitle }}</h3>
          <div class="tag-cloud-mini">
            <span class="tag" v-for="[tag, _] in tagCounts" :key="tag" @click="$router.push('/tags')">{{ tag }}</span>
          </div>
        </div>
      </aside>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import postsData from '../data/posts.json'
import { siteConfig } from '../config/site-config'

const featuredPosts = computed(() => postsData.filter(p => !p.draft && p.featured).slice(0, 3))
const latestPosts = computed(() => postsData.filter(p => !p.draft).slice(0, 5))
const lastRead = ref(null)

onMounted(() => {
  try {
    const raw = localStorage.getItem('bamboo_last_read')
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Date.now() - parsed.time < 7 * 24 * 3600 * 1000) {
        lastRead.value = parsed
      }
    }
  } catch (e) {}
})

const tagCounts = computed(() => {
  const counts = {}
  postsData.forEach(p => {
    if (!p.draft && p.tags) {
      p.tags.forEach(t => {
        counts[t] = (counts[t] || 0) + 1
      })
    }
  })
  return Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 10)
})

const categoryCounts = computed(() => {
  const counts = {}
  postsData.forEach(p => {
    if (!p.draft && p.category) {
      counts[p.category] = (counts[p.category] || 0) + 1
    }
  })
  return Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 6)
})
</script>

<style scoped>
.page-home {
  padding-bottom: 60px;
}

.hero-section {
  padding: 80px 24px;
  text-align: center;
  position: relative;
  margin-bottom: 40px;
  border-bottom: 1px dashed var(--glass-border);
}

.hero-title {
  font-size: 3rem;
  color: var(--primary-dark);
  margin-bottom: 16px;
  letter-spacing: 4px;
}

.hero-subtitle {
  font-size: 1.2rem;
  color: var(--text-muted);
  margin-bottom: 32px;
}

.hero-actions {
  display: flex;
  gap: 16px;
  justify-content: center;
}

.btn-primary {
  display: inline-block;
  background: var(--primary);
  color: var(--bg-color);
  text-decoration: none;
  border: none;
  padding: 10px 24px;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: opacity 0.2s;
}

.btn-primary:hover {
  opacity: 0.9;
}

.btn-secondary {
  display: inline-block;
  background: transparent;
  color: var(--primary);
  text-decoration: none;
  border: 1px solid var(--primary);
  padding: 10px 24px;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-secondary:hover {
  background: rgba(92, 122, 58, 0.05);
}

.home-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 40px;
}

.section-title {
  font-size: 1.5rem;
  color: var(--primary-dark);
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.section-title::before {
  content: '';
  display: block;
  width: 4px;
  height: 18px;
  background: var(--accent);
  border-radius: 2px;
}

.featured-posts {
  margin-bottom: 60px;
}

.post-cards {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.post-card {
  padding: 24px;
  cursor: pointer;
  text-decoration: none;
  display: block;
}

.post-meta {
  font-size: 0.85rem;
  color: var(--text-muted);
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.post-category {
  color: var(--accent);
  font-weight: 500;
}

.post-title {
  font-size: 1.4rem;
  margin: 0 0 12px 0;
  color: var(--text-color);
  transition: color 0.2s;
}

.post-card:hover .post-title {
  color: var(--primary);
}

.post-summary {
  color: var(--text-muted);
  font-size: 0.95rem;
  margin: 0;
  line-height: 1.6;
}

.post-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.post-list-item {
  padding-bottom: 16px;
  border-bottom: 1px dashed var(--glass-border);
  cursor: pointer;
  text-decoration: none;
  display: block;
}

.post-list-item:hover .post-list-title {
  color: var(--primary);
}

.post-list-title {
  font-size: 1.1rem;
  margin: 0 0 8px 0;
  color: var(--text-color);
  font-weight: 500;
  transition: color 0.2s;
}

.post-list-meta {
  font-size: 0.85rem;
  color: var(--text-muted);
}

.sidebar-widget {
  padding: 24px;
  margin-bottom: 24px;
}

.author-widget {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.author-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: var(--glass-border);
  margin-bottom: 16px;
  border: 2px solid var(--primary);
}

.author-avatar-image {
  object-fit: cover;
}

.author-name {
  margin: 0 0 8px 0;
  font-size: 1.2rem;
  color: var(--primary-dark);
}

.author-bio {
  font-size: 0.9rem;
  color: var(--text-muted);
  margin: 0;
}

.widget-title {
  margin: 0 0 16px 0;
  font-size: 1.1rem;
  color: var(--text-color);
  border-bottom: 1px dashed var(--glass-border);
  padding-bottom: 8px;
}

.widget-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.widget-list li {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  font-size: 0.95rem;
  color: var(--text-muted);
  cursor: pointer;
}

.widget-list li:hover {
  color: var(--primary);
}

.tag-cloud-mini {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag {
  font-size: 0.85rem;
  padding: 4px 12px;
  background: var(--bg-color);
  border: 1px solid var(--glass-border);
  border-radius: 4px;
  color: var(--text-muted);
  cursor: pointer;
  transition: all 0.2s;
}

.tag:hover {
  border-color: var(--primary);
  color: var(--primary);
}

@media (max-width: 860px) {
  .home-container {
    grid-template-columns: 1fr;
  }

  .sidebar {
    order: -1;
  }
}

@media (max-width: 768px) {
  .page-home {
    padding-bottom: 40px;
  }

  .hero-section {
    padding: 56px 16px 40px;
    margin-bottom: 24px;
  }

  .hero-title {
    font-size: 2.2rem;
    letter-spacing: 2px;
  }

  .hero-subtitle {
    font-size: 1rem;
    line-height: 1.8;
  }

  .hero-actions {
    flex-direction: column;
    align-items: stretch;
    max-width: 280px;
    margin: 0 auto;
  }

  .btn-primary,
  .btn-secondary {
    width: 100%;
    text-align: center;
  }

  .home-container {
    padding: 0 16px;
    gap: 24px;
  }

  .section-title {
    font-size: 1.3rem;
    margin-bottom: 18px;
  }

  .post-card,
  .sidebar-widget {
    padding: 18px;
  }

  .post-title {
    font-size: 1.2rem;
  }
}

@media (max-width: 480px) {
  .hero-title {
    font-size: 1.9rem;
  }

  .author-avatar {
    width: 68px;
    height: 68px;
  }

  .tag-cloud-mini {
    gap: 6px;
  }

  .tag {
    padding: 4px 10px;
  }
}
</style>
