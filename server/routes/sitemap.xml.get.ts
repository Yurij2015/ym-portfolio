import { queryCollection } from '@nuxt/content/nitro'

const LOCALES = [
  { code: 'uk', iso: 'uk-UA', prefix: '' },
  { code: 'en', iso: 'en-US', prefix: '/en' },
  { code: 'pl', iso: 'pl-PL', prefix: '/pl' }
]

const PATHS = ['/', '/about', '/projects', '/technologies']

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const origin = (config.public.siteUrl as string)
    || `${getRequestProtocol(event)}://${getRequestHost(event)}`

  // Slugs are locale-independent — any collection gives all of them.
  // lastmod = newest known content change (project dates + technology
  // `updated` fields) — far more honest than Date.now() on every request.
  const projects = await queryCollection(event, 'projects_en').all()
  const technologies = await queryCollection(event, 'technologies_en').all()
  const projectSlugs = projects.map(p => String(p.stem).split('/').pop() ?? '')
  const techSlugs = technologies.map(t => String(t.stem).split('/').pop() ?? '')
  const dates = [
    ...projects.map(p => p.date),
    ...technologies.map(t => t.updated)
  ].filter(Boolean).sort()
  const lastmod = new Date(dates.pop() ?? Date.now()).toISOString()

  const urlFor = (prefix: string, path: string) => `${origin}${prefix}${path}`

  const urlEntry = (path: string) => LOCALES.map((locale) => {
    const alternates = [
      ...LOCALES.map(a =>
        `    <xhtml:link rel="alternate" hreflang="${a.iso}" href="${urlFor(a.prefix, path)}" />`
      ),
      `    <xhtml:link rel="alternate" hreflang="x-default" href="${urlFor('', path)}" />`
    ].join('\n')
    return [
      '  <url>',
      `    <loc>${urlFor(locale.prefix, path)}</loc>`,
      `    <lastmod>${lastmod}</lastmod>`,
      alternates,
      '  </url>'
    ].join('\n')
  })

  const urls = [
    ...PATHS,
    ...projectSlugs.map(s => `/projects/${s}`),
    ...techSlugs.map(s => `/technologies/${s}`)
  ].flatMap(urlEntry)

  setResponseHeader(event, 'content-type', 'application/xml; charset=utf-8')
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
    urls.join('\n'),
    '</urlset>'
  ].join('\n')
})
