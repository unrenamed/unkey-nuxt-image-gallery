# Secure Your Media Library with Unkey

This templates utilizes [Unkey's API](https://www.unkey.com/docs/api-reference/overview) to secure your media library with time-sensitive API keys. Invite others to view and contribute to your collection while ensuring that only authorized users have access to your valuable digital content.

## Features

- 📷 Image upload and display with [`hubBlob()`](http://hub.nuxt.com/docs/storage/blob)
- 🖼️ Image Filters: Apply a variety of filters to your images.
- 💾 Saving: Save your images with applied filters.
- 🌐 Cloud Storage: Blob powered by NuxtHub (cloudflare R2).
- 🎠 Custom Carousel: Includes a custom carousel component that can be adapted for in-house use.
- 🏃🏻 [View transition API](https://developer.chrome.com/docs/web-platform/view-transitions) The View Transitions API provides a mechanism for easily creating animated transitions between different DOM states while also updating the DOM contents in a single step.
- 🔑 [Nuxt Auth Utils](https://github.com/Atinux/nuxt-auth-utils) Minimalist Authentication module for Nuxt exposing Vue composables and server utils combined with [Unkey](https://www.unkey.com/) for securing and generating temporary access to your API at any scale.

## Stack

- [NuxtHub](https://hub.nuxt.com) - A Nuxt toolkit to build fullstack applications on the edge
- [NuxtUI](https://ui.nuxt.com/getting-started) - A UI Library for Modern Web Apps
- [Nuxt Fonts](https://github.com/nuxt/fonts) - Plug-and-play custom web font optimization and configuration for Nuxt apps
- [VueUse](https://github.com/antfu/vueuse) - Collection of useful composition APIs
- [ESLint](https://eslint.org/) with [@nuxt/eslint-config](https://github.com/nuxt/eslint), single quotes, no semi
- [TypeScript](https://www.typescriptlang.org/)

## Getting started

### Create a Unkey Root Key

1. Navigate to [Unkey Root Keys](https://app.unkey.com/settings/root-key) and click **"Create New Root Key"**.
2. Name your root key.
3. Select the following workspace permissions:
   - `create_key`
   - `read_key`
   - `encrypt_key`
   - `decrypt_key`
4. Click **"Create"** and save your root key securely.

### Create a Unkey API

1. Go to [Unkey APIs](https://app.unkey.com/apis) and click **"Create New API"**.
2. Enter a name for the API.
3. Click **"Create"**.

### Generate your first API Key

> This step is required only once for the first user. You can generate additional keys for other users from within the app.

1. From the [Unkey APIs](https://app.unkey.com/apis) page, select your newly created API.
2. Click **"Create Key"** in the top right corner.
3. In `Meta` section add this JSON:
   ```json
   { "role": "contributor" }
   ```
4. Click **"Create"** and copy the generated key. You'll use it on your first login.

## Setup

1. Clone this repository to your local machine.
2. Install dependencies using the command `pnpm install` or your favorite package manager.
3. Run the application with the command `pnpm dev` or your favorite package manager.

> If you don't have pnpm installed, run: `corepack enable pnpm`

## Environment Variables

Create a `.env` file in the root directory and populate it with the following environment variables:

```env
NUXT_UNKEY_ROOT_KEY=your-unkey-root-key
NUXT_UNKEY_API_ID=your-unkey-api-id
```

Ensure you replace `your-unkey-*` with your actual Unkey credentials.

## Development

```bash
pnpm dev
```

### Remote Storage

Once you deployed your project, you can connect to your remote database locally running:

```bash
pnpm dev --remote
```

### Deploy

You can deploy this project on your Cloudflare account for free and with zero configuration using [NuxtHub](https://hub.nuxt.com).

```bash
npx nuxthub deploy
```

It's also possible to leverage Cloudflare Pages CI for deploying, learn more about the different options on https://hub.nuxt.com/docs/getting-started/deploy

Learn more about remote storage on https://hub.nuxt.com/docs/getting-started/remote-storage
