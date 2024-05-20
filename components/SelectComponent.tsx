import React from "react"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface SelectComponentProps {
  selectedValue: string
  onChange: (value: string) => void
  options: string[]
}

const SelectComponent: React.FC<SelectComponentProps> = ({
  selectedValue,
  onChange,
  options,
}) => {
  return (
    <Select onValueChange={onChange}>
      <SelectTrigger className="w-[240px]">
        <SelectValue
          placeholder={selectedValue}
          className="text-slate-800 font-bold"
        />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option} className="hover:bg-gray-100" value={option}>
            {option.charAt(0).toUpperCase() + option.slice(1)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

export default SelectComponent
