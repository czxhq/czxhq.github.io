import MarkdownIt from 'markdown-it'
import texmath from 'markdown-it-texmath'
import markPlugin from 'markdown-it-mark'
import taskListsPlugin from 'markdown-it-task-lists'
import katex from 'katex'
import hljs from 'highlight.js'
import { full as emoji } from 'markdown-it-emoji'
import { calloutPlugin, githubAlertsPlugin, tocPlugin } from './markdown-plugin'
import { withBase } from './base-url'

const copyIcon = `<svg class="copy-icon" viewBox="0 0 16 16" width="16" height="16" fill="currentColor"><path d="M0 6.75C0 5.784.784 5 1.75 5h1.5a.75.75 0 0 1 0 1.5h-1.5a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-1.5a.75.75 0 0 1 1.5 0v1.5A1.75 1.75 0 0 1 9.25 16h-7.5A1.75 1.75 0 0 1 0 14.25Z"></path><path d="M5 1.75C5 .784 5.784 0 6.75 0h7.5C15.216 0 16 .784 16 1.75v7.5A1.75 1.75 0 0 1 14.25 11h-7.5A1.75 1.75 0 0 1 5 9.25Zm1.75-.25a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-7.5a.25.25 0 0 0-.25-.25Z"></path></svg>`

const exportStyles = `
body {
  margin: 0;
  min-height: 100vh;
  color: #24292f;
  background: #ffffff;
  line-height: 1.6;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  box-sizing: border-box;
}
*, *::before, *::after {
  box-sizing: inherit;
}
.markdown-body, .milkdown-wrapper {
  color: #24292f;
  font-size: 16px;
  line-height: 1.75;
  word-wrap: break-word;
  max-width: 850px;
  margin: 0 auto;
  padding: 40px;
}
.markdown-body h1, .milkdown-wrapper h1,
.markdown-body h2, .milkdown-wrapper h2,
.markdown-body h3, .milkdown-wrapper h3,
.markdown-body h4, .milkdown-wrapper h4,
.markdown-body h5, .milkdown-wrapper h5,
.markdown-body h6, .milkdown-wrapper h6 {
  margin-top: 24px;
  margin-bottom: 16px;
  font-weight: 600;
  line-height: 1.25;
  color: #111827;
}
.markdown-body h1, .milkdown-wrapper h1 {
  font-size: 2.25em;
  padding-bottom: 0.3em;
  border-bottom: 1px solid #e5e7eb;
}
.markdown-body h2, .milkdown-wrapper h2 {
  font-size: 1.75em;
  padding-bottom: 0.3em;
  border-bottom: 1px solid #e5e7eb;
}
.markdown-body p, .milkdown-wrapper p,
.markdown-body blockquote, .milkdown-wrapper blockquote,
.markdown-body ul, .milkdown-wrapper ul,
.markdown-body ol, .milkdown-wrapper ol,
.markdown-body dl, .milkdown-wrapper dl,
.markdown-body table, .milkdown-wrapper table,
.markdown-body pre, .milkdown-wrapper pre,
.markdown-body details, .milkdown-wrapper details {
  margin-top: 0;
  margin-bottom: 16px;
}
.markdown-body strong, .milkdown-wrapper strong,
.markdown-body b, .milkdown-wrapper b {
  font-weight: 700;
  color: #111827;
}
.markdown-body mark, .milkdown-wrapper mark {
  background-color: #fef08a;
  color: #854d0e;
  padding: 0.1em 0.3em;
  border-radius: 4px;
}
.markdown-body blockquote, .milkdown-wrapper blockquote {
  padding: 0 1em;
  color: #6b7280;
  border-left: 0.25em solid #d1d5db;
  background: #f9fafb;
  margin-left: 0;
  margin-right: 0;
  border-radius: 0 4px 4px 0;
  padding-top: 0.5em;
  padding-bottom: 0.5em;
}
.markdown-body code, .milkdown-wrapper code {
  padding: 0.2em 0.4em;
  margin: 0;
  font-size: 85%;
  background-color: #f3f4f6;
  color: #cf222e; /* Sync with refined red/pink */
  border-radius: 4px;
  font-family: ui-monospace, SFMono-Regular, SF Mono, Menlo, Consolas, Liberation Mono, monospace;
}
.markdown-body table, .milkdown-wrapper table {
  border-collapse: collapse;
  width: 100%;
  margin-bottom: 24px;
  border-spacing: 0;
}
.markdown-body table th, .milkdown-wrapper table th {
  font-weight: 600;
  background-color: #f9fafb;
  border-bottom: 2px solid #e5e7eb;
  padding: 12px 16px;
  text-align: left;
}
.markdown-body table td, .milkdown-wrapper table td {
  border-bottom: 1px solid #e5e7eb;
  padding: 12px 16px;
  color: #4b5563;
}
.markdown-body pre, .milkdown-wrapper pre {
  padding: 16px;
  overflow: auto;
  font-size: 85%;
  line-height: 1.45;
  background-color: #f6f8fa; /* Light grey for premium look */
  color: #1f2328;
  border: 1px solid #d0d7de;
  border-radius: 6px;
  position: relative;
  margin: 24px 0;
}
.markdown-body pre::before, .milkdown-wrapper pre::before {
  content: attr(data-language);
  display: block;
  font-family: 'Inter', sans-serif;
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #6e7781;
  margin-bottom: 12px;
  font-weight: 700;
  user-select: none;
}
.markdown-body pre:not([data-language])::before, .milkdown-wrapper pre:not([data-language])::before {
  content: 'TEXT';
}
.markdown-body pre code, .milkdown-wrapper pre code {
  display: inline;
  max-width: auto;
  padding: 0;
  margin: 0;
  overflow: visible;
  line-height: inherit;
  word-wrap: normal;
  background: transparent;
  color: #1f2328;
  border: 0;
}
.markdown-body pre .code-copy-btn,
.milkdown-wrapper pre .code-copy-btn {
  position: absolute;
  top: 8px;
  right: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  padding: 0;
  border: 1px solid #d0d7de;
  border-radius: 6px;
  background-color: #ffffff;
  color: #6e7781;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.15s ease, background-color 0.15s ease, color 0.15s ease;
  z-index: 1;
}
.markdown-body pre:hover .code-copy-btn,
.milkdown-wrapper pre:hover .code-copy-btn {
  opacity: 1;
}
.markdown-body pre .code-copy-btn:hover,
.milkdown-wrapper pre .code-copy-btn:hover {
  background-color: #f3f4f6;
  border-color: #6e7781;
  color: #24292f;
}
.markdown-body pre .code-copy-btn.copied,
.milkdown-wrapper pre .code-copy-btn.copied {
  color: #3fb950;
  border-color: rgba(63, 185, 80, 0.4);
  opacity: 1;
}
.markdown-body pre .code-copy-btn svg,
.milkdown-wrapper pre .code-copy-btn svg {
  width: 16px;
  height: 16px;
}
.markdown-body a, .milkdown-wrapper a {
  color: #0969da;
  text-decoration: none;
}
.markdown-body a:hover, .milkdown-wrapper a:hover {
  text-decoration: underline;
}
.markdown-body img, .milkdown-wrapper img {
  max-width: 100%;
  box-sizing: content-box;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}
.markdown-body video, .milkdown-wrapper video {
  display: block;
  width: 100%;
  max-width: 100%;
  margin: 24px auto;
  border-radius: 12px;
  background: #000;
  box-shadow: 0 12px 32px rgba(15, 23, 42, 0.16);
}
.toc-block {
  margin: 24px 0 32px;
  padding: 18px 20px;
  border: 1px solid #dbe3ec;
  border-radius: 12px;
  background: linear-gradient(180deg, #fbfdff 0%, #f3f8fc 100%);
}
.toc-title {
  margin-bottom: 12px;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #3b4b5c;
}
.toc-list {
  margin: 0;
  padding-left: 0;
  list-style: none;
}
.toc-item {
  margin: 6px 0;
}
.toc-item a {
  color: #0f4c75;
  text-decoration: none;
}
.toc-item a:hover {
  text-decoration: underline;
}
.toc-item.level-1 { padding-left: 0; font-weight: 700; }
.toc-item.level-2 { padding-left: 14px; font-weight: 600; }
.toc-item.level-3 { padding-left: 28px; }
.toc-item.level-4 { padding-left: 42px; color: #475569; }
.toc-item.level-5 { padding-left: 56px; color: #64748b; }
.toc-item.level-6 { padding-left: 70px; color: #64748b; }
.toc-empty {
  margin: 0;
  color: #64748b;
}
.markdown-body .katex,
.milkdown-wrapper .katex {
  font-size: 1.05em;
}
.markdown-body .katex-mathml,
.milkdown-wrapper .katex-mathml {
  position: static !important;
  width: auto !important;
  height: auto !important;
  overflow: visible !important;
  clip: auto !important;
  clip-path: none !important;
  white-space: normal !important;
}
.markdown-body .katex-html,
.milkdown-wrapper .katex-html {
  display: none !important;
}
.markdown-body .katex-display,
.milkdown-wrapper .katex-display {
  display: block;
  margin: 1.25em 0;
  overflow-x: auto;
  overflow-y: hidden;
}
.markdown-body math,
.milkdown-wrapper math {
  font-size: 1.05em;
}
.callout {
  margin: 24px 0;
  border-radius: 10px;
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-left-width: 5px;
  font-size: 15px;
  line-height: 1.6;
  position: relative;
  overflow: hidden;
  background-color: #fcfcfc;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
  transition: all 0.2s ease;
}
.callout:hover {
  transform: translateY(-1px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
  border-color: rgba(0, 0, 0, 0.12);
}
.callout-header {
  display: flex;
  align-items: center;
  padding: 12px 20px;
  font-weight: 600;
  border-bottom: 1px solid rgba(0, 0, 0, 0.04);
  gap: 10px;
}
.callout-icon {
  font-size: 1.2em;
  display: flex;
  align-items: center;
  justify-content: center;
}
.callout-title {
  color: #1a1a1a;
  letter-spacing: -0.01em;
  font-size: 0.95em;
}
.callout-content {
  padding: 16px 20px;
}
.callout-content > *:first-child {
  margin-top: 0 !important;
}
.callout-content > *:last-child {
  margin-bottom: 0 !important;
}
.callout-note { border-left-color: #3b82f6; background: #f8fbff; }
.callout-note .callout-header { background: #eff6ff; color: #1e40af; }
.callout-warning { border-left-color: #f59e0b; background: #fffdf5; }
.callout-warning .callout-header { background: #fef3c7; color: #92400e; }
.callout-tip { border-left-color: #10b981; background: #f9fefb; }
.callout-tip .callout-header { background: #ecfdf5; color: #065f46; }
.callout-important { border-left-color: #8b5cf6; background: #faf9ff; }
.callout-important .callout-header { background: #f5f3ff; color: #5b21b6; }
.callout-caution { border-left-color: #ef4444; background: #fffafb; }
.callout-caution .callout-header { background: #fef2f2; color: #991b1b; }
.callout-example { border-left-color: #64748b; background: #fbfcfd; }
.callout-example .callout-header { background: #f8fafc; color: #334155; }
.callout-fold {
  border-left-color: #a855f7;
  border-color: rgba(168, 85, 247, 0.15);
}
.callout-fold .callout-header {
  background-color: #faf5ff;
  cursor: pointer;
  user-select: none;
}
.callout-fold summary::-webkit-details-marker {
  display: none;
}
.callout-fold .callout-header::after {
  content: '▼';
  margin-left: auto;
  font-size: 0.75em;
  transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  opacity: 0.4;
}
.callout-fold[open] .callout-header::after {
  transform: rotate(180deg);
}
.export-note {
  margin-top: 10px;
  padding: 10px 12px;
  border-radius: 8px;
  background: #f6f8fa;
  color: #57606a;
  font-size: 13px;
}
.export-video {
  margin: 24px 0;
  border: 1px solid #d0d7de;
  border-radius: 12px;
  overflow: hidden;
  background: #f8fafc;
}
.export-video-poster {
  display: block;
  width: 100%;
  max-height: 420px;
  object-fit: contain;
  background: #111827;
}
.export-video-meta {
  padding: 16px 18px;
}
.export-video-meta h3 {
  margin: 0 0 10px;
  font-size: 18px;
}
.export-video-meta p {
  margin: 6px 0;
}
.export-video-label {
  font-weight: 600;
  color: #334155;
}
.markdown-body ul.contains-task-list,
.milkdown-wrapper ul.contains-task-list {
  list-style: none;
  padding-left: 0;
}
.markdown-body .task-list-item,
.milkdown-wrapper .task-list-item {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding-left: 0;
  margin-bottom: 4px;
  line-height: 1.6;
}
.markdown-body .task-list-item input[type="checkbox"],
.milkdown-wrapper .task-list-item input[type="checkbox"] {
  appearance: none;
  -webkit-appearance: none;
  flex-shrink: 0;
  width: 16px;
  height: 16px;
  margin: 3px 0 0 0;
  border: 1.5px solid #8b949e;
  border-radius: 3px;
  background: #ffffff;
  cursor: default;
  position: relative;
  transition: background-color 0.1s ease, border-color 0.1s ease;
}
.markdown-body .task-list-item input[type="checkbox"]:checked,
.milkdown-wrapper .task-list-item input[type="checkbox"]:checked {
  background-color: #1a7f37;
  border-color: #1a7f37;
}
.markdown-body .task-list-item input[type="checkbox"]:checked::after,
.milkdown-wrapper .task-list-item input[type="checkbox"]:checked::after {
  content: '';
  position: absolute;
  inset: 0;
  background-color: #ffffff;
  mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath fill='white' d='M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.75.75 0 0 1 1.06-1.06L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0z'/%3E%3C/svg%3E");
  mask-size: 12px;
  mask-repeat: no-repeat;
  mask-position: center;
  -webkit-mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath fill='white' d='M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.75.75 0 0 1 1.06-1.06L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0z'/%3E%3C/svg%3E");
  -webkit-mask-size: 12px;
  -webkit-mask-repeat: no-repeat;
  -webkit-mask-position: center;
}
.markdown-body .task-list-item label,
.milkdown-wrapper .task-list-item label {
  cursor: default;
  user-select: text;
}
.markdown-body .task-list-item.task-list-item-checked > label,
.milkdown-wrapper .task-list-item.task-list-item-checked > label {
  color: #6e7681;
  text-decoration: line-through;
  text-decoration-color: #8b949e;
}
.gh-alert {
  padding: 12px 16px;
  margin: 16px 0;
  border-radius: 6px;
  border: 1px solid transparent;
  border-left-width: 4px;
  font-size: 15px;
  line-height: 1.6;
}
.gh-alert > *:last-child {
  margin-bottom: 0;
}
.gh-alert-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  font-size: 14px;
  margin: 0 0 8px 0 !important;
}
.gh-alert-title svg {
  flex-shrink: 0;
}
.gh-alert-note {
  background-color: #dbeafe;
  border-color: #3b82f6;
  color: #1e3a5f;
}
.gh-alert-note .gh-alert-title { color: #1d4ed8; }
.gh-alert-note .gh-alert-title svg { fill: #1d4ed8; }
.gh-alert-tip {
  background-color: #dcfce7;
  border-color: #22c55e;
  color: #14532d;
}
.gh-alert-tip .gh-alert-title { color: #16a34a; }
.gh-alert-tip .gh-alert-title svg { fill: #16a34a; }
.gh-alert-important {
  background-color: #ede9fe;
  border-color: #8b5cf6;
  color: #3b0764;
}
.gh-alert-important .gh-alert-title { color: #7c3aed; }
.gh-alert-important .gh-alert-title svg { fill: #7c3aed; }
.gh-alert-warning {
  background-color: #fef9c3;
  border-color: #eab308;
  color: #713f12;
}
.gh-alert-warning .gh-alert-title { color: #a16207; }
.gh-alert-warning .gh-alert-title svg { fill: #a16207; }
.gh-alert-caution {
  background-color: #fee2e2;
  border-color: #ef4444;
  color: #7f1d1d;
}
.gh-alert-caution .gh-alert-title { color: #dc2626; }
.gh-alert-caution .gh-alert-title svg { fill: #dc2626; }

/* Inlined Syntax Highlighting (GitHub Light) */
.hljs { color: #24292e; }
.hljs-doctag, .hljs-keyword, .hljs-meta .hljs-keyword, .hljs-template-tag, .hljs-template-variable, .hljs-type, .hljs-variable.language_ { color: #d73a49; }
.hljs-title, .hljs-title.class_, .hljs-title.class_.inherited__, .hljs-title.function_ { color: #6f42c1; }
.hljs-attr, .hljs-attribute, .hljs-literal, .hljs-meta, .hljs-number, .hljs-operator, .hljs-variable, .hljs-selector-attr, .hljs-selector-class, .hljs-selector-id { color: #005cc5; }
.hljs-regexp, .hljs-string, .hljs-meta .hljs-string { color: #032f62; }
.hljs-built_in, .hljs-symbol { color: #e36209; }
.hljs-comment, .hljs-code, .hljs-formula { color: #6a737d; }
.hljs-name, .hljs-quote, .hljs-selector-tag, .hljs-selector-subst { color: #22863a; }
.hljs-subst { color: #24292e; }
.hljs-section { color: #005cc5; font-weight: bold; }
.hljs-bullet { color: #735c0f; }
.hljs-emphasis { font-style: italic; }
.hljs-strong { font-weight: bold; }
.hljs-addition { color: #22863a; background-color: #f0fff4; }
.hljs-deletion { color: #b31d28; background-color: #ffeef0; }
`

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/<[^>]+>/g, '')
    .replace(/[^\w\u4e00-\u9fff\- ]/g, '')
    .trim()
    .replace(/\s+/g, '-')
}

export function resolveAssetUrl(src: string, notePath: string | null): string {
  if (!src || /^(https?:\/\/|data:|file:\/\/|blob:)/i.test(src)) {
    return src
  }

  // In the web blog, notes live under /posts/... and assets should remain web paths.
  if (notePath && notePath.startsWith('/')) {
    if (src.startsWith('/')) {
      return withBase(src)
    }

    const noteDir = notePath.substring(0, notePath.lastIndexOf('/') + 1)
    try {
      const resolved = new URL(src, `https://blog.local${noteDir}`).pathname
      return withBase(resolved)
    } catch {
      return withBase(`${noteDir}${src}`.replace(/\/+/g, '/'))
    }
  }

  if (/^[a-zA-Z]:[\\/]/.test(src)) {
    return 'file:///' + encodeURI(src.replace(/\\/g, '/'))
  }

  if (!notePath) {
    return src
  }

  const normalizedNotePath = notePath.replace(/\\/g, '/')
  const noteDir = normalizedNotePath.substring(0, normalizedNotePath.lastIndexOf('/'))
  const fullPath = src.startsWith('/') ? noteDir + src : noteDir + '/' + src
  return 'file:///' + encodeURI(fullPath)
}

function normalizeEmbeddedMedia(html: string, notePath: string | null): string {
  const parser = new DOMParser()
  const doc = parser.parseFromString(html, 'text/html')
  const mediaNodes = doc.querySelectorAll('img[src], video[src], video[poster], source[src]')

  mediaNodes.forEach((node) => {
    if (node instanceof HTMLImageElement || node instanceof HTMLSourceElement) {
      const src = node.getAttribute('src') || ''
      node.src = resolveAssetUrl(src, notePath)
      return
    }

    if (node instanceof HTMLVideoElement) {
      const src = node.getAttribute('src')
      const poster = node.getAttribute('poster')
      if (src) node.src = resolveAssetUrl(src, notePath)
      if (poster) node.poster = resolveAssetUrl(poster, notePath)
    }
  })

  return doc.body.innerHTML
}

function createMarkdownIt(notePath: string | null): MarkdownIt {
  const md = new MarkdownIt({
    html: true,
    breaks: true,
    highlight(str, lang) {
      if (lang && hljs.getLanguage(lang)) {
        try {
          return hljs.highlight(str, { language: lang }).value
        } catch {
          return ''
        }
      }
      return ''
    }
  })

  md.renderer.rules.fence = function (tokens, idx, options) {
    const token = tokens[idx]
    const info = token.info ? token.info.trim() : ''
    const langName = info ? info.split(/\s+/)[0] : ''
    const highlighted = options.highlight
      ? options.highlight(token.content, langName, '') || md.utils.escapeHtml(token.content)
      : md.utils.escapeHtml(token.content)

    const dataLangAttr = langName ? ` data-language="${md.utils.escapeHtml(langName).toUpperCase()}"` : ''
    const classAttr = langName ? ` class="language-${md.utils.escapeHtml(langName)} hljs"` : ' class="hljs"'
    const copyBtn = `<button class="code-copy-btn" title="Copy code">${copyIcon}</button>`

    return `<pre${dataLangAttr}>${copyBtn}<code${classAttr}>${highlighted}</code></pre>\n`
  }

  md.renderer.rules.code_block = function (tokens, idx) {
    const token = tokens[idx]
    const escaped = md.utils.escapeHtml(token.content)
    const copyBtn = `<button class="code-copy-btn" title="Copy code">${copyIcon}</button>`
    return `<pre>${copyBtn}<code class="hljs">${escaped}</code></pre>\n`
  }

  md.renderer.rules.heading_open = function (tokens, idx, options, _env, self) {
    const token = tokens[idx]
    const inlineToken = tokens[idx + 1]
    if (inlineToken && inlineToken.children) {
      const text = inlineToken.children.map((t) => t.content).join('')
      token.attrSet('id', slugify(text))
    }
    return self.renderToken(tokens, idx, options)
  }

  const defaultImageRender =
    md.renderer.rules.image ||
    function (tokens, idx, options, _env, self) {
      return self.renderToken(tokens, idx, options)
    }

  md.renderer.rules.image = function (tokens, idx, options, env, self) {
    const token = tokens[idx]
    const srcIndex = token.attrIndex('src')
    if (srcIndex >= 0) {
      const src = token.attrs![srcIndex][1]
      token.attrs![srcIndex][1] = resolveAssetUrl(src, notePath)
    }
    return defaultImageRender(tokens, idx, options, env, self)
  }

  const defaultLinkRender =
    md.renderer.rules.link_open ||
    function (tokens, idx, options, _env, self) {
      return self.renderToken(tokens, idx, options)
    }

  md.renderer.rules.link_open = function (tokens, idx, options, env, self) {
    const token = tokens[idx]
    const hrefIndex = token.attrIndex('href')

    if (hrefIndex >= 0) {
      const href = token.attrs![hrefIndex][1] || ''
      if (!href.startsWith('#')) {
        token.attrSet('target', '_blank')
        token.attrSet('rel', 'noopener noreferrer')
      }
    }

    return defaultLinkRender(tokens, idx, options, env, self)
  }

  md.use(texmath, {
    engine: katex,
    delimiters: 'dollars',
    katexOptions: { macros: { '\\RR': '\\mathbb{R}' } }
  })
  md.use(markPlugin)
  md.use(calloutPlugin)
  md.use(tocPlugin)
  md.use(taskListsPlugin, { enabled: true, label: true, labelAfter: true })
  md.use(githubAlertsPlugin)
  md.use(emoji)

  return md
}

export function renderMarkdownHtml(content: string, notePath: string | null): string {
  const md = createMarkdownIt(notePath)
  return normalizeEmbeddedMedia(md.render(content || ''), notePath)
}

export function createExportMarkup(
  renderedHtml: string,
  notePath: string | null,
  mode: 'html' | 'pdf'
): string {
  const parser = new DOMParser()
  const doc = parser.parseFromString(renderedHtml, 'text/html')

  doc.querySelectorAll('button.code-copy-btn').forEach((node) => node.remove())

  if (mode === 'pdf') {
    doc.querySelectorAll('details.callout-fold').forEach((details) => {
      details.setAttribute('open', 'true')
      const note = doc.createElement('div')
      note.className = 'export-note'
      note.textContent = 'Exported from a collapsible callout. Content has been expanded for PDF.'
      details.appendChild(note)
    })

    doc.querySelectorAll('video').forEach((video) => {
      const wrapper = doc.createElement('section')
      wrapper.className = 'export-video'

      const poster = video.getAttribute('poster')
      if (poster) {
        const image = doc.createElement('img')
        image.className = 'export-video-poster'
        image.src = poster
        image.alt = video.getAttribute('title') || 'Video poster'
        wrapper.appendChild(image)
      }

      const meta = doc.createElement('div')
      meta.className = 'export-video-meta'

      const title = doc.createElement('h3')
      title.textContent = video.getAttribute('title') || 'Embedded Video'
      meta.appendChild(title)

      const srcText = video.getAttribute('src') || ''
      const source = doc.createElement('p')
      source.innerHTML = `<span class="export-video-label">Source:</span> ${srcText || 'Unavailable'}`
      meta.appendChild(source)

      const options = doc.createElement('p')
      options.innerHTML = `<span class="export-video-label">Playback:</span> ${video.hasAttribute('autoplay') ? 'Autoplay' : 'Manual'} / ${video.hasAttribute('muted') ? 'Muted' : 'Audio on'}`
      meta.appendChild(options)

      const note = doc.createElement('p')
      note.textContent =
        'The original document contains a playable video. PDF export preserves the source and playback settings, and uses the poster image when available.'
      meta.appendChild(note)

      wrapper.appendChild(meta)
      video.replaceWith(wrapper)
    })
  }

  doc.querySelectorAll('img[src], source[src], video[src], video[poster]').forEach((node) => {
    if (node instanceof HTMLImageElement || node instanceof HTMLSourceElement) {
      const src = node.getAttribute('src')
      if (src) node.src = resolveAssetUrl(src, notePath)
      return
    }

    if (node instanceof HTMLVideoElement) {
      const src = node.getAttribute('src')
      const poster = node.getAttribute('poster')
      if (src) node.src = resolveAssetUrl(src, notePath)
      if (poster) node.poster = resolveAssetUrl(poster, notePath)
    }
  })

  return doc.body.innerHTML
}

export function buildExportDocument(title: string, bodyHtml: string): string {
  return `<!doctype html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${escapeHtml(title)}</title>
    <style>${exportStyles}</style>
  </head>
  <body>
    <article class="markdown-body">
      ${bodyHtml}
    </article>
  </body>
</html>`
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}
