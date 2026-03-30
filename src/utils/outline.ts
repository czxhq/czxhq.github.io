import MarkdownIt from 'markdown-it'

export interface OutlineItem {
  level: number
  text: string
  slug: string
  line: number
}

const outlineMarkdown = new MarkdownIt({
  html: true,
  breaks: true
})

function collectCalloutLines(content: string): Set<number> {
  const excludedLines = new Set<number>()
  const lines = content.split(/\r?\n/)
  const stack: number[] = []

  lines.forEach((lineText, index) => {
    const lineNumber = index + 1
    const trimmed = lineText.trim()

    if (/^%%\w+/.test(trimmed)) {
      stack.push(lineNumber)
    }

    if (stack.length > 0) {
      excludedLines.add(lineNumber)
    }

    if (trimmed === '%%' && stack.length > 0) {
      stack.pop()
    }
  })

  return excludedLines
}

export function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .replace(/<[^>]+>/g, '')
    .replace(/[^\w\u4e00-\u9fff\- ]/g, '')
    .trim()
    .replace(/\s+/g, '-')
}

export function extractOutline(content: string): OutlineItem[] {
  const tokens = outlineMarkdown.parse(content || '', {})
  const items: OutlineItem[] = []
  const excludedLines = collectCalloutLines(content)

  for (let index = 0; index < tokens.length; index++) {
    const token = tokens[index]
    if (token.type !== 'heading_open') {
      continue
    }

    const inlineToken = tokens[index + 1]
    if (!inlineToken || inlineToken.type !== 'inline') {
      continue
    }

    const level = Number(token.tag.replace('h', ''))
    const text = inlineToken.content.trim()
    if (!text) {
      continue
    }

    const line = (token.map?.[0] || 0) + 1
    if (excludedLines.has(line)) {
      continue
    }

    items.push({
      level,
      text,
      slug: slugifyHeading(text),
      line
    })
  }

  return items
}
