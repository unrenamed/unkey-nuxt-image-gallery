import { verifyKey } from '@unkey/api'
import type { UserRole } from '#auth-utils'

export default eventHandler(async (event) => {
  const body = (await readBody(event)) || {}
  const session = await getUserSession(event)

  if (session.lastAttemptAt && Date.now() - session.lastAttemptAt < 5000)
    throw createError({ statusCode: 429, statusMessage: 'Too Many Requests' })

  const { result, error } = await verifyKey({
    key: body.apiKey,
    apiId: process.env.NUXT_UNKEY_API_ID!
  })

  if (error) {
    console.error(error)
    await setUserSession(event, { lastAttemptAt: Date.now() })
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  if (!result.valid) {
    await setUserSession(event, { lastAttemptAt: Date.now() })
    throw createError({ statusCode: 401, statusMessage: 'Key is invalid or has expired' })
  }

  const role = result.meta?.['role']
  if (!role || !['viewer', 'contributor'].includes(role as string)) {
    await setUserSession(event, { lastAttemptAt: Date.now() })
    throw createError({ statusCode: 403, statusMessage: 'Insufficient permissions' })
  }

  await setUserSession(event, {
    user: { role: role as UserRole }
  })

  return { loggedIn: true }
})
