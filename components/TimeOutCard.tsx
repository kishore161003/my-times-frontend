import React from "react"
import { useRouter } from "next/navigation"
import axios from "axios"
import { useForm } from "react-hook-form"

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

const TimeOutCard = ({ user }: { user: any }) => {
  const { register, handleSubmit } = useForm()
  const [isOpen, setIsOpen] = React.useState(false)

  const router = useRouter()
  console.log(user)
  const sendData = async (data: any) => {
    console.log(data)
    const res = await axios.post(
      "https://mysite-1wyv.onrender.com/update_timeout_data",
      data
    )
    console.log(res.data)
  }

  const onSubmit = (data: any) => {
    console.log(data)
    const temp = {
      ...data,
      timeout: data.timeout * 60,
      user_id: user.id,
    }
    sendData(temp)
    setIsOpen(false) // Close the dialog after form submission
  }

  return (
    <Dialog open={isOpen} onOpenChange={() => setIsOpen(false)}>
      <div
        className="p-2 text-lg xl:-ml-4 bg-blue-400 text-white rounded-lg px-6 w-fit -mt-1 max-lg:-ml-4  hover:cursor-pointer "
        onClick={() => setIsOpen(true)}
      >
        TimeOut Website
      </div>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Set TimeOut on Website</DialogTitle>
          <DialogDescription>
            You can set a time limit to restrict for Daily the time spent on
            this website .
          </DialogDescription>
          <DialogClose />
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogDescription>
            <div className="flex flex-col">
              <label htmlFor="url" className="mb-2">
                Website URL:
              </label>
              <input
                type="text"
                className="border rounded px-2 py-1 mb-4"
                {...register("url", { required: true })}
              />
              <label htmlFor="timeout" className="mb-2">
                Time out (in minutes):
              </label>
              <input
                type="number"
                className="border rounded px-2 py-1 mb-4"
                {...register("timeout", { required: true })}
              />
              <button
                type="submit"
                className="bg-blue-400 text-white px-4 py-2 rounded hover:bg-blue-500"
              >
                Set Timeout
              </button>
            </div>
          </DialogDescription>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default TimeOutCard
