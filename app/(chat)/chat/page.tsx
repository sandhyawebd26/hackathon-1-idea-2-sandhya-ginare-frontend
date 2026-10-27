import { nanoid } from "@/lib/utils"
import { Chat } from "@/components/chat"
import { AI } from "@/lib/chat/actions"
import { getServerUser } from "@/lib/supabase/server"
import { getMissingKeys } from "../../actions"

export const metadata = {
  title: "A Una Milla travel assistant",
}

export default async function IndexPage() {
  const id = nanoid()
  const user = await getServerUser()
  const session = user ? { user: { id: user.id, email: user.email ?? "" } } : undefined
  const missingKeys = await getMissingKeys()

  return (
    <AI initialAIState={{ chatId: id, messages: [] }}>
      <Chat id={id} session={session} missingKeys={missingKeys} />
    </AI>
  )
}
