<template>
  <div class="app-container">
    <BackgroundScene />
    <div class="app-shell">
      <SiteHeader />
      <main class="app-main">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </main>
      <SiteFooter />
    </div>
  </div>
</template>

<script setup>
import BackgroundScene from './components/BackgroundScene.vue'
import SiteHeader from './components/SiteHeader.vue'
import SiteFooter from './components/SiteFooter.vue'
</script>

<style>
.app-container {
  position: relative;
  isolation: isolate;
  min-height: 100vh;
}

.app-shell {
  position: relative;
  z-index: 1;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-image: linear-gradient(to bottom, var(--bg-secondary) 0%, transparent 400px);
}

.app-main {
  flex: 1;
  width: 100%;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s ease, transform 0.4s ease;
}
.fade-enter-from {
  opacity: 0;
  transform: translateY(15px);
}
.fade-leave-to {
  opacity: 0;
  transform: translateY(-15px);
}
</style>
