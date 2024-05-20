"use client"

import { useState, useTransition } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { LoginSchema } from "@/schemas"
import { zodResolver } from "@hookform/resolvers/zod"
import axios from "axios"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { useUserDataStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { CardWrapper } from "@/components/auth/card-wrapper"
import { FormError } from "@/components/form-error"
import { FormSuccess } from "@/components/form-success"

export const LoginForm = () => {
  const searchParams = useSearchParams()
  const router = useRouter()

  const setUser = useUserDataStore((state: any) => state.setUser)
  const user = useUserDataStore((state: any) => state.user)

  const [error, setError] = useState<string | undefined>("")
  const [success, setSuccess] = useState<string | undefined>("")
  const [isPending, startTransition] = useTransition()

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  if (user) {
    router.push("/")
    return
  }

  function sendMessageToExtension(userData: {
    id: String
    email: String
    extension_id: String
  }) {
    //@ts-ignore
    if (!chrome) {
      console.error("Chrome is not defined")
      return
    }
    const editorExtensionId = userData?.extension_id
    try {
      console.log(editorExtensionId)
      //@ts-ignore
      chrome.runtime.sendMessage(
        editorExtensionId,
        { action: "storeUserData", data: userData },
        (response: any) => {
          if (!response.success) {
            console.error("Error storing user data:", response.error)
          } else {
            console.log("User data stored successfully:", response)
          }
        }
      )
    } catch (e) {
      console.log(e)
    }
  }

  const login = async (obj: { user: { email: String; password: String } }) => {
    console.log(obj)
    try {
      const res = await axios.post("https://mysite-1wyv.onrender.com/login", {
        user: {
          email: obj.user.email,
          password: obj.user.password,
        },
      })
      console.log(res?.data)
      const userData = {
        id: res?.data?.id,
        email: res?.data?.email,
        extension_id: res?.data?.extension_id,
      }
      setUser(userData)

      sendMessageToExtension(userData)

      setSuccess("Logged in successfully!")
    } catch (e: any) {
      console.log(e)
      setError(String(e.response.data.error))
    }
  }

  const onSubmit = (values: z.infer<typeof LoginSchema>) => {
    setError("")
    setSuccess("")

    startTransition(() => {
      login({
        user: {
          email: values.email,
          password: values.password,
        },
      })
    })
  }

  return (
    <CardWrapper
      headerLabel="Welcome back"
      backButtonLabel="Don't have an account?"
      backButtonHref="/auth/register"
      showSocial
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="john.doe@example.com"
                      type="email"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="******"
                      type="password"
                    />
                  </FormControl>
                  <Button
                    size="sm"
                    variant="link"
                    asChild
                    className="px-0 font-normal"
                  >
                    <Link href="/auth/reset">Forgot password?</Link>
                  </Button>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormError message={error} />
          <FormSuccess message={success} />
          <Button disabled={isPending} type="submit" className="w-full">
            Login
          </Button>
        </form>
      </Form>
    </CardWrapper>
  )
}
