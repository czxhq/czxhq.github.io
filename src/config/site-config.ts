import rawConfig from './site.config.json'

const markdownModules = import.meta.glob('../content/**/*.md', {
  eager: true,
  query: '?raw',
  import: 'default'
}) as Record<string, string>

export type SiteConfig = typeof rawConfig

export const siteConfig: SiteConfig = rawConfig

export function getContentFile(filePath?: string): string {
  if (!filePath) return ''
  return markdownModules[`../content/${filePath}`] || ''
}

export function formatTemplate(template: string, values: Record<string, string | number>) {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => String(values[key] ?? ''))
}

export function buildPageTitle(pageTitle?: string) {
  if (!pageTitle) return siteConfig.site.metadata.defaultTitle
  return formatTemplate(siteConfig.site.metadata.titleTemplate, { page: pageTitle })
}

export function updateDocumentMetadata(options?: {
  title?: string
  description?: string
}) {
  const title = options?.title || siteConfig.site.metadata.defaultTitle
  const description = options?.description || siteConfig.site.metadata.defaultDescription

  document.title = title
  ensureMeta('description', description)
  ensureMeta('keywords', siteConfig.site.metadata.keywords.join(', '))
  ensureMeta('author', siteConfig.site.metadata.author)
  ensureMeta('theme-color', siteConfig.site.metadata.themeColor)
}

function ensureMeta(name: string, content: string) {
  let element = document.head.querySelector(`meta[name="${name}"]`)
  if (!element) {
    element = document.createElement('meta')
    element.setAttribute('name', name)
    document.head.appendChild(element)
  }
  element.setAttribute('content', content)
}
