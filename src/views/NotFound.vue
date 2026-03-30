<template>
  <div class="page-404">
    <div class="not-found-content">
      <div class="code-404">404</div>
      <h1 class="title">{{ siteConfig.notFound.title }}</h1>
      <p class="desc">{{ siteConfig.notFound.description }}</p>
      <div class="actions">
        <router-link to="/" class="btn-primary">{{ siteConfig.notFound.actionLabel }}</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { siteConfig } from '../config/site-config'
</script>

<style scoped>
.page-404 {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 200px);
  padding: 40px 24px;
}

.not-found-content {
  text-align: center;
  background: var(--card-bg);
  backdrop-filter: blur(8px);
  border: 1px solid var(--glass-border);
  padding: 60px 40px;
  border-radius: 12px;
  box-shadow: var(--shadow-sm);
  max-width: 600px;
  width: 100%;
}

.code-404 {
  font-size: 6rem;
  font-weight: 700;
  color: var(--bg-secondary);
  text-shadow: 2px 2px 4px rgba(49, 65, 39, 0.1);
  margin-bottom: 16px;
  line-height: 1;
}

.title {
  font-size: 2rem;
  color: var(--primary-dark);
  margin: 0 0 16px 0;
  letter-spacing: 2px;
}

.desc {
  font-size: 1.1rem;
  color: var(--text-muted);
  margin: 0 0 40px 0;
  line-height: 1.6;
}

.actions {
  display: flex;
  justify-content: center;
}

.btn-primary {
  display: inline-block;
  background: var(--primary);
  color: var(--bg-color);
  text-decoration: none;
  padding: 12px 32px;
  border-radius: 4px;
  font-size: 1.1rem;
  transition: opacity 0.2s, transform 0.2s;
}

.btn-primary:hover {
  opacity: 0.9;
  transform: translateY(-2px);
}
</style>
