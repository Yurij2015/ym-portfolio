<script setup lang="ts">
defineOptions({
  inheritAttrs: false
})

defineProps<{
  headline?: string
  title?: string
  description?: string
}>()
</script>

<template>
  <div
    class="w-full h-full flex bg-neutral-950 relative overflow-hidden"
    data-theme="dark"
    :style="{ fontFamily: `'Inter', sans-serif` }"
  >
    <div class="absolute top-0 left-0 w-1.5 h-full bg-primary-400" />
    <div class="absolute -top-32 -right-32 size-128 rounded-full bg-primary-600/20" />
    <div class="absolute -bottom-40 -left-20 size-96 rounded-full bg-primary-900/30" />

    <div class="flex flex-col justify-between flex-1 px-20 py-16">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-4">
          <div class="size-14 rounded-full bg-primary-400 flex items-center justify-center">
            <span class="text-2xl font-bold text-neutral-950">YM</span>
          </div>
          <span class="text-2xl font-semibold text-highlighted">Yurii Mokryi</span>
        </div>
        <span class="text-xl text-dimmed">digispace.pro</span>
      </div>

      <div class="flex flex-col gap-5">
        <span
          v-if="headline"
          class="text-2xl font-medium text-primary-400"
        >
          {{ headline }}
        </span>

        <h1
          v-if="title"
          class="text-6xl font-bold text-highlighted"
          :style="{ lineClamp: 2, textOverflow: 'ellipsis' }"
        >
          {{ title }}
        </h1>

        <p
          v-if="description"
          class="text-3xl/11 text-muted"
          :style="{ lineClamp: 2, textOverflow: 'ellipsis' }"
        >
          {{ description }}
        </p>
      </div>

      <div class="flex items-center gap-4">
        <span class="text-2xl font-bold text-primary-400">DigiSpace</span>
        <div class="h-px flex-1 bg-border" />
        <span class="text-xl text-dimmed">Senior Full-Stack PHP Developer</span>
      </div>
    </div>
  </div>
</template>
