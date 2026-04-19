export const REFERENCEABLE_CALLOUT_TYPES = ['lemma', 'definition', 'theorem'] as const

export type ReferenceableCalloutType = (typeof REFERENCEABLE_CALLOUT_TYPES)[number]

export interface ReferenceTarget {
  id: string
  type: ReferenceableCalloutType
  title: string
  post: string
  path: string
  anchor: string
  content: string
  previewText: string
  duplicate: boolean
  duplicateIndex: number
  duplicateCount: number
}

export interface InlineReference {
  post: string | null
  id: string
  text: string | null
}

const REFERENCE_LABELS: Record<ReferenceableCalloutType, string> = {
  lemma: '引理',
  definition: '定义',
  theorem: '定理'
}

export function isReferenceableCalloutType(value: string): value is ReferenceableCalloutType {
  return REFERENCEABLE_CALLOUT_TYPES.includes(value as ReferenceableCalloutType)
}

export function getReferenceTypeLabel(type: string): string {
  return isReferenceableCalloutType(type) ? REFERENCE_LABELS[type] : type
}

export function parseCalloutMetadata(str: string): Record<string, any> {
  if (!str) return {}
  const trimmed = str.trim()

  if (trimmed === '{}' || trimmed === '{ }') {
    return {}
  }

  try {
    const jsonStr = trimmed
      .replace(/([{,]\s*)([A-Za-z_]\w*)\s*:/g, '$1"$2":')
      .replace(/:\s*'([^']*)'/g, ':"$1"')
    return JSON.parse(jsonStr)
  } catch (e) {
    try {
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

export function buildReferenceAnchorId(id: string): string {
  return `ref-${slugifyReferencePart(id)}`
}

export function parseInlineReferencePayload(value: string): InlineReference | null {
  const trimmed = value.trim()
  if (!trimmed) return null

  const [targetPart, textPart] = trimmed.split('|', 2)
  const normalizedTarget = (targetPart || '').trim()
  if (!normalizedTarget) return null

  const hashIndex = normalizedTarget.indexOf('#')
  const post = hashIndex >= 0 ? normalizedTarget.slice(0, hashIndex).trim() || null : null
  const id = hashIndex >= 0 ? normalizedTarget.slice(hashIndex + 1).trim() : normalizedTarget

  if (!id) return null

  return {
    post,
    id,
    text: textPart?.trim() || null
  }
}

export function extractReferenceTargetsFromMarkdown(
  content: string,
  context: { post?: string; path?: string } = {}
): ReferenceTarget[] {
  const normalized = stripFrontmatter(content || '')
  const lines = normalized.split(/\r?\n/)
  const targets: ReferenceTarget[] = []

  for (let index = 0; index < lines.length; index++) {
    const line = lines[index].trim()
    const match = /^%%(\w+)(?:\s+({[^}]*}))?\s*$/.exec(line)
    if (!match) continue

    const type = match[1].toLowerCase()
    if (!isReferenceableCalloutType(type)) continue

    const metadata = parseCalloutMetadata(match[2] || '{}')
    const targetId = typeof metadata.id === 'string' ? metadata.id.trim() : ''
    if (!targetId) continue

    let nextLine = index + 1
    let depth = 1

    for (; nextLine < lines.length; nextLine++) {
      const candidate = lines[nextLine].trim()
      if (candidate.startsWith('%%')) {
        if (/^%%\w+/.test(candidate)) {
          depth += 1
        } else if (candidate === '%%') {
          depth -= 1
          if (depth === 0) {
            break
          }
        }
      }
    }

    const bodyLines = lines.slice(index + 1, nextLine)
    const body = bodyLines.join('\n').trim()

    targets.push({
      id: targetId,
      type,
      title:
        typeof metadata.title === 'string' && metadata.title.trim()
          ? metadata.title.trim()
          : getReferenceTypeLabel(type),
      post: context.post || '',
      path: context.path || '',
      anchor: buildReferenceAnchorId(targetId),
      content: body,
      previewText: stripMarkdown(body),
      duplicate: false,
      duplicateIndex: 1,
      duplicateCount: 1
    })

    if (nextLine > index) {
      index = nextLine
    }
  }

  return markDuplicateReferenceTargets(targets)
}

export function createReferenceLookup(targets: ReferenceTarget[]): Map<string, ReferenceTarget> {
  return new Map(
    targets
      .filter((target) => !target.duplicate || target.duplicateIndex === 1)
      .map((target) => [target.id, target])
  )
}

export function getDuplicateReferenceTargets(targets: ReferenceTarget[]): ReferenceTarget[] {
  return targets.filter((target) => target.duplicate)
}

function markDuplicateReferenceTargets(targets: ReferenceTarget[]): ReferenceTarget[] {
  const grouped = new Map<string, ReferenceTarget[]>()

  for (const target of targets) {
    const key = `${target.post || target.path || 'current'}::${target.id}`
    const bucket = grouped.get(key) || []
    bucket.push(target)
    grouped.set(key, bucket)
  }

  for (const bucket of grouped.values()) {
    if (bucket.length <= 1) continue

    bucket.forEach((target, index) => {
      target.duplicate = true
      target.duplicateIndex = index + 1
      target.duplicateCount = bucket.length
    })
  }

  return targets
}

function slugifyReferencePart(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function stripFrontmatter(content: string): string {
  return content.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/, '')
}

function stripMarkdown(content: string): string {
  return content
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/!\[([^\]]*)]\(([^)]+)\)/g, '$1 ')
    .replace(/\[([^\]]+)]\(([^)]+)\)/g, '$1 ')
    .replace(/\[\[([^\]]+)]]/g, '$1 ')
    .replace(/^>\s?/gm, '')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/^\s*[-*+]\s+/gm, '')
    .replace(/^\s*\d+\.\s+/gm, '')
    .replace(/\|/g, ' ')
    .replace(/[*_~]/g, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\r?\n+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}
