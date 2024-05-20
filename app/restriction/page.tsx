"use client"

import React, { useEffect, useState } from "react"
import CancelIcon from "@mui/icons-material/Close"
import EditIcon from "@mui/icons-material/Edit"
import SaveIcon from "@mui/icons-material/Save"
import Box from "@mui/material/Box"
import axios from "axios"

import { useUserDataStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface Website {
  id: number
  url: string
  restricted: boolean
  timeout: number // Timeout in seconds
  created_at: string
  updated_at: string
  user_id: number
}

const RestrictionTab = () => {
  const [rows, setRows] = useState<Website[]>([])
  const [editingRow, setEditingRow] = useState<Website | null>(null)
  const user = useUserDataStore((state: any) => state.user)
  const [openDialog, setOpenDialog] = useState(false)

  useEffect(() => {
    fetchData()
  }, [user])

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `https://mysite-1wyv.onrender.com/websites/with_restriction_or_timeout/${user?.id}`
      )

      console.log(response.data, user)

      // Convert timeout from seconds to minutes
      const websitesWithTimeoutInMinutes = response.data.map(
        (website: Website) => ({
          ...website,
          timeout: secondsToMinutes(website.timeout),
        })
      )

      setRows(websitesWithTimeoutInMinutes)
    } catch (error) {
      console.error(error)
    }
  }

  const secondsToMinutes = (seconds: number) => seconds / 60
  const minutesToSeconds = (minutes: number) => minutes * 60

  const handleEditClick = (row: Website) => () => {
    setEditingRow(row)
    setOpenDialog(true)
  }

  const handleDialogClose = () => {
    setOpenDialog(false)
    setEditingRow(null)
  }

  const handleSaveClick: React.FormEventHandler<HTMLFormElement> = async (
    event
  ) => {
    event.preventDefault()
    if (editingRow) {
      try {
        // Convert timeout from minutes to seconds before saving
        const timeoutInSeconds = minutesToSeconds(editingRow.timeout)
        const updatedRow = processRowUpdate({
          ...editingRow,
          timeout: timeoutInSeconds,
        })
        await axios.put(
          `https://mysite-1wyv.onrender.com/websites/${updatedRow.id}`,
          updatedRow
        )
        setOpenDialog(false)
        setEditingRow(null)

        // Refetch data to get the latest state from the server
        fetchData()
      } catch (error) {
        console.error(error)
      }
    }
  }

  const processRowUpdate = (newRow: Website) => {
    const updatedRow = { ...newRow, isNew: false }
    setRows((oldRows) =>
      oldRows.map((row) => (row.id === newRow.id ? updatedRow : row))
    )
    return updatedRow
  }

  return (
    <div className="px-20 py-10">
      <Box sx={{ height: 500, width: "100%" }}>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  S.No
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Website
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Restricted
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Timeout (minutes)
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => (
                <tr
                  key={row.id}
                  className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                >
                  <td className="px-6 py-4 whitespace-nowrap">{index + 1}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{row.url}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {row.restricted ? "Yes" : "No"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{row.timeout}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Button variant="secondary" onClick={handleEditClick(row)}>
                      <EditIcon />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Dialog open={openDialog} onOpenChange={handleDialogClose}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Website</DialogTitle>
              <DialogClose />
            </DialogHeader>
            <form onSubmit={handleSaveClick}>
              <DialogDescription>
                <div className="flex flex-col">
                  <label htmlFor="url" className="mb-2">
                    Website URL:
                  </label>
                  <input
                    type="text"
                    className="border rounded px-2 py-1 mb-4"
                    defaultValue={editingRow?.url}
                    name="url"
                    disabled
                  />
                  <label htmlFor="timeout" className="mb-2">
                    Timeout (in minutes):
                  </label>
                  <input
                    type="number"
                    className="border rounded px-2 py-1 mb-4"
                    defaultValue={editingRow?.timeout}
                    onChange={(e) =>
                      //@ts-ignore
                      setEditingRow((prevEditingRow: Website) => ({
                        ...prevEditingRow,
                        timeout: e.target.value,
                      }))
                    }
                    name="timeout"
                  />
                  <label htmlFor="timeout" className="mb-2">
                    Restricted
                  </label>
                  <Select
                    onValueChange={(value) =>
                      //@ts-ignore
                      setEditingRow((prevEditingRow: Website) => ({
                        ...prevEditingRow,
                        restricted: value === "true" ? true : false,
                      }))
                    }
                  >
                    <SelectTrigger
                      value={editingRow?.restricted === true ? "true" : "false"}
                    >
                      <SelectValue
                        placeholder={
                          editingRow?.restricted === true ? "true" : "false"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">True</SelectItem>
                      <SelectItem value="false">False</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button type="submit" className="mt-4">
                    <SaveIcon />
                    Save
                  </Button>
                </div>
              </DialogDescription>
            </form>
          </DialogContent>
        </Dialog>
      </Box>
    </div>
  )
}

export default RestrictionTab
