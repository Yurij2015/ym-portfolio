<script setup lang="ts">
const { locale, t } = useI18n()
const route = useRoute()
const localePath = useLocalePath()
const { global } = useAppConfig()

const slug = computed(() => String(route.params.slug))

const { data: project } = await useAsyncData(
  () => `project-${locale.value}-${slug.value}`,
  () => queryCollection(`projects_${locale.value}` as 'projects_uk')
    .where('stem', '=', `${locale.value}/projects/${slug.value}`)
    .first(),
  { watch: [locale, slug] }
)
if (!project.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Project not found',
    fatal: true
  })
}

const title = project.value.title
const description = project.value.description

useSeoMeta({
  title,
  ogTitle: title,
  description,
  ogDescription: description
})

defineOgImage('Portfolio', { title, description, headline: t('nav.projects') }, { alt: title })

const visibleLinks = computed(() => (project.value?.links ?? []).filter(link => link.to && link.to !== '#'))

const { linkFor } = await useTechnologyLinks()
</script>

<template>
  <UPage v-if="project">
    <UPageSection :ui="{ container: 'pt-20! sm:pt-24!' }">
      <UButton
        :to="localePath('/projects')"
        variant="ghost"
        color="neutral"
        icon="i-lucide-arrow-left"
        :label="t('projects.back')"
        class="mb-6 -ml-2"
      />

      <UPageHero
        :title="title"
        :description="description"
        :ui="{
          container: 'pt-0! pb-10 lg:pb-12',
          title: 'mx-0! text-left',
          description: 'mx-0! text-left',
          links: 'justify-start'
        }"
      >
        <template #headline>
          <div class="flex w-fit items-center gap-1.5 rounded-full bg-elevated/60 px-3 py-1 text-xs font-medium text-muted">
            <UIcon name="i-lucide-calendar" class="size-3.5" />
            {{ formatProjectYear(project.date) }}
          </div>
        </template>
        <template #links>
          <div class="flex flex-wrap items-center gap-2">
            <UButton
              v-for="(link, index) in visibleLinks"
              :key="index"
              v-bind="link"
            />
          </div>
        </template>
      </UPageHero>

      <NuxtImg
        :src="project.image"
        :alt="project.title"
        width="1512"
        height="806"
        loading="lazy"
        class="w-full h-64 sm:h-96 object-cover rounded-xl"
      />

      <div
        v-if="project.stack?.length || project.tags?.length"
        class="mt-4 flex flex-wrap items-center gap-1"
      >
        <TechChip
          v-for="tech in project.stack"
          :key="tech.name"
          :name="tech.name"
          :icon="tech.icon"
          :to="linkFor(tech.name)"
          class="size-7"
        />
        <UBadge
          v-for="tag in project.tags"
          :key="tag"
          :label="tag"
          size="sm"
          color="neutral"
          variant="subtle"
        />
      </div>

      <div class="mt-10">
        <MDC
          v-if="project.content"
          :value="project.content"
        />
      </div>

      <UPageCTA
        class="mt-10"
        :title="t('projectsCta.title')"
        :description="t('projectsCta.description')"
        :links="[
          { label: t('contact.telegram'), to: global.meetingLink, color: 'primary', icon: 'i-simple-icons-telegram', target: '_blank' },
          { label: t('contact.email'), to: `mailto:${global.email}`, color: 'neutral', icon: 'i-heroicons-envelope' }
        ]"
      />
    </UPageSection>
  </UPage>
</template>
