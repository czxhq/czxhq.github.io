import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const POSTS_DIR = path.resolve(__dirname, '../public/posts')
const OUTPUT_FILE = path.resolve(__dirname, '../src/data/posts.json')

function parseFrontmatter(content) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return { attributes: {}, body: content };
  
  const yamlContent = match[1];
  const body = content.slice(match[0].length).trim();
  const attributes = {};
  
  let currentKey = null;
  
  yamlContent.split(/\r?\n/).forEach(line => {
    line = line.trimEnd();
    if (!line) return;
    
    // Check if it is an array item
    if (line.trim().startsWith('- ')) {
      if (currentKey && Array.isArray(attributes[currentKey])) {
        const item = line.replace(/^\s*-\s+/, '').replace(/^['"](.*)['"]$/, '$1').trim();
        attributes[currentKey].push(item);
      }
      return;
    }
    
    // Normal key-value pair
    const parts = line.split(':');
    if (parts.length >= 2) {
      const key = parts[0].trim();
      let value = parts.slice(1).join(':').trim();
      
      if (!value) {
        currentKey = key;
        attributes[currentKey] = [];
      } else {
        // Remove quotes if present
        value = value.replace(/^['"](.*)['"]$/, '$1');
        // Type conversion
        if (value === 'true') value = true;
        else if (value === 'false') value = false;
        
        attributes[key] = value;
        currentKey = null;
      }
    }
  });

  return { attributes, body };
}

function stripMarkdown(content) {
  return content
    .replace(/^---\r?\n[\s\S]*?\r?\n---/, '')
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '$1 ')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1 ')
    .replace(/^>\s?/gm, '')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/^\s*[-*+]\s+/gm, '')
    .replace(/^\s*\d+\.\s+/gm, '')
    .replace(/\|/g, ' ')
    .replace(/[*_~]/g, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\r?\n+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function processPosts() {
  if (!fs.existsSync(POSTS_DIR)) {
    console.warn(`[WARN] Directory not found: ${POSTS_DIR}`);
    return;
  }
  
  const items = fs.readdirSync(POSTS_DIR, { withFileTypes: true });
  const posts = [];

  for (const item of items) {
    let filePath = null;
    let fileFormat = null;
    let relativeSource = null;

    if (item.isFile()) {
      if (item.name.endsWith('.md') || item.name.endsWith('.kmd')) {
        filePath = path.join(POSTS_DIR, item.name);
        fileFormat = item.name.split('.').pop();
        relativeSource = `/posts/${item.name}`;
      }
    } else if (item.isDirectory()) {
      // Look for index.md, index.kmd, or [dirname].md, [dirname].kmd first.
      // If none exist, fall back to the first .md/.kmd file inside the directory.
      const dirPath = path.join(POSTS_DIR, item.name);
      const candidates = ['index.md', 'index.kmd', `${item.name}.md`, `${item.name}.kmd`];
      
      for (const cand of candidates) {
        const candPath = path.join(dirPath, cand);
        if (fs.existsSync(candPath)) {
          filePath = candPath;
          fileFormat = cand.split('.').pop();
          relativeSource = `/posts/${item.name}/${cand}`;
          break;
        }
      }

      if (!filePath) {
        const nestedFiles = fs
          .readdirSync(dirPath, { withFileTypes: true })
          .filter((entry) => entry.isFile() && (entry.name.endsWith('.md') || entry.name.endsWith('.kmd')))
          .map((entry) => entry.name)
          .sort((a, b) => a.localeCompare(b));

        if (nestedFiles.length > 0) {
          const chosen = nestedFiles[0];
          filePath = path.join(dirPath, chosen);
          fileFormat = chosen.split('.').pop();
          relativeSource = `/posts/${item.name}/${chosen}`;
        }
      }
    }

    if (!filePath) continue;

    const content = fs.readFileSync(filePath, 'utf8');
    const { attributes, body } = parseFrontmatter(content);
    const plainText = stripMarkdown(body);
    const generatedSummary = plainText.slice(0, 160);

    // If there is no slug in frontmatter, use directory name or filename without extension
    const defaultSlug = item.isDirectory() ? item.name : path.parse(item.name).name;
    const slug = attributes.slug || defaultSlug;
    
    // Default values if some attributes are missing
    posts.push({
      title: attributes.title || slug,
      slug: slug,
      date: attributes.date || '',
      updated: attributes.updated || attributes.date || '',
      category: attributes.category || '未分类',
      tags: attributes.tags || [],
      summary: attributes.summary || generatedSummary,
      cover: attributes.cover || '',
      draft: attributes.draft || false,
      featured: attributes.featured || false,
      source: relativeSource,
      format: attributes.format || fileFormat,
      searchText: [
        attributes.title || slug,
        attributes.category || '',
        ...(attributes.tags || []),
        attributes.summary || generatedSummary,
        plainText
      ]
        .filter(Boolean)
        .join(' ')
    });
  }

  // Sort by date descending
  posts.sort((a, b) => new Date(b.date) - new Date(a.date));

  // Ensure src/data exists
  const outputDir = path.dirname(OUTPUT_FILE);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(posts, null, 2), 'utf8');
  console.log(`[SUCCESS] Generated ${OUTPUT_FILE} with ${posts.length} posts.`);
}

processPosts();
