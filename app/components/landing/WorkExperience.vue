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
      <div class="flex flex-col gap-8 text-left">
        <Motion
          v-for="(experience, index) in page.experience.items"
          :key="index"
          :initial="{ opacity: 0, transform: 'translateY(20px)' }"
          :while-in-view="{ opacity: 1, transform: 'translateY(0)' }"
          :transition="{ delay: 0.2 + 0.15 * index }"
          :in-view-options="{ once: true }"
          class="relative pl-6 before:absolute before:left-[4.5px] before:top-4 before:-bottom-8 before:w-px before:bg-default last:before:hidden"
        >
          <span
            class="absolute left-0 top-1.5 size-2.5 rounded-full"
            :class="experience.current
              ? 'bg-success ring-4 ring-success/20'
              : 'bg-muted ring-2 ring-default'"
          />

          <div class="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
            <p class="font-semibold text-highlighted">
              {{ experience.position }}
            </p>
            <span class="text-xs text-muted whitespace-nowrap">
              {{ experience.date }}
            </span>
          </div>

          <ULink
            v-if="experience.company.url"
            :to="experience.company.url"
            target="_blank"
            class="mt-0.5 inline-flex items-center gap-1.5 text-sm font-medium hover:underline"
            :style="{ color: experience.company.color }"
          >
            {{ experience.company.name }}
            <UIcon :name="experience.company.logo" />
          </ULink>
          <span
            v-else
            class="mt-0.5 inline-flex items-center gap-1.5 text-sm font-medium"
            :style="{ color: experience.company.color }"
          >
            {{ experience.company.name }}
            <UIcon :name="experience.company.logo" />
          </span>

          <p
            v-if="experience.description"
            class="mt-2 text-sm leading-relaxed text-muted"
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
