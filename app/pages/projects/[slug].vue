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
</script>

<template>
  <UPage v-if="project">
    <UPageSection :ui="{ container: 'pt-0!' }">
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
          container: 'py-8 sm:py-10',
          title: 'mx-0! text-left',
          description: 'mx-0! text-left',
          links: 'justify-start'
        }"
      >
        <template #headline>
          <span class="text-sm text-muted">{{ formatProjectYear(project.date) }}</span>
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
        <span
          v-for="tech in project.stack"
          :key="tech.name"
          :title="tech.name"
          class="inline-flex items-center justify-center size-7 rounded-md bg-elevated/60 text-dimmed"
        >
          <UIcon
            :name="tech.icon"
            class="size-4"
          />
        </span>
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
