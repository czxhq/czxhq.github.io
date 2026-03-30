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
