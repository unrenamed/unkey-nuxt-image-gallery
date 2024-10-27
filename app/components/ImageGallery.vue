<script setup lang="ts">
const isLoginModalOpen = ref(true)
const isKeyGenerationModalOpen = ref(false)

const dropZoneRef = ref<HTMLElement>()
const fileInput = ref<HTMLInputElement>()
const mansoryItem = ref<Array<HTMLElement>>([])
const deletingImg = ref('')
const uploadingImg = ref(false)
const disconnect = ref(false)

const toast = useToast()
const { uploadImage, deleteImage, images } = useFile()
const { loggedIn, clear, user } = useUserSession()

const active = useState()

const { isOverDropZone } = useDropZone(dropZoneRef, onDrop)

function openFilePicker() {
  fileInput.value?.click()
}

async function fileSelection(event: Event) {
  const target = event.target as HTMLInputElement

  if (target.files?.[0]) {
    await uploadFile(target.files[0])
  }
}

async function onDrop(files: File[] | null) {
  if (files) {
    await uploadFile(files[0] as File)
  }
}

async function uploadFile(file: File) {
  uploadingImg.value = true

  await uploadImage(file)
    .catch(() => toast.add({ title: 'An error occured', description: 'Please try again', color: 'red' }))
    .finally(() => uploadingImg.value = false)
}

async function deleteFile(pathname: string) {
  deletingImg.value = pathname

  await deleteImage(pathname)
    .catch(() => toast.add({ title: 'An error occured', description: 'Please try again', color: 'red' }))
    .finally(() => deletingImg.value = '')
}

async function clearSession() {
  disconnect.value = true

  await clear().finally(() => disconnect.value = false)
}
</script>

<template>
  <div>
    <UModal
      v-if="!loggedIn"
      v-model="isLoginModalOpen"
      class="flex items-center justify-center relative"
      side="left"
    >
      <LoginForm
        class="z-50 bg-gray-800 rounded-md"
        @close="isLoginModalOpen = false"
      />
    </UModal>

    <UModal
      v-if="loggedIn && user?.role === 'contributor'"
      v-model="isKeyGenerationModalOpen"
      class="flex items-center justify-center relative"
      side="left"
    >
      <KeyGenerator
        class="z-50 bg-gray-800 rounded-md"
        @close="isKeyGenerationModalOpen = false"
      />
    </UModal>

    <BottomMenu class="bottom-menu">
      <template #logo>
        <img
          src="/logo.svg"
          width="29"
          height="20"
        >
      </template>
      <template #invitation>
        <div>
          <UButton
            v-if="loggedIn && user?.role === 'contributor'"
            :loading="disconnect"
            class="border border-neutral-600 active:scale-95 rounded-xl"
            icon="i-heroicons:sparkles-16-solid"
            color="white"
            variant="ghost"
            @click="isKeyGenerationModalOpen = true"
          >
            Generate new API key
          </UButton>
          <div
            v-else
            class="flex gap-x-4 items-center"
          >
            <p class="bottom-menu-description text-sm sm:text-base leading-tight sm:leading-normal">
              Image Gallery template
            </p>
            <NuxtLink
              to="https://github.com/unrenamed/unkey-nuxt-image-gallery"
              target="blank"
              class="flex items-center"
            >
              <UIcon
                name="i-simple-icons-github"
                class="w-5 h-5"
              />
            </NuxtLink>
          </div>
        </div>
      </template>
      <template #buttons>
        <div class="flex gap-x-2">
          <UButton
            v-if="loggedIn"
            :loading="disconnect"
            icon="i-heroicons-power-20-solid"
            color="red"
            variant="ghost"
            @click="clearSession"
          />
          <UButton
            v-else
            label="Sign in"
            color="green"
            variant="ghost"
            aria-label="Sign in"
            class="mr-4 sm:mr-0"
            @click="isLoginModalOpen = true"
          />
        </div>
      </template>
    </BottomMenu>

    <section
      v-if="loggedIn && user && images"
      ref="dropZoneRef"
      class="relative h-screen gap-[22px] p-4"
    >
      <div
        class="w-full pb-8"
        :class="{ 'masonry-container': images && images.length }"
      >
        <div v-if="user.role === 'contributor'">
          <input
            ref="fileInput"
            class="hidden"
            type="file"
            accept="image/*"
            @change="fileSelection"
          >
          <UploadButton
            :uploading="uploadingImg"
            type="submit"
            class="mb-6"
            :is-over-drop-zone="isOverDropZone"
            @click="openFilePicker"
          />
        </div>
        <div
          v-else
          class="text-white flex flex-col gap-y-4 justify-center h-full w-full pb-8"
        >
          <h1
            className="text-2xl sm:text-5xl font-bold sm:uppercase tracking-widest bg-gradient-to-r from-green-500 via-emerald-600 to-lime-500 bg-clip-text text-transparent"
          >
            2024 Image Gallery
          </h1>
          <p class="text-sm sm:text-lg text-gray-400">
            Keep your favorite moments safe and accessible. With advanced protection and easy access, your photos are
            always
            just a click away.
          </p>
        </div>

        <ul
          v-if="images && images.length"
          class="grid grid-cols-1 gap-4 lg:block"
        >
          <li
            v-for="image in images"
            ref="mansoryItem"
            :key="image.pathname"
            class="relative w-full group masonry-item"
          >
            <UButton
              v-if="user.role === 'contributor'"
              :loading="deletingImg === image.pathname"
              color="white"
              icon="i-heroicons-trash-20-solid"
              class="absolute top-4 right-4 z-[9999] opacity-0 group-hover:opacity-100"
              @click="deleteFile(image.pathname)"
            />
            <NuxtLink
              :to="`/detail/${image.pathname.split('.')[0]}`"
              @click="active = image.pathname.split('.')[0]"
            >
              <img
                v-if="image"
                width="527"
                height="430"
                :src="`/images/${image.pathname}`"
                :class="{ imageEl: image.pathname.split('.')[0] === active }"
                class="h-auto w-full max-h-[430px] rounded-md transition-all duration-200 border-image brightness-[.8] hover:brightness-100 will-change-[filter] object-cover"
              >
            </NuxtLink>
          </li>
        </ul>
      </div>
    </section>
    <div
      v-else
      class="mt-20 text-2xl text-white flex flex-col gap-y-4 items-center justify-center h-full w-full pb-8"
    >
      <h1 class="text-center text-4xl font-extrabold leading-[1.15] sm:text-6xl sm:leading-[1.15]">
        Secure Your Media Library
        <br>
        <span class="bg-gradient-to-r from-green-500 via-emerald-600 to-lime-500 bg-clip-text text-transparent">
          with Unkey
        </span>
      </h1>
      <p class="text-center text-gray-400 text-sm sm:text-lg">
        You must be logged in to start viewing images
      </p>

      <div class="absolute inset-0 flex items-center justify-center opacity-20">
        <span class="flex max-h-full max-w-full items-center justify-center">
          <BridgeIcon />
        </span>
        <span class="absolute left-0 right-0 bottom-0 h-[600px] bg-gradient-to-b from-black/0 via-black to-black" />
      </div>
    </div>
  </div>
</template>

<style scoped lang="postcss">
@media (min-width: 768px) {
  .imageEl {
    view-transition-name: vtn-image;
  }

  .bottom-menu-description {
    view-transition-name: vtn-bottom-menu-description;
  }

  .bottom-menu-button {
    view-transition-name: vtn-bottom-menu-button;
  }

  .container-image {
    background-color: rgba(255, 255, 255, 0.1)
  }

  .container-image:hover {
    background-color: transparent;
  }

  .border-image {
    border-width: 1.15px;
    border-color: rgba(255, 255, 255, 0.1)
  }
}

@media screen and (min-width: 1024px) {
  .masonry-container {
    column-count: 3;
    column-gap: 20px;
    column-fill: balance;
    margin: 20px auto 0;
    padding: 2rem;
  }

  .masonry-item,
  .upload {
    display: inline-block;
    margin: 0 0 20px;
    -webkit-column-break-inside: avoid;
    page-break-inside: avoid;
    break-inside: avoid;
    width: 100%;
  }
}
</style>
