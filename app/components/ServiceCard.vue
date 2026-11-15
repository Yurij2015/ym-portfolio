<script setup lang="ts">
defineProps<{
  service: {
    stem?: string
    title: string
    description: string
    icon: string
    priceFrom: number
    priceUnit?: 'project' | 'hour'
    priceCurrency?: 'USD' | 'PLN'
  }
}>()

const { t } = useI18n()
const localePath = useLocalePath()

const slugOf = (service: { stem?: string }) =>
  String(service.stem ?? '').split('/').pop() ?? ''
</script>

<template>
  <NuxtLink
    :to="localePath(`/services/${slugOf(service)}`)"
    class="group flex flex-col rounded-xl border border-default bg-elevated/30 p-5 transition-colors hover:border-primary/50"
  >
    <span class="inline-flex items-center justify-center size-10 rounded-lg bg-elevated text-primary">
      <UIcon
        :name="service.icon"
        class="size-5"
      />
    </span>
    <h3 class="mt-4 font-semibold text-highlighted group-hover:text-primary transition-colors">
      {{ service.title }}
    </h3>
    <p class="mt-1 text-sm text-muted line-clamp-3 flex-1">
      {{ service.description }}
    </p>
    <p class="mt-4 text-sm font-medium text-default">
      {{ t(servicePriceKey(service), { price: service.priceFrom }) }}
    </p>
  </NuxtLink>
</template>
