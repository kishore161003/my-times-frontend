"use client"

import React, { useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { LogIn, LogOut, Menu, User } from "lucide-react"

import { useUserDataStore } from "@/lib/store"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const NavBar = () => {
  const [isLogged, setIsLogged] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  const user = useUserDataStore((state: any) => state.user)
  const setUser = useUserDataStore((state: any) => state.setUser)

  return (
    pathname !== "/auth/login" &&
    pathname !== "/auth/register" && (
      <div className="flex  justify-between  bg-white  align-middle min-w-[600px]  px-16 py-5   text-black">
        <div className="flex gap-12 lg:gap-28">
          <div className="flex gap-1  text-lg">
            <img
              src="/logo3.png"
              alt="logo"
              className="object-scale-down w-16 h-16 -mt-3 hover:cursor-pointer"
              onClick={() => router.push("/")}
            />
            <div
              className="text-gray-900 text-3xl font-semibold hover:cursor-pointer mt-0.5 p-0.5"
              onClick={() => router.push("/")}
            >
              My Times{" "}
            </div>
          </div>
        </div>
        {user ? (
          <div className=" max-lg:hidden lg:block flex gap-8 max-lg:text-sm">
            {
              <div className="flex gap-8">
                <div className="flex  gap-2">
                  <div
                    className="font-semibold rounded-xl  border-gray-900  mt-1.5 pl-44 px-3 py-1 hover:cursor-pointer"
                    onClick={() => {
                      router.push("/")
                    }}
                  >
                    Home
                  </div>
                  <div
                    className="font-semibold rounded-xl  border-gray-900  mt-1.5  px-3 py-1 hover:cursor-pointer"
                    onClick={() => {
                      router.push("/restriction")
                    }}
                  >
                    Restriction
                  </div>
                </div>
                <div
                  className="font-semibold rounded-xl  border-gray-900 border mt-1.5 px-3 py-1 hover:cursor-pointer"
                  onClick={() => {
                    setUser(null)
                    router.push("/auth/login")
                  }}
                >
                  Logout
                </div>
              </div>
            }
          </div>
        ) : (
          <div>
            <div
              className="font-semibold rounded-xl max-md:hidden  border-gray-900 border mt-1.5 px-4 py-1 hover:cursor-pointer"
              onClick={() => router.push("/auth/login")}
            >
              Login
            </div>
          </div>
        )}
        <div className="lg:hidden">
          <DropdownMenu>
            <DropdownMenuTrigger className="focus:outline-none focus:border-none mt-2.5">
              <Menu className="cursor-pointer" />
            </DropdownMenuTrigger>
            {user ? (
              <DropdownMenuContent sideOffset={4}>
                <DropdownMenuItem>
                  <DropdownMenuLabel
                    className="cursor-pointer"
                    onClick={() => router.push("/")}
                  >
                    Home
                  </DropdownMenuLabel>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <DropdownMenuLabel
                    className="cursor-pointer"
                    onClick={() => router.push("/restriction")}
                  >
                    Restriction
                  </DropdownMenuLabel>
                </DropdownMenuItem>
                <DropdownMenuSeparator />

                <DropdownMenuItem>
                  <DropdownMenuLabel
                    className="cursor-pointer"
                    onClick={() => {
                      setUser(null)
                      router.push("/auth/login")
                    }}
                  >
                    Logout
                  </DropdownMenuLabel>
                  <DropdownMenuShortcut>
                    <LogOut className="stroke-black" />
                  </DropdownMenuShortcut>
                </DropdownMenuItem>
              </DropdownMenuContent>
            ) : (
              <DropdownMenuContent sideOffset={4}>
                <DropdownMenuItem>
                  <DropdownMenuLabel
                    className="cursor-pointer"
                    onClick={() => router.push("/auth/login")}
                  >
                    Login
                  </DropdownMenuLabel>
                  <DropdownMenuShortcut>
                    <LogIn className="stroke-black" />
                  </DropdownMenuShortcut>
                </DropdownMenuItem>
              </DropdownMenuContent>
            )}
          </DropdownMenu>
        </div>
      </div>
    )
  )
}

export default NavBar
