'use client'

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart'

const data = [
  { day: '01', rate: 92 }, { day: '02', rate: 88 }, { day: '03', rate: 95 },
  { day: '04', rate: 91 }, { day: '05', rate: 89 }, { day: '06', rate: 97 },
  { day: '07', rate: 94 }, { day: '08', rate: 90 }, { day: '09', rate: 93 },
  { day: '10', rate: 96 }, { day: '11', rate: 87 }, { day: '12', rate: 94 },
  { day: '13', rate: 92 }, { day: '14', rate: 95 }, { day: '15', rate: 98 },
  { day: '16', rate: 93 }, { day: '17', rate: 91 }, { day: '18', rate: 89 },
  { day: '19', rate: 94 }, { day: '20', rate: 96 }, { day: '21', rate: 92 },
  { day: '22', rate: 88 }, { day: '23', rate: 95 }, { day: '24', rate: 93 },
  { day: '25', rate: 97 }, { day: '26', rate: 91 }, { day: '27', rate: 94 },
  { day: '28', rate: 90 }, { day: '29', rate: 96 }, { day: '30', rate: 94 },
]

const chartConfig = {
  rate: {
    label: 'Attendance %',
    color: 'hsl(var(--chart-1))',
  },
} satisfies ChartConfig

export function AttendanceChart() {
  return (
    <ChartContainer config={chartConfig} className="h-[220px] w-full">
      <AreaChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
        <defs>
          <linearGradient id="fillRate" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--color-rate)" stopOpacity={0.3} />
            <stop offset="95%" stopColor="var(--color-rate)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
        <XAxis
          dataKey="day"
          tickLine={false}
          axisLine={false}
          tick={{ fontSize: 11 }}
          interval={4}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          tick={{ fontSize: 11 }}
          domain={[80, 100]}
          tickFormatter={(v) => `${v}%`}
        />
        <ChartTooltip content={<ChartTooltipContent indicator="line" />} />
        <Area
          type="monotone"
          dataKey="rate"
          stroke="var(--color-rate)"
          strokeWidth={2}
          fill="url(#fillRate)"
          dot={false}
        />
      </AreaChart>
    </ChartContainer>
  )
}
