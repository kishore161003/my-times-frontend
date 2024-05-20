import React from "react"
import axios from "axios"
import { useForm } from "react-hook-form"
import { set } from "zod"

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

const RestrictCard = ({ user }: { user: any }) => {
  const { register, handleSubmit } = useForm()
  const [isOpen, setIsOpen] = React.useState(false)

  const sendData = async (data: any) => {
    console.log(data)
    const res = await axios.post(
      "https://mysite-1wyv.onrender.com/update_restricted_data",
      data
    )
    console.log(res.data)
  }
  const onSubmit = (data: any) => {
    const temp = {
      ...data,
      user_id: user.id,
      restricted: true,
    }
    sendData(temp)
    setIsOpen(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={() => setIsOpen(false)}>
      <div
        className="p-2 text-xl xl:-ml-4 bg-[#ef3e85] text-white rounded-xl px-6 max-lg:-ml-4 w-fit -mt-1  hover:cursor-pointer "
        onClick={() => setIsOpen(true)}
      >
        Restrict Website
      </div>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-xl">Restrict Website</DialogTitle>
          <DialogDescription className="mt-2">
            You can restrict access to the website by providing the Url of the
            website
          </DialogDescription>
          <DialogClose />
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogDescription>
            <div className="flex flex-col">
              <label htmlFor="reason" className="mb-2 ml-2">
                Website URL
              </label>
              <input
                type="text"
                className="border rounded px-2 py-1 mb-4"
                {...register("url", { required: true })}
              />
              <button
                type="submit"
                className="bg-[#ef3e85] text-white px-4 py-2 rounded hover:bg-[#d53774]"
              >
                Restrict Access
              </button>
            </div>
          </DialogDescription>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default RestrictCard
