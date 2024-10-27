import { Unkey } from '@unkey/api'

export default eventHandler(async (event) => {
  const body = (await readBody(event)) || {}
  const session = await getUserSession(event)

  if (!session.user) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  if (session.user.role !== 'contributor') {
    throw createError({ statusCode: 403, statusMessage: 'Insufficient permissions' })
  }

  const unkey = new Unkey({
    rootKey: process.env.NUXT_UNKEY_ROOT_KEY!,
    cache: 'no-cache'
  })

  const created = await unkey.keys.create({
    apiId: process.env.NUXT_UNKEY_API_ID!,
    expires: Date.now() + 24 * 60 * 60 * 1000,
    meta: { role: body.role }
  })

  if (created.error) {
    console.error(created.error)
    throw createError({ statusCode: 500, statusMessage: 'Failed to generate new key' })
  }

  return { key: created.result.key }
})
