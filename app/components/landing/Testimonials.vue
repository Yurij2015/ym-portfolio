<script setup lang="ts">
import type { IndexPageItem } from '~/utils/content-types'

const props = defineProps<{
  page: IndexPageItem
}>()

const { t } = useI18n()

const testimonials = computed(() => props.page.testimonials)

// All cards share one fixed quote height so the grid row stays level;
// longer quotes get a "show more" toggle instead of stretching the row.
const COLLAPSED_HEIGHT = 'h-28'
const expanded = ref<Set<number>>(new Set())
const truncated = ref<boolean[]>([])
const quoteEls = ref<(HTMLElement | null)[]>([])

const setQuoteRef = (el: Element | null, index: number) => {
  quoteEls.value[index] = el as HTMLElement | null
}

const measure = async () => {
  await nextTick()
  truncated.value = quoteEls.value.map(el => !!el && el.scrollHeight > el.clientHeight + 1)
}

const toggle = (index: number) => {
  if (expanded.value.has(index)) {
    expanded.value.delete(index)
  } else {
    expanded.value.add(index)
  }
}

onMounted(measure)
watch(testimonials, measure)
</script>

<template>
  <UPageSection
    :ui="{
      container: 'px-0 pt-0!'
    }"
  >
    <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <UPageCard
        v-for="(item, index) in testimonials"
        :key="index"
        variant="subtle"
        :ui="{ container: 'h-full' }"
      >
        <template #description>
          <p
            :ref="el => setQuoteRef(el, index)"
            class="text-base text-muted before:content-[open-quote] after:content-[close-quote]"
            :class="expanded.has(index)
              ? ''
              : `${COLLAPSED_HEIGHT} overflow-hidden${truncated[index] ? ' [mask-image:linear-gradient(to_bottom,black_55%,transparent_95%)]' : ''}`"
          >
            {{ item.quote }}
          </p>
        </template>
        <template #footer>
          <div class="flex items-center justify-between gap-4">
            <UUser
              v-bind="item.author"
              size="xl"
            />
            <UButton
              v-if="truncated[index] || expanded.has(index)"
              :label="expanded.has(index) ? t('common.showLess') : t('common.showMore')"
              :trailing-icon="expanded.has(index) ? 'i-heroicons-chevron-up' : 'i-heroicons-chevron-down'"
              color="neutral"
              variant="link"
              size="sm"
              @click="toggle(index)"
            />
          </div>
        </template>
      </UPageCard>
    </div>
  </UPageSection>
</template>
