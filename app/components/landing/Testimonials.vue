<script setup lang="ts">
import type { IndexPageItem } from '~/utils/content-types'

const props = defineProps<{
  page: IndexPageItem
}>()

const { t } = useI18n()

const testimonials = computed(() => props.page.testimonials)

// Collapsed quotes clamp to the same line count so the grid row stays
// level; a toggle appears only where text is actually cut off.
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
        spotlight
        :ui="{
          container: 'h-full',
          description: 'min-h-24 flex flex-col'
        }"
      >
        <template #description>
          <div class="flex flex-1 flex-col gap-3">
            <div
              v-if="item.rating"
              class="flex gap-0.5 text-amber-400"
            >
              <UIcon
                v-for="n in item.rating"
                :key="n"
                name="i-heroicons-star-solid"
                class="size-4"
              />
            </div>
            <p
              :ref="el => setQuoteRef(el, index)"
              class="flex-1 text-base text-muted before:content-[open-quote] after:content-[close-quote]"
              :class="{ 'line-clamp-4': !expanded.has(index) }"
            >
              {{ item.quote }}
            </p>
            <UButton
              v-if="truncated[index] || expanded.has(index)"
              :label="expanded.has(index) ? t('common.showLess') : t('common.showMore')"
              :trailing-icon="expanded.has(index) ? 'i-heroicons-chevron-up' : 'i-heroicons-chevron-down'"
              color="neutral"
              variant="link"
              size="sm"
              class="self-start px-0"
              @click="toggle(index)"
            />
          </div>
        </template>
        <template #footer>
          <UUser
            v-bind="item.author"
            size="xl"
          />
        </template>
      </UPageCard>
    </div>
  </UPageSection>
</template>
