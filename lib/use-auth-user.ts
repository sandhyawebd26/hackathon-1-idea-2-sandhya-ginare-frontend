"use client"

import { useCallback, useEffect } from "react"
import useSWR from "swr"

import { toAuthUser, type AuthUser, loadAuthUser } from "@/lib/auth-client"
import { createClient } from "@/lib/supabase/client"

const AUTH_USER_CACHE_KEY = "a-una-milla:auth-user"

export function useAuthUser() {
  const { data: user, isLoading, error, mutate } = useSWR<AuthUser | null>(
    AUTH_USER_CACHE_KEY,
    () => loadAuthUser(),
    { revalidateOnFocus: true },
  )

  useEffect(() => {
    if (typeof window === "undefined") return

    const supabase = createClient()
    if (!supabase) return

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      void mutate(toAuthUser(session?.user), { revalidate: false })
    })

    return () => subscription.unsubscribe()
  }, [mutate])

  const setUser = useCallback(
    async (nextUser: AuthUser | null) => {
      await mutate(nextUser, { revalidate: false })
    },
    [mutate],
  )

  return { user: user ?? null, isLoading, error, setUser }
}
