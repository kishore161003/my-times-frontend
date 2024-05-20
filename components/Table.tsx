import React, { useEffect, useState } from "react"
import { BarChart } from "@mui/x-charts/BarChart"
import { DataGrid } from "@mui/x-data-grid"
import axios from "axios"

import { useUserDataStore } from "@/lib/store"
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

interface Website {
  url: string
  restricted: boolean
  timeout: number
  time_spent: {
    total: number
    details: {
      date: string
      time_spent: number
    }[]
  }
}

interface TableProps {
  data: any[]
  domain: boolean
}

const formatTime = (totalSeconds: number) => {
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  return `${hours}:${minutes < 10 ? "0" : ""}${minutes}:${
    seconds < 10 ? "0" : ""
  }${seconds}`
}

const Table = ({ data, domain }: TableProps) => {
  const [formattedRows, setFormattedRows] = useState<any[]>([])
  const [columns, setColumns] = useState<
    { field: string; headerName: string; width: number }[]
  >([])
  const user = useUserDataStore((state: any) => state.user)

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedWebsite, setSelectedWebsite] = useState("")
  const [selectedDetails, setSelectedDetails] = useState({})

  useEffect(() => {
    const fetchDetailsAndUpdate = async () => {
      if (!selectedWebsite) return // Don't fetch if no website selected

      try {
        const encodedUrl = encodeURIComponent(selectedWebsite)
        let response
        if (domain) {
          console.log("gi")
          response = await axios.get(
            `https://mysite-1wyv.onrender.com/domains/time_spent_past_month/${user?.id}/${encodedUrl}`
          )
        } else {
          console.log("do")
          response = await axios.get(
            `https://mysite-1wyv.onrender.com/websites/time_spent_past_month/${user?.id}/${encodedUrl}`
          )
        }

        const websiteDetails: Website = response.data
        console.log(websiteDetails)
        setSelectedDetails(websiteDetails)
      } catch (error) {
        console.error("Error fetching details:", error)
      }
    }

    fetchDetailsAndUpdate()
  }, [selectedWebsite, domain, user?.id])

  useEffect(() => {
    if (domain) {
      setFormattedRows(formatDomainRows(data))
    } else {
      setFormattedRows(formatWebsiteRows(data))
    }

    if (domain) {
      setColumns([
        { field: "col1", headerName: "No.", width: 80 },
        { field: "col2", headerName: "Domain", width: 300 },
        { field: "col3", headerName: "Total Time Spent", width: 200 },
      ])
    } else {
      setColumns([
        { field: "col1", headerName: "No.", width: 80 },
        { field: "col2", headerName: "Website", width: 300 },
        { field: "col3", headerName: "Total Time Spent", width: 200 },
      ])
    }
  }, [data, domain])

  const formatDomainRows = (data: any[]) => {
    return data.map((item, index) => ({
      id: index + 1,
      col1: index + 1,
      col2: item.domain,
      col3: formatTime(item.total),
    }))
  }

  const formatWebsiteRows = (data: any[]) => {
    return data.map((item, index) => ({
      id: index + 1,
      col1: index + 1,
      col2: item.url,
      col3: formatTime(item.time_spent.total),
    }))
  }
  const fetchDetails = async (urlOrDomain: string) => {
    try {
      const encodedUrl = encodeURIComponent(urlOrDomain)
      if (domain) {
        console.log("gi")
        const response = await axios.get(
          `https://mysite-1wyv.onrender.com/domains/time_spent_past_month/${user?.id}/${encodedUrl}`
        )

        const websiteDetails: Website = response.data
        console.log(websiteDetails)
        setSelectedDetails(websiteDetails)
      } else {
        console.log("do")
        const response = await axios.get(
          `https://mysite-1wyv.onrender.com/websites/time_spent_past_month/${user?.id}/${encodedUrl}`
        )

        const websiteDetails: Website = response.data
        setSelectedDetails(websiteDetails)
      } // Assuming you have a dialog component to show the details
    } catch (error) {
      console.error("Error fetching details:", error)
    }
  }

  const handleRowClick = (params: any) => {
    console.log("hellp")
    const { col2 } = params.row
    setIsDialogOpen(true)
    setSelectedWebsite(col2)
  }

  console.log(selectedDetails)
  return (
    <div className="h-96  w-full">
      <DataGrid
        rows={formattedRows}
        columns={columns}
        className="bg-white px-4 py-2 shadow-md"
        onRowClick={handleRowClick}
      />
      <Dialog open={isDialogOpen} onOpenChange={() => setIsDialogOpen(false)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Details</DialogTitle>
          </DialogHeader>
          <DialogClose onClick={() => setIsDialogOpen(false)} />
          <DialogDescription>
            <BarChart
              grid={{ vertical: true }}
              xAxis={[
                {
                  data:
                    (selectedDetails as Website)?.time_spent?.details.map(
                      (item) => item.date
                    ) || [],
                  scaleType: "band",
                },
              ]}
              series={[
                {
                  data:
                    (selectedDetails as Website)?.time_spent?.details.map(
                      (item) => Math.floor(item.time_spent / 60)
                    ) || [],
                },
              ]}
              slots={{
                itemContent: CustomItemTooltip,
              }}
              yAxis={[
                {
                  label: "Time Spent (minutes)",
                },
              ]}
              colors={["#40ed87"]}
              height={278}
            />
          </DialogDescription>
        </DialogContent>
      </Dialog>
    </div>
  )
}

const CustomItemTooltip = ({ payload }: any) => {
  if (!payload || payload.length === 0) return null

  const { x, y } = payload[0]
  return (
    <div
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        color: "white",
        padding: "8px",
        borderRadius: "4px",
      }}
    >
      <p>Time Spend on {x}</p>
      <p>{y} minutes</p>
    </div>
  )
}

export default Table
