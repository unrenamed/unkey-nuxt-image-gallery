<script setup lang="ts">
const emit = defineEmits(['close'])
const loading = ref(false)

const toast = useToast()

async function generate(role: string) {
  if (loading.value || !role) return
  loading.value = true
  await $fetch('/api/key', {
    method: 'POST',
    body: { role }
  })
    .then(async (res) => {
      await navigator.clipboard.writeText(res.key)
      toast.add({
        title: `Copied key to clipboard`,
        color: 'green'
      })
      emit('close')
    })
    .catch((err) => {
      toast.add({
        title: `Error ${err.statusCode}`,
        description: `${err.data?.message || err.message}. Please try again`,
        color: 'red'
      })
    })
  loading.value = false
}
</script>

<template>
  <div
    class="flex flex-col gap-y-4 p-4 items-center"
  >
    <h1 class="text-lg text-gray-300">
      Generate new API key
    </h1>

    <p class="text-xs sm:text-sm text-gray-400">
      The new API key will be valid for 24 hours from the time of issuance.
    </p>

    <UButton
      :loading="loading"
      type="submit"
      color="orange"
      class="px-4"
      size="lg"
      @click="generate('viewer')"
    >
      <UIcon
        name="i-heroicons-eye"
        class="w-4 h-4"
      />
      With viewing access only
    </UButton>

    <UButton
      :loading="loading"
      type="submit"
      color="green"
      class="px-4"
      size="lg"
      @click="generate('contributor')"
    >
      <UIcon
        name="i-heroicons:rocket-launch-20-solid"
        class="w-4 h-4"
      />
      With full contributon access
    </UButton>

    <UButton
      icon="i-heroicons-x-mark"
      color="gray"
      variant="ghost"
      size="xs"
      class="absolute right-2 top-2"
      @click="$emit('close')"
    />
  </div>
</template>
