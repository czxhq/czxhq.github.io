import { extractOutline } from './outline'
import {
  buildReferenceAnchorId,
  isReferenceableCalloutType,
  parseCalloutMetadata,
  parseInlineReferencePayload
} from './reference'

const CALLOUT_CONFIG: Record<string, { title: string; icon: string }> = {
  note: { title: 'Note', icon: '馃摑' },
  warning: { title: 'Warning', icon: '鈿狅笍' },
  tip: { title: 'Tip', icon: '馃挕' },
  important: { title: 'Important', icon: '馃拵' },
  caution: { title: 'Caution', icon: '馃敟' },
  example: { title: 'Example', icon: '馃殌' },
  fold: { title: 'Folded Content', icon: '鉃★笍' },
  lemma: { title: '引理', icon: '∵' },
  definition: { title: '定义', icon: '≝' },
  theorem: { title: '定理', icon: '∴' }
}

function parseMetadata(str: string): Record<string, any> {
  if (!str) return {}
  const trimmed = str.trim()

  if (trimmed === '{}' || trimmed === '{ }') {
    return {}
  }

  try {
    // Attempt JSON / loose object first.
    const jsonStr = trimmed
      .replace(/([{,]\s*)([A-Za-z_]\w*)\s*:/g, '$1"$2":')
      .replace(/:\s*'([^']*)'/g, ':"$1"')
    return JSON.parse(jsonStr)
  } catch (e) {
    try {
      // Support attribute-style syntax:
      // {title="Custom", icon="馃崈"} or {title:'Custom'} or {title=Custom}
      const body = trimmed.replace(/^\{\s*|\s*\}$/g, '')
      if (!body) return {}

      const metadata: Record<string, any> = {}
      const pairRegex =
        /([A-Za-z_]\w*)\s*(?:=|:)\s*(?:"([^"]*)"|'([^']*)'|([^\s,}]+))/g

      let match: RegExpExecArray | null
      while ((match = pairRegex.exec(body)) !== null) {
        const [, key, doubleQuoted, singleQuoted, bareValue] = match
        metadata[key] = doubleQuoted ?? singleQuoted ?? bareValue ?? ''
      }

      if (Object.keys(metadata).length > 0) {
        return metadata
      }
    } catch {
      // Fall through to warning below.
    }

    console.error('Failed to parse callout metadata:', str, e)
    return {}
  }
}

export function tocPlugin(md: any) {
  md.core.ruler.push('inline_toc', (state: any) => {
    const outline = extractOutline(state.src || '')
    const tokens = state.tokens

    for (let i = 0; i < tokens.length - 2; i++) {
      const open = tokens[i]
      const inline = tokens[i + 1]
      const close = tokens[i + 2]

      if (
        open.type !== 'paragraph_open' ||
        inline.type !== 'inline' ||
        close.type !== 'paragraph_close'
      ) {
        continue
      }

      const marker = (inline.content || '').trim().toLowerCase()
      if (marker !== '[toc]') {
        continue
      }

      const tocHtml = renderTocHtml(outline)
      tokens.splice(
        i,
        3,
        Object.assign(new state.Token('html_block', '', 0), {
          block: true,
          content: tocHtml
        })
      )
    }
  })
}

function renderTocHtml(outline: Array<{ level: number; text: string; slug: string }>): string {
  if (!outline.length) {
    return '<nav class="toc-block"><div class="toc-title">Table of Contents</div><p class="toc-empty">No headings available.</p></nav>'
  }

  const items = outline
    .map(
      (item) =>
        `<li class="toc-item level-${item.level}"><a href="#${item.slug}">${escapeHtml(item.text)}</a></li>`
    )
    .join('')

  return `<nav class="toc-block"><div class="toc-title">Table of Contents</div><ol class="toc-list">${items}</ol></nav>`
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

export function calloutPlugin(md: any) {
  md.block.ruler.before('fence', 'callout', (state: any, startLine: number, endLine: number, silent: boolean) => {
    let pos = state.bMarks[startLine] + state.tShift[startLine]
    let max = state.eMarks[startLine]

    if (state.src.charCodeAt(pos) !== 0x25 || state.src.charCodeAt(pos + 1) !== 0x25) {
      return false
    }

    // Match %%type {metadata}
    const match = /^%%(\w+)(?:\s+({[^}]*}))?/.exec(state.src.slice(pos, max))
    if (!match) return false

    if (silent) return true

    const type = match[1].toLowerCase()
    const metadataRaw = match[2] || '{}'
    const metadata = parseCalloutMetadata(metadataRaw)
    
    const config = CALLOUT_CONFIG[type] || { title: type.charAt(0).toUpperCase() + type.slice(1), icon: '馃搶' }
    const title = metadata.title || config.title
    const icon = metadata.icon || config.icon

    let nextLine = startLine + 1
    let haveEndMarker = false
    let depth = 1

    for (; nextLine < endLine; nextLine++) {
      pos = state.bMarks[nextLine] + state.tShift[nextLine]
      max = state.eMarks[nextLine]
      
      const lineText = state.src.slice(pos, max).trim()
      
      if (lineText.startsWith('%%')) {
        if (/^%%\w+/.test(lineText)) {
          depth++
        } else if (lineText === '%%') {
          depth--
          if (depth === 0) {
            haveEndMarker = true
            break
          }
        }
      }
    }

    const oldParent = state.parentType
    const oldLineMax = state.lineMax
    state.parentType = 'callout'
    state.lineMax = nextLine

    let token = state.push('callout_open', type === 'fold' ? 'details' : 'div', 1)
    token.block = true
    token.info = type
    token.map = [startLine, nextLine]
    token.attrs = [['class', `callout callout-${type}`]]

    if (isReferenceableCalloutType(type) && typeof metadata.id === 'string' && metadata.id.trim()) {
      const referenceId = metadata.id.trim()
      const duplicateInfo = getDuplicateInfo(state.env, referenceId)
      token.attrs.push(['id', buildReferenceAnchorId(referenceId)])
      token.attrs.push(['data-ref-id', referenceId])
      token.attrs.push(['data-ref-type', type])
      token.attrs.push(['data-ref-title', title])
      if (duplicateInfo?.duplicate) {
        token.attrs[0][1] += ' callout-ref-duplicate'
        token.attrs.push(['data-ref-duplicate', 'true'])
      }
    }

    // Render Callout Header
    if (type === 'fold') {
      token = state.push('summary_open', 'summary', 1)
      token.attrs = [['class', 'callout-header']]
      
      token = state.push('html_inline', '', 0)
      token.content = `<span class="callout-icon">${icon}</span><span class="callout-title">${title}</span>${renderDuplicateWarning(state.env, metadata.id)}`
      
      token = state.push('summary_close', 'summary', -1)
    } else {
      token = state.push('callout_header_open', 'div', 1)
      token.attrs = [['class', 'callout-header']]
      
      token = state.push('html_inline', '', 0)
      token.content = `<span class="callout-icon">${icon}</span><span class="callout-title">${title}</span>${renderDuplicateWarning(state.env, metadata.id)}`
      
      token = state.push('callout_header_close', 'div', -1)
    }

    token = state.push('callout_content_open', 'div', 1)
    token.attrs = [['class', 'callout-content']]

    state.md.block.tokenize(state, startLine + 1, nextLine)

    state.push('callout_content_close', 'div', -1)

    token = state.push('callout_close', type === 'fold' ? 'details' : 'div', -1)
    token.block = true

    state.parentType = oldParent
    state.lineMax = oldLineMax
    state.line = nextLine + (haveEndMarker ? 1 : 0)

    return true
  }, { alt: ['paragraph', 'reference', 'blockquote'] })
}

function getDuplicateInfo(env: any, id: string) {
  const targets = Array.isArray(env?.referenceTargetsList) ? env.referenceTargetsList : []
  return targets.find((target: any) => target.id === id && target.duplicate)
}

function renderDuplicateWarning(env: any, id: unknown): string {
  if (typeof id !== 'string' || !id.trim()) return ''
  const duplicateInfo = getDuplicateInfo(env, id.trim())
  if (!duplicateInfo?.duplicate) return ''
  return `<span class="callout-ref-warning" title="Duplicate reference id in this article">重复 id：${escapeHtml(
    id.trim()
  )}</span>`
}

export function inlineReferencePlugin(md: any) {
  md.inline.ruler.before('emphasis', 'reference_link', (state: any, silent: boolean) => {
    const start = state.pos
    const max = state.posMax

    if (start + 4 > max) return false
    if (state.src.charCodeAt(start) !== 0x5b || state.src.charCodeAt(start + 1) !== 0x5b) {
      return false
    }

    const closeIndex = state.src.indexOf(']]', start + 2)
    if (closeIndex === -1 || closeIndex > max) return false

    const payload = parseInlineReferencePayload(state.src.slice(start + 2, closeIndex))
    if (!payload) return false

    if (!silent) {
      const token = state.push('reference_link', 'a', 0)
      token.meta = payload
      token.content = payload.text || payload.id
    }

    state.pos = closeIndex + 2
    return true
  })

  md.renderer.rules.reference_link = (tokens: any, idx: number, _options: any, env: any) => {
    const token = tokens[idx]
    const payload = token.meta || {}
    const implicitLabel = !payload.text
    const currentTargets = env?.referenceTargets instanceof Map ? env.referenceTargets : null
    const resolvedTitle =
      implicitLabel && currentTargets && payload.post == null ? currentTargets.get(payload.id)?.title : null
    const displayText = payload.text || resolvedTitle || payload.id
    const href = payload.post
      ? `#/post/${payload.post}#${buildReferenceAnchorId(payload.id)}`
      : `#${buildReferenceAnchorId(payload.id)}`

    return `<a class="reference-link" href="${escapeHtml(href)}" data-reference-id="${escapeHtml(
      payload.id || ''
    )}" data-reference-post="${escapeHtml(payload.post || '')}" data-reference-implicit-label="${
      implicitLabel ? 'true' : 'false'
    }">${escapeHtml(displayText)}</a>`
  }
}

// GitHub Flavored Markdown Alert types
const GH_ALERT_TYPES: Record<string, { label: string; icon: string }> = {
  NOTE: {
    label: 'Note',
    icon: `<svg aria-hidden="true" viewBox="0 0 16 16" width="16" height="16" fill="currentColor"><path d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8Zm8-6.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13ZM6.5 7.75A.75.75 0 0 1 7.25 7h1a.75.75 0 0 1 .75.75v2.75h.25a.75.75 0 0 1 0 1.5h-2a.75.75 0 0 1 0-1.5h.25v-2h-.25a.75.75 0 0 1-.75-.75ZM8 6a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z"/></svg>`
  },
  TIP: {
    label: 'Tip',
    icon: `<svg aria-hidden="true" viewBox="0 0 16 16" width="16" height="16" fill="currentColor"><path d="M8 1.5c-2.363 0-4 1.69-4 3.75 0 .984.424 1.625.984 2.304l.214.253c.223.264.47.556.673.848.284.411.537.896.621 1.49a.75.75 0 0 1-1.484.211c-.04-.282-.163-.547-.37-.847a8.456 8.456 0 0 0-.542-.68c-.084-.1-.173-.205-.268-.32C3.201 7.75 2.5 6.766 2.5 5.25 2.5 2.31 4.863 0 8 0s5.5 2.31 5.5 5.25c0 1.516-.701 2.5-1.328 3.259-.095.115-.184.22-.268.319-.207.245-.383.453-.541.681-.208.3-.33.565-.37.847a.751.751 0 0 1-1.485-.212c.084-.593.337-1.078.621-1.489.203-.292.45-.584.673-.848.075-.088.147-.173.213-.253.561-.679.985-1.32.985-2.304 0-2.06-1.637-3.75-4-3.75ZM5.75 12h4.5a.75.75 0 0 1 0 1.5h-4.5a.75.75 0 0 1 0-1.5ZM6 15.25a.75.75 0 0 1 .75-.75h2.5a.75.75 0 0 1 0 1.5h-2.5a.75.75 0 0 1-.75-.75Z"/></svg>`
  },
  IMPORTANT: {
    label: 'Important',
    icon: `<svg aria-hidden="true" viewBox="0 0 16 16" width="16" height="16" fill="currentColor"><path d="M0 1.75C0 .784.784 0 1.75 0h12.5C15.216 0 16 .784 16 1.75v9.5A1.75 1.75 0 0 1 14.25 13H8.06l-2.573 2.573A1.458 1.458 0 0 1 3 14.543V13H1.75A1.75 1.75 0 0 1 0 11.25Zm1.75-.25a.25.25 0 0 0-.25.25v9.5c0 .138.112.25.25.25h2a.75.75 0 0 1 .75.75v2.19l2.72-2.72a.749.749 0 0 1 .53-.22h6.5a.25.25 0 0 0 .25-.25v-9.5a.25.25 0 0 0-.25-.25Zm7 2.25v2.5a.75.75 0 0 1-1.5 0v-2.5a.75.75 0 0 1 1.5 0ZM9 9a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z"/></svg>`
  },
  WARNING: {
    label: 'Warning',
    icon: `<svg aria-hidden="true" viewBox="0 0 16 16" width="16" height="16" fill="currentColor"><path d="M6.457 1.047c.659-1.234 2.427-1.234 3.086 0l6.082 11.378A1.75 1.75 0 0 1 14.082 15H1.918a1.75 1.75 0 0 1-1.543-2.575Zm1.763.707a.25.25 0 0 0-.44 0L1.698 13.132a.25.25 0 0 0 .22.368h12.164a.25.25 0 0 0 .22-.368Zm.53 3.996v2.5a.75.75 0 0 1-1.5 0v-2.5a.75.75 0 0 1 1.5 0ZM9 11a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z"/></svg>`
  },
  CAUTION: {
    label: 'Caution',
    icon: `<svg aria-hidden="true" viewBox="0 0 16 16" width="16" height="16" fill="currentColor"><path d="M4.47.22A.749.749 0 0 1 5 0h6c.199 0 .389.079.53.22l4.25 4.25c.141.14.22.331.22.53v6a.749.749 0 0 1-.22.53l-4.25 4.25A.749.749 0 0 1 11 16H5a.749.749 0 0 1-.53-.22L.22 11.53A.749.749 0 0 1 0 11V5c0-.199.079-.389.22-.53Zm.84 1.28L1.5 5.31v5.38l3.81 3.81h5.38l3.81-3.81V5.31L10.69 1.5ZM8 4a.75.75 0 0 1 .75.75v3.5a.75.75 0 0 1-1.5 0v-3.5A.75.75 0 0 1 8 4Zm0 8a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z"/></svg>`
  }
}

/**
 * Transforms GitHub-style Alert blockquotes:
 *   > [!NOTE]
 *   > Content here
 * into styled alert divs matching GitHub's appearance.
 */
export function githubAlertsPlugin(md: any) {
  md.core.ruler.push('github_alerts', (state: any) => {
    const tokens = state.tokens
    for (let i = 0; i < tokens.length; i++) {
      if (tokens[i].type !== 'blockquote_open') continue

      // Find the first inline token inside this blockquote
      let inlineIdx = i + 1
      while (inlineIdx < tokens.length && tokens[inlineIdx].type !== 'inline') {
        inlineIdx++
      }
      if (inlineIdx >= tokens.length) continue

      const inlineToken = tokens[inlineIdx]
      const match = /^\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]/.exec(
        (inlineToken.content || '').trimStart()
      )
      if (!match) continue

      const alertType = match[1]
      const alertInfo = GH_ALERT_TYPES[alertType]

      // Find matching blockquote_close
      let closeIdx = i + 1
      let depth = 1
      while (closeIdx < tokens.length && depth > 0) {
        if (tokens[closeIdx].type === 'blockquote_open') depth++
        else if (tokens[closeIdx].type === 'blockquote_close') depth--
        if (depth > 0) closeIdx++
      }

      // Replace blockquote_open with a div.gh-alert
      tokens[i].type = 'html_block'
      tokens[i].content = `<div class="gh-alert gh-alert-${alertType.toLowerCase()}"><p class="gh-alert-title">${alertInfo.icon}<span>${alertInfo.label}</span></p>`
      tokens[i].children = null

      // Replace blockquote_close with closing div
      tokens[closeIdx].type = 'html_block'
      tokens[closeIdx].content = '</div>'
      tokens[closeIdx].children = null

      // Remove the [!TYPE] label from the first inline token's content
      inlineToken.content = inlineToken.content.replace(/^\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]\s*/i, '').trimStart()
      if (inlineToken.children && inlineToken.children.length > 0) {
        for (let c = 0; c < inlineToken.children.length; c++) {
          if (inlineToken.children[c].type === 'text') {
            const cleaned = inlineToken.children[c].content.replace(/^\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]\s*/i, '').trimStart()
            inlineToken.children[c].content = cleaned
            break
          }
        }
      }
    }
  })
}

