<script setup lang="ts">
type LocaleCode = 'uk' | 'en' | 'pl'

const { locale, locales } = useI18n()
const switchLocalePath = useSwitchLocalePath()

const availableLocales = computed(() =>
  locales.value as Array<{ code: LocaleCode, name?: string }>
)

const currentLocale = computed(() =>
  availableLocales.value.find(l => l.code === locale.value) ?? availableLocales.value[0]
)

const items = computed(() => [
  availableLocales.value.map(l => ({
    label: l.name ?? l.code.toUpperCase(),
    active: l.code === locale.value,
    onSelect: () => navigateTo(switchLocalePath(l.code))
  }))
])
</script>

<template>
  <UDropdownMenu
    :items="items"
    :content="{ align: 'end' }"
  >
    <UButton
      :label="currentLocale?.code.toUpperCase()"
      :aria-label="`Current language: ${currentLocale?.name ?? currentLocale?.code}`"
      color="neutral"
      variant="ghost"
      size="sm"
      class="rounded-full"
    />
  </UDropdownMenu>
</template>
