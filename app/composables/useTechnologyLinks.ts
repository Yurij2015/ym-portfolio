// Maps project stack/tag display names ("Tailwind CSS", "Vue.js") to
// /technologies/<slug> pages — but only when a page actually exists,
// so unknown stack items stay non-interactive.
export const useTechnologyLinks = async () => {
  const { locale } = useI18n()
  const localePath = useLocalePath()

  const { data: slugs } = await useAsyncData(
    `technology-slugs-${locale.value}`,
    async () => {
      const all = await queryCollection(`technologies_${locale.value}` as 'technologies_uk').all()
      return all.map(tech => String(tech.stem).split('/').pop() ?? '')
    },
    { watch: [locale] }
  )

  const linkFor = (name: string) => {
    const slug = techSlugForName(name)
    return slugs.value?.includes(slug)
      ? localePath(`/technologies/${slug}`)
      : undefined
  }

  return { linkFor }
}
