"use client"

import * as React from "react"
import {
  Area,
  AreaChart as RechartsAreaChart,
  Bar,
  BarChart as RechartsBarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart as RechartsLineChart,
  Pie,
  PieChart as RechartsPieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

import { cn } from "@/lib/utils"

export type ChartConfig = Record<
  string,
  {
    label: string
    color?: string
  }
>

interface ChartContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  config: ChartConfig
  children: React.ReactNode
}

export function ChartContainer({
  config,
  children,
  className,
  ...props
}: ChartContainerProps) {
  return (
    <div className={cn("relative", className)} {...props}>
      <ResponsiveContainer width="100%" height="100%">
        {children}
      </ResponsiveContainer>
    </div>
  )
}

interface ChartTooltipProps extends React.HTMLAttributes<HTMLDivElement> {
  content?: React.ReactNode
  cursor?: boolean
}

export function ChartTooltip({
  content,
  cursor = true,
  ...props
}: ChartTooltipProps) {
  return (
    <Tooltip
      cursor={cursor}
      content={content}
      wrapperStyle={{ outline: "none" }}
      {...props}
    />
  )
}

interface ChartTooltipContentProps extends React.HTMLAttributes<HTMLDivElement> {
  labelFormatter?: (value: string) => string
  indicator?: "dot" | "line"
}

export function ChartTooltipContent({
  labelFormatter,
  indicator = "dot",
  ...props
}: ChartTooltipContentProps) {
  return (
    <div
      className="bg-popover text-popover-foreground rounded-lg border p-3 shadow-sm"
      {...props}
    />
  )
}

export const AreaChart = RechartsAreaChart
export const BarChart = RechartsBarChart
export const LineChart = RechartsLineChart
export const PieChart = RechartsPieChart

export {
  Area,
  Bar,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  Pie,
  XAxis,
  YAxis,
} 