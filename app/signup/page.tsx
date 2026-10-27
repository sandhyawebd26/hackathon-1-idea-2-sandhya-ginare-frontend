import type { Metadata } from "next"

import { AuthForm } from "@/components/auth/AuthForm"
import { PageEnter } from "@/components/PageEnter"

export const metadata: Metadata = {
  title: "Create your account",
  description: "Create an account to save and revisit your flight comparisons.",
}

interface SignupPageProps {
  searchParams?: { next?: string | string[] }
}

function getNextPath(value?: string | string[]) {
  const path = Array.isArray(value) ? value[0] : value
  return path && path.startsWith("/") && !path.startsWith("//") && !path.includes("\\")
    ? path
    : "/saved"
}

export default function SignupPage({ searchParams }: SignupPageProps) {
  return (
    <PageEnter className="flex flex-1 flex-col">
      <AuthForm mode="signup" nextPath={getNextPath(searchParams?.next)} />
    </PageEnter>
  )
}
