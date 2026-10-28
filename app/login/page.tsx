import type { Metadata } from "next"

import { AuthForm } from "@/components/auth/AuthForm"
import { PageEnter } from "@/components/PageEnter"

export const metadata: Metadata = {
  title: "Log in",
  description: "Log in to return to your saved flight comparisons.",
}

interface LoginPageProps {
  searchParams?: { next?: string | string[]; email?: string | string[] }
}

function getEmail(value?: string | string[]) {
  const email = Array.isArray(value) ? value[0] : value
  return email?.trim().toLowerCase() ?? ""
}

function getNextPath(value?: string | string[]) {
  const path = Array.isArray(value) ? value[0] : value
  return path && path.startsWith("/") && !path.startsWith("//") && !path.includes("\\")
    ? path
    : "/saved"
}

export default function LoginPage({ searchParams }: LoginPageProps) {
  return (
    <PageEnter className="flex flex-1 flex-col">
      <AuthForm
        mode="login"
        nextPath={getNextPath(searchParams?.next)}
        initialEmail={getEmail(searchParams?.email)}
      />
    </PageEnter>
  )
}
