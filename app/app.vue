<script setup lang="ts">
const { getImages } = useFile()

useHead({
  link: [
    { rel: 'icon', href: '/favicon.ico' }
  ],
  htmlAttrs: {
    lang: 'en'
  }
})

const title = 'Unkey Image Gallery Starter'
const description = 'A Nuxt template to build your full-stack image gallery application secured with Unkey.'

useSeoMeta({
  title,
  ogTitle: title,
  description,
  ogDescription: description
})

await getImages()
</script>

<template>
  <div
    class="bg-black min-h-[100dvh] overflow-y-auto overflow-x-hidden relative"
    :class="{ 'flex flex-col md:block': $router.currentRoute.value.fullPath !== '/' }"
  >
    <UNotifications />
    <NuxtPage />
    <ImageThumbnailList
      :class="$router.currentRoute.value.fullPath !== '/' ? 'opacity-100 z-[9999]' : 'opacity-0 z-[-1]'"
    />
  </div>
</template>
