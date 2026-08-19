<script setup lang="ts">
import type { IndexPageItem } from '~/utils/content-types'

defineProps<{
  page: IndexPageItem
}>()
</script>

<template>
  <UPageSection
    :title="page.experience.title"
    :ui="{
      container: 'p-0! gap-4 sm:gap-4',
      title: 'text-left text-xl sm:text-xl lg:text-2xl font-medium',
      description: 'mt-2'
    }"
  >
    <template #description>
      <div class="flex flex-col gap-6">
        <Motion
          v-for="(experience, index) in page.experience.items"
          :key="index"
          :initial="{ opacity: 0, transform: 'translateY(20px)' }"
          :while-in-view="{ opacity: 1, transform: 'translateY(0)' }"
          :transition="{ delay: 0.4 + 0.2 * index }"
          :in-view-options="{ once: true }"
          class="relative border-l border-default pl-5"
        >
          <span class="absolute -left-[5px] top-1.5 size-2.5 rounded-full bg-primary-400" />

          <div class="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5">
            <ULink
              v-if="experience.company.url"
              :to="experience.company.url"
              target="_blank"
              class="inline-flex items-center gap-1.5 font-medium hover:underline"
              :style="{ color: experience.company.color }"
            >
              {{ experience.company.name }}
              <UIcon :name="experience.company.logo" />
            </ULink>
            <span
              v-else
              class="inline-flex items-center gap-1.5 font-medium"
              :style="{ color: experience.company.color }"
            >
              {{ experience.company.name }}
              <UIcon :name="experience.company.logo" />
            </span>
            <span class="text-xs text-muted">{{ experience.date }}</span>
          </div>

          <p class="mt-0.5 text-sm text-muted">
            {{ experience.position }}
          </p>
          <p
            v-if="experience.description"
            class="mt-1 text-sm text-muted/90"
          >
            {{ experience.description }}
          </p>
        </Motion>

        <UButton
          v-if="page.experience.link"
          v-bind="{ target: '_blank', variant: 'link', ...page.experience.link }"
          class="self-start px-0"
        />
      </div>
    </template>
  </UPageSection>
</template>
