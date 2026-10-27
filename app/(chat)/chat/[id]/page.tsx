import type { Metadata } from "next"
import { notFound, redirect } from "next/navigation"

import { getChat, getMissingKeys } from "@/app/actions"
import { Chat } from "@/components/chat"
import { AI } from "@/lib/chat/actions"
import { getServerUser } from "@/lib/supabase/server"

export interface ChatPageProps {
  params: {
    id: string
  }
}

export async function generateMetadata({ params }: ChatPageProps): Promise<Metadata> {
  const user = await getServerUser()
  if (!user) return {}

  const chat = await getChat(params.id, user.id)
  return {
    title: chat?.title.toString().slice(0, 50) ?? "Chat",
  }
}

export default async function ChatPage({ params }: ChatPageProps) {
  const user = await getServerUser()
  const missingKeys = await getMissingKeys()

  if (!user) {
    redirect(`/login?next=${encodeURIComponent(`/chat/${params.id}`)}`)
  }

  const session = { user: { id: user.id, email: user.email ?? "" } }
  const chat = await getChat(params.id, user.id)

  if (!chat) redirect("/")
  if (chat.userId !== user.id) notFound()

  return (
    <AI initialAIState={{ chatId: chat.id, messages: chat.messages }}>
      <Chat
        id={chat.id}
        session={session}
        initialMessages={chat.messages}
        missingKeys={missingKeys}
      />
    </AI>
  )
}
