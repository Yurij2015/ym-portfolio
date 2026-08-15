<script setup lang="ts">
const { locale, t } = useI18n()

const { data: page } = await useAsyncData(
  () => `projects-page-${locale.value}`,
  () => queryCollection(`pages_${locale.value}` as 'pages_uk').first(),
  { watch: [locale] }
)
if (!page.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Page not found',
    fatal: true
  })
}

const { data: projects } = await useAsyncData(
  () => `projects-${locale.value}`,
  () => queryCollection(`projects_${locale.value}` as 'projects_uk').all(),
  { watch: [locale] }
)

const { global } = useAppConfig()

const title = page.value?.seo?.title || page.value?.title
const description = page.value?.seo?.description || page.value?.description

useSeoMeta({
  title,
  ogTitle: title,
  description,
  ogDescription: description
})

defineOgImage('Portfolio', { title, description, headline: t('nav.projects') }, { alt: title })
</script>

<template>
  <UPage v-if="page">
    <UPageHero
      :title="page.title"
      :description="page.description"
      :links="page.links"
      :ui="{
        title: 'mx-0! text-left',
        description: 'mx-0! text-left',
        links: 'justify-start'
      }"
    >
      <template #links>
        <div
          v-if="page.links"
          class="flex items-center gap-2"
        >
          <UButton
            :label="page.links[0]?.label"
            :to="global.meetingLink"
            v-bind="page.links[0]"
          />
          <UButton
            :to="`mailto:${global.email}`"
            v-bind="page.links[1]"
          />
        </div>
      </template>
    </UPageHero>
    <UPageSection
      :ui="{
        container: 'pt-0!'
      }"
    >
      <Motion
        v-for="(project, index) in projects"
        :key="project.title"
        :initial="{ opacity: 0, transform: 'translateY(10px)' }"
        :while-in-view="{ opacity: 1, transform: 'translateY(0)' }"
        :transition="{ delay: 0.2 * index }"
        :in-view-options="{ once: true }"
      >
        <UPageCard
          :title="project.title"
          :to="project.url"
          orientation="horizontal"
          variant="naked"
          :reverse="index % 2 === 1"
          class="group"
          :ui="{
            wrapper: 'max-sm:order-last'
          }"
        >
          <template #description>
            {{ project.description }}
            <div
              v-if="project.tags?.length"
              class="mt-2 flex flex-wrap gap-1"
            >
              <UBadge
                v-for="tag in project.tags"
                :key="tag"
                :label="tag"
                size="sm"
                color="neutral"
                variant="subtle"
              />
            </div>
          </template>
          <template #leading>
            <span class="text-sm text-muted">
              {{ formatProjectYear(project.date) }}
            </span>
          </template>
          <template #footer>
            <ULink
              :to="project.url"
              class="text-sm text-primary flex items-center"
            >
              {{ t('common.viewProject') }}
              <UIcon
                name="i-lucide-arrow-right"
                class="size-4 text-primary transition-all opacity-0 group-hover:translate-x-1 group-hover:opacity-100"
              />
            </ULink>
          </template>
          <NuxtImg
            :src="project.image"
            :alt="project.title"
            width="1512"
            height="806"
            loading="lazy"
            class="object-cover w-full h-48 rounded-lg"
          />
        </UPageCard>
      </Motion>
    </UPageSection>
    <UPageCTA
      :title="t('projectsCta.title')"
      :description="t('projectsCta.description')"
      :links="[
        { label: t('contact.telegram'), to: global.meetingLink, color: 'primary', icon: 'i-simple-icons-telegram', target: '_blank' },
        { label: t('contact.email'), to: `mailto:${global.email}`, color: 'neutral', icon: 'i-heroicons-envelope' }
      ]"
    />
  </UPage>
</template>
