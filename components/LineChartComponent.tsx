import React from "react"
import { LineChart } from "@mui/x-charts/LineChart"

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
      <p>{x}</p>
      <p>{y}</p>
    </div>
  )
}

const LineChartComponent = ({
  data,
  color,
}: {
  data: {
    domain: string
    total: number
  }[]
  color: string
}) => {
  const convertToMinutes = (seconds: number) => {
    return Math.floor(seconds / 60)
  }

  const sliceDomain = (domain: string) => {
    const maxWords = 5
    const words = domain.split(" ")
    return words.length > maxWords
      ? words.slice(0, maxWords).join(" ") + "..."
      : domain
  }

  const domains = data.map((item) => sliceDomain(item.domain))
  const fullDomains = data.map((item) => item.domain)
  const totals = data.map((item) => Math.ceil(convertToMinutes(item.total)))

  console.log(domains, totals, fullDomains)

  return (
    <div className="relative max-lg:w-full">
      <div
        className={`absolute w-[500px] max-lg:w-full h-[300px] min-w-[500px] rounded-xl ${color} opacity-85`}
      ></div>
      <LineChart
        grid={{ vertical: true }}
        xAxis={[
          {
            data: domains.length === totals.length ? domains : [],
            scaleType: "band",
            dataKey: "domain",
            tickLabelStyle: {
              fill: "white",
              display: "none",
            },
          },
        ]}
        yAxis={[
          {
            scaleType: "linear",
            tickLabelStyle: {
              fill: "white",
            },
          },
        ]}
        series={[
          {
            data: domains.length === totals.length ? totals : [],
            valueFormatter: (v, { dataIndex }) => {
              return `${fullDomains[dataIndex]}: ${v} minutes`
            },
          },
        ]}
        colors={["white"]}
        width={500}
        height={300}
        className="rounded-xl"
        slots={{
          itemContent: CustomItemTooltip,
        }}
      />
    </div>
  )
}

export default LineChartComponent
