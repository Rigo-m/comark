import { existsSync, readdirSync, statSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { join, relative } from 'node:path'
import { describe, expect, it } from 'vitest'

// Every `routeRules` redirect in the docs app must land on a page that exists: a
// content document, an app page, or another redirect. A stale target is a 404
// behind a URL we advertise.
const docsDir = fileURLToPath(new URL('../docs', import.meta.url))
const contentDir = join(docsDir, 'content')
const pagesDir = join(docsDir, 'app/pages')

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const full = join(dir, name)
    return statSync(full).isDirectory() ? walk(full) : [full]
  })
}

/** `1.getting-started/0.introduction.md` -> `/getting-started/introduction` */
function contentPath(file: string): string {
  const segments = relative(contentDir, file)
    .replace(/\.md$/, '')
    .split('/')
    .map((segment) => segment.replace(/^\d+\./, ''))
  if (segments[segments.length - 1] === 'index') segments.pop()
  return '/' + segments.join('/')
}

/** `play/index.vue` -> `/play`, `compare.vue` -> `/compare` */
function pagePath(file: string): string {
  const segments = relative(pagesDir, file)
    .replace(/\.vue$/, '')
    .split('/')
  if (segments[segments.length - 1] === 'index') segments.pop()
  return '/' + segments.join('/')
}

const pages = new Set([
  ...walk(contentDir)
    .filter((file) => file.endsWith('.md'))
    .map(contentPath),
  ...walk(pagesDir)
    .filter((file) => file.endsWith('.vue'))
    .map(pagePath),
])

// The config relies on Nuxt's global; the identity is all the shape needs here.
;(globalThis as Record<string, unknown>).defineNuxtConfig = (config: unknown) => config
const config = (await import('../docs/nuxt.config.ts')).default as {
  routeRules?: Record<string, { redirect?: string }>
}
const redirects = Object.entries(config.routeRules ?? {}).flatMap(([from, rule]) =>
  rule.redirect ? [[from, rule.redirect] as const] : []
)

describe('docs redirects', () => {
  it('declares the conventional entry points agents probe', () => {
    const rules = Object.fromEntries(redirects)
    expect(rules['/docs']).toBe('/getting-started/introduction')
    expect(rules['/api']).toBe('/reference/reference')
  })

  it.each(redirects)('%s -> %s exists', (from, to) => {
    const target = to.split('?')[0]!
    const resolved = redirects.find(([source]) => source === target)?.[1].split('?')[0] ?? target
    expect(pages.has(resolved) || existsSync(join(docsDir, 'public', resolved))).toBe(true)
  })
})
