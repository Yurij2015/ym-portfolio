export const useSeoExtras = () => {
  const route = useRoute()
  const { locale, locales } = useI18n()
  const switchLocalePath = useSwitchLocalePath()

  const origin = (useRuntimeConfig().public.siteUrl as string) || useRequestURL().origin

  const alternates = (locales.value as { code: 'uk' | 'en' | 'pl', iso: string }[]).map(l => ({
    code: l.code,
    iso: l.iso,
    path: switchLocalePath(l.code)
  }))

  useHead({
    link: [
      { rel: 'canonical', href: `${origin}${route.path}` },
      ...alternates.map(a => ({ rel: 'alternate' as const, hreflang: a.iso, href: `${origin}${a.path}` })),
      { rel: 'alternate' as const, hreflang: 'x-default', href: `${origin}${switchLocalePath('uk')}` }
    ]
  })

  useSeoMeta({
    ogUrl: `${origin}${route.path}`,
    ogSiteName: 'Yurii Mokryi',
    ogType: 'website',
    ogLocale: alternates.find(a => a.code === locale.value)?.iso as string | undefined
  })
}
