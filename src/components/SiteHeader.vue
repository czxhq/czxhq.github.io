<template>
  <header class="site-header">
    <div class="header-inner">
      <div class="site-brand">
        <router-link to="/" @click="closeMenu">{{ siteConfig.site.title }}</router-link>
      </div>

      <nav class="site-nav desktop-nav">
        <router-link
          v-for="item in desktopItems"
          :key="item.to"
          :to="item.to"
        >
          {{ item.label }}
        </router-link>
      </nav>

      <div class="header-actions">
        <button class="search-btn" :title="siteConfig.navigation.searchButtonTitle" @click="handleSearch">
          <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
        </button>
        <button class="menu-btn" type="button" :aria-expanded="menuOpen" :aria-label="siteConfig.navigation.menuButtonLabel" @click="menuOpen = !menuOpen">
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </div>

    <transition name="mobile-nav">
      <nav v-if="menuOpen" class="site-nav mobile-nav">
        <router-link
          v-for="item in mobileItems"
          :key="item.to"
          :to="item.to"
          @click="closeMenu"
        >
          {{ item.label }}
        </router-link>
      </nav>
    </transition>
  </header>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { siteConfig } from '../config/site-config'

const router = useRouter()
const route = useRoute()
const menuOpen = ref(false)
const desktopItems = computed(() => siteConfig.navigation.items.filter((item) => item.showInHeader))
const mobileItems = computed(() => siteConfig.navigation.items.filter((item) => item.showInMobile))

function handleSearch() {
  closeMenu()
  router.push('/search')
}

function closeMenu() {
  menuOpen.value = false
}

watch(
  () => route.fullPath,
  () => {
    closeMenu()
  }
)
</script>

<style scoped>
.site-header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: color-mix(in srgb, var(--card-bg) 92%, transparent);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--glass-border);
}

.header-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
  min-height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.site-brand a {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--primary);
  text-decoration: none;
  letter-spacing: 2px;
  white-space: nowrap;
}

.site-nav {
  display: flex;
  gap: 32px;
}

.site-nav a {
  text-decoration: none;
  color: var(--text-muted);
  font-size: 0.95rem;
  transition: all 0.2s ease;
  position: relative;
}

.site-nav a:hover {
  color: var(--primary);
}

.site-nav a.router-link-active {
  color: var(--primary);
  font-weight: 500;
}

.site-nav a.router-link-active::after {
  content: '';
  position: absolute;
  bottom: -6px;
  left: 50%;
  transform: translateX(-50%);
  width: 12px;
  height: 2px;
  background: var(--accent);
  border-radius: 2px;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.search-btn,
.menu-btn {
  background: transparent;
  border: none;
  color: var(--text-muted);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  border-radius: 8px;
  transition: all 0.2s;
}

.search-btn:hover,
.menu-btn:hover {
  color: var(--primary);
  background: var(--bg-color);
}

.menu-btn {
  display: none;
  flex-direction: column;
  gap: 3px;
}

.menu-btn span {
  display: block;
  width: 18px;
  height: 2px;
  border-radius: 999px;
  background: currentColor;
}

.mobile-nav {
  display: none;
}

.mobile-nav-enter-active,
.mobile-nav-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.mobile-nav-enter-from,
.mobile-nav-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

@media (max-width: 900px) {
  .desktop-nav {
    gap: 22px;
  }
}

@media (max-width: 768px) {
  .header-inner {
    padding: 0 16px;
    min-height: 60px;
  }

  .site-brand a {
    font-size: 1.05rem;
    letter-spacing: 1px;
  }

  .desktop-nav {
    display: none;
  }

  .menu-btn {
    display: inline-flex;
  }

  .mobile-nav {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 10px;
    padding: 0 16px 16px;
  }

  .mobile-nav a {
    padding: 10px 12px;
    border: 1px solid var(--glass-border);
    border-radius: 10px;
    background: rgba(250, 247, 240, 0.82);
    text-align: center;
  }

  .mobile-nav a.router-link-active::after {
    display: none;
  }
}
</style>
