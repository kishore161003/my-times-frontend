"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { RegisterSchema } from "@/schemas"
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

export const RegisterForm = () => {
  const [error, setError] = useState<string | undefined>("")
  const [success, setSuccess] = useState<string | undefined>("")
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  const setUser = useUserDataStore((state: any) => state.setUser)
  const user = useUserDataStore((state: any) => state.user)
  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      email: "",
      password: "",
      name: "",
      extensionId: "",
    },
  })
  const [extensionId, setExtensionId] = useState("")

  if (user) {
    router.push("/")
  }

  function sendMessageToExtension(userData: { id: String; email: String }) {
    //@ts-ignore
    if (!chrome) {
      console.error("Chrome is not defined")
      return
    }

    try {
      console.log(extensionId)
      //@ts-ignore
      chrome.runtime.sendMessage(
        extensionId,
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

  const create = async (obj: {
    user: { name: String; email: String; password: String; extensionId: String }
  }) => {
    console.log(obj)
    try {
      const res = await axios.post("https://mysite-1wyv.onrender.com/users", {
        user: {
          name: obj.user.name,
          email: obj.user.email,
          password: obj.user.password,
          extension_id: obj.user.extensionId,
        },
      })
      console.log(res?.data)
      const userData = {
        id: res?.data?.id,
        email: res?.data?.email,
        extensionId: obj.user.extensionId,
      }
      setUser(userData)
      //@ts-ignore
      setExtensionId(userData.extension_id)
      sendMessageToExtension(userData)

      setSuccess("Account created successfully!")
      router.push("/")
    } catch (e: any) {
      console.log(e)
      setError(String(e.response.data.errors[0]))
    }
  }

  const onSubmit = (data: z.infer<typeof RegisterSchema>) => {
    setError("")
    setSuccess("")
    startTransition(() => {
      create({
        user: {
          name: data.name,
          email: data.email,
          password: data.password,
          extensionId: data.extensionId,
        },
      })
    })
  }

  return (
    <CardWrapper
      headerLabel="Create an account"
      backButtonLabel="Already have an account?"
      backButtonHref="/auth/login"
      showSocial
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="John Doe"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="extensionId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Extension ID</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="Extension ID"
                      type="text"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormError message={error} />
          <FormSuccess message={success} />
          <Button disabled={isPending} type="submit" className="w-full">
            Create an account
          </Button>
        </form>
      </Form>
    </CardWrapper>
  )
}
