<template>
  <div class="page-about">
    <header class="page-header">
      <h1 class="page-title">{{ siteConfig.about.title }}</h1>
      <p class="page-desc">{{ siteConfig.about.description }}</p>
    </header>

    <div class="about-container">
      <aside class="about-sidebar">
        <div class="glass-card profile-card">
          <img v-if="siteConfig.author.avatar" :src="siteConfig.author.avatar" :alt="siteConfig.author.name" class="avatar avatar-image" />
          <div v-else class="avatar"></div>
          <h2 class="name">{{ siteConfig.author.name }}</h2>
          <p class="bio">{{ siteConfig.author.bio }}</p>
          <div class="social-links">
            <a
              v-for="link in siteConfig.author.socialLinks"
              :key="link.url"
              :href="link.url"
              target="_blank"
              rel="noopener noreferrer"
              class="social-link"
            >
              {{ link.label }}
            </a>
          </div>
        </div>
      </aside>

      <div class="about-content">
        <div class="glass-card content-card markdown-body-mock">
          <div class="about-markdown markdown-body" v-html="aboutHtml"></div>

          <h2>技能栈</h2>
          <p>
            <span class="skill-tag" v-for="skill in siteConfig.about.skills" :key="skill">{{ skill }}</span>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { renderMarkdownHtml } from '../utils/markdown-renderer'
import { getContentFile, siteConfig } from '../config/site-config'

const aboutHtml = computed(() => renderMarkdownHtml(getContentFile(siteConfig.about.contentFile)))
</script>

<style scoped>
.page-about {
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

.about-container {
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: 40px;
}

.profile-card {
  padding: 40px 24px;
  text-align: center;
}

.avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: var(--bg-secondary);
  border: 3px solid var(--primary);
  margin: 0 auto 24px auto;
}

.avatar-image {
  object-fit: cover;
}

.name {
  font-size: 1.5rem;
  color: var(--text-color);
  margin: 0 0 12px 0;
}

.bio {
  color: var(--text-muted);
  margin-bottom: 24px;
}

.social-links {
  display: flex;
  gap: 16px;
  justify-content: center;
  flex-wrap: wrap;
}

.social-link {
  color: var(--primary);
  text-decoration: none;
  font-size: 0.95rem;
  border-bottom: 1px dashed var(--primary);
  padding-bottom: 2px;
}

.social-link:hover {
  color: var(--accent);
  border-bottom-color: var(--accent);
}

.content-card {
  padding: 48px;
}

.about-markdown {
  margin-bottom: 24px;
}

.markdown-body-mock h2 {
  font-size: 1.5rem;
  color: var(--primary-dark);
  margin-top: 0;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px dashed var(--glass-border);
}

.markdown-body-mock h2:not(:first-child) {
  margin-top: 40px;
}

.markdown-body-mock p,
.markdown-body-mock ul {
  color: var(--text-color);
  line-height: 1.8;
  margin-bottom: 20px;
}

.markdown-body-mock ul {
  padding-left: 20px;
}

.markdown-body-mock li {
  margin-bottom: 8px;
}

.skill-tag {
  display: inline-block;
  padding: 4px 12px;
  background: var(--bg-secondary);
  color: var(--primary-dark);
  border-radius: 20px;
  font-size: 0.9rem;
  margin-right: 12px;
  margin-bottom: 12px;
}

@media (max-width: 860px) {
  .about-container {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .page-about {
    padding: 40px 16px;
  }

  .page-header {
    margin-bottom: 24px;
    padding: 20px 16px;
  }

  .page-title {
    font-size: 1.8rem;
  }

  .profile-card,
  .content-card {
    padding: 24px 18px;
  }
}

@media (max-width: 480px) {
  .avatar {
    width: 96px;
    height: 96px;
  }

  .name {
    font-size: 1.3rem;
  }

  .skill-tag {
    margin-right: 8px;
    font-size: 0.85rem;
  }
}
</style>
