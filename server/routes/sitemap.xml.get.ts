const LOCALES = [
  { code: 'uk', iso: 'uk-UA', prefix: '' },
  { code: 'en', iso: 'en-US', prefix: '/en' },
  { code: 'pl', iso: 'pl-PL', prefix: '/pl' }
]

const PATHS = ['/', '/about', '/projects']

export default defineEventHandler((event) => {
  const config = useRuntimeConfig()
  const origin = (config.public.siteUrl as string)
    || `${getRequestProtocol(event)}://${getRequestHost(event)}`
  const lastmod = new Date().toISOString()

  const urlFor = (prefix: string, path: string) => `${origin}${prefix}${path}`

  const urls = LOCALES.flatMap(locale => PATHS.map((path) => {
    const alternates = LOCALES.map(a =>
      `    <xhtml:link rel="alternate" hreflang="${a.iso}" href="${urlFor(a.prefix, path)}" />`
    ).join('\n')
    return [
      '  <url>',
      `    <loc>${urlFor(locale.prefix, path)}</loc>`,
      `    <lastmod>${lastmod}</lastmod>`,
      alternates,
      '  </url>'
    ].join('\n')
  }))

  setResponseHeader(event, 'content-type', 'application/xml; charset=utf-8')
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
    urls.join('\n'),
    '</urlset>'
  ].join('\n')
})
