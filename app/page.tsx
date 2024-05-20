"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { BarChart3Icon, BookOpenText, TrendingUp } from "lucide-react"

import { useUserDataStore } from "@/lib/store"
import LineChartComponent from "@/components/LineChartComponent"
import RestrictCard from "@/components/RestrictCard"
import SelectComponent from "@/components/SelectComponent"
import SmallCard from "@/components/SmallCard"
import Table from "@/components/Table"
import TimeOutCard from "@/components/TimeOutCard"

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

interface DomainData {
  domain: string
  total: number
}

export default function Home() {
  const user = useUserDataStore((state: any) => state.user)
  const [userWebsites, setUserWebsites] = useState<Website[]>([])
  const [domainChartPeriod, setDomainChartPeriod] = useState("daily")
  const [websiteChartPeriod, setWebsiteChartPeriod] = useState("daily")
  const [domainTablePeriod, setDomainTablePeriod] = useState("daily")
  const [websiteTablePeriod, setWebsiteTablePeriod] = useState("daily")
  const [userDomainsForChart, setUserDomainsForChart] = useState<DomainData[]>(
    []
  )
  const [userDomains, setUserDomains] = useState<DomainData[]>([])
  const [userWebsitesForChart, setUserWebsiteForChart] = useState<Website[]>([])
  const [today, setToday] = useState({ hours: 0, minutes: 0 })
  const [weekly, setWeekly] = useState({ hours: 0, minutes: 0 })
  const [monthly, setMonthly] = useState({ hours: 0, minutes: 0 })

  console.log(user)
  useEffect(() => {
    if (user) {
      getUserStats()
      fetchWebsites(websiteChartPeriod, setUserWebsiteForChart)
      fetchWebsites(websiteTablePeriod, setUserWebsites)
      fetchDomains(domainChartPeriod, setUserDomainsForChart)
      fetchDomains(domainTablePeriod, setUserDomains)
    }
  }, [user])

  useEffect(() => {
    fetchDomains(domainChartPeriod, setUserDomainsForChart)
  }, [domainChartPeriod])

  useEffect(() => {
    fetchWebsites(websiteChartPeriod, setUserWebsiteForChart)
  }, [websiteChartPeriod])

  useEffect(() => {
    fetchDomains(domainTablePeriod, setUserDomains)
  }, [domainTablePeriod])

  useEffect(() => {
    fetchWebsites(websiteTablePeriod, setUserWebsites)
  }, [websiteTablePeriod])

  const fetchDomains = async (
    period: string,
    setter: React.Dispatch<React.SetStateAction<DomainData[]>>
  ) => {
    let endpoint = ""
    switch (period) {
      case "daily":
        endpoint = `https://mysite-1wyv.onrender.com/websites/time_spent_today/${user?.id}`
        break
      case "weekly":
        endpoint = `https://mysite-1wyv.onrender.com/websites/time_spent_past_week/${user?.id}`
        break
      case "monthly":
        endpoint = `https://mysite-1wyv.onrender.com/websites/time_spent_past_month/${user?.id}`
        break
    }
    const { data } = await axios.get(endpoint)
    const filteredData = data.filter(
      (item: Website) => item.time_spent.total > 0
    ) // Filter out items with total time spent 0
    const formattedData = convertToDomain(filteredData)
    setter(formattedData)
  }

  const fetchWebsites = async (
    period: string,
    setter: React.Dispatch<React.SetStateAction<Website[]>>
  ) => {
    let endpoint = ""
    switch (period) {
      case "daily":
        endpoint = `https://mysite-1wyv.onrender.com/websites/time_spent_today/${user?.id}`
        break
      case "weekly":
        endpoint = `https://mysite-1wyv.onrender.com/websites/time_spent_past_week/${user?.id}`
        break
      case "monthly":
        endpoint = `https://mysite-1wyv.onrender.com/websites/time_spent_past_month/${user?.id}`
        break
    }
    const { data } = await axios.get(endpoint)
    const filteredData = data.filter(
      (item: Website) => item.time_spent.total > 0
    ) // Filter out items with total time spent 0
    setter(filteredData)
  }

  const convertToMinutes = (seconds: number) => {
    return Math.floor(seconds / 60)
  }

  const convertToHours = (seconds: number) => {
    return Math.floor(seconds / 3600)
  }

  const getUserStats = async () => {
    const { data } = await axios.get(
      `https://mysite-1wyv.onrender.com/total_time_stats/${user.id}`
    )
    setToday({
      minutes: convertToMinutes(data.total_time_today),
      hours: convertToHours(data.total_time_today),
    })
    setWeekly({
      minutes: convertToMinutes(data.total_time_past_week),
      hours: convertToHours(data.total_time_past_week),
    })
    setMonthly({
      minutes: convertToMinutes(data.total_time_past_month),
      hours: convertToHours(data.total_time_past_month),
    })
  }

  const convertToDomain = (data: Website[]) => {
    const domainMap: { [key: string]: number } = {}

    data.forEach((website) => {
      const domain = getDomainFromURL(website.url)
      if (!domainMap[domain]) {
        domainMap[domain] = website.time_spent.total
      } else {
        domainMap[domain] += website.time_spent.total
      }
    })

    const formattedData: DomainData[] = Object.entries(domainMap).map(
      ([domain, total]) => ({
        domain,
        total,
      })
    )

    return formattedData
  }

  const getDomainFromURL = (url: string) => {
    const domainRegex = /^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:/\n?]+)/im
    const matches = url.match(domainRegex)
    return matches ? matches[1] : "Unknown"
  }

  function getDateOneWeekAgo() {
    const currentDate = new Date()
    const pastDate = new Date(currentDate)
    pastDate.setDate(currentDate.getDate() - 7)

    const year = pastDate.getFullYear()
    const month = String(pastDate.getMonth() + 1).padStart(2, "0") // Ensure two-digit month
    const day = String(pastDate.getDate()).padStart(2, "0") // Ensure two-digit day

    return `${month}/${day}/${year}`
  }

  function getDateOneMonthAgo() {
    const currentDate = new Date()
    const pastDate = new Date(currentDate)
    pastDate.setMonth(currentDate.getMonth() - 1)

    const year = pastDate.getFullYear()
    const month = String(pastDate.getMonth() + 1).padStart(2, "0") // Ensure two-digit month
    const day = String(pastDate.getDate()).padStart(2, "0") // Ensure two-digit day

    return `${month}/${day}/${year}`
  }

  function convertToDomainDataFormat(data: Website[]) {
    console.log("insitde ", data)
    const domainMap: { [key: string]: number } = {}

    data.forEach((website) => {
      const domain = website.url

      console.log(domain)
      if (!domainMap[domain]) {
        domainMap[domain] = website.time_spent.total
      } else {
        domainMap[domain] += website.time_spent.total
      }
    })

    const formattedData: DomainData[] = Object.entries(domainMap).map(
      ([domain, total]) => ({
        domain,
        total,
      })
    )

    return formattedData
  }
  console.log(user)

  return (
    <div className="h-full pl-16 pr-8 ">
      <div className="flex gap-16 flex-wrap py-8">
        <SmallCard
          minutes={today.minutes}
          hrs={today.hours}
          date={new Date().toLocaleDateString("en-us")}
          duration="Today"
          color="bg-zinc-800"
          icon={<TrendingUp size={32} className="stroke-white" />}
        />
        <SmallCard
          hrs={weekly.hours}
          minutes={weekly.minutes}
          date={
            new Date().toLocaleDateString("en-us") + " - " + getDateOneWeekAgo()
          }
          duration="weekly"
          color="bg-blue-400"
          icon={<BarChart3Icon size={32} className="stroke-white" />}
        />
        <SmallCard
          hrs={monthly.hours}
          minutes={monthly.minutes}
          date={
            new Date().toLocaleDateString("en-us") +
            " - " +
            getDateOneMonthAgo()
          }
          duration="Montly"
          color="bg-green-400"
          icon={<BookOpenText size={32} className="stroke-white" />}
        />
        <div className="h-[149px] max-lg:w-full -mt-2 w-[220px] flex flex-col gap-4 rounded-xl bg-white">
          <RestrictCard user={user} />
          <TimeOutCard user={user} />
          <div className="font-bold px-4 text-lg -mt-1 ml-2 text-gray-800">
            Limit Your Acces
          </div>
        </div>
      </div>
      <div className="flex flex-wrap gap-16 mt-10 mb-16">
        <div className=" flex flex-col gap-5 max-lg:w-full min-w-[600px] bg-white w-fit  rounded-xl">
          <div className="px-6 -mt-6">
            <LineChartComponent
              data={userDomainsForChart.slice(0, 6)}
              color="bg-blue-400"
            />
          </div>
          <div className="flex gap-4 mb-8 mt-2">
            <div className="text-slate-800 text-xl font-bold mx-8">
              Top Domains Visited
            </div>
            <SelectComponent
              selectedValue={domainChartPeriod}
              onChange={setDomainChartPeriod}
              options={["daily", "weekly", "monthly"]}
            />
          </div>
        </div>
        <div className=" flex flex-col gap-5 bg-white max-lg:w-full min-w-[600px] w-fit  rounded-xl">
          <div className="px-6 -mt-6">
            <LineChartComponent
              data={convertToDomainDataFormat(userWebsitesForChart).slice(0, 6)}
              color="bg-zinc-800"
            />
          </div>
          <div className="flex gap-4 mb-8 mt-2">
            <div className="text-slate-800 text-xl font-bold mx-8">
              Top Websites Visited
            </div>
            <SelectComponent
              selectedValue={websiteChartPeriod}
              onChange={setWebsiteChartPeriod}
              options={["daily", "weekly", "monthly"]}
            />
          </div>
        </div>
      </div>
      <div className=" flex gap-8 flex-wrap  ">
        <div className="flex flex-col gap-2 h-fit pt-2 min-w-[608px] max-lg:w-full  rounded-xl bg-white">
          <div className="flex justify-between gap-4 mb-2 mt-2 mx-5">
            <div className="text-slate-800 text-xl font-bold ">
              Domains visited Table
            </div>
            <SelectComponent
              selectedValue={domainTablePeriod}
              onChange={setDomainTablePeriod}
              options={["daily", "weekly", "monthly"]}
            />
          </div>
          <Table data={userDomains} domain={true} />
        </div>
        <div className="flex flex-col gap-2 h-fit pt-2 min-w-[608px] mb-20 max-lg:w-full rounded-xl bg-white">
          <div className="flex justify-between gap-4 mb-2 mt-2 mx-5">
            <div className="text-slate-800 text-xl font-bold ">
              Websites Table
            </div>
            <SelectComponent
              selectedValue={websiteTablePeriod}
              onChange={setWebsiteTablePeriod}
              options={["daily", "weekly", "monthly"]}
            />
          </div>
          <Table data={userWebsites} domain={false} />
        </div>
      </div>
    </div>
  )
}
