"use client"

import { useRouter } from "next/navigation"

import { useUserDataStore } from "@/lib/store"
import { RegisterForm } from "@/components/auth/register-form"

const RegisterPage = async () => {
  const user = useUserDataStore((state: any) => state.user)
  const router = useRouter()
  if (user) {
    router.push("/")
  }
  return <RegisterForm />
}

export default RegisterPage
