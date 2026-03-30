<template>
  <footer class="site-footer">
    <div class="footer-inner">
      <div class="copyright">
        &copy; {{ new Date().getFullYear() }} {{ siteConfig.footer.copyrightName }}
      </div>
      <div class="powered-by">
        {{ siteConfig.footer.poweredBy }}
      </div>
    </div>
  </footer>
</template>

<script setup>
import { siteConfig } from '../config/site-config'
</script>

<style scoped>
.site-footer {
  margin-top: auto;
  padding: 40px 24px;
  background: var(--bg-secondary);
  border-top: 1px solid var(--glass-border);
  color: var(--text-muted);
  font-size: 0.85rem;
  text-align: center;
}

.footer-inner {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: center;
}

@media (max-width: 768px) {
  .site-footer {
    padding: 28px 16px;
  }

  .footer-inner {
    gap: 6px;
  }
}
</style>
