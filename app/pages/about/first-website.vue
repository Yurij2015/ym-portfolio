<script setup lang="ts">
const { locale, t } = useI18n()

const { data: page } = await useAsyncData(
  () => `first-website-${locale.value}`,
  () => queryCollection(`first_website_${locale.value}` as 'first_website_uk').first(),
  { watch: [locale] }
)
if (!page.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Page not found',
    fatal: true
  })
}

const localePath = useLocalePath()
const title = page.value.seo?.title || page.value.title
const description = page.value.seo?.description || page.value.description

useSeoMeta({
  title,
  ogTitle: title,
  description,
  ogDescription: description
})
defineOgImage('Portfolio', { title, description, headline: t('nav.about') }, { alt: title })
</script>

<template>
  <UPage v-if="page">
    <UPageHero
      :title="page.title"
      :description="page.description"
      :ui="{ container: 'pt-12! pb-4! lg:pt-14! lg:pb-4!' }"
    />
    <section class="mx-auto w-full max-w-6xl px-4 pb-16">
      <figure class="mx-auto mb-8 w-full max-w-5xl">
        <NuxtImg
          src="/images/about/first-website.jpeg"
          :alt="page.title"
          class="block h-auto w-full rounded-xl"
          sizes="100vw lg:1024px"
        />
      </figure>
      <article class="prose prose-neutral dark:prose-invert mx-auto max-w-3xl">
        <MDC :value="page.content" />
        <p class="mt-8 text-sm">
          <NuxtLink :to="localePath('/about')">{{ t('nav.about') }}</NuxtLink>
        </p>
      </article>
    </section>
  </UPage>
</template>
