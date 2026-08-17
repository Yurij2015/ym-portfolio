<script setup lang="ts">
const { locale, t } = useI18n()
const { global } = useAppConfig()

const { data: page } = await useAsyncData(
  () => `index-${locale.value}`,
  () => queryCollection(`index_${locale.value}` as 'index_uk').first(),
  { watch: [locale] }
)
if (!page.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Page not found',
    fatal: true
  })
}

const title = page.value?.seo?.title || page.value?.title
const description = page.value?.seo?.description || page.value?.description

// seo.title already contains the name — avoid the "- Yurii Mokryi" duplicate
useSeoMeta({
  title,
  titleTemplate: '%s',
  ogTitle: title,
  description,
  ogDescription: description
})

defineOgImage('Portfolio', { title, description, headline: 'Senior Full-Stack PHP Developer' }, { alt: title })

const origin = (useRuntimeConfig().public.siteUrl as string) || useRequestURL().origin

const jsonLd: Record<string, unknown>[] = [{
  '@context': 'https://schema.org',
  '@type': 'Person',
  'name': 'Yurii Mokryi',
  'jobTitle': 'Senior Full-Stack PHP Developer',
  description,
  'url': origin,
  'address': { '@type': 'PostalAddress', 'addressLocality': 'Poznań', 'addressCountry': 'PL' },
  'sameAs': [
    'https://github.com/Yurij2015',
    'https://linkedin.com/in/yurii-mokryi',
    'https://www.upwork.com/freelancers/mokryiyurii',
    'https://t.me/YuriiMokryi',
    'https://scholar.google.com/citations?user=efT-_VMAAAAJ&hl=uk'
  ],
  'knowsAbout': ['PHP', 'Laravel', 'Symfony', 'Vue.js', 'Nuxt', 'Docker', 'Terraform']
}]

const faqCategories = page.value.faq?.categories ?? []
if (faqCategories.length) {
  jsonLd.push({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': faqCategories.flatMap(category => category.questions.map(question => ({
      '@type': 'Question',
      'name': question.label,
      'acceptedAnswer': { '@type': 'Answer', 'text': question.content }
    })))
  })
}

useHead({
  script: jsonLd.map(schema => ({ type: 'application/ld+json', innerHTML: JSON.stringify(schema) }))
})
</script>

<template>
  <UPage v-if="page">
    <LandingHero :page />
    <UPageSection
      :ui="{
        container: 'pt-0! lg:grid lg:grid-cols-2 lg:gap-8'
      }"
    >
      <LandingAbout :page />
      <LandingWorkExperience :page />
    </UPageSection>
    <LandingTestimonials :page />
    <LandingFAQ :page />
    <UPageCTA
      id="contact"
      :title="t('contact.title')"
      :description="t('contact.description')"
      :links="[
        { label: t('contact.telegram'), to: global.meetingLink, color: 'primary', icon: 'i-simple-icons-telegram', target: '_blank' },
        { label: t('contact.email'), to: `mailto:${global.email}`, color: 'neutral', icon: 'i-heroicons-envelope' }
      ]"
    />
  </UPage>
</template>
