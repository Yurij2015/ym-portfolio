<script setup lang="ts">
const { locale } = useI18n()

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

useSeoMeta({
  title,
  ogTitle: title,
  description,
  ogDescription: description
})

defineOgImage('Portfolio', { title, description }, { alt: title })
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
  </UPage>
</template>
