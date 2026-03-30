<template>
  <div class="pagination" v-if="totalPages > 1">
    <button class="page-btn" :disabled="current <= 1" @click="$emit('update:current', current - 1)">‹</button>

    <template v-for="p in pageNumbers" :key="p">
      <span v-if="p === '...'" class="page-ellipsis">…</span>
      <button
        v-else
        class="page-btn"
        :class="{ active: p === current }"
        @click="$emit('update:current', p)"
      >{{ p }}</button>
    </template>

    <button class="page-btn" :disabled="current >= totalPages" @click="$emit('update:current', current + 1)">›</button>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  current: { type: Number, required: true },
  totalPages: { type: Number, required: true }
})

defineEmits(['update:current'])

// Show at most 7 page buttons, with ellipsis when needed
const pageNumbers = computed(() => {
  const total = props.totalPages
  const cur = props.current
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)

  const pages = []
  if (cur <= 4) {
    pages.push(1, 2, 3, 4, 5, '...', total)
  } else if (cur >= total - 3) {
    pages.push(1, '...', total - 4, total - 3, total - 2, total - 1, total)
  } else {
    pages.push(1, '...', cur - 1, cur, cur + 1, '...', total)
  }
  return pages
})
</script>

<style scoped>
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 6px;
  padding: 32px 0 8px;
}

.page-btn {
  min-width: 36px;
  height: 36px;
  padding: 0 10px;
  border: 1px solid var(--glass-border);
  border-radius: 4px;
  background: var(--bg-color);
  color: var(--text-muted);
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.18s;
  font-family: inherit;
}

.page-btn:hover:not(:disabled) {
  border-color: var(--primary);
  color: var(--primary);
}

.page-btn.active {
  background: var(--primary);
  border-color: var(--primary);
  color: #fff;
  font-weight: 600;
}

.page-btn:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}

.page-ellipsis {
  color: var(--text-muted);
  padding: 0 4px;
  user-select: none;
}
</style>
