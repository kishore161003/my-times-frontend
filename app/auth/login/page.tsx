"use client"

import { useRouter } from "next/navigation"

import { useUserDataStore } from "@/lib/store"
import { LoginForm } from "@/components/auth/login-form"

const LoginPage = () => {
  const user = useUserDataStore((state: any) => state.user)
  const router = useRouter()
  if (user) {
    router.push("/")
  }
  return <LoginForm />
}

export default LoginPage
