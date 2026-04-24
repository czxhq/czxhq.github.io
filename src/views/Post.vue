<template>
  <div class="page-post" v-if="post">
    <aside class="post-sidebar">
      <div class="toc-container" v-if="outline.length > 0">
        <h3 class="toc-title">{{ siteConfig.post.tocTitle }}</h3>
        <ul class="toc-list">
          <li v-for="item in outline" :key="item.slug" :class="[`level-${item.level}`, { active: activeSlug === item.slug }]">
            <a :href="`#${item.slug}`" @click="scrollTo(item.slug, $event)">{{ item.text }}</a>
          </li>
        </ul>
      </div>
      <div class="post-actions">
        <button class="action-btn" :title="siteConfig.post.backToTopTitle" @click="backToTop">↑</button>
        <button class="action-btn" :title="siteConfig.post.copyLinkTitle" @click="copyLink">⎘</button>
      </div>
    </aside>

    <article class="post-main">
      <header class="post-header">
        <div class="post-meta">
          <span class="category">{{ post.category }}</span>
          <span class="date">{{ siteConfig.post.publishedLabel }} {{ post.date }}</span>
          <span class="read-time" v-if="post.updated && post.updated !== post.date">{{ siteConfig.post.updatedLabel }} {{ post.updated }}</span>
        </div>
        <h1 class="post-title">{{ post.title }}</h1>
        <div class="post-tags" v-if="post.tags && post.tags.length">
          <span class="tag" v-for="tag in post.tags" :key="tag" @click="$router.push('/tags')">{{ tag }}</span>
        </div>
      </header>

      <div
        ref="contentRef"
        class="post-content markdown-body"
        v-html="htmlContent"
        @click="handleContentClick"
        @mouseover="handleReferenceHover"
        @mousemove="moveReferencePreview"
        @mouseleave="handleContentLeave"
      ></div>

      <div
        v-if="referencePreview.visible"
        ref="referencePreviewRef"
        class="reference-preview markdown-body"
        :style="{ left: `${referencePreview.x}px`, top: `${referencePreview.y}px` }"
        v-html="referencePreview.html"
        @wheel.stop
        @mouseleave="handleReferencePreviewLeave"
      ></div>

      <footer class="post-footer">
        <div class="post-nav">
          <div class="nav-prev">
            <span class="nav-label">{{ siteConfig.post.previousLabel }}</span>
            <router-link v-if="prevPost" :to="`/post/${prevPost.slug}`" class="nav-title">{{ prevPost.title }}</router-link>
            <span v-else class="nav-none">{{ siteConfig.post.previousEmptyLabel }}</span>
          </div>
          <div class="nav-next">
            <span class="nav-label">{{ siteConfig.post.nextLabel }}</span>
            <router-link v-if="nextPost" :to="`/post/${nextPost.slug}`" class="nav-title">{{ nextPost.title }}</router-link>
            <span v-else class="nav-none">{{ siteConfig.post.nextEmptyLabel }}</span>
          </div>
        </div>
      </footer>
    </article>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch, onUnmounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import postsData from '../data/posts.json'
import referenceIndex from '../data/reference-index.json'
import { renderMarkdownHtml } from '../utils/markdown-renderer'
import { extractOutline } from '../utils/outline'
import { formatTemplate, siteConfig, updateDocumentMetadata } from '../config/site-config'
import { withBase } from '../utils/base-url'
import { extractReferenceTargetsFromMarkdown } from '../utils/reference'

const route = useRoute()
const router = useRouter()

const post = ref(null)
const htmlContent = ref('')
const outline = ref([])
const activeSlug = ref('')
const contentRef = ref(null)
const referencePreviewRef = ref(null)
const currentReferences = ref([])
const referencePreview = ref({
  visible: false,
  html: '',
  x: 0,
  y: 0
})

const visiblePosts = postsData.filter(p => !p.draft)
const currentIndex = computed(() => visiblePosts.findIndex(p => p.slug === route.params.slug))
const prevPost = computed(() => currentIndex.value > 0 ? visiblePosts[currentIndex.value - 1] : null)
const nextPost = computed(() => (currentIndex.value >= 0 && currentIndex.value < visiblePosts.length - 1) ? visiblePosts[currentIndex.value + 1] : null)

async function loadPost() {
  const slug = route.params.slug
  const found = postsData.find(p => p.slug === slug)
  if (!found) {
    updateDocumentMetadata({
      title: siteConfig.notFound.pageTitle,
      description: siteConfig.notFound.description
    })
    router.push('/404')
    return
  }
  post.value = found
  updateDocumentMetadata({
    title: formatTemplate(siteConfig.post.pageTitleTemplate, { title: found.title }),
    description: found.summary || siteConfig.site.metadata.defaultDescription
  })
  try {
    const res = await fetch(withBase(found.source))
    if (!res.ok) throw new Error('Not found source file')
    let rawMarkdown = await res.text()

    const frontmatterRegex = /^---\r?\n([\s\S]*?)\r?\n---/
    rawMarkdown = rawMarkdown.replace(frontmatterRegex, '').trim()

    htmlContent.value = renderMarkdownHtml(rawMarkdown, found.source)
    outline.value = extractOutline(rawMarkdown)
    currentReferences.value = extractReferenceTargetsFromMarkdown(rawMarkdown, {
      post: found.slug,
      path: found.source
    })
    await nextTick()
    hydrateReferenceLabels()
  } catch (e) {
    console.error('Failed to load markdown', e)
    htmlContent.value = `<p>${siteConfig.post.loadFailedMessage}</p>`
  }
}

onMounted(() => {
  loadPost()
  window.addEventListener('scroll', scrollSpy)
})

onUnmounted(() => {
  window.removeEventListener('scroll', scrollSpy)
})

function scrollSpy() {
  if (outline.value.length === 0) return
  const headings = outline.value.map(item => document.getElementById(item.slug)).filter(Boolean)
  const scrollPos = window.scrollY + 100
  for (let i = headings.length - 1; i >= 0; i--) {
    if (headings[i] && scrollPos >= headings[i].offsetTop) {
      activeSlug.value = headings[i].id
      return
    }
  }
}

watch(() => route.params.slug, () => {
  loadPost()
})

watch([post, activeSlug], () => {
  if (post.value) {
    localStorage.setItem('bamboo_last_read', JSON.stringify({
      title: post.value.title,
      slug: post.value.slug,
      time: Date.now()
    }))
  }
}, { deep: true })

function scrollTo(slug, event) {
  event.preventDefault()
  activeSlug.value = slug
  const el = document.getElementById(slug)
  if (el) {
    const y = el.getBoundingClientRect().top + window.scrollY - 80
    window.scrollTo({ top: y })
  }
}

function handleContentClick(event) {
  const clickedElement = event.target instanceof Element ? event.target : null
  const referenceAnchor = clickedElement ? clickedElement.closest('a.reference-link') : null
  if (referenceAnchor) {
    event.preventDefault()
    const target = resolveReferenceTarget(referenceAnchor)
    if (!target) return
    if (target.duplicate) {
      console.warn(`Duplicate reference id "${target.id}" in post "${target.slug || post.value?.slug}". Jumping to the first matching block.`)
    }

    if (!target.slug || target.slug === post.value?.slug) {
      const el = document.getElementById(target.anchor)
      if (el) {
        const y = el.getBoundingClientRect().top + window.scrollY - 80
        window.scrollTo({ top: y })
      }
    } else {
      router.push(`/post/${target.slug}`).then(() => {
        setTimeout(() => {
          const el = document.getElementById(target.anchor)
          if (el) {
            const y = el.getBoundingClientRect().top + window.scrollY - 80
            window.scrollTo({ top: y })
          }
        }, 60)
      })
    }
    return
  }

  const anchor = clickedElement ? clickedElement.closest('a[href^="#"]') : null
  if (!anchor) return

  const href = anchor.getAttribute('href') || ''
  const slug = href.replace(/^#/, '').trim()
  if (!slug) return

  scrollTo(slug, event)
}

function resolveReferenceTarget(anchor) {
  const referenceId = anchor.dataset.referenceId || ''
  const referencePost = anchor.dataset.referencePost || ''

  if (!referenceId) return null

  if (!referencePost) {
    return currentReferences.value.find((target) => target.id === referenceId) || null
  }

  return referenceIndex.find(
    (target) => target.id === referenceId && target.slug === referencePost
  ) || null
}

function handleReferenceHover(event) {
  const anchor = event.target instanceof Element ? event.target.closest('a.reference-link') : null
  if (!anchor) {
    hideReferencePreview()
    return
  }

  const target = resolveReferenceTarget(anchor)
  if (!target) {
    hideReferencePreview()
    return
  }

  referencePreview.value = {
    visible: true,
    html: `<div class="reference-preview-head"><span class="reference-preview-type">${escapePreviewHtml(target.type)}</span><strong>${escapePreviewHtml(target.title)}</strong></div>${renderMarkdownHtml(target.content || '*No preview available.*', target.source || post.value?.source || '')}`,
    x: 0,
    y: 0
  }
  updateReferencePreviewPosition(event)
}

function moveReferencePreview(event) {
  if (!referencePreview.value.visible) return
  updateReferencePreviewPosition(event)
}

function handleContentLeave(event) {
  const nextTarget = event.relatedTarget
  if (referencePreviewRef.value?.contains(nextTarget)) {
    return
  }
  hideReferencePreview()
}

function handleReferencePreviewLeave(event) {
  const nextTarget = event.relatedTarget
  if (contentRef.value?.contains(nextTarget)) {
    return
  }
  hideReferencePreview()
}

function hideReferencePreview() {
  referencePreview.value.visible = false
}

function updateReferencePreviewPosition(event) {
  const offset = 18
  const margin = 16
  const previewWidth = Math.min(420, Math.max(280, Math.floor(window.innerWidth * 0.4)))
  const previewHeight = 320

  let x = event.clientX + offset
  let y = event.clientY + offset

  if (x + previewWidth > window.innerWidth - margin) {
    x = Math.max(margin, event.clientX - previewWidth - 12)
  }

  if (y + previewHeight > window.innerHeight - margin) {
    y = Math.max(margin, event.clientY - previewHeight - 12)
  }

  referencePreview.value.x = x
  referencePreview.value.y = y
}

function hydrateReferenceLabels() {
  const anchors = contentRef.value?.querySelectorAll('a.reference-link[data-reference-implicit-label="true"]')
  if (!anchors) return

  anchors.forEach((node) => {
    const anchor = node
    const target = resolveReferenceTarget(anchor)
    if (target) {
      if (target.duplicate) {
        anchor.title = `重复引用 id：${target.id}，当前默认指向第一个同 id 块`
      }
      anchor.textContent = target.title
    }
  })
}

function escapePreviewHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function copyLink() {
  navigator.clipboard.writeText(window.location.href)
  alert(siteConfig.post.copySuccessMessage)
}

function backToTop() {
  window.scrollTo({ top: 0 })
}
</script>

<style scoped>
.page-post {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 24px;
  display: flex;
  flex-direction: row-reverse;
  gap: 60px;
  align-items: flex-start;
}

.post-sidebar {
  width: 260px;
  position: sticky;
  top: 100px;
  flex-shrink: 0;
}

.toc-container {
  background: var(--card-bg);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1px solid var(--glass-border);
  border-radius: 8px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: var(--shadow-sm);
  max-height: calc(100vh - 200px);
  overflow-y: auto;
}

.toc-title {
  margin: 0 0 16px 0;
  font-size: 1.1rem;
  color: var(--primary-dark);
  border-bottom: 1px dashed var(--glass-border);
  padding-bottom: 8px;
}

.toc-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.toc-list li {
  margin-bottom: 12px;
  line-height: 1.5;
}

.toc-list a {
  color: var(--text-muted);
  text-decoration: none;
  font-size: 0.95rem;
  transition: color 0.2s;
  display: block;
}

.toc-list a:hover {
  color: var(--primary);
}

.toc-list li.active > a {
  color: var(--primary-dark);
  font-weight: 500;
  position: relative;
}

.toc-list li.active > a::before {
  content: '';
  position: absolute;
  left: -12px;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  height: 4px;
  background: var(--accent);
  border-radius: 50%;
}

.level-1 { padding-left: 0; font-weight: 600; }
.level-2 { padding-left: 12px; }
.level-3 { padding-left: 24px; font-size: 0.9rem; }
.level-4 { padding-left: 36px; font-size: 0.85rem; }

.post-actions {
  display: flex;
  gap: 12px;
}

.action-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 1px solid var(--glass-border);
  background: var(--bg-color);
  color: var(--text-muted);
  font-size: 1.2rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  box-shadow: var(--shadow-sm);
}

.action-btn:hover {
  border-color: var(--primary);
  color: var(--primary);
  transform: translateY(-2px);
}

.post-main {
  flex: 1;
  min-width: 0;
  background: var(--bg-color);
  border-radius: 12px;
  padding: 40px 48px;
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--glass-border);
}

.post-header {
  margin-bottom: 40px;
  text-align: center;
  border-bottom: 1px dashed var(--glass-border);
  padding-bottom: 32px;
}

.post-meta {
  font-size: 0.95rem;
  color: var(--text-muted);
  margin-bottom: 16px;
  display: flex;
  justify-content: center;
  gap: 16px;
}

.category {
  color: var(--accent);
  font-weight: 500;
}

.post-title {
  font-size: 2.4rem;
  color: var(--primary-dark);
  margin: 0 0 20px 0;
  line-height: 1.4;
}

.post-tags {
  display: flex;
  justify-content: center;
  gap: 12px;
}

.tag {
  font-size: 0.85rem;
  padding: 4px 12px;
  background: var(--bg-secondary);
  color: var(--text-muted);
  border-radius: 4px;
  cursor: pointer;
}

.tag:hover {
  color: var(--primary);
  border-color: var(--primary);
}

.post-content {
  color: var(--text-color);
  font-size: 1.05rem;
  line-height: 1.8;
  margin-bottom: 60px;
}

.reference-preview {
  position: fixed;
  z-index: 30;
  width: min(420px, 40vw);
  max-height: 320px;
  overflow-x: hidden;
  overflow-y: auto;
  overscroll-behavior: contain;
  pointer-events: auto;
  padding: 16px 18px;
  background: #f7f4ec;
  border: 1px solid rgba(92, 122, 58, 0.24);
  border-radius: 14px;
  box-shadow: 0 18px 40px rgba(58, 72, 34, 0.14);
}

.reference-preview :deep(.reference-preview-head) {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 14px;
}

.reference-preview :deep(.reference-preview-type) {
  display: inline-flex;
  padding: 2px 8px;
  border-radius: 999px;
  background: rgba(92, 122, 58, 0.14);
  color: var(--primary-dark);
  font-size: 11px;
  text-transform: uppercase;
}

::v-deep(.markdown-body) {
  background: transparent !important;
  color: var(--text-color) !important;
}

::v-deep(.markdown-body h1),
::v-deep(.markdown-body h2),
::v-deep(.markdown-body h3),
::v-deep(.markdown-body h4) {
  color: var(--primary-dark) !important;
  border-bottom-color: var(--glass-border) !important;
}

::v-deep(.markdown-body a) {
  color: var(--primary) !important;
}

::v-deep(.reference-link) {
  color: var(--primary-dark) !important;
  text-decoration: underline;
  text-decoration-style: dotted;
}

::v-deep(.callout-ref-duplicate) {
  border-color: rgba(180, 116, 32, 0.7) !important;
  box-shadow: 0 0 0 1px rgba(180, 116, 32, 0.14), 0 12px 32px rgba(80, 58, 22, 0.08);
}

::v-deep(.callout-ref-warning) {
  margin-left: auto;
  border-radius: 999px;
  padding: 2px 8px;
  background: rgba(180, 116, 32, 0.14);
  color: #8a5a1f;
  font-size: 12px;
}

.post-footer {
  border-top: 1px solid var(--glass-border);
  padding-top: 32px;
}

.post-nav {
  display: flex;
  justify-content: space-between;
  gap: 24px;
}

.nav-prev, .nav-next {
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
}

.nav-next {
  text-align: right;
}

.nav-label {
  font-size: 0.85rem;
  color: var(--text-muted);
}

.nav-title {
  font-size: 1.1rem;
  color: var(--primary);
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s;
}

.nav-title:hover {
  color: var(--primary-dark);
}

.nav-none {
  font-size: 1.1rem;
  color: var(--text-muted);
  opacity: 0.6;
}

@media (max-width: 1024px) {
  .page-post {
    flex-direction: column;
    gap: 24px;
  }
  .post-sidebar {
    width: 100%;
    position: static;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
  }
  .toc-container {
    display: none;
  }
}

@media (max-width: 768px) {
  .page-post {
    padding: 24px 16px 40px;
  }

  .post-sidebar {
    margin-bottom: 8px;
  }

  .post-actions {
    width: 100%;
    justify-content: flex-end;
  }

  .post-main {
    padding: 24px 16px;
    border: none;
    box-shadow: none;
    background: transparent;
  }

  .post-header {
    margin-bottom: 28px;
    padding-bottom: 24px;
  }

  .post-meta {
    flex-wrap: wrap;
    gap: 10px;
    font-size: 0.88rem;
  }

  .post-title {
    font-size: 1.8rem;
  }

  .post-tags {
    flex-wrap: wrap;
  }

  .post-content {
    margin-bottom: 36px;
  }

  .post-nav {
    flex-direction: column;
    gap: 32px;
  }

  .nav-next {
    text-align: left;
  }
}

@media (max-width: 480px) {
  .post-title {
    font-size: 1.55rem;
  }

  .action-btn {
    width: 38px;
    height: 38px;
  }
}
</style>
