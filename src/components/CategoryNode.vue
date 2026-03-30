<template>
  <div class="category-node">
    <div 
      class="node-header" 
      :class="{ active: activeCategory === node.path }"
      @click="toggleAndSelect"
    >
      <span class="node-arrow" :class="{ expanded, hidden: !node.children.length }" @click.stop="expanded = !expanded">
        <svg v-if="node.children.length" viewBox="0 0 16 16" width="14" height="14" fill="currentColor">
          <path d="M6 4l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
        </svg>
      </span>
      <span class="node-name">{{ node.name }}</span>
      <span class="node-count">{{ node.totalCount }}</span>
    </div>
    
    <div class="node-children" v-show="expanded && node.children.length">
      <div class="children-line"></div>
      <CategoryNode 
        v-for="child in node.children" 
        :key="child.path" 
        :node="child"
        :activeCategory="activeCategory"
        @select="$emit('select', $event)"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: 'CategoryNode'
}
</script>

<script setup>
import { ref } from 'vue'
const props = defineProps({
  node: Object,
  activeCategory: String
})
const emit = defineEmits(['select'])

const expanded = ref(false)

function toggleAndSelect() {
  if (props.node.children.length) {
    expanded.value = true
  }
  emit('select', props.node.path)
}
</script>

<style scoped>
.category-node {
  font-size: 0.95rem;
  margin-bottom: 2px;
}
.node-header {
  display: flex;
  align-items: center;
  padding: 8px 10px;
  cursor: pointer;
  border-radius: 6px;
  transition: background 0.2s;
  color: var(--text-color);
  gap: 8px;
}
.node-header:hover {
  background: var(--bg-secondary);
}
.node-header.active {
  background: color-mix(in srgb, var(--primary) 10%, transparent);
  color: var(--primary-dark);
  font-weight: 500;
}
.node-arrow {
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-muted);
  transition: transform 0.2s;
  cursor: pointer;
  opacity: 0.6;
}
.node-arrow:hover {
  opacity: 1;
}
.node-arrow.expanded {
  transform: rotate(90deg);
}
.node-arrow.hidden {
  visibility: hidden;
}
.node-name {
  flex: 1;
}
.node-count {
  font-size: 0.75em;
  background: var(--bg-secondary);
  color: var(--text-muted);
  border-radius: 12px;
  padding: 2px 7px;
  min-width: 20px;
  text-align: center;
}
.node-header.active .node-count {
  background: color-mix(in srgb, var(--primary) 20%, transparent);
  color: var(--primary-dark);
}
.node-children {
  padding-left: 20px;
  position: relative;
  margin-top: 4px;
}
.children-line {
  position: absolute;
  left: 15px;
  top: 0;
  bottom: 8px;
  width: 1px;
  background: var(--glass-border);
}

@media (max-width: 768px) {
  .category-node {
    font-size: 1rem;
  }

  .node-header {
    padding: 10px 12px;
  }
}
</style>
