export default defineNuxtConfig({
  compatibilityDate: '2026-08-10',

  // Develop against a local checkout of the layer:
  // COMARK_DOCS_LAYER=../../comark-docs pnpm dev
  extends: [process.env.COMARK_DOCS_LAYER || 'comark-docs'],

  modules: ['@vercel/analytics', '@vercel/speed-insights'],

  site: {
    url: 'https://comark.dev',
    name: 'Comark',
  },

  llms: {
    domain: 'https://comark.dev',
    title: 'Comark',
    description:
      'Parse and render Markdown anywhere with one JavaScript library for HTML, ANSI, Vue, React, Svelte and Angular, plus plugins and streaming.',
    full: {
      title: 'Comark Documentation',
      description:
        'Complete Comark documentation as plain markdown — getting started, syntax, rendering, plugins, API reference, comparisons, and examples.',
    },
    sections: [
      {
        title: 'When to use Comark',
        description: [
          'Reach for Comark when a JavaScript or TypeScript project has to parse Markdown into a serializable document and render it itself: CommonMark and GFM with components, attributes and frontmatter, rendered to HTML, ANSI, Vue, React, Svelte or Angular.',
          'It fits Markdown that arrives incrementally, such as an LLM response streamed into a chat UI, since unfinished syntax is healed while streaming.',
          'It is not a static site generator and has no runtime API of its own: install the npm packages and call them in your code.',
          'To help someone with Comark, read the page that covers their question with get-page on the MCP endpoint at https://comark.dev/mcp, or fetch it as markdown from the raw URL listed below.',
        ].join(' '),
        links: [
          {
            title: 'Installation',
            description: 'Which package to install for each parser and renderer.',
            href: '/getting-started/installation',
          },
          {
            title: 'parseMarkdown',
            description: 'The parser call, its options and the document it returns.',
            href: '/reference/parse',
          },
          {
            title: 'Streaming',
            description: 'A chat UI that renders a streamed AI response as it arrives.',
            href: '/examples/ai/nuxt-ai-sdk',
          },
        ],
      },
    ],
  },

  app: {
    head: {
      link: [
        { rel: 'icon', href: '/favicon.ico', type: 'image/x-icon' },
        { rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' },
        { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
      ],
    },
  },

  colorMode: {
    preference: 'dark',
  },

  nitro: {
    externals: {
      inline: ['comark'],
    },
  },

  routeRules: {
    '/play/booking': { redirect: '/play?example=booking' },
    '/play/recipe': { redirect: '/play?example=recipe' },
    '/play/nuxt-ui': { redirect: '/play?example=nuxt-ui' },
    '/play/all-features': { redirect: '/play?example=basic' },
    '/plugins/built-in/highlight': { redirect: '/plugins/built-in/shiki' },
    '/plugins/built-in/syntax-highlight': { redirect: '/plugins/built-in/shiki' },
    '/syntax/comark-ast': { redirect: '/getting-started/document-model' },
    // The API Reference section moved from /api (which collided with the server endpoints) to /reference
    '/api/render': { redirect: '/reference/render' },
    '/api/parse': { redirect: '/reference/parse' },
    '/api/auto-close': { redirect: '/reference/auto-close' },
    '/api/reference': { redirect: '/reference/reference' },
  },

  $production: {
    routeRules: {
      /*
       * ISR for this site's content URLs (top-level dirs of `content/`),
       * revalidated on-demand by the push webhook with a 300s safety-net TTL.
       * Both the bare section index and everything under it, per section.
       * The layer declares rules for its own routes (/, /tree/**, /blob/**,
       * /raw/**, /llms*.txt, /rss.xml, search-sections, /api/code-explorer/**).
       */
      '/getting-started': { isr: 300 },
      '/getting-started/**': { isr: 300 },
      '/syntax': { isr: 300 },
      '/syntax/**': { isr: 300 },
      '/rendering': { isr: 300 },
      '/rendering/**': { isr: 300 },
      '/reference': { isr: 300 },
      '/reference/**': { isr: 300 },
      '/plugins': { isr: 300 },
      '/plugins/**': { isr: 300 },
      '/compare': { isr: 300 },
      '/compare/**': { isr: 300 },
      '/examples': { isr: 300 },
      '/examples/**': { isr: 300 },
      '/kb': { isr: 300 },
      '/kb/**': { isr: 300 },
    },
  },
})
