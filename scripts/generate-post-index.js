import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const POSTS_DIR = path.resolve(__dirname, '../public/posts')
const OUTPUT_FILE = path.resolve(__dirname, '../src/data/posts.json')
const REFERENCE_OUTPUT_FILE = path.resolve(__dirname, '../src/data/reference-index.json')

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

function parseCalloutMetadata(str) {
  if (!str) return {}
  const trimmed = str.trim()
  if (trimmed === '{}' || trimmed === '{ }') return {}

  try {
    const jsonStr = trimmed
      .replace(/([{,]\s*)([A-Za-z_]\w*)\s*:/g, '$1"$2":')
      .replace(/:\s*'([^']*)'/g, ':"$1"')
    return JSON.parse(jsonStr)
  } catch (error) {
    const body = trimmed.replace(/^\{\s*|\s*\}$/g, '')
    const metadata = {}
    const pairRegex =
      /([A-Za-z_]\w*)\s*(?:=|:)\s*(?:"([^"]*)"|'([^']*)'|([^\s,}]+))/g

    let match
    while ((match = pairRegex.exec(body)) !== null) {
      const [, key, doubleQuoted, singleQuoted, bareValue] = match
      metadata[key] = doubleQuoted ?? singleQuoted ?? bareValue ?? ''
    }

    if (Object.keys(metadata).length > 0) {
      return metadata
    }

    console.error('Failed to parse callout metadata:', str, error)
    return {}
  }
}

function buildReferenceAnchorId(id) {
  return `ref-${String(id)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-')
    .replace(/^-+|-+$/g, '')}`
}

function extractReferenceTargets(content, context) {
  const normalized = content.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/, '')
  const lines = normalized.split(/\r?\n/)
  const targets = []
  const labels = {
    lemma: '引理',
    definition: '定义',
    theorem: '定理'
  }

  for (let index = 0; index < lines.length; index++) {
    const line = lines[index].trim()
    const match = /^%%(\w+)(?:\s+({[^}]*}))?\s*$/.exec(line)
    if (!match) continue

    const type = match[1].toLowerCase()
    if (!['lemma', 'definition', 'theorem'].includes(type)) continue

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
          if (depth === 0) break
        }
      }
    }

    const body = lines.slice(index + 1, nextLine).join('\n').trim()
    targets.push({
      id: targetId,
      type,
      title: (metadata.title || labels[type] || type).trim(),
      slug: context.slug,
      source: context.source,
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

  const grouped = new Map()
  for (const target of targets) {
    const key = `${target.slug}::${target.id}`
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

function isPostFile(name) {
  return name.endsWith('.md') || name.endsWith('.kmd')
}

function toWebPath(filePath) {
  return filePath.split(path.sep).join('/')
}

function createDefaultSlug(relativeSource) {
  return relativeSource
    .replace(/^\/?posts\//, '')
    .replace(/\.(md|kmd)$/i, '')
    .replace(/\/index$/i, '')
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'untitled-post'
}

function findPreferredPostFile(dirPath, relativeDir) {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true })
  const dirName = path.basename(dirPath)
  const candidateNames = ['index.md', 'index.kmd', `${dirName}.md`, `${dirName}.kmd`]

  for (const candidate of candidateNames) {
    const candidatePath = path.join(dirPath, candidate)
    if (fs.existsSync(candidatePath)) {
      return {
        filePath: candidatePath,
        relativeSource: `/posts/${toWebPath(path.join(relativeDir, candidate))}`,
        fileFormat: candidate.split('.').pop()
      }
    }
  }

  const nestedFiles = entries
    .filter((entry) => entry.isFile() && isPostFile(entry.name))
    .map((entry) => entry.name)
    .sort((a, b) => a.localeCompare(b))

  if (!nestedFiles.length) return null

  const chosen = nestedFiles[0]
  return {
    filePath: path.join(dirPath, chosen),
    relativeSource: `/posts/${toWebPath(path.join(relativeDir, chosen))}`,
    fileFormat: chosen.split('.').pop()
  }
}

function collectPostEntries(dirPath = POSTS_DIR, relativeDir = '') {
  const items = fs.readdirSync(dirPath, { withFileTypes: true })
  const posts = []

  if (relativeDir) {
    const preferred = findPreferredPostFile(dirPath, relativeDir)
    if (preferred) {
      posts.push(preferred)
    }
  } else {
    for (const item of items) {
      if (!item.isFile() || !isPostFile(item.name)) continue
      posts.push({
        filePath: path.join(dirPath, item.name),
        relativeSource: `/posts/${item.name}`,
        fileFormat: item.name.split('.').pop()
      })
    }
  }

  for (const item of items) {
    if (!item.isDirectory()) continue
    posts.push(...collectPostEntries(path.join(dirPath, item.name), path.join(relativeDir, item.name)))
  }

  return posts
}

function processPosts() {
  if (!fs.existsSync(POSTS_DIR)) {
    console.warn(`[WARN] Directory not found: ${POSTS_DIR}`);
    return;
  }
  
  const posts = [];
  const references = [];
  const postEntries = collectPostEntries();

  for (const { filePath, fileFormat, relativeSource } of postEntries) {
    const content = fs.readFileSync(filePath, 'utf8');
    const { attributes, body } = parseFrontmatter(content);
    const plainText = stripMarkdown(body);
    const generatedSummary = plainText.slice(0, 160);

    // If there is no slug in frontmatter, use the relative path to avoid nested-post collisions.
    const defaultSlug = createDefaultSlug(relativeSource);
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

    references.push(
      ...extractReferenceTargets(body, {
        slug,
        source: relativeSource
      })
    )
  }

  const duplicateReferences = references.filter((item) => item.duplicate)
  for (const item of duplicateReferences) {
    console.warn(
      `[WARN] Duplicate reference id "${item.id}" in post "${item.slug}" (${item.duplicateIndex}/${item.duplicateCount}).`
    )
  }

  // Sort by date descending
  posts.sort((a, b) => new Date(b.date) - new Date(a.date));

  // Ensure src/data exists
  const outputDir = path.dirname(OUTPUT_FILE);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(posts, null, 2), 'utf8');
  fs.writeFileSync(REFERENCE_OUTPUT_FILE, JSON.stringify(references, null, 2), 'utf8');
  console.log(`[SUCCESS] Generated ${OUTPUT_FILE} with ${posts.length} posts.`);
  console.log(`[SUCCESS] Generated ${REFERENCE_OUTPUT_FILE} with ${references.length} references.`);
}

processPosts();
