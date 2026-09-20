// One source of truth for tech slugs: they are shared between the
// /hero/tech-<slug>.svg carousel images, content/<locale>/technologies/<slug>.yml
// files and the /technologies/<slug> routes.
export const techSlugFromImage = (src: string) =>
  src.replace(/^.*tech-/, '').replace(/\.[a-z]+$/, '')

// Display names used in project stack/tags differ from slugs
// ("Tailwind CSS" -> tailwindcss, "Laravel API" -> laravel).
const TECH_NAME_ALIASES: Record<string, string> = {
  'vue.js': 'vue',
  'vuejs': 'vue',
  'nuxt.js': 'nuxt',
  'nuxtjs': 'nuxt',
  'tailwind css': 'tailwindcss',
  'tailwind': 'tailwindcss',
  'github actions': 'github-actions',
  'laravel api': 'laravel',
  'postgres': 'postgresql'
}

export const techSlugForName = (name: string) => {
  const normalized = name.toLowerCase().trim()
  return TECH_NAME_ALIASES[normalized]
    ?? normalized.replace(/[\s.]+/g, '-').replace(/-+/g, '-')
}
