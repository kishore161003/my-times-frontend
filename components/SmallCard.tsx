import React from "react"
import { Apple } from "lucide-react"

const SmallCard = ({
  minutes,
  date,
  duration,
  icon,
  color,
  hrs,
}: {
  minutes: number
  date: string
  duration: string
  icon: any
  color: string
  hrs: number
}) => {
  return (
    <div className="bg-white  rounded-xl p-4 flex min-w-80 max-lg:w-full flex-col gap-3">
      <div className="flex justify-between">
        <div
          className={`${color} h-16 opacity-[0.95] -mt-8 w-16 rounded-xl flex items-center justify-center shadow-xl`}
        >
          {icon}
        </div>
        <div className="flex flex-col items-end gap-1">
          <div className="font-[200]">Total {duration} usage</div>
          <div className="font-bold text-gray-800 mr-2 text-xl">
            {minutes} minutes
          </div>
        </div>
      </div>
      <div className="w-64 ml-1 bg-gradient-to-r from-white via-slate-200 to-white h-[0.1rem] "></div>
      <div className="px-6 font-[200] text-sm">
        <span className="text-lg mr-1 font-bold text-green-600">{hrs}</span>{" "}
        hours on {date}
      </div>
    </div>
  )
}

export default SmallCard
