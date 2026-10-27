'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { kv } from '@vercel/kv'

import { getServerUser } from '@/lib/supabase/server'
import { type Chat } from '@/lib/types'

export async function getChats(userId?: string | null) {
  if (!userId) {
    return []
  }

  try {
    const pipeline = kv.pipeline()
    const chats: string[] = await kv.zrange(`user:chat:${userId}`, 0, -1, {
      rev: true
    })

    for (const chat of chats) {
      pipeline.hgetall(chat)
    }

    const results = await pipeline.exec()

    return results as Chat[]
  } catch (error) {
    return []
  }
}

export async function getChat(id: string, userId: string) {
  const chat = await kv.hgetall<Chat>(`chat:${id}`)

  if (!chat || (userId && chat.userId !== userId)) {
    return null
  }

  return chat
}

export async function removeChat({ id, path }: { id: string; path: string }) {
  const user = await getServerUser()

  if (!user) {
    return {
      error: 'Unauthorized'
    }
  }

  const uid = String(await kv.hget(`chat:${id}`, 'userId'))

  if (uid !== user.id) {
    return {
      error: 'Unauthorized'
    }
  }

  await kv.del(`chat:${id}`)
  await kv.zrem(`user:chat:${user.id}`, `chat:${id}`)

  revalidatePath('/')
  return revalidatePath(path)
}

export async function clearChats() {
  const user = await getServerUser()

  if (!user?.id) {
    return {
      error: 'Unauthorized'
    }
  }

  const chats: string[] = await kv.zrange(`user:chat:${user.id}`, 0, -1)
  if (!chats.length) {
    return redirect('/')
  }
  const pipeline = kv.pipeline()

  for (const chat of chats) {
    pipeline.del(chat)
    pipeline.zrem(`user:chat:${user.id}`, chat)
  }

  await pipeline.exec()

  revalidatePath('/')
  return redirect('/')
}

export async function getSharedChat(id: string) {
  const chat = await kv.hgetall<Chat>(`chat:${id}`)

  if (!chat || !chat.sharePath) {
    return null
  }

  return chat
}

export async function shareChat(id: string) {
  const user = await getServerUser()

  if (!user?.id) {
    return {
      error: 'Unauthorized'
    }
  }

  const chat = await kv.hgetall<Chat>(`chat:${id}`)

  if (!chat || chat.userId !== user.id) {
    return {
      error: 'Something went wrong'
    }
  }

  const payload = {
    ...chat,
    sharePath: `/share/${chat.id}`
  }

  await kv.hmset(`chat:${chat.id}`, payload)

  return payload
}

export async function saveChat(chat: Chat) {
  const user = await getServerUser()

  if (user) {
    const ownedChat = { ...chat, userId: user.id }
    const pipeline = kv.pipeline()
    pipeline.hmset(`chat:${chat.id}`, ownedChat)
    pipeline.zadd(`user:chat:${user.id}`, {
      score: Date.now(),
      member: `chat:${chat.id}`
    })
    await pipeline.exec()
  } else {
    return
  }
}

export async function refreshHistory(path: string) {
  redirect(path)
}

/** Chat uses rule-based tools + /api/search — no OpenAI key required for the hackathon demo. */
export async function getMissingKeys() {
  return [] as string[]
}
