import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import fs from 'fs'
import path from 'path'

const siteConfig = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, './src/config/site.config.json'), 'utf8')
)

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    {
      name: 'inject-site-metadata',
      transformIndexHtml(html) {
        return html
          .replace(/__SITE_TITLE__/g, siteConfig.site.metadata.defaultTitle)
          .replace(/__SITE_DESCRIPTION__/g, siteConfig.site.metadata.defaultDescription)
          .replace(/__SITE_KEYWORDS__/g, siteConfig.site.metadata.keywords.join(', '))
          .replace(/__SITE_AUTHOR__/g, siteConfig.site.metadata.author)
          .replace(/__SITE_THEME_COLOR__/g, siteConfig.site.metadata.themeColor)
          .replace(/__SITE_FAVICON__/g, siteConfig.site.metadata.favicon)
      }
    }
  ],
  base: '/',
})
