<script setup lang="ts">
const emit = defineEmits(['close'])
const { fetch: refreshSession } = useUserSession()
const apiKey = ref('')
const loading = ref(false)

const toast = useToast()

async function login() {
  if (loading.value || !apiKey.value) return
  loading.value = true
  await $fetch('/api/auth', {
    method: 'POST',
    body: { apiKey: apiKey.value }
  })
    .then(async () => {
      await refreshSession()
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
  <form
    class="flex flex-col gap-y-4 p-4 items-center"
    @submit.prevent="login"
  >
    <h1 class="text-lg text-gray-300">
      Login to see images
    </h1>
    <UInput
      v-model="apiKey"
      type="password"
      placeholder="Enter API key"
      icon="i-heroicons-key"
      class="!w-60"
    />

    <UButton
      :loading="loading"
      type="submit"
      label="Login"
      color="green"
      variant="ghost"
      class="px-4"
      size="lg"
      :disabled="!apiKey"
    />

    <UButton
      icon="i-heroicons-x-mark"
      color="gray"
      variant="ghost"
      size="xs"
      class="absolute right-2 top-2"
      @click="$emit('close')"
    />
  </form>
</template>
